"use client";

import { useState } from "react";
import { ProductGallery } from "@/components/store/ProductGallery";
import { VariantSelector } from "@/components/store/VariantSelector";
import { CheckoutButton } from "@/components/store/CheckoutButton";
import type { Product } from "@/types/store";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.variantId ?? "");
  const selectedVariant =
    product.variants.find((v) => v.variantId === selectedId) ?? product.variants[0];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery images={product.images} alt={product.name} />
      <div>
        <h1 className="font-display text-h3 font-bold text-navy-deep lg:text-h2">
          {product.name}
        </h1>
        <div className="mt-2 font-ui text-xl font-semibold text-orange">
          {formatCents(selectedVariant.price)}
        </div>
        <p className="mt-4 text-body leading-[1.7] text-ink-warm">{product.description}</p>

        <div className="mt-6">
          <VariantSelector
            variants={product.variants}
            selectedId={selectedVariant.variantId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="mt-8">
          <CheckoutButton product={product} variant={selectedVariant} />
        </div>
      </div>
    </div>
  );
}
