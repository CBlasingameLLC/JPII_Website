import type { ScheduleDay } from "@/types/schedule";

/**
 * Real weekly schedule from the ministry (school year). 'sat' is
 * intentionally omitted — no entries — so the day-tab default-day logic
 * falls back to Sunday on Saturdays. 'mon' has no regular programming and
 * is kept as an explicit empty day (see ScheduleCards' empty state) rather
 * than removed, so visitors browsing the week don't wonder if it's a bug.
 */
export const SCHEDULE: ScheduleDay[] = [
  {
    key: "sun",
    label: "Sun",
    items: [
      {
        title: "Morning Mass",
        time: "10:30 AM",
        note: "The main Sunday liturgy for students, with student lectors and music. Brunch social right after.",
      },
      {
        title: "Evening Mass",
        time: "7:00 PM",
        note: "Same Mass, different crowd — a lot of students' favorite. Dinner social right after.",
      },
    ],
  },
  {
    key: "mon",
    label: "Mon",
    items: [],
  },
  {
    key: "tue",
    label: "Tue",
    items: [
      {
        title: "Confession",
        time: "4:45 – 5:15 PM",
        note: "A priest is available the whole time. No appointment needed.",
      },
      {
        title: "Daily Mass",
        time: "5:30 – 6:00 PM",
        note: "Half an hour, easy to get to between classes.",
      },
    ],
  },
  {
    key: "wed",
    label: "Wed",
    items: [
      {
        title: "Confession",
        time: "4:45 – 5:15 PM",
        note: "A priest is available the whole time. No appointment needed.",
      },
      {
        title: "Daily Mass",
        time: "5:30 – 6:00 PM",
        note: "Half an hour, easy to get to between classes.",
      },
      {
        title: "Men's Bible Study",
        time: "7:00 – 8:00 PM",
        note: "Scripture and honest conversation, guys only.",
      },
      {
        title: "Women's Bible Study",
        time: "7:00 – 8:00 PM",
        note: "Scripture and honest conversation, women only.",
      },
    ],
  },
  {
    key: "thu",
    label: "Thu",
    items: [
      {
        title: "Holy Bean Coffee Hour",
        time: "1:00 – 3:00 PM",
        note: "Free coffee at the Center. Come do homework, come do nothing.",
      },
      {
        title: "Confession",
        time: "4:45 – 5:15 PM",
        note: "A priest is available the whole time. No appointment needed.",
      },
      {
        title: "Daily Mass",
        time: "5:30 – 6:00 PM",
        note: "Half an hour, easy to get to between classes.",
      },
      {
        title: "Adoration",
        time: "After Mass, until around 10:00 PM",
        note: "Quiet time before the Blessed Sacrament — drop in for five minutes or stay the whole time. Exact end time varies by week.",
      },
    ],
  },
  {
    key: "fri",
    label: "Fri",
    items: [
      {
        title: "Confession",
        time: "4:45 – 5:15 PM",
        note: "A priest is available the whole time. No appointment needed.",
      },
      {
        title: "Daily Mass",
        time: "5:30 – 6:00 PM",
        note: "Half an hour, easy to get to between classes.",
      },
    ],
  },
];
