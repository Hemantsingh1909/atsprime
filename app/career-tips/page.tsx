"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const tips = [
  {
    title: "Structure bullet points using the XYZ formula",
    desc: "Recruiters love quantifiable achievements. Instead of writing 'Worked on styling', use Google's XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Example: 'Reduced load times by 20% by implementing code-splitting'.",
    tag: "Resume Writing"
  },
  {
    title: "Always customize resumes for the job description",
    desc: "Spend 5 minutes parsing the target description and aligning your resume keywords. Highlight direct software packages, frameworks, or methodologies matching the requirements.",
    tag: "ATS Success"
  },
  {
    title: "Focus on action verbs over passive phrases",
    desc: "Start every work experience bullet point with strong active verbs like 'Engineered', 'Optimized', 'Architected', or 'Spearheaded' instead of 'Responsible for' or 'Helped with'.",
    tag: "Resume Writing"
  },
  {
    title: "Limit your resume to 1-2 pages",
    desc: "Keep your document concise. Use a single page if you have under 5 years of experience, and a maximum of 2 pages for longer career profiles. Clear margins and spacing improve human readability.",
    tag: "Design & Style"
  }
];

export default function CareerTipsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-zinc-400">
              <Sparkles size={14} className="text-violet" />
              Pro Career Advice
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              Weekly Career Tips
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Get resume advice, ATS tips, and job search strategies curated by expert recruiters and career coaches.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {tips.map((item, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-lg border border-hairline bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-violet bg-violet/10 px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-lg border border-hairline bg-zinc-900/20 p-8 text-center backdrop-blur-sm">
            <h3 className="text-xl font-semibold">Want real-time optimization feedback?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Try our AI Optimizer to get instant improvement suggestions for your bullet points.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary hover:opacity-90 px-6 py-2.5 text-sm font-bold text-on-primary transition-all duration-200"
            >
              Analyze Your Resume
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
