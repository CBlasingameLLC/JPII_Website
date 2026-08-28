"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Pill } from "@/components/ui/Pill";
import { MobileNav } from "@/components/layout/MobileNav";
import { CampusSwitch } from "@/components/ui/CampusSwitch";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/#week", label: "Mass & Confession" },
  { href: "/new-student", label: "New Student" },
  { href: "/#events", label: "Events" },
  { href: "/#involved", label: "Get Involved" },
  { href: "/#about", label: "About" },
];

const SCROLL_THRESHOLD = 48;

type HeaderProps = {
  theme?: "dark" | "light";
};

/**
 * Sticky site header. "Mass & Confession" is first in nav order on purpose —
 * per the design handoff, it's the most-wanted link.
 *
 * The shrink-on-scroll is CSS driven off `data-scrolled` rather than an
 * animated height. Animating height on a sticky element reflows everything
 * below it for the length of the transition, which on a phone lands as a
 * judder at the top of every scroll; the CSS version is also restricted to
 * desktop, where the header is tall enough for the shrink to be worth
 * anything. See the `.site-header` rules in globals.css.
 */
export function Header({ theme = "dark" }: HeaderProps) {
  const isDark = theme === "dark";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    function onScroll() {
      // Coalesced into one read per frame: scroll fires far faster than the
      // page can paint, and each handler reading scrollY is a layout read.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "site-header sticky top-0 z-50 relative",
        isDark ? "bg-navy border-b border-white/14" : "bg-paper border-b-2 border-navy"
      )}
    >
      <div className="header-inner mx-auto flex max-w-site items-center justify-between gap-10 overflow-hidden px-5 sm:px-gutter">
        <Link href="/#top" className="flex items-center">
          <div className="header-logo">
            <Logo variant={isDark ? "header-dark" : "header-light"} />
          </div>
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
          <CampusSwitch className={isDark ? "text-onnavy-dim" : "text-muted"} />
          <Pill href="/#give" variant="gold" size="sm">
            Give
          </Pill>
        </nav>

        <MobileNav
          links={[...NAV_LINKS, { href: "/#give", label: "Give" }]}
          theme={theme}
        />
      </div>
    </header>
  );
}
