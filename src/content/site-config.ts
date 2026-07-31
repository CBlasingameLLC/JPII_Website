import type { MinistryBreak, WeeklyWindow } from "@/types/schedule";

/**
 * Every ◆-prefixed value here is a placeholder called out in the design
 * handoff README as needing a real answer from the ministry before launch.
 * Keep the ◆ marker in the string itself — it's deliberately ugly so a
 * placeholder can't ship silently. Search this file for "◆" before launch.
 */
export const SITE_CONFIG = {
  siteName: "John Paul II Catholic Campus Ministry",
  shortName: "JPII",
  tagline: "Be Disciples, Make Disciples.",
  university: "The University of Texas at Tyler",

  heroType: "varsity" as "varsity" | "sacred",
  headerTheme: "dark" as "dark" | "light",

  ministryCenterName: "◆ Ministry Center Name",
  streetAddress: "2603 Old Omen Road",
  city: "Tyler",
  state: "TX",
  zip: "75701",

  email: "campusminister@tylercatholic.org",
  phone: "(903) 266-9110",
  instagram: "@johnpaul2ccm",
  instagramUrl: "https://www.instagram.com/johnpaul2ccm/",
  // Confirmed by the ministry as currently inactive — kept for completeness,
  // not treated as a primary channel anywhere in the UI.
  facebookUrl: "https://www.facebook.com/tylercatholic/",

  venueName: "◆ venue name",

  stats: {
    studentsPerWeek: "◆",
    yearFounded: "◆",
  },

  diocese: "Diocese of Tyler",
  dioceseUrl: "https://www.dioceseoftyler.org/",
} as const;

/**
 * Weekly windows behind the Next Mass card's countdown, "Happening Now"
 * detection, and the Confession/Adoration bullets. Days use Date.getDay()
 * numbering (0 = Sunday); see WeeklyWindow in types/schedule.ts.
 */
export const MASS_WINDOWS: WeeklyWindow[] = [
  { days: [2, 3, 4, 5], start: { hour: 17, minute: 30 }, end: { hour: 18, minute: 0 } },
  // Sunday Mass durations aren't specified by the ministry — 60 minutes assumed.
  { days: [0], start: { hour: 10, minute: 30 }, end: { hour: 11, minute: 30 } },
  { days: [0], start: { hour: 19, minute: 0 }, end: { hour: 20, minute: 0 } },
];

export const CONFESSION_WINDOWS: WeeklyWindow[] = [
  { days: [2, 3, 4, 5], start: { hour: 16, minute: 45 }, end: { hour: 17, minute: 15 } },
];

/**
 * Start is "right after daily Mass ends" (6:00 PM Thursday); end is the
 * ministry's own "usually until 10:00 PM" — both treated as approximate in
 * the UI (see NextMassCard's softened Adoration copy), not shown as a hard
 * countdown target the way Mass/Confession are.
 */
export const ADORATION_WINDOWS: WeeklyWindow[] = [
  { days: [4], start: { hour: 18, minute: 0 }, end: { hour: 22, minute: 0 } },
];

/**
 * Date ranges (America/Chicago, inclusive, YYYY-MM-DD) during which the
 * Next Mass card should suppress its relative-time line rather than count
 * down to a Mass that isn't happening (summer, spring break, etc.).
 * ◆ placeholder — ministry needs to supply real break dates.
 */
export const MINISTRY_BREAKS: MinistryBreak[] = [
  { label: "◆ Summer Break", start: "2026-05-16", end: "2026-08-23" },
];
