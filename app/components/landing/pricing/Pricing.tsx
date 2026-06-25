"use client";
import PlanSelector from "./PlanSelector";
import { motion } from "framer-motion";
import PricingCard from "./PricingCard";

const plans = [
  {
    title: "Free",
    price: "₹0",
    subtitle: "Perfect for trying ResumeAI",
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
    price: "₹499",
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
    price: "₹999",
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
          <span className="inline-flex items-center rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 backdrop-blur-sm">
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
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              {...plan}
            />
          ))}
        </div>
      </div>
    </section>
  );
}