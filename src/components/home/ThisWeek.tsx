import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { DayTabs } from "@/components/home/DayTabs";
import { SCHEDULE } from "@/content/schedule";
import { SITE_CONFIG } from "@/content/site-config";
import { getChicagoNow, getTodayScheduleIndex } from "@/lib/time";

export function ThisWeek() {
  const todayIndex = getTodayScheduleIndex(SCHEDULE, getChicagoNow());

  return (
    <section id="week" className="border-b border-[#EBE3CE] bg-paper px-5 py-16 sm:px-gutter lg:py-section-y">
      <div className="mx-auto max-w-site">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <SectionEyebrow label="This Week" />
            <h2 className="mt-4 font-display text-h2 font-bold text-navy-deep">
              Mass, Confession &amp; Adoration
            </h2>
          </div>
          <div className="max-w-[340px] text-right font-accent text-xl italic text-muted">
            All liturgies at{" "}
            <b className="font-semibold not-italic text-gold-deep">{SITE_CONFIG.venueName}</b>,
            one block from the library.
          </div>
        </div>

        <div className="mt-11">
          <DayTabs schedule={SCHEDULE} initialActiveIndex={todayIndex} />
        </div>
      </div>
    </section>
  );
}
