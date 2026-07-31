import { formatMassTime } from "@/lib/time";
import { SUNDAY_MASS_TIME } from "@/content/site-config";
import { StaggerGrid, StaggerItem } from "@/components/ui/StaggerGrid";
import { NewHereFlow } from "@/components/home/NewHereFlow";

const STEPS = [
  {
    number: "1",
    title: "Just walk in",
    body: (
      <>
        Sunday at <b>{formatMassTime(SUNDAY_MASS_TIME)} ◆</b> is the easiest entry point. Sit
        in the back if you want. Wear whatever.
      </>
    ),
  },
  {
    number: "2",
    title: "Stay for lunch",
    body: "It's free and it's where you'll actually meet people. Twenty minutes is enough.",
  },
  {
    number: "3",
    title: "Come back once",
    body: "Second time is when a place stops being strange. That's the only ask.",
  },
];

export function NewHere() {
  return (
    <section
      id="newhere"
      className="border-b border-[#EBE3CE] bg-ivory px-5 py-16 sm:px-gutter lg:py-section-y"
    >
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-[640px] text-center">
          <div className="font-ui text-[11px] font-semibold uppercase tracking-[.3em] text-orange">
            First Time?
          </div>
          <h2 className="mt-4 font-display text-h2 font-bold text-navy-deep">
            Here&apos;s exactly what happens
          </h2>
          <p className="mt-4 text-[17px] leading-[1.7] text-ink-warm">
            No sign-in table, no name tag, no one is going to single you out.
          </p>
        </div>

        <StaggerGrid className="mt-[52px] grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <StaggerItem
              key={step.number}
              className="rounded-panel border border-border bg-paper p-[34px_30px]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-[19px] font-bold text-gold-light">
                {step.number}
              </div>
              <h3 className="mt-5 font-display text-[22px] font-bold text-navy-deep">
                {step.title}
              </h3>
              <p className="mt-[11px] text-sm leading-[1.7] text-ink-warm">{step.body}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <NewHereFlow />
      </div>
    </section>
  );
}
