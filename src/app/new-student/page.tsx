import type { Metadata } from "next";
import { RegistrationFlow } from "@/components/newstudent/RegistrationFlow";
import { SITE_CONFIG } from "@/content/site-config";

export const metadata: Metadata = {
  title: "New Student | John Paul II Catholic Campus Ministry",
  description:
    "New to UT Tyler? Tell us a little about yourself and we'll connect you with the people running what you're interested in.",
};

export default function NewStudentPage() {
  return (
    <div className="py-14 sm:py-20">
      <div className="mx-auto max-w-[680px]">
        <div className="text-center">
          <div className="font-ui text-[11px] font-semibold uppercase tracking-[.3em] text-orange">
            New Student
          </div>
          <h1 className="mt-4 font-display text-[38px] font-bold leading-[1.1] text-navy-deep sm:text-h2">
            Let&apos;s get you connected
          </h1>
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.7] text-ink-warm">
            Four short steps. Tell us what you&apos;re into and the person who actually runs it will
            be the one who reaches out — not a mailing list.
          </p>
        </div>

        <div className="mt-10">
          <RegistrationFlow />
        </div>

        <p className="mt-8 text-center text-[13px] leading-[1.7] text-muted">
          Would rather just show up? Sunday Mass is at 10:30 AM and 7:00 PM at{" "}
          {SITE_CONFIG.streetAddress}. No form required, ever.
        </p>
      </div>
    </div>
  );
}
