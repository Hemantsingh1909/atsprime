"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Lock,
  Download,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  Globe,
  Link as LinkIcon,
  Crown,
  Grid,
  Edit3,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { ResumeData, WorkExperience, EducationItem, ProjectItem, CertificateItem, AchievementItem, LanguageItem, LinkItem } from "../types/resume";
import { templatesList, templateComponents } from "../components/resume/templates/registry";
import TemplateGallery from "../components/resume/TemplateGallery";
import posthog from "posthog-js";

// Initial Rich Sample Data
const initialResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Rivera",
    title: "Senior Frontend Engineer",
    email: "alex.rivera@dev.io",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "alexrivera.dev",
    linkedin: "linkedin.com/in/alexrivera"
  },
  summary: "Results-driven Senior Frontend Engineer with 6+ years of experience designing and implementing highly-responsive user interfaces and web applications using React, Next.js, and TypeScript. Passionate about performance optimization, responsive layouts, and visual polish.",
  experience: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      position: "Lead Frontend Engineer",
      startDate: "Jan 2023",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "• Spearheaded migration of core dashboard from legacy codebase to Next.js v14, boosting LCP score by 42%.\n• Built and open-sourced a reusable component library, cutting frontend development lifecycle by 30%.\n• Managed a team of 4 frontend UI engineers, delivering 15+ highly responsive client-facing modules."
    },
    {
      id: "exp-2",
      company: "DataSync Inc",
      position: "Senior UI Engineer",
      startDate: "Mar 2020",
      endDate: "Dec 2022",
      location: "Oakland, CA",
      description: "• Developed interactive real-time telemetry charts displaying up to 10k data points under 16ms frame budget.\n• Designed accessible form flows matching WCAG AA standards, increasing signup conversion rate by 18%."
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "Stanford University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2016",
      endDate: "Jun 2020",
      location: "Stanford, CA"
    }
  ],
  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Node.js",
    "REST & GraphQL APIs",
    "Core Web Vitals",
    "Web Accessibility (a11y)",
    "Responsive Design"
  ],
  projects: [
    {
      id: "proj-1",
      name: "Portfolio Builder Suite",
      role: "Creator",
      description: "A drag-and-drop web application that lets developers compile and host portfolio pages. Reached 5k+ active registered users.",
      url: "portfoliobuilder.io"
    }
  ],
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "Aug 2024"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Open Source Contributor",
      description: "Core contributor to standard styling components utilized in Lucide React integrations."
    }
  ],
  languages: [
    {
      id: "lang-1",
      language: "English",
      proficiency: "Native"
    },
    {
      id: "lang-2",
      language: "Spanish",
      proficiency: "Conversational"
    }
  ],
  links: [
    {
      id: "link-1",
      label: "GitHub",
      url: "github.com/alexrivera"
    }
  ]
};

function BuilderContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"editor" | "gallery">(
    searchParams.get("view") === "gallery" ? "gallery" : "editor"
  );

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "gallery") {
      setViewMode("gallery");
    } else if (view === "editor") {
      setViewMode("editor");
    }
  }, [searchParams]);
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "education" | "skills" | "projects" | "achievements">("personal");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [savedResumeData, setSavedResumeData] = useState<ResumeData>(initialResumeData);
  const [isDirty, setIsDirty] = useState(false);
  const [isPro, setIsPro] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Set isDirty to true when current resumeData differs from savedResumeData
  useEffect(() => {
    if (JSON.stringify(resumeData) !== JSON.stringify(savedResumeData)) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [resumeData, savedResumeData]);

  // Warn on page unload/reload if there are unsaved edits
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // No subscription check needed - application is free
  useEffect(() => {
    setIsPro(true);
  }, []);

  // Track template selections in the builder
  useEffect(() => {
    posthog.capture("template_selected", {
      template_id: selectedTemplate,
      source: "builder",
    });
  }, [selectedTemplate]);

  const toggleProSubscription = () => {
    const updatedPro = !isPro;
    setIsPro(updatedPro);
    localStorage.setItem("atsprime_pro_sandbox", String(updatedPro));
  };

  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplate(tplId);
    setViewMode("editor");
  };

  const handlePreviewTemplate = (tplId: string) => {
    setSelectedTemplate(tplId);
    setViewMode("editor");
  };

  const activeTemplateMetadata = templatesList.find(t => t.id === selectedTemplate) || templatesList[0];
  const isPremiumLocked = activeTemplateMetadata.isPremium && !isPro;

  // Form handler helpers
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Math.random().toString(36).substring(2, 9)}`,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      location: "",
      description: ""
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(item => item.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Math.random().toString(36).substring(2, 9)}`,
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      location: "",
      description: ""
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(item => item.id !== id) }));
  };

  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      role: "",
      description: "",
      url: ""
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteProject = (id: string) => {
    setResumeData(prev => ({ ...prev, projects: prev.projects.filter(item => item.id !== id) }));
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || resumeData.skills.includes(skill.trim())) return;
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
  };

  const deleteSkill = (skill: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addCertificate = () => {
    const newCert: CertificateItem = {
      id: `cert-${Math.random().toString(36).substring(2, 9)}`,
      name: "",
      issuer: "",
      date: ""
    };
    setResumeData(prev => ({ ...prev, certificates: [...prev.certificates, newCert] }));
  };

  const updateCertificate = (id: string, field: keyof CertificateItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certificates: prev.certificates.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteCertificate = (id: string) => {
    setResumeData(prev => ({ ...prev, certificates: prev.certificates.filter(item => item.id !== id) }));
  };

  const addAchievement = () => {
    const newAch: AchievementItem = {
      id: `ach-${Math.random().toString(36).substring(2, 9)}`,
      title: "",
      description: ""
    };
    setResumeData(prev => ({ ...prev, achievements: [...prev.achievements, newAch] }));
  };

  const updateAchievement = (id: string, field: keyof AchievementItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteAchievement = (id: string) => {
    setResumeData(prev => ({ ...prev, achievements: prev.achievements.filter(item => item.id !== id) }));
  };

  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Math.random().toString(36).substring(2, 9)}`,
      language: "",
      proficiency: ""
    };
    setResumeData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteLanguage = (id: string) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(item => item.id !== id) }));
  };

  const addLink = () => {
    const newLink: LinkItem = {
      id: `link-${Math.random().toString(36).substring(2, 9)}`,
      label: "",
      url: ""
    };
    setResumeData(prev => ({ ...prev, links: [...prev.links, newLink] }));
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    setResumeData(prev => ({
      ...prev,
      links: prev.links.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const deleteLink = (id: string) => {
    setResumeData(prev => ({ ...prev, links: prev.links.filter(item => item.id !== id) }));
  };

  const handleDownload = async () => {
    if (isPremiumLocked) {
      setShowUpgradeDialog(true);
      return;
    }

    try {
      setDownloadingPdf(true);
      const response = await fetch("/api/pdf/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, templateId: selectedTemplate }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile PDF document.");
      }

      // Capture binary stream download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ATSPrime_Resume_${selectedTemplate}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Delay revocation to ensure browser download manager has retrieved the blob
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 1000);

      // Successfully saved/exported, reset unsaved changes state
      setSavedResumeData(resumeData);
    } catch (error) {
      console.error(error);
      alert("Error printing PDF document.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const ActiveTemplate = templateComponents[selectedTemplate] || templateComponents.classic;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none relative">
      {/* Sticky top dashboard navigation */}
      <header className="sticky top-0 z-45 bg-zinc-950 border-b border-hairline px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            onClick={(e) => {
              if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                e.preventDefault();
              }
            }}
            className="flex items-center gap-2 group"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="6" cy="9" r="2.5" fill="#2563eb" />
              <line x1="10" y1="19" x2="17" y2="7" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span className="text-base font-bold tracking-tight text-white">
              ATSPrime
            </span>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-2 bg-zinc-900 border border-hairline p-1.5 rounded-lg">
            <button
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === "editor" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Edit3 size={13} />
              Editor
            </button>
            <button
              onClick={() => setViewMode("gallery")}
              className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer transition-all ${
                viewMode === "gallery" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Grid size={13} />
              Templates
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleDownload}
            disabled={downloadingPdf}
            className="group px-4 py-1.5 text-xs font-bold bg-primary hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-650 disabled:cursor-not-allowed text-on-primary rounded-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {downloadingPdf ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                Printing PDF...
              </>
            ) : (
              <>
                Export A4 PDF
                <Download size={13} />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden h-[calc(100vh-70px)]">
        {viewMode === "gallery" ? (
          <div className="p-8 max-w-7xl mx-auto overflow-y-auto h-full">
            <TemplateGallery
              onSelectTemplate={handleSelectTemplate}
              selectedTemplateId={selectedTemplate}
              isPro={isPro}
              onPreviewTemplate={handlePreviewTemplate}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden">
            {/* Left Side: Interactive Editor forms */}
            <div className="lg:col-span-5 border-r border-hairline bg-canvas flex h-full overflow-hidden">
              {/* Vertical tabs sidebar */}
              <div className="w-16 border-r border-hairline flex flex-col items-center py-4 gap-4 bg-zinc-950">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "personal" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Personal Information"
                >
                  <Globe size={18} />
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "experience" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Work Experience"
                >
                  <Briefcase size={18} />
                </button>
                <button
                  onClick={() => setActiveTab("education")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "education" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Education"
                >
                  <GraduationCap size={18} />
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "skills" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Skills"
                >
                  <Wrench size={18} />
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "projects" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Projects"
                >
                  <FolderGit2 size={18} />
                </button>
                <button
                  onClick={() => setActiveTab("achievements")}
                  className={`p-2.5 rounded-lg cursor-pointer transition-colors ${activeTab === "achievements" ? "bg-zinc-900 text-violet" : "text-zinc-500 hover:text-zinc-300"}`}
                  title="Achievements & Others"
                >
                  <Award size={18} />
                </button>
              </div>

              {/* Form panel content */}
              <div className="flex-1 p-6 overflow-y-auto text-left h-full scrollbar-thin">
                <AnimatePresence mode="wait">
                  {activeTab === "personal" && (
                    <motion.div
                      key="personal"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Full Name</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.name}
                            onChange={(e) => updatePersonalInfo("name", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Professional Title</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.title}
                            onChange={(e) => updatePersonalInfo("title", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Email Address</label>
                          <input
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo("email", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Phone Number</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Location</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.location}
                            onChange={(e) => updatePersonalInfo("location", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Website</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.website}
                            onChange={(e) => updatePersonalInfo("website", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">LinkedIn URL</label>
                          <input
                            type="text"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                      </div>

                      {/* Summary Form Block */}
                      <div className="space-y-1 pt-4 border-t border-hairline">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Professional Summary</label>
                        <textarea
                          rows={4}
                          value={resumeData.summary}
                          onChange={(e) => updateSummary(e.target.value)}
                          className="w-full rounded-sm bg-zinc-950 border border-hairline p-3 text-xs text-white focus:outline-none focus:border-zinc-800 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "experience" && (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Work Experience</h3>
                        <button
                          onClick={addExperience}
                          className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} /> Add Role
                        </button>
                      </div>

                      <div className="space-y-6">
                        {resumeData.experience.map((exp, idx) => (
                          <div key={exp.id} className="p-4 rounded-lg bg-zinc-950 border border-hairline space-y-3 relative">
                            <button
                              onClick={() => deleteExperience(exp.id)}
                              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">Role #{idx + 1}</span>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Company</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Position</label>
                                <input
                                  type="text"
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                  placeholder="e.g. Jan 2020"
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">End Date</label>
                                <input
                                  type="text"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                  placeholder="e.g. Present"
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Location</label>
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                                  placeholder="e.g. San Francisco, CA"
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Description / Bullets</label>
                              <textarea
                                rows={4}
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                className="w-full rounded-sm bg-zinc-900 border border-hairline p-3 text-[11px] text-white focus:outline-none resize-none font-sans"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Education</h3>
                        <button
                          onClick={addEducation}
                          className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} /> Add Degree
                        </button>
                      </div>

                      <div className="space-y-6">
                        {resumeData.education.map((edu, idx) => (
                          <div key={edu.id} className="p-4 rounded-lg bg-zinc-950 border border-hairline space-y-3 relative">
                            <button
                              onClick={() => deleteEducation(edu.id)}
                              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">Degree #{idx + 1}</span>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">School Name</label>
                                <input
                                  type="text"
                                  value={edu.school}
                                  onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Location</label>
                                <input
                                  type="text"
                                  value={edu.location}
                                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Field of Study</label>
                                <input
                                  type="text"
                                  value={edu.fieldOfStudy}
                                  onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Date Range</label>
                                <input
                                  type="text"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                                  placeholder="e.g. 2016 - 2020"
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Core Skills</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Add Core Skill</label>
                          <input
                            type="text"
                            placeholder="Type skill and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addSkill(e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                            className="w-full h-9 rounded-sm bg-zinc-950 border border-hairline px-3 text-xs text-white focus:outline-none focus:border-zinc-800"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 text-xs bg-zinc-900 border border-hairline text-zinc-300 px-3 py-1 rounded-full font-medium"
                          >
                            {skill}
                            <button
                              onClick={() => deleteSkill(skill)}
                              className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "projects" && (
                    <motion.div
                      key="projects"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Projects</h3>
                        <button
                          onClick={addProject}
                          className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={11} /> Add Project
                        </button>
                      </div>

                      <div className="space-y-6">
                        {resumeData.projects.map((proj, idx) => (
                          <div key={proj.id} className="p-4 rounded-lg bg-zinc-950 border border-hairline space-y-3 relative">
                            <button
                              onClick={() => deleteProject(proj.id)}
                              className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">Project #{idx + 1}</span>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Project Name</label>
                                <input
                                  type="text"
                                  value={proj.name}
                                  onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Project Role</label>
                                <input
                                  type="text"
                                  value={proj.role}
                                  onChange={(e) => updateProject(proj.id, "role", e.target.value)}
                                  className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Website / Link</label>
                              <input
                                type="text"
                                value={proj.url}
                                onChange={(e) => updateProject(proj.id, "url", e.target.value)}
                                className="w-full h-8 rounded-sm bg-zinc-900 border border-hairline px-3 text-[11px] text-white focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-mono text-zinc-650 uppercase font-bold">Description</label>
                              <textarea
                                rows={3}
                                value={proj.description}
                                onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                                className="w-full rounded-sm bg-zinc-900 border border-hairline p-3 text-[11px] text-white focus:outline-none resize-none font-sans"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "achievements" && (
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="space-y-6"
                    >
                      {/* Certificates Form Module */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Certifications</h3>
                          <button
                            onClick={addCertificate}
                            className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} /> Add Cert
                          </button>
                        </div>
                        {resumeData.certificates.map((cert) => (
                          <div key={cert.id} className="p-3.5 rounded-lg bg-zinc-950 border border-hairline space-y-2 relative">
                            <button
                              onClick={() => deleteCertificate(cert.id)}
                              className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Certificate Name"
                                value={cert.name}
                                onChange={(e) => updateCertificate(cert.id, "name", e.target.value)}
                                className="w-full h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                              />
                              <input
                                type="text"
                                placeholder="Issuer"
                                value={cert.issuer}
                                onChange={(e) => updateCertificate(cert.id, "issuer", e.target.value)}
                                className="w-full h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Date Issued (e.g. Aug 2024)"
                              value={cert.date}
                              onChange={(e) => updateCertificate(cert.id, "date", e.target.value)}
                              className="w-full h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Achievements Form Module */}
                      <div className="space-y-4 pt-6 border-t border-hairline">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Achievements</h3>
                          <button
                            onClick={addAchievement}
                            className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} /> Add Achievement
                          </button>
                        </div>
                        {resumeData.achievements.map((ach) => (
                          <div key={ach.id} className="p-3.5 rounded-lg bg-zinc-950 border border-hairline space-y-2 relative">
                            <button
                              onClick={() => deleteAchievement(ach.id)}
                              className="absolute top-3 right-3 p-1 text-zinc-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                            <input
                              type="text"
                              placeholder="Achievement Title"
                              value={ach.title}
                              onChange={(e) => updateAchievement(ach.id, "title", e.target.value)}
                              className="w-full h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                            <textarea
                              rows={2}
                              placeholder="Describe your achievement..."
                              value={ach.description}
                              onChange={(e) => updateAchievement(ach.id, "description", e.target.value)}
                              className="w-full rounded bg-zinc-900 border border-hairline p-2 text-xs text-white resize-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Languages Form Module */}
                      <div className="space-y-4 pt-6 border-t border-hairline">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Languages</h3>
                          <button
                            onClick={addLanguage}
                            className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} /> Add Lang
                          </button>
                        </div>
                        {resumeData.languages.map((lang) => (
                          <div key={lang.id} className="p-3.5 rounded-lg bg-zinc-950 border border-hairline flex items-center gap-3 relative">
                            <input
                              type="text"
                              placeholder="Language"
                              value={lang.language}
                              onChange={(e) => updateLanguage(lang.id, "language", e.target.value)}
                              className="w-1/2 h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Proficiency (e.g. Native)"
                              value={lang.proficiency}
                              onChange={(e) => updateLanguage(lang.id, "proficiency", e.target.value)}
                              className="w-1/2 h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                            <button
                              onClick={() => deleteLanguage(lang.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Links Form Module */}
                      <div className="space-y-4 pt-6 border-t border-hairline">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Social Links</h3>
                          <button
                            onClick={addLink}
                            className="px-2.5 py-1 text-[10px] font-bold bg-violet hover:bg-violet-deep text-white rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} /> Add Link
                          </button>
                        </div>
                        {resumeData.links.map((link) => (
                          <div key={link.id} className="p-3.5 rounded-lg bg-zinc-950 border border-hairline flex items-center gap-3 relative">
                            <input
                              type="text"
                              placeholder="Label (e.g. GitHub)"
                              value={link.label}
                              onChange={(e) => updateLink(link.id, "label", e.target.value)}
                              className="w-1/2 h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="URL Link"
                              value={link.url}
                              onChange={(e) => updateLink(link.id, "url", e.target.value)}
                              className="w-1/2 h-8 rounded bg-zinc-900 border border-hairline px-2 text-xs text-white"
                            />
                            <button
                              onClick={() => deleteLink(link.id)}
                              className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Visual Preview panel */}
            <div className="lg:col-span-7 bg-zinc-950 flex flex-col h-full overflow-hidden relative">
              {/* Quick Template Switcher banner */}
              <div className="bg-zinc-900 border-b border-hairline px-6 py-2 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                  Active Style: {activeTemplateMetadata.name}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-650 font-mono">Template:</span>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="bg-zinc-950 border border-hairline rounded px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {templatesList.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.isPremium ? "★" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Document view desk */}
              <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center h-full scrollbar-thin select-text">
                <div className="relative max-w-[21cm] w-full shadow-level-5 rounded-sm overflow-hidden border border-hairline">
                  
                  {/* Premium Lock overlay */}
                  <AnimatePresence>
                    {isPremiumLocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 bg-zinc-950/70 backdrop-blur-[3.5px] flex flex-col items-center justify-center p-6 text-center select-none"
                      >
                        <div className="max-w-xs bg-zinc-900 border border-hairline p-6 rounded-xl shadow-level-5 flex flex-col items-center">
                          <div className="h-12 w-12 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center text-violet mb-4">
                            <Lock size={20} />
                          </div>
                          <h4 className="text-sm font-bold text-white">Premium Template Locked</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed mt-2 text-center">
                            This layout style is exclusive to Pro subscribers. Activate the Pro Sandbox subscription to preview and export this template.
                          </p>
                          <button
                            onClick={toggleProSubscription}
                            className="mt-5 w-full py-2 bg-violet hover:bg-violet-deep text-white rounded-sm text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Crown size={13} />
                            Unlock Instantly
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Render template component dynamically */}
                  <div className={`transition-all duration-300 ${isPremiumLocked ? "blur-[2.5px] pointer-events-none select-none" : ""}`}>
                    <ActiveTemplate data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Subscription upgrade dialog */}
      <AnimatePresence>
        {showUpgradeDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setShowUpgradeDialog(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-sm rounded-lg border border-hairline bg-canvas p-6 shadow-level-5 text-center z-50 relative"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet/10 border border-violet/20 text-violet mb-4">
                <Crown size={22} />
              </div>
              <h3 className="text-base font-bold text-white">Activate Sandbox Premium</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Unlock all premium templates, visual layouts, and printable A4 PDF exports instantly. Free for testing in the sandbox.
              </p>
              
              <button
                onClick={() => {
                  toggleProSubscription();
                  setShowUpgradeDialog(false);
                }}
                className="mt-6 w-full py-2.5 rounded-sm bg-violet hover:bg-violet-deep text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Crown size={14} />
                Unlock Pro Access
              </button>
              <button
                onClick={() => setShowUpgradeDialog(false)}
                className="mt-2.5 w-full py-2 rounded-sm border border-hairline hover:bg-zinc-900 text-xs font-bold text-zinc-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet border-t-transparent" />
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
