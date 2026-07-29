import { SF_PRO_STACK } from "@/lib/fonts";
import { AboutSection } from "./AboutSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LandingFooter } from "./LandingFooter";
import { LandingHero } from "./LandingHero";

export function LandingPage() {
  return (
    <div style={{ fontFamily: SF_PRO_STACK }}>
      <LandingHero />
      <AboutSection />
      <HowItWorksSection />
      <LandingFooter />
    </div>
  );
}
