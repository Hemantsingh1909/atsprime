"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function FeatureHeader() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      className="mx-auto max-w-3xl text-center"
    >
      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
        <Sparkles size={14} strokeWidth={2} />
        Features
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-white">
        Everything you need
        <br />

        <span className="bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
          to land your next interview.
        </span>
      </h2>

      {/* Description */}

      <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        From ATS optimization to AI-powered resume rewriting, ATSPrime helps you create tailored resumes, generate personalized cover letters, and apply faster with confidence.
      </p>

      {/* Bottom divider */}

      <motion.div
        initial={{
          width: 0,
        }}
        whileInView={{
          width: 120,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.3,
        }}
        className="mx-auto mt-12 h-1 rounded-full bg-gradient-to-r from-violet to-highlight-pink"
      />
    </motion.div>
  );
}