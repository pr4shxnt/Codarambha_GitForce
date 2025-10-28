import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, CreditCard, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" />

      <div className="container w-[90%] mx-auto px-4 py-20 pt-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight text-gray-700">
                Revolutionize Your{" "}
                <span className="text-gray-800">Digital Commute.</span>
              </h1>
              <p className="text-xl text-gray-500 text-pretty leading-relaxed">
                Seamless, secure, and smart payments for public transportation.
                Experience the future of transit with NFC-powered convenience.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link className="cursor-pointer" href={"/download"}>
                <Button
                  size="lg"
                  className="text-lg cursor-pointer w-full px-8 py-6 bg-black text-white hover:bg-gray-800"
                >
                  Download Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-gray-400 text-gray-800 hover:bg-gray-100"
              >
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">2s</div>
                <div className="text-sm text-gray-500">Average Tap Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">99.9%</div>
                <div className="text-sm text-gray-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">50K+</div>
                <div className="text-sm text-gray-500">Daily Users</div>
              </div>
            </div>
          </div>

          {/* Right Content - NFC Card Display */}
          <div className="relative">
            <div className="relative mx-auto max-w-md">
              {/* Floating Icons */}
              <div className="absolute -top-4 -left-4 p-3 bg-gray-200 rounded-full animate-bounce">
                <Smartphone className="h-6 w-6 text-gray-700" />
              </div>
              <div className="absolute -top-8 -right-8 p-3 bg-gray-200 rounded-full animate-bounce delay-300">
                <Zap className="h-6 w-6 text-gray-700" />
              </div>
              <div className="absolute -bottom-4 -left-8 p-3 bg-gray-200 rounded-full animate-bounce delay-700">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>

              {/* Main Card */}
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/images/nfc-card.png"
                  alt="TransitPay NFC Card"
                  width={900}
                  height={450}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200/30 to-gray-400/30 blur-3xl -z-10 scale-110" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
