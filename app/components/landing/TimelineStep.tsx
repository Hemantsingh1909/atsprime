"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface TimelineStepProps{
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  last?: boolean;
}

export default function TimelineStep({
  number,
  title,
  description,
  icon,
  last = false,
}: TimelineStepProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.4,
      }}
      transition={{
        duration: 0.6,
      }}
      className="relative flex gap-8"
    >
      {/* Timeline */}

      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          shadow-lg
          transition-colors
          flex-shrink-0
        "
        >
          {icon}
        </motion.div>

        {!last && (
          <>
            <div className="my-3 text-zinc-300 dark:text-zinc-600">
              <ArrowDown size={16} strokeWidth={1.5} />
            </div>

            <div className="h-24 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent" />
          </>
        )}
      </div>

      {/* Content */}

      <div className="pb-12 pt-1 flex-1">
        <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
          STEP {number}
        </span>

        <h3 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
}