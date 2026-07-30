import { Cross } from "@/components/ui/Cross";
import { SITE_CONFIG } from "@/content/site-config";

type LogoVariant = "header-dark" | "header-light" | "footer";

const VARIANT_STYLES: Record<
  LogoVariant,
  {
    crossColor: string;
    jpColor: string;
    iiColor: string;
    ministryColor: string;
    crossWidth: number;
    crossHeight: number;
    wordmarkPx: string;
    ministryPx: string;
  }
> = {
  "header-dark": {
    crossColor: "#E06F1D",
    jpColor: "#F6F1E6",
    iiColor: "#E06F1D",
    ministryColor: "#9FB0CC",
    crossWidth: 33,
    crossHeight: 47,
    wordmarkPx: "33px",
    ministryPx: "8px",
  },
  "header-light": {
    crossColor: "#E06F1D",
    jpColor: "#003876",
    iiColor: "#E06F1D",
    ministryColor: "#6B7A94",
    crossWidth: 33,
    crossHeight: 47,
    wordmarkPx: "33px",
    ministryPx: "8px",
  },
  footer: {
    crossColor: "#E7C877",
    jpColor: "#F6F1E6",
    iiColor: "#E7C877",
    ministryColor: "#9FB0CC",
    crossWidth: 30,
    crossHeight: 43,
    wordmarkPx: "30px",
    ministryPx: "7.5px",
  },
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
  const s = VARIANT_STYLES[variant];
  const isHeader = variant !== "footer";

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
          className={`mt-[5px] block font-ui font-semibold tracking-[.2em] ${
            isHeader ? "hidden sm:block" : ""
          }`}
          style={{ fontSize: s.ministryPx, color: s.ministryColor }}
        >
          CATHOLIC CAMPUS MINISTRY
        </span>
      </span>
      <span className="sr-only">{SITE_CONFIG.siteName}</span>
    </span>
  );
}
