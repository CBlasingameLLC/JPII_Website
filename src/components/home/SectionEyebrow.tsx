import { cn } from "@/lib/cn";

type SectionEyebrowProps = {
  label: string;
  /** "light" = orange label + gold-solid rule (ivory/paper grounds). "navy" = gold label + translucent-gold rule (navy grounds). */
  tone?: "light" | "navy";
  ruleClassName?: string;
};

/** The eyebrow-label + fading rule that opens every homepage section but the hero. The H2 itself stays in each section, since its color/margin varies enough (light vs navy ground, inline right-aligned links) that forcing it into this atom would fight the design rather than serve it. */
export function SectionEyebrow({ label, tone = "light", ruleClassName }: SectionEyebrowProps) {
  return (
    <div className="flex items-center gap-[13px]">
      <span
        className={cn(
          "font-ui text-[11px] font-semibold uppercase tracking-[.3em]",
          tone === "navy" ? "text-gold-light" : "text-orange"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "h-px",
          tone === "navy"
            ? "bg-[linear-gradient(90deg,rgba(231,200,119,.6),transparent)]"
            : "bg-[linear-gradient(90deg,#C8A24B,transparent)]",
          ruleClassName ?? "w-20"
        )}
      />
    </div>
  );
}
