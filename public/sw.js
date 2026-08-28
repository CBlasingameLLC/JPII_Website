/**
 * Hand-rolled service worker (not next-pwa/Workbox): Next.js 16 defaults
 * `next build` to Turbopack, and next-pwa's service-worker generation runs
 * through a webpack plugin — it would silently not run under the default
 * Turbopack production build. A small explicit worker avoids that
 * dependency entirely and keeps full control over what's safe to cache.
 *
 * Strategy:
 *  - Precache a minimal app shell so the homepage's static content (Mass
 *    times, schedule, nav chrome) is available offline.
 *  - Navigations: network first, but only for NAV_TIMEOUT_MS. An installed
 *    PWA opened on a weak connection otherwise sits on a blank frame for as
 *    long as the request takes; falling back to the cached shell means it
 *    always paints something quickly.
 *  - Cache-first for hashed static assets (_next/static, /assets, /icons).
 *  - Network-only passthrough (never intercepted) for /api/*, /store/*,
 *    /give/* — a stale service worker sitting between the browser and a
 *    Stripe Checkout redirect or a live cart/checkout call is a known
 *    footgun, and those routes should fail visibly offline rather than
 *    silently serve stale state.
 *  - React Server Component payloads are never cached. They are requested at
 *    the same URL as the page itself and differ only by header, so a cached
 *    one gets replayed for the wrong navigation and the router renders a
 *    stale or mismatched tree.
 *  - Everything else: network-first, falling back to cache when offline.
 */

const CACHE_NAME = "jpii-shell-v2";
const SHELL_URLS = ["/", "/manifest.webmanifest"];

const NEVER_CACHE_PREFIXES = ["/api/", "/store", "/give"];
const NAV_TIMEOUT_MS = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  // Deliberately no clients.claim(). Claiming lets a worker take over a page
  // that already started loading uncontrolled, so its remaining requests
  // change strategy midway through the load — which showed up as a stutter on
  // first visit. Without it this worker controls from the next navigation on,
  // which is when its cache is warm and useful anyway.
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

function isNeverCache(pathname) {
  return NEVER_CACHE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isStaticAsset(pathname) {
  return pathname.startsWith("/_next/static/") || pathname.startsWith("/assets/") || pathname.startsWith("/icons/");
}

function isRscRequest(request, url) {
  return url.searchParams.has("_rsc") || request.headers.get("RSC") === "1";
}

function putInCache(request, response) {
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
}

/** Network, but give up waiting after `ms` and let the caller fall back. */
function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;
  if (isNeverCache(url.pathname)) return; // let it go straight to the network, untouched
  if (isRscRequest(event.request, url)) return;

  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((res) => {
            putInCache(event.request, res);
            return res;
          })
      )
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetchWithTimeout(event.request, NAV_TIMEOUT_MS)
        .then((res) => {
          putInCache(event.request, res);
          return res;
        })
        .catch(() =>
          caches
            .match(event.request)
            .then((cached) => cached || caches.match("/"))
            .then((cached) => cached || Response.error())
        )
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        putInCache(event.request, res);
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
