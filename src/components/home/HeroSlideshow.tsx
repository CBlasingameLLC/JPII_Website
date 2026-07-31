"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { HERO_SLIDES } from "@/content/hero-slides";

const SLIDE_DURATION_MS = 7000;

/**
 * Crossfades through HERO_SLIDES. AnimatePresence + exit here is fine
 * (unlike DayTabs.tsx/NextMassCard.tsx) — this is purely decorative
 * background imagery, not correctness-critical content, so a stalled exit
 * animation is a cosmetic non-issue, not a stuck-content bug. With today's
 * single placeholder slide this just renders inertly — the interval/fade
 * machinery only becomes visible once a second slide is added.
 */
export function HeroSlideshow({ alt }: { alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), SLIDE_DURATION_MS);
    return () => clearInterval(id);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <AnimatePresence>
      <motion.div
        key={index}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <ImagePlaceholder src={slide.src} alt={slide.alt || alt} priority={index === 0} />
      </motion.div>
    </AnimatePresence>
  );
}
