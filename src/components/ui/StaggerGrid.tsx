"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUpSmall, staggerContainer } from "@/lib/motion";

export function StaggerGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
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
    <motion.div className={className} variants={fadeUpSmall}>
      {children}
    </motion.div>
  );
}
