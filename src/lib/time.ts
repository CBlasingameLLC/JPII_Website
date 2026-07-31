import type { MinistryBreak, ScheduleDay, ScheduleDayKey, WeeklyWindow } from "@/types/schedule";

const DAY_ORDER: ScheduleDayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Returns a Date whose *local* getters (getDay, getHours, getDate, ...)
 * reflect America/Chicago wall-clock time, regardless of the runtime's own
 * timezone. The README requires the Next Mass card to always show Tyler
 * time — "a parent in another state should see Tyler time" — so all
 * schedule/countdown math must run against this, never against a raw
 * `new Date()`.
 */
export function getChicagoNow(reference: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(reference);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  let hour = parseInt(get("hour"), 10);
  if (hour === 24) hour = 0; // some Intl implementations emit "24" for midnight

  return new Date(
    parseInt(get("year"), 10),
    parseInt(get("month"), 10) - 1,
    parseInt(get("day"), 10),
    hour,
    parseInt(get("minute"), 10),
    parseInt(get("second"), 10)
  );
}

/** Index into `schedule` for the given Chicago-local moment, falling back to Sunday on days with no entries (i.e. Saturday). */
export function getTodayScheduleIndex(schedule: ScheduleDay[], chicagoNow: Date): number {
  const dayKey = DAY_ORDER[chicagoNow.getDay()];
  const idx = schedule.findIndex((d) => d.key === dayKey);
  if (idx !== -1) return idx;
  const sundayIdx = schedule.findIndex((d) => d.key === "sun");
  return sundayIdx !== -1 ? sundayIdx : 0;
}

export function formatMassTime(massTime: { hour: number; minute: number }): string {
  const period = massTime.hour >= 12 ? "PM" : "AM";
  const hour12 = massTime.hour % 12 === 0 ? 12 : massTime.hour % 12;
  const minute = massTime.minute.toString().padStart(2, "0");
  return `${hour12}:${minute} ${period}`;
}

function windowMinutes(t: { hour: number; minute: number }): number {
  return t.hour * 60 + t.minute;
}

function isWithinWindow(chicagoNow: Date, window: WeeklyWindow): boolean {
  if (!window.days.includes(chicagoNow.getDay())) return false;
  const mins = chicagoNow.getHours() * 60 + chicagoNow.getMinutes();
  return mins >= windowMinutes(window.start) && mins < windowMinutes(window.end);
}

/** The currently-active window, if any of `windows` is in session right now — the basis for a "Happening Now" state. */
export function activeWindow(chicagoNow: Date, windows: WeeklyWindow[]): WeeklyWindow | null {
  return windows.find((w) => isWithinWindow(chicagoNow, w)) ?? null;
}

/**
 * The soonest upcoming start time across one or more recurring weekly
 * windows — e.g. Mass is really three windows (weekday evening + two
 * Sunday times), Confession and Adoration are one each. Looks up to 8 days
 * ahead so it always finds a match even for a single-day-a-week window.
 */
export function nextOccurrence(chicagoNow: Date, windows: WeeklyWindow[]): Date {
  let best: Date | null = null;
  for (const w of windows) {
    for (let offset = 0; offset < 8; offset++) {
      const day = new Date(chicagoNow.getFullYear(), chicagoNow.getMonth(), chicagoNow.getDate() + offset);
      if (!w.days.includes(day.getDay())) continue;
      const candidate = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        w.start.hour,
        w.start.minute,
        0
      );
      if (candidate.getTime() > chicagoNow.getTime()) {
        if (!best || candidate.getTime() < best.getTime()) best = candidate;
        break;
      }
    }
  }
  if (!best) throw new Error("nextOccurrence: no matching day found within 8 days — check `windows.days`");
  return best;
}

/** Generic day/time label — "Today, 5:30 PM" / "Thursday, 4:45 PM" — for any occurrence, not just Mass. */
export function formatOccurrenceWhen(target: Date, chicagoNow: Date): string {
  const isToday = target.toDateString() === chicagoNow.toDateString();
  const dayLabel = isToday ? "Today" : DAY_NAMES[target.getDay()];
  return `${dayLabel}, ${formatMassTime({ hour: target.getHours(), minute: target.getMinutes() })}`;
}

export function formatOccurrenceIn(target: Date, chicagoNow: Date): string {
  const mins = Math.max(0, Math.round((target.getTime() - chicagoNow.getTime()) / 60000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);

  if (days > 0) {
    return `in ${days} ${days === 1 ? "day" : "days"} ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  if (hours > 0) {
    return `in ${hours} ${hours === 1 ? "hour" : "hours"} ${mins % 60} min`;
  }
  return `starting in ${mins} min`;
}

/** Chicago-local YYYY-MM-DD, for comparing against break date ranges. */
function chicagoDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isDuringBreak(chicagoNow: Date, breaks: MinistryBreak[]): boolean {
  const key = chicagoDateKey(chicagoNow);
  return breaks.some((b) => key >= b.start && key <= b.end);
}
