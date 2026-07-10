import { ResumeData } from "@/app/types/resume";

export default function Creative({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects, certificates, languages, links } = data;

  return (
    <div className="p-8 bg-zinc-950 text-zinc-100 font-sans leading-relaxed text-xs max-w-[21cm] min-h-[29.7cm] box-border print:p-0 mx-auto flex flex-col justify-between border-t-4 border-violet">
      <div>
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-6 mb-6 gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet to-highlight-pink bg-clip-text text-transparent uppercase tracking-tight">
              {personalInfo.name}
            </h1>
            <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mt-1">
              {personalInfo.title}
            </p>
          </div>
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1.5 text-[10px] text-zinc-400 font-mono text-left">
            <span>📧 {personalInfo.email}</span>
            <span>📞 {personalInfo.phone}</span>
            <span>📍 {personalInfo.location}</span>
          </div>
        </div>

        {/* Dynamic Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main content area */}
          <div className="md:col-span-8 space-y-6 text-left">
            {/* Summary */}
            {summary && (
              <div>
                <span className="text-[10px] font-mono font-bold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-2.5">
                  Overview
                </span>
                <p className="text-zinc-350 leading-relaxed font-medium">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <div>
                <span className="text-[10px] font-mono font-bold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-3.5">
                  Employment History
                </span>
                <div className="space-y-5">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1 relative pl-4 border-l border-zinc-850">
                      <div className="absolute -left-[4px] top-[4px] h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet to-highlight-pink" />
                      <div className="flex justify-between items-baseline font-bold text-zinc-100">
                        <span className="text-sm">{exp.position}</span>
                        <span className="text-[9px] text-zinc-500 font-mono font-medium">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">{exp.company} — {exp.location}</div>
                      <p className="text-zinc-450 leading-relaxed whitespace-pre-line text-left mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div>
                <span className="text-[10px] font-mono font-bold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-3.5">
                  Case Studies & Projects
                </span>
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-zinc-100">
                        <span>{proj.name}</span>
                        {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-[9px] text-violet hover:underline font-mono">{proj.url}</a>}
                      </div>
                      {proj.role && <div className="text-[10px] text-zinc-550 font-bold">{proj.role}</div>}
                      <p className="text-zinc-400 leading-relaxed text-left mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="md:col-span-4 space-y-6 text-left">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Skills Matrix
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Education
                </span>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="font-bold text-zinc-100">{edu.degree}</div>
                      <div className="text-[10px] text-zinc-400 font-semibold">{edu.fieldOfStudy}</div>
                      <div className="text-[10px] text-zinc-500 font-medium">{edu.school}</div>
                      <div className="text-[9px] text-zinc-650 font-mono">{edu.startDate} - {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certificates && certificates.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Certificates
                </span>
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="text-[11px] leading-snug">
                      <span className="font-bold text-zinc-200 block">{cert.name}</span>
                      <span className="text-zinc-500 text-[10px] font-mono">{cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Languages
                </span>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-zinc-200">{lang.language}</span>
                      <span className="text-zinc-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* links */}
            {links && links.length > 0 && (
              <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                  Links
                </span>
                <div className="flex flex-col gap-1 text-[10px] font-mono">
                  {links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-violet hover:underline truncate">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
