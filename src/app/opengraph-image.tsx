import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/content/site-config";

export const alt = "John Paul II Catholic Campus Ministry — UT Tyler";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Typographic card, not a photo — matches the "sacred gold" lockup variant
// (Logo.tsx's "footer" style) rather than the orange "campus" one, since
// this is the ambassador image for shared links, not a page chrome element.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#04162F",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "radial-gradient(circle at 50% 38%, #0A2A5E 0%, #04162F 72%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 100 142" width={84} height={119}>
            <path
              d="M38,6 L62,6 L58,18 L58,40 L80,40 L92,34 L92,62 L80,56 L58,56 L58,124 L64,136 L36,136 L42,124 L42,56 L20,56 L8,62 L8,34 L20,40 L42,40 L42,18 Z"
              fill="#E7C877"
            />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: 34,
              fontSize: 100,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: "#F6F1E6" }}>JP</span>
            <span style={{ color: "#E7C877", marginLeft: 8 }}>II</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.32em",
              color: "#9FB0CC",
            }}
          >
            CATHOLIC CAMPUS MINISTRY
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 44,
              fontSize: 28,
              color: "#E7C877",
            }}
          >
            {SITE_CONFIG.tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 19,
              color: "#6B7A94",
            }}
          >
            {SITE_CONFIG.university}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
