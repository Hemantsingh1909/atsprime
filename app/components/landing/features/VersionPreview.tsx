"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Building2,
} from "lucide-react";

const resumes = [
  {
    company: "Google",
    color: "bg-blue-500",
  },
  {
    company: "Amazon",
    color: "bg-amber-500",
  },
  {
    company: "Stripe",
    color: "bg-violet-500",
  },
  {
    company: "Meta",
    color: "bg-sky-500",
  },
];

export default function VersionPreview() {
  return (
    <div className="flex h-full items-center justify-center py-6">
      <div className="group relative h-72 w-72">
        {resumes.map((resume, index) => (
          <motion.div
            key={resume.company}
            whileHover={{
              scale: 1.03,
            }}
            className="
            absolute
            left-1/2
            top-1/2
            h-52
            w-40
            origin-bottom
            rounded-3xl
            border
            border-zinc-200
            bg-white
            shadow-xl
            dark:border-zinc-800
            dark:bg-zinc-900
          "
            style={{
              transform: `
                translate(-50%, -50%)
                rotate(${index * 2 - 3}deg)
                translateY(${index * 10}px)
              `,
              zIndex: resumes.length - index,
            }}
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              delay: index * 0.2,
              duration: 4,
            }}
          >
            <motion.div
              className="h-full w-full"
              whileHover={{
                rotate:
                  index === 0
                    ? -10
                    : index === 1
                    ? -3
                    : index === 2
                    ? 4
                    : 10,
                x:
                  index === 0
                    ? -40
                    : index === 1
                    ? -15
                    : index === 2
                    ? 15
                    : 40,
              }}
            >
              {/* Header */}

              <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                <FileText
                  size={18}
                  className="text-violet-600"
                />

                <div
                  className={`h-3 w-3 rounded-full ${resume.color}`}
                />
              </div>

              {/* Content */}

              <div className="space-y-4 p-4">
                <div className="flex items-center gap-2">
                  <Building2
                    size={16}
                    className="text-zinc-400"
                  />

                  <span className="text-sm font-semibold">
                    {resume.company}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-700" />

                  <div className="h-2 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />

                  <div className="h-2 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                </div>

                <div className="rounded-xl bg-violet-50 p-3 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                  ATS Optimized
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}