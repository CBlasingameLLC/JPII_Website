# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # Turbopack dev server, http://localhost:3000
npm run build             # production build (Turbopack by default in Next 16)
npm run start              # serve the production build
npm run lint                 # eslint . (flat config, eslint-config-next)
npx tsc --noEmit               # typecheck (no dedicated script; project has no test runner)
npm run sync:printful       # pulls the live Printful catalog into src/content/products.generated.json
npm run generate:icons        # regenerates public/icons/*.png from public/assets/favicon.svg
```

There is no test suite configured. Verification is build + typecheck + lint + manual browser checks.

`.env.local` (gitignored) needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `PRINTFUL_API_KEY`, `PRINTFUL_STORE_ID` — see `.env.example`. Routes that call `getStripe()`/`getPrintfulOrder`-style helpers throw a clear error at request time if the corresponding env var is missing, rather than failing silently.

## Architecture

### Design system source of truth

This is a from-scratch rebuild of a design handoff that lives one directory up, at `../design_handoff_jpii_website/` (`README.md`, `tokens.css`, `Website Draft.dc.html`). That handoff is the authority for every color, spacing, and type value — `src/app/globals.css`'s `@theme` block is a direct translation of `tokens.css` into Tailwind v4's CSS-first theme (this project has **no `tailwind.config.ts`**; Tailwind v4 config is CSS-native). If a pixel value looks wrong, check the handoff before changing it.

### Content layer — no CMS

`src/content/*.ts` are plain typed data modules (schedule, events, give tiers, site config), edited directly rather than through a CMS. Unconfirmed facts (address, phone, Mass times, event dates) are marked with a literal `◆` character in the string value itself — this is intentional per the original design spec ("deliberately ugly so it can't ship silently"). Don't strip `◆` markers when editing content; only remove them once real data replaces the placeholder.

`src/content/products.generated.json` is a build artifact of `scripts/sync-printful.ts`, not hand-edited — it's checked in with sample placeholder products so the store renders before a real Printful sync has been run.

### Homepage composition

`src/app/page.tsx` composes `src/components/home/*` section components in document order (Hero, ThisWeek, Events, GetInvolved, About, NewHere, Give). Every section except Hero is wrapped in `components/ui/MotionSection.tsx` for scroll-reveal; Hero animates its own copy on mount via `HeroCopy.tsx` instead (above the fold, not scroll-triggered).

Two sections have real interactivity, split server/client so content works without JS:

- **`ThisWeek.tsx`** (server) computes today's schedule index server-side via `lib/time.ts` (pinned to America/Chicago, Saturday falls back to Sunday) and passes it into **`DayTabs.tsx`** (client), which owns the click-to-swap state. The server-rendered HTML already contains real content for today before any hydration.
- **`NextMassCard.tsx`** (client) takes a server-computed fallback string as its initial prop, then recomputes every 30s on the client — also via `lib/time.ts`'s Chicago-pinned helpers, and suppressed during `MINISTRY_BREAKS` date ranges from `content/site-config.ts`.

**Gotcha already hit once:** don't wrap either of these in `AnimatePresence mode="wait"` with an `exit` animation. If animation frames ever stall, the exit never resolves and the old content stays stuck on screen indefinitely — a real bug found during manual testing (day-tab clicks silently did nothing). Both components now use plain `key`-based remounts (`initial`/`animate` only, no `exit`, no `AnimatePresence`) so React's synchronous reconciliation guarantees correct content regardless of animation timing; the fade is purely cosmetic. `CartDrawer.tsx`/`MobileNav.tsx` still use `AnimatePresence` with `exit` — that's fine there, since a slow-to-close panel is a cosmetic issue, not a data-correctness one.

### Store: Printful + Stripe

- **Product data is synced at build time**, not fetched live on the request path. `scripts/sync-printful.ts` writes `src/content/products.generated.json`; store pages read that file via `lib/products.ts`. Only the fulfillment webhook talks to Printful live.
- **Cart** is a plain React Context + `useReducer` (`lib/cart.ts`, `components/store/CartProvider.tsx`), persisted to `localStorage`. No external state library.
- **Checkout routes never trust client-supplied prices.** `app/api/checkout/store/route.ts` re-resolves each `variantId` against `products.generated.json` server-side before building the Stripe line items. `app/api/checkout/give/route.ts` does the same against `content/give-tiers.ts`.
- **One shared webhook**, `app/api/webhooks/stripe/route.ts`, handles both flows — it branches on `session.metadata.source` (`"store"` vs `"give"`). Only the store branch calls Printful (`lib/printful.ts`), using the Stripe session ID as Printful's `external_id` so retried webhook deliveries don't double-fulfill.
- `app/store/layout.tsx` and `app/give/layout.tsx` each render their own `Header`/`Footer` (light header variant) and wrap their subtree in `CartProvider`/`CartDrawer` where relevant — the root `app/layout.tsx` intentionally has no header/footer, only fonts, `MotionConfig`, and service worker registration, since the homepage needs the dark header variant and interior pages need the light one.

### PWA

`public/sw.js` is a hand-rolled service worker, not `next-pwa`/Workbox — Next.js 16 defaults `next build` to Turbopack, and `next-pwa`'s service-worker generation runs through a webpack plugin that Turbopack builds skip. The worker explicitly passes through `/api/*`, `/store*`, `/give*` untouched (never cached) to avoid interfering with Stripe Checkout redirects. Icons in `public/icons/` are generated from `public/assets/favicon.svg` by `scripts/generate-pwa-icons.mjs` (uses `sharp`, a devDependency) — rerun that script if the favicon changes.

### Known Next.js 16 API shapes worth remembering

- `params`/`searchParams` in pages and route handlers are `Promise`s — always `await` them (see `app/store/[slug]/page.tsx`, `app/store/success/page.tsx`).
- The installed Stripe SDK models Checkout Session shipping under `session.collected_information.shipping_details`, not the older top-level `session.shipping_details`.
