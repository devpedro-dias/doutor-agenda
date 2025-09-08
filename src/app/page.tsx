import { Navbar } from "@/src/app/(landing)/_components/landing/navbar";
import { HeroSection } from "@/src/app/(landing)/_components/landing/hero-section";
import { FeaturesSection } from "@/src/app/(landing)/_components/landing/features-section";
import { BenefitsSection } from "@/src/app/(landing)/_components/landing/benefits-section";
import { TestimonialsSection } from "@/src/app/(landing)/_components/landing/testimonials-section";
import { PricingSection } from "@/src/app/(landing)/_components/landing/pricing-section";
import { Footer } from "@/src/app/(landing)/_components/landing/footer";

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}
