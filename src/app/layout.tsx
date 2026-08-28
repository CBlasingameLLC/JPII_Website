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

/* Only the weights actually used. Every weight is a separate file fetched on
   first load, and unused ones are pure startup cost. Cinzel appears with
   font-bold throughout; 600 is kept for the handful of unweighted uses. */
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
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
  /* Without `capable`, iOS ignores the manifest's display:standalone and opens
     the installed icon in a browser view. `black-translucent` then lets the
     page paint its own background up behind the status bar instead of iOS
     reserving an opaque strip there in a colour we do not control — which is
     what left a mismatched band above the header on a notched phone. It pairs
     with viewportFit "cover" below and the safe-area padding on the header.
     The light-header routes override this — see store/give/new-student
     layouts — because a translucent bar draws its clock in white. */
  appleWebApp: {
    capable: true,
    title: "JPII",
    statusBarStyle: "black-translucent",
  },
  /* Next emits only the modern `mobile-web-app-capable`, which iOS does not
     recognise. iOS 16.4+ reads standalone from the manifest instead, but
     anything older needs this legacy tag to run standalone at all — and
     without standalone, the status-bar style above is ignored too. */
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  /* Matches the dark header. Kept in step with the campus theme at runtime by
     ui/CampusSwitch, which repoints this meta at the header's real colour. */
  themeColor: "#003876",
  // Lets the page extend into the safe areas, so env(safe-area-inset-*) is
  // non-zero and the header can paint behind the notch.
  viewportFit: "cover",
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
