"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  ArrowRight,
} from "lucide-react";

const personas = [
  {
    title: "Student",
    subtitle: "Applying for internships or your first job.",
    recommendation: "Free",
    icon: GraduationCap,
    applications: "Up to 20 applications/month",
    color: "emerald",
  },
  {
    title: "Active Job Seeker",
    subtitle: "Applying consistently every week.",
    recommendation: "Pro",
    icon: Briefcase,
    applications: "100+ applications/month",
    color: "violet",
    popular: true,
  },
  {
    title: "Career Switch",
    subtitle: "Changing careers or interviewing full-time.",
    recommendation: "Career Sprint",
    icon: Rocket,
    applications: "Unlimited tailoring for 30 days",
    color: "amber",
  },
];

const colorClasses = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
    text: "text-emerald-600",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-300 dark:border-violet-500/30",
    text: "text-violet-600",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
    text: "text-amber-600",
  },
};

export default function PlanSelector() {
  return (
    <section className="mb-20">
      <div className="mx-auto max-w-4xl text-center">
        <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
          Which plan is right for you?
        </h3>

        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Choose based on where you are in your job search.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {personas.map((persona, index) => {
          const Icon = persona.icon;
          const colors = colorClasses[persona.color as keyof typeof colorClasses];

          return (
            <motion.div
              key={persona.title}
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
              }}
              whileHover={{
                y: -8,
              }}
              className={`
                relative
                rounded-3xl
                border
                p-8
                transition-all
                shadow-sm

                ${colors.border}
                ${colors.bg}

                ${
                  persona.popular
                    ? "ring-2 ring-violet-500 shadow-xl"
                    : ""
                }
              `}
            >
              {persona.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div
                className={`inline-flex rounded-2xl p-4 ${colors.bg}`}
              >
                <Icon
                  size={28}
                  className={colors.text}
                />
              </div>

              <h4 className="mt-6 text-2xl font-bold">
                {persona.title}
              </h4>

              <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
                {persona.subtitle}
              </p>

              <div className="mt-6 rounded-2xl bg-white/70 p-4 dark:bg-zinc-900/40">
                <p className="text-sm text-zinc-500">
                  Typical usage
                </p>

                <p className="mt-1 font-semibold">
                  {persona.applications}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                <div>
                  <p className="text-sm text-zinc-500">
                    Recommended Plan
                  </p>

                  <p className={`font-bold ${colors.text}`}>
                    {persona.recommendation}
                  </p>
                </div>

                <ArrowRight
                  className={colors.text}
                  size={20}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}