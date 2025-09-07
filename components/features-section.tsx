import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, Smartphone, Clock, Globe, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Tap and go in under 2 seconds. No more fumbling for exact change or waiting in long queues.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Advanced encryption and secure NFC technology protect your transactions and personal data.",
  },
  {
    icon: Smartphone,
    title: "Multi-Platform Support",
    description:
      "Use your NFC card or smartphone. Compatible with all major mobile payment systems.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Monitor your balance, transaction history, and travel patterns through our intuitive app.",
  },
  {
    icon: Globe,
    title: "City-Wide Coverage",
    description:
      "Works across all buses. One card for your entire transit network.",
  },
  {
    icon: Users,
    title: "Students/Seniors ",
    description:
      "Link identity cards with your account to get full discount benefits.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-card/30">
      <div className="container w-[90%] mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Why Choose <span className="text-primary">TransitPay</span>?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the next generation of public transportation payments
            with features designed for modern commuters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
            >
              <CardContent className="p-6 space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
