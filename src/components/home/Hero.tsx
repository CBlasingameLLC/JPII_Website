import { NextMassCard } from "@/components/home/NextMassCard";
import { HeroCopy } from "@/components/home/HeroCopy";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { formatNextMassWhen, getChicagoNow, nextSundayMass } from "@/lib/time";
import { SUNDAY_MASS_TIME } from "@/content/site-config";

export function Hero() {
  const now = getChicagoNow();
  const target = nextSundayMass(now, SUNDAY_MASS_TIME);
  const initialWhen = formatNextMassWhen(target, now, SUNDAY_MASS_TIME);

  return (
    <section
      id="top"
      className="relative flex min-h-[520px] items-end bg-navy-deep lg:min-h-[660px]"
    >
      <div className="absolute inset-0">
        <ImagePlaceholder src={null} alt="Students at Mass or a community night" priority />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,30,69,.72)_0%,rgba(6,30,69,.42)_42%,rgba(6,30,69,.92)_100%)]" />

      <div className="relative mx-auto grid w-full max-w-site grid-cols-1 gap-10 px-5 pb-12 pt-20 sm:px-gutter lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pb-16 lg:pt-24">
        <HeroCopy />
        <NextMassCard initialWhen={initialWhen} />
      </div>
    </section>
  );
}
