"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const improvements = [
  "Added Metrics",
  "Stronger Action Verb",
  "ATS Keywords",
];

export default function ResumeDiffPreview() {
  return (
    <div className="flex h-full flex-col">
      {/* Before */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Before
        </p>

        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Built React applications for company website.
        </p>
      </motion.div>

      {/* Arrow */}

      <motion.div
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
        className="my-5 flex justify-center"
      >
        <ArrowDown
          className="text-violet-500"
          size={22}
        />
      </motion.div>

      {/* After */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: 0.3,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-2xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
          dark:border-emerald-500/20
          dark:bg-emerald-500/10
        "
      >
        <div className="flex items-center gap-2">
          <Sparkles
            size={16}
            className="text-emerald-600"
          />

          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            AI Improved
          </span>
        </div>

        <p className="mt-3 text-sm leading-7">
          Developed scalable React applications serving over{" "}
          <span className="font-semibold text-emerald-600">
            10,000 users
          </span>{" "}
          while improving performance by{" "}
          <span className="font-semibold text-emerald-600">
            35%
          </span>
          .
        </p>
      </motion.div>

      {/* Improvement Tags */}

      <div className="mt-6 flex flex-wrap gap-2">
        {improvements.map((item, index) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.5 + index * 0.12,
            }}
            whileHover={{
              scale: 1.05,
            }}
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-emerald-200
              bg-emerald-50
              px-3
              py-2
              text-xs
              font-medium
              text-emerald-700
              dark:border-emerald-500/20
              dark:bg-emerald-500/10
              dark:text-emerald-300
            "
          >
            <CheckCircle2 size={14} />

            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}