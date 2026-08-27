import type { Metadata, Viewport } from "next";
import { Cinzel, Archivo, Cormorant_Garamond } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { getSiteUrl } from "@/lib/stripe";
import "./globals.css";

const TITLE = "John Paul II Catholic Campus Ministry — UT Tyler";
const DESCRIPTION =
  "A Catholic home on campus at The University of Texas at Tyler — Mass times, confession, events, and how to get involved.";

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
  metadataBase: new URL(getSiteUrl()),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/assets/favicon.svg" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "John Paul II Catholic Campus Ministry",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-ui">
        {/* Applies the saved campus accent before anything paints. Inline and
            synchronous on purpose — deferring it to an effect would show UT
            Tyler orange for a frame to a TJC student on every page load.
            The server can't know the choice, hence suppressHydrationWarning
            on <html>. See components/ui/CampusSwitch.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('jpii-campus')==='tjc'){document.documentElement.dataset.campus='tjc'}}catch(e){}",
          }}
        />
        <MotionConfig reducedMotion="user">
          {children}
          <RegisterServiceWorker />
          <InstallPrompt />
        </MotionConfig>
      </body>
    </html>
  );
}
