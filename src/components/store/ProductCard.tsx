import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { Product } from "@/types/store";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductCard({ product }: { product: Product }) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <Link
      href={`/store/${product.slug}`}
      className="group block overflow-hidden rounded-card border border-border bg-paper transition-[border-color,box-shadow] duration-150 hover:border-gold hover:shadow-card"
    >
      <div className="relative h-[220px]">
        <ImagePlaceholder src={product.images[0] ?? null} alt={product.name} />
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-bold text-navy-deep">{product.name}</h3>
        <div className="mt-2 font-ui text-sm font-semibold text-orange">
          From {formatCents(minPrice)}
        </div>
      </div>
    </Link>
  );
}
