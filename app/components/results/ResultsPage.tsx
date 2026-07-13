"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  LayoutGrid,
  FileText,
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Monitor,
  Tablet,
  Maximize2,
  Star,
  Lock,
  LogOut,
  HelpCircle,
  BarChart2,
  ChevronRight,
  Bot,
  Briefcase,
  PenTool,
  Check,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { templates, generateTemplateHtml } from "@/app/utils/templates";

interface BulletDiff {
  original: string;
  tailored: string;
  improvements: string[];
}

interface KnockoutDetails {
  years_experience: { required: number | null; met: boolean; actual: number };
  degree: { required: string | null; met: boolean; actual: string };
  certifications: { required: string[]; met: boolean; missing: string[] };
}

interface OptimizedData {
  originalResumeText?: string;
  tailoredResumeText: string;
  originalAtsScore: number;
  optimizedAtsScore: number;
  matchedKeywords: string[];
  insertedKeywords: string[];
  bulletDiffs: BulletDiff[];
  scoreStructuralCompleteness?: number;
  scoreKeywordMatch?: number;
  scoreKnockout?: number;
  knockoutDetails?: KnockoutDetails;
  gapsIdentified?: string[];
}

interface User {
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface ResultsPageProps {
  optimizedData: OptimizedData;
  user: User | null;
  onBack: () => void;
  onStartOver: () => void;
  onSignOut: () => void;
  onDownload: (format?: "pdf" | "docx") => Promise<boolean>;
  downloadingPdf: boolean;
  apiError: string | null;
  onClearError: () => void;
  hasSaved: boolean;
  selectedTemplate: "classic" | "modern" | "minimal" | "split" | "slate" | "executive";
  setSelectedTemplate: (tpl: "classic" | "modern" | "minimal" | "split" | "slate" | "executive") => void;
}

function ScoreDonut({ score, size = 110 }: { score: number; size?: number }) {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block mx-auto">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c1c2e" strokeWidth="12"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#sdGrad)" strokeWidth="12"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dashoffset 1.2s ease"}}/>
      <defs>
        <linearGradient id="sdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#c084fc"/>
        </linearGradient>
      </defs>
      <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill="white"
        fontWeight="800" fontSize={size*0.26} fontFamily="Inter,sans-serif">{score}</text>
      <text x="50%" y="67%" textAnchor="middle" fill="#52525b" fontSize={size*0.12} fontFamily="Inter,sans-serif">%</text>
    </svg>
  );
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[11px] text-zinc-400">{label}</span>
        <span className="text-[11px] text-zinc-300 font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="h-[3px] bg-zinc-800 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full"
          style={{background:"linear-gradient(90deg,#7c3aed,#a855f7)"}}
          initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:0.9,ease:"easeOut"}}/>
      </div>
    </div>
  );
}

