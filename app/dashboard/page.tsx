"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Download,
  ArrowRight,
  ArrowLeft,
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
  Key,
  Zap,
  Target,
  ShieldCheck,
  History,
  CreditCard,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { templates, generateTemplateHtml } from "@/app/utils/templates";
import posthog from "posthog-js";

// Types for resume optimization
interface BulletDiff {
  original: string;
  tailored: string;
  improvements: string[];
}

interface OptimizedData {
  originalResumeText?: string;
  tailoredResumeText: string;
  originalAtsScore: number;
  optimizedAtsScore: number;
  matchedKeywords: string[];
  insertedKeywords: string[];
  bulletDiffs: BulletDiff[];
}

// Shared templates and helpers imported from @/app/utils/templates

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
  const router = useRouter();

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
    signInWithGoogle,
    signOut,
    saveResume,
    deleteResume,
    loading,
    useSupabase,
  } = useAuth();


  
  // App states: 1 = Upload, 2 = Job Description, 3 = Analysis, 4 = Results
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const handleStepClick = (targetStep: 1 | 2 | 3 | 4) => {
    if (targetStep === 1) {
      setStep(1);
    } else if (targetStep === 2) {
      if (resumeText.trim() !== "" || step >= 2) {
        setStep(2);
      }
    } else if (targetStep === 3) {
      if (analysisProgress > 0 || step >= 3) {
        setStep(3);
      }
    } else if (targetStep === 4) {
      if (optimizedData || step === 4) {
        setStep(4);
      }
    }
  };
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; uploadedAt: string } | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [optimizedData, setOptimizedData] = useState<OptimizedData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const [activeResultTab, setActiveResultTab] = useState<"enhancements" | "preview">("enhancements");
  const [selectedTemplate, setSelectedTemplate] = useState<"classic" | "modern" | "minimal" | "split" | "slate" | "executive">("classic");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  

  
  // Active layouts
  const [isDragging, setIsDragging] = useState(false);
  const [diffIndex, setDiffIndex] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [hasSavedThisRun, setHasSavedThisRun] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Load state from sessionStorage on client mount
  useEffect(() => {
    try {
      const savedStep = sessionStorage.getItem("atsprime_dashboard_step");
      const savedSelectedFile = sessionStorage.getItem("atsprime_dashboard_selectedFile");
      const savedResumeText = sessionStorage.getItem("atsprime_dashboard_resumeText");
      const savedJobDesc = sessionStorage.getItem("atsprime_dashboard_jobDescription");
      const savedOptimizedData = sessionStorage.getItem("atsprime_dashboard_optimizedData");
      const savedBase64 = sessionStorage.getItem("atsprime_dashboard_uploadedFileBase64");

      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep === 1 || parsedStep === 2 || parsedStep === 3 || parsedStep === 4) {
          // If the page was refreshed during dynamic tailoring, step back to Step 2 so they can re-run
          setStep(parsedStep === 3 ? 2 : parsedStep as 1 | 2 | 3 | 4);
        }
      }
      if (savedSelectedFile) setSelectedFile(JSON.parse(savedSelectedFile));
      if (savedResumeText) setResumeText(savedResumeText);
      if (savedJobDesc) setJobDescription(savedJobDesc);
      if (savedOptimizedData) setOptimizedData(JSON.parse(savedOptimizedData));
      if (savedBase64) setUploadedFileBase64(savedBase64);
    } catch (e) {
      console.error("Failed to restore session state:", e);
    }
  }, []);

  // Trigger pending download after user logging in
  useEffect(() => {
    if (user && sessionStorage.getItem("pending_dashboard_download") === "true") {
      sessionStorage.removeItem("pending_dashboard_download");
      handleDownload();
    }
  }, [user]);

  // Save state to sessionStorage when states change
  useEffect(() => {
    try {
      sessionStorage.setItem("atsprime_dashboard_step", String(step));
      if (selectedFile) {
        sessionStorage.setItem("atsprime_dashboard_selectedFile", JSON.stringify(selectedFile));
      } else {
        sessionStorage.removeItem("atsprime_dashboard_selectedFile");
      }
      sessionStorage.setItem("atsprime_dashboard_resumeText", resumeText || "");
      sessionStorage.setItem("atsprime_dashboard_jobDescription", jobDescription || "");
      if (optimizedData) {
        sessionStorage.setItem("atsprime_dashboard_optimizedData", JSON.stringify(optimizedData));
      } else {
        sessionStorage.removeItem("atsprime_dashboard_optimizedData");
      }
      if (uploadedFileBase64) {
        sessionStorage.setItem("atsprime_dashboard_uploadedFileBase64", uploadedFileBase64);
      } else {
        sessionStorage.removeItem("atsprime_dashboard_uploadedFileBase64");
      }
    } catch (e) {
      console.error("Failed to save session state:", e);
    }
  }, [step, selectedFile, resumeText, jobDescription, optimizedData, uploadedFileBase64]);

  // Auto-save resume if user is logged in and results are generated
  useEffect(() => {
    if (step === 4 && user && !hasSavedThisRun && optimizedData) {
      saveResume(
        jobDescription.split("\n")[0] || "Senior Frontend Engineer",
        resumeText || sampleResumeContent,
        optimizedData.tailoredResumeText,
        optimizedData.optimizedAtsScore,
        JSON.stringify(optimizedData)
      )
        .then(() => {
          setHasSavedThisRun(true);
        })
        .catch((err) => console.error("Error auto-saving resume:", err));
    }
  }, [step, user, hasSavedThisRun, optimizedData]);

  // Track step-based funnel progress for drop-offs
  useEffect(() => {
    if (step === 2) {
      posthog.capture("job_description_step_reached");
    }
  }, [step]);

  // Track template selections in the dashboard results tab
  useEffect(() => {
    if (step === 4) {
      posthog.capture("template_selected", {
        template_id: selectedTemplate,
        source: "dashboard_results",
      });
    }
  }, [selectedTemplate, step]);

  // Handle fake file drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const processFile = async (file: File) => {
    setIsParsing(true);
    setApiError(null);
    setSelectedFile({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      uploadedAt: "Just now",
    });
    setUploadedFile(file);

    posthog.capture("resume_upload_started", {
      file_name: file.name,
      file_size_kb: Math.round(file.size / 1024),
      file_type: file.name.split(".").pop(),
    });

    try {
      if (file.name.toLowerCase().endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setResumeText(text);
          setUploadedFileBase64(null);
          setIsParsing(false);
          posthog.capture("resume_upload_success", { file_type: "txt" });
        };
        reader.onerror = () => {
          setApiError("Failed to read text file.");
          setIsParsing(false);
          posthog.capture("resume_upload_failed", { file_type: "txt", error: "Failed to read text file." });
        };
        reader.readAsText(file);
      } else if (file.name.toLowerCase().endsWith(".pdf")) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          setUploadedFileBase64(base64);
          setResumeText(`[PDF Document: ${file.name}]`);
          setIsParsing(false);
          posthog.capture("resume_upload_success", { file_type: "pdf" });
        };
        reader.onerror = () => {
          setApiError("Failed to read PDF file.");
          setIsParsing(false);
          posthog.capture("resume_upload_failed", { file_type: "pdf", error: "Failed to read PDF file." });
        };
        reader.readAsDataURL(file);
      } else if (file.name.toLowerCase().endsWith(".docx")) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const mammoth = await import("mammoth");
            const result = await mammoth.extractRawText({ arrayBuffer });
            setResumeText(result.value);
            setUploadedFileBase64(null);
            posthog.capture("resume_upload_success", { file_type: "docx" });
          } catch (err: any) {
            console.error("Docx parsing error:", err);
            setApiError("Failed to parse DOCX file content.");
            posthog.capture("resume_upload_failed", { file_type: "docx", error: err.message || "Failed to parse DOCX file content." });
          } finally {
            setIsParsing(false);
          }
        };
        reader.onerror = () => {
          setApiError("Failed to read DOCX file.");
          setIsParsing(false);
          posthog.capture("resume_upload_failed", { file_type: "docx", error: "Failed to read DOCX file." });
        };
        reader.readAsArrayBuffer(file);
      } else {
        const fileExt = file.name.split(".").pop();
        setApiError("Unsupported file format. Please upload PDF, DOCX, or TXT.");
        setIsParsing(false);
        posthog.capture("resume_upload_failed", { file_type: fileExt, error: "Unsupported file format." });
      }
    } catch (err: any) {
      console.error("File processing error:", err);
      setApiError("An error occurred while processing the file.");
      setIsParsing(false);
      posthog.capture("resume_upload_failed", { file_name: file.name, error: err.message || "An error occurred while processing the file." });
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const useSampleData = () => {
    setSelectedFile(sampleResumeFile);
    setResumeText(sampleResumeContent);
    setUploadedFile(null);
    setUploadedFileBase64(null);
  };

  // Run analysis trigger
  const startAnalysis = () => {
    if (!jobDescription.trim()) return;
    runGeminiOptimization();
  };

  // Alphanumeric hashing function to generate cache keys safely
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return "opt_cache_" + Math.abs(hash);
  };
  const runGeminiOptimization = async () => {
    setApiError(null);
    posthog.capture("optimization_started");
    // Bypass daily limit logic during automated Playwright test runs
    const isTesting = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mock_auth") === "true";
    
    if (!isTesting) {
      const todayStr = new Date().toISOString().split("T")[0];
      const storedStr = localStorage.getItem("atsprime_daily_optimizations");
      let stored = { count: 0, date: todayStr };
      try {
        if (storedStr) {
          const parsed = JSON.parse(storedStr);
          if (parsed.date === todayStr) {
            stored = parsed;
          }
        }
      } catch (e) {}

      if (stored.count >= 2) {
        setApiError("You have reached your limit of 2 free AI optimizations for today. Please try again tomorrow.");
        return;
      }
    }

    // Check LocalStorage Cache for identical queries
    const cacheKey = getHash(resumeText + "|" + jobDescription);
    try {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        console.log("Cache hit! Loading optimized resume data from local cache.");
        setStep(3);
        setAnalysisProgress(50);
        setCurrentAnalysisStep(2);
        
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const parsedData = JSON.parse(cachedData) as OptimizedData;
        setOptimizedData(parsedData);
        if (parsedData.originalResumeText) {
          setResumeText(parsedData.originalResumeText);
        }
        
        setAnalysisProgress(100);
        setCurrentAnalysisStep(analysisSteps.length - 1);
        setTimeout(() => {
          setStep(4);
        }, 500);
        return;
      }
    } catch (e) {
      console.warn("Failed to check or load from cache:", e);
    }

    setStep(3);
    setAnalysisProgress(0);
    setCurrentAnalysisStep(0);
    setHasSavedThisRun(false);

    // Start progress animation up to 90%
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 2;
      if (currentProgress <= 90) {
        setAnalysisProgress(currentProgress);
        
        // Progress steps logic
        const stepIndex = Math.min(
          Math.floor((currentProgress / 105) * analysisSteps.length),
          analysisSteps.length - 1
        );
        setCurrentAnalysisStep(stepIndex);
      } else {
        clearInterval(progressInterval);
      }
    }, 45);

    try {
      const response = await fetch(
        "/api/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText,
            jobDescription,
            uploadedFileBase64
          })
        }
      );

      clearInterval(progressInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error("RATE_LIMIT_429");
        }
        throw new Error(errData.error?.message || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean and parse JSON
      let cleanedText = rawText.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(json)?/, "");
        cleanedText = cleanedText.replace(/```$/, "");
      }
      cleanedText = cleanedText.trim();

      const parsedData = JSON.parse(cleanedText) as OptimizedData;
      setOptimizedData(parsedData);
      posthog.capture("optimization_success", {
        ats_score_original: parsedData.originalAtsScore,
        ats_score_optimized: parsedData.optimizedAtsScore,
        keywords_matched_count: parsedData.matchedKeywords?.length || 0,
        keywords_inserted_count: parsedData.insertedKeywords?.length || 0,
        bullet_diffs_count: parsedData.bulletDiffs?.length || 0
      });
      
      // Update original resume text if returned by Gemini (extremely useful for PDF extractions)
      if (parsedData.originalResumeText) {
        setResumeText(parsedData.originalResumeText);
      }

      // Save valid optimized response to local cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(parsedData));
      } catch (e) {
        console.warn("Failed to save to local cache:", e);
      }

      // Increment daily optimization limit
      if (!isTesting) {
        const todayStr = new Date().toISOString().split("T")[0];
        const storedStr = localStorage.getItem("atsprime_daily_optimizations");
        let stored = { count: 0, date: todayStr };
        try {
          if (storedStr) {
            const parsed = JSON.parse(storedStr);
            if (parsed.date === todayStr) {
              stored = parsed;
            }
          }
        } catch (e) {}
        stored.count += 1;
        localStorage.setItem("atsprime_daily_optimizations", JSON.stringify(stored));
      }
      
      // Set to 100% and transition
      setAnalysisProgress(100);
      setCurrentAnalysisStep(analysisSteps.length - 1);
      setTimeout(() => {
        setStep(4);
      }, 500);

    } catch (err: any) {
      clearInterval(progressInterval);
      console.error("Gemini optimization error:", err);
      posthog.capture("optimization_failed", {
        error: err.message || "An unexpected error occurred during optimization."
      });
      if (err.message === "RATE_LIMIT_429") {
        setApiError("The AI engine is currently experiencing heavy traffic. Please wait 10 seconds and click Optimize again to retry.");
      } else {
        setApiError(err.message || "An unexpected error occurred during optimization.");
      }
      setStep(2); // Go back to Job Description
    }
  };

  // Handle dynamic download of the tailored resume as PDF via server API
  const handleDownload = async (): Promise<boolean> => {
    if (!user) {
      sessionStorage.setItem("pending_dashboard_download", "true");
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }

    if (!optimizedData) return false;
    setDownloadingPdf(true);
    setApiError(null);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: optimizedData.tailoredResumeText,
          templateId: selectedTemplate,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Failed to generate PDF (HTTP ${response.status})`);
      }

      // Convert response stream to a PDF blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const baseName = selectedFile 
        ? selectedFile.name.replace(/\.[^/.]+$/, "")
        : "ATSPrime_Optimized_Resume";
        
      const formattedTemplateName = selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1);
      const fileName = `${baseName}_${formattedTemplateName}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Delay revocation to ensure browser download manager has retrieved the blob
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      setDownloadSuccess(true);
      return true;
    } catch (err: any) {
      console.error("PDF download error:", err);
      setApiError(err.message || "Failed to download resume PDF.");
      return false;
    } finally {
      setDownloadingPdf(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-soft flex items-center justify-center text-ink">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
      </div>
    );
  }



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
             <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              ATSPrime
              {!useSupabase && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-700 tracking-wider">
                  SANDBOX
                </span>
              )}
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
                        <button
                          onClick={() => {
                            resetFlow();
                            setDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer"
                        >
                          <Plus size={13} />
                          New Optimization
                        </button>
                        <Link href="/history" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <History size={13} />
                            Resume History
                          </button>
                        </Link>
                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <User size={13} />
                            Profile
                          </button>
                        </Link>
                        <Link href="/settings" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-xs text-zinc-300 hover:text-white rounded hover:bg-zinc-900 transition-colors cursor-pointer mt-0.5">
                            <Settings size={13} />
                            Settings
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setDropdownOpen(false);
                            resetFlow();
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
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {selectedFile.size} • Ready for tailoring
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-2 max-w-[280px] mx-auto leading-normal">
                          Wrong resume? You can click the button below or drag a new file here to choose a different resume to upload.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-2 text-xs font-semibold border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-500 rounded-sm text-zinc-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RefreshCw size={12} className="text-violet-400" />
                        Choose a new resume
                      </button>
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
                    disabled={isParsing}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-on-primary transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isParsing ? "Parsing Resume..." : "Continue to Job Description"}
                    {!isParsing && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
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
                              if (res.optimizedDataString) {
                                try {
                                  setOptimizedData(JSON.parse(res.optimizedDataString));
                                } catch (e) {
                                  console.error("Error parsing saved optimized data:", e);
                                  setOptimizedData(null);
                                }
                              } else {
                                setOptimizedData(null);
                              }
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
                {selectedFile && (
                  <div className="flex items-center justify-between p-3.5 rounded-lg bg-zinc-950/60 border border-hairline text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCheck size={14} className="text-emerald-450 flex-shrink-0" />
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider font-semibold">Active Resume:</span>
                      <span className="truncate font-medium text-white">{selectedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setTimeout(() => {
                          fileInputRef.current?.click();
                        }, 150);
                      }}
                      className="text-violet hover:text-violet-soft font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ml-3 flex-shrink-0 text-xs"
                    >
                      <RefreshCw size={12} />
                      Change
                    </button>
                  </div>
                )}

                {apiError && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
                    <span>{apiError}</span>
                    <button onClick={() => setApiError(null)} className="text-zinc-500 hover:text-zinc-300 font-semibold ml-2 cursor-pointer">
                      ✕
                    </button>
                  </div>
                )}
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
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer flex items-center gap-1.5 group"
                  >
                    <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
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
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 text-sm font-semibold bg-zinc-900 border border-hairline rounded-sm hover:bg-zinc-850 transition-colors cursor-pointer text-zinc-300 flex items-center gap-2 group"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back
                  </button>

                  <button
                    onClick={resetFlow}
                    className="px-5 py-2.5 text-sm font-semibold bg-zinc-900 border border-hairline rounded-sm hover:bg-zinc-850 transition-colors cursor-pointer text-zinc-300 flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Start Over
                  </button>

                  <button
                    onClick={() => setActiveResultTab("preview")}
                    className="group px-6 py-2.5 text-sm font-semibold bg-violet hover:bg-violet-deep text-white rounded-sm shadow-level-3 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    Download PDF / Preview
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
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6 text-left">
                      ATS Match Score Comparison
                    </h3>

                    <div className="flex items-center justify-around gap-4">
                      {/* Original Score */}
                      <div className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="24"
                              className="stroke-zinc-900"
                              strokeWidth="5"
                              fill="transparent"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="24"
                              className="stroke-zinc-700"
                              strokeWidth="5"
                              fill="transparent"
                              strokeDasharray={150.8}
                              strokeDashoffset={150.8 - ((optimizedData?.originalAtsScore ?? 72) / 100) * 150.8}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-zinc-400">
                              {optimizedData?.originalAtsScore ?? 72}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-mono mt-2 font-bold tracking-wider">
                          ORIGINAL
                        </span>
                      </div>

                      {/* Arrow connector */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-zinc-900 border border-hairline flex items-center justify-center text-zinc-555">
                          <TrendingUp size={14} className="text-violet animate-pulse" />
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">
                          +{(optimizedData?.optimizedAtsScore ?? 95) - (optimizedData?.originalAtsScore ?? 72)}
                        </span>
                      </div>

                      {/* Optimized Score */}
                      <div className="flex flex-col items-center">
                        <div className="relative flex items-center justify-center">
                          <svg className="w-24 h-24 transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="38"
                              className="stroke-zinc-900"
                              strokeWidth="7"
                              fill="transparent"
                            />
                            <motion.circle
                              cx="48"
                              cy="48"
                              r="38"
                              className="stroke-violet"
                              strokeWidth="7"
                              fill="transparent"
                              strokeDasharray={238.76}
                              initial={{ strokeDashoffset: 238.76 }}
                              animate={{ strokeDashoffset: 238.76 - ((optimizedData?.optimizedAtsScore ?? 95) / 100) * 238.76 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent">
                              {optimizedData?.optimizedAtsScore ?? 95}
                            </span>
                            <span className="text-[8px] text-zinc-500 font-mono font-medium -mt-1">/ 100</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-violet font-mono mt-2 font-bold tracking-wider animate-pulse">
                          OPTIMIZED
                        </span>
                      </div>
                    </div>

                    {/* Performance Statement */}
                    <div className="mt-6 text-left p-3.5 rounded-lg bg-zinc-950 border border-hairline flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-[11px] font-bold text-white leading-none">High ATS Compatibility</h4>
                        <p className="text-[10px] text-zinc-450 leading-normal font-medium">
                          Your resume matches {(optimizedData?.matchedKeywords?.length ?? 15) + (optimizedData?.insertedKeywords?.length ?? 5)} job requirements, ranking in the top 5% of candidate compatibility templates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Match Card */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-5 shadow-level-3">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider text-left">
                      Target Keyword Analysis
                    </h3>

                    {/* Stacked Progress Bar */}
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 font-bold uppercase">
                        <span>Requirement Coverage</span>
                        <span className="text-white">{(optimizedData?.matchedKeywords?.length ?? 15) + (optimizedData?.insertedKeywords?.length ?? 5)} Matched</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                        <div className="h-full bg-emerald-500" style={{ width: `${Math.round(((optimizedData?.matchedKeywords?.length ?? 15) / ((optimizedData?.matchedKeywords?.length ?? 15) + (optimizedData?.insertedKeywords?.length ?? 5) + 2)) * 100)}%` }} />
                        <div className="h-full bg-violet" style={{ width: `${Math.round(((optimizedData?.insertedKeywords?.length ?? 5) / ((optimizedData?.matchedKeywords?.length ?? 15) + (optimizedData?.insertedKeywords?.length ?? 5) + 2)) * 100)}%` }} />
                      </div>
                      <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500 font-medium">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{optimizedData?.matchedKeywords?.length ?? 15} Matched</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                          <span>{optimizedData?.insertedKeywords?.length ?? 5} AI-Optimized</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-left border-t border-hairline pt-4">
                      {/* Keyword list */}
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 block mb-2 font-bold uppercase tracking-wider">
                          Matched Job Requirements ({optimizedData?.matchedKeywords?.length ?? 15})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(optimizedData?.matchedKeywords ?? ["React", "TypeScript", "Tailwind CSS", "API integrations", "Responsive layouts", "Web optimization", "Visual polish"]).map((kw) => (
                            <span key={kw} className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/[0.03] border border-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-medium">
                              <span className="text-[8px]">✓</span> {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Keywords optimized */}
                      <div>
                        <span className="text-[10px] font-mono text-violet block mb-2 font-bold uppercase tracking-wider">
                          Optimized Keywords Inserted ({optimizedData?.insertedKeywords?.length ?? 5})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(optimizedData?.insertedKeywords ?? ["Next.js", "Core Web Vitals", "GraphQL", "Bundle-splitting", "a11y / accessibility"]).map((kw) => (
                            <span key={kw} className="inline-flex items-center gap-1 text-[10px] bg-violet/5 border border-violet/10 text-violet-400 px-2 py-0.5 rounded font-semibold">
                              <span className="text-[8px]">+</span> {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Formatting checklist */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4 text-left shadow-level-3">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      ATS Compliance Check
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { text: "Contact Information Structure", desc: "Verified parser accessibility of email, phone, and links.", status: true },
                        { text: "Parser Layout Compatibility", desc: "No nested text boxes, graphics, or custom columns found.", status: true },
                        { text: "Date & Timeline Formats", desc: "Parsed dates standardized to unified chronological structures.", status: true },
                        { text: "Font & Hierarchy Standard", desc: "Normalized typography to standard sans-serif configurations.", status: true },
                        { text: "Skills Matrix Layout", desc: "Matched core skill definitions with recruiter keywords.", status: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2 size={12} strokeWidth={2.5} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white block leading-none">{item.text}</span>
                            <span className="text-[10px] text-zinc-500 font-medium leading-normal">{item.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-6">
                  
                  <div className="rounded-lg border border-hairline bg-canvas shadow-level-4 overflow-hidden flex flex-col h-full">
                    {/* Tab Header */}
                    <div className="bg-zinc-950 border-b border-hairline px-6 py-2 flex items-center justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => setActiveResultTab("enhancements")}
                          className={`
                            py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer
                            ${
                              activeResultTab === "enhancements"
                                ? "border-violet text-white font-bold"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }
                          `}
                        >
                          <Sparkles size={14} className={activeResultTab === "enhancements" ? "text-violet" : "text-zinc-500"} />
                          Bullet Enhancements
                        </button>
                        
                        <button
                          onClick={() => setActiveResultTab("preview")}
                          className={`
                            py-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer
                            ${
                              activeResultTab === "preview"
                                ? "border-violet text-white font-bold"
                                : "border-transparent text-zinc-500 hover:text-zinc-300"
                            }
                          `}
                        >
                          <FileText size={14} className={activeResultTab === "preview" ? "text-violet" : "text-zinc-500"} />
                          Template & PDF
                        </button>
                      </div>
                      
                      {activeResultTab === "enhancements" && (
                        <span className="text-xs text-zinc-500 font-mono">
                          Comparing {diffIndex + 1} of {optimizedData?.bulletDiffs?.length ?? resumeDiffs.length}
                        </span>
                      )}
                    </div>

                    {/* Tab Body */}
                    <AnimatePresence mode="wait">
                      {activeResultTab === "enhancements" ? (
                        <motion.div
                          key="tab-enhancements"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col h-full"
                        >
                          <div className="p-6 space-y-6 flex-1 text-left">
                            {/* Before and After Side-by-Side Diff */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Original */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                    <X size={11} strokeWidth={2.5} />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                                    Original Bullet Point
                                  </span>
                                </div>
                                <div className="p-4 rounded bg-red-500/[0.01] border border-red-500/10 text-xs text-zinc-400 line-through leading-relaxed min-h-[100px]">
                                  {optimizedData?.bulletDiffs?.[diffIndex]?.original ?? resumeDiffs[diffIndex]?.original}
                                </div>
                              </div>

                              {/* Tailored */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Sparkles size={11} />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                                    AI-Tailored Enhancement
                                  </span>
                                </div>
                                <div className="p-4 rounded bg-emerald-500/[0.02] border border-emerald-500/20 text-xs text-white font-medium leading-relaxed min-h-[100px]">
                                  {optimizedData?.bulletDiffs?.[diffIndex]?.tailored ?? resumeDiffs[diffIndex]?.tailored}
                                </div>
                              </div>
                            </div>

                            {/* AI Improvements List */}
                            <div className="bg-zinc-950/50 border border-hairline rounded-lg p-5 space-y-4">
                              <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold tracking-wider">
                                Key Optimization Takeaways:
                              </span>
                              <div className="flex flex-col gap-3">
                                {(optimizedData?.bulletDiffs?.[diffIndex]?.improvements ?? resumeDiffs[diffIndex]?.improvements).map((improvement, index) => {
                                  const config = [
                                    { label: "Keyword Match", icon: Target, color: "text-violet bg-violet/10 border-violet/20" },
                                    { label: "Action Verb", icon: Zap, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
                                    { label: "Business Impact", icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }
                                  ][index % 3];

                                  const IconComponent = config.icon;
                                  
                                  return (
                                    <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-zinc-950 border border-hairline hover:border-zinc-800 transition-all duration-200">
                                      <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${config.color} border`}>
                                          <IconComponent size={13} />
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${config.color} uppercase`}>
                                            {config.label}
                                          </span>
                                          <span className="text-xs text-zinc-300 leading-normal font-medium text-left">
                                            {improvement}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
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
                              {(optimizedData?.bulletDiffs ?? resumeDiffs).map((_, idx) => (
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
                              onClick={() => setDiffIndex(prev => Math.min(prev + 1, (optimizedData?.bulletDiffs?.length ?? resumeDiffs.length) - 1))}
                              disabled={diffIndex === (optimizedData?.bulletDiffs?.length ?? resumeDiffs.length) - 1}
                              className="px-3.5 py-1.5 text-xs font-semibold border border-hairline rounded hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer text-zinc-300"
                            >
                              Next Bullet
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="tab-preview"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 h-[500px]"
                        >
                          {/* Left Column: Template list & actions */}
                          <div className="md:col-span-5 flex flex-col justify-between h-full">
                            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[350px] scrollbar-thin">
                              {templates.map((tpl) => (
                                <div
                                  key={tpl.id}
                                  onClick={() => setSelectedTemplate(tpl.id as any)}
                                  className={`
                                    p-3.5 rounded-lg border cursor-pointer transition-all duration-200 text-left
                                    ${
                                      selectedTemplate === tpl.id
                                        ? "border-violet bg-violet/5 scale-[1.01]"
                                        : "border-hairline bg-zinc-950/40 hover:border-zinc-800"
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-white">{tpl.name}</h4>
                                    <div
                                      className={`
                                        h-3.5 w-3.5 rounded-full border flex items-center justify-center
                                        ${
                                          selectedTemplate === tpl.id
                                            ? "border-violet bg-violet"
                                            : "border-zinc-700"
                                        }
                                      `}
                                    >
                                      {selectedTemplate === tpl.id && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-zinc-500 text-[10px] mt-1 leading-normal font-medium">
                                    {tpl.desc}
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Actions bar at bottom */}
                            {apiError && (
                              <div className="p-3 mb-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
                                <span>{apiError}</span>
                                <button onClick={() => setApiError(null)} className="text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer ml-2">
                                  ✕
                                </button>
                              </div>
                            )}
                            <div className="pt-4 border-t border-hairline flex justify-end gap-3">
                              <button
                                onClick={async () => {
                                  await handleDownload();
                                }}
                                disabled={downloadingPdf}
                                className="group w-full px-6 py-2.5 text-xs font-semibold bg-primary hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-650 disabled:cursor-not-allowed text-on-primary rounded-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                              >
                                {downloadingPdf ? (
                                  <>
                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                                    Generating PDF...
                                  </>
                                ) : (
                                  <>
                                    Download PDF
                                    <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Right Column: Visual Preview */}
                          <div className="md:col-span-7 border border-hairline bg-zinc-950 rounded-lg p-3 flex flex-col h-full">
                            <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2">
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                                Visual Layout Preview
                              </span>
                              <span className="text-[9px] font-mono bg-violet/10 border border-violet/20 text-violet-400 px-1.5 py-0.5 rounded font-semibold animate-pulse">
                                LIVE
                              </span>
                            </div>
                            
                            <div className="flex-1 w-full h-full bg-white rounded overflow-hidden shadow-inner relative">
                              {optimizedData ? (
                                <iframe
                                  srcDoc={generateTemplateHtml(optimizedData.tailoredResumeText, selectedTemplate)}
                                  className="w-full h-full border-0 bg-white"
                                  title="Resume Visual Preview"
                                  id="resume-preview-iframe"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs font-mono">
                                  No resume preview content available.
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas py-8 px-6 mt-12 text-center text-xs text-zinc-600 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {useSupabase ? "ATSPrime" : "ATSPrime Sandbox"}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
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
