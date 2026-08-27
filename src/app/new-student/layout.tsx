import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NewStudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header theme="light" />
      <main className="mx-auto max-w-site px-5 pb-24 sm:px-gutter">{children}</main>
      <Footer />
    </>
  );
}
