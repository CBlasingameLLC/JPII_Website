import { activeWindow, formatMassTime, formatOccurrenceIn, formatOccurrenceWhen, nextOccurrence } from "@/lib/time";
import { ADORATION_WINDOWS } from "@/content/site-config";
import type { WeeklyWindow } from "@/types/schedule";

export type OccurrenceStatus = {
  happeningNow: boolean;
  /** "Today, 5:30 PM" when upcoming, or a "happening now" label when live. */
  primary: string;
  /** "in 2 hours 15 min" when upcoming, or "Until 6:00 PM" when live. */
  secondary: string;
};

/** Shared by Mass and Confession, which both track a hard, exact schedule. Adoration gets its own status function (see NextMassCard) since its timing is deliberately approximate. */
export function occurrenceStatus(
  chicagoNow: Date,
  windows: WeeklyWindow[],
  happeningPrimary: string
): OccurrenceStatus {
  const active = activeWindow(chicagoNow, windows);
  if (active) {
    return {
      happeningNow: true,
      primary: happeningPrimary,
      secondary: `Until ${formatMassTime(active.end)}`,
    };
  }
  const target = nextOccurrence(chicagoNow, windows);
  return {
    happeningNow: false,
    primary: formatOccurrenceWhen(target, chicagoNow),
    secondary: formatOccurrenceIn(target, chicagoNow),
  };
}

/**
 * Adoration's own status function rather than `occurrenceStatus`: the
 * ministry described its timing as "usually" starting right after Mass and
 * running "until around 10:00 PM" — deliberately approximate, so the copy
 * stays soft ("Thursday, after Mass" / "until ~10:00 PM") instead of
 * implying a precision the schedule doesn't actually have.
 */
export function adorationStatus(chicagoNow: Date): OccurrenceStatus {
  const active = activeWindow(chicagoNow, ADORATION_WINDOWS);
  if (active) {
    return { happeningNow: true, primary: "Adoration is happening now", secondary: "Until ~10:00 PM" };
  }
  return { happeningNow: false, primary: "Thursday, after Mass", secondary: "" };
}
