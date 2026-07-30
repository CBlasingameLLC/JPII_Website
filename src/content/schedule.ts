import type { ScheduleDay } from "@/types/schedule";

/**
 * Ports the schedule from Website Draft.dc.html verbatim (lines 395-417).
 * Times marked ◆ are guesses per the design handoff and need real answers
 * from the ministry. 'sat' is intentionally omitted — no entries — so the
 * day-tab default-day logic falls back to Sunday on Saturdays.
 */
export const SCHEDULE: ScheduleDay[] = [
  {
    key: "sun",
    label: "Sun",
    items: [
      {
        title: "Student Mass",
        time: "11:00 AM ◆",
        note: "The main Sunday liturgy for students, with student lectors and music.",
      },
      {
        title: "Free Lunch",
        time: "After Mass",
        note: "Everyone eats. Bring a friend, bring a roommate, bring nobody.",
      },
    ],
  },
  {
    key: "mon",
    label: "Mon",
    items: [
      {
        title: "Adoration & Confession",
        time: "6:00 PM – 7:00 PM ◆",
        note: "Quiet hour before the Blessed Sacrament. A priest is available the whole time.",
      },
    ],
  },
  {
    key: "tue",
    label: "Tue",
    items: [
      {
        title: "Daily Mass",
        time: "12:15 PM ◆",
        note: "Twenty-five minutes between classes.",
      },
      {
        title: "Bible Study",
        time: "7:00 PM ◆",
        note: "Working through one gospel a semester. No prep required.",
      },
    ],
  },
  {
    key: "wed",
    label: "Wed",
    items: [
      {
        title: "Daily Mass",
        time: "12:15 PM ◆",
        note: "Twenty-five minutes between classes.",
      },
      {
        title: "Community Night",
        time: "7:00 PM ◆",
        note: "Dinner, a talk, small groups. The night to bring someone new.",
      },
    ],
  },
  {
    key: "thu",
    label: "Thu",
    items: [
      {
        title: "Praise & Worship",
        time: "8:00 PM ◆",
        note: "Music, adoration, and confession available throughout.",
      },
    ],
  },
  {
    key: "fri",
    label: "Fri",
    items: [
      {
        title: "Daily Mass",
        time: "12:15 PM ◆",
        note: "Followed by coffee for anyone who lingers.",
      },
    ],
  },
];
