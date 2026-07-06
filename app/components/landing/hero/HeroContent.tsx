"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LayoutGrid,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-2xl"
    >
      {/* Badge */}

      <motion.div variants={item}>
        <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
          <Sparkles size={14} strokeWidth={2} />
          AI-Powered Resume Optimization
        </div>
      </motion.div>

      {/* Heading */}

      <motion.h1
        variants={item}
        className="mt-4 text-5xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-white md:text-7xl lg:text-7xl xl:text-8xl"
      >
        Stop rewriting
        <br />
        your resume
        <span className="block bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
          for every job.
        </span>
      </motion.h1>

      {/* Description */}

      <motion.p
        variants={item}
        className="mt-7 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400"
      >
        Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
      </motion.p>

      {/* Buttons */}

      <motion.div
        variants={item}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <Link
          href="/dashboard"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:opacity-90 px-7 py-3.5 font-medium text-on-primary shadow-md transition-all duration-200"
        >
          Start Free
          <ArrowRight
            size={18}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <Link
          href="/builder?view=gallery"
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-hairline px-7 py-3.5 font-medium text-zinc-900 dark:text-zinc-100 bg-canvas hover:bg-canvas-soft transition-all duration-200 shadow-sm"
        >
          <LayoutGrid size={18} strokeWidth={2} />
          Browse Templates
        </Link>
      </motion.div>

      {/* Trust Indicators */}

      <motion.div
        variants={item}
        className="mt-6 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
              <CheckCircle2
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              ATS Optimized
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-link-bg-soft dark:bg-link/10">
              <Sparkles
                size={16}
                className="text-link"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AI Powered
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-soft/30 dark:bg-violet/10">
              <CheckCircle2
                size={16}
                className="text-violet"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Free to Start
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}