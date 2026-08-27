"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { SITE_CONFIG } from "@/content/site-config";

const ZOOM = 16;

/**
 * The ministry's location on a map themed to the site rather than dropped in
 * as a stock embed.
 *
 * Leaflet over CARTO's basemap instead of a Google Maps iframe: an iframe
 * can't be restyled, so it lands as a bright rectangle in the middle of a
 * navy page. Tiles here are filtered toward the brand navy and the marker is
 * the brand gold, so the map reads as part of the page. No API key either —
 * one less credential for the ministry to own after handoff.
 *
 * Leaflet is imported inside the effect because it touches `window` at module
 * scope, which breaks the server pre-render of this client component.
 */
export function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [scrollZoom, setScrollZoom] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const { lat, lng } = SITE_CONFIG.coords;
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: ZOOM,
        // Off by default so a scroll down the page doesn't get swallowed by
        // the map; a click turns it on (see the hint overlay below).
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng], {
        title: SITE_CONFIG.siteName,
        icon: L.divIcon({
          className: "jpii-marker",
          html: `<span class="jpii-marker-dot"></span><span class="jpii-marker-pulse"></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        }),
      }).addTo(map);

      map.on("click", () => {
        map.scrollWheelZoom.enable();
        setScrollZoom(true);
      });
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-[340px] overflow-hidden rounded-panel border border-gold-light/30 sm:h-[420px]">
      <div ref={containerRef} className="jpii-map h-full w-full" />
      {!scrollZoom && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-pill bg-navy-black/70 px-3 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[.12em] text-gold-light/90 backdrop-blur-sm">
          Click to zoom
        </div>
      )}
    </div>
  );
}
