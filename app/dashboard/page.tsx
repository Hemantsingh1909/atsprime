"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Download,
  ArrowRight,
  RefreshCw,
  X,
  Lock,
  Mail,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Trash2,
  Plus,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Types for resume optimization
interface BulletDiff {
  original: string;
  tailored: string;
  improvements: string[];
}

// Sample Data
const sampleResumeFile = {
  name: "Alex_Rivera_Frontend_Engineer.pdf",
  size: "142 KB",
  uploadedAt: "Just now",
};

const sampleResumeContent = `Alex Rivera
alex.rivera@dev.io | +1 (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Frontend developer with experience building web applications using React and JavaScript. Passionate about writing clean code and improving layouts.

WORK EXPERIENCE
Frontend Developer | TechCorp (2024 - Present)
- Responsible for building React components and styling with CSS.
- Worked on page speed performance and improved loading times.
- Collaborated with backend devs to integrate APIs.
- Fixed layout alignment problems.

Software Engineer Intern | CodeLabs (2023)
- Wrote JavaScript and HTML/CSS code for marketing pages.
- Worked on user feedback issues and resolved styling bugs.`;

const sampleJobDescription = `Senior Frontend Engineer (React / Next.js)

We are looking for a Senior Frontend Engineer to build high-performance web applications. You will collaborate with product designers and backend engineers to craft beautiful, responsive developer tooling interfaces.

Key Requirements:
- 3+ years experience building production apps with React, TypeScript, and Tailwind CSS.
- Deep understanding of web performance optimization and Core Web Vitals (LCP, CLS, INP).
- Excellent collaboration skills for defining RESTful or GraphQL API contracts.
- Experience with server-side rendering, Next.js, and page-load optimizations.
- Passion for visual polish, accessibility (a11y), and motion design.`;

const resumeDiffs: BulletDiff[] = [
  {
    original: "Responsible for building React components and styling with CSS.",
    tailored: "Designed and engineered 25+ reusable React & TypeScript components using Tailwind CSS, boosting codebase modularity and reducing rendering times.",
    improvements: ["Added TypeScript type safety", "Highlighted Tailwind CSS usage", "Quantified component impact (25+)"],
  },
  {
    original: "Worked on page speed performance and improved loading times.",
    tailored: "Spearheaded Core Web Vitals audits and bundle-splitting optimizations, reducing Largest Contentful Paint (LCP) by 1.2s and improving SEO indexing scores.",
    improvements: ["Mentioned Core Web Vitals & LCP", "Linked to business metric (SEO)", "Specified metric improvement (1.2s)"],
  },
  {
    original: "Collaborated with backend devs to integrate APIs.",
    tailored: "Partnered with backend engineers to architect RESTful/GraphQL API contracts, ensuring seamless, type-safe data integration across 12+ dashboard views.",
    improvements: ["Defined API types (RESTful/GraphQL)", "Used active verb (architected)", "Specified scope (12+ views)"],
  },
  {
    original: "Fixed layout alignment problems.",
    tailored: "Conducted accessibility (a11y) audits and resolved critical responsive layout bugs, ensuring compliance with WCAG AAA standards across all viewports.",
    improvements: ["Added accessibility keywords", "Aligned with industry standards (WCAG AAA)", "Emphasized responsiveness"],
  },
];

