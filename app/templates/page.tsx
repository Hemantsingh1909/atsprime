"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { templatesList } from "../components/resume/templates/registry";
import { Sparkles, FileText, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-zinc-950 text-white pt-32 pb-20 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-3 py-1.5 text-xs font-medium text-zinc-400">
              <Sparkles size={14} className="text-violet" />
              ATS-Optimized Designs
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              Resume Templates
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Pick from our collection of standard-compliant resume templates built to pass Applicant Tracking Systems and impress human recruiters.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {templatesList.map((tpl) => (
              <div
                key={tpl.id}
                className="flex flex-col justify-between rounded-lg border border-hairline bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        {tpl.atsScore}% ATS
                      </span>
                      {tpl.isPopular && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-violet bg-violet/10 px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{tpl.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{tpl.desc}</p>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/builder?template=${tpl.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-hairline py-2 text-xs font-bold text-white transition-colors"
                  >
                    Use Template
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
