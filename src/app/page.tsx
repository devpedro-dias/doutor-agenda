import { Navbar } from "@/src/_components/navbar";
import { HeroSection } from "@/src/_components/hero-section";
import { FeaturesSection } from "@/src/_components/features-section";
import { BenefitsSection } from "@/src/_components/benefits-section";
import { TestimonialsSection } from "@/src/_components/testimonials-section";
import { PricingSection } from "@/src/_components/pricing-section";
import { Footer } from "@/src/_components/footer";

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
