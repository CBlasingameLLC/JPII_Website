import type { MinistryBreak } from "@/types/schedule";

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
  streetAddress: "◆ 000 Placeholder St",
  city: "Tyler",
  state: "TX",
  zip: "75799",

  email: "◆ hello@example.org",
  phone: "◆ (000) 000-0000",
  instagram: "◆ @jpii_uttyler",
  instagramUrl: "◆ https://instagram.com/jpii_uttyler",

  venueName: "◆ venue name",

  stats: {
    studentsPerWeek: "◆",
    yearFounded: "◆",
  },

  heroFacts: [
    "Confession 30 minutes before every Mass",
    "Free lunch after the Sunday student Mass",
  ],

  diocese: "Diocese of Tyler",
} as const;

export const SUNDAY_MASS_TIME = { hour: 11, minute: 0 } as const;

/**
 * Date ranges (America/Chicago, inclusive, YYYY-MM-DD) during which the
 * Next Mass card should suppress its relative-time line rather than count
 * down to a Mass that isn't happening (summer, spring break, etc.).
 * ◆ placeholder — ministry needs to supply real break dates.
 */
export const MINISTRY_BREAKS: MinistryBreak[] = [
  { label: "◆ Summer Break", start: "2026-05-16", end: "2026-08-23" },
];
