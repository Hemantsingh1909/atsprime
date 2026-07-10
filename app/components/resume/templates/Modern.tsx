import { ResumeData } from "@/app/types/resume";

export default function Modern({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, projects, certificates, languages, links } = data;

  return (
    <div className="p-8 bg-zinc-50 text-zinc-900 font-sans leading-relaxed text-xs max-w-[21cm] min-h-[29.7cm] box-border print:p-0 mx-auto flex flex-col justify-between">
      <div>
        {/* Top Header Grid */}
        <div className="bg-zinc-900 text-white p-6 rounded-t-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-extrabold tracking-tight">{personalInfo.name}</h1>
            <p className="text-xs text-violet-400 font-bold tracking-wider uppercase mt-1">{personalInfo.title}</p>
          </div>
          <div className="flex flex-wrap md:flex-col gap-2 text-[10px] text-zinc-300 text-left font-mono">
            <span>📧 {personalInfo.email}</span>
            <span>📞 {personalInfo.phone}</span>
            <span>📍 {personalInfo.location}</span>
          </div>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-6 rounded-b-lg shadow-sm">
          {/* Main content column */}
          <div className="md:col-span-8 space-y-6 text-left border-r border-zinc-150 pr-6">
            {/* Summary */}
            {summary && (
              <div>
                <h3 className="text-xs font-mono font-bold text-violet bg-violet/5 border border-violet/10 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2">
                  Summary
                </h3>
                <p className="text-zinc-650 leading-relaxed font-medium">{summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-violet bg-violet/5 border border-violet/10 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-3">
                  Experience
                </h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1 relative pl-4 border-l border-zinc-200">
                      <div className="absolute -left-[4.5px] top-[4px] h-2 w-2 rounded-full bg-violet" />
                      <div className="flex justify-between items-baseline font-bold text-zinc-900">
                        <span>{exp.position}</span>
                        <span className="text-[9px] text-zinc-500 font-mono font-medium">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">{exp.company} — {exp.location}</div>
                      <p className="text-zinc-650 leading-relaxed whitespace-pre-line text-left mt-1.5">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-violet bg-violet/5 border border-violet/10 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-3">
                  Projects
                </h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-zinc-900">
                        <span>{proj.name}</span>
                        {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-[9px] text-violet hover:underline font-mono">{proj.url}</a>}
                      </div>
                      {proj.role && <div className="text-[10px] text-zinc-500 font-semibold">{proj.role}</div>}
                      <p className="text-zinc-650 leading-relaxed text-left mt-1">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar column */}
          <div className="md:col-span-4 space-y-6 text-left">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2.5">
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2.5">
                  Education
                </h3>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="font-bold text-zinc-900">{edu.degree}</div>
                      <div className="text-[10px] text-zinc-600 font-semibold">{edu.fieldOfStudy}</div>
                      <div className="text-[10px] text-zinc-500">{edu.school}</div>
                      <div className="text-[9px] text-zinc-400 font-mono">{edu.startDate} - {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certificates && certificates.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2.5">
                  Certificates
                </h3>
                <div className="space-y-2">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="text-[11px] leading-snug">
                      <span className="font-bold text-zinc-850 block">{cert.name}</span>
                      <span className="text-zinc-500 text-[10px]">{cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2.5">
                  Languages
                </h3>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-zinc-850">{lang.language}</span>
                      <span className="text-zinc-500 font-mono text-[10px]">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio links */}
            {links && links.length > 0 && (
              <div>
                <h3 className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2.5">
                  Links
                </h3>
                <div className="flex flex-col gap-1">
                  {links.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-violet hover:underline text-[10px] font-mono truncate">
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
