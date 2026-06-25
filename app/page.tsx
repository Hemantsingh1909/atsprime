"use client";

import { ThemeProvider } from "next-themes";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/hero/Hero";
import StatsBar from "./components/landing/StatsBar";
import Features from "./components/landing/features/Features";
import HowItWorks from "./components/landing/HowItWorks";
import Pricing from "./components/landing/pricing/Pricing";
import CTA from "./components/landing/CTA";
import FAQ from "./components/landing/faq/FAQ";
import Footer from "./components/landing/footer/Footer";
import Integrations from "./components/landing/Integrations";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Integrations />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </ThemeProvider>
  );
}
