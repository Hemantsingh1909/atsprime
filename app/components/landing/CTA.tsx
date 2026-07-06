"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function CTA() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <section className="relative overflow-hidden py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-highlight-pink/5" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onMouseMove={handleMouseMove}
          className="
            group
            relative
            rounded-lg
            border
            border-hairline
            bg-canvas/70
            p-12
            shadow-level-4
            backdrop-blur-sm
            overflow-hidden
          "
        >
          {/* Subtle background grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Spotlight glow tracking the cursor */}
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(121, 40, 202, 0.08), transparent)`,
            }}
          />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
                <Sparkles size={14} strokeWidth={2} />
                Ready to Apply
              </div>

              <h2 className="mt-8 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                Your next interview
                <br />
                starts with
                <span className="block bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
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
                    rounded-full
                    bg-primary
                    hover:opacity-90
                    px-8
                    py-3.5
                    font-medium
                    text-on-primary
                    shadow-sm
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

              <p className="mt-3.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none">
                Tailor your resume for any role, instantly.
              </p>

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
                rounded-lg
                border
                border-hairline
                bg-canvas
                p-8
                shadow-level-3
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
                <div className="relative h-36 w-36 rounded-full shadow-[0_0_30px_rgba(121,40,202,0.06)] dark:shadow-[0_0_40px_rgba(121,40,202,0.1)] transition-shadow duration-300">
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
                      stroke="var(--color-violet)"
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