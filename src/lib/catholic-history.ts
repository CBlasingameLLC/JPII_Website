import historyData from "@/content/catholic-history.json";

export type HistoryEvent = {
  year: number;
  text: string;
  source?: string;
};

type HistoryFile = {
  entries: Record<string, HistoryEvent[]>;
};

export type HistorySlot = {
  events: HistoryEvent[];
  /** True when the events actually fall on today's date. */
  isToday: boolean;
  /** The date the events belong to, for labelling when it isn't today. */
  date: Date;
};

const { entries } = historyData as unknown as HistoryFile;

/**
 * How far either side of today to look when today itself has no entry.
 * The dataset covers a few dozen days and grows weekly, so most days still
 * have nothing on them; a week's reach is wide enough to almost always find
 * something without the result stopping being "around now".
 */
const NEARBY_DAYS = 7;

function keyFor(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

function shiftDays(from: Date, days: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

function eventsOn(date: Date): HistoryEvent[] {
  const found = entries[keyFor(date)] ?? [];
  return [...found].sort((a, b) => a.year - b.year);
}

/**
 * Events to show for a given Chicago-local day.
 *
 * The dataset is deliberately partial and grows over time — a scheduled agent
 * fills in dates that have no entry yet — so on most days a strict "today
 * only" lookup finds nothing, and the section vanished from the page for days
 * at a stretch. Appearing at random is worse than being slightly loose about
 * the date, so a nearby day is used as a fallback and the component says so
 * rather than passing it off as today. Nothing within the window still
 * renders nothing: a sparse strip that's always true beats a full one
 * that isn't.
 *
 * Ties go to the past, so the fallback reads as something that just happened
 * rather than something that hasn't yet.
 */
export function historyForDay(chicagoNow: Date): HistorySlot | null {
  const today = eventsOn(chicagoNow);
  if (today.length > 0) return { events: today, isToday: true, date: chicagoNow };

  for (let offset = 1; offset <= NEARBY_DAYS; offset++) {
    for (const dir of [-1, 1]) {
      const date = shiftDays(chicagoNow, offset * dir);
      const events = eventsOn(date);
      if (events.length > 0) return { events, isToday: false, date };
    }
  }

  return null;
}

/** Number of calendar days currently covered — used by the research agent to report progress. */
export function historyCoverage(): { days: number; events: number } {
  const days = Object.keys(entries).length;
  const events = Object.values(entries).reduce((n, list) => n + list.length, 0);
  return { days, events };
}
