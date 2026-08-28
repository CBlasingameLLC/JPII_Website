import { NextMassCard } from "@/components/home/NextMassCard";
import { HeroCopy } from "@/components/home/HeroCopy";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { getChicagoNow } from "@/lib/time";
import { adorationStatus, occurrenceStatus } from "@/lib/liturgy-status";
import { getLiturgicalSeason } from "@/lib/liturgical";
import { CONFESSION_WINDOWS, MASS_WINDOWS } from "@/content/site-config";

export function Hero() {
  const now = getChicagoNow();
  const initialMass = occurrenceStatus(now, MASS_WINDOWS, "Mass is happening now");
  const initialConfession = occurrenceStatus(now, CONFESSION_WINDOWS, "Confession is happening now");
  const initialAdoration = adorationStatus(now);
  const season = getLiturgicalSeason(now);

  return (
    <section
      id="top"
      className="relative flex min-h-[520px] items-end bg-navy-deep lg:min-h-[660px]"
    >
      <div className="absolute inset-0">
        <HeroSlideshow alt="Students at Mass or a community night" />
      </div>
      {/* Circular vignette so a photo blends into the navy theme at the edges rather than reading as a hard-edged rectangle dropped on the page. */}
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--hero-vignette)]" />
      {/* Linear fade guarantees text legibility at the bottom regardless of what the photo/vignette above look like. */}
      <div className="pointer-events-none absolute inset-0 bg-[image:var(--hero-scrim)]" />

      <div className="relative mx-auto grid w-full max-w-site grid-cols-1 gap-10 px-5 pb-12 pt-20 sm:px-gutter lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pb-16 lg:pt-24">
        <HeroCopy />
        <NextMassCard
          initialMass={initialMass}
          initialConfession={initialConfession}
          initialAdoration={initialAdoration}
          season={season}
        />
      </div>
    </section>
  );
}
