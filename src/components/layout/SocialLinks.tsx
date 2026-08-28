import { SITE_CONFIG } from "@/content/site-config";

/**
 * The ministry's social links, as marks rather than words.
 *
 * Both are drawn as the same rounded square so they read as one set instead of
 * two borrowed glyphs — the first pass paired an outlined square with a bare
 * solid "f" and looked accidental. The enclosing circle is gone: the square is
 * already the shape, and ringing it as well made each one look like a button
 * someone forgot to finish.
 *
 * Gold, because on a navy ground gold is the accent in this system — the
 * campus accent only ever appears on light grounds, and gold is deliberately
 * untouched by the campus theme, so these stay correct under both.
 *
 * Inline SVG, not an icon package: two glyphs don't justify a dependency, and
 * inlining means they inherit currentColor and can't arrive late or fail to
 * load. These are the plain geometric marks, not a brand's logo artwork.
 *
 * Each link keeps a visually-hidden label so the destination is announced
 * properly; `title` alone is not reliably read out.
 */
const FRAME = <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />;

const LINKS = [
  {
    name: "Instagram",
    href: SITE_CONFIG.instagramUrl,
    detail: SITE_CONFIG.instagram,
    mark: (
      <>
        {FRAME}
        <circle cx="12" cy="12" r="4.15" />
        <circle cx="17.05" cy="6.95" r="1.15" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: "Facebook",
    href: SITE_CONFIG.facebookUrl,
    detail: "Facebook",
    mark: (
      <>
        {FRAME}
        {/* The f. The translate is not a guess — the glyph's own bounding box
            was measured in the browser at (12.62, 12.31) against the square's
            (12, 12), and this is that difference. An f is asymmetric, so its
            path coordinates never centre on their own. */}
        <path
          d="M13.55 18.4v-5.55h1.86l.35-2.16h-2.21V9.29c0-.62.17-1.05 1.06-1.05h1.13V6.31a15 15 0 0 0-1.65-.09c-1.63 0-2.75.995-2.75 2.825v1.645H9.47v2.16h1.88V18.4Z"
          transform="translate(-0.62 -0.31)"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
] as const;

export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-4 ${className ?? ""}`}>
      {LINKS.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${SITE_CONFIG.shortName} on ${link.name}${
              link.detail !== link.name ? ` — ${link.detail}` : ""
            }`}
            className="block text-gold-light transition-[color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:text-ivory"
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {link.mark}
            </svg>
            <span className="sr-only">{`${link.name} — ${link.detail}`}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
