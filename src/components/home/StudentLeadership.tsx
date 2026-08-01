import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { STUDENT_LEADERS } from "@/content/student-leaders";

export function StudentLeadership() {
  return (
    <section id="leadership" className="bg-navy px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="Student Leadership" tone="navy" ruleClassName="flex-1" />
        <h2 className="mt-4 font-display text-h2 font-bold text-ivory">Run by students, for students</h2>
        <p className="mt-4 max-w-[600px] text-[17px] leading-[1.65] text-onnavy">
          Every one of these people was a first-time visitor once. Now they run the place.
        </p>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keyed by index, not name — see Staff.tsx. */}
          {STUDENT_LEADERS.map((leader, i) => (
            <StaggerItem
              key={i}
              className="rounded-inner border border-white/20 bg-white/[.03] p-[26px_22px] text-center transition-all duration-200 hover:-translate-y-1 hover:-rotate-1 hover:border-gold-light hover:bg-gold-light/[.07]"
            >
              <div className="relative mx-auto h-[92px] w-[92px] overflow-hidden rounded-full border-2 border-gold-light/40">
                <ImagePlaceholder src={leader.photo} alt={leader.name} />
              </div>
              <div className="mt-4 font-display text-lg font-bold text-ivory">{leader.name}</div>
              <div className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-gold-light">
                {leader.role}
              </div>
              <p className="mt-3 text-[13px] italic leading-[1.6] text-onnavy">{leader.funFact}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
