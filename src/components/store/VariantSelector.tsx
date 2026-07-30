"use client";

import { cn } from "@/lib/cn";
import type { ProductVariant } from "@/types/store";

type VariantSelectorProps = {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
};

export function VariantSelector({ variants, selectedId, onSelect }: VariantSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <button
          key={variant.variantId}
          type="button"
          disabled={!variant.inStock}
          onClick={() => onSelect(variant.variantId)}
          className={cn(
            "rounded-pill border px-4 py-2 font-ui text-sm transition-colors duration-150",
            selectedId === variant.variantId
              ? "border-navy bg-navy text-ivory"
              : "border-border bg-paper text-ink-warm hover:border-gold",
            !variant.inStock && "cursor-not-allowed opacity-40"
          )}
        >
          {variant.name}
          {!variant.inStock && " (Sold out)"}
        </button>
      ))}
    </div>
  );
}
