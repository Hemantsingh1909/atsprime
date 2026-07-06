"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-zinc-500">Last updated: July 6, 2026</p>

            <div className="mt-8 space-y-8 text-zinc-400 leading-relaxed text-sm">
              <section>
                <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
                <p className="mt-2">
                  When you use ATSPrime, we collect information you provide directly to us:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Account information (Name, Email Address, password hashes)</li>
                  <li>Resume text or files you upload</li>
                  <li>Job descriptions you submit for analysis</li>
                  <li>Billing data in case you subscribe to a paid tier</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
                <p className="mt-2">
                  We use the information we collect to provide, maintain, and improve our services, including:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Running AI analysis on your resume to calculate scoring and write tailored suggestions</li>
                  <li>Processing payments for premium subscription services</li>
                  <li>Sending transactional emails and notifications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">3. Information Sharing</h2>
                <p className="mt-2">
                  We do not sell your personal data. We only share information with third-party service providers (like payment processors and hosting services) under strict confidentiality agreements to keep the application running.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white">4. Your Rights</h2>
                <p className="mt-2">
                  You can edit, export, or delete your account information at any time directly through your dashboard settings. For custom data request support, you can contact us at support@atsprime.co.
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
