"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  Plus, 
  History, 
  CreditCard, 
  Settings as SettingsIcon,
  Mail,
  Shield,
  Calendar,
  Sparkles,
  ArrowLeft,
  Camera
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, signOut, updateProfile, useSupabase, savedResumes } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatarUrl || "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatarUrl || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await updateProfile(name, avatar);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
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

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-12 text-left">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft size={13} />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-2">
          <UserIcon size={22} className="text-violet" />
          My Profile
        </h1>
        <p className="text-zinc-400 text-xs mb-8">
          Manage your personal details and account credentials.
        </p>

        {user && (
          <div className="space-y-6">
            {/* Profile detail card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-hairline dark:border-zinc-900 bg-zinc-900/30 p-6 space-y-6 backdrop-blur-md"
            >
              {/* Header profile initials avatar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b border-hairline dark:border-zinc-800 pb-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-20 w-20 rounded-full overflow-hidden cursor-pointer group shadow-sm flex-shrink-0"
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-violet to-highlight-pink flex items-center justify-center text-white text-2xl font-bold uppercase">
                      {user.email.charAt(0)}
                    </div>
                  )}
                  {/* Camera overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                    <Camera size={18} />
                    <span className="text-[9px] font-mono uppercase tracking-wider mt-1">Change</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white">{name || "ATSPrime User"}</h3>
                  <p className="text-xs text-zinc-500 mb-2">{user.email}</p>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[10px] font-semibold border border-hairline dark:border-zinc-800 text-zinc-300 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Upload Photo
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Editable Form */}
              <form onSubmit={handleSave} className="space-y-4">
                {error && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    Changes saved successfully!
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                      <Mail size={13} />
                    </div>
                    <input 
                      type="text" 
                      value={user.email} 
                      disabled 
                      className="w-full h-9 rounded-sm bg-zinc-950/50 border border-hairline dark:border-zinc-900/80 pl-9 pr-3 text-xs text-zinc-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="profile-name-input" className="block text-zinc-400 font-mono uppercase tracking-wider text-[10px]">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                      <UserIcon size={13} />
                    </div>
                    <input 
                      id="profile-name-input"
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Enter your name" 
                      required
                      className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline dark:border-zinc-800/80 focus:border-zinc-650 pl-9 pr-3 text-xs text-white placeholder-zinc-700 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs items-center pt-2">
                  <span className="text-zinc-500 font-mono uppercase tracking-wider text-[10px]">Active Status</span>
                  <span className="col-span-2 text-emerald-400 font-medium flex items-center gap-1.5">
                    <Shield size={13} className="text-emerald-500" />
                    {useSupabase ? "Verified Member" : "Verified Sandbox Member"}
                  </span>
                </div>

                <div className="border-t border-hairline dark:border-zinc-800 pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="px-4 py-1.5 text-xs font-semibold bg-primary hover:bg-zinc-250 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-on-primary rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Platform limits card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border border-hairline dark:border-zinc-900 bg-zinc-900/30 p-6 space-y-4 backdrop-blur-md"
            >
              <h3 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider border-b border-hairline dark:border-zinc-800 pb-2">Workspace Limits</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Monthly Scans Used:</span>
                  <span className="font-semibold text-white">
                    {Math.max(0, 2 - (savedResumes?.length || 0))}/2 left
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">PDF Resumes Exported:</span>
                  <span className="font-semibold text-white">
                    {Math.max(0, 2 - (savedResumes?.length || 0))}/2 left
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
