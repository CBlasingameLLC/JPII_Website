import Stripe from "stripe";

function getSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example).");
  }
  return key;
}

let _stripe: Stripe | null = null;

/** Lazily-created server-side Stripe client. Lazy so `next build` doesn't require the env var to be set just to compile. */
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getSecretKey());
  }
  return _stripe;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
