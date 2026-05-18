import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { LANDING_CONFIG } from "./landing-constants";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection, CTASection } from "@/components/landing/MainSections";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { isActive: true }
  });

  return (
    <main className="position-relative overflow-hidden">
      <Navbar />
      <HeroSection config={LANDING_CONFIG.HERO} />
      <ServicesSection services={services} config={LANDING_CONFIG.SERVICES} />
      <CTASection config={LANDING_CONFIG.CTA} />
      <LandingFooter config={LANDING_CONFIG.FOOTER} />
    </main>
  );
}
