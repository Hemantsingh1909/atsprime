"use client";

import { motion } from "framer-motion";
import { ArrowRight, LifeBuoy, Clock3 } from "lucide-react";

export default function SupportCard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        mt-20
        overflow-hidden
        rounded-2xl
        border
        border-zinc-200/50
        bg-white/70
        p-10
        shadow-lg
        backdrop-blur-sm
        dark:border-zinc-800/50
        dark:bg-zinc-900/40
      "
    >
      {/* Background Glow */}

      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100/50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          <LifeBuoy size={28} strokeWidth={1.5} />
        </div>

        {/* Heading */}

        <h3 className="text-3xl font-bold tracking-tight md:text-4xl text-zinc-900 dark:text-white">
          Still have questions?
        </h3>

        {/* Description */}

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Can&apos;t find the answer you&apos;re looking for? Our team is happy to help and we&apos;ll get back to you as quickly as possible.
        </p>

        {/* Button */}

        <motion.button
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          className="
            group
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-indigo-600
            hover:bg-indigo-700
            px-7
            py-3.5
            font-semibold
            text-white
            shadow-lg
            hover:shadow-xl
            transition-all
            duration-200
          "
        >
          Contact Support

          <ArrowRight
            size={18}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </motion.button>

        {/* Response Time */}

        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/30 px-3.5 py-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
          <Clock3 size={14} strokeWidth={1.5} />
          Average response time: under 24 hours
        </div>
      </div>
    </motion.div>
  );
}