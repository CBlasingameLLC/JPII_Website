"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const PETAL =
  "M0,-4 C -14,-4 -24,-14 -24,-26 C -24,-36 -16,-44 -8,-44 C -4,-44 -1,-41 0,-38 C 1,-41 4,-44 8,-44 C 16,-44 24,-36 24,-26 C 24,-14 14,-4 0,-4 Z";
const PETAL_ROTATIONS = [0, 72, 144, 216, 288];

function RoseGlyph({ gradientId }: { gradientId: string }) {
  return (
    <>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F6ECC9" />
          <stop offset="55%" stopColor="#E7C877" />
          <stop offset="100%" stopColor="#B98F3C" />
        </radialGradient>
      </defs>
      <g transform="translate(50,50)">
        <g fill={`url(#${gradientId})`}>
          {PETAL_ROTATIONS.map((deg) => (
            <path key={deg} d={PETAL} transform={deg ? `rotate(${deg})` : undefined} />
          ))}
        </g>
        <g fill={`url(#${gradientId})`} transform="rotate(36) scale(.58)">
          {PETAL_ROTATIONS.map((deg) => (
            <path key={`inner-${deg}`} d={PETAL} transform={deg ? `rotate(${deg})` : undefined} />
          ))}
        </g>
        <circle r="9.5" fill="#F6F1E6" />
        <circle r="3.6" fill="#B98F3C" />
      </g>
    </>
  );
}

/**
 * Ambient decorative rose, quietly turning as the page scrolls — a
 * restrained nod to the heraldic rose already in the brand assets
 * (rose-gold.svg / rose-one-color.svg), otherwise unused on the homepage.
 * Two depth layers (larger/fainter/slower "back", original-scale "front")
 * read as genuine parallax rather than one flat rotating shape; a gradient
 * fill and soft glow replace the original flat-color silhouette for a
 * richer, more dimensional feel without introducing new brand colors.
 * Desktop only; renders nothing under prefers-reduced-motion since it's
 * decorative, not load-bearing.
 */
export function ScrollRose() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const backRotate = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const backOpacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 0.06, 0.06, 0]);
  const frontRotate = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const frontOpacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 0.13, 0.13, 0]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* Back layer: larger, slower, fainter — reads as depth behind the front rose. */}
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none fixed right-[-160px] top-[38%] z-0 hidden h-[620px] w-[620px] lg:block"
        style={{ rotate: backRotate, opacity: backOpacity, translateY: "-50%" }}
      >
        <RoseGlyph gradientId="rose-back-gradient" />
      </motion.svg>
      {/* Front layer: original scale, gentle ambient breathing, soft glow. */}
      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none fixed right-0 top-1/2 z-0 hidden h-[420px] w-[420px] translate-x-1/3 lg:block"
        style={{
          rotate: frontRotate,
          opacity: frontOpacity,
          translateY: "-50%",
          filter: "drop-shadow(0 0 26px rgba(231,200,119,.28))",
        }}
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <RoseGlyph gradientId="rose-front-gradient" />
      </motion.svg>
    </>
  );
}
