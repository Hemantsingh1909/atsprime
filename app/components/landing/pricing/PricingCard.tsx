"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  priceMonthly: string;
  priceYearly: string;
  subtitle: string;
  features: string[];
  popular?: boolean;
  button: string;
  billingCycle: "monthly" | "yearly";
}

export default function PricingCard({
  title,
  priceMonthly,
  priceYearly,
  subtitle,
  features,
  popular = false,
  button,
  billingCycle,
}: PricingCardProps) {
  const displayPrice = billingCycle === "monthly" ? priceMonthly : priceYearly;

  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.01,
      }}
      transition={{ duration: 0.25 }}
      className={`
        relative
        overflow-hidden
        rounded-lg
        border
        border-hairline
        p-8
        transition-all
        duration-300
        ${
          popular
            ? "bg-white text-zinc-950 shadow-2xl border-transparent"
            : "bg-canvas text-ink shadow-level-4"
        }
      `}
    >
      {popular && (
        <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-50 px-3 py-1 text-xs font-medium">
          <Sparkles size={13} strokeWidth={2} className="text-violet-400" />
          Popular
        </div>
      )}

      <div>
        <h3 className={`text-2xl font-semibold ${popular ? "text-zinc-950" : "text-ink"}`}>
          {title}
        </h3>

        <p className={`mt-2 text-sm font-medium ${
          popular ? "text-zinc-500" : "text-mute"
        }`}>
          {subtitle}
        </p>
      </div>

      <div className="mt-8">
        <div className="flex items-baseline gap-1">
          <motion.span
            key={displayPrice}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-5xl font-semibold inline-block ${popular ? "text-zinc-950" : "text-ink"}`}
          >
            {displayPrice}
          </motion.span>

          {title !== "Career Sprint" && (
            <span className={`text-sm font-medium ${
              popular ? "text-zinc-500" : "text-mute"
            }`}>
              /month
            </span>
          )}
        </div>

        {title === "Pro" && billingCycle === "yearly" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-1.5 text-xs font-medium ${
              popular ? "text-zinc-500" : "text-mute"
            }`}
          >
            Billed annually (₹4,788/yr)
          </motion.p>
        )}
      </div>

      <div className="mt-10 space-y-3.5">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex-shrink-0 flex items-center gap-3"
          >
            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
              popular 
                ? "bg-zinc-100" 
                : "bg-emerald-50 dark:bg-emerald-500/10"
            }`}>
              <Check
                size={16}
                strokeWidth={2.5}
                className={
                  popular
                    ? "text-zinc-900"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              />
            </div>

            <span className={`text-sm font-medium ${
              popular ? "text-zinc-800" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {title === "Free" ? (
        <Link href="/dashboard" className="block mt-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full
              rounded-full
              py-2.5
              font-medium
              transition-all
              duration-200
              cursor-pointer
              ${
                popular
                  ? "bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm"
                  : "bg-primary text-on-primary hover:opacity-95 shadow-sm"
              }
            `}
          >
            {button}
          </motion.button>
        </Link>
      ) : (
        <div className="block mt-10">
          <button
            disabled
            className="w-full rounded-full py-2.5 font-medium bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50 shadow-inner"
          >
            Coming Soon
          </button>
        </div>
      )}
    </motion.div>
  );
}