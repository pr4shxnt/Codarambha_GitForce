import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, CreditCard, Smartphone, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Register",
    description:
      "Sign up for your TransitPay account in minutes. Verify your identity and you're ready to go.",
  },
  {
    icon: CreditCard,
    title: "Top-up Wallet",
    description:
      "Add funds to your digital wallet using your bank account, credit card, or mobile payment.",
  },
  {
    icon: Smartphone,
    title: "Tap to Pay",
    description:
      "Simply tap your NFC card or phone on any transit reader. Your fare is automatically deducted.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 pt-40">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Getting started with TransitPay is simple. Follow these three easy
            steps to transform your commute.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-primary">
                      Step {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-7 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
