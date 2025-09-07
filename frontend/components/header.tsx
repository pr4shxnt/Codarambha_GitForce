"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container w-[95%]  mx-auto px-4 h-18 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/images/transitpay-logo.png"
            alt="TransitPay Logo"
            width={180}
            height={40}
            className=" w-40 h-auto"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#support"
            className="text-foreground hover:text-primary transition-colors"
          >
            Support
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="hidden sm:inline-flex bg-transparent"
          >
            Sign In
          </Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
}
