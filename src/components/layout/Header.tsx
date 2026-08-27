"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { Pill } from "@/components/ui/Pill";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/#week", label: "Mass & Confession" },
  { href: "/new-student", label: "New Student" },
  { href: "/#events", label: "Events" },
  { href: "/#involved", label: "Get Involved" },
  { href: "/#about", label: "About" },
];

const TALL_HEIGHT = 88;
const SHORT_HEIGHT = 64;
const SCROLL_THRESHOLD = 48;

type HeaderProps = {
  theme?: "dark" | "light";
};

/** Sticky site header. "Mass & Confession" is first in nav order on purpose — per the design handoff, it's the most-wanted link. */
export function Header({ theme = "dark" }: HeaderProps) {
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 relative",
        isDark ? "bg-navy border-b border-white/14" : "bg-paper border-b-2 border-navy"
      )}
    >
      <motion.div
        className="mx-auto flex max-w-site items-center justify-between gap-10 overflow-hidden px-5 sm:px-gutter"
        initial={false}
        animate={{ height: scrolled ? SHORT_HEIGHT : TALL_HEIGHT }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Link href="/#top" className="flex items-center">
          <motion.div
            initial={false}
            animate={{ scale: scrolled ? 0.8 : 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
          >
            <Logo variant={isDark ? "header-dark" : "header-light"} />
          </motion.div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-ui text-xs font-semibold uppercase tracking-[.13em] transition-colors duration-150",
                isDark
                  ? link.href === "/#week"
                    ? "text-ivory hover:text-gold-light"
                    : "text-onnavy hover:text-gold-light"
                  : link.href === "/#week"
                    ? "text-navy hover:text-gold"
                    : "text-ink-warm hover:text-gold"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Pill href="/#give" variant="gold" size="sm">
            Give
          </Pill>
        </nav>

        <MobileNav
          links={[...NAV_LINKS, { href: "/#give", label: "Give" }]}
          theme={theme}
        />
      </motion.div>
    </header>
  );
}
