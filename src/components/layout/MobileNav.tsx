"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CampusSwitch } from "@/components/ui/CampusSwitch";
import { cn } from "@/lib/cn";

type NavLink = { href: string; label: string };

type MobileNavProps = {
  links: NavLink[];
  theme: "dark" | "light";
};

export function MobileNav({ links, theme }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const barColor = theme === "dark" ? "bg-ivory" : "bg-navy";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
      >
        <motion.span
          className={cn("h-0.5 w-6 rounded", barColor)}
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className={cn("h-0.5 w-6 rounded", barColor)}
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className={cn("h-0.5 w-6 rounded", barColor)}
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.15 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute inset-x-0 top-full z-50 overflow-hidden border-b",
              theme === "dark"
                ? "bg-navy border-white/14"
                : "bg-paper border-navy"
            )}
          >
            <nav className="flex flex-col gap-1 px-gutter py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-11 flex items-center py-3 font-ui text-xs font-semibold uppercase tracking-[.13em]",
                    theme === "dark" ? "text-onnavy" : "text-ink-warm"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* The header's own switch lives in the desktop-only nav, so
                  without this a phone would only ever find it in the footer. */}
              <div
                className={cn(
                  "mt-2 border-t pt-4",
                  theme === "dark" ? "border-white/14" : "border-border"
                )}
              >
                <CampusSwitch className={theme === "dark" ? "text-onnavy-dim" : "text-muted"} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
