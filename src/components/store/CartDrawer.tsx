"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/store/CartProvider";
import { cartTotalCents } from "@/lib/cart";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CartDrawer() {
  const { state, dispatch, isDrawerOpen, closeDrawer } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function checkout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setCheckingOut(false);
    }
  }

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[400px] flex-col bg-paper p-6 shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-navy-deep">Your Cart</h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center text-ink-warm"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              {state.items.length === 0 ? (
                <p className="text-sm text-ink-warm">Your cart is empty.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {state.items.map((item) => (
                    <li key={item.variantId} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-ui text-sm font-semibold text-navy-deep">
                          {item.name}
                        </div>
                        <div className="text-xs text-ink-warm">{item.variantName}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "SET_QTY",
                                variantId: item.variantId,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="h-6 w-6 rounded border border-border text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "SET_QTY",
                                variantId: item.variantId,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="h-6 w-6 rounded border border-border text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="font-ui text-sm font-semibold text-navy-deep">
                        {formatCents(item.price * item.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="mt-6 border-t border-border pt-4">
                <div className="flex items-center justify-between font-ui text-sm font-semibold text-navy-deep">
                  <span>Subtotal</span>
                  <span>{formatCents(cartTotalCents(state))}</span>
                </div>
                <button
                  type="button"
                  onClick={checkout}
                  disabled={checkingOut}
                  className="mt-4 w-full rounded-pill bg-orange py-3 font-ui text-sm font-bold uppercase tracking-[.1em] text-paper transition-colors hover:bg-navy disabled:opacity-60"
                >
                  {checkingOut ? "Redirecting…" : "Checkout"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
