"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const PETAL =
  "M0,-4 C -14,-4 -24,-14 -24,-26 C -24,-36 -16,-44 -8,-44 C -4,-44 -1,-41 0,-38 C 1,-41 4,-44 8,-44 C 16,-44 24,-36 24,-26 C 24,-14 14,-4 0,-4 Z";
const PETAL_ROTATIONS = [0, 72, 144, 216, 288];

/**
 * Ambient decorative rose, quietly turning as the page scrolls — a
 * restrained nod to the heraldic rose already in the brand assets
 * (rose-gold.svg / rose-one-color.svg), otherwise unused on the homepage.
 * Desktop only (a fixed background element has no good home on a narrow
 * mobile viewport); renders nothing under prefers-reduced-motion since it's
 * decorative, not load-bearing.
 */
export function ScrollRose() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.06, 0.9, 1], [0, 0.1, 0.1, 0]);

  if (prefersReducedMotion) return null;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-1/2 z-0 hidden h-[420px] w-[420px] translate-x-1/3 text-gold-light lg:block"
      style={{ rotate, opacity, translateY: "-50%" }}
    >
      <g transform="translate(50,50)">
        <g fill="currentColor">
          {PETAL_ROTATIONS.map((deg) => (
            <path key={deg} d={PETAL} transform={deg ? `rotate(${deg})` : undefined} />
          ))}
        </g>
        <g fill="currentColor" transform="rotate(36) scale(.58)">
          {PETAL_ROTATIONS.map((deg) => (
            <path key={deg} d={PETAL} transform={deg ? `rotate(${deg})` : undefined} />
          ))}
        </g>
        <circle r="9.5" fill="#F6F1E6" />
        <circle r="3.6" fill="currentColor" />
      </g>
    </motion.svg>
  );
}
