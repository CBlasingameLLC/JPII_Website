"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getChicagoNow, isDuringBreak } from "@/lib/time";
import { adorationStatus, occurrenceStatus, type OccurrenceStatus } from "@/lib/liturgy-status";
import { CONFESSION_WINDOWS, MASS_WINDOWS, MINISTRY_BREAKS } from "@/content/site-config";
import type { LiturgicalSeason } from "@/lib/liturgical";
import { cn } from "@/lib/cn";
import { TiltCard } from "@/components/ui/TiltCard";

type NextMassCardProps = {
  /** Server-computed so the card is never empty/wrong pre-hydration, including the "happening now" case. */
  initialMass: OccurrenceStatus;
  initialConfession: OccurrenceStatus;
  initialAdoration: OccurrenceStatus;
  season: LiturgicalSeason;
};

function BulletLine({ label, status }: { label: string; status: OccurrenceStatus }) {
  const text = status.happeningNow
    ? `${label} is happening now${status.secondary ? ` — ${status.secondary.toLowerCase()}` : ""}`
    : `${label}: ${status.primary}`;

  return (
    <div className="flex gap-3">
      <span
        className={cn("mt-[3px] h-[7px] w-[7px] flex-none rounded-full", status.happeningNow ? "bg-orange" : "bg-gold-light")}
        aria-hidden="true"
      />
      <span>{text}</span>
    </div>
  );
}

export function NextMassCard({ initialMass, initialConfession, initialAdoration, season }: NextMassCardProps) {
  const [mass, setMass] = useState(initialMass);
  const [confession, setConfession] = useState(initialConfession);
  const [adoration, setAdoration] = useState(initialAdoration);
  const [suppressCountdown, setSuppressCountdown] = useState(false);

  useEffect(() => {
    function tick() {
      const now = getChicagoNow();
      setMass(occurrenceStatus(now, MASS_WINDOWS, "Mass is happening now"));
      setConfession(occurrenceStatus(now, CONFESSION_WINDOWS, "Confession is happening now"));
      setAdoration(adorationStatus(now));
      setSuppressCountdown(isDuringBreak(now, MINISTRY_BREAKS));
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <TiltCard>
      <div className="rounded-panel border border-gold-light/40 bg-navy-deep/60 p-[30px] shadow-[inset_0_1px_0_rgba(255,255,255,.22)] backdrop-blur-[22px] sm:p-8">
        <div className="flex items-center justify-between gap-[11px]">
          <div className="flex items-center gap-[11px]">
            <motion.span
              className={cn("h-[7px] w-[7px] rounded-full", mass.happeningNow ? "bg-orange" : "bg-gold-light")}
              animate={mass.happeningNow ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
              transition={mass.happeningNow ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
            />
            <span className="font-ui text-[10px] font-semibold uppercase tracking-[.22em] text-gold-light">
              {mass.happeningNow ? "Mass — Live Now" : "Next Student Mass"}
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
          {mass.primary}
        </div>
        <div className="mt-2 min-h-[20px] text-sm text-onnavy-dim">
          {/* No AnimatePresence/exit here — see DayTabs.tsx for why gating a
              live-updating value's swap on an exit animation is a staleness
              risk. `key` still forces a normal synchronous re-render each
              tick; `initial`/`animate` is a purely cosmetic crossfade. */}
          {!suppressCountdown && (
            <motion.span
              key={mass.secondary}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {mass.secondary}
            </motion.span>
          )}
        </div>
        <div className="my-[22px] h-px bg-gold-light/28" />
        <div className="flex flex-col gap-3 text-[13px] leading-[1.5] text-onnavy">
          <BulletLine label="Confession" status={confession} />
          <BulletLine label="Adoration" status={adoration} />
        </div>
      </div>
    </TiltCard>
  );
}
