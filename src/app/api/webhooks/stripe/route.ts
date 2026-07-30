import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createPrintfulOrder, type PrintfulOrderItem } from "@/lib/printful";

async function handleStoreOrder(session: Stripe.Checkout.Session) {
  const cart = JSON.parse(session.metadata?.cart ?? "[]") as {
    variantId: string;
    quantity: number;
  }[];

  // Newer Stripe API versions nest shipping under collected_information
  // rather than a top-level shipping_details field.
  const shipping = session.collected_information?.shipping_details ?? session.customer_details;
  if (!shipping?.address) {
    console.error(`Stripe session ${session.id} has no shipping address; cannot fulfill via Printful.`);
    return;
  }

  const items: PrintfulOrderItem[] = cart.map((c) => ({
    sync_variant_id: c.variantId,
    quantity: c.quantity,
  }));

  await createPrintfulOrder({
    externalId: session.id, // Printful dedupes on external_id — safe against Stripe's webhook retries
    recipient: {
      name: shipping.name ?? session.customer_details?.name ?? "Customer",
      address1: shipping.address.line1 ?? "",
      address2: shipping.address.line2 ?? undefined,
      city: shipping.address.city ?? "",
      state_code: shipping.address.state ?? undefined,
      country_code: shipping.address.country ?? "US",
      zip: shipping.address.postal_code ?? "",
      email: session.customer_details?.email ?? undefined,
    },
    items,
  });
}

function handleDonation(session: Stripe.Checkout.Session) {
  // No Printful involvement for donations. Stripe's own receipt email
  // covers confirmation for v1; log for now, wire a notification later if wanted.
  console.log(
    `Donation received: session ${session.id}, tier ${session.metadata?.tierId}, amount ${session.amount_total}`
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new NextResponse("Missing signature or webhook secret", { status: 400 });
  }

  // Raw body is required for Stripe signature verification — do not call
  // request.json() first, it would consume/transform the body.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      if (session.metadata?.source === "store") {
        await handleStoreOrder(session);
      } else if (session.metadata?.source === "give") {
        handleDonation(session);
      }
    } catch (err) {
      console.error(`Failed to process checkout.session.completed for ${session.id}`, err);
      // Return 500 so Stripe retries delivery; Printful's external_id dedupe
      // makes a retried fulfillment call safe.
      return new NextResponse("Fulfillment error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
