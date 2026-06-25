"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ATSCardProps {
  score?: number;
}

export default function ATSCard({
  score = 94,
}: ATSCardProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      whileHover={{
        y: -4,
      }}
      className="
      rounded-3xl
      border
      border-zinc-200/70
      bg-white/70
      backdrop-blur-xl
      p-6
      shadow-xl
      dark:border-zinc-800
      dark:bg-zinc-900/60
    "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            ATS Compatibility
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Resume Score
          </h3>
        </div>

        <div className="rounded-xl bg-violet-100 p-2 dark:bg-violet-500/20">
          <Sparkles
            className="text-violet-600"
            size={18}
          />
        </div>
      </div>

      {/* Circle */}

      <div className="mt-8 flex justify-center">
        <div className="relative h-36 w-36">
          <svg
            className="-rotate-90"
            width="144"
            height="144"
          >
            <circle
              cx="72"
              cy="72"
              r={radius}
              strokeWidth="10"
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
              fill="transparent"
            />

            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              strokeWidth="10"
              strokeLinecap="round"
              stroke="url(#gradient)"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{
                strokeDashoffset: circumference,
              }}
              animate={{
                strokeDashoffset: progress,
              }}
              transition={{
                duration: 1.6,
                ease: "easeOut",
              }}
            />

            <defs>
              <linearGradient id="gradient">
                <stop
                  offset="0%"
                  stopColor="#8B5CF6"
                />

                <stop
                  offset="100%"
                  stopColor="#6D28D9"
                />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.5,
              }}
            >
              <p className="text-4xl font-bold">
                {score}
              </p>

              <span className="text-sm text-zinc-500">
                /100
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Status */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.8,
        }}
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-emerald-50 py-2 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10"
      >
        <CheckCircle2 size={16} />

        Excellent ATS Match
      </motion.div>

      {/* Metrics */}

      <div className="mt-8 grid grid-cols-2 gap-4">
        <MetricCard
          title="Keywords"
          value="28/31"
        />

        <MetricCard
          title="Formatting"
          value="Perfect"
        />

        <MetricCard
          title="Readability"
          value="96%"
        />

        <MetricCard
          title="+ Score"
          value="+22"
          success
        />
      </div>

      {/* Footer */}

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-violet-200/60 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
        <div>
          <p className="text-sm font-medium">
            AI Recommendation
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Add Docker & AWS experience to
            increase recruiter matching.
          </p>
        </div>

        <ArrowUpRight
          className="text-violet-600"
          size={20}
        />
      </div>
    </motion.div>
  );
}

function MetricCard({
  title,
  value,
  success = false,
}: {
  title: string;
  value: string;
  success?: boolean;
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      className="
      rounded-2xl
      border
      border-zinc-200/60
      bg-zinc-50
      p-4
      dark:border-zinc-800
      dark:bg-zinc-900
    "
    >
      <p className="text-xs text-zinc-500">
        {title}
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${
          success
            ? "text-emerald-600"
            : ""
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}