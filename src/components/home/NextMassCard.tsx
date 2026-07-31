"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  formatNextMassIn,
  formatNextMassWhen,
  getChicagoNow,
  isDuringBreak,
  nextSundayMass,
} from "@/lib/time";
import { MINISTRY_BREAKS, SITE_CONFIG, SUNDAY_MASS_TIME } from "@/content/site-config";
import type { LiturgicalSeason } from "@/lib/liturgical";

type NextMassCardProps = {
  /** Server-computed fallback so the card is never empty/wrong pre-hydration. */
  initialWhen: string;
  /** Server-computed (date-based, doesn't need client recomputation like `initialWhen` does). */
  season: LiturgicalSeason;
};

export function NextMassCard({ initialWhen, season }: NextMassCardProps) {
  const [when, setWhen] = useState(initialWhen);
  const [inText, setInText] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const now = getChicagoNow();
      const target = nextSundayMass(now, SUNDAY_MASS_TIME);
      setWhen(formatNextMassWhen(target, now, SUNDAY_MASS_TIME));
      setInText(isDuringBreak(now, MINISTRY_BREAKS) ? null : formatNextMassIn(target, now));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-panel border border-gold-light/40 bg-navy-deep/66 p-[30px] backdrop-blur-[10px] sm:p-8">
      <div className="flex items-center justify-between gap-[11px]">
        <div className="flex items-center gap-[11px]">
          <span className="h-[7px] w-[7px] rounded-full bg-orange" />
          <span className="font-ui text-[10px] font-semibold uppercase tracking-[.22em] text-gold-light">
            Next Student Mass
          </span>
        </div>
        <div className="flex items-center gap-[7px]" title="Current liturgical season">
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ backgroundColor: season.color }}
            aria-hidden="true"
          />
          <span
            className="font-ui text-[10px] font-semibold uppercase tracking-[.18em]"
            style={{ color: season.color }}
          >
            {season.label}
          </span>
        </div>
      </div>
      <div className="mt-4 font-display text-[31px] font-bold leading-[1.15] text-ivory">
        {when}
      </div>
      <div className="mt-2 min-h-[20px] text-sm text-onnavy-dim">
        {/* No AnimatePresence/exit here — see DayTabs.tsx for why gating a
            live-updating value's swap on an exit animation is a staleness
            risk. `key` still forces a normal synchronous re-render each
            tick; `initial`/`animate` is a purely cosmetic crossfade. */}
        {inText && (
          <motion.span
            key={inText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {inText}
          </motion.span>
        )}
      </div>
      <div className="my-[22px] h-px bg-gold-light/28" />
      <div className="flex flex-col gap-3 text-[13px] leading-[1.5] text-onnavy">
        {SITE_CONFIG.heroFacts.map((fact) => (
          <div key={fact} className="flex gap-3">
            <span className="font-bold text-gold-light">&#9670;</span>
            <span>{fact}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
