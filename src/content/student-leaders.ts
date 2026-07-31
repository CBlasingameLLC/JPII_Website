export type StudentLeader = {
  name: string;
  role: string;
  funFact: string;
  photo: string | null;
};

/**
 * The current student leadership team — distinct from the one-line
 * "Student Leadership" pitch card in involved.ts (that's the invitation to
 * become one of these; this is the actual roster). ◆ placeholders
 * throughout — swap in real names/roles/photos/fun-facts whenever ready.
 */
export const STUDENT_LEADERS: StudentLeader[] = [
  { name: "◆ Student Name", role: "◆ President", funFact: "◆ Favorite saint: ...", photo: null },
  { name: "◆ Student Name", role: "◆ Small Groups Coordinator", funFact: "◆ Go-to Mass song: ...", photo: null },
  { name: "◆ Student Name", role: "◆ Service Coordinator", funFact: "◆ Hometown: ...", photo: null },
  { name: "◆ Student Name", role: "◆ Social Chair", funFact: "◆ Hidden talent: ...", photo: null },
];
