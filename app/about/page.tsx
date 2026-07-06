"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { Sparkles, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
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
              <Sparkles size={14} className="text-violet" />
              Our Mission
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              Empowering Job Seekers
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              ATSPrime is on a mission to level the playing field for job seekers globally. By leveraging advanced artificial intelligence, we help you optimize your resume, beat the ATS bots, and land your dream role.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-8 sm:grid-cols-2">
            <div className="rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10">
                <Target className="h-6 w-6 text-violet" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Precision Optimizations</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                We analyze job descriptions and optimize resumes keyword-by-keyword, ensuring your applications highlight the specific skills and qualifications employers look for.
              </p>
            </div>

            <div className="rounded-lg border border-hairline bg-zinc-900/40 p-8 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10">
                <Award className="h-6 w-6 text-violet" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">Beat the Bots</h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Most modern resumes never reach a human recruiter due to ATS filters. ATSPrime ensures your formatting, tags, and structure are completely ATS-compliant.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
