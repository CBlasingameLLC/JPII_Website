/**
 * Today's feast and Mass readings, pulled from two public sources.
 *
 * The split is deliberate — each source is used only for what it's reliably
 * good at:
 *
 *  - litcal computes the General Roman Calendar algorithmically for any year,
 *    so it never ages out, and its feast names and liturgical colours are
 *    dependable. Its `readings` field is only sometimes populated (present for
 *    the Assumption, empty for St Monica), so it isn't trusted for those.
 *  - catholic-readings-api ships reading citations plus the official USCCB
 *    link for each day, which is the half litcal doesn't cover.
 *
 * Only citations are ever shown, never reading text: the NABRE translation is
 * copyrighted by the USCCB, so the full text belongs on their site behind the
 * link, not reproduced here.
 *
 * Everything degrades quietly. This is ambient texture on the homepage, not
 * load-bearing content — if both sources are unreachable the section renders
 * nothing at all rather than showing an error to a student.
 */

const LITCAL_URL = "https://litcal.johnromanodorazio.com/api/dev/calendar/nation/US";
const READINGS_URL = "https://cpbjr.github.io/catholic-readings-api/readings";

/** One day. Both sources change at most once per day. */
const REVALIDATE_SECONDS = 86_400;
const FETCH_TIMEOUT_MS = 8_000;

export type ReadingCitation = {
  label: string;
  citation: string;
};

export type DailyLiturgy = {
  /** e.g. "Saint Monica" — null on a day with no proper feast. */
  feast: string | null;
  /** e.g. "Memorial", "SOLEMNITY". */
  grade: string | null;
  /** Hex accent for the day's liturgical colour. */
  color: string | null;
  readings: ReadingCitation[];
  usccbLink: string | null;
};

type LitcalEvent = {
  name?: string;
  grade?: number;
  grade_lcl?: string;
  color?: string[];
  date?: string;
};

/**
 * Liturgical colours mapped into the restrained palette lib/liturgical.ts
 * already uses for seasons, rather than literal white/red/green — the point is
 * a nod to the day's colour, not a costume change.
 */
const COLOR_HEX: Record<string, string> = {
  white: "#E7C877",
  gold: "#E7C877",
  red: "#A3453C",
  green: "#7A8B5E",
  violet: "#5B4B78",
  purple: "#5B4B78",
  rose: "#C08497",
  pink: "#C08497",
};

function toISODate(chicagoNow: Date): string {
  const y = chicagoNow.getFullYear();
  const m = String(chicagoNow.getMonth() + 1).padStart(2, "0");
  const d = String(chicagoNow.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    // The readings API is GitHub Pages, which answers a missing file with an
    // HTML 404 page under a 200 in some edge cases — so verify we got JSON
    // rather than trusting the status alone.
    const text = await res.text();
    if (!text.trimStart().startsWith("{")) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * litcal's year N covers Advent of N-1 through late November of N, so a date
 * in December belongs to the following calendar. Rather than encode that
 * boundary, try the civil year and fall back a year forward if the date isn't
 * in it — self-correcting and immune to the exact Advent cutoff.
 */
async function fetchFeast(isoDate: string, civilYear: number): Promise<LitcalEvent | null> {
  for (const year of [civilYear, civilYear + 1]) {
    const data = (await getJson(`${LITCAL_URL}/${year}`)) as { litcal?: LitcalEvent[] } | null;
    const events = data?.litcal;
    if (!Array.isArray(events)) continue;

    const sameDay = events.filter((e) => typeof e.date === "string" && e.date.startsWith(isoDate));
    if (sameDay.length === 0) continue;

    // Several observances can share a date; the highest grade is the one the
    // day is actually named for.
    return sameDay.reduce((best, e) => ((e.grade ?? 0) > (best.grade ?? 0) ? e : best));
  }
  return null;
}

type ReadingsPayload = {
  readings?: {
    firstReading?: string;
    psalm?: string;
    secondReading?: string;
    gospel?: string;
  };
  usccbLink?: string;
};

async function fetchReadings(isoDate: string): Promise<ReadingsPayload | null> {
  const [year, month, day] = isoDate.split("-");
  return (await getJson(`${READINGS_URL}/${year}/${month}-${day}.json`)) as ReadingsPayload | null;
}

export async function getDailyLiturgy(chicagoNow: Date): Promise<DailyLiturgy | null> {
  const isoDate = toISODate(chicagoNow);

  const [feastEvent, readingsPayload] = await Promise.all([
    fetchFeast(isoDate, chicagoNow.getFullYear()),
    fetchReadings(isoDate),
  ]);

  if (!feastEvent && !readingsPayload) return null;

  const r = readingsPayload?.readings;
  const readings: ReadingCitation[] = [
    { label: "First Reading", citation: r?.firstReading ?? "" },
    { label: "Psalm", citation: r?.psalm ?? "" },
    { label: "Second Reading", citation: r?.secondReading ?? "" },
    { label: "Gospel", citation: r?.gospel ?? "" },
  ].filter((x) => x.citation.trim() !== "");

  const colorKey = feastEvent?.color?.[0]?.toLowerCase();

  return {
    feast: feastEvent?.name ?? null,
    grade: feastEvent?.grade_lcl ?? null,
    color: colorKey ? (COLOR_HEX[colorKey] ?? null) : null,
    readings,
    usccbLink: readingsPayload?.usccbLink ?? null,
  };
}
