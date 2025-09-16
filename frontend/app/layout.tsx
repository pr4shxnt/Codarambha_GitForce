import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "TransitPay - Your Digital Travel Wallet",
  description:
    "Seamless, secure, and smart NFC payments for public transportation. Transform your commute with TransitPay.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <Header />
          {children}
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
