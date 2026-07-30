import type { EventCategory, MinistryEvent } from "@/types/events";

export const CATEGORY_STYLES: Record<
  EventCategory,
  { bg: string; text: string; label: string }
> = {
  retreat: { bg: "bg-orange", text: "text-paper", label: "Retreat" },
  weekly: { bg: "bg-gold-light", text: "text-navy", label: "Weekly" },
  service: { bg: "bg-navy", text: "text-paper", label: "Service" },
};

/** Dates marked ◆ are guesses per the design handoff. */
export const EVENTS: MinistryEvent[] = [
  {
    slug: "fall-retreat",
    title: "Fall Retreat",
    category: "retreat",
    dateLabel: "◆ Sep 12–14",
    blurb:
      "A weekend away to start the semester right — talks, adoration, confession, and a lot of sitting around a fire.",
    image: null,
    href: "/#events",
    actionLabel: "Register",
  },
  {
    slug: "community-night",
    title: "Community Night",
    category: "weekly",
    dateLabel: "◆ Wed, 7:00 PM",
    blurb:
      "Dinner, a talk, and small groups. The easiest first thing to show up to — no one will make you introduce yourself.",
    image: null,
    href: "/#events",
    actionLabel: "Details",
  },
  {
    slug: "day-of-service",
    title: "Day of Service",
    category: "service",
    dateLabel: "◆ Oct 4",
    blurb:
      "One Saturday morning, one Tyler neighborhood, however many of us show up. Breakfast tacos provided.",
    image: null,
    href: "/#events",
    actionLabel: "Sign up",
  },
];
