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

  /**
   * The parish's existing online giving portal, already live and already the
   * rail the ministry uses today. Distinct from the Stripe Give flow in
   * app/api/checkout/give — that one is still pending sign-off, this one is
   * known-good, so it's surfaced as the primary way to give.
   */
  givingUrl: "https://app.easytithe.com/app/giving/tylercatholic",

  /** Geocoded from streetAddress via OpenStreetMap Nominatim. */
  coords: { lat: 32.3213365, lng: -95.2517986 },
} as const;

/**
 * Reference points shown alongside the Center on the map.
 *
 * The Center's own address means nothing to someone who has been in Tyler for
 * a week — "is this walkable from my dorm" is the actual question — so both
 * campuses are plotted with it. All three sets of coordinates are geocoded
 * from OpenStreetMap Nominatim; distances are computed at render time from
 * these, not written down, so they cannot drift out of sync.
 */
export type MapPlace = {
  id: string;
  name: string;
  short: string;
  lat: number;
  lng: number;
  kind: "center" | "campus";
};

export const MAP_PLACES: MapPlace[] = [
  {
    id: "center",
    name: SITE_CONFIG.siteName,
    short: "The Center",
    lat: SITE_CONFIG.coords.lat,
    lng: SITE_CONFIG.coords.lng,
    kind: "center",
  },
  {
    id: "uttyler",
    name: "The University of Texas at Tyler",
    short: "UT Tyler",
    lat: 32.3163078,
    lng: -95.2536994,
    kind: "campus",
  },
  {
    id: "tjc",
    name: "Tyler Junior College",
    short: "TJC",
    lat: 32.3349608,
    lng: -95.2824611,
    kind: "campus",
  },
];

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
