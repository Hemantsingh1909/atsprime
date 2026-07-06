"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { BookOpen, FileText, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AtsGuidePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-zinc-400">
              <BookOpen size={14} className="text-violet" />
              Ultimate Resource
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              How to Beat the ATS
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Over 90% of large employers use Applicant Tracking Systems (ATS) to filter resumes before a recruiter ever sees them. Learn the secrets of ATS matching algorithms and how to structure your resume to score 95%+.
            </p>
          </motion.div>

          {/* Guide Steps */}
          <div className="mt-20 space-y-12">
            <div className="flex gap-6 items-start rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                <span className="text-lg font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Understand ATS Match Rates</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  ATS bots read your resume text and compare it with the job description looking for key vocabulary, technology stacks, and years of experience. ATSPrime automatically computes a score matching these key tags.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                <span className="text-lg font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Focus on Keyword Density</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Avoid keyword-stuffing in white invisible text (modern systems detect this cheat and auto-flag/reject your resume). Instead, write high-impact bullet points incorporating correct terms contextually.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                <span className="text-lg font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Keep Layouts Clean</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  Do not use complex two-column structures, text boxes, images, or progress charts. ATS parsers typically read text line-by-line horizontally; complex tables or boxes split text and scramble the output. Use standard structures like the ATS Classic layout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
