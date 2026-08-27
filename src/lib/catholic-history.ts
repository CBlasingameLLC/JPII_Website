import historyData from "@/content/catholic-history.json";

export type HistoryEvent = {
  year: number;
  text: string;
  source?: string;
};

type HistoryFile = {
  entries: Record<string, HistoryEvent[]>;
};

const { entries } = historyData as unknown as HistoryFile;

/**
 * Events recorded for a given Chicago-local day, oldest first.
 *
 * The dataset is deliberately partial and grows over time — a scheduled agent
 * fills in dates that have no entry yet. Most days return an empty array, and
 * the component simply renders nothing on those days rather than reaching for
 * filler. A sparse strip that's always true beats a full one that isn't.
 */
export function historyForDay(chicagoNow: Date): HistoryEvent[] {
  const mm = String(chicagoNow.getMonth() + 1).padStart(2, "0");
  const dd = String(chicagoNow.getDate()).padStart(2, "0");
  const found = entries[`${mm}-${dd}`] ?? [];
  return [...found].sort((a, b) => a.year - b.year);
}

/** Number of calendar days currently covered — used by the research agent to report progress. */
export function historyCoverage(): { days: number; events: number } {
  const days = Object.keys(entries).length;
  const events = Object.values(entries).reduce((n, list) => n + list.length, 0);
  return { days, events };
}
