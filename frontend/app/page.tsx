import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { CTASection } from "@/components/cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
                    <div className="text-center pt-20 space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Why Choose <span className="text-primary">TransitPay</span>?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the next generation of public transportation payments
            with features designed for modern commuters.
          </p>
        </div>
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
  );
}
