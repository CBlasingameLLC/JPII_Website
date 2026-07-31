"use client";

/** Newsletter provider not chosen yet (per handoff README) — non-functional placeholder until wired to an ESP. */
export function NewsletterForm() {
  return (
    <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder="you@patriots.uttyler.edu"
        className="min-w-0 flex-1 rounded-pill border border-white/22 bg-white/8 px-[18px] py-3 font-ui text-[13px] text-ivory placeholder:text-onnavy-dim"
      />
      <button
        type="submit"
        className="rounded-pill bg-orange px-5 py-3 font-ui text-xs font-bold uppercase tracking-[.1em] text-ivory transition-colors duration-150 hover:bg-gold-light hover:text-navy"
      >
        Join
      </button>
    </form>
  );
}
