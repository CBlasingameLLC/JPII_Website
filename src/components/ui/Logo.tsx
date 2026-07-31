import { Cross } from "@/components/ui/Cross";
import { SITE_CONFIG } from "@/content/site-config";

type LogoVariant = "header-dark" | "header-light" | "footer";

/**
 * Header variants use the Brand Board's "Sacred Cut" treatment (4b): Cinzel
 * instead of Archivo, gold instead of orange, full "St. John Paul II" name
 * instead of the abbreviated "JPII" mark — a deliberate departure from the
 * board's own "best for: site header" note on the orange Campus Cut (4a),
 * per direct request. The abbreviated JP/II mark is kept for the footer
 * (unchanged) and as the header's own small-mobile fallback, since "St. John
 * Paul II" spelled out at a legible size doesn't reliably fit next to the
 * hamburger button below the `sm` breakpoint.
 */
const HEADER_STYLES: Record<
  "header-dark" | "header-light",
  {
    crossColor: string;
    nameColor: string;
    accentColor: string;
    ministryColor: string;
    crossWidth: number;
    crossHeight: number;
    namePx: string;
    ministryPx: string;
  }
> = {
  "header-dark": {
    crossColor: "#E7C877",
    nameColor: "#F6F1E6",
    accentColor: "#E7C877",
    ministryColor: "#9FB0CC",
    crossWidth: 26,
    crossHeight: 37,
    namePx: "20px",
    ministryPx: "8px",
  },
  "header-light": {
    crossColor: "#C8A24B",
    nameColor: "#003876",
    accentColor: "#C8A24B",
    ministryColor: "#6B7A94",
    crossWidth: 26,
    crossHeight: 37,
    namePx: "20px",
    ministryPx: "8px",
  },
};

const FOOTER_STYLE = {
  crossColor: "#E7C877",
  jpColor: "#F6F1E6",
  iiColor: "#E7C877",
  ministryColor: "#9FB0CC",
  crossWidth: 30,
  crossHeight: 43,
  wordmarkPx: "30px",
  ministryPx: "7.5px",
};

type LogoProps = {
  variant: LogoVariant;
  className?: string;
};

/**
 * Header/footer lockup rendered as live styled text + an inline cross SVG,
 * matching how Website Draft.dc.html builds it (not the packaged lockup
 * SVGs) — live DOM text renders Archivo/Cinzel more crisply than an <img>
 * of an SVG with embedded text.
 */
export function Logo({ variant, className }: LogoProps) {
  if (variant === "footer") {
    const s = FOOTER_STYLE;
    return (
      <span className={`flex items-center gap-4 ${className ?? ""}`}>
        <Cross width={s.crossWidth} height={s.crossHeight} color={s.crossColor} />
        <span>
          <span
            className="flex items-baseline font-ui font-bold leading-[0.86] tracking-[-.01em]"
            style={{ fontSize: s.wordmarkPx }}
          >
            <span style={{ color: s.jpColor }}>JP</span>
            <span style={{ color: s.iiColor, marginLeft: "2px" }}>II</span>
          </span>
          <span
            className="mt-[5px] block font-ui font-semibold tracking-[.2em]"
            style={{ fontSize: s.ministryPx, color: s.ministryColor }}
          >
            CATHOLIC CAMPUS MINISTRY
          </span>
        </span>
        <span className="sr-only">{SITE_CONFIG.siteName}</span>
      </span>
    );
  }

  const s = HEADER_STYLES[variant];

  return (
    <span className={`flex items-center gap-3 ${className ?? ""}`}>
      <Cross width={s.crossWidth} height={s.crossHeight} color={s.crossColor} />
      <span>
        {/* Small mobile (<sm): abbreviated mark, guaranteed to fit next to the hamburger button. */}
        <span
          className="flex items-baseline font-ui font-bold leading-[0.86] tracking-[-.01em] sm:hidden"
          style={{ fontSize: "26px" }}
        >
          <span style={{ color: s.nameColor }}>JP</span>
          <span style={{ color: s.accentColor, marginLeft: "2px" }}>II</span>
        </span>
        {/* sm and up: full name, Sacred Cut treatment. */}
        <span
          className="hidden items-baseline whitespace-nowrap font-display font-bold leading-[0.95] sm:flex"
          style={{ fontSize: s.namePx }}
        >
          <span style={{ color: s.nameColor }}>St.&nbsp;John&nbsp;Paul&nbsp;</span>
          <span style={{ color: s.accentColor }}>II</span>
        </span>
        <span
          className="mt-[5px] hidden font-ui font-semibold tracking-[.2em] sm:block"
          style={{ fontSize: s.ministryPx, color: s.ministryColor }}
        >
          CATHOLIC CAMPUS MINISTRY
        </span>
      </span>
      <span className="sr-only">{SITE_CONFIG.siteName}</span>
    </span>
  );
}
