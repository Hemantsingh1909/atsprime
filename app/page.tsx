"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/hero/Hero";
import StatsBar from "./components/landing/StatsBar";
import Features from "./components/landing/features/Features";
import HowItWorks from "./components/landing/HowItWorks";
import CTA from "./components/landing/CTA";
import FAQ from "./components/landing/faq/FAQ";
import Footer from "./components/landing/footer/Footer";
import Integrations from "./components/landing/Integrations";

export default function Home() {
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent browser from restoring scroll positions automatically on refresh
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    }
  }, []);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <Integrations />
      <HowItWorks />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
