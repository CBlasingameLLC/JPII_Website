export type LeaderFacet = {
  label: string;
  value: string;
};

export type StudentLeader = {
  /** Matches public/leadership/<slug>.webp and is the React key. */
  slug: string;
  name: string;
  role: string;
  /** One or two lines, shown when the card is expanded. */
  bio: string;
  /** The longer version, shown under the bio when expanded. Optional. */
  longBio?: string;
  /**
   * Cycled one at a time on the collapsed card and listed in full when
   * expanded. Order matters — the first is what a card shows at rest.
   * Any facet whose value is empty is skipped rather than rendered blank,
   * so a half-filled profile still looks deliberate.
   */
  facets: LeaderFacet[];
  verse?: {
    text: string;
    reference: string;
  };
};

/**
 * The current student leadership team — distinct from the one-line "Student
 * Leadership" pitch card in involved.ts (that's the invitation to become one
 * of these; this is the actual roster).
 *
 * Photos are real and final: `npm run photos:leadership` crops and grades
 * everything in the source album to a uniform 4:5 card image. Names, roles,
 * bios, and facets are NOT final — every ◆ below needs a real answer from the
 * team. Roles in particular are working titles, not official ones; only
 * Alvaro's "President" was given as confirmed.
 *
 * Two people are still unidentified. Both carry the stand-in name "Mary Jane"
 * at the ministry's request — which means two cards currently show the same
 * name, so the ◆ marker stays on both until the real names arrive. Their slugs
 * (`unidentified`, `huh`) are kept as-is because they trace back to the
 * original photo filenames, which is what makes them identifiable later.
 */
export const STUDENT_LEADERS: StudentLeader[] = [
  {
    slug: "alvaro",
    name: "Alvaro",
    role: "President",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph — how he found the Center, what he'd tell a nervous freshman, what he's studying.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "gabe",
    name: "Gabe",
    role: "◆ Faith Coordinator",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "sarah",
    name: "Sarah",
    role: "◆ Media Coordinator",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "marissa",
    name: "Marissa",
    role: "◆ Role TBD",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "matthew",
    name: "Matthew",
    role: "◆ Role TBD",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "paul",
    name: "Paul",
    role: "◆ Role TBD",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "unidentified",
    name: "◆ Mary Jane",
    role: "◆ Role TBD",
    bio: "◆ Stand-in name — real name still unknown. Photo arrived as _MG_4495.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "huh",
    name: "◆ Mary Jane",
    role: "◆ Role TBD",
    bio: "◆ Stand-in name — real name still unknown. Photo arrived as huh_jp2.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "mary-sue",
    name: "Mary Sue",
    role: "◆ Role TBD",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph.",
    facets: [
      { label: "Confirmation Saint", value: "◆" },
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
];
