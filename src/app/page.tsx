import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { DailyLiturgy } from "@/components/home/DailyLiturgy";
import { TodayInHistory } from "@/components/home/TodayInHistory";
import { ThisWeek } from "@/components/home/ThisWeek";
import { Events } from "@/components/home/Events";
import { StudentLeadership } from "@/components/home/StudentLeadership";
import { About } from "@/components/home/About";
import { Staff } from "@/components/home/Staff";
import { NewHere } from "@/components/home/NewHere";
import { Location } from "@/components/home/Location";
import { Give } from "@/components/home/Give";
import { ScrollRose } from "@/components/home/ScrollRose";
import { MotionSection } from "@/components/ui/MotionSection";
import { DailyRefresh } from "@/components/ui/DailyRefresh";
import { SITE_CONFIG } from "@/content/site-config";
import { chicagoDateKey, getChicagoNow } from "@/lib/time";

/**
 * The homepage renders three things off the current date — the liturgical
 * band, the history strip, and the Mass card's server-side starting state —
 * so it cannot be a build-time static page. Without this it was prerendered
 * once at deploy and kept serving that day's date indefinitely, which is why
 * the history strip appeared empty in production while working locally.
 *
 * Half an hour is short enough that the date is never meaningfully wrong and
 * long enough that this stays a cached page rather than a per-request render.
 * The upstream liturgical fetches keep their own day-long cache regardless
 * (see lib/liturgy-feed), so this does not add traffic to them.
 */
export const revalidate = 1800;

export default function HomePage() {
  return (
    <>
      {/* Watches for the Tyler-local date rolling over and re-fetches, so a
          tab left open overnight stops showing yesterday's liturgy and
          history. Renders nothing. */}
      <DailyRefresh renderedFor={chicagoDateKey(getChicagoNow())} />
      <ScrollRose />
      <Header theme={SITE_CONFIG.headerTheme} />
      <Hero />
      {/* Suspended so a slow upstream liturgical feed can never hold up the
          rest of the page; it renders nothing at all if both sources fail. */}
      <Suspense fallback={null}>
        <DailyLiturgy />
      </Suspense>
      <TodayInHistory />
      <MotionSection>
        <ThisWeek />
      </MotionSection>
      <MotionSection>
        <Events />
      </MotionSection>
      <MotionSection>
        <StudentLeadership />
      </MotionSection>
      <MotionSection>
        <About />
      </MotionSection>
      <MotionSection>
        <Staff />
      </MotionSection>
      <MotionSection>
        <NewHere />
      </MotionSection>
      <MotionSection>
        <Location />
      </MotionSection>
      <MotionSection>
        <Give />
      </MotionSection>
      <Footer />
    </>
  );
}
