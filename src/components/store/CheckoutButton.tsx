"use client";

import { motion } from "framer-motion";
import { useCart } from "@/components/store/CartProvider";
import type { Product, ProductVariant } from "@/types/store";

type CheckoutButtonProps = {
  product: Product;
  variant: ProductVariant;
};

/** "Add to cart" on the product detail page — adds the selected variant and opens the cart drawer, where the actual Stripe checkout call happens. */
export function CheckoutButton({ product, variant }: CheckoutButtonProps) {
  const { dispatch, openDrawer } = useCart();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      disabled={!variant.inStock}
      onClick={() => {
        dispatch({
          type: "ADD",
          item: {
            variantId: variant.variantId,
            productId: product.productId,
            productSlug: product.slug,
            name: product.name,
            variantName: variant.name,
            price: variant.price,
            image: product.images[0] ?? "",
            quantity: 1,
          },
        });
        openDrawer();
      }}
      className="w-full rounded-pill bg-orange py-4 font-ui text-sm font-bold uppercase tracking-[.12em] text-paper transition-colors duration-150 hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
    >
      {variant.inStock ? "Add to Cart" : "Sold Out"}
    </motion.button>
  );
}
