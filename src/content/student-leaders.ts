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
   * The Confirmation saint, shown on the resting card. Pulled out of `facets`
   * because it's the one personal detail the whole team has supplied, and a
   * card that always shows it reads far warmer than one showing a placeholder.
   */
  saint?: string;
  /**
   * Cycled one at a time on the collapsed card and listed in full when
   * expanded. Order matters — the first is what a card shows at rest.
   * Facets still carrying a ◆ are skipped on the resting card but kept in the
   * expanded view, so a visitor never sees a placeholder while the team can
   * still see exactly what's missing.
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
 * Array order is display order, and it is the officer order the ministry gave:
 * President, Vice President, Treasurer, Liturgy, Evangelization, Service,
 * Hospitality, Events, Social Media. Nine people in a three-column grid, so
 * the rows come out even — don't add a tenth without revisiting the layout.
 *
 * Photos are real and final: `npm run photos:leadership` crops and grades
 * everything in the source album to a uniform 4:5 card image, and slugs match
 * the person rather than the original filename.
 *
 * Names, roles, and saints are confirmed. Bios, fun facts, hometowns, majors,
 * and verses are not — every ◆ below still needs a real answer from the team.
 *
 * One open item: the ministry supplied nine roles and eight names. Alvaro is
 * the only photo not reassigned and Liturgy the only role left unclaimed, so
 * he is placed there by elimination — confirmed with the ministry as the
 * intended reading. His surname and saint are still outstanding.
 */
export const STUDENT_LEADERS: StudentLeader[] = [
  {
    slug: "matthew",
    name: "Matthew McKnight",
    role: "President",
    saint: "St. Maximilian Kolbe",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph — how he found the Center, what he'd tell a nervous freshman, what he's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "mariana",
    name: "Mariana Ramirez",
    role: "Vice President",
    saint: "St. Teresa of Ávila",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph — how she found the Center, what she'd tell a nervous freshman, what she's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "paul",
    name: "Paul Trinh",
    role: "Treasurer",
    saint: "St. Paul",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph — how he found the Center, what he'd tell a nervous freshman, what he's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "alvaro",
    name: "◆ Alvaro",
    role: "Liturgy",
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
    slug: "gabriel",
    name: "Gabriel Mabulay",
    role: "Evangelization",
    saint: "St. Francis of Assisi",
    bio: "◆ Two sentences on who he is and what he does here.",
    longBio: "◆ A longer paragraph — how he found the Center, what he'd tell a nervous freshman, what he's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "andrea",
    name: "Andrea Sepulveda",
    role: "Service",
    saint: "St. Thérèse of Lisieux",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph — how she found the Center, what she'd tell a nervous freshman, what she's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "marysue",
    name: "Mary Sue Phillip",
    role: "Hospitality",
    saint: "St. Edith Stein",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph — how she found the Center, what she'd tell a nervous freshman, what she's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "linda",
    name: "Linda Gassou",
    role: "Events",
    saint: "St. Thérèse of Lisieux",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph — how she found the Center, what she'd tell a nervous freshman, what she's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
  {
    slug: "sarah",
    name: "Sarah Jodoin",
    role: "Social Media",
    saint: "St. Joseph",
    bio: "◆ Two sentences on who she is and what she does here.",
    longBio: "◆ A longer paragraph — how she found the Center, what she'd tell a nervous freshman, what she's studying.",
    facets: [
      { label: "Fun Fact", value: "◆" },
      { label: "Hometown", value: "◆" },
      { label: "Major", value: "◆" },
    ],
    verse: { text: "◆ A favorite verse, in full.", reference: "◆ Book 0:0" },
  },
];
