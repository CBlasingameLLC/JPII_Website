import { getChicagoNow } from "@/lib/time";
import { getDailyLiturgy } from "@/lib/liturgy-feed";

/**
 * A quiet band carrying the day's feast and Mass reading citations.
 *
 * Server component with a day-long cache, so it costs a student nothing to
 * load and needs no upkeep from the ministry — it is the one part of the site
 * that stays current entirely on its own. Renders nothing when both upstream
 * sources are unreachable; an empty strip is better than a broken one.
 *
 * Citations only, linking to USCCB for the text itself — see lib/liturgy-feed.
 */
export async function DailyLiturgy() {
  const liturgy = await getDailyLiturgy(getChicagoNow());
  if (!liturgy || (!liturgy.feast && liturgy.readings.length === 0)) return null;

  return (
    <section
      aria-label="Today in the Church"
      className="border-y border-border bg-cream/45 px-5 py-7 sm:px-gutter"
    >
      <div className="mx-auto flex max-w-site flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex items-start gap-3">
          {liturgy.color && (
            <span
              aria-hidden="true"
              className="mt-[7px] h-[9px] w-[9px] flex-none rounded-full ring-2 ring-white/60"
              style={{ backgroundColor: liturgy.color }}
            />
          )}
          <div>
            <div className="font-ui text-[10px] font-semibold uppercase tracking-[.22em] text-muted">
              {liturgy.grade ? `Today · ${liturgy.grade}` : "Today"}
            </div>
            <div className="mt-1 font-display text-[21px] font-bold leading-tight text-navy-deep">
              {liturgy.feast ?? "Mass Readings"}
            </div>
          </div>
        </div>

        {liturgy.readings.length > 0 && (
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            {liturgy.readings.map((r) => (
              <div key={r.label}>
                <div className="font-ui text-[9px] font-semibold uppercase tracking-[.16em] text-muted-light">
                  {r.label}
                </div>
                <div className="mt-[2px] text-[14px] font-medium text-ink">{r.citation}</div>
              </div>
            ))}
          </div>
        )}

        {liturgy.usccbLink && (
          <a
            href={liturgy.usccbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none font-ui text-[11px] font-semibold uppercase tracking-[.14em] text-orange underline decoration-orange/30 underline-offset-4 hover:decoration-orange"
          >
            Read them ✦
          </a>
        )}
      </div>
    </section>
  );
}
