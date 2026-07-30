"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScheduleCards } from "@/components/home/ScheduleCards";
import type { ScheduleDay } from "@/types/schedule";
import { cn } from "@/lib/cn";

type DayTabsProps = {
  schedule: ScheduleDay[];
  initialActiveIndex: number;
};

/**
 * Server-rendered with `initialActiveIndex` already resolved (today's
 * Chicago weekday, falling back to Sunday on Saturdays), so the first paint
 * — with or without JS — already shows real, readable schedule cards. This
 * component only adds the ability to swap days after hydration.
 */
export function DayTabs({ schedule, initialActiveIndex }: DayTabsProps) {
  const [active, setActive] = useState(initialActiveIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const tab = tabRefs.current[active];
    if (!container || !tab) return;
    // Direct scrollLeft assignment per the design handoff — not scrollIntoView,
    // which can visibly jump the whole page on load.
    const target = tab.offsetLeft - (container.clientWidth - tab.clientWidth) / 2;
    container.scrollLeft = Math.max(0, target);
  }, [active]);

  return (
    <div>
      <div
        ref={containerRef}
        className="flex flex-nowrap gap-1.5 overflow-x-auto border-b border-border-soft [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {schedule.map((day, i) => (
          <button
            key={day.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            onClick={() => setActive(i)}
            className="flex min-h-11 flex-none flex-col items-center px-[22px] text-center transition-opacity duration-150 hover:opacity-75"
          >
            <span
              className={cn(
                "block pb-[14px] font-ui text-[13px] font-bold uppercase tracking-[.14em] text-navy-deep"
              )}
            >
              {day.label}
            </span>
            <span className="relative block h-[3px] w-full">
              {active === i && (
                <motion.span
                  layoutId="day-tab-active-bar"
                  className="absolute inset-0 rounded-t-[3px] bg-orange"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/*
        Deliberately not wrapped in AnimatePresence with an exit animation:
        gating the swap on an exit animation completing (mode="wait") means
        content stays stuck on the old day if animation frames stall for any
        reason (throttled rAF, low-power mode, etc.) — a correctness risk
        for the one interaction the README calls a hard requirement. The
        `key` change below still gives React's normal synchronous
        unmount/remount, so content is always correct; `initial`/`animate`
        (no `exit`) layers a purely cosmetic fade on top.
      */}
      <motion.div
        key={schedule[active].key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.12 }}
      >
        <ScheduleCards items={schedule[active].items} />
      </motion.div>
    </div>
  );
}
