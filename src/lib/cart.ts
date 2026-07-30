import type { CartItem } from "@/types/store";

export type CartState = { items: CartItem[] };

export type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; variantId: string }
  | { type: "SET_QTY"; variantId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; state: CartState };

export const CART_STORAGE_KEY = "jpii-cart";

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.variantId === action.item.variantId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === action.item.variantId
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.variantId !== action.variantId) };
    case "SET_QTY":
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.variantId !== action.variantId) };
      }
      return {
        items: state.items.map((i) =>
          i.variantId === action.variantId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

export function cartTotalCents(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartItemCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}
