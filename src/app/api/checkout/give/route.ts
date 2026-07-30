import { NextResponse } from "next/server";
import { getSiteUrl, getStripe } from "@/lib/stripe";
import { GIVE_TIERS } from "@/content/give-tiers";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const tierId = body?.tierId as string | undefined;
  const tier = GIVE_TIERS.find((t) => t.id === tierId);

  if (!tier) {
    return NextResponse.json({ error: "Unknown give tier" }, { status: 400 });
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: tier.interval === "monthly" ? "subscription" : "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Gift to John Paul II Catholic Campus Ministry — ${tier.description}`,
          },
          unit_amount: tier.amountCents,
          ...(tier.interval === "monthly" ? { recurring: { interval: "month" } } : {}),
        },
        quantity: 1,
      },
    ],
    metadata: { source: "give", tierId: tier.id },
    success_url: `${siteUrl}/give/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/give/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
