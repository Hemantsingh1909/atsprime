"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const metrics = [
  {
    title: "Keywords",
    value: 94,
  },
  {
    title: "Formatting",
    value: 97,
  },
  {
    title: "Readability",
    value: 92,
  },
];

export default function ATSPreview() {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const score = 94;

  const dashOffset =
    circumference -
    (score / 100) * circumference;

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Score */}

      <div className="flex items-center justify-center">
        <div className="relative h-28 w-28">
          <svg
            className="-rotate-90"
            width="112"
            height="112"
          >
            <circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              strokeWidth="8"
              className="text-zinc-200 dark:text-zinc-800"
              stroke="currentColor"
            />

            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              fill="transparent"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="#7C3AED"
              strokeDasharray={circumference}
              initial={{
                strokeDashoffset: circumference,
              }}
              whileInView={{
                strokeDashoffset: dashOffset,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.2,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{
                scale: 0.7,
                opacity: 0,
              }}
              whileInView={{
                scale: 1,
                opacity: 1,
              }}
              className="text-3xl font-bold"
            >
              94
            </motion.span>

            <span className="text-xs text-zinc-500">
              ATS
            </span>
          </div>
        </div>
      </div>

      {/* Improvement */}

      <div className="mt-6 flex items-center justify-center gap-2">
        <TrendingUp
          size={18}
          className="text-emerald-500"
        />

        <span className="text-sm font-medium">
          72 → 94
        </span>
      </div>

      {/* Metrics */}

      <div className="mt-8 space-y-5">
        {metrics.map((metric, index) => (
          <div key={metric.title}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{metric.title}</span>

              <span className="font-medium">
                {metric.value}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: `${metric.value}%`,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.8,
                }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Badge */}

      <motion.div
        whileHover={{
          scale: 1.04,
        }}
        className="
        mt-8
        flex
        items-center
        justify-center
        gap-2
        rounded-full
        bg-emerald-50
        py-3
        text-sm
        font-medium
        text-emerald-700
        dark:bg-emerald-500/10
        dark:text-emerald-300
      "
      >
        <CheckCircle2 size={16} />

        ATS Optimized
      </motion.div>
    </div>
  );
}