import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { CENTER_PRIEST, STAFF } from "@/content/staff";

export function Staff() {
  return (
    <section id="staff" className="border-b border-[#EBE3CE] bg-ivory px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="Meet the Team" />
        <h2 className="mt-4 font-display text-h2 font-bold text-navy-deep">Who&apos;s actually here</h2>

        <div className="mt-11 grid grid-cols-1 items-center gap-8 rounded-panel border border-border bg-paper p-8 lg:grid-cols-[220px_1fr] lg:gap-12 lg:p-10">
          <div className="relative mx-auto h-[200px] w-[200px] flex-none overflow-hidden rounded-full lg:mx-0 lg:h-[220px] lg:w-[220px]">
            <ImagePlaceholder src={CENTER_PRIEST.photo} alt={CENTER_PRIEST.name} />
          </div>
          <div className="text-center lg:text-left">
            <div className="font-ui text-[11px] font-semibold uppercase tracking-[.2em] text-orange">
              {CENTER_PRIEST.role}
            </div>
            <div className="mt-2 font-display text-[28px] font-bold text-navy-deep">{CENTER_PRIEST.name}</div>
            <p className="mt-3 text-[15px] leading-[1.7] text-ink-warm">{CENTER_PRIEST.bio}</p>
          </div>
        </div>

        <StaggerGrid className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Keyed by index, not name — a hand-authored static list where names
              legitimately repeat (placeholders now, potentially real namesakes later). */}
          {STAFF.map((member, i) => (
            <StaggerItem
              key={i}
              className="rounded-inner border border-border bg-paper p-[26px_28px] text-center"
            >
              <div className="relative mx-auto h-[88px] w-[88px] overflow-hidden rounded-full">
                <ImagePlaceholder src={member.photo} alt={member.name} />
              </div>
              <div className="mt-4 font-display text-lg font-bold text-navy-deep">{member.name}</div>
              <div className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-orange">
                {member.role}
              </div>
              <p className="mt-3 text-sm leading-[1.6] text-ink-warm">{member.bio}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
