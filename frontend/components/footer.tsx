import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card/50 pt-20 border-t border-border">
      <div className="container w-[90%] mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Image
              src="/images/transitpay-logo.png"
              alt="TransitPay Logo"
              width={160}
              height={36}
              className="h-8 w-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your digital travel wallet for seamless public transportation
              payments.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Security
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                System Status
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                API Docs
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 TransitPay | Codarambha Hackfest.
          </div>
          <div className="text-sm text-muted-foreground">
            Made with ❤️ by GitForce.
          </div>
        </div>
      </div>
    </footer>
  );
}
