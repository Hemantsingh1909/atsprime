"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  ChevronDown, 
  LogOut, 
  Plus, 
  User as UserIcon, 
  Settings as SettingsIcon,
  ArrowLeft,
  FileText,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HistoryPage() {
  const { user, savedResumes, signOut, deleteResume, useSupabase } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  // Helper to color code score values
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 text-ink dark:text-white flex flex-col font-sans select-none relative">
      {/* Glow Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-[400px] bg-gradient-to-b from-violet/5 via-highlight-pink/0 to-transparent blur-[120px]" />

      {/* Sticky top dashboard navigation */}
      <header className="sticky top-0 z-45 bg-canvas/80 backdrop-blur-md border-b border-hairline dark:border-zinc-900/60">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
              <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              ATSPrime
              {!useSupabase && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-700 tracking-wider">
                  SANDBOX
                </span>
              )}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors rounded-sm bg-zinc-900 border border-hairline hover:bg-zinc-850 cursor-pointer"
                >
                  {user.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={user.avatarUrl} alt="Avatar" className="h-5 w-5 rounded-full object-cover border border-violet/30" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-violet/20 border border-violet/30 text-violet flex items-center justify-center text-[10px] font-bold uppercase">
                      {user.email.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                  <ChevronDown size={12} className={`text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-md bg-canvas border border-hairline p-2 shadow-level-5 z-50 text-left"
                      >
                        <div className="px-2 py-1.5 border-b border-hairline mb-1 text-[10px] text-zinc-500 font-mono truncate">
                          {user.email}
                        </div>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer">
                            <Plus size={13} />
                            New Optimization
                          </button>
                        </Link>
                        <Link href="/history" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <History size={13} />
                            Resume History
                          </button>
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <UserIcon size={13} />
                            Profile
                          </button>
                        </Link>
                        <Link href="/settings" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <SettingsIcon size={13} />
                            Settings
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-xs text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors cursor-pointer mt-0.5 border-t border-hairline pt-1.5"
                        >
                          <LogOut size={13} />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 text-left">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
          <History size={22} className="text-violet" />
          Resume Tailoring History
        </h1>
        <p className="text-zinc-400 text-xs mb-8">
          Browse and manage all previous resume optimization drafts stored securely in PostgreSQL.
        </p>

        {savedResumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-dashed border-hairline dark:border-zinc-800 bg-zinc-900/15 p-12 text-center"
          >
            <div className="mx-auto w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <FileText size={18} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">No tailored resumes found</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
              When you optimize a base resume for a target job profile on the dashboard, it will appear here.
            </p>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-primary hover:bg-zinc-250 text-on-primary text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto shadow-sm">
                <Plus size={14} />
                Optimize Resume Now
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* List panel */}
            <div className="md:col-span-2 space-y-4">
              {savedResumes.map((resume) => (
                <motion.div
                  key={resume.id}
                  onClick={() => setSelectedResumeId(selectedResumeId === resume.id ? null : resume.id)}
                  className={`rounded-lg border p-5 bg-zinc-900/30 backdrop-blur-md cursor-pointer hover:border-zinc-700 transition-colors relative text-left group ${
                    selectedResumeId === resume.id ? "border-violet" : "border-hairline dark:border-zinc-800/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 overflow-hidden">
                      <h4 className="text-sm font-bold text-white group-hover:text-violet transition-colors truncate">
                        {resume.jobTitle}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {resume.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getScoreColor(resume.score)}`}>
                        {resume.score}% ATS
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this resume scan?")) {
                            deleteResume(resume.id);
                            if (selectedResumeId === resume.id) setSelectedResumeId(null);
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Score bar loader */}
                  <div className="w-full bg-zinc-950 h-1 rounded-full mt-4 overflow-hidden border border-zinc-900">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(resume.score)}`}
                      style={{ width: `${resume.score}%` }}
                    />
                  </div>

                  <AnimatePresence>
                    {selectedResumeId === resume.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-hairline dark:border-zinc-800/60"
                      >
                        <h5 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2">Optimized Content Excerpt</h5>
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans line-clamp-6 bg-zinc-950/60 p-3 rounded-sm border border-zinc-800/60">
                          {resume.tailoredText}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Side summary panel */}
            <div className="rounded-lg border border-hairline dark:border-zinc-800 bg-zinc-900/20 p-6 space-y-4">
              <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider border-b border-hairline dark:border-zinc-800 pb-2">Scans Summary</h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Total Scans:</span>
                <span className="font-bold text-white font-mono">{savedResumes.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Average ATS Score:</span>
                <span className="font-bold text-violet font-mono">
                  {Math.round(savedResumes.reduce((acc, curr) => acc + curr.score, 0) / savedResumes.length)}%
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded bg-zinc-950/50 border border-zinc-850 text-[10px] text-zinc-400 font-sans leading-relaxed">
                <AlertCircle size={14} className="text-violet flex-shrink-0" />
                All resumes listed are saved directly inside Supabase PostgreSQL and synced across your devices.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
