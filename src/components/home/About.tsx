import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { SITE_CONFIG } from "@/content/site-config";

export function About() {
  return (
    <section
      id="about"
      className="border-b border-[#EBE3CE] bg-paper px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto grid max-w-site grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <SectionEyebrow label="Who We Are" />
          <h2 className="mt-4 font-display text-h2 font-bold leading-[1.15] text-navy-deep">
            Named for a saint who trusted students
          </h2>
          <p className="mt-[22px] text-[17px] leading-[1.7] text-ink-warm">
            John Paul II spent his early priesthood with university students — hiking,
            kayaking, arguing about philosophy, hearing confessions on the trail. He believed
            young people could carry the faith, not just receive it. That&apos;s the posture of
            this place.
          </p>
          <blockquote className="mt-8 border-l-2 border-gold pl-[26px]">
            <div className="font-accent text-[25px] italic leading-[1.45] text-navy-deep">
              &ldquo;It is Jesus who you seek when you dream of happiness.&rdquo;
            </div>
            <div className="mt-[14px] font-ui text-[10px] font-semibold uppercase tracking-[.18em] text-gold-deep">
              St. John Paul II
            </div>
          </blockquote>
          <div className="mt-[38px] flex gap-9">
            <div>
              <div className="font-display text-[34px] font-bold text-orange">
                {SITE_CONFIG.stats.studentsPerWeek}
              </div>
              <div className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-muted-light">
                Students each week
              </div>
            </div>
            <div>
              <div className="font-display text-[34px] font-bold text-orange">
                {SITE_CONFIG.stats.yearFounded}
              </div>
              <div className="mt-1 font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-muted-light">
                Year founded
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 h-[380px] min-w-0 overflow-hidden rounded-panel lg:order-2 lg:h-[520px]">
          <ImagePlaceholder src={null} alt="JPII students together" />
        </div>
      </div>
    </section>
  );
}
