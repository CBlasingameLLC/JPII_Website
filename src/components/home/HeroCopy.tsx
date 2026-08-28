"use client";

import { motion } from "framer-motion";
import { Pill } from "@/components/ui/Pill";
import { heroStagger, fadeUpSmall } from "@/lib/motion";
import { SITE_CONFIG } from "@/content/site-config";

/** Staggered entrance on page load (not scroll-triggered — it's above the fold). */
export function HeroCopy() {
  return (
    <motion.div className="reveal-pin" initial="hidden" animate="visible" variants={heroStagger}>
      {/* Both schools, stacked. Run together on one line they wrap mid-name at
          almost every width; on their own lines they read as a list. The rule
          sits against the first line rather than centring on the block. */}
      <motion.div variants={fadeUpSmall} className="reveal-pin flex items-start gap-[13px]">
        <span className="mt-[7px] h-px w-11 flex-none bg-gold-light" />
        <span className="font-ui text-[11px] font-semibold uppercase leading-[1.7] tracking-[.24em] text-gold-light">
          {SITE_CONFIG.university}
          <br />
          {SITE_CONFIG.partnerSchool}
        </span>
      </motion.div>

      {SITE_CONFIG.heroType === "sacred" ? (
        <motion.h1
          variants={fadeUpSmall}
          className="reveal-pin mt-[22px] font-display text-[44px] font-bold leading-[1.04] text-ivory lg:text-h1sacred"
        >
          Be Disciples,
          <br />
          Make Disciples.
        </motion.h1>
      ) : (
        <motion.h1
          variants={fadeUpSmall}
          className="reveal-pin mt-[22px] font-ui text-[44px] font-bold leading-[.98] tracking-[-.02em] text-ivory lg:text-hero"
        >
          Be Disciples,
          <br />
          Make <span className="text-gold-light">Disciples.</span>
        </motion.h1>
      )}

      <motion.p
        variants={fadeUpSmall}
        className="reveal-pin mt-[22px] max-w-[520px] text-lg leading-[1.65] text-onnavy"
      >
        A Catholic home on campus — the sacraments, real friendship, and a place to actually
        figure out what you believe. Come as you are, Sunday or any day.
      </motion.p>

      <motion.div variants={fadeUpSmall} className="reveal-pin mt-[34px] flex flex-wrap gap-[14px]">
        <Pill href="#week" variant="gold">
          Mass Times
        </Pill>
        <Pill href="#newhere" variant="ghost">
          I&apos;m New Here
        </Pill>
      </motion.div>
    </motion.div>
  );
}
