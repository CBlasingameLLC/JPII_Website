import Link from "next/link";
import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { EventCard } from "@/components/home/EventCard";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { EVENTS } from "@/content/events";

export function Events() {
  return (
    <section
      id="events"
      className="border-b border-[#EBE3CE] bg-ivory px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto max-w-site">
        <SectionEyebrow label="What's Coming" ruleClassName="flex-1" />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display text-h2 font-bold text-navy-deep">Upcoming Events</h2>
          <Link
            href="#events"
            className="border-b-2 border-orange pb-1 font-ui text-xs font-bold uppercase tracking-[.14em] text-navy transition-colors hover:text-orange"
          >
            Full calendar
          </Link>
        </div>

        <StaggerGrid className="mt-11 grid grid-cols-1 gap-[26px] sm:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((event) => (
            <StaggerItem key={event.slug}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
