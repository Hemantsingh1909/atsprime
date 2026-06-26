"use client";

import {
  FileText,
  ClipboardList,
  Sparkles,
  Gauge,
  Download,
} from "lucide-react";

import TimelineStep from "./TimelineStep";

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Upload your existing PDF or DOCX resume. ATSPrime extracts your experience, education, projects, and skills automatically.",
    icon: <FileText size={28} />,
  },
  {
    number: "02",
    title: "Paste the Job Description",
    description:
      "Paste the job description from LinkedIn, Indeed, Greenhouse, Lever, or any company career page.",
    icon: <ClipboardList size={28} />,
  },
  {
    number: "03",
    title: "AI Tailors Everything",
    description:
      "Our AI rewrites bullet points, improves achievements, adds ATS keywords, and generates a tailored professional summary.",
    icon: <Sparkles size={28} />,
  },
  {
    number: "04",
    title: "ATS Optimization",
    description:
      "ATSPrime analyzes missing keywords, formatting, readability, and recruiter compatibility to maximize your ATS score.",
    icon: <Gauge size={28} />,
  },
  {
    number: "05",
    title: "Download & Apply",
    description:
      "Export your optimized resume as PDF or DOCX and apply with confidence in just a few clicks.",
    icon: <Download size={28} />,
    last: true,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}

        <div className="mx-auto mb-24 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas-soft px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 backdrop-blur-sm">
            Workflow
          </span>

          <h2 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl text-zinc-900 dark:text-white">
            From job posting to interview-ready
            resume in under one minute.
          </h2>

          <p className="mt-7 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            ATSPrime removes the repetitive work of tailoring resumes so you can spend more time applying to the jobs that matter.
          </p>
        </div>

        {/* Timeline */}

        <div className="space-y-5">
          {steps.map((step) => (
            <TimelineStep
              key={step.number}
              {...step}
            />
          ))}
        </div>
      </div>
    </section>
  );
}