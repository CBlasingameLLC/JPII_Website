export type HeroSlide = {
  src: string | null;
  alt: string;
};

/**
 * Background slides for the Hero. Currently just the ornamental placeholder
 * (src: null) — add real photos once available, e.g.:
 *   { src: "/assets/hero/community-night.jpg", alt: "Students at a Wednesday community night" }
 * Drop the file in public/assets/hero/ and add an entry here — the
 * slideshow mechanism (crossfade + gradient overlays) already handles any
 * number of slides, no other code changes needed.
 */
export const HERO_SLIDES: HeroSlide[] = [
  { src: null, alt: "Students at Mass or a community night" },
];
