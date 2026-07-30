export type ProductVariant = {
  variantId: string;
  name: string; // e.g. "Navy / Medium"
  price: number; // cents
  inStock: boolean;
};

export type Product = {
  productId: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
};

export type CartItem = {
  variantId: string;
  productId: string;
  productSlug: string;
  name: string;
  variantName: string;
  price: number; // cents
  image: string;
  quantity: number;
};
