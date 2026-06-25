"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  popular?: boolean;
  button: string;
}

export default function PricingCard({
  title,
  price,
  subtitle,
  features,
  popular = false,
  button,
}: PricingCardProps) {
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
        rounded-2xl
        border
        p-8
        transition-all
        duration-300
        ${
          popular
            ? "border-indigo-500/60 bg-gradient-to-br from-indigo-600/95 to-indigo-700/95 text-white shadow-2xl"
            : "border-zinc-200/50 bg-white/60 hover:bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60 shadow-sm hover:shadow-md"
        }
      `}
    >
      {popular && (
        <div className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <Sparkles size={13} strokeWidth={2} />
          Popular
        </div>
      )}

      <div>
        <h3 className={`text-2xl font-bold ${popular ? "text-white" : "text-zinc-900 dark:text-white"}`}>
          {title}
        </h3>

        <p className={`mt-2 text-sm font-medium ${
          popular ? "text-indigo-100" : "text-zinc-600 dark:text-zinc-400"
        }`}>
          {subtitle}
        </p>
      </div>

      <div className="mt-8 flex items-baseline gap-1">
        <span className={`text-5xl font-bold ${popular ? "text-white" : "text-zinc-900 dark:text-white"}`}>
          {price}
        </span>

        {title !== "Career Sprint" && (
          <span className={`text-sm font-medium ${
            popular ? "text-indigo-100" : "text-zinc-500 dark:text-zinc-400"
          }`}>
            /month
          </span>
        )}
      </div>

      <div className="mt-10 space-y-3.5">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3"
          >
            <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
              popular 
                ? "bg-white/20" 
                : "bg-emerald-100 dark:bg-emerald-500/20"
            }`}>
              <Check
                size={16}
                strokeWidth={2.5}
                className={
                  popular
                    ? "text-white"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              />
            </div>

            <span className={`text-sm font-medium ${
              popular ? "text-white" : "text-zinc-700 dark:text-zinc-300"
            }`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          mt-10
          w-full
          rounded-xl
          py-3.5
          font-semibold
          transition-all
          duration-200
          ${
            popular
              ? "bg-white text-indigo-600 hover:bg-zinc-50 shadow-lg hover:shadow-xl"
              : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          }
        `}
      >
        {button}
      </motion.button>
    </motion.div>
  );
}