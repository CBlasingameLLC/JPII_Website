import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { StaffGrid } from "@/components/home/StaffGrid";

export function Staff() {
  return (
    <section id="staff" className="border-b border-[#EBE3CE] bg-ivory px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="Meet the Team" />
        <h2 className="mt-4 font-display text-h2 font-bold text-navy-deep">Who&apos;s actually here</h2>
        <p className="mt-4 max-w-[560px] text-[17px] leading-[1.65] text-ink-warm">
          If you have a question and don&apos;t know who to ask, start with Erin — that&apos;s
          genuinely what she&apos;s there for.
        </p>

        <StaffGrid />
      </div>
    </section>
  );
}
