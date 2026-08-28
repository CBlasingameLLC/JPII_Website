import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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

export default function NewStudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header theme="light" />
      <main className="mx-auto max-w-site px-5 pb-24 sm:px-gutter">{children}</main>
      <Footer />
    </>
  );
}
