"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function ResetPasswordContent() {
  const router = useRouter();
  const { updatePassword, useSupabase } = useAuth();

  // Inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setSubmitting(true);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await updatePassword(password);
      if (res.success) {
        setStatusMessage("Password updated successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMessage(res.error || "Failed to update password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred during password update.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 text-ink dark:text-white flex flex-col font-sans relative select-none">
      {/* Glow mesh background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-[450px] bg-gradient-to-b from-violet/10 via-highlight-pink/0 to-transparent blur-[130px]" />

      {/* Navigation header */}
      <header className="border-b border-hairline dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
              <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold tracking-tight text-white">
              ATSPrime
            </span>
          </Link>
        </div>
      </header>

      {/* Main Form block */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-sm rounded-lg border border-hairline dark:border-zinc-900 bg-zinc-900/40 p-8 shadow-level-5 text-left backdrop-blur-md"
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">Enter New Password</h2>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              Please enter and confirm your new secure account password.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-mono">
              {errorMessage}
            </div>
          )}

          {statusMessage && (
            <div className="mb-4 p-3 rounded bg-blue-500/10 border border-blue-500/25 text-xs text-blue-400 font-mono">
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="new-password-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                <input
                  id="new-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-600 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-new-password-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                <input
                  id="confirm-new-password-input"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-600 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 bg-primary hover:bg-zinc-250 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-on-primary font-semibold text-xs rounded-sm transition-colors shadow-sm cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                  <span>Updating password...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline dark:border-zinc-900 bg-white dark:bg-zinc-950 py-8 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {useSupabase ? "ATSPrime" : "ATSPrime Sandbox"}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 flex items-center justify-center text-ink dark:text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
