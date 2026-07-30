export type GiveInterval = "one_time" | "monthly";

export type GiveTier = {
  id: string;
  amountLabel: string;
  amountCents: number;
  interval: GiveInterval;
  description: string;
};

export const GIVE_TIERS: GiveTier[] = [
  {
    id: "sunday-lunch",
    amountLabel: "$25",
    amountCents: 2500,
    interval: "one_time",
    description: "Sunday lunch for four students",
  },
  {
    id: "retreat-scholarship",
    amountLabel: "$150",
    amountCents: 15000,
    interval: "one_time",
    description: "One retreat scholarship",
  },
  {
    id: "small-group-year",
    amountLabel: "$50/mo",
    amountCents: 5000,
    interval: "monthly",
    description: "Sustains a small group for a year",
  },
];
