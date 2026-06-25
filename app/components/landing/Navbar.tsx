"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  {
    title: "Features",
    href: "#features",
  },
  {
    title: "How it Works",
    href: "#how-it-works",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md dark:bg-zinc-950/80 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}

            <Link
              href="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-sm group-hover:shadow-md transition-shadow">
                <Sparkles size={20} className="strokeWidth={2.5}" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                Resume<span className="text-indigo-600">AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}

            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}

            <div className="hidden items-center gap-2 md:flex">
              {mounted && (
                <button
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun size={20} strokeWidth={1.5} />
                  ) : (
                    <Moon size={20} strokeWidth={1.5} />
                  )}
                </button>
              )}

              <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                Sign In
              </button>

              <motion.button
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                Start Free
              </motion.button>
            </div>

            {/* Mobile */}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="fixed inset-x-6 top-20 z-40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 shadow-xl md:hidden"
          >
            <div className="p-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {item.title}
                </a>
              ))}

              <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4 space-y-3">
                <button className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
                  Sign In
                </button>

                <button className="w-full px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors">
                  Start Free
                </button>

                {mounted && (
                  <button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium flex items-center justify-center gap-2 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun size={18} strokeWidth={1.5} />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon size={18} strokeWidth={1.5} />
                        Dark Mode
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}