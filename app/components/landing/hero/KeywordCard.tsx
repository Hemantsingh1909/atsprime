"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface KeywordCardProps {
  matched?: string[];
  missing?: string[];
  suggested?: string[];
}

export default function KeywordCard({
  matched = [
    "React",
    "JavaScript",
    "REST APIs",
    "Git",
  ],
  missing = [
    "Docker",
    "AWS",
    "CI/CD",
    "Redis",
  ],
  suggested = [
    "TypeScript",
    "Jest",
    "Agile",
    "Microservices",
  ],
}: KeywordCardProps) {
  const total =
    matched.length + missing.length;

  const percentage = Math.round(
    (matched.length / total) * 100
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
      rounded-3xl
      border
      border-zinc-200/70
      bg-white/70
      backdrop-blur-xl
      p-6
      shadow-xl
      dark:border-zinc-800
      dark:bg-zinc-900/60
    "
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            Keyword Match
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            ATS Keywords
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Your resume already matches
            most of the required skills.
          </p>
        </div>

        <div className="rounded-xl bg-violet-100 p-3 dark:bg-violet-500/20">
          <Sparkles
            size={18}
            className="text-violet-600"
          />
        </div>
      </div>

      {/* Progress */}

      <div className="mt-8">
        <div className="flex items-center justify-between text-sm">
          <span>Match Score</span>

          <span className="font-semibold">
            {percentage}%
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${percentage}%`,
            }}
            transition={{
              duration: 1.2,
            }}
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
          />
        </div>
      </div>

      {/* Sections */}

      <div className="mt-8 space-y-6">
        <KeywordSection
          title="Matched"
          icon={
            <CheckCircle2
              className="text-emerald-500"
              size={18}
            />
          }
          color="emerald"
          items={matched}
        />

        <KeywordSection
          title="Missing"
          icon={
            <AlertTriangle
              className="text-amber-500"
              size={18}
            />
          }
          color="amber"
          items={missing}
        />

        <KeywordSection
          title="AI Suggestions"
          icon={
            <Sparkles
              className="text-violet-500"
              size={18}
            />
          }
          color="violet"
          items={suggested}
        />
      </div>
    </motion.div>
  );
}

function KeywordSection({
  title,
  items,
  icon,
  color,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: "emerald" | "amber" | "violet";
}) {
  const colors = {
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300",

    amber:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-300",

    violet:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-300",
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {icon}

        <h4 className="font-medium">
          {title}
        </h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <motion.div
            key={item}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              scale: 1.06,
            }}
            className={`rounded-full border px-3 py-2 text-sm font-medium ${colors[color]}`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}