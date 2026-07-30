import { NextResponse } from "next/server";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { getAllProducts } from "@/lib/products";

type CheckoutRequestItem = { variantId: string; quantity: number };

/** Server-side lookup so a tampered client-side price never reaches Stripe. */
function resolveLineItems(requested: CheckoutRequestItem[]) {
  const products = getAllProducts();
  return requested.map(({ variantId, quantity }) => {
    const product = products.find((p) => p.variants.some((v) => v.variantId === variantId));
    const variant = product?.variants.find((v) => v.variantId === variantId);
    if (!product || !variant) {
      throw new Error(`Unknown variant: ${variantId}`);
    }
    return { product, variant, quantity: Math.max(1, Math.min(quantity, 20)) };
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requested = body?.items as CheckoutRequestItem[] | undefined;

  if (!requested || requested.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  let resolved;
  try {
    resolved = resolveLineItems(requested);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripe();

  // Cart contents round-trip through Stripe metadata so the fulfillment
  // webhook can reconstruct the order without trusting client-supplied
  // prices. Fine for a small merch cart; a very large cart could exceed
  // metadata's 500-char-per-key limit and would need a server-side cart id
  // lookup instead.
  const cartMetadata = JSON.stringify(
    resolved.map((r) => ({ variantId: r.variant.variantId, quantity: r.quantity }))
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: resolved.map(({ product, variant, quantity }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${product.name} — ${variant.name}`,
          images: product.images.length ? [product.images[0]] : undefined,
        },
        unit_amount: variant.price,
      },
      quantity,
    })),
    metadata: { source: "store", cart: cartMetadata },
    shipping_address_collection: { allowed_countries: ["US"] },
    success_url: `${siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/store/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
