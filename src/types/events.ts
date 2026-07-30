export type EventCategory = "retreat" | "weekly" | "service";

export type MinistryEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  dateLabel: string;
  blurb: string;
  image: string | null;
  href: string;
  actionLabel: string;
};
