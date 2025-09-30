"use client";

import WavyBackground from "./components/WavyBackground";
import Hero from "./components/Hero";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import Team from "./components/Team";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      <WavyBackground />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10 sm:py-16">
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <Team />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
