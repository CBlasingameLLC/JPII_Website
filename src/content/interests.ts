export type Interest = {
  id: string;
  label: string;
  blurb: string;
  /**
   * Who follows up when someone picks this. Empty for now — the ministry
   * hasn't assigned owners yet. Once these are filled in, the registration
   * route can address the notification to the right person instead of
   * dropping everything in one inbox; nothing else has to change.
   */
  owner?: {
    name: string;
    email?: string;
    phone?: string;
  };
};

/**
 * The interest areas a new student can pick on /new-student. Each maps to
 * something the ministry actually runs (see content/schedule.ts) rather than
 * a generic list — a student should recognise every one of these from the
 * weekly schedule or from the Get Involved section.
 */
export const INTERESTS: Interest[] = [
  {
    id: "bible-study",
    label: "Bible study",
    blurb: "Men's and women's groups, Wednesday nights.",
  },
  {
    id: "sunday-mass",
    label: "Sunday Mass & meals",
    blurb: "Brunch after the 10:30, dinner after the 7:00.",
  },
  {
    id: "adoration-prayer",
    label: "Adoration & prayer",
    blurb: "Thursday evenings after daily Mass.",
  },
  {
    id: "serving-at-mass",
    label: "Serving at Mass",
    blurb: "Lector, altar server, sacristan, greeter.",
  },
  {
    id: "music",
    label: "Music ministry",
    blurb: "Cantor, choir, or you play something.",
  },
  {
    id: "service",
    label: "Service & outreach",
    blurb: "Local service days and ongoing projects.",
  },
  {
    id: "social",
    label: "Just meeting people",
    blurb: "Holy Bean coffee, game nights, hanging out.",
  },
  {
    id: "retreats",
    label: "Retreats",
    blurb: "Fall and spring, plus diocesan events.",
  },
  {
    id: "becoming-catholic",
    label: "Becoming Catholic",
    blurb: "Curious, or want to be baptised or confirmed.",
  },
  {
    id: "leadership",
    label: "Student leadership",
    blurb: "Helping run the place, eventually.",
  },
];

/**
 * JPII serves both campuses, so the form asks rather than assuming UT Tyler.
 * Kept as its own list because it drives two things at once: who follows up,
 * and which campus accent the site offers the student (see ui/CampusSwitch).
 */
export const SCHOOLS = ["UT Tyler", "TJC", "Neither / both"] as const;

export const CLASS_YEARS = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Grad student",
  "Other",
] as const;

export const FAITH_STATUS = [
  "Catholic",
  "Not Catholic",
  "Still figuring it out",
] as const;
