"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, LogOut, ChevronDown, User, Crown, History, CreditCard, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    title: "Resume Builder",
    href: "/builder",
    isAbsolute: true,
  },
  {
    title: "How it Works",
    href: "/#how-it-works",
  },
  {
    title: "FAQ",
    href: "/#faq",
  },
];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user, signOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}

            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 group"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
                <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
              </svg>

              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                ATSPrime
              </span>
            </Link>

            {/* Desktop Nav */}

            <nav
              className="hidden items-center gap-1 md:flex"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {navItems.map((item, index) => {
                const className = "relative px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors rounded-lg";
                const content = (
                  <>
                    {hoveredIndex === index && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-zinc-100/70 dark:bg-zinc-800/50 rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    {item.title}
                  </>
                );
                return item.isAbsolute ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={className}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    key={item.title}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={className}
                  >
                    {content}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Actions */}

            <div className="hidden items-center gap-4 md:flex min-w-[140px] justify-end">
              {loading ? (
                <div className="h-9 w-28 rounded bg-zinc-900 border border-hairline animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors rounded-lg bg-zinc-900 border border-hairline hover:bg-zinc-850 cursor-pointer"
                  >
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-6 w-6 rounded-full object-cover border border-violet/30" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-violet/20 border border-violet/30 text-violet flex items-center justify-center text-xs font-semibold uppercase">
                        {user.email.charAt(0)}
                      </div>
                    )}
                    <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        {/* Dropdown Backdrop */}
                        <div className="fixed inset-0 z-45" onClick={() => setDropdownOpen(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-md bg-canvas border border-hairline p-2.5 shadow-level-5 z-50 text-left"
                        >
                          <div className="px-2 py-1.5 border-b border-hairline mb-1.5">
                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Signed in as</p>
                            <p className="text-xs text-zinc-300 font-medium truncate mt-0.5">{user.email}</p>
                          </div>
                          
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors"
                          >
                            <Sparkles size={14} className="text-violet" />
                            Tailor Resume Dashboard
                          </Link>
                          
                          <Link
                            href="/builder"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors"
                          >
                            <Crown size={14} className="text-violet" />
                            Resume Builder
                          </Link>
                          
                          <Link
                            href="/history"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors mt-0.5"
                          >
                            <History size={14} className="text-violet" />
                            Resume History
                          </Link>
                          
                          <Link
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors mt-0.5"
                          >
                            <User size={14} className="text-violet" />
                            Profile
                          </Link>
                          
                          <Link
                            href="/settings"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors mt-0.5"
                          >
                            <Settings size={14} className="text-violet" />
                            Settings
                          </Link>
                          
                          <button
                            onClick={() => {
                              signOut();
                              setDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-xs text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors cursor-pointer mt-1 border-t border-hairline pt-1.5"
                          >
                            <LogOut size={14} />
                            Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    className="px-5 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-on-primary rounded-sm transition-colors shadow-sm cursor-pointer"
                  >
                    Create Account
                  </motion.button>
                </Link>
              )}
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
                item.isAbsolute ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-zinc-900 dark:text-zinc-100 rounded-lg hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    {item.title}
                  </a>
                )
              ))}

              <div className="border-t border-hairline pt-4 space-y-3">
                {loading ? (
                  <div className="h-10 w-full rounded bg-zinc-900 border border-hairline animate-pulse" />
                ) : user ? (
                  <>
                    <div className="px-4 py-2.5 bg-zinc-900 border border-hairline rounded flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-violet/30" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-violet/20 border border-violet/30 text-violet flex items-center justify-center text-sm font-semibold uppercase">
                          {user.email.charAt(0)}
                        </div>
                      )}
                      <div className="text-left overflow-hidden">
                        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Active Account</p>
                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block">
                      <button className="w-full px-4 py-2.5 rounded-sm bg-primary hover:bg-primary/90 text-on-primary font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
                        <Sparkles size={15} />
                        Tailor Resume Dashboard
                      </button>
                    </Link>

                    <button
                      onClick={() => {
                        signOut();
                        setMobileOpen(false);
                      }}
                      className="w-full px-4 py-2.5 rounded-lg border border-red-500/20 text-red-400 font-medium hover:bg-red-500/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                    <button className="w-full px-4 py-2.5 rounded-sm bg-primary hover:bg-primary/90 text-on-primary font-medium transition-colors cursor-pointer">
                      Create Account
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}