"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const MotionLink = motion.create(Link);

type PillVariant = "gold" | "ghost" | "orange";
type PillSize = "sm" | "md";

const VARIANT_CLASSES: Record<PillVariant, string> = {
  gold: "bg-gold-light text-navy hover:bg-paper",
  ghost:
    "bg-transparent text-ivory border border-white/45 hover:border-gold-light hover:text-gold-light",
  orange: "bg-orange text-paper hover:bg-navy",
};

const SIZE_CLASSES: Record<PillSize, string> = {
  sm: "px-[22px] py-3 text-xs",
  md: "px-[30px] py-[17px] text-[13px]",
};

type PillProps = {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: PillVariant;
  size?: PillSize;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
};

export function Pill({
  href,
  onClick,
  type = "button",
  variant = "gold",
  size = "md",
  className,
  children,
  disabled,
}: PillProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-pill font-ui font-bold uppercase tracking-[.12em] transition-colors duration-150 ease-out",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    disabled && "pointer-events-none opacity-50",
    className
  );

  if (href) {
    return (
      <MotionLink href={href} className={classes} whileTap={{ scale: 0.97 }}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}
