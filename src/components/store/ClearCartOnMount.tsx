"use client";

import { useEffect } from "react";
import { useCart } from "@/components/store/CartProvider";

export function ClearCartOnMount() {
  const { dispatch } = useCart();
  useEffect(() => {
    dispatch({ type: "CLEAR" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
