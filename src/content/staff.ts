export type StaffMember = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
};

/**
 * The Center Priest — the ministry's chaplain, over college ministry at the
 * center. Rendered as a distinct, larger-featured card in Staff.tsx rather
 * than folded into the regular staff grid. ◆ placeholders throughout —
 * replace with real info whenever it's ready.
 */
export const CENTER_PRIEST: StaffMember = {
  name: "◆ Fr. First Last",
  role: "Chaplain & Center Priest",
  bio: "◆ A short bio — where Father's from, when he was ordained, what he loves about walking with college students.",
  photo: null,
};

export const STAFF: StaffMember[] = [
  {
    name: "◆ Staff Name",
    role: "◆ Campus Minister",
    bio: "◆ A line or two about what they actually do day to day.",
    photo: null,
  },
  {
    name: "◆ Staff Name",
    role: "◆ Director of Operations",
    bio: "◆ A line or two about what they actually do day to day.",
    photo: null,
  },
];
