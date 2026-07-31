export type ScheduleDayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type ScheduleItem = {
  title: string;
  time: string;
  note: string;
};

export type ScheduleDay = {
  key: ScheduleDayKey;
  label: string;
  items: ScheduleItem[];
};

export type MinistryBreak = {
  label: string;
  start: string; // ISO date, inclusive
  end: string; // ISO date, inclusive
};

/** A recurring weekly time block — e.g. "Tue–Fri, 4:45–5:15 PM" is one window with days: [2,3,4,5]. `days` uses JS's Date.getDay() numbering (0 = Sunday). */
export type WeeklyWindow = {
  days: number[];
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
};
