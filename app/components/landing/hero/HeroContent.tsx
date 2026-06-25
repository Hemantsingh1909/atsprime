"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
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
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 backdrop-blur-sm">
          <Sparkles size={14} strokeWidth={2} />
          AI-Powered Resume Optimization
        </div>
      </motion.div>

      {/* Heading */}

      <motion.h1
        variants={item}
        className="mt-8 text-5xl font-bold leading-tight tracking-tight text-zinc-950 dark:text-white md:text-7xl lg:text-7xl xl:text-8xl"
      >
        Stop rewriting
        <br />
        your resume
        <span className="block bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
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
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-7 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          Start Free
          <ArrowRight
            size={18}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

        <button className="group inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 px-7 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-all duration-200 backdrop-blur-sm">
          <Play size={18} strokeWidth={2} />
          Watch Demo
        </button>
      </motion.div>

      {/* Trust Indicators */}

      <motion.div
        variants={item}
        className="mt-12 flex flex-col gap-6 pt-4"
      >
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-lg text-amber-400">
                ★
              </span>
            ))}
          </div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Trusted by 10,000+ job seekers
          </span>
        </div>

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
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
              <Sparkles
                size={16}
                className="text-blue-600 dark:text-blue-400"
                strokeWidth={2.5}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AI Powered
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20">
              <CheckCircle2
                size={16}
                className="text-purple-600 dark:text-purple-400"
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