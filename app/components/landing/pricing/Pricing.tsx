"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";

const plans = [
  {
    title: "Free",
    priceMonthly: "₹0",
    priceYearly: "₹0",
    subtitle: "Perfect for trying ATSPrime",
    button: "Start Free",
    features: [
      "3 Resume Tailors",
      "ATS Score",
      "PDF Export",
      "Basic AI",
    ],
  },
  {
    title: "Pro",
    priceMonthly: "₹499",
    priceYearly: "₹399",
    subtitle: "Everything you need to land interviews",
    popular: true,
    button: "Upgrade to Pro",
    features: [
      "Unlimited Tailoring",
      "Unlimited Cover Letters",
      "Resume Versions",
      "Resume Diff",
      "Priority AI",
      "Unlimited Export",
    ],
  },
  {
    title: "Career Sprint",
    priceMonthly: "₹999",
    priceYearly: "₹999",
    subtitle: "One-time payment for active job seekers",
    button: "Buy Now",
    features: [
      "Unlimited Everything",
      "30 Days Access",
      "Priority Processing",
      "Resume History",
      "Interview Prep (Coming Soon)",
    ],
  },
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      id="pricing"
      className="py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
            Pricing
          </span>

          <h2 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl text-zinc-900 dark:text-white">
            Simple pricing.
            <br />
            No hidden fees.
          </h2>

          <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Choose the plan that fits your job search. Upgrade only when you need it.
          </p>

          {/* Vercel-style Pill Toggle Container */}
          <div className="mt-12 flex justify-center items-center gap-4">
            <div className="relative flex rounded-full bg-zinc-900 border border-zinc-800 p-1">
              <motion.div
                className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm"
                animate={{
                  left: billingCycle === "monthly" ? "4px" : "88px",
                  width: "80px",
                }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />

              <button
                onClick={() => setBillingCycle("monthly")}
                className={`relative z-10 w-20 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer select-none text-center ${
                  billingCycle === "monthly"
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`relative z-10 w-20 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer select-none text-center ${
                  billingCycle === "yearly"
                    ? "text-zinc-950 font-bold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Savings badge */}
            <motion.span
              animate={{ scale: billingCycle === "yearly" ? 1.05 : 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-400"
            >
              Save 20%
            </motion.span>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
              billingCycle={billingCycle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}