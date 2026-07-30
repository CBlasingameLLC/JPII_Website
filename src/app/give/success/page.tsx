import Link from "next/link";

export default function GiveSuccessPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-h2 font-bold text-navy-deep">
        Thank you for supporting JPII
      </h1>
      <p className="mx-auto mt-4 max-w-[480px] text-body leading-[1.7] text-ink-warm">
        Your gift directly funds retreats, Sunday lunches, and campus ministry. A receipt is
        on its way from Stripe.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-pill bg-orange px-8 py-3 font-ui text-sm font-bold uppercase tracking-[.1em] text-paper transition-colors hover:bg-navy"
      >
        Back to Home
      </Link>
    </div>
  );
}
