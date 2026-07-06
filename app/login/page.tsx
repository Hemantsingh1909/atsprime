"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { 
    user, 
    signUp, 
    signIn, 
    signInWithGoogle, 
    forgotPassword,
    verifyEmailOtp,
    resendSignupOtp,
    loading: authLoading,
    useSupabase
  } = useAuth();

  const mockAuth = searchParams.get("mock_auth");
  let redirectUrl = searchParams.get("redirect") || "/";
  if (mockAuth && !redirectUrl.includes("mock_auth")) {
    redirectUrl += (redirectUrl.includes("?") ? "&" : "?") + `mock_auth=${mockAuth}`;
  }

  // Auth Card States: "signin" | "signup" | "forgot" | "verify"
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "verify">("signin");
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signup") {
      setMode("signup");
    } else if (authParam === "signin") {
      setMode("signin");
    }
  }, [searchParams]);
  
  // Inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingText, setLoadingText] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, authLoading, router, redirectUrl]);

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setSubmitting(true);

    try {
      if (mode === "signup") {
        setLoadingText("Creating account...");
        
        if (!fullName.trim()) {
          setErrorMessage("Please enter your full name.");
          setSubmitting(false);
          return;
        }
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

        const res = await signUp(email, password, fullName);
        if (res.success) {
          // Switch to OTP verification mode and preserve email
          setMode("verify");
          setStatusMessage("We've sent a verification code to your email. (Use 123456 for sandbox testing)");
          setPassword("");
          setConfirmPassword("");
        } else {
          setErrorMessage(formatError(res.error));
        }
      } else if (mode === "verify") {
        setLoadingText("Verifying code...");
        if (!otpCode.trim()) {
          setErrorMessage("Please enter the verification code.");
          setSubmitting(false);
          return;
        }
        const res = await verifyEmailOtp(email, otpCode);
        if (res.success) {
          setStatusMessage("Email verified successfully! Redirecting...");
          setLoadingText("Redirecting...");
          router.push(redirectUrl);
        } else {
          setErrorMessage(formatError(res.error));
        }
      } else if (mode === "signin") {
        setLoadingText("Signing in...");
        const res = await signIn(email, password);
        if (res.success) {
          setLoadingText("Redirecting...");
          router.push(redirectUrl);
        } else {
          if (res.error && (res.error.toLowerCase().includes("email not confirmed") || res.error.toLowerCase().includes("confirmation required"))) {
            // Unconfirmed signup: trigger OTP and move to verify mode
            await resendSignupOtp(email);
            setMode("verify");
            setStatusMessage("Email confirmation required. We've sent a verification code to your email. (Use 123456 for sandbox testing)");
          } else {
            setErrorMessage(formatError(res.error));
          }
        }
      } else if (mode === "forgot") {
        setLoadingText("Sending reset link...");
        const res = await forgotPassword(email);
        if (res.success) {
          setStatusMessage("Password reset link sent! Please check your email.");
          setEmail("");
        } else {
          setErrorMessage(formatError(res.error));
        }
      }
    } catch (err) {
      setErrorMessage("Authentication process encountered an unexpected issue.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    setStatusMessage("");
    setSubmitting(true);
    setLoadingText("Resending code...");

    try {
      const res = await resendSignupOtp(email);
      if (res.success) {
        setStatusMessage("A new verification code has been sent to your email.");
      } else {
        setErrorMessage(formatError(res.error));
      }
    } catch (err) {
      setErrorMessage("Could not resend verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setStatusMessage("");
    setSubmitting(true);
    setLoadingText("Connecting to Google...");

    try {
      const res = await signInWithGoogle();
      if (res.success) {
        setLoadingText("Redirecting...");
        // OAuth redirects immediately in production, but triggers local session set in mock mode
        router.push(redirectUrl);
      } else {
        setErrorMessage(formatError(res.error));
      }
    } catch (err) {
      setErrorMessage("Google connection failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // Clean error formats to avoid showing raw SQL or Supabase internals to customers
  const formatError = (rawError?: string): string => {
    if (!rawError) return "An unexpected error occurred.";
    const lower = rawError.toLowerCase();
    
    if (lower.includes("invalid login credentials") || lower.includes("invalid claim")) {
      return "Incorrect email or password. Please try again.";
    }
    if (lower.includes("email already") || lower.includes("user already exists")) {
      return "An account with this email address already exists.";
    }
    if (lower.includes("password should be at least")) {
      return "Password is too weak. Please use at least 6 characters.";
    }
    if (lower.includes("rate limit") || lower.includes("too many requests")) {
      return "Too many requests. Please verify your email or wait a moment.";
    }
    if (lower.includes("network") || lower.includes("fetch")) {
      return "Network connection issue. Please check your internet connection.";
    }
    if (lower.includes("expired") || lower.includes("invalid token")) {
      return "Your verification or reset link has expired. Please request a new one.";
    }
    
    return rawError;
  };

  return (
    <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 text-ink dark:text-white flex flex-col font-sans relative select-none">
      {/* Decorative mesh glows */}
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
          <Link href="/">
            <button className="px-4 py-2 text-xs font-semibold border border-hairline dark:border-zinc-800 rounded-sm hover:bg-zinc-105 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-300">
              Back to Home
            </button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-sm rounded-lg border border-hairline dark:border-zinc-900 bg-zinc-900/40 p-8 shadow-level-5 text-left backdrop-blur-md"
        >
          {/* Header Title */}
          <div className="text-center mb-6">
            {(mode === "forgot" || mode === "verify") && (
              <button 
                onClick={() => {
                  setErrorMessage("");
                  setStatusMessage("");
                  setMode("signin");
                }}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors mb-4 group"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Sign In
              </button>
            )}
            
            <h2 className="text-xl font-semibold text-white">
              {mode === "signin" && "Sign In to ATSPrime"}
              {mode === "signup" && "Get Started with ATSPrime"}
              {mode === "forgot" && "Reset Password"}
              {mode === "verify" && "Verify Your Email"}
            </h2>
            
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              {mode === "signin" && "Enter your credentials to access your dashboard workspace."}
              {mode === "signup" && "Create an account to start tailoring and scoring your resumes."}
              {mode === "forgot" && "Enter your email address and we'll send you a password recovery link."}
              {mode === "verify" && "Enter the verification code sent to your email address to complete registration."}
            </p>
          </div>

          {/* Feedback Messages */}
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

          {/* Auth Forms */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "verify" ? (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="otp-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                  Verification Code
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                  <input
                    id="otp-input"
                    type="text"
                    required
                    placeholder="Enter verification code"
                    maxLength={8}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    disabled={submitting}
                    className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-600 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none tracking-widest font-mono text-center font-bold"
                  />
                </div>
              </div>
            ) : (
              <>
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <label htmlFor="name-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-3.5 text-zinc-600" />
                      <input
                        id="name-input"
                        type="text"
                        required
                        placeholder="Alex Rivera"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={submitting}
                        className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-600 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={submitting}
                      className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-600 pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                          Password
                        </label>
                        {mode === "signin" && (
                          <button 
                            type="button"
                            onClick={() => {
                              setErrorMessage("");
                              setStatusMessage("");
                              setMode("forgot");
                            }}
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono tracking-wide"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                        <input
                          id="password-input"
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

                    {mode === "signup" && (
                      <div className="space-y-1.5">
                        <label htmlFor="confirm-password-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                          <input
                            id="confirm-password-input"
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
                    )}
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 bg-primary hover:bg-zinc-250 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-on-primary font-semibold text-xs rounded-sm transition-colors shadow-sm cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                  <span>{loadingText}</span>
                </>
              ) : mode === "signup" ? (
                "Create Account"
              ) : mode === "signin" ? (
                "Sign In"
              ) : mode === "verify" ? (
                "Verify Code"
              ) : (
                "Send Reset Link"
              )}
            </button>

            {(mode !== "forgot" && mode !== "verify") && (
              <>
                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-hairline dark:border-zinc-800/60"></div>
                  </div>
                  <span className="relative px-3 bg-zinc-900 text-[10px] font-mono font-bold text-zinc-550 uppercase tracking-wider">
                    or
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="w-full h-10 bg-zinc-950 border border-hairline dark:border-zinc-850 hover:bg-zinc-900 text-white text-xs font-semibold rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </form>

          {/* Toggle Screen Actions */}
          <div className="text-center mt-6 pt-4 border-t border-hairline dark:border-zinc-800/60">
            {mode === "signin" && (
              <button
                onClick={() => {
                  setErrorMessage("");
                  setStatusMessage("");
                  setMode("signup");
                }}
                className="text-xs font-semibold text-violet hover:text-violet-soft transition-colors cursor-pointer"
              >
                New to ATSPrime? Create an account
              </button>
            )}

            {mode === "signup" && (
              <button
                onClick={() => {
                  setErrorMessage("");
                  setStatusMessage("");
                  setMode("signin");
                }}
                className="text-xs font-semibold text-violet hover:text-violet-soft transition-colors cursor-pointer"
              >
                Already have an account? Sign In
              </button>
            )}

            {mode === "verify" && (
              <div className="flex flex-col gap-3 items-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={submitting}
                  className="text-xs font-semibold text-violet hover:text-violet-soft transition-colors cursor-pointer disabled:text-zinc-600 disabled:cursor-not-allowed"
                >
                  Didn't receive the code? Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setStatusMessage("");
                    setMode("signup");
                  }}
                  className="text-xs font-medium text-zinc-550 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  Back to Sign Up
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <button
                onClick={() => {
                  setErrorMessage("");
                  setStatusMessage("");
                  setMode("signin");
                }}
                className="text-xs font-semibold text-violet hover:text-violet-soft transition-colors cursor-pointer"
              >
                Cancel and return to Sign In
              </button>
            )}
          </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas-soft dark:bg-zinc-950 flex items-center justify-center text-ink dark:text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
