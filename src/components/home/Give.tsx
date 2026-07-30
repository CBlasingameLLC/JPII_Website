"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { Pill } from "@/components/ui/Pill";
import { GIVE_TIERS } from "@/content/give-tiers";

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
  const monthlyTier = GIVE_TIERS.find((t) => t.interval === "monthly") ?? GIVE_TIERS[0];
  const oneTimeTier = GIVE_TIERS.find((t) => t.interval === "one_time") ?? GIVE_TIERS[0];

  return (
    <section
      id="give"
      className="bg-[linear-gradient(180deg,#061E45,#0A2A5E)] px-5 py-16 sm:px-gutter lg:py-section-y"
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
          <div className="mt-[34px] flex flex-wrap gap-[14px]">
            <Pill
              variant="gold"
              onClick={() => startGiveCheckout(monthlyTier.id, setLoadingId)}
              disabled={loadingId !== null}
            >
              {loadingId === monthlyTier.id ? "Redirecting…" : "Give Monthly"}
            </Pill>
            <Pill
              variant="ghost"
              onClick={() => startGiveCheckout(oneTimeTier.id, setLoadingId)}
              disabled={loadingId !== null}
            >
              {loadingId === oneTimeTier.id ? "Redirecting…" : "One-Time Gift"}
            </Pill>
          </div>
        </div>

        <div className="flex flex-col gap-[14px]">
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
