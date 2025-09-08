import { Navbar } from "@/src/components/landing/navbar"
import { HeroSection } from "@/src/components/landing/hero-section"
import { FeaturesSection } from "@/src/components/landing/features-section"
import { BenefitsSection } from "@/src/components/landing/benefits-section"
import { TestimonialsSection } from "@/src/components/landing/testimonials-section"
import { PricingSection } from "@/src/components/landing/pricing-section"
import { Footer } from "@/src/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  )
}
