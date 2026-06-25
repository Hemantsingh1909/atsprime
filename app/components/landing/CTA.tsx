"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-zinc-200/50
            bg-white/70
            p-12
            shadow-xl
            backdrop-blur-sm
            dark:border-zinc-800/50
            dark:bg-zinc-900/60
          "
        >
          {/* Subtle decorative glow */}
          <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 backdrop-blur-sm">
                <Sparkles size={14} strokeWidth={2} />
                Ready to Apply
              </div>

              <h2 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Your next interview
                <br />
                starts with
                <span className="block bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  a better resume.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-10"
              >
                <Link
                  href="/dashboard"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-700
                    px-8
                    py-3.5
                    font-semibold
                    text-white
                    shadow-lg
                    hover:shadow-xl
                    transition-all
                    duration-200
                  "
                >
                  Start Free
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                  />
                </Link>
              </motion.div>

              <div className="mt-6 flex items-center gap-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <CheckCircle2
                  size={18}
                  strokeWidth={1.5}
                  className="text-emerald-500"
                />
                No credit card required
              </div>
            </div>

            {/* Right Demo Card */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut",
              }}
              className="
                rounded-2xl
                border
                border-zinc-200/50
                bg-white/60
                p-8
                shadow-lg
                dark:border-zinc-800/50
                dark:bg-zinc-900/40
                backdrop-blur-sm
              "
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Resume Score
                </h3>

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                  <CheckCircle2
                    className="text-emerald-600 dark:text-emerald-400"
                    size={20}
                    strokeWidth={2}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative h-36 w-36">
                  <svg
                    className="-rotate-90"
                    width="144"
                    height="144"
                  >
                    <circle
                      cx="72"
                      cy="72"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-zinc-200 dark:text-zinc-700"
                    />

                    <motion.circle
                      cx="72"
                      cy="72"
                      r="56"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="352"
                      initial={{
                        strokeDashoffset: 352,
                      }}
                      whileInView={{
                        strokeDashoffset: 22,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 1.8,
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">94</span>

                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">ATS Score</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/10 p-4 text-center">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ Optimized & Ready to Apply
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}