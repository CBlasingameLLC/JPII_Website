import productsData from "@/content/products.generated.json";
import type { Product } from "@/types/store";

const PRODUCTS = productsData as Product[];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
