import React from "react";
import { FeaturesSection } from "@/components/features-section";

function FeaturesPage() {
  return (
    <div className="min-h-screen relative bg-white text-gray-900">
      {/* Background subtle grid */}
      <div className="absolute h-[50%] w-full inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />

      <FeaturesSection />
    </div>
  );
}

export default FeaturesPage;
