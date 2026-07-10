"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  ChevronDown, 
  LogOut, 
  Plus, 
  History, 
  User as UserIcon, 
  Trash2, 
  ArrowLeft,
  AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, signOut, deleteAccount, useSupabase } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Settings mock states
  const [autoSave, setAutoSave] = useState(true);
  const [collectAnalytics, setCollectAnalytics] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setDeleteError("Please type 'DELETE' to confirm.");
      return;
    }
    
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await deleteAccount();
      if (res.success) {
        setShowDeleteModal(false);
        setConfirmText("");
      } else {
        setDeleteError(res.error || "Failed to delete account.");
      }
    } catch (err) {
      const error = err as Error;
      setDeleteError(error.message || "An unexpected error occurred.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 text-ink dark:text-white flex flex-col font-sans select-none relative">
      {/* Decorative mesh glows */}
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
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-12 text-left">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
          <SettingsIcon size={22} className="text-violet" />
          Settings Preferences
        </h1>
        <p className="text-zinc-400 text-xs mb-8">
          Configure platform options and dashboard integration toggles.
        </p>

        <div className="space-y-6">
          {/* Preferences Settings Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-hairline dark:border-zinc-900 bg-zinc-900/30 p-6 space-y-6 backdrop-blur-md"
          >
            <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider border-b border-hairline dark:border-zinc-800 pb-2">Workspace Preferences</h3>
            
            <div className="space-y-4">
              {/* Auto Save Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">Auto-save Optimization Runs</span>
                  <p className="text-[10px] text-zinc-500 leading-normal">Automatically write scan reports to Supabase Postgres database.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoSave} 
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="h-4 w-4 accent-violet cursor-pointer"
                />
              </div>

              {/* Analytics Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">PostHog Event Telemetry</span>
                  <p className="text-[10px] text-zinc-500 leading-normal">Permit recording pageview statistics to PostHog trackers.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={collectAnalytics} 
                  onChange={(e) => setCollectAnalytics(e.target.checked)}
                  className="h-4 w-4 accent-violet cursor-pointer"
                />
              </div>

              {/* Emails Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">Branding & Notification Emails</span>
                  <p className="text-[10px] text-zinc-500 leading-normal">Receive product tips, guides, and ATS trends updates.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={marketingEmails} 
                  onChange={(e) => setMarketingEmails(e.target.checked)}
                  className="h-4 w-4 accent-violet cursor-pointer"
                />
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-red-500/10 bg-red-500/5 p-6 space-y-4 backdrop-blur-md"
          >
            <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider border-b border-red-500/10 pb-2">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white block">
                  {useSupabase ? "Delete Account" : "Delete Sandbox Account"}
                </span>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  {useSupabase 
                    ? "Permanently purge your profile data, configurations, and all saved resumes from the database." 
                    : "Permanently purge your account details and all saved resumes from PostgreSQL database."}
                </p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 size={13} />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Custom Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-canvas border border-red-500/20 rounded-lg p-6 space-y-6 text-left shadow-level-5"
            >
              <div className="flex items-center gap-3 border-b border-red-500/10 pb-4">
                <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Permanently Delete Account?</h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mt-0.5">This action is irreversible</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-zinc-400 leading-normal">
                  Are you absolutely sure you want to delete your account? Deleting your account will permanently delete all of your personal details, profile data, and saved resumes. This action cannot be undone and all of your files will be lost.
                </p>

                {deleteError && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    {deleteError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-zinc-400 font-mono uppercase tracking-wider text-[10px]">
                    Type <span className="text-white font-bold">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-red-500/50 px-3 text-xs text-white placeholder-zinc-700 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-hairline dark:border-zinc-900">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConfirmText("");
                    setDeleteError("");
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold border border-hairline dark:border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || deleting}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-550 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {deleting ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Permanently"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
