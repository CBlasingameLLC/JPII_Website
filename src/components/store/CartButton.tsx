"use client";

import { useCart } from "@/components/store/CartProvider";
import { cartItemCount } from "@/lib/cart";

export function CartButton() {
  const { state, openDrawer } = useCart();
  const count = cartItemCount(state);

  return (
    <button
      type="button"
      onClick={openDrawer}
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border text-navy transition-colors hover:border-gold"
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
    >
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M3 4h2l2.6 12.6a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="21" r="1.4" />
        <circle cx="17" cy="21" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange font-ui text-[10px] font-bold text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
