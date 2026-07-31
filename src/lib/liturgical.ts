/**
 * Liturgical season for a given Chicago-local date. Deliberately limited to
 * the five major seasons (Advent, Christmas, Ordinary Time, Lent, Easter) —
 * all derived from Easter's date (Meeus/Jones/Butcher algorithm, the
 * standard Gregorian computus) and Christmas's fixed date, both
 * canonically fixed rules with no ambiguity. A fixed-feast table (specific
 * saints' days, transferred solemnities) is intentionally out of scope: that
 * needs a liturgically literate reviewer, this doesn't.
 */
export type LiturgicalSeason = {
  key: "advent" | "christmas" | "ordinary" | "lent" | "easter";
  label: string;
  /** Hex accent — a restrained nod to the traditional violet/gold/green, not the brand's own gold/orange system. */
  color: string;
};

const ADVENT: LiturgicalSeason = { key: "advent", label: "Season of Advent", color: "#5B4B78" };
const CHRISTMAS: LiturgicalSeason = { key: "christmas", label: "Christmas Season", color: "#E7C877" };
const LENT: LiturgicalSeason = { key: "lent", label: "Season of Lent", color: "#5B4B78" };
const EASTER: LiturgicalSeason = { key: "easter", label: "Easter Season", color: "#E7C877" };
const ORDINARY: LiturgicalSeason = { key: "ordinary", label: "Ordinary Time", color: "#7A8B5E" };

function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

/** Meeus/Jones/Butcher Gregorian Easter algorithm — standard, integer-only. */
function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monthDay = h + l - 7 * m + 114;
  const month = Math.floor(monthDay / 31); // 3 = March, 4 = April
  const day = (monthDay % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Advent Sunday: the Sunday nearest Nov 30, i.e. the one Sunday in [Nov 27, Dec 3]. */
function adventStart(year: number): Date {
  for (let d = 27; d <= 33; d++) {
    const date = new Date(year, 10, d); // month 10 = Nov; JS Date rolls 31–33 into Dec 1–3
    if (date.getDay() === 0) return date;
  }
  throw new Error("unreachable — one Sunday always falls in a 7-day window");
}

export function getLiturgicalSeason(chicagoNow: Date): LiturgicalSeason {
  const year = chicagoNow.getFullYear();
  const d = new Date(year, chicagoNow.getMonth(), chicagoNow.getDate()).getTime();

  const easter = computeEaster(year);
  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);
  const advent = adventStart(year);
  const christmas = new Date(year, 11, 25);
  // Christmas carries over from LAST Dec 25 through roughly the Baptism of
  // the Lord in early-to-mid January of THIS year.
  const christmasCarryoverEnd = addDays(new Date(year - 1, 11, 25), 19);

  if (d >= christmas.getTime()) return CHRISTMAS;
  if (d >= advent.getTime()) return ADVENT;
  if (d <= christmasCarryoverEnd.getTime()) return CHRISTMAS;
  if (d >= ashWednesday.getTime() && d < easter.getTime()) return LENT;
  if (d >= easter.getTime() && d <= pentecost.getTime()) return EASTER;
  return ORDINARY;
}
