"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { STUDENT_LEADERS, type LeaderFacet, type StudentLeader } from "@/content/student-leaders";

const FACET_MS = 4500;
/** Offset each card's cycle so the grid never flips over all at once. */
const FACET_STAGGER_MS = 700;

function usableFacets(leader: StudentLeader): LeaderFacet[] {
  return leader.facets.filter((f) => f.value.trim() !== "");
}

/**
 * Cycles one facet at a time on a resting card. Name and role live outside
 * this component and never change — only the line underneath them does.
 * Holds still while the card is open (the expanded view lists every facet
 * anyway) and under prefers-reduced-motion.
 */
function RotatingFacet({
  facets,
  index,
  paused,
}: {
  facets: LeaderFacet[];
  index: number;
  paused: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const cycles = facets.length > 1 && !paused && !prefersReducedMotion;

  useEffect(() => {
    if (!cycles) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => setI((n) => n + 1), FACET_MS);
    }, (index % 5) * FACET_STAGGER_MS);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [cycles, index]);

  if (facets.length === 0) return null;
  const facet = facets[i % facets.length];

  return (
    <div className="mt-2 min-h-[34px]">
      {/* key-based remount, no AnimatePresence/exit — the crossfade is
          cosmetic and must never gate the text actually changing. Same
          convention as DayTabs/NextMassCard (see CLAUDE.md). */}
      <motion.div
        key={`${facet.label}-${i}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-gold-light/70">
          {facet.label}
        </div>
        <div className="mt-[3px] truncate text-[13px] leading-[1.4] text-onnavy">{facet.value}</div>
      </motion.div>
    </div>
  );
}

function FacetList({ facets }: { facets: LeaderFacet[] }) {
  if (facets.length === 0) return null;
  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
      {facets.map((f) => (
        <div key={f.label}>
          <dt className="font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-gold-light/70">
            {f.label}
          </dt>
          <dd className="mt-[2px] text-[13px] leading-[1.45] text-onnavy">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LeaderGrid() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="mt-12 grid grid-cols-2 items-stretch gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {STUDENT_LEADERS.map((leader, index) => {
        const isOpen = openSlug === leader.slug;
        const facets = usableFacets(leader);

        return (
          <motion.div
            key={leader.slug}
            layout
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={cn("min-w-0", isOpen && "col-span-2")}
          >
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : leader.slug)}
              aria-expanded={isOpen}
              className={cn(
                "group flex h-full w-full flex-col overflow-hidden rounded-inner border text-left transition-colors duration-200",
                isOpen
                  ? "border-gold-light bg-gold-light/[.07]"
                  : "border-white/20 bg-white/[.03] hover:border-gold-light hover:bg-gold-light/[.07]"
              )}
            >
              <div className={cn("flex h-full min-h-0", isOpen ? "flex-col sm:flex-row" : "flex-col")}>
                {/* Photo. Always 4:5, in both states.
                    It used to stretch to the card's full height when open,
                    which sounds harmless but isn't: object-cover then fills a
                    tall narrow box from a 4:5 source and throws away ~38% of
                    the image's width, clipping people out of their own card.
                    Widening the column doesn't rescue it — even at half the
                    card, a quarter of the width is still lost. Holding the
                    aspect and centring it vertically instead crops nothing;
                    the space above and below is just card. */}
                <div
                  className={cn(
                    "relative aspect-[4/5] w-full overflow-hidden bg-navy-deep",
                    isOpen && "flex-none sm:w-[46%] sm:self-center"
                  )}
                >
                  <Image
                    src={`/leadership/${leader.slug}.webp`}
                    alt={leader.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(4,22,47,.55))]"
                  />
                </div>

                {/* Details. Name and role are constant in both states.
                    layout="position" matters here: the wrapper animates its
                    width change by scaling, which would otherwise stretch this
                    text horizontally for the length of the transition. Marking
                    the text block position-only makes Framer counter-scale it,
                    so it moves without distorting. */}
                <motion.div
                  layout="position"
                  className="flex min-h-0 flex-1 flex-col p-4 sm:p-[18px]"
                >
                  <div className="font-display text-[17px] font-bold leading-tight text-ivory">
                    {leader.name}
                  </div>
                  <div className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-gold-light">
                    {leader.role}
                  </div>

                  {isOpen ? (
                    <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
                      <p className="text-[13px] leading-[1.6] text-onnavy">{leader.bio}</p>
                      {leader.longBio && (
                        <p className="mt-3 text-[13px] leading-[1.6] text-onnavy-dim">
                          {leader.longBio}
                        </p>
                      )}
                      {leader.verse && (
                        <figure className="mt-4 border-l-2 border-gold-light/40 pl-3">
                          <blockquote className="font-accent text-[15px] italic leading-[1.5] text-ivory">
                            {leader.verse.text}
                          </blockquote>
                          <figcaption className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-gold-light/80">
                            {leader.verse.reference}
                          </figcaption>
                        </figure>
                      )}
                      <FacetList facets={facets} />
                    </div>
                  ) : (
                    <RotatingFacet facets={facets} index={index} paused={false} />
                  )}

                  <div className="mt-3 font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-onnavy-dim">
                    {isOpen ? "Close ✦" : "Read more ✦"}
                  </div>
                </motion.div>
              </div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
