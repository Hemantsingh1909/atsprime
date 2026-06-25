"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Copy,
  Download,
} from "lucide-react";

const exports = [
  {
    title: "PDF",
    icon: FileText,
  },
  {
    title: "DOCX",
    icon: Download,
  },
  {
    title: "Copy",
    icon: Copy,
  },
];

export default function ExportPreview() {
  return (
    <div className="flex h-full flex-col items-center justify-between">
      {/* Resume */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.6,
        }}
        whileHover={{
          y: -4,
        }}
        className="
          relative
          w-52
          rounded-3xl
          border
          border-zinc-200
          bg-white
          p-6
          shadow-xl
          dark:border-zinc-800
          dark:bg-zinc-900
        "
      >
        {/* Success Badge */}

        <motion.div
          initial={{
            scale: 0,
          }}
          whileInView={{
            scale: 1,
          }}
          transition={{
            delay: 0.4,
            type: "spring",
          }}
          className="
            absolute
            -right-4
            -top-4
            rounded-full
            bg-emerald-500
            p-3
            text-white
            shadow-lg
          "
        >
          <CheckCircle2 size={22} />
        </motion.div>

        {/* Resume */}

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText
              size={20}
              className="text-violet-600"
            />

            <span className="font-semibold">
              Resume.pdf
            </span>
          </div>

          <div className="space-y-2">
            <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-700" />

            <div className="h-2 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />

            <div className="h-2 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />

            <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-700" />

            <div className="h-2 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            Ready to Apply
          </div>
        </div>
      </motion.div>

      {/* Export Buttons */}

      <div className="mt-8 grid w-full grid-cols-3 gap-3">
        {exports.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5 + index * 0.1,
              }}
              whileHover={{
                y: -3,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="
                flex
                flex-col
                items-center
                gap-2
                rounded-2xl
                border
                border-zinc-200
                bg-zinc-50
                py-4
                transition
                hover:border-violet-300
                hover:bg-violet-50
                dark:border-zinc-800
                dark:bg-zinc-900
                dark:hover:border-violet-500/20
                dark:hover:bg-violet-500/10
              "
            >
              <Icon
                size={18}
                className="text-violet-600"
              />

              <span className="text-xs font-medium">
                {item.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}