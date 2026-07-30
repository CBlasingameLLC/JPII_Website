"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, cartReducer, type CartAction, type CartState } from "@/lib/cart";

type CartContextValue = {
  state: CartState;
  dispatch: (action: CartAction) => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      try {
        dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
      } catch {
        // corrupt localStorage value — ignore and start with an empty cart
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        isDrawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
