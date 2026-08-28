"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUpSmall, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/cn";

/* `reveal-pin` on both halves: the hidden variant is serialised into the server
   HTML, so these would otherwise ship invisible. See globals.css. */
export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn("reveal-pin", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer()}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={cn("reveal-pin", className)} variants={fadeUpSmall}>
      {children}
    </motion.div>
  );
}
