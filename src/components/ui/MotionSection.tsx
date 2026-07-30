"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/** Scroll-reveal wrapper: fades + translates a section up once as it enters the viewport. Respects prefers-reduced-motion globally via MotionConfig in the root layout. */
export function MotionSection({ children, className, id }: MotionSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}
