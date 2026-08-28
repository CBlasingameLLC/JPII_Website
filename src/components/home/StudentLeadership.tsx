import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { LeaderGrid } from "@/components/home/LeaderGrid";
import { STUDENT_LEADERS } from "@/content/student-leaders";

/**
 * The roster section. It now sits between two light sections rather than
 * against another navy one, so it can afford to be the deepest, most composed
 * moment on the page instead of blending into its neighbour: a graded ground
 * rather than flat navy, a gold hairline framing the header, and a single soft
 * gold bloom behind the grid.
 *
 * The bloom is one static radial gradient, not an animated layer — this
 * section already carries nine images and an expanding card, and the page's
 * scroll performance is not worth a decorative glow.
 */
export function StudentLeadership() {
  return (
    <section
      id="leadership"
      className="relative overflow-hidden bg-[image:linear-gradient(180deg,var(--color-navy-black),var(--color-navy-deep)_45%,var(--color-navy-black))] px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[18%] h-[70%] bg-[radial-gradient(60%_50%_at_50%_40%,rgba(231,200,119,.09),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-site">
        <SectionEyebrow label="Student Leadership" tone="navy" ruleClassName="flex-1" />

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <h2 className="max-w-[560px] font-display text-h2 font-bold leading-[1.12] text-ivory">
              Run by students, for students
            </h2>
            <p className="mt-4 max-w-[520px] text-[17px] leading-[1.65] text-onnavy">
              Every one of these people was a first-time visitor once. Now they run the place. Tap
              anyone to read more about them.
            </p>
          </div>

          {/* Officer count, set as a small standing figure — gives the header a
              second anchor on wide screens and quietly says how many people
              this actually takes. */}
          <div className="flex flex-none items-end gap-4 lg:pb-1">
            <span className="font-display text-[46px] font-bold leading-none text-gold-light">
              {STUDENT_LEADERS.length}
            </span>
            <span className="max-w-[120px] pb-1 font-ui text-[10px] font-semibold uppercase leading-[1.5] tracking-[.16em] text-onnavy-dim">
              elected officers this year
            </span>
          </div>
        </div>

        <div aria-hidden="true" className="mt-8 h-px bg-[linear-gradient(90deg,rgba(231,200,119,.5),transparent)]" />

        <LeaderGrid />
      </div>
    </section>
  );
}
