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
