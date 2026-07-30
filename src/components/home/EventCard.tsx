import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { CATEGORY_STYLES } from "@/content/events";
import type { MinistryEvent } from "@/types/events";

export function EventCard({ event }: { event: MinistryEvent }) {
  const style = CATEGORY_STYLES[event.category];

  return (
    <article className="group overflow-hidden rounded-card border border-border bg-paper transition-[border-color,box-shadow] duration-150 hover:border-gold hover:shadow-card">
      <div className="relative h-[196px]">
        <ImagePlaceholder src={event.image} alt={event.title} sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      <div className="p-[26px_26px_28px]">
        <div className="flex items-center gap-2.5">
          <span
            className={`rounded-pill px-[11px] py-[5px] font-ui text-[10px] font-bold uppercase tracking-[.14em] ${style.bg} ${style.text}`}
          >
            {style.label}
          </span>
          <span className="font-ui text-[10px] font-semibold uppercase tracking-[.14em] text-muted-light">
            {event.dateLabel}
          </span>
        </div>
        <h3 className="mt-4 font-display text-h3 font-bold leading-[1.25] text-navy-deep">
          {event.title}
        </h3>
        <p className="mt-[11px] text-sm leading-[1.65] text-ink-warm">{event.blurb}</p>
        <div className="mt-5 font-ui text-xs font-bold uppercase tracking-[.13em] text-navy">
          {event.actionLabel} &rarr;
        </div>
      </div>
    </article>
  );
}
