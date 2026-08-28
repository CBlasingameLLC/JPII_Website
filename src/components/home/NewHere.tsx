import { SectionEyebrow } from "@/components/home/SectionEyebrow";
import { Pill } from "@/components/ui/Pill";
import { INTERESTS } from "@/content/interests";

/**
 * The one place on the homepage that points at /new-student.
 *
 * This replaced a three-step "here's exactly what happens" explainer, which
 * described walking through a door in more detail than walking through a door
 * needs. What a first-time student actually wants to know is who is going to
 * talk to them and when — so this section describes the mechanism instead of
 * narrating the experience, and hands off to the form that starts it.
 *
 * The interest chips are read from content/interests.ts rather than retyped,
 * so the preview can never drift out of sync with the form's real options.
 */
const PREVIEW_INTERESTS = INTERESTS.slice(0, 6);

export function NewHere() {
  return (
    <section
      id="newhere"
      className="border-b border-[#EBE3CE] bg-ivory px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto grid max-w-site grid-cols-1 gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
        <div>
          <SectionEyebrow label="New Here" />
          <h2 className="mt-4 max-w-[520px] font-display text-h2 font-bold leading-[1.15] text-navy-deep">
            A real person, not a mailing list
          </h2>
          <div className="mt-6 flex max-w-[520px] flex-col gap-5 text-[17px] leading-[1.7] text-ink-warm">
            <p>
              Tell us what you&apos;re into and we hand your name to the student who actually runs
              that thing — the one leading the Wednesday study, or organising the service days.
              They&apos;re the one who texts you.
            </p>
            <p>
              It works for UT Tyler and TJC both. You don&apos;t need to be Catholic, sure about any
              of it, or free on a particular night.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Pill href="/new-student" variant="orange">
              Get connected
            </Pill>
            <span className="font-ui text-[12.5px] text-muted">
              About a minute · four short steps
            </span>
          </div>

          <p className="mt-8 max-w-[460px] border-l-2 border-border pl-4 text-[15px] leading-[1.7] text-muted">
            Or skip all of it and come Sunday — <b className="text-ink-warm">10:30 AM</b> or{" "}
            <b className="text-ink-warm">7:00 PM</b>. There&apos;s no sign-in table and there never
            will be.
          </p>
        </div>

        {/* A flat preview of the form rather than a screenshot or an icon row:
            it answers "how long is this going to take" honestly and shows the
            interests are specific things, not marketing categories. */}
        <div className="rounded-panel border border-border bg-paper p-7 shadow-card sm:p-9">
          <div className="font-ui text-[10px] font-semibold uppercase tracking-[.2em] text-muted">
            What it asks
          </div>
          <dl className="mt-5 flex flex-col gap-4">
            {[
              ["Who you are", "Name, email, phone if you want to be invited to things."],
              ["Where you're at", "School, year, and how you'd describe where you are with faith."],
              ["What sounds good", "Pick as many as you like — this is what decides who reaches out."],
            ].map(([term, detail]) => (
              <div key={term} className="border-b border-border-soft pb-4 last:border-0 last:pb-0">
                <dt className="font-display text-[16px] font-bold text-navy-deep">{term}</dt>
                <dd className="mt-1 text-[14px] leading-[1.6] text-ink-warm">{detail}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-2">
            {PREVIEW_INTERESTS.map((interest) => (
              <span
                key={interest.id}
                className="rounded-pill border border-border bg-ivory px-3 py-1.5 font-ui text-[11.5px] font-semibold text-ink-warm"
              >
                {interest.label}
              </span>
            ))}
            <span className="rounded-pill px-3 py-1.5 font-ui text-[11.5px] font-semibold text-muted-light">
              +{INTERESTS.length - PREVIEW_INTERESTS.length} more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
