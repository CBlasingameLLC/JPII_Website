import { ProductCard } from "@/components/store/ProductCard";
import { getAllProducts } from "@/lib/products";

export const metadata = { title: "Store — JPII Catholic Campus Ministry" };

export default function StorePage() {
  const products = getAllProducts();

  return (
    <div className="py-10">
      <h1 className="font-display text-h2 font-bold text-navy-deep">Store</h1>
      <p className="mt-3 max-w-[560px] text-body leading-[1.7] text-ink-warm">
        Merch that helps fund retreats, Sunday lunches, and everything else on this page.
        Printed and shipped by Printful.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
}
