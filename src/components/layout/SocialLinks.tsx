import { SITE_CONFIG } from "@/content/site-config";

/**
 * Platform icons rather than the words "Instagram" and "Facebook".
 *
 * Inline SVG, not an icon package: two glyphs don't justify a dependency, and
 * inlining means they inherit currentColor and can't arrive late or fail to
 * load. Paths are the plain geometric marks — a rounded square with a circle
 * for Instagram, the lowercase f for Facebook — so nothing here reproduces a
 * brand's actual logo artwork.
 *
 * Each link keeps a visually-hidden text label so the destination is announced
 * properly; `title` alone is not reliably read out.
 */
const LINKS = [
  {
    name: "Instagram",
    href: SITE_CONFIG.instagramUrl,
    detail: SITE_CONFIG.instagram,
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: SITE_CONFIG.facebookUrl,
    detail: "Facebook",
    // Solid glyph, so it overrides the stroked defaults the Instagram mark uses.
    path: (
      <path
        d="M14.5 8.5h2.2V5.6h-2.6c-2.2 0-3.6 1.4-3.6 3.7v1.9H8.2v3h2.3V21h3.1v-6.8h2.3l.4-3h-2.7v-1.5c0-.7.3-1.2.9-1.2Z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="flex items-center gap-3">
        {LINKS.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${SITE_CONFIG.shortName} on ${link.name}${link.detail !== link.name ? ` — ${link.detail}` : ""}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-onnavy transition-colors duration-150 hover:border-gold-light hover:bg-gold-light hover:text-navy"
            >
              <svg
                viewBox="0 0 24 24"
                width="17"
                height="17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {link.path}
              </svg>
              <span className="sr-only">{`${link.name} — ${link.detail}`}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
