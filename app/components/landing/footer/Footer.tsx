"use client";

import Link from "next/link";
import { GitBranch, Link as LinkIcon, Share2, Send, Sparkles } from "lucide-react";
import FooterColumn from "./FooterColumn";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Roadmap", href: "#" },
  ],
  resources: [
    { label: "ATS Guide", href: "#" },
    { label: "Resume Templates", href: "#" },
    { label: "Career Tips", href: "#" },
    { label: "Blog", href: "#" },
  ],
  company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/50 bg-white/60 dark:border-zinc-800/50 dark:bg-zinc-950/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Newsletter */}

        <div className="mb-20 rounded-2xl border border-zinc-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/40 p-10 backdrop-blur-sm">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Weekly Career Tips
              </h3>

              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                Get resume advice, ATS tips, and job search strategies delivered to your inbox.
              </p>
            </div>

            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1
                  rounded-xl
                  border
                  border-zinc-200
                  bg-white/50
                  px-5
                  py-3.5
                  text-zinc-950
                  outline-none
                  placeholder:text-zinc-500
                  focus:border-indigo-500
                  focus:ring-1
                  focus:ring-indigo-500/20
                  dark:border-zinc-700
                  dark:bg-zinc-900/50
                  dark:text-white
                  dark:placeholder:text-zinc-500
                  transition-all
                "
              />

              <button
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  hover:bg-indigo-700
                  px-6
                  py-3.5
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  shadow-sm
                  hover:shadow-md
                "
              >
                <Send size={18} strokeWidth={1.5} />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Grid */}

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Brand */}

          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                <Sparkles size={20} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                Resume<span className="text-indigo-600">AI</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Tailor every resume.
              <br />
              Land more interviews.
            </p>

            <div className="mt-8 flex gap-3">
              {[LinkIcon, Share2, GitBranch].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="
                    rounded-lg
                    border
                    border-zinc-200
                    dark:border-zinc-700
                    p-2.5
                    text-zinc-600
                    dark:text-zinc-400
                    hover:text-indigo-600
                    hover:border-indigo-500/30
                    dark:hover:text-indigo-400
                    dark:hover:border-indigo-500/30
                    transition-all
                    duration-200
                  "
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn
            title="Product"
            links={footerLinks.product}
          />

          <FooterColumn
            title="Resources"
            links={footerLinks.resources}
          />

          <FooterColumn
            title="Company"
            links={footerLinks.company}
          />
        </div>

        {/* Bottom */}

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="text-center">
            © 2026 ResumeAI. All rights reserved.
          </p>

          <p className="text-center">
            🚀 Building in Public
            <br />
            Follow our journey →
          </p>
        </div>
      </div>
    </footer>
  );
}