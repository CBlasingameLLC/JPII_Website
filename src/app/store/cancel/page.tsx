import Link from "next/link";

export default function StoreCancelPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-h2 font-bold text-navy-deep">Checkout canceled</h1>
      <p className="mx-auto mt-4 max-w-[480px] text-body leading-[1.7] text-ink-warm">
        No charge was made. Your cart is still saved if you want to pick up where you left
        off.
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
