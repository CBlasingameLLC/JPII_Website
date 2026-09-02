export type StaffMember = {
  name: string;
  role: string;
  bio: string;
  photo: string | null;
  /** Optional direct contact, rendered as a mailto link on the card. */
  email?: string;
};

/**
 * The ministry's staff, as one rank of equal cards rather than a chaplain hero
 * card with everyone else demoted to a smaller grid beneath it.
 *
 * That earlier two-tier shape was written when every entry was a placeholder
 * and does not survive real people: three cards divide evenly across a row,
 * where a featured pair plus one lone card underneath is the same orphaned
 * last row already removed from the leadership section twice.
 *
 * Order is deliberate. Fr. Steven and Erin come first because they are who a
 * student actually deals with week to week; Fr. Hank follows, in the slot the
 * old Director of Operations placeholder held. His is arguably the senior role
 * of the three, so if the ministry would rather lead with him, this array is
 * the only thing that needs reordering.
 *
 * Bios are the ministry's own wording, taken from an existing staff page and
 * known to be somewhat dated — kept verbatim rather than rewritten, so nothing
 * here is invented and whoever updates them can see exactly what they are
 * replacing.
 */
export const STAFF: StaffMember[] = [
  {
    name: "Fr. Steven Chabarria",
    role: "Campus Priest",
    bio: "Fr. Steven Chabarria grew up in Tyler and attended school in Whitehouse nearby. St. Mary Magdalene in Flint was his home parish, but before his mother's conversion to Catholicism in 2016, his family also attended Colonial Hills Baptist Church. Fr. Steven enjoys hunting, fishing, and playing disc golf. Before entering the seminary, he studied horticulture for one year at Tarleton State University. Fr. Steven spent four years at Holy Trinity Seminary in Dallas and four years at Notre Dame Seminary in New Orleans. He was ordained a priest in June of 2023. Fr. Steven is overjoyed that his first assignment allows him to work with St. John Paul II Catholic Campus Ministry.",
    photo: "/staff/steven.webp",
  },
  {
    name: "Erin Mone",
    role: "Campus Minister",
    bio: "Having graduated from Franciscan University of Steubenville with a bachelors degree in Catechesis and a focus on youth ministry, Erin is deeply rooted in her Catholic faith. As Campus Minister, Erin has developed a very relational ministry — supporting the students with continual discipleship, leadership training, and personal development. The young men and women in the Catholic Campus Ministry encounter students on campus and invite them to grow deeper in their relationship with Jesus Christ through the sacraments, community, and activities.",
    photo: "/staff/erin.webp",
    email: "campusminister@tylercatholic.org",
  },
  {
    name: "Very Rev. Hank Lanik",
    role: "Administrator",
    bio: "Very Rev. Hank Lanik was born in 1961 in San Antonio, Texas, and grew up in South Texas. He graduated from MacArthur High School in 1979 and attended Southwest Texas State University (now Texas State University) and studied Business Administration and Management. After University Fr. Hank worked for James Avery Craftsman, Inc. managing and opening stores throughout the state of Texas and ending up in Dallas, Texas. While there he left the business world and went to work for the Church as the Director of Youth Ministry of All Saints Catholic Church and the Associate Director of Youth Ministry of the Diocese of Dallas. During that time he became very involved in Catholic Outdoor Ministry and was part of a group of people that opened up The Pines Catholic Camp in East Texas. In 1991 Fr. Hank became the Camp Director and stayed in that ministry for the next 17 years. In 2005 Fr. Hank entered seminary studies at St. Mary's Seminary in Houston, Texas, and was ordained for the Diocese of Tyler on May 28, 2011, at the age of 50. Since ordination Fr. Hank has served in various parishes throughout the Diocese of Tyler as well as a Dean and Chancellor of the Diocese of Tyler. Currently Fr. Hank is the Rector and Pastor of the Cathedral of the Immaculate Conception, the Administrator of John Paul II Campus Ministry at the University of Texas, Tyler, and serves as Vicar for Priests for the Diocese of Tyler.",
    photo: "/staff/hank.webp",
  },
];
