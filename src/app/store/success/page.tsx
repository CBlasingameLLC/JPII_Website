import Link from "next/link";
import { ClearCartOnMount } from "@/components/store/ClearCartOnMount";
import { getStripe } from "@/lib/stripe";

export default async function StoreSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let confirmed = false;

  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      confirmed = session.payment_status === "paid";
    } catch {
      confirmed = false;
    }
  }

  return (
    <div className="py-20 text-center">
      <ClearCartOnMount />
      <h1 className="font-display text-h2 font-bold text-navy-deep">
        {confirmed ? "Order confirmed" : "Thank you"}
      </h1>
      <p className="mx-auto mt-4 max-w-[480px] text-body leading-[1.7] text-ink-warm">
        {confirmed
          ? "Your order is on its way to fulfillment. A receipt is on its way to your email."
          : "We're finalizing your order — check your email for a receipt shortly."}
      </p>
      <Link
        href="/store"
        className="mt-8 inline-block rounded-pill bg-orange px-8 py-3 font-ui text-sm font-bold uppercase tracking-[.1em] text-paper transition-colors hover:bg-navy"
      >
        Back to Store
      </Link>
    </div>
  );
}
