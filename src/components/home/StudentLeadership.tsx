import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { LeaderGrid } from "@/components/home/LeaderGrid";

export function StudentLeadership() {
  return (
    <section id="leadership" className="bg-navy px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="Student Leadership" tone="navy" ruleClassName="flex-1" />
        <h2 className="mt-4 font-display text-h2 font-bold text-ivory">Run by students, for students</h2>
        <p className="mt-4 max-w-[600px] text-[17px] leading-[1.65] text-onnavy">
          Every one of these people was a first-time visitor once. Now they run the place. Tap
          anyone to read more.
        </p>

        <LeaderGrid />
      </div>
    </section>
  );
}
