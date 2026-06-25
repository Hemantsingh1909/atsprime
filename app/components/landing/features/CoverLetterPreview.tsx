"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const tags = [
  "Personalized",
  "ATS Optimized",
  "Company Specific",
];

export default function CoverLetterPreview() {
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Window */}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Toolbar */}

        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles
              size={16}
              className="text-violet-600"
            />

            <span className="text-sm font-medium">
              AI Cover Letter
            </span>
          </div>

          <div className="flex gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
        </div>

        {/* Letter */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="space-y-3 p-5 text-sm leading-7"
        >
          <p>Dear Hiring Manager,</p>

          <p>
            I am excited to apply for the
            <span className="font-semibold text-violet-600">
              {" "}Software Engineer{" "}
            </span>
            role at
            <span className="font-semibold text-violet-600">
              {" "}Stripe
            </span>
            .
          </p>

          <p className="text-zinc-600 dark:text-zinc-400">
            My experience building scalable
            React applications and optimizing
            user experiences aligns closely
            with your engineering team...
          </p>

          {/* Cursor */}

          <motion.span
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
            }}
            className="inline-block font-bold text-violet-600"
          >
            ▋
          </motion.span>
        </motion.div>
      </div>

      {/* Tags */}

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{
              opacity: 0,
              y: 10,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.12,
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
              border-violet-200
              bg-violet-50
              px-3
              py-2
              text-xs
              font-medium
              text-violet-700
              dark:border-violet-500/20
              dark:bg-violet-500/10
              dark:text-violet-300
            "
          >
            <CheckCircle2 size={14} />

            {tag}
          </motion.div>
        ))}
      </div>
    </div>
  );
}