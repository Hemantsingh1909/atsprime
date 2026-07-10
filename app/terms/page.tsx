"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-zinc-500">Last updated: July 6, 2026</p>

            <div className="mt-8 space-y-8 text-zinc-400 leading-relaxed text-sm">
              <section>
                <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
                <p className="mt-2">
                  By accessing or using ATSPrime, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must not access or use our service.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">2. Description of Service</h2>
                <p className="mt-2">
                  ATSPrime provides AI-powered resume building, score analysis, and tailoring optimizations. We reserve the right to modify, suspend, or discontinue any part of the service at any time without liability.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">3. User Responsibilities</h2>
                <p className="mt-2">
                  You are responsible for keeping your account credentials secure and are fully responsible for all activity that occurs under your account. You agree not to upload any malicious code or content that violates intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">4. Subscriptions & Payments</h2>
                <p className="mt-2">
                  ATSPrime offers both free and premium tiers. Paid subscriptions are billed in advance on a monthly or annual basis. Subscriptions automatically renew unless cancelled in your billing settings.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">5. Limitation of Liability</h2>
                <p className="mt-2">
                  ATSPrime is provided &quot;as is&quot;. We do not guarantee that our optimization recommendations will guarantee job interviews, offers, or specific score outcomes. We shall not be liable for any direct or indirect damages resulting from your use of the platform.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
