import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, CreditCard, Zap } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen  flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" />

      <div className="container w-[90%] mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
                Revolutionize Your <span className="text-primary">Commute</span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                Seamless, secure, and smart payments for public transportation.
                Experience the future of transit with NFC-powered convenience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8 py-6">
                Download Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2s</div>
                <div className="text-sm text-muted-foreground">
                  Average Tap Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Daily Users</div>
              </div>
            </div>
          </div>

          {/* Right Content - NFC Card Display */}
          <div className="relative">
            <div className="relative mx-auto max-w-md">
              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 p-3 bg-secondary/10 rounded-full animate-bounce">
                <Smartphone className="h-6 w-6 text-secondary" />
              </div>
              <div className="absolute -top-8 -right-8 p-3 bg-accent/10 rounded-full animate-bounce delay-300">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <div className="absolute -bottom-4 -left-8 p-3 bg-primary/10 rounded-full animate-bounce delay-700">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>

              {/* Main Card */}
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/nfc-card.png"
                  alt="TransitPay NFC Card"
                  width={600}
                  height={450}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl -z-10 scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