const analysisSteps = [
  "Parsing uploaded resume document...",
  "Extracting work experience, skills, and metrics...",
  "Analyzing job description requirements & keywords...",
  "Evaluating resume against ATS scanner criteria...",
  "Rewriting work experience bullet points for maximum impact...",
  "Injecting missing industry keywords...",
  "Generating final ATS optimization report...",
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const {
    user,
    savedResumes,
    signUp,
    signIn,
    signOut,
    saveResume,
    deleteResume,
  } = useAuth();
  
  // App states: 1 = Upload, 2 = Job Description, 3 = Analysis, 4 = Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; uploadedAt: string } | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  
  // Auth state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Active layouts
  const [isDragging, setIsDragging] = useState(false);
  const [diffIndex, setDiffIndex] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [hasSavedThisRun, setHasSavedThisRun] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize auth type from URL parameter
  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "signin") {
      setAuthType("signin");
      setShowAuthModal(true);
    } else if (authParam === "signup") {
      setAuthType("signup");
      setShowAuthModal(true);
    }
  }, [searchParams]);

  // Auto-save resume if user is logged in and results are generated
  useEffect(() => {
    if (step === 4 && user && !hasSavedThisRun) {
      saveResume(
        jobDescription.split("\n")[0] || "Senior Frontend Engineer",
        resumeText || sampleResumeContent,
        getTailoredResumeText(),
        95
      )
        .then(() => {
          setHasSavedThisRun(true);
        })
        .catch((err) => console.error("Error auto-saving resume:", err));
    }
  }, [step, user, hasSavedThisRun]);

  // Handle fake file drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: "Just now",
      });
      setResumeText(sampleResumeContent);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: "Just now",
      });
      setResumeText(sampleResumeContent);
    }
  };

  const useSampleData = () => {
    setSelectedFile(sampleResumeFile);
    setResumeText(sampleResumeContent);
  };

  // Run analysis animation
  const startAnalysis = () => {
    if (!jobDescription.trim()) return;
    setStep(3);
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setHasSavedThisRun(false);
  };

  useEffect(() => {
    if (step !== 3) return;

    const totalDuration = 4000; // 4 seconds total
    const intervalTime = 40; // 40ms interval
    const totalSteps = totalDuration / intervalTime;
    let currentStepCount = 0;

    const progressInterval = setInterval(() => {
      currentStepCount += 1;
      const nextProgress = Math.min(Math.round((currentStepCount / totalSteps) * 100), 100);
      setAnalysisProgress(nextProgress);

      // Determine which text step to show
      const stepIndex = Math.min(
        Math.floor((nextProgress / 100) * analysisSteps.length),
        analysisSteps.length - 1
      );
      setCurrentAnalysisStep(stepIndex);

      if (nextProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setStep(4); // Move to Results
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [step]);

  // Construct optimized resume text
  const getTailoredResumeText = () => {
    return `ALEX RIVERA
alex.rivera@dev.io | +1 (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Senior-track Frontend Engineer with 3+ years of experience building high-performance web applications using React, Next.js, and TypeScript. Expert in Core Web Vitals optimization and fluid responsive architectures using Tailwind CSS.

WORK EXPERIENCE
Senior Frontend Developer | TechCorp (2024 - Present)
- ${resumeDiffs[0].tailored}
- ${resumeDiffs[1].tailored}
- ${resumeDiffs[2].tailored}
- ${resumeDiffs[3].tailored}

Software Engineer Intern | CodeLabs (2023)
- Wrote highly structured, modular JavaScript and React code for marketing and onboarding interfaces.
- Identified and resolved 15+ complex responsive CSS/layout styling issues across tablet and mobile viewports.`;
  };

  // Handle dynamic download of the tailored resume
  const handleDownload = () => {
    const tailoredResume = getTailoredResumeText();

    // Trigger standard browser file download
    const blob = new Blob([tailoredResume], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Alex_Rivera_Optimized_Resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    
    // Prompt lead capture registration modal for anonymous users
    if (!user) {
      setTimeout(() => {
        setAuthError("");
        setAuthType("signup");
        setShowAuthModal(true);
      }, 800);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    try {
      const res =
        authType === "signup"
          ? await signUp(email, password)
          : await signIn(email, password);

      if (res.success) {
        // If they register/login while having results active, immediately save it to their new profile!
        if (step === 4 && !hasSavedThisRun) {
          try {
            await saveResume(
              jobDescription.split("\n")[0] || "Senior Frontend Engineer",
              resumeText || sampleResumeContent,
              getTailoredResumeText(),
              95
            );
            setHasSavedThisRun(true);
          } catch (saveErr) {
            console.error("Failed to save resume on login", saveErr);
          }
        }
        setShowAuthModal(false);
        setEmail("");
        setPassword("");
      } else {
        setAuthError(res.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setAuthError("Auth process encountered an unexpected issue.");
    } finally {
      setAuthSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedFile(null);
    setResumeText("");
    setJobDescription("");
    setDownloadSuccess(false);
    setHasSavedThisRun(false);
  };

  return (
    <div className="min-h-screen bg-canvas-soft text-ink flex flex-col font-sans select-none relative">
      {/* Mesh background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-7xl h-[400px] bg-gradient-to-b from-violet/5 via-highlight-pink/0 to-transparent blur-[120px]" />
      
      {/* Sticky top dashboard navigation */}
      <header className="sticky top-0 z-45 bg-canvas/80 backdrop-blur-md border-b border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
            <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
              <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold tracking-tight text-white">
              ATSPrime
            </span>
            <span className="text-[10px] font-mono font-medium bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-hairline-strong ml-1">
              SANDBOX
            </span>
          </Link>

          {/* Stepper progress indicator */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-mute">
            <span className={`px-2 py-1 rounded transition-colors ${step === 1 ? "bg-primary text-on-primary font-semibold" : "text-zinc-500"}`}>
              01. Upload
            </span>
            <ChevronRight size={12} className="text-zinc-700" />
            <span className={`px-2 py-1 rounded transition-colors ${step === 2 ? "bg-primary text-on-primary font-semibold" : "text-zinc-500"}`}>
              02. Job Description
            </span>
            <ChevronRight size={12} className="text-zinc-700" />
            <span className={`px-2 py-1 rounded transition-colors ${step === 3 ? "bg-primary text-on-primary font-semibold animate-pulse" : "text-zinc-500"}`}>
              03. Analysis
            </span>
            <ChevronRight size={12} className="text-zinc-700" />
            <span className={`px-2 py-1 rounded transition-colors ${step === 4 ? "bg-primary text-on-primary font-semibold" : "text-zinc-500"}`}>
              04. Results
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors rounded-sm bg-zinc-900 border border-hairline hover:bg-zinc-850 cursor-pointer"
                >
                  <div className="h-5 w-5 rounded-full bg-violet/20 border border-violet/30 text-violet flex items-center justify-center text-[10px] font-bold uppercase">
                    {user.email.charAt(0)}
                  </div>
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
                        <button
                          onClick={resetFlow}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                        >
                          <Plus size={13} />
                          New Tailoring Run
                        </button>
                        <button
                          onClick={() => {
                            signOut();
                            setDropdownOpen(false);
                            resetFlow();
                          }}
                          className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-xs text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors cursor-pointer mt-0.5"
                        >
                          <LogOut size={13} />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthError("");
                  setAuthType("signin");
                  setShowAuthModal(true);
                }}
                className="px-4 py-1.5 text-xs font-semibold border border-hairline rounded-sm hover:bg-canvas-soft transition-colors cursor-pointer text-zinc-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: UPLOAD RESUME */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="font-mono text-xs text-violet font-semibold uppercase tracking-widest">
                  STEP 01
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-white mt-3">
                  Upload your base resume.
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                  Upload once. Our AI extracts your core experiences to build optimized matches.
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300
                  ${
                    isDragging
                      ? "border-violet bg-violet/5 scale-[1.01]"
                      : selectedFile
                      ? "border-emerald-500/50 bg-emerald-500/[0.02]"
                      : "border-zinc-800 bg-canvas hover:border-zinc-700"
                  }
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-4">
                  {selectedFile ? (
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FileCheck size={24} />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-zinc-900 border border-hairline flex items-center justify-center text-zinc-400">
                      <Upload size={20} />
                    </div>
                  )}

                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {selectedFile.size} • Ready for tailoring
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Drag & drop your resume file here
                      </p>
                      <p className="text-xs text-zinc-500 mt-1.5">
                        Supports PDF, DOCX, or TXT up to 5MB
                      </p>
                    </div>
                  )}

                  {!selectedFile && (
                    <button
                      type="button"
                      className="mt-2 px-4 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-850 border border-hairline rounded-sm transition-colors cursor-pointer text-zinc-200"
                    >
                      Browse Files
                    </button>
                  )}
                </div>
              </div>

              {/* Sample resume helper */}
              {!selectedFile && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-zinc-950 border border-hairline">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">No resume file on hand?</p>
                      <p className="text-[11px] text-zinc-500">Test the tailoring engine using our high-fidelity sample.</p>
                    </div>
                  </div>
                  <button
                    onClick={useSampleData}
                    className="w-full sm:w-auto px-4 py-1.5 text-xs font-bold bg-violet hover:bg-violet-deep text-white rounded-sm transition-colors cursor-pointer"
                  >
                    Use Sample Resume
                  </button>
                </div>
              )}

              {/* Action buttons */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-end"
                >
                  <button
                    onClick={() => setStep(2)}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-on-primary transition-all duration-200 cursor-pointer shadow-md"
                  >
                    Continue to Job Description
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </motion.div>
              )}

              {/* Saved Resumes History Section */}
              {user && savedResumes.length > 0 && (
                <div className="mt-12 space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-2">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                      Your Tailored Resumes ({savedResumes.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {savedResumes.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-canvas border border-hairline shadow-sm hover:border-zinc-800 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 overflow-hidden text-left">
                          <div className="h-9 w-9 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded flex items-center justify-center flex-shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{res.jobTitle}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              Tailored {res.createdAt} • Score: <span className="text-violet font-semibold">{res.score}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setResumeText(res.originalText);
                              setJobDescription(res.jobTitle);
                              setStep(4);
                              setHasSavedThisRun(true);
                              setDownloadSuccess(false);
                            }}
                            className="px-3 py-1.5 text-[11px] font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-hairline rounded-sm transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          
                          <button
                            onClick={() => deleteResume(res.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                            aria-label="Delete resume"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: PASTE JOB DESCRIPTION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl mx-auto"
            >
              <div className="text-center mb-8">
                <span className="font-mono text-xs text-violet font-semibold uppercase tracking-widest">
                  STEP 02
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-white mt-3">
                  Paste the Target Job.
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                  Paste the job posting to align your keywords, impact metrics, and skills dynamically.
                </p>
              </div>

              <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300 font-semibold text-sm">
                    <Briefcase size={16} className="text-violet" />
                    <span>Target Job Description</span>
                  </div>
                  <button
                    onClick={() => setJobDescription(sampleJobDescription)}
                    className="text-xs font-semibold text-violet hover:text-violet-soft cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles size={12} />
                    Load Sample Job
                  </button>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements, responsibilities, or description here..."
                  className="w-full min-h-[220px] rounded-sm bg-zinc-950 border border-hairline focus:border-hairline-strong p-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-y font-sans leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-1"
                  >
                    Go Back
                  </button>

                  <button
                    onClick={startAnalysis}
                    disabled={!jobDescription.trim()}
                    className={`
                      group inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer
                      ${
                        jobDescription.trim()
                          ? "bg-violet hover:bg-violet-deep text-white"
                          : "bg-zinc-800 text-zinc-500 border border-zinc-900 opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    Optimize & Tailor Resume
                    <Sparkles size={15} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LOADING / AI ANALYSIS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-md mx-auto text-center py-8"
            >
              <div className="relative inline-flex items-center justify-center h-28 w-28 rounded-full mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-900" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet border-r-highlight-pink"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <Sparkles size={32} className="text-violet animate-pulse" />
              </div>

              <span className="font-mono text-[10px] text-zinc-500 font-medium tracking-widest block uppercase">
                TAILORING ENGINE
              </span>
              
              <h2 className="text-2xl font-bold text-white mt-3">
                Applying AI Optimization
              </h2>
              
              <div className="mt-8 bg-zinc-950 border border-hairline rounded-lg p-5 text-left max-w-sm mx-auto shadow-level-3">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
                  <span className="text-xs font-bold text-zinc-400">Optimization Progress</span>
                  <span className="text-xs font-mono font-bold text-violet">{analysisProgress}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet to-highlight-pink"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>

                <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                  {analysisSteps.map((stepText, idx) => {
                    const isCompleted = idx < currentAnalysisStep;
                    const isCurrent = idx === currentAnalysisStep;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 transition-all duration-200 ${
                          isCompleted
                            ? "text-zinc-500"
                            : isCurrent
                            ? "text-violet font-semibold"
                            : "text-zinc-800"
                        }`}
                      >
                        {isCompleted ? (
                          <span className="text-emerald-500 flex-shrink-0">✓</span>
                        ) : isCurrent ? (
                          <span className="text-violet flex-shrink-0 animate-pulse">●</span>
                        ) : (
                          <span className="text-zinc-800 flex-shrink-0">○</span>
                        )}
                        <span>{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: OPTIMIZATION RESULTS */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Header section with actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-hairline pb-8">
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-semibold">
                    <CheckCircle2 size={13} strokeWidth={2} />
                    {user ? "Saved to your Profile history" : "Resume Successfully Optimized"}
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-white mt-4">
                    Tailored Resume Ready.
                  </h1>
                  <p className="text-zinc-400 text-sm mt-1">
                    Compare matching metrics and download your final tailored resume document.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={resetFlow}
                    className="px-5 py-2.5 text-sm font-semibold bg-zinc-900 border border-hairline rounded-sm hover:bg-zinc-850 transition-colors cursor-pointer text-zinc-300 flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Start Over
                  </button>

                  <button
                    onClick={handleDownload}
                    className="group px-6 py-2.5 text-sm font-semibold bg-violet hover:bg-violet-deep text-white rounded-sm shadow-level-3 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {downloadSuccess ? "Downloaded!" : "Download Tailored Resume"}
                    <Download size={15} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Main Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Score & Metadata widgets */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* ATS Score widget */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 text-center shadow-level-3">
                    <h3 className="text-sm font-bold text-zinc-400 tracking-tight">
                      ATS Optimization Score
                    </h3>

                    <div className="flex items-center justify-center gap-6 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-zinc-500 line-through">72</div>
                        <div className="text-[10px] text-zinc-600 font-mono mt-1">ORIGINAL</div>
                      </div>
                      
                      <div className="h-8 w-px bg-zinc-800" />

                      <div className="text-center">
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1.1 }}
                          className="text-5xl font-bold text-white bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent"
                        >
                          95
                        </motion.div>
                        <div className="text-[10px] text-violet font-semibold font-mono mt-1 animate-pulse">OPTIMIZED</div>
                      </div>
                    </div>

                    <div className="mt-6 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center justify-center gap-2">
                      <TrendingUp size={14} />
                      <span className="font-semibold">+23 Improvement Score points</span>
                    </div>
                  </div>

                  {/* Skills Match Card */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4 shadow-level-3">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      Target Keyword Analysis
                    </h3>

                    <div className="space-y-4 text-left">
                      {/* Keyword list */}
                      <div>
                        <span className="text-[11px] font-bold text-zinc-400 block mb-2">Matched Job Requirements (15)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["React", "TypeScript", "Tailwind CSS", "API integrations", "Responsive layouts", "Web optimization", "Visual polish"].map((kw) => (
                            <span key={kw} className="text-[10px] bg-zinc-900 border border-hairline text-zinc-300 px-2 py-0.5 rounded">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Keywords optimized */}
                      <div>
                        <span className="text-[11px] font-bold text-violet block mb-2">Optimized Keywords Inserted (5)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["Next.js", "Core Web Vitals", "GraphQL", "Bundle-splitting", "a11y / accessibility"].map((kw) => (
                            <span key={kw} className="text-[10px] bg-violet/10 border border-violet/20 text-violet-400 px-2 py-0.5 rounded font-semibold">
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formatting checklist */}
                  <div className="rounded-lg border border-hairline bg-zinc-950 p-6 space-y-3.5 text-left">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      ATS Compliance Check
                    </h3>
                    
                    {[
                      { text: "Contact information parsed", status: true },
                      { text: "No invalid text boxes/graphics", status: true },
                      { text: "Date formatting structured", status: true },
                      { text: "Font sizing standardized", status: true },
                      { text: "Skills mapping verified", status: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-400">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Right Side: Interactive Resume Bullet Diff */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="rounded-lg border border-hairline bg-canvas shadow-level-4 overflow-hidden flex flex-col h-full">
                    <div className="bg-zinc-950 border-b border-hairline px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-violet" />
                        <span className="text-sm font-semibold text-white">AI-Rewritten Bullet Points</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">
                        Comparing {diffIndex + 1} of {resumeDiffs.length}
                      </span>
                    </div>

                    <div className="p-6 space-y-6 flex-1 text-left">
                      
                      {/* Before and After Side-by-Side Diff */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Original */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-hairline px-2 py-0.5 rounded">
                            Original Bullet Point
                          </span>
                          <div className="p-4 rounded bg-zinc-950/50 border border-red-500/10 text-xs text-zinc-400 line-through leading-relaxed">
                            {resumeDiffs[diffIndex].original}
                          </div>
                        </div>

                        {/* Tailored */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono font-bold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded">
                            AI-Tailored Enhancement
                          </span>
                          <div className="p-4 rounded bg-emerald-500/[0.02] border border-emerald-500/20 text-xs text-white font-medium leading-relaxed">
                            {resumeDiffs[diffIndex].tailored}
                          </div>
                        </div>

                      </div>

                      {/* AI Improvements List */}
                      <div className="bg-zinc-950 border border-hairline rounded p-4 space-y-3">
                        <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold tracking-wider">
                          Why this works better:
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {resumeDiffs[diffIndex].improvements.map((improvement, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded border border-hairline">
                              <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                              <span>{improvement}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Pagination control footer */}
                    <div className="bg-zinc-950 border-t border-hairline px-6 py-4 flex items-center justify-between">
                      <button
                        onClick={() => setDiffIndex(prev => Math.max(prev - 1, 0))}
                        disabled={diffIndex === 0}
                        className="px-3.5 py-1.5 text-xs font-semibold border border-hairline rounded hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-zinc-300"
                      >
                        Previous Bullet
                      </button>

                      {/* Step Indicator dots */}
                      <div className="flex gap-1.5">
                        {resumeDiffs.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setDiffIndex(idx)}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                              idx === diffIndex ? "w-4 bg-violet" : "bg-zinc-800"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setDiffIndex(prev => Math.min(prev + 1, resumeDiffs.length - 1))}
                        disabled={diffIndex === resumeDiffs.length - 1}
                        className="px-3.5 py-1.5 text-xs font-semibold border border-hairline rounded hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-zinc-300"
                      >
                        Next Bullet
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* AUTH MODAL DIALOG */}
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Scrim overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute inset-0 bg-black backdrop-blur-sm"
              />

              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", duration: 0.4 }}
                className="relative z-10 w-full max-w-sm rounded-lg border border-hairline bg-canvas p-8 shadow-level-5 m-6 text-left animate-none"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-full hover:bg-zinc-900 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={15} />
                </button>

                <div className="text-center mb-6">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet/10 border border-violet/20 text-violet mb-4">
                    <Lock size={18} />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-white">
                    {authType === "signup" ? "Save your optimized resume" : "Sign In to ATSPrime"}
                  </h2>
                  
                  <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                    {authType === "signup"
                      ? "We've generated and downloaded your optimized resume. Create a free account to save your dashboard progress permanently."
                      : "Access your saved resumes and continue optimization."}
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  
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
                        className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline focus:border-hairline-strong pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password-input" className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-3.5 text-zinc-650" />
                      <input
                        id="password-input"
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-10 rounded-sm bg-zinc-950 border border-hairline focus:border-hairline-strong pl-10 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full h-10 bg-primary hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-on-primary font-semibold text-xs rounded-sm transition-colors shadow-sm cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    {authSubmitting ? (
                      <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                    ) : authType === "signup" ? (
                      "Create Free Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* Bottom toggle link */}
                <div className="text-center mt-6 pt-4 border-t border-hairline">
                  <button
                    onClick={() => {
                      setAuthError("");
                      setAuthType((prev) => (prev === "signup" ? "signin" : "signup"));
                    }}
                    className="text-xs font-semibold text-violet hover:text-violet-soft transition-colors cursor-pointer"
                  >
                    {authType === "signup"
                      ? "Already have an account? Sign In"
                      : "New to ATSPrime? Create an account"}
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas py-8 px-6 mt-12 text-center text-xs text-zinc-600 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ATSPrime Sandbox. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <span className="h-3 w-px bg-zinc-800" />
            <button onClick={() => { setAuthError(""); setAuthType("signup"); setShowAuthModal(true); }} className="hover:text-zinc-300">
              Create Account
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center text-ink">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
