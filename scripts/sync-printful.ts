/**
 * Syncs the Printful store catalog into src/content/products.generated.json
 * at build time. Run manually (`npm run sync:printful`) whenever the
 * Printful catalog changes — new product, retired product, price change.
 * Not called on the request path: store pages read the generated JSON, and
 * only the Stripe webhook talks to Printful live (for order fulfillment).
 *
 * Requires PRINTFUL_API_KEY (and optionally PRINTFUL_STORE_ID) in .env.local.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

type PrintfulSyncProductSummary = { id: number; name: string };

type PrintfulSyncVariant = {
  id: number;
  name: string;
  retail_price: string;
  product?: { image?: string };
};

type PrintfulSyncProductDetail = {
  sync_product: { id: number; name: string; thumbnail_url?: string };
  sync_variants: PrintfulSyncVariant[];
};

const PRINTFUL_BASE_URL = "https://api.printful.com";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function headers(): HeadersInit {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY is not set — add it to .env.local before running this script.");
  }
  const h: Record<string, string> = { Authorization: `Bearer ${apiKey}` };
  if (process.env.PRINTFUL_STORE_ID) h["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  return h;
}

async function main() {
  const listRes = await fetch(`${PRINTFUL_BASE_URL}/store/products`, { headers: headers() });
  if (!listRes.ok) {
    throw new Error(`Failed to list Printful products: ${listRes.status} ${await listRes.text()}`);
  }
  const { result: summaries } = (await listRes.json()) as { result: PrintfulSyncProductSummary[] };

  const products = [];
  for (const summary of summaries) {
    const detailRes = await fetch(`${PRINTFUL_BASE_URL}/store/products/${summary.id}`, {
      headers: headers(),
    });
    if (!detailRes.ok) {
      console.warn(`Skipping product ${summary.id} (${summary.name}): ${detailRes.status}`);
      continue;
    }
    const { result } = (await detailRes.json()) as { result: PrintfulSyncProductDetail };
    const { sync_product, sync_variants } = result;

    products.push({
      productId: String(sync_product.id),
      slug: slugify(sync_product.name),
      name: sync_product.name,
      description: sync_product.name,
      images: [sync_product.thumbnail_url].filter(Boolean),
      variants: sync_variants.map((v) => ({
        variantId: String(v.id),
        name: v.name,
        price: Math.round(parseFloat(v.retail_price) * 100),
        inStock: true,
      })),
    });
  }

  const outPath = path.join(process.cwd(), "src/content/products.generated.json");
  await writeFile(outPath, JSON.stringify(products, null, 2) + "\n", "utf-8");
  console.log(`Wrote ${products.length} product(s) to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
