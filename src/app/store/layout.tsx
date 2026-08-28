import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/store/CartProvider";
import { CartDrawer } from "@/components/store/CartDrawer";
import { CartButton } from "@/components/store/CartButton";

/* These routes render the light header, so the phone's status bar has to match
   cream, not the homepage navy — and a translucent bar draws its clock in
   white, which would vanish against it. Overrides the root layout for both.
   See app/layout.tsx. */
export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "JPII", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#FFFDF8",
};

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Header theme="light" />
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-6 sm:px-gutter">
        <Link
          href="/"
          className="font-ui text-xs font-semibold uppercase tracking-[.13em] text-ink-warm transition-colors hover:text-orange"
        >
          &larr; Back to site
        </Link>
        <CartButton />
      </div>
      <main className="mx-auto max-w-site px-5 pb-24 sm:px-gutter">{children}</main>
      <CartDrawer />
      <Footer />
    </CartProvider>
  );
}
