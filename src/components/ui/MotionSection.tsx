"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Scroll-reveal wrapper: fades + translates a section up once as it enters the
 * viewport. Respects prefers-reduced-motion globally via MotionConfig in the
 * root layout.
 *
 * `reveal-pin` is not decoration — Framer serialises the `hidden` variant into
 * the server HTML, so without it every wrapped section ships at opacity 0 and
 * the page paints almost empty until hydration finishes. On phones that reads
 * as the site stuttering awake. The class lets globals.css pin these elements
 * visible below the desktop breakpoint, where the reveal costs more than it
 * adds. See the `reveal-pin` rule in globals.css.
 */
export function MotionSection({ children, className, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      className={cn("reveal-pin", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}
