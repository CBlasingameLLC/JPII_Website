"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { GIVE_TIERS } from "@/content/give-tiers";
import { SITE_CONFIG } from "@/content/site-config";

async function startGiveCheckout(tierId: string, setLoadingId: (id: string | null) => void) {
  setLoadingId(tierId);
  try {
    const res = await fetch("/api/checkout/give", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tierId }),
    });
    if (!res.ok) throw new Error("Checkout session request failed");
    const { url } = await res.json();
    if (url) window.location.href = url;
  } catch {
    setLoadingId(null);
    // In production this should surface a toast; for v1 the failure is silent-safe
    // (the user stays on the page and can retry) rather than throwing.
  }
}

export function Give() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return (
    <section
      id="give"
      className="bg-[image:linear-gradient(180deg,var(--color-navy-deep),var(--color-navy-lift))] px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <SectionEyebrow label="Support" tone="navy" />
          <h2 className="mt-4 font-display text-h2 font-bold leading-[1.15] text-ivory">
            Students can&apos;t fund this. You can.
          </h2>
          <p className="mt-5 max-w-[520px] text-[17px] leading-[1.7] text-onnavy">
            Every retreat scholarship, every Sunday lunch, every hour of campus ministry is
            paid for by alumni, parents, and parishioners who decided this mattered.
          </p>
          {/* The parish's own EasyTithe portal leads, because it is the rail
              the ministry already uses and already trusts. The Stripe tiers
              opposite are a second, faster path for a fixed amount — kept
              visually subordinate so nobody has to work out which is
              "official". */}
          <div className="mt-[34px]">
            <a
              href={SITE_CONFIG.givingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-gold-light px-[30px] py-[17px] font-ui text-[13px] font-bold uppercase tracking-[.12em] text-navy transition-colors duration-150 hover:bg-paper"
            >
              Give Through the Parish ↗
            </a>
            <p className="mt-3 max-w-[420px] text-[13px] leading-[1.6] text-onnavy-dim">
              Opens EasyTithe, the parish&apos;s secure giving page — the same one used for
              Sunday collections. One-time or recurring, and you can direct your gift to campus
              ministry there.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[14px]">
          <div className="font-ui text-[10px] font-semibold uppercase tracking-[.2em] text-onnavy-dim">
            Or give a set amount now
          </div>
          {GIVE_TIERS.map((tier) => (
            <motion.button
              key={tier.id}
              type="button"
              onClick={() => startGiveCheckout(tier.id, setLoadingId)}
              disabled={loadingId !== null}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between gap-5 rounded-inner border border-gold-light/34 p-[24px_28px] text-left transition-colors duration-150 hover:bg-gold-light/[.08] disabled:opacity-60"
            >
              <div>
                <div className="font-display text-[26px] font-bold text-gold-light">
                  {tier.amountLabel}
                </div>
                <div className="mt-[5px] text-[13px] text-onnavy">{tier.description}</div>
              </div>
              {loadingId === tier.id && (
                <span className="font-ui text-xs uppercase text-onnavy-dim">Redirecting…</span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
