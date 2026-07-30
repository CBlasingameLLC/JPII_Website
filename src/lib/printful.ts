const PRINTFUL_BASE_URL = "https://api.printful.com";

function getHeaders(): HeadersInit {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY is not set. Add it to .env.local (see .env.example).");
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }
  return headers;
}

async function printfulFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PRINTFUL_BASE_URL}${path}`, { ...init, headers: getHeaders() });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Printful API error ${res.status} on ${path}: ${text}`);
  }
  return res.json();
}

/** Raw sync-product list, used by scripts/sync-printful.ts at build time — not called on the request path. */
export function listSyncProducts() {
  return printfulFetch<{ result: unknown[] }>("/store/products");
}

export function getSyncProduct(id: string | number) {
  return printfulFetch<{ result: unknown }>(`/store/products/${id}`);
}

export type PrintfulRecipient = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  country_code: string;
  zip: string;
  email?: string;
};

export type PrintfulOrderItem = {
  sync_variant_id: number | string;
  quantity: number;
};

/**
 * Creates a fulfillment order in Printful after a Stripe payment succeeds.
 * `externalId` is the Stripe Checkout Session ID — Printful dedupes orders
 * with a repeated external_id, which matters because Stripe retries webhook
 * delivery on non-2xx responses.
 */
export function createPrintfulOrder(params: {
  externalId: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
}) {
  return printfulFetch<{ result: unknown }>("/orders", {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      recipient: params.recipient,
      items: params.items,
    }),
  });
}
