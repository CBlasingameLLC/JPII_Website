import type { Metadata, Viewport } from "next";
import { Cinzel, Archivo, Cormorant_Garamond } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-cinzel",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "John Paul II Catholic Campus Ministry — UT Tyler",
  description:
    "A Catholic home on campus at The University of Texas at Tyler — Mass times, confession, events, and how to get involved.",
  icons: { icon: "/assets/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#003876",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${archivo.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-ui">
        <MotionConfig reducedMotion="user">
          {children}
          <RegisterServiceWorker />
        </MotionConfig>
      </body>
    </html>
  );
}
