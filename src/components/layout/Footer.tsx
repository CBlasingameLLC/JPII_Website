import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { SITE_CONFIG } from "@/content/site-config";

export function Footer() {
  return (
    <footer className="bg-navy-black px-5 pb-10 pt-[76px] sm:px-gutter">
      <div className="mx-auto max-w-site">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Logo variant="footer" />
            <p className="mt-[22px] font-accent text-[19px] italic text-gold-light">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          <div>
            <div className="font-ui text-[10px] font-semibold uppercase tracking-[.2em] text-gold-light">
              Visit
            </div>
            <div className="mt-4 text-sm leading-[1.85] text-onnavy">
              <div className="font-bold text-gold-light">{SITE_CONFIG.ministryCenterName}</div>
              <div>{SITE_CONFIG.streetAddress}</div>
              <div>
                {SITE_CONFIG.city}, {SITE_CONFIG.state} {SITE_CONFIG.zip}
              </div>
            </div>
          </div>

          <div>
            <div className="font-ui text-[10px] font-semibold uppercase tracking-[.2em] text-gold-light">
              Contact
            </div>
            <div className="mt-4 text-sm leading-[1.85] text-onnavy">
              <div>{SITE_CONFIG.email}</div>
              <div>{SITE_CONFIG.phone}</div>
              <div>{SITE_CONFIG.instagram}</div>
            </div>
          </div>

          <div>
            <div className="font-ui text-[10px] font-semibold uppercase tracking-[.2em] text-gold-light">
              Stay in the loop
            </div>
            <p className="mt-[14px] text-[13px] leading-[1.6] text-onnavy-dim">
              One email a week. What&apos;s happening, nothing else.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="my-[52px] h-px bg-white/13" />

        <div className="flex flex-wrap items-center justify-between gap-6 font-ui text-xs text-[#6B7A94]">
          <div>
            &copy; {new Date().getFullYear()} {SITE_CONFIG.siteName} &middot;{" "}
            {SITE_CONFIG.university}
          </div>
          <div className="flex gap-6">
            <Link href="/#give" className="text-onnavy-dim transition-colors hover:text-gold-light">
              Give
            </Link>
            <Link href="/#about" className="text-onnavy-dim transition-colors hover:text-gold-light">
              {SITE_CONFIG.diocese}
            </Link>
            <Link href="/#top" className="text-onnavy-dim transition-colors hover:text-gold-light">
              Back to top
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
