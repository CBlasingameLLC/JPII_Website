import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { INVOLVED } from "@/content/involved";

export function GetInvolved() {
  return (
    <section id="involved" className="bg-navy px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="Get Involved" tone="navy" ruleClassName="flex-1" />
        <h2 className="mt-4 font-display text-h2 font-bold text-ivory">Four ways in</h2>
        <p className="mt-4 max-w-[600px] text-[17px] leading-[1.65] text-onnavy">
          Pick one. You don&apos;t have to do all of it, and you don&apos;t have to have it
          figured out first.
        </p>

        <StaggerGrid className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INVOLVED.map((card) => (
            <StaggerItem
              key={card.ordinal}
              className="rounded-inner border border-white/20 p-[30px_26px] transition-colors duration-150 hover:border-gold-light hover:bg-gold-light/[.07]"
            >
              <div className="font-display text-[15px] font-bold tracking-[.1em] text-gold-light">
                {card.ordinal}
              </div>
              <h3 className="mt-[14px] font-display text-[21px] font-bold text-ivory">
                {card.title}
              </h3>
              <p className="mt-[11px] text-sm leading-[1.65] text-onnavy">{card.body}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
