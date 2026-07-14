"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, User, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@supabase/supabase-js";


const POLL_INTERVAL_MS = 3_000;          // poll getUser() every 3 s
const POLL_TIMEOUT_MS  = 10 * 60_000;   // give up after 10 min

interface AuthGateModalProps {
  onClose: () => void;
}

type ModalStep = "signup" | "signin" | "link-pending";

export default function AuthGateModal({ onClose }: AuthGateModalProps) {
  const { signUp, signIn, resendSignupOtp, isAnonymous, refreshSession } = useAuth();

  const [modalStep, setModalStep] = useState<ModalStep>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  // ── Primary signal: onAuthStateChange (same-device cross-tab via localStorage)
  useEffect(() => {
    if (modalStep === "link-pending" && isAnonymous === false) {
      stopPolling();
      onClose();
    }
  }, [isAnonymous, modalStep, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start / stop polling whenever link-pending state is entered or left
  useEffect(() => {
    if (modalStep === "link-pending") {
      startPolling();
    } else {
      stopPolling();
    }
    return stopPolling;
  }, [modalStep]); // eslint-disable-line react-hooks/exhaustive-deps

  function startPolling() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const projectRef  = supabaseUrl ? new URL(supabaseUrl).hostname.split(".")[0] : "";
    const storageKey  = `sb-${projectRef}-auth-token`;

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    pollRef.current = setInterval(async () => {
      try {
        // 1. Direct local storage check (same-device cross-tab instantaneous sync)
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const session = JSON.parse(raw);
          if (session?.user && session.user.is_anonymous === false) {
            console.log("[Poll] Detected permanent session in localStorage.");
            await refreshSession();
            stopPolling();
            onClose();
            return;
          }
        }

        // 2. Server check fallback (cross-device or separate test contexts)
        const { data } = await sb.auth.getUser();
        if (data?.user && data.user.is_anonymous === false) {
          console.log("[Poll] Detected permanent user on server:", data.user.email);
          
          // Sync server verified state to localStorage
          const currentRaw = localStorage.getItem(storageKey);
          if (currentRaw) {
            const currentSession = JSON.parse(currentRaw);
            currentSession.user = data.user;
            currentSession.user.is_anonymous = false;
            localStorage.setItem(storageKey, JSON.stringify(currentSession));
          }
          
          await refreshSession();
          stopPolling();
          onClose();
        }
      } catch (err) {
        // keep polling
      }
    }, POLL_INTERVAL_MS);

    // Hard timeout — stop polling after 10 min, show expired message
    timeoutRef.current = setTimeout(() => {
      stopPolling();
      setTimedOut(true);
    }, POLL_TIMEOUT_MS);
  }

  function stopPolling() {
    if (pollRef.current)    { clearInterval(pollRef.current);   pollRef.current    = null; }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await signUp(email.trim(), password, fullName.trim());
    setIsLoading(false);
    if (result.success) {
      setModalStep("link-pending");
    } else {
      setError(result.error || "Sign-up failed. Please try again.");
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const result = await signIn(email.trim(), password);
    setIsLoading(false);
    if (result.success) {
      // onAuthStateChange fires → isAnonymous flips false → parent triggers download
      onClose();
    } else {
      setError(result.error || "Sign-in failed. Please check your credentials.");
    }
  }

  async function handleResend() {
    setError(null);
    setResendCooldown(true);
    await resendSignupOtp(email.trim());
    setTimeout(() => setResendCooldown(false), 30000);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        id="auth-gate-modal"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          id="auth-gate-close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-white"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* ── SIGNUP STEP ─────────────────────────────────── */}
        {modalStep === "signup" && (
          <>
            <div className="mb-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <CheckCircle2 size={20} className="text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Create a free account to download
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your optimized resume is ready. Sign up to unlock the download — no data re-entry needed.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400" htmlFor="auth-fullname">
                  Full Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400" htmlFor="auth-email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400" htmlFor="auth-password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="auth-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <button
                id="auth-gate-signup-submit"
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>Create Account &amp; Unlock Download <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <button
                id="auth-gate-switch-signin"
                onClick={() => { setModalStep("signin"); setError(null); }}
                className="text-violet-400 hover:text-violet-300 transition"
              >
                Sign in
              </button>
            </p>
          </>
        )}

        {/* ── SIGN IN STEP ─────────────────────────────────── */}
        {modalStep === "signin" && (
          <>
            <div className="mb-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <CheckCircle2 size={20} className="text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Sign in to download</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your optimized resume will download immediately after sign-in.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400" htmlFor="auth-signin-email">
                  Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="auth-signin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400" htmlFor="auth-signin-password">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    id="auth-signin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-red-400" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <button
                id="auth-gate-signin-submit"
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>Sign In &amp; Download <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <button
                id="auth-gate-switch-signup"
                onClick={() => { setModalStep("signup"); setError(null); }}
                className="text-violet-400 hover:text-violet-300 transition"
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {/* ── LINK PENDING STEP ────────────────────────────── */}
        {modalStep === "link-pending" && (
          <>
            <div className="mb-6">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Mail size={20} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {timedOut ? "Link expired" : "Check your inbox"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {timedOut ? (
                  <>
                    The 10-minute window has expired. Please start over and click the
                    confirmation link within 10 minutes of receiving it.
                  </>
                ) : (
                  <>
                    We sent a confirmation link to{" "}
                    <span className="font-medium text-zinc-300">{email}</span>.{" "}
                    Click the link in that email — this window will close and your
                    download will start automatically.
                  </>
                )}
              </p>
            </div>

            {/* Waiting indicator OR expired notice */}
            {timedOut ? (
              <button
                id="auth-gate-start-over"
                onClick={() => { setTimedOut(false); setModalStep("signup"); setError(null); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Start over <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader2 size={32} className="animate-spin text-violet-400" />
                  <p className="text-xs text-zinc-500">Waiting for confirmation… (times out in 10 min)</p>
                </div>

                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <span className="text-xs text-zinc-500">Didn&apos;t receive the email?</span>
                  <button
                    id="auth-gate-resend"
                    onClick={handleResend}
                    disabled={resendCooldown}
                    className="flex items-center gap-1 text-xs text-violet-400 transition hover:text-violet-300 disabled:opacity-40"
                  >
                    <RefreshCw size={11} />
                    {resendCooldown ? "Sent — wait 30s" : "Resend link"}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-zinc-500">
                  Wrong email?{" "}
                  <button
                    id="auth-gate-back-to-signup"
                    onClick={() => { stopPolling(); setModalStep("signup"); setError(null); }}
                    className="text-violet-400 hover:text-violet-300 transition"
                  >
                    Go back
                  </button>
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
