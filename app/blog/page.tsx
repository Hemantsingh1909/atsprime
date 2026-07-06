"use client";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/footer/Footer";
import { Sparkles, Calendar, User, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const articles = [
  {
    title: "10 Cliché Resume Words to Avoid in 2026",
    excerpt: "Stop using overused words like 'team player' or 'detail-oriented'. Learn what action-oriented keywords recruiters and ATS systems want to see instead.",
    author: "Elena Rostov",
    date: "July 2, 2026",
    readTime: "4 min read",
    tag: "Resume Optimization"
  },
  {
    title: "Understanding ATS Algorithms: A Technical Breakdown",
    excerpt: "Ever wondered how applicant tracking systems read, tag, and score your PDF and DOCX files? We dive deep into the parsing pipeline of modern ATS tools.",
    author: "Marcus Vance",
    date: "June 28, 2026",
    readTime: "7 min read",
    tag: "ATS Insights"
  },
  {
    title: "How to Ask for a Referral (With Templates That Work)",
    excerpt: "Getting referred boosts your interview chances by 10x. Learn how to draft short, polite cold outreach messages on LinkedIn to get referrals.",
    author: "Sarah Jenkins",
    date: "June 15, 2026",
    readTime: "5 min read",
    tag: "Networking"
  }
];

export default function BlogPage() {
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
              Latest Insights
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">
              Articles, expert breakdowns, and formatting guides to help you land interviews and navigate your career path.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-lg border border-hairline bg-zinc-900/40 p-6 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-violet bg-violet/10 px-2.5 py-1 rounded-full">
                    {article.tag}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white leading-snug hover:text-violet transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{article.excerpt}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{article.date}</span>
                    </div>
                  </div>
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
