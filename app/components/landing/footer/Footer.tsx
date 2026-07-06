"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Sparkles } from "lucide-react";
import FooterColumn from "./FooterColumn";

const XIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    icon: XIcon,
    href: "https://x.com/atsprime",
    props: {},
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/atsprime",
    props: { strokeWidth: 1.5 },
  },
  {
    icon: Github,
    href: "https://github.com/Hemantsingh1909/atsprime",
    props: { strokeWidth: 1.5 },
  },
];

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
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
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-hairline bg-canvas-soft/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-20">


        {/* Footer Grid */}

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Brand */}

          <div className="lg:col-span-2">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="inline-flex items-center gap-2 group"
            >
              <svg viewBox="0 0 24 24" className="h-8 w-8 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
                <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                ATSPrime
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Tailor every resume.
              <br />
              Land more interviews.
            </p>

            <div className="mt-8 flex gap-3">
              {socialLinks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      rounded-lg
                      border
                      border-hairline
                      p-2.5
                      text-zinc-600
                      dark:text-zinc-400
                      hover:text-primary
                      hover:border-primary
                      transition-all
                      duration-200
                    "
                  >
                    <Icon size={18} {...item.props} className="flex-shrink-0" />
                  </a>
                );
              })}
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

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-hairline pt-8 text-sm text-zinc-500 dark:text-zinc-400 md:flex-row md:gap-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <p>© 2026 ATSPrime. All rights reserved.</p>

            {/* Desktop Vertical Divider */}
            <div className="hidden h-4 w-px bg-hairline md:block" />

            {/* Active Status Pulse */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none">
                All systems operational
              </span>
            </div>
          </div>

          <p className="text-center md:text-right">
            🚀 Building in Public &bull; Follow our journey →{" "}
            <Link
              href="https://github.com/Hemantsingh1909/resumeai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:opacity-85 font-medium transition-opacity"
            >
              @atsprime
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}