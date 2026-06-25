"use client";

import { motion } from "framer-motion";
import ATSCard from "./ATSCard";
import KeywordCard from "./KeywordCard";
import ResumeCard from "./ResumeCard";
import { Sparkles, Zap } from "lucide-react";

export default function HeroDashboard() {
  return (
    <div className="relative flex w-full justify-center">
      {/* Glow */}

      <div className="absolute inset-0 -z-10 bg-violet-500/10 blur-[120px]" />

      {/* Floating badge */}

      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        -top-10
        left-1/2
        z-30
        flex
        -translate-x-1/2
        items-center
        gap-2
        rounded-full
        border
        border-violet-200
        bg-white/80
        px-4
        py-2
        shadow-xl
        backdrop-blur-xl
        dark:border-violet-500/20
        dark:bg-zinc-900/80
      "
      >
        <Sparkles
          size={16}
          className="text-violet-600"
        />

        <span className="text-sm font-medium">
          AI Tailoring in Progress
        </span>
      </motion.div>

      {/* Dashboard */}

      <div
        className="
        relative
        mt-20
        grid
        w-full
        max-w-7xl
        gap-8
        lg:grid-cols-12
      "
      >
        {/* ATS */}

        <motion.div
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
          lg:col-span-3
          lg:mt-12
        "
        >
          <ATSCard />
        </motion.div>

        {/* Resume */}

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.8,
          }}
          className="
          lg:col-span-6
          z-20
        "
        >
          <ResumeCard />
        </motion.div>

        {/* Keywords */}

        <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.45,
            duration: 0.8,
          }}
          className="
          lg:col-span-3
          lg:mt-20
        "
        >
          <KeywordCard />
        </motion.div>
      </div>

      {/* Floating analytics */}

      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
        className="
        absolute
        bottom-6
        left-6
        hidden
        rounded-2xl
        border
        border-zinc-200
        bg-white/80
        p-4
        shadow-xl
        backdrop-blur-xl
        dark:border-zinc-800
        dark:bg-zinc-900/80
        xl:flex
        items-center
        gap-3
      "
      >
        <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-500/20">
          <Zap
            size={18}
            className="text-emerald-600"
          />
        </div>

        <div>
          <p className="text-xs text-zinc-500">
            ATS Improved
          </p>

          <p className="font-semibold">
            +22 Points
          </p>
        </div>
      </motion.div>

      {/* Floating badge */}

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="
        absolute
        right-8
        top-32
        hidden
        rounded-2xl
        border
        border-zinc-200
        bg-white/80
        p-4
        shadow-xl
        backdrop-blur-xl
        dark:border-zinc-800
        dark:bg-zinc-900/80
        xl:block
      "
      >
        <div className="flex items-center gap-3">
          <Sparkles
            className="text-violet-600"
            size={18}
          />

          <div>
            <p className="text-xs text-zinc-500">
              AI Suggestions
            </p>

            <p className="font-semibold">
              12 Improvements
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}