"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { STAFF, type StaffMember } from "@/content/staff";
import { cn } from "@/lib/cn";

/**
 * Collapsed bio height. The three bios run from roughly 90 to 250 words, so
 * unclamped they set wildly different card heights and Fr. Hank's — the
 * longest by a factor of three — visually dominates a row it shares. Six lines
 * is enough to read who someone is and decide whether to open the rest.
 */
const CLAMP_LINES = 6;

function StaffCard({ member }: { member: StaffMember }) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  /**
   * Whether the bio is actually longer than the clamp, rather than assuming it
   * is. Measured only while collapsed — expanded, scrollHeight and clientHeight
   * are equal by definition, and reading it then would decide the text fits and
   * remove the control the reader needs to close it again.
   */
  useEffect(() => {
    if (expanded) return;
    const el = bioRef.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight - el.clientHeight > 2);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [expanded]);

  return (
    <StaggerItem className="h-full">
      <article className="flex h-full flex-col rounded-panel border border-border bg-paper p-7 shadow-card sm:p-8">
        {/* Gold ring rather than a bare circle: these are the only circular
            photos on the page, and without it they read as cropped rather than
            framed. The offset paints in the card colour so the ring floats. */}
        <div className="relative h-[124px] w-[124px] flex-none overflow-hidden rounded-full ring-1 ring-gold/45 ring-offset-4 ring-offset-paper">
          <ImagePlaceholder src={member.photo} alt={member.name} sizes="140px" />
        </div>

        <div className="mt-7 font-ui text-[11px] font-semibold uppercase tracking-[.2em] text-orange">
          {member.role}
        </div>
        <div className="mt-2 font-display text-[24px] font-bold leading-[1.15] text-navy-deep">
          {member.name}
        </div>
        <span aria-hidden="true" className="mt-3 block h-px w-8 bg-gold" />

        <p
          ref={bioRef}
          className={cn(
            "mt-4 text-[14.5px] leading-[1.7] text-ink-warm",
            !expanded && "line-clamp-6"
          )}
          style={!expanded ? { WebkitLineClamp: CLAMP_LINES } : undefined}
        >
          {member.bio}
        </p>

        {(overflows || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 self-start font-ui text-[10px] font-semibold uppercase tracking-[.16em] text-orange transition-colors duration-200 hover:text-navy-deep"
          >
            {expanded ? "Read less ✦" : "Read more ✦"}
          </button>
        )}

        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="mt-auto inline-block break-all pt-5 font-ui text-[13px] font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4 transition-colors hover:text-orange"
          >
            {member.email}
          </a>
        )}
      </article>
    </StaggerItem>
  );
}

export function StaffGrid() {
  return (
    /* One column until lg, then three. Deliberately skipping a two-column
       breakpoint: three people across two columns leaves one stranded on its
       own row, which is the exact layout already rejected twice elsewhere. */
    <StaggerGrid className="mt-11 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3 lg:gap-6">
      {STAFF.map((member) => (
        <StaffCard key={member.name} member={member} />
      ))}
    </StaggerGrid>
  );
}
