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
    value: "Instant",
    label: "Average tailoring time",
  },
  {
    icon: FileText,
    value: "ATS-Aware",
    label: "Scoring on every resume",
  },
  {
    icon: Gauge,
    value: "Tailored",
    label: "Built for job seekers at scale",
  },
  {
    icon: Star,
    value: "Secured",
    label: "Private and encrypted data",
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
            rounded-lg
            border
            border-hairline
            bg-canvas/80
            p-8
            shadow-level-3
            backdrop-blur-sm
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
                  rounded-md
                  border
                  border-transparent
                  p-6
                  transition-all
                  duration-300
                  hover:border-hairline
                  hover:bg-canvas-soft
                "
              >
                <div className="mb-5 inline-flex rounded-sm bg-violet-soft/30 dark:bg-violet/10 p-2.5">
                  <Icon
                    className="text-violet"
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