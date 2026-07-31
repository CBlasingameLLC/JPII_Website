import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { ThisWeek } from "@/components/home/ThisWeek";
import { Events } from "@/components/home/Events";
import { GetInvolved } from "@/components/home/GetInvolved";
import { StudentLeadership } from "@/components/home/StudentLeadership";
import { About } from "@/components/home/About";
import { Staff } from "@/components/home/Staff";
import { NewHere } from "@/components/home/NewHere";
import { Give } from "@/components/home/Give";
import { ScrollRose } from "@/components/home/ScrollRose";
import { MotionSection } from "@/components/ui/MotionSection";
import { SITE_CONFIG } from "@/content/site-config";

export default function HomePage() {
  return (
    <>
      <ScrollRose />
      <Header theme={SITE_CONFIG.headerTheme} />
      <Hero />
      <MotionSection>
        <ThisWeek />
      </MotionSection>
      <MotionSection>
        <Events />
      </MotionSection>
      <MotionSection>
        <GetInvolved />
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
        <Give />
      </MotionSection>
      <Footer />
    </>
  );
}
