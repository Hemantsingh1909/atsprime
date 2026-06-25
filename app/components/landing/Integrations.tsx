"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Link,
} from "lucide-react";

const tools = [
  {
    name: "LinkedIn",
    icon: Link,
  },
  {
    name: "Indeed",
    icon: Briefcase,
  },
  {
    name: "Greenhouse",
    icon: FileText,
  },
  {
    name: "Lever",
    icon: Briefcase,
  },
  {
    name: "Workday",
    icon: FileText,
  },
  {
    name: "PDF & DOCX",
    icon: FileText,
  },
];

export default function TrustedBy() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Works seamlessly with
          </p>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool, index) => {
              const Icon = tool.icon;

              return (
                <motion.div
                  key={tool.name}
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
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.02,
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2.5
                    rounded-xl
                    border
                    border-zinc-200/50
                    bg-white/60
                    dark:border-zinc-800/50
                    dark:bg-zinc-900/40
                    px-5
                    py-4
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    hover:border-indigo-200/50
                    dark:hover:border-indigo-500/20
                    backdrop-blur-sm
                  "
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                  />

                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {tool.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}