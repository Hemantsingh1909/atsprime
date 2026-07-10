import { ResumeData } from "@/app/types/resume";

export default function Executive({ data }: { data: ResumeData }) {
  const { personalInfo, summary, experience, education, skills, certificates, achievements, languages, links } = data;

  return (
    <div className="p-10 bg-white text-zinc-800 font-serif leading-relaxed text-xs max-w-[21cm] min-h-[29.7cm] box-border print:p-0 mx-auto">
      {/* Executive Navy Header Accent */}
      <div className="border-t-8 border-navy-blue pt-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-baseline gap-2 border-b-2 border-zinc-200 pb-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold uppercase tracking-tight text-zinc-900" style={{ color: "#0A2540" }}>
              {personalInfo.name}
            </h1>
            <h2 className="text-xs font-sans font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {personalInfo.title}
            </h2>
          </div>
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1 text-[10px] text-zinc-550 font-sans text-left md:text-right">
            <span>{personalInfo.email} | {personalInfo.phone}</span>
            <span>{personalInfo.location}</span>
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6 text-left">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-l-4 border-navy-blue pl-2.5 mb-2.5" style={{ color: "#0A2540" }}>
            Executive Summary
          </h3>
          <p className="text-zinc-650 leading-relaxed font-serif pl-3">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6 text-left">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-l-4 border-navy-blue pl-2.5 mb-3" style={{ color: "#0A2540" }}>
            Professional Timeline
          </h3>
          <div className="space-y-4 pl-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-zinc-800">
                  <span className="text-sm">{exp.position}</span>
                  <span className="text-[10px] text-zinc-500 font-sans font-medium">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline text-[10px] text-zinc-500 font-sans italic font-bold">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <p className="text-zinc-650 leading-relaxed font-serif pt-1 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <div className="mb-6 text-left">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-l-4 border-navy-blue pl-2.5 mb-2.5" style={{ color: "#0A2540" }}>
            Core Competencies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-3 mt-1.5">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-1.5 text-zinc-650 text-[11px] font-sans">
                <span className="h-1 w-1 bg-zinc-800 rotate-45 flex-shrink-0" style={{ backgroundColor: "#0A2540" }} />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6 text-left">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-l-4 border-navy-blue pl-2.5 mb-3" style={{ color: "#0A2540" }}>
            Education & Academic Profiles
          </h3>
          <div className="space-y-3 pl-3">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-zinc-800">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-[10px] text-zinc-500 font-sans font-medium">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-sans flex justify-between items-baseline font-medium">
                  <span>{edu.school} — {edu.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements & Certifications split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pl-3">
        {certificates && certificates.length > 0 && (
          <div>
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-2.5" style={{ color: "#0A2540" }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between text-[11px] font-sans">
                  <span>
                    <span className="font-bold text-zinc-800">{cert.name}</span>
                    <span className="text-zinc-500"> ({cert.issuer})</span>
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div>
            <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest border-b border-zinc-200 pb-1 mb-2.5" style={{ color: "#0A2540" }}>
              Key Accomplishments
            </h3>
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div key={ach.id} className="text-[11px] font-sans">
                  <span className="font-bold text-zinc-800 block">{ach.title}</span>
                  <span className="text-zinc-500">{ach.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Languages and Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-zinc-200 pt-4 text-left pl-3">
        {languages && languages.length > 0 && (
          <div>
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Languages</h4>
            <div className="flex flex-wrap gap-4 text-[11px]">
              {languages.map((lang) => (
                <span key={lang.id} className="text-zinc-650 font-sans">
                  <span className="font-bold text-zinc-800">{lang.language}</span> ({lang.proficiency})
                </span>
              ))}
            </div>
          </div>
        )}

        {links && links.length > 0 && (
          <div>
            <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Professional Links</h4>
            <div className="flex flex-wrap gap-4 text-[11px] font-sans">
              {links.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="text-zinc-600 hover:underline">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
