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
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "docx">("pdf");
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  

  
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
      const savedSelectedTemplate = sessionStorage.getItem("atsprime_dashboard_selectedTemplate");
      const savedActiveResultTab = sessionStorage.getItem("atsprime_dashboard_activeResultTab");
      const savedDiffIndex = sessionStorage.getItem("atsprime_dashboard_diffIndex");
      const savedDownloadFormat = sessionStorage.getItem("atsprime_dashboard_downloadFormat");

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
      if (savedSelectedTemplate) setSelectedTemplate(savedSelectedTemplate as any);
      if (savedActiveResultTab) setActiveResultTab(savedActiveResultTab as any);
      if (savedDiffIndex) setDiffIndex(parseInt(savedDiffIndex, 10));
      if (savedDownloadFormat) setDownloadFormat(savedDownloadFormat as any);
    } catch (e) {
      console.error("Failed to restore session state:", e);
    }
  }, []);

  // Trigger pending download after user logging in
  useEffect(() => {
    if (user && sessionStorage.getItem("pending_dashboard_download") === "true") {
      sessionStorage.removeItem("pending_dashboard_download");
      const savedFormat = sessionStorage.getItem("pending_dashboard_download_format") as "pdf" | "docx" | null;
      if (savedFormat) {
        sessionStorage.removeItem("pending_dashboard_download_format");
        handleDownload(savedFormat);
      } else {
        handleDownload();
      }
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
      sessionStorage.setItem("atsprime_dashboard_selectedTemplate", selectedTemplate);
      sessionStorage.setItem("atsprime_dashboard_activeResultTab", activeResultTab);
      sessionStorage.setItem("atsprime_dashboard_diffIndex", String(diffIndex));
      sessionStorage.setItem("atsprime_dashboard_downloadFormat", downloadFormat);
    } catch (e) {
      console.error("Failed to save session state:", e);
    }
  }, [step, selectedFile, resumeText, jobDescription, optimizedData, uploadedFileBase64, selectedTemplate, activeResultTab, diffIndex, downloadFormat]);

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

  // Handle dynamic download of the tailored resume as PDF/DOCX via server API
  const handleDownload = async (formatOverride?: "pdf" | "docx"): Promise<boolean> => {
    const activeFormat = formatOverride || downloadFormat;

    if (!user) {
      sessionStorage.setItem("pending_dashboard_download", "true");
      sessionStorage.setItem("pending_dashboard_download_format", activeFormat);
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return false;
    }

    if (!optimizedData) return false;
    setDownloadingPdf(true);
    setApiError(null);

    try {
      const baseName = selectedFile 
        ? selectedFile.name.replace(/\.[^/.]+$/, "")
        : "ATSPrime_Optimized_Resume";
        
      const formattedTemplateName = selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1);

      if (activeFormat === "docx") {
        const response = await fetch("/api/docx", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: optimizedData.tailoredResumeText,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `Failed to generate DOCX (HTTP ${response.status})`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const fileName = `${baseName}_${formattedTemplateName}.docx`;

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);

        setDownloadSuccess(true);
        setDownloadingPdf(false);
        return true;
      } else {
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

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const fileName = `${baseName}_${formattedTemplateName}.pdf`;

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);

        setDownloadSuccess(true);
        setDownloadingPdf(false);
        return true;
      }
    } catch (err: any) {
      console.error("Download error:", err);
      
      if (activeFormat === "pdf") {
        try {
          const htmlContent = generateTemplateHtml(optimizedData.tailoredResumeText, selectedTemplate);
          
          const iframe = document.createElement("iframe");
          iframe.style.position = "absolute";
          iframe.style.width = "0px";
          iframe.style.height = "0px";
          iframe.style.border = "none";
          document.body.appendChild(iframe);

          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            doc.open();
            doc.write(htmlContent);
            doc.close();

            iframe.contentWindow?.focus();
            setTimeout(() => {
              iframe.contentWindow?.print();
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            }, 500);

            setDownloadSuccess(true);
            setDownloadingPdf(false);
            setApiError("Headless PDF renderer timed out. Opened browser print dialog as secure fallback (Select 'Save as PDF').");
            return true;
          }
        } catch (printErr) {
          console.error("Print fallback error:", printErr);
        }
      }

      setApiError(err.message || `Failed to download resume ${activeFormat.toUpperCase()}.`);
      setDownloadingPdf(false);
      return false;
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
                <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                  Step 01
                </span>
                <h1 className="text-2xl font-medium tracking-tight text-white mt-2">
                  Upload your base resume
                </h1>
                <p className="text-zinc-400 text-sm mt-1.5">
                  Our AI extracts your experiences to match job requirements.
                </p>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border border-dashed rounded-md p-10 text-center cursor-pointer transition-all duration-200
                  ${
                    isDragging
                      ? "border-violet bg-violet/5"
                      : selectedFile
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-hairline bg-canvas hover:border-zinc-800"
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
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <FileCheck size={20} />
                      </div>
                      <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{selectedFile.size}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-2 text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        Choose a different file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-900 border border-hairline flex items-center justify-center text-zinc-400">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          Drag and drop your resume
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 font-mono">
                          PDF, DOCX, or TXT (max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample resume helper link */}
              {!selectedFile && (
                <p className="text-xs text-zinc-500 mt-4 text-center">
                  No resume on hand?{" "}
                  <button
                    onClick={useSampleData}
                    className="text-violet hover:text-violet-soft font-medium underline cursor-pointer"
                  >
                    Use our sample resume
                  </button>
                </p>
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
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white hover:opacity-90 px-6 py-2.5 text-sm font-medium text-black transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isParsing ? "Parsing Resume..." : "Continue to Job Description"}
                    {!isParsing && <ArrowRight size={15} />}
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

                  <div className="grid grid-cols-1 gap-2">
                    {savedResumes.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between py-3 border-b border-hairline/40 hover:border-zinc-800 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden text-left">
                          <FileText size={14} className="text-zinc-500 flex-shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-zinc-300 truncate">{res.jobTitle}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              Tailored {res.createdAt} • Score: <span className="text-violet font-semibold">{res.score}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
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
                            className="px-3 py-1 text-[11px] font-medium bg-zinc-950 border border-hairline hover:bg-zinc-900 rounded-sm transition-colors cursor-pointer text-zinc-300"
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
                <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                  Step 02
                </span>
                <h1 className="text-2xl font-medium tracking-tight text-white mt-2">
                  Paste the Target Job
                </h1>
                <p className="text-zinc-400 text-sm mt-1.5">
                  Paste the job description to align your resume with parser criteria.
                </p>
              </div>

              <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4">
                {selectedFile && (
                  <div className="flex items-center justify-between py-2 border-b border-hairline text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck size={13} className="text-emerald-400" />
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider font-semibold">Active Resume:</span>
                      <span className="truncate text-zinc-300 font-medium">{selectedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-violet hover:text-violet-soft font-semibold transition-colors cursor-pointer text-xs underline"
                    >
                      Change
                    </button>
                  </div>
                )}

                {apiError && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-between">
                    <span>{apiError}</span>
                    <button onClick={() => setApiError(null)} className="text-zinc-400 hover:text-zinc-300 font-semibold ml-2 cursor-pointer">
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
                  className="w-full min-h-[220px] rounded-sm bg-zinc-950 border border-hairline focus:border-hairline-strong p-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-y font-sans leading-relaxed"
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
                      group inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium shadow-md transition-all duration-200 cursor-pointer
                      ${
                        jobDescription.trim()
                          ? "bg-white text-black hover:opacity-90"
                          : "bg-zinc-800 text-zinc-500 border border-zinc-900 opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    Optimize Resume
                    <Sparkles size={14} />
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
              <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-900" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet border-r-highlight-pink"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <Sparkles size={24} className="text-violet animate-pulse" />
              </div>

              <span className="font-mono text-[10px] text-zinc-500 font-medium tracking-widest block uppercase">
                Tailoring Engine
              </span>
              
              <h2 className="text-xl font-medium text-white mt-3">
                Applying AI Optimization
              </h2>
              
              <div className="mt-8 bg-canvas border border-hairline rounded-md p-6 max-w-sm mx-auto shadow-level-3">
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-zinc-500 uppercase tracking-wider">Progress</span>
                  <span className="text-violet font-semibold">{analysisProgress}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet to-highlight-pink"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-300 font-mono animate-pulse min-h-[32px] flex items-center justify-center text-center">
                  {analysisSteps[currentAnalysisStep]}
                </p>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-hairline pb-6">
                <div className="text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-[11px] font-medium">
                    <CheckCircle2 size={12} />
                    {user ? "Saved to profile" : "Resume Optimized"}
                  </div>
                  <h1 className="text-2xl font-medium tracking-tight text-white mt-3">
                    Tailored Resume Ready
                  </h1>
                  <p className="text-zinc-400 text-sm mt-1">
                    Review ATS score gains and download your tailored resume.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-medium bg-zinc-950 border border-hairline rounded-sm hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-300 flex items-center gap-1.5"
                  >
                    <ArrowLeft size={12} />
                    Back
                  </button>

                  <button
                    onClick={resetFlow}
                    className="px-4 py-2 text-xs font-medium bg-zinc-950 border border-hairline rounded-sm hover:bg-zinc-900 transition-colors cursor-pointer text-zinc-300 flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    Start Over
                  </button>

                  <button
                    onClick={() => setActiveResultTab("preview")}
                    className="group px-4.5 py-2 text-xs font-medium bg-white hover:opacity-90 text-black rounded-full transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Download PDF
                    <Download size={13} />
                  </button>
                </div>
              </div>

              {/* Main Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Score & Metadata widgets */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* ATS Score widget */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 text-left shadow-level-2">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">
                      ATS Score Compatibility
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-mono">
                          <span className="text-zinc-500">Before Optimization</span>
                          <span className="text-zinc-400 font-semibold">{optimizedData?.originalAtsScore ?? 72}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-zinc-700" style={{ width: `${optimizedData?.originalAtsScore ?? 72}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-mono">
                          <span className="text-zinc-400">AI Tailored Result</span>
                          <span className="text-white font-semibold flex items-center gap-1.5">
                            {optimizedData?.optimizedAtsScore ?? 95}%
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded-sm">
                              +{(optimizedData?.optimizedAtsScore ?? 95) - (optimizedData?.originalAtsScore ?? 72)}%
                            </span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet to-highlight-pink" style={{ width: `${optimizedData?.optimizedAtsScore ?? 95}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keywords Optimization widget */}
                  <div className="rounded-lg border border-hairline bg-canvas p-6 space-y-4 shadow-level-2">
                    <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      Keywords Optimization
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 block mb-1.5 uppercase tracking-wider">
                          Matched ({optimizedData?.matchedKeywords?.length ?? 15})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(optimizedData?.matchedKeywords?.slice(0, 8) ?? ["React", "TypeScript", "Tailwind CSS", "API integrations", "Responsive layouts", "Web optimization", "Visual polish"]).map((kw) => (
                            <span key={kw} className="text-[10px] bg-emerald-500/[0.03] border border-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-sm">
                              {kw}
                            </span>
                          ))}
                          {(optimizedData?.matchedKeywords?.length ?? 15) > 8 && (
                            <span className="text-[9px] text-zinc-500 font-mono pt-0.5 px-1">
                              +{optimizedData!.matchedKeywords!.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-hairline pt-3">
                        <span className="text-[10px] font-mono text-violet block mb-1.5 uppercase tracking-wider">
                          AI-Inserted ({optimizedData?.insertedKeywords?.length ?? 5})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(optimizedData?.insertedKeywords ?? ["Next.js", "Core Web Vitals", "GraphQL", "Bundle-splitting", "a11y / accessibility"]).map((kw) => (
                            <span key={kw} className="text-[10px] bg-violet/5 border border-violet/10 text-violet px-1.5 py-0.5 rounded-sm font-medium">
                              +{kw}
                            </span>
                          ))}
                        </div>
                      </div>
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
                          className="p-6 space-y-6 flex-1 flex flex-col justify-between"
                        >
                          <div className="space-y-6 text-left">
                            {/* Stacked comparison */}
                            <div className="space-y-4">
                              <div className="border border-hairline rounded bg-zinc-950/20 p-4">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">Original</span>
                                <p className="text-xs text-zinc-400 line-through leading-relaxed">
                                  {optimizedData?.bulletDiffs?.[diffIndex]?.original ?? resumeDiffs[diffIndex]?.original}
                                </p>
                              </div>

                              <div className="border border-emerald-500/20 rounded bg-emerald-500/[0.01] p-4">
                                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-2">AI-Optimized</span>
                                <p className="text-xs text-white font-medium leading-relaxed">
                                  {optimizedData?.bulletDiffs?.[diffIndex]?.tailored ?? resumeDiffs[diffIndex]?.tailored}
                                </p>
                              </div>
                            </div>

                            {/* 3-item grid block for takeaways */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {(optimizedData?.bulletDiffs?.[diffIndex]?.improvements ?? resumeDiffs[diffIndex]?.improvements).map((improvement, index) => {
                                const config = [
                                  { label: "Keyword Match", icon: Target, color: "text-violet border-violet/20" },
                                  { label: "Action Verb", icon: Zap, color: "text-amber-400 border-amber-400/20" },
                                  { label: "Business Impact", icon: TrendingUp, color: "text-emerald-400 border-emerald-400/20" }
                                ][index % 3];

                                const IconComponent = config.icon;
                                
                                return (
                                  <div key={index} className="p-3.5 rounded border border-hairline bg-zinc-950/40 text-left flex flex-col justify-between gap-2.5">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-[9px] font-mono uppercase tracking-wider ${config.color} font-semibold`}>
                                        {config.label}
                                      </span>
                                      <IconComponent size={12} className={config.color.split(" ")[0]} />
                                    </div>
                                    <p className="text-[11px] text-zinc-400 leading-normal font-medium">
                                      {improvement}
                                    </p>
                                  </div>
                                );
                              })}
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
                                    p-3 rounded-md border cursor-pointer transition-all duration-150 text-left
                                    ${
                                      selectedTemplate === tpl.id
                                        ? "border-white bg-zinc-900"
                                        : "border-hairline hover:border-zinc-800"
                                    }
                                  `}
                                >
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-semibold text-white">{tpl.name}</h4>
                                    <div
                                      className={`
                                        h-3 w-3 rounded-full border flex items-center justify-center
                                        ${
                                          selectedTemplate === tpl.id
                                            ? "border-white bg-white"
                                            : "border-zinc-800"
                                        }
                                      `}
                                    >
                                      {selectedTemplate === tpl.id && (
                                        <div className="h-1 w-1 rounded-full bg-black" />
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
                            <div className="pt-4 border-t border-hairline flex flex-col items-stretch gap-2 w-full">
                              <div className="relative flex items-stretch w-full rounded-full overflow-visible">
                                <button
                                  onClick={async () => {
                                    await handleDownload();
                                  }}
                                  disabled={downloadingPdf}
                                  className="group flex-1 px-6 py-2.5 text-xs font-semibold bg-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-l-full border-r border-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  {downloadingPdf ? (
                                    <>
                                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                                      {downloadFormat === "pdf" ? "Generating PDF..." : "Generating DOCX..."}
                                    </>
                                  ) : (
                                    <>
                                      {downloadFormat === "pdf" ? "Download PDF" : "Download DOCX (Word)"}
                                      <Download size={14} />
                                    </>
                                  )}
                                </button>
                                
                                <button
                                  onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
                                  disabled={downloadingPdf}
                                  className="px-3 bg-white hover:opacity-90 disabled:opacity-50 text-black rounded-r-full flex items-center justify-center cursor-pointer transition-all border-l border-zinc-250"
                                  title="Change download format"
                                >
                                  <ChevronDown size={14} className={`transition-transform duration-200 ${downloadDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {downloadDropdownOpen && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={() => setDownloadDropdownOpen(false)} 
                                    />
                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-zinc-900 border border-hairline rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                                      <button
                                        onClick={() => {
                                          setDownloadFormat("pdf");
                                          setDownloadDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2.5 transition-colors ${
                                          downloadFormat === "pdf" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                        }`}
                                      >
                                        <FileText size={14} />
                                        PDF Document (.pdf)
                                      </button>
                                      <button
                                        onClick={() => {
                                          setDownloadFormat("docx");
                                          setDownloadDropdownOpen(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2.5 transition-colors ${
                                          downloadFormat === "docx" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                        }`}
                                      >
                                        <FileText size={14} />
                                        Word Document (.docx)
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
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
