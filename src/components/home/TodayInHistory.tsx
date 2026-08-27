import { getChicagoNow } from "@/lib/time";
import { historyForDay } from "@/lib/catholic-history";

/**
 * "Today in Catholic History" — the AP-style on-this-day strip, for the Church.
 *
 * Unlike the readings band above it, this reads from a local dataset rather
 * than a live API: there is no public API for this, so the file is built up
 * over time by a scheduled research agent. Days with nothing recorded render
 * nothing at all — see lib/catholic-history.
 */
export function TodayInHistory() {
  const events = historyForDay(getChicagoNow());
  if (events.length === 0) return null;

  return (
    <section
      aria-label="Today in Catholic history"
      className="border-b border-border bg-ivory px-5 py-9 sm:px-gutter"
    >
      <div className="mx-auto max-w-site">
        <div className="flex items-center gap-3">
          <span className="font-ui text-[10px] font-semibold uppercase tracking-[.22em] text-orange">
            Today in Catholic History
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <article key={`${event.year}-${event.text.slice(0, 24)}`} className="flex gap-5">
              <div
                className="flex-none font-display text-[30px] font-bold leading-none text-gold-deep tabular-nums sm:text-[34px]"
                aria-hidden="true"
              >
                {event.year}
              </div>
              <p className="text-[14.5px] leading-[1.65] text-ink-warm">
                <span className="sr-only">{event.year}: </span>
                {event.text}
                {event.source && (
                  <>
                    {" "}
                    <a
                      href={event.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-[11px] font-semibold uppercase tracking-[.1em] text-orange underline decoration-orange/30 underline-offset-4 hover:decoration-orange"
                    >
                      Source
                    </a>
                  </>
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
