"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  children,
  className = "",
}: FeatureCardProps) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  function handleMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
      group
      relative
      overflow-hidden
      rounded-2xl
      border
      border-zinc-200/50
      bg-white/60
      backdrop-blur-sm
      shadow-sm
      transition-all
      duration-300
      hover:shadow-lg
      hover:border-zinc-200/80
      dark:border-zinc-800/50
      dark:bg-zinc-900/40
      dark:hover:border-zinc-700/80
      ${className}
      `}
    >
      {/* Subtle spotlight */}

      <motion.div
        className="
        pointer-events-none
        absolute
        h-64
        w-64
        rounded-full
        bg-indigo-500/5
        blur-2xl
      "
        animate={{
          x: position.x - 130,
          y: position.y - 130,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      />

      {/* Content */}

      <div className="relative z-10 flex h-full flex-col p-7">
        {/* Header */}

        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center">
              {icon}
            </div>

            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-1.5 text-sm leading-5 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={18}
            strokeWidth={1.5}
            className="
            flex-shrink-0
            ml-2
            mt-1
            text-zinc-400
            group-hover:text-zinc-600
            dark:text-zinc-600
            dark:group-hover:text-zinc-400
            transition-all
            duration-300
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
          "
          />
        </div>

        {/* Preview */}

        <div className="relative flex-1 mt-auto">
          {children}
        </div>
      </div>
    </motion.div>
  );
}