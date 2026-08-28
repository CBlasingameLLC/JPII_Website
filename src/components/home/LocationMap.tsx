"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_PLACES, type MapPlace } from "@/content/site-config";

const CENTER = MAP_PLACES.find((p) => p.kind === "center")!;
const CAMPUSES = MAP_PLACES.filter((p) => p.kind === "campus");

/** Padding around the fitted bounds, so no marker sits against the frame edge. */
const FIT_PADDING: [number, number] = [56, 56];
const MAX_FIT_ZOOM = 15;

/** Great-circle distance in miles — enough precision for "how far is this". */
function milesBetween(a: MapPlace, b: MapPlace): number {
  const R = 3958.8;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

const DISTANCES = CAMPUSES.map((c) => ({ place: c, miles: milesBetween(CENTER, c) }));

/**
 * The ministry's location on a map themed to the site rather than dropped in
 * as a stock embed.
 *
 * Leaflet over raster tiles instead of a Google Maps iframe: an iframe can't
 * be restyled, so it lands as a bright rectangle in the middle of a navy page.
 *
 * Tiles come from OpenStreetMap directly. CARTO's basemaps were used first and
 * had the right look out of the box, but CARTO now stamps "API KEY REQUIRED"
 * across every tile it serves unauthenticated — so those tiles are unusable
 * without a credential the ministry would have to own and renew after handoff.
 * OSM's own tiles need no key and their usage policy covers a site this size.
 * The trade is that they arrive light and colourful, hence the heavier filter
 * in globals.css (.jpii-map): inverted and desaturated first, then tinted to
 * the brand navy.
 *
 * Both campuses are plotted with the Center and the frame is fitted to all
 * three, because the question a new student is really asking is how far this
 * is from where they already are.
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

      const map = L.map(containerRef.current, {
        // Off by default so a scroll down the page doesn't get swallowed by
        // the map; a click turns it on (see the hint overlay below).
        scrollWheelZoom: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      for (const place of MAP_PLACES) {
        const isCenter = place.kind === "center";
        L.marker([place.lat, place.lng], {
          title: place.name,
          zIndexOffset: isCenter ? 1000 : 0,
          icon: L.divIcon({
            className: isCenter ? "jpii-marker" : "jpii-marker jpii-marker--campus",
            html: isCenter
              ? '<span class="jpii-marker-dot"></span><span class="jpii-marker-pulse"></span>'
              : `<span class="jpii-marker-dot"></span><span class="jpii-marker-label">${place.short}</span>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }).addTo(map);
      }

      map.fitBounds(
        L.latLngBounds(MAP_PLACES.map((p) => [p.lat, p.lng] as [number, number])),
        { padding: FIT_PADDING, maxZoom: MAX_FIT_ZOOM }
      );

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
    <div>
      <div className="relative h-[340px] overflow-hidden rounded-panel border border-gold-light/30 sm:h-[420px]">
        <div ref={containerRef} className="jpii-map h-full w-full" />
        {!scrollZoom && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-pill bg-navy-black/70 px-3 py-1.5 font-ui text-[10px] font-semibold uppercase tracking-[.12em] text-gold-light/90">
            Click to zoom
          </div>
        )}
      </div>

      {/* Distances live outside the map rather than in popups — the whole point
          is that they're readable without anyone touching anything. */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
        <li className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-gold-light" />
          <span className="font-ui text-[12.5px] font-semibold text-ivory">The Center</span>
        </li>
        {DISTANCES.map(({ place, miles }) => (
          <li key={place.id} className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full border border-onnavy-dim bg-transparent"
            />
            <span className="font-ui text-[12.5px] text-onnavy">
              {place.short} &middot;{" "}
              <b className="font-semibold text-ivory">{miles.toFixed(1)} mi</b>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