function TemplateThumbnail({ id, name, selected, onClick, idx }: {id:string;name:string;selected:boolean;onClick:()=>void;idx:number}) {
  const accents = ["#7c3aed","#2563eb","#059669","#0891b2","#dc2626","#92400e"];
  const ac = accents[idx % accents.length];
  return (
    <button onClick={onClick} title={name}
      className="relative flex-shrink-0 w-[88px] flex flex-col items-center gap-1.5 group cursor-pointer">
      <div className={`w-full aspect-[3/4] rounded-lg border-2 overflow-hidden bg-white relative transition-all duration-200 ${
        selected?"border-violet-500 shadow-[0_0_0_3px_rgba(124,58,237,0.3)]":"border-zinc-700 hover:border-zinc-500"}`}>
        <div className="p-1.5 h-full flex flex-col gap-0.5">
          <div className="h-2.5 rounded-sm mb-1" style={{background:ac}}/>
          {["w-3/4","w-full","w-5/6","w-2/3","w-4/5","w-1/2","w-full","w-5/6","w-3/4","w-4/5"].map((w,i)=>(
            <div key={i} className={`h-0.5 ${w} rounded-sm ${i<2?"bg-gray-300":"bg-gray-200"}`}/>
          ))}
        </div>
        {selected && (
          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full flex items-center justify-center shadow" style={{background:ac}}>
            <Check size={9} className="text-white" strokeWidth={3}/>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-medium text-center leading-tight px-0.5 ${selected?"text-white":"text-zinc-400 group-hover:text-zinc-200"}`}>{name}</span>
    </button>
  );
}

export default function ResultsPage({
  optimizedData, user, onBack, onStartOver, onSignOut,
  onDownload, downloadingPdf, apiError, onClearError, hasSaved,
  selectedTemplate, setSelectedTemplate,
}: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState<"preview"|"template"|"sections"|"ai">("preview");
  const [rightTab, setRightTab] = useState<"analysis"|"aireview">("analysis");
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"pdf"|"docx">("pdf");
  const [viewMode, setViewMode] = useState<"desktop"|"tablet">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const score = optimizedData.optimizedAtsScore;
  const matched = optimizedData.matchedKeywords ?? [];
  const inserted = optimizedData.insertedKeywords ?? [];

  // Match tier evaluations
  const isKnockoutFailed = optimizedData.scoreKnockout === 0;
  let matchBadgeText = "Excellent Match";
  let matchTierText = "Highly Relevant";
  let matchColorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  let matchDescription = "Your resume matches the core requirements and target experience level for this position.";

  if (isKnockoutFailed) {
    matchBadgeText = "Failed Knockouts";
    matchTierText = "Not Recommended";
    matchColorClass = "bg-red-500/10 text-red-400 border-red-500/20";
    matchDescription = "Your profile is missing hard knockout criteria (required experience, degree, or certifications) specified in the job description.";
  } else if (score < 50) {
    matchBadgeText = "Poor Match";
    matchTierText = "Low Relevance";
    matchColorClass = "bg-red-500/10 text-red-400 border-red-500/20";
    matchDescription = "Your resume has a low keyword alignment with the target job requirements.";
  } else if (score < 80) {
    matchBadgeText = "Good Match";
    matchTierText = "Good Fit";
    matchColorClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    matchDescription = "Your resume matches most of the required skills, but has room for keyword and content optimization.";
  }

  const breakdown = [
    { label: "Format & Structure", value: optimizedData.scoreStructuralCompleteness ?? 95 },
    { label: "Keywords Match", value: optimizedData.scoreKeywordMatch ?? score },
    { label: "Knockout Checks", value: optimizedData.scoreKnockout ?? 100 },
  ];

  const improvements = optimizedData.gapsIdentified && optimizedData.gapsIdentified.length > 0
    ? optimizedData.gapsIdentified
    : [
        "No major gaps found in requirements! Consider adding metrics to work experience.",
      ];

  const sideNav = [
    {icon:LayoutGrid,label:"Dashboard",active:false},
    {icon:FileText,  label:"Results",  active:true},
    {icon:PenTool,   label:"Resume Editor",active:false},
    {icon:Bot,       label:"AI Review",active:false},
    {icon:BookOpen,  label:"Cover Letter",active:false},
    {icon:Briefcase, label:"Job Match",active:false},
  ];

  return (
    <div className="flex h-full min-h-0 bg-[#0f0f18] text-white overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-[250px] flex-shrink-0 border-r border-white/[0.05] bg-[#0a0a12] overflow-y-auto">
        <nav className="px-3 pt-5 pb-2 space-y-0.5">
          {sideNav.map(({icon:Icon,label,active})=>(
            <button key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer text-left ${
                active?"bg-violet/15 text-violet-300 border border-violet/20":"text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"}`}>
              <Icon size={15} className={active?"text-violet-400":"text-zinc-600"}/>
              {label}
            </button>
          ))}
        </nav>
        <div className="mx-3 my-2 h-px bg-white/[0.05]"/>

        {/* ATS Score */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={13} className="text-violet-400"/>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ATS Score</span>
          </div>
          <div className="w-[110px] mx-auto mb-3">
            <ScoreDonut score={score} size={110}/>
          </div>
          <div className="text-center mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold ${matchColorClass}`}>
              <CheckCircle2 size={10}/> {matchBadgeText}
            </span>
          </div>
          {optimizedData.scoreKnockout === 0 ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-3 text-center mb-5">
              <p className="text-red-400 font-bold text-[13px] uppercase tracking-wider">Knockout Failed</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Your profile is missing key required credentials from the Job Description.</p>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-3 text-center mb-5">
              <p className="text-emerald-400 font-bold text-[13px] uppercase tracking-wider">Knockouts Passed</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">All mandatory experience, degree, and certification requirements were met!</p>
            </div>
          )}
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Score Breakdown</p>
          <div className="space-y-2.5">
            {breakdown.map(b=><MiniBar key={b.label} label={b.label} value={b.value}/>)}
          </div>
        </div>

        <div className="mx-3 my-1 h-px bg-white/[0.05]"/>

        {/* Keywords */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} className="text-violet-400"/>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Keywords</span>
          </div>
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">Matched ({matched.length})</span>
            <div className="flex flex-wrap gap-1">
              {matched.slice(0,8).map(kw=>(
                <span key={kw} className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/10 border border-emerald-500/15 text-emerald-300">{kw}</span>
              ))}
              {matched.length>8&&<span className="text-[10px] text-zinc-500 px-1 py-0.5">+{matched.length-8} more</span>}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider block mb-1.5">AI Inserted ({inserted.length})</span>
            <div className="flex flex-wrap gap-1">
              {inserted.map(kw=>(
                <span key={kw} className="px-1.5 py-0.5 text-[10px] rounded bg-violet/10 border border-violet/15 text-violet-300">+{kw}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1"/>
        <div className="px-3 pb-5 space-y-0.5 border-t border-white/[0.05] pt-3">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition cursor-pointer">
            <HelpCircle size={15}/>Help &amp; Support
          </button>
          <button onClick={onSignOut} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.06] transition cursor-pointer">
            <LogOut size={15}/>Sign out
          </button>
        </div>
      </aside>

      {/* CENTER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-shrink-0 px-6 pt-5 pb-0 border-b border-white/[0.05]">
          {hasSaved&&(
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold mb-3">
              <CheckCircle2 size={11}/>Saved to profile
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-bold text-white leading-tight">Your Tailored Resume is Ready</h1>
              <p className="text-[13px] text-zinc-400 mt-1">We&apos;ve optimized your resume for the given job description.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={onBack}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer">
                <ArrowLeft size={13}/>Back to Editor
              </button>
              <button onClick={onStartOver}
                className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition cursor-pointer">
                <RefreshCw size={13}/>Start Over
              </button>
              <div className="relative flex items-stretch">
                <button onClick={async()=>{setDownloadDropdownOpen(false);await onDownload(downloadFormat);}}
                  disabled={downloadingPdf}
                  className="flex items-center gap-2 pl-4 pr-3 py-2 text-[13px] font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-l-lg transition cursor-pointer">
                  {downloadingPdf?<div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"/>:<Download size={13}/>}
                  Download PDF
                </button>
                <button onClick={()=>setDownloadDropdownOpen(!downloadDropdownOpen)} disabled={downloadingPdf}
                  className="px-2 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-r-lg border-l border-violet-700 flex items-center cursor-pointer transition">
                  <ChevronDown size={13} className={`transition-transform ${downloadDropdownOpen?"rotate-180":""}`}/>
                </button>
                <AnimatePresence>
                  {downloadDropdownOpen&&(
                    <>
                      <div className="fixed inset-0 z-40" onClick={()=>setDownloadDropdownOpen(false)}/>
                      <motion.div initial={{opacity:0,y:-4,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:0.97}} transition={{duration:0.12}}
                        className="absolute right-0 top-full mt-1.5 w-52 bg-[#18182a] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50">
                        {(["pdf","docx"] as const).map(fmt=>(
                          <button key={fmt} onClick={()=>{setDownloadFormat(fmt);setDownloadDropdownOpen(false);void onDownload(fmt);}}
                            className={`w-full px-4 py-2.5 text-left text-[13px] flex items-center gap-2.5 transition ${downloadFormat===fmt?"text-white bg-white/5":"text-zinc-400 hover:text-white hover:bg-white/5"}`}>
                            <FileText size={13}/>{fmt==="pdf"?"PDF Document (.pdf)":"Word Document (.docx)"}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {apiError&&(
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                className="mt-3 flex items-center justify-between px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[13px] text-red-400">
                <span>{apiError}</span>
                <button onClick={onClearError} className="text-zinc-500 hover:text-zinc-200 font-bold ml-4 cursor-pointer">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-6 mt-5">
            {(["preview","template","sections","ai"] as const).map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)}
                className={`pb-3 text-[13px] font-semibold border-b-2 transition cursor-pointer ${activeTab===tab?"border-violet-400 text-white":"border-transparent text-zinc-500 hover:text-zinc-300"}`}>
                {{preview:"Preview",template:"Template",sections:"Sections",ai:"AI Enhancements"}[tab]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 px-6 py-4 overflow-hidden">
          {activeTab==="preview"&&(
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Template:</span>
                  <div className="relative">
                    <select value={selectedTemplate} onChange={e=>setSelectedTemplate(e.target.value as typeof selectedTemplate)}
                      className="pl-3 pr-8 py-1.5 text-[13px] font-medium text-zinc-200 bg-white/[0.05] border border-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/10 transition outline-none">
                      {templates.map(t=><option key={t.id} value={t.id} className="bg-[#18182a]">{t.name}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"/>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-white/[0.05] border border-white/10 rounded-lg p-0.5">
                    {(["desktop","tablet"] as const).map(m=>(
                      <button key={m} onClick={()=>setViewMode(m)}
                        className={`p-1.5 rounded-md transition cursor-pointer ${viewMode===m?"bg-white/10 text-white":"text-zinc-600 hover:text-zinc-300"}`}>
                        {m==="desktop"?<Monitor size={13}/>:<Tablet size={13}/>}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-white/[0.05] border border-white/10 rounded-lg transition cursor-pointer">
                    <Maximize2 size={12}/>Full Screen
                  </button>
                </div>
              </div>
              <div className={`flex-1 min-h-0 bg-white rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 ${viewMode==="tablet"?"max-w-[640px] mx-auto w-full":"w-full"}`}>
                <iframe ref={iframeRef}
                  srcDoc={generateTemplateHtml(optimizedData.tailoredResumeText,selectedTemplate)}
                  className="w-full h-full border-0" title="Resume Preview" id="resume-preview-iframe"/>
              </div>
            </div>
          )}
          {activeTab==="template"&&(
            <div className="flex-1 overflow-y-auto space-y-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-1">
                {templates.map((tpl,idx)=>(
                  <TemplateThumbnail key={tpl.id} id={tpl.id} name={tpl.name}
                    selected={selectedTemplate===tpl.id}
                    onClick={()=>{setSelectedTemplate(tpl.id as typeof selectedTemplate);setActiveTab("preview");}}
                    idx={idx}/>
                ))}
              </div>
              <div className="h-[380px] bg-white rounded-xl overflow-hidden border border-white/10">
                <iframe srcDoc={generateTemplateHtml(optimizedData.tailoredResumeText,selectedTemplate)} className="w-full h-full border-0" title="Template Preview"/>
              </div>
            </div>
          )}
          {(activeTab==="sections"||activeTab==="ai")&&(
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              <div className="text-center">
                <Sparkles size={28} className="mx-auto mb-3 text-zinc-700"/>
                <p>{activeTab==="sections"?"Section editing":"AI Enhancements"} coming soon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Template carousel footer */}
        <div className="flex-shrink-0 border-t border-white/[0.05] bg-[#0c0c16] px-6 py-3">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Choose Template</p>
          <div className="flex items-end gap-3 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
            {templates.map((tpl,idx)=>(
              <TemplateThumbnail key={tpl.id} id={tpl.id} name={tpl.name}
                selected={selectedTemplate===tpl.id}
                onClick={()=>{setSelectedTemplate(tpl.id as typeof selectedTemplate);setActiveTab("preview");}}
                idx={idx}/>
            ))}
            <button className="flex-shrink-0 w-[88px] flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-full aspect-[3/4] rounded-lg border-2 border-dashed border-zinc-700 hover:border-violet/40 flex items-center justify-center bg-transparent transition group-hover:bg-violet/5">
                <LayoutGrid size={18} className="text-zinc-600 group-hover:text-violet-400 transition"/>
              </div>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-medium text-center leading-tight">View All Templates</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <aside className="hidden xl:flex flex-col w-[272px] flex-shrink-0 border-l border-white/[0.05] bg-[#0a0a12] overflow-y-auto">
        <div className="flex border-b border-white/[0.05]">
          {(["analysis","aireview"] as const).map(tab=>(
            <button key={tab} onClick={()=>setRightTab(tab)}
              className={`flex-1 py-3.5 text-[13px] font-semibold transition cursor-pointer ${rightTab===tab?"text-white border-b-2 border-violet-400":"text-zinc-500 hover:text-zinc-300"}`}>
              {tab==="analysis"?"Analysis":"AI Review"}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-4">
          {/* Job Match */}
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={13} className="text-violet-400"/>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Job Match</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${matchColorClass}`}>{matchTierText}</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-[38px] font-black text-white leading-none">{score}</span>
              <span className="text-zinc-400 text-base mb-1">%</span>
              <div className="ml-auto flex-shrink-0">
                <svg width="50" height="50" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="#1c1c2e" strokeWidth="7"/>
                  <circle cx="25" cy="25" r="20" fill="none" stroke="url(#rpGrad)" strokeWidth="7"
                    strokeLinecap="round" strokeDasharray={2*Math.PI*20}
                    strokeDashoffset={2*Math.PI*20*(1-score/100)} transform="rotate(-90 25 25)"/>
                  <defs>
                    <linearGradient id="rpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#c084fc"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
              {matchDescription}
            </p>
            {matched.length > 0 && (
              <>
                <p className="text-[11px] font-semibold text-zinc-300 mb-2">Top Matched Skills</p>
                <div className="space-y-1.5">
                  {matched.slice(0,5).map(kw=>(
                    <div key={kw} className="flex items-center gap-2">
                      <Check size={11} className="text-emerald-400 flex-shrink-0" strokeWidth={2.5}/>
                      <span className="text-[11px] text-zinc-300">{kw}</span>
                    </div>
                  ))}
                  {matched.length > 5 && (
                    <div className="text-[10px] text-violet-400 font-semibold mt-1">+{matched.length-5} more</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Knockout Validation Details */}
          {optimizedData.scoreKnockout === 0 && optimizedData.knockoutDetails && (
            <div className="bg-red-950/15 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-red-400"/>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Knockout Validation Details</span>
              </div>
              <div className="space-y-2.5 text-[11px]">
                {optimizedData.knockoutDetails.years_experience && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Required Experience:</span>
                    <span className={optimizedData.knockoutDetails.years_experience.met ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                      {optimizedData.knockoutDetails.years_experience.required} Years (Got {optimizedData.knockoutDetails.years_experience.actual})
                    </span>
                  </div>
                )}
                {optimizedData.knockoutDetails.degree && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Required Degree:</span>
                    <span className={optimizedData.knockoutDetails.degree.met ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                      {optimizedData.knockoutDetails.degree.required} (Got {optimizedData.knockoutDetails.degree.actual || "None"})
                    </span>
                  </div>
                )}
                {optimizedData.knockoutDetails.certifications && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Required Certifications:</span>
                      <span className={optimizedData.knockoutDetails.certifications.met ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {optimizedData.knockoutDetails.certifications.met ? "Met" : "Missing"}
                      </span>
                    </div>
                    {!optimizedData.knockoutDetails.certifications.met && optimizedData.knockoutDetails.certifications.missing.length > 0 && (
                      <div className="text-[10px] text-red-300 pl-2 leading-relaxed">
                        Missing: {optimizedData.knockoutDetails.certifications.missing.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Identified Requirements Gaps */}
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-amber-400"/>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Identified Requirements Gaps</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-white bg-violet/25 border border-violet/30 px-2 py-0.5 rounded-full">{improvements.length}</span>
                <ChevronRight size={12} className="text-zinc-600"/>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              {improvements.map((s,i)=>(
                <div key={i} className="flex items-start gap-2">
                  <TrendingUp size={11} className={optimizedData.gapsIdentified && optimizedData.gapsIdentified.length > 0 ? "text-red-400 flex-shrink-0 mt-0.5" : "text-violet-400 flex-shrink-0 mt-0.5"}/>
                  <span className="text-[11px] text-zinc-400 leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unlock Premium */}
          <div className="bg-gradient-to-br from-violet/15 to-purple-900/15 border border-violet/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Lock size={13} className="text-violet-400"/>
              <span className="text-[13px] font-semibold text-white">Unlock Premium Templates</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">Access 15+ premium templates and advanced customization options.</p>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-violet-300 bg-violet/10 hover:bg-violet/20 border border-violet/20 rounded-lg transition cursor-pointer">
              <Star size={13}/>Upgrade Now
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

