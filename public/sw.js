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
 *  - Cache-first for hashed static assets (_next/static, /assets, /icons).
 *  - Network-only passthrough (never intercepted) for /api/*, /store/*,
 *    /give/* — a stale service worker sitting between the browser and a
 *    Stripe Checkout redirect or a live cart/checkout call is a known
 *    footgun, and those routes should fail visibly offline rather than
 *    silently serve stale state.
 *  - Everything else: network-first, falling back to cache when offline.
 */

const CACHE_NAME = "jpii-shell-v1";
const SHELL_URLS = ["/", "/manifest.webmanifest"];

const NEVER_CACHE_PREFIXES = ["/api/", "/store", "/give"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isNeverCache(pathname) {
  return NEVER_CACHE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isStaticAsset(pathname) {
  return pathname.startsWith("/_next/static/") || pathname.startsWith("/assets/") || pathname.startsWith("/icons/");
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;
  if (isNeverCache(url.pathname)) return; // let it go straight to the network, untouched

  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return res;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/")))
  );
});
