import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Pill } from "@/components/ui/Pill";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/#week", label: "Mass & Confession" },
  { href: "/#events", label: "Events" },
  { href: "/#involved", label: "Get Involved" },
  { href: "/#about", label: "About" },
];

type HeaderProps = {
  theme?: "dark" | "light";
};

/** Sticky site header. "Mass & Confession" is first in nav order on purpose — per the design handoff, it's the most-wanted link. */
export function Header({ theme = "dark" }: HeaderProps) {
  const isDark = theme === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 relative",
        isDark ? "bg-navy border-b border-white/14" : "bg-paper border-b-2 border-navy"
      )}
    >
      <div className="mx-auto flex h-[88px] max-w-site items-center justify-between gap-10 px-5 sm:px-gutter">
        <Link href="/#top" className="flex items-center">
          <Logo variant={isDark ? "header-dark" : "header-light"} />
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
                    ? "text-navy hover:text-orange"
                    : "text-ink-warm hover:text-orange"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Pill href="/#give" variant={isDark ? "gold" : "orange"} size="sm">
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
