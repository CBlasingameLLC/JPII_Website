import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/store/ProductDetail";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="py-10">
      <ProductDetail product={product} />
    </div>
  );
}
