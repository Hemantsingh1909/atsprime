"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Gauge,
  Clock3,
  Star,
} from "lucide-react";

const stats = [
  {
    icon: Clock3,
    value: "< 30 sec",
    label: "Average tailoring time",
  },
  {
    icon: FileText,
    value: "1.2M+",
    label: "Resumes optimized",
  },
  {
    icon: Gauge,
    value: "95%",
    label: "Average ATS improvement",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "User satisfaction",
  },
];

export default function StatsBar() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            grid
            gap-6
            rounded-2xl
            border
            border-zinc-200/50
            bg-white/60
            p-8
            shadow-lg
            backdrop-blur-sm
            dark:border-zinc-800/50
            dark:bg-zinc-900/40
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 30,
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
                  duration: 0.5,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className="
                  rounded-xl
                  border
                  border-transparent
                  p-6
                  transition-all
                  duration-300
                  hover:border-indigo-200/50
                  hover:bg-indigo-50/30
                  dark:hover:border-indigo-500/20
                  dark:hover:bg-indigo-500/5
                "
              >
                <div className="mb-5 inline-flex rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2.5">
                  <Icon
                    className="text-indigo-600 dark:text-indigo-400"
                    size={20}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  {stat.value}
                </h3>

                <p className="mt-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}