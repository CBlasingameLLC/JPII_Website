import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { LocationMap } from "@/components/home/LocationMap";
import { SITE_CONFIG } from "@/content/site-config";

const fullAddress = `${SITE_CONFIG.streetAddress}, ${SITE_CONFIG.city}, ${SITE_CONFIG.state} ${SITE_CONFIG.zip}`;
const encoded = encodeURIComponent(fullAddress);

const DIRECTIONS = [
  { label: "Google Maps", href: `https://www.google.com/maps/dir/?api=1&destination=${encoded}` },
  { label: "Apple Maps", href: `https://maps.apple.com/?daddr=${encoded}` },
];

export function Location() {
  return (
    <section
      id="location"
      className="bg-[linear-gradient(180deg,#04162F,#061E45)] px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto grid max-w-site grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <SectionEyebrow label="Find Us" tone="navy" />
          <h2 className="mt-4 font-display text-h2 font-bold leading-[1.15] text-ivory">
            It&apos;s the building with the cross
          </h2>
          <p className="mt-5 max-w-[460px] text-[17px] leading-[1.7] text-onnavy">
            Five minutes from campus, on Old Omen Road. Park anywhere in the lot — nobody gets
            towed, and the door on the front is the right one.
          </p>

          <address className="mt-8 not-italic">
            <div className="font-display text-[20px] font-bold text-gold-light">
              {SITE_CONFIG.streetAddress}
            </div>
            <div className="mt-1 text-[15px] text-onnavy">
              {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
            </div>
            <div className="mt-4 flex flex-col gap-1 text-[15px]">
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/[^\d+]/g, "")}`}
                className="text-onnavy hover:text-gold-light"
              >
                {SITE_CONFIG.phone}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-onnavy hover:text-gold-light">
                {SITE_CONFIG.email}
              </a>
            </div>
          </address>

          <div className="mt-8 flex flex-wrap gap-3">
            {DIRECTIONS.map((d) => (
              <a
                key={d.label}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-pill border border-gold-light/40 px-5 py-3 font-ui text-[11px] font-bold uppercase tracking-[.12em] text-gold-light transition-colors duration-150 hover:bg-gold-light hover:text-navy"
              >
                {d.label} ↗
              </a>
            ))}
          </div>
        </div>

        <LocationMap />
      </div>
    </section>
  );
}
