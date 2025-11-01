import React from "react";
import { FeaturesSection } from "@/components/features-section";

function FeaturesPage() {
  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      {/* Background subtle grid */}
      <div className="absolute h-[50%]  w-full inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />
            <div className="container pt-40 w-[90%] mx-auto px-4">
                      <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Why Choose <span className="text-primary">TransitPay</span>?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the next generation of public transportation payments
            with features designed for modern commuters.
          </p>
        </div>
</div>
      <FeaturesSection />
    </div>
  );
}

export default FeaturesPage;
