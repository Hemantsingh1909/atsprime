"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const improvements = [
  {
    title: "Professional Summary",
    status: "Improved",
  },
  {
    title: "Experience",
    status: "Added Metrics",
  },
  {
    title: "Skills",
    status: "Added Keywords",
  },
  {
    title: "Projects",
    status: "Optimized",
  },
];

export default function ResumeCard() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 30,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.7,
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
      shadow-xl
      overflow-hidden
      dark:border-zinc-800
      dark:bg-zinc-900/60
    "
    >
      {/* Header */}

      <div className="border-b border-zinc-200/60 p-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3 dark:bg-violet-500/20">
            <FileText
              className="text-violet-600"
              size={20}
            />
          </div>

          <div>
            <h3 className="font-semibold">
              Resume.pdf
            </h3>

            <p className="text-sm text-zinc-500">
              Software Engineer
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <Sparkles size={14} />

            AI Optimizing
          </div>
        </div>
      </div>

      {/* Progress */}

      <div className="px-6 pt-6">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: "94%",
            }}
            transition={{
              duration: 2,
            }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
          />
        </div>
      </div>

      {/* Sections */}

      <div className="space-y-3 p-6">
        {improvements.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.15,
            }}
            className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-zinc-200/60
            bg-zinc-50
            px-4
            py-3
            dark:border-zinc-800
            dark:bg-zinc-900
          "
          >
            <span className="font-medium">
              {item.title}
            </span>

            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={16} />

              <span className="text-sm">
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Before After */}

      <div className="border-t border-zinc-200/60 p-6 dark:border-zinc-800">
        <p className="text-sm text-zinc-500">
          Before
        </p>

        <p className="mt-2 text-sm">
          Built React applications.
        </p>

        <div className="my-5 flex justify-center">
          <motion.div
            animate={{
              x: [0, 8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
          >
            <ArrowRight
              className="text-violet-600"
              size={22}
            />
          </motion.div>
        </div>

        <p className="text-sm text-zinc-500">
          After
        </p>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
          }}
          className="
          mt-2
          rounded-2xl
          border
          border-emerald-200
          bg-emerald-50
          p-4
          text-sm
          leading-relaxed
          dark:border-emerald-500/20
          dark:bg-emerald-500/10
        "
        >
          Developed scalable React
          applications serving over
          <span className="font-semibold text-emerald-600">
            {" "}10,000 users{" "}
          </span>
          while improving performance by
          <span className="font-semibold text-emerald-600">
            {" "}35%
          </span>
          .
        </motion.div>
      </div>

      {/* Footer */}

      <div className="border-t border-zinc-200/60 p-6 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Resume Score
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-semibold text-zinc-400 line-through">
                72
              </span>

              <ArrowRight
                size={18}
                className="text-violet-500"
              />

              <span className="text-3xl font-bold text-emerald-600">
                94
              </span>
            </div>
          </div>

          <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            ✨ AI Improved
          </div>
        </div>
      </div>
    </motion.div>
  );
}