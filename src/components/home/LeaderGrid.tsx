"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { staggerContainer, fadeUpSmall } from "@/lib/motion";
import { STUDENT_LEADERS, type LeaderFacet, type StudentLeader } from "@/content/student-leaders";

const FACET_MS = 4500;
/** Offset each card's cycle so the grid never flips over all at once. */
const FACET_STAGGER_MS = 700;

/** A facet still carrying the placeholder marker isn't shown to a visitor. */
const isPlaceholder = (value: string) => value.trim() === "" || value.trim().startsWith("◆");

function restingFacets(leader: StudentLeader): LeaderFacet[] {
  return leader.facets.filter((f) => !isPlaceholder(f.value));
}

/**
 * Cycles one facet at a time on a resting card. Name, role, and saint live
 * outside this component and never change — only the line underneath them
 * does. Holds still under prefers-reduced-motion.
 *
 * Renders nothing until real facts arrive: every fun fact, hometown, and major
 * is still a placeholder, so there is nothing to cycle and the card simply
 * ends after the saint. It starts working on its own the moment the team fills
 * any of them in.
 */
function RotatingFacet({ facets, index }: { facets: LeaderFacet[]; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [i, setI] = useState(0);
  const cycles = facets.length > 1 && !prefersReducedMotion;

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
    <div className="mt-2 min-h-[30px]">
      {/* key-based remount, no AnimatePresence/exit — the crossfade is
          cosmetic and must never gate the text actually changing. Same
          convention as DayTabs/NextMassCard (see CLAUDE.md). */}
      <motion.div
        key={`${facet.label}-${i}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <span className="font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-onnavy-dim">
          {facet.label}
        </span>
        <span className="ml-2 text-[12.5px] text-onnavy">{facet.value}</span>
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
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerContainer(0.06)}
      /* Nine people. Three columns divide evenly, which is why the President
         also spans both columns on the two-column phone layout — one wide plus
         eight narrow is five full rows, where nine narrow cards would leave
         the last row holding one person on its own. */
      className="mt-12 grid grid-cols-2 items-stretch gap-4 sm:gap-5 md:grid-cols-3"
    >
      {STUDENT_LEADERS.map((leader, index) => {
        const isOpen = openSlug === leader.slug;
        const isFeatured = index === 0;
        const resting = restingFacets(leader);
        const ordinal = String(index + 1).padStart(2, "0");

        return (
          <motion.div
            key={leader.slug}
            layout
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={cn(
              "min-w-0",
              isFeatured && "col-span-2 md:col-span-1",
              isOpen && "col-span-2"
            )}
          >
            {/* Reveal lives on its own element so it never fights the layout
                animation above it. reveal-pin keeps the card painted on phones
                before hydration — see globals.css. */}
            <motion.div variants={fadeUpSmall} className="reveal-pin h-full">
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : leader.slug)}
                aria-expanded={isOpen}
                className={cn(
                  "group/card relative flex h-full w-full flex-col overflow-hidden rounded-inner border text-left",
                  "transition-[transform,border-color,background-color] duration-300 ease-out",
                  "hover:-translate-y-[3px]",
                  isOpen
                    ? "border-gold-light bg-gold-light/[.07]"
                    : "border-white/15 bg-white/[.03] hover:border-gold-light/55 hover:bg-gold-light/[.06]"
                )}
              >
                <div
                  className={cn(
                    "flex h-full min-h-0",
                    isOpen
                      ? "flex-col sm:flex-row"
                      : isFeatured
                        ? "flex-row md:flex-col"
                        : "flex-col"
                  )}
                >
                  {/* Photo. Always 4:5, in every state — object-cover filling a
                      box of any other ratio throws away image width and clips
                      people out of their own card. */}
                  <div
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden bg-navy-deep",
                      isOpen
                        ? "w-full flex-none sm:w-[46%] sm:self-center"
                        : isFeatured
                          ? "w-[42%] flex-none self-center md:w-full"
                          : "w-full"
                    )}
                  >
                    <Image
                      src={`/leadership/${leader.slug}.webp`}
                      alt={leader.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      className="object-cover transition-transform duration-[600ms] ease-out group-hover/card:scale-[1.05]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(4,22,47,.72))]"
                    />
                    {/* Officer number — the editorial touch that makes the grid
                        read as a roster rather than a photo dump. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-2.5 font-display text-[11px] font-bold tracking-[.2em] text-gold-light/75"
                    >
                      {ordinal}
                    </span>
                    {/* Gold bracket drawn in on hover: two 1px rules scaling
                        from their corner, so it costs nothing to animate. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-2.5 top-2.5 h-5 w-5"
                    >
                      <span className="absolute right-0 top-0 h-px w-full origin-right scale-x-0 bg-gold-light transition-transform duration-300 ease-out group-hover/card:scale-x-100" />
                      <span className="absolute right-0 top-0 h-full w-px origin-top scale-y-0 bg-gold-light transition-transform duration-300 ease-out group-hover/card:scale-y-100" />
                    </span>
                  </div>

                  {/* Details. Role and name are constant in both states.
                      layout="position" matters here: the wrapper animates its
                      width change by scaling, which would otherwise stretch
                      this text horizontally for the length of the transition.
                      Marking the text block position-only makes Framer
                      counter-scale it, so it moves without distorting. */}
                  <motion.div
                    layout="position"
                    className="flex min-h-0 flex-1 flex-col p-4 sm:p-[18px]"
                  >
                    <div className="font-ui text-[9.5px] font-bold uppercase tracking-[.18em] text-gold-light">
                      {leader.role}
                    </div>
                    <div className="mt-1.5 font-display text-[17px] font-bold leading-[1.15] text-ivory">
                      {leader.name}
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block h-px w-7 origin-left bg-gold-light/45 transition-transform duration-300 ease-out group-hover/card:scale-x-[2.4]"
                    />

                    {leader.saint && !isOpen && (
                      <div className="mt-2.5 flex items-start gap-1.5">
                        <span aria-hidden="true" className="mt-[3px] text-[9px] text-gold-light/80">
                          ✦
                        </span>
                        <span className="text-[12.5px] leading-[1.4] text-onnavy">
                          {leader.saint}
                        </span>
                      </div>
                    )}

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
                        {/* The expanded view keeps the placeholders: a visitor
                            never reaches them without deliberately opening a
                            card, and the team needs to see what's missing. */}
                        <FacetList
                          facets={
                            leader.saint
                              ? [
                                  { label: "Confirmation Saint", value: leader.saint },
                                  ...leader.facets,
                                ]
                              : leader.facets
                          }
                        />
                      </div>
                    ) : (
                      <RotatingFacet facets={resting} index={index} />
                    )}

                    <div className="mt-auto pt-3 font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-onnavy-dim transition-colors duration-200 group-hover/card:text-gold-light">
                      {isOpen ? "Close ✦" : "Read more ✦"}
                    </div>
                  </motion.div>
                </div>
              </button>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
