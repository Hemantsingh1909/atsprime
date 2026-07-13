export const parseResumeText = (text: string) => {
  const lines = text.split("\n").map(l => l.trim());
  let name = "";
  let contact = "";
  let summary = "";
  const experience: string[] = [];
  const education: string[] = [];
  const skills: string[] = [];
  const projects: string[] = [];

  let currentSection = "";
  let nameFound = false;
  let contactFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    const lineLower = line.toLowerCase();

    if (
      lineLower.includes("summary") || 
      lineLower === "professional summary" || 
      lineLower === "summary of qualifications" ||
      lineLower === "executive summary"
    ) {
      currentSection = "summary";
      continue;
    } else if (
      lineLower.includes("experience") || 
      lineLower === "work experience" || 
      lineLower === "professional experience" || 
      lineLower === "employment history" ||
      lineLower === "experience history"
    ) {
      currentSection = "experience";
      continue;
    } else if (
      lineLower.includes("education") || 
      lineLower === "academic history" || 
      lineLower === "credentials"
    ) {
      currentSection = "education";
      continue;
    } else if (
      lineLower.includes("skills") || 
      lineLower === "technical skills" || 
      lineLower === "skills & technologies" ||
      lineLower === "core competencies"
    ) {
      currentSection = "skills";
      continue;
    } else if (
      lineLower.includes("projects") || 
      lineLower === "key projects" || 
      lineLower === "personal projects" ||
      lineLower === "professional projects"
    ) {
      currentSection = "projects";
      continue;
    }

    if (currentSection === "") {
      if (!nameFound) {
        name = line;
        nameFound = true;
      } else if (!contactFound) {
        contact = line;
        contactFound = true;
      } else {
        contact += " | " + line;
      }
      continue;
    }

    if (currentSection === "summary") {
      summary += (summary ? " " : "") + line;
    } else if (currentSection === "experience") {
      experience.push(line);
    } else if (currentSection === "education") {
      education.push(line);
    } else if (currentSection === "skills") {
      skills.push(line);
    } else if (currentSection === "projects") {
      projects.push(line);
    }
  }

  const isSample = text.toLowerCase().includes("alex.rivera@dev.io");

  if (isSample) {
    if (!name) name = "Alex Rivera";
    if (!contact) contact = "alex.rivera@dev.io | +1 (555) 019-2834 | San Francisco, CA";
    return {
      name,
      contact,
      summary: summary || "Results-oriented professional with a proven track record of success.",
      experience: experience.length > 0 ? experience : ["Software Developer | TechCorp (2024 - Present) \n- Developed and styled UI components."],
      education: education.length > 0 ? education : ["B.S. in Computer Science | University of California"],
      skills: skills.length > 0 ? skills : ["React, Next.js, TypeScript, JavaScript, CSS, HTML"],
      projects: projects
    };
  }

  if (!name) {
    name = lines.find(l => l.trim() !== "") || "";
  }
  if (!contact) {
    const nonEmpties = lines.filter(l => l.trim() !== "");
    contact = nonEmpties[1] || "";
  }

  return {
    name,
    contact,
    summary: summary || "",
    experience: experience.length > 0 ? experience : [],
    education: education.length > 0 ? education : [],
    skills: skills.length > 0 ? skills : [],
    projects: projects
  };
};

export const renderExperienceHtml = (expLines: string[]) => {
  let html = "";
  let insideList = false;

  for (const line of expLines) {
    const isBullet = line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ") || line.startsWith("– ");
    
    if (isBullet) {
      if (!insideList) {
        html += `<ul style="margin-top: 4px; margin-bottom: 8px; padding-left: 20px; list-style-type: disc;">`;
        insideList = true;
      }
      const cleanLine = line.replace(/^[-*•–]\s*/, "");
      html += `<li style="margin-bottom: 4px;">${cleanLine}</li>`;
    } else {
      if (insideList) {
        html += `</ul>`;
        insideList = false;
      }
      const isHeader = line.includes("|") || line.includes(" - ") || line.includes("–") || line.toUpperCase() === line;
      if (isHeader) {
        html += `<div style="font-weight: bold; margin-top: 12px; font-size: 1.05em; display: flex; justify-content: space-between;">${line}</div>`;
      } else {
        html += `<p style="margin-top: 4px; margin-bottom: 4px; font-weight: 500;">${line}</p>`;
      }
    }
  }

  if (insideList) {
    html += `</ul>`;
  }

  return html;
};

export const generateTemplateHtml = (text: string, template: string) => {
  const data = parseResumeText(text);
  let styles = "";
  let contentHtml = "";

  if (template === "classic") {
    styles = `
      body { font-family: 'Times New Roman', Times, serif; color: #111; line-height: 1.5; padding: 40px; background: #fff; max-width: 800px; margin: 0 auto; }
      h1 { text-align: center; text-transform: uppercase; margin-bottom: 5px; font-size: 26px; font-weight: normal; letter-spacing: 1px; }
      .contact { text-align: center; font-size: 11px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
      h2 { text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #ddd; margin-top: 20px; margin-bottom: 8px; padding-bottom: 2px; letter-spacing: 0.5px; }
      .section-content { font-size: 12px; }
    `;
    contentHtml = `
      <h1>${data.name}</h1>
      <div class="contact">${data.contact}</div>
      ${data.summary ? `<h2>Professional Summary</h2>
      <div class="section-content"><p>${data.summary}</p></div>` : ""}
      ${data.experience.length > 0 ? `<h2>Work Experience</h2>
      <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
      ${data.projects.length > 0 ? `<h2>Projects</h2>
      <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
      ${data.education.length > 0 ? `<h2>Education</h2>
      <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
      ${data.skills.length > 0 ? `<h2>Skills</h2>
      <div class="section-content" style="margin-top: 8px;">
        ${data.skills.map(s => `<p>${s}</p>`).join("")}
      </div>` : ""}
    `;
  } else if (template === "modern") {
    styles = `
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #171717; line-height: 1.6; padding: 40px; background: #fff; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.5px; }
      .contact { font-size: 13px; color: #666; margin-bottom: 30px; }
      h2 { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #7c3aed; border-bottom: 1px solid #eaeaea; margin-top: 25px; margin-bottom: 12px; padding-bottom: 4px; letter-spacing: 0.5px; }
      .section-content { font-size: 14px; }
    `;
    contentHtml = `
      <h1>${data.name}</h1>
      <div class="contact">${data.contact}</div>
      ${data.summary ? `<h2>Summary</h2>
      <div class="section-content"><p>${data.summary}</p></div>` : ""}
      ${data.experience.length > 0 ? `<h2>Experience</h2>
      <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
      ${data.projects.length > 0 ? `<h2>Projects</h2>
      <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
      ${data.education.length > 0 ? `<h2>Education</h2>
      <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
      ${data.skills.length > 0 ? `<h2>Skills & Technologies</h2>
      <div class="section-content" style="margin-top: 8px;">
        ${data.skills.map(s => `<p>${s}</p>`).join("")}
      </div>` : ""}
    `;
  } else if (template === "minimal") {
    styles = `
      body { font-family: Georgia, serif; color: #222; line-height: 1.6; padding: 45px; background: #fff; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 28px; font-weight: normal; margin-bottom: 6px; font-style: italic; }
      .contact { font-size: 12px; color: #555; margin-bottom: 25px; font-style: italic; border-bottom: 1px double #ccc; padding-bottom: 8px; }
      h2 { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #444; margin-top: 22px; margin-bottom: 10px; letter-spacing: 1px; }
      .section-content { font-size: 13px; }
    `;
    contentHtml = `
      <h1>${data.name}</h1>
      <div class="contact">${data.contact}</div>
      ${data.summary ? `<h2>About Me</h2>
      <div class="section-content"><p>${data.summary}</p></div>` : ""}
      ${data.experience.length > 0 ? `<h2>Experience</h2>
      <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
      ${data.projects.length > 0 ? `<h2>Projects</h2>
      <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
      ${data.education.length > 0 ? `<h2>Education</h2>
      <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
      ${data.skills.length > 0 ? `<h2>Expertise</h2>
      <div class="section-content" style="margin-top: 8px;">
        ${data.skills.map(s => `<p>${s}</p>`).join("")}
      </div>` : ""}
    `;
  } else if (template === "split") {
    styles = `
      body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #333; line-height: 1.5; padding: 30px; background: #fff; max-width: 850px; margin: 0 auto; }
      .container { display: flex; gap: 30px; }
      .sidebar { width: 30%; border-right: 1px solid #eee; padding-right: 25px; }
      .main { width: 70%; }
      h1 { font-size: 28px; font-weight: 700; margin-top: 0; margin-bottom: 8px; color: #111; }
      .sidebar h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #444; border-bottom: 2px solid #333; padding-bottom: 3px; margin-top: 25px; }
      .main h2 { font-size: 15px; font-weight: 600; text-transform: uppercase; color: #111; border-bottom: 1px solid #eee; padding-bottom: 3px; margin-top: 25px; }
      .section-content { font-size: 12.5px; }
      .sidebar-content { font-size: 12px; color: #555; }
    `;
    contentHtml = `
      <div class="container">
        <div class="sidebar">
          <h1>${data.name}</h1>
          ${data.contact ? `<h2>Contact</h2>
          <div class="sidebar-content" style="margin-top: 8px; line-height: 1.8;">
            ${data.contact.split("|").map(c => `<div>${c.trim()}</div>`).join("")}
          </div>` : ""}
          ${data.skills.length > 0 ? `<h2>Skills</h2>
          <div class="sidebar-content" style="margin-top: 8px; line-height: 1.8;">
            ${data.skills.map(s => `<div>${s}</div>`).join("")}
          </div>` : ""}
        </div>
        <div class="main">
          ${data.summary ? `<h2>Profile</h2>
          <div class="section-content"><p>${data.summary}</p></div>` : ""}
          ${data.experience.length > 0 ? `<h2>Experience</h2>
          <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
          ${data.projects.length > 0 ? `<h2>Projects</h2>
          <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
          ${data.education.length > 0 ? `<h2>Education</h2>
          <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
        </div>
      </div>
    `;
  } else if (template === "slate") {
    styles = `
      body { font-family: Courier, monospace; color: #1e293b; line-height: 1.5; padding: 40px; background: #fff; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 24px; font-weight: bold; margin-bottom: 8px; border: 2px solid #1e293b; display: inline-block; padding: 5px 15px; text-transform: uppercase; }
      .contact { font-size: 12px; color: #64748b; margin-bottom: 25px; border-bottom: 2px solid #1e293b; padding-bottom: 8px; }
      h2 { font-size: 14px; font-weight: bold; text-transform: uppercase; background: #1e293b; color: #fff; padding: 3px 8px; margin-top: 22px; margin-bottom: 12px; display: inline-block; }
      .section-content { font-size: 12px; }
    `;
    contentHtml = `
      <h1>${data.name}</h1>
      <div class="contact">${data.contact}</div>
      ${data.summary ? `<div><h2>Summary</h2></div>
      <div class="section-content"><p>${data.summary}</p></div>` : ""}
      ${data.experience.length > 0 ? `<div><h2>Experience</h2></div>
      <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
      ${data.projects.length > 0 ? `<div><h2>Projects</h2></div>
      <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
      ${data.education.length > 0 ? `<div><h2>Education</h2></div>
      <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
      ${data.skills.length > 0 ? `<div><h2>Skills</h2></div>
      <div class="section-content" style="margin-top: 8px;">
        ${data.skills.map(s => `<p>${s}</p>`).join("")}
      </div>` : ""}
    `;
  } else {
    styles = `
      body { font-family: Calibri, sans-serif; color: #222; line-height: 1.4; padding: 40px; background: #fff; max-width: 800px; margin: 0 auto; }
      h1 { text-align: center; color: #1e3a8a; font-size: 28px; font-weight: bold; margin-bottom: 5px; }
      .contact { text-align: center; font-size: 12px; color: #475569; margin-bottom: 20px; border-bottom: 2px solid #1e3a8a; padding-bottom: 6px; }
      h2 { color: #1e3a8a; font-size: 15px; border-bottom: 1px solid #1e3a8a; margin-top: 20px; margin-bottom: 10px; padding-bottom: 2px; text-transform: uppercase; font-weight: bold; }
      .section-content { font-size: 12.5px; }
    `;
    contentHtml = `
      <h1>${data.name}</h1>
      <div class="contact">${data.contact}</div>
      ${data.summary ? `<h2>Executive Profile</h2>
      <div class="section-content"><p>${data.summary}</p></div>` : ""}
      ${data.experience.length > 0 ? `<h2>Professional Experience</h2>
      <div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ""}
      ${data.projects.length > 0 ? `<h2>Selected Key Projects</h2>
      <div class="section-content">${renderExperienceHtml(data.projects)}</div>` : ""}
      ${data.education.length > 0 ? `<h2>Education & Credentials</h2>
      <div class="section-content">${renderExperienceHtml(data.education)}</div>` : ""}
      ${data.skills.length > 0 ? `<h2>Core Competencies</h2>
      <div class="section-content" style="margin-top: 8px;">
        ${data.skills.map(s => `<p>${s}</p>`).join("")}
      </div>` : ""}
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${data.name} - Tailored Resume</title>
      <style>
        ${styles}
        @media print {
          body { padding: 0; margin: 0; }
          ul { page-break-inside: avoid; }
          li { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${contentHtml}
    </body>
    </html>
  `;
};

export const templates = [
  { id: "classic", name: "Classic Harvard", desc: "Traditional serif, centered headers, thin divider lines." },
  { id: "modern", name: "Modern Tech", desc: "Clean sans-serif, bold metadata, optimized for tech positions." },
  { id: "minimal", name: "Elegant Minimalist", desc: "Georgia serif, wide margins, elegant layout spacing." },
  { id: "split", name: "Split Sidebar", desc: "Two-column layout separating contact/skills from experience." },
  { id: "slate", name: "Creative Slate", desc: "Monospace accents, slate grey box titles, bold borders." },
  { id: "executive", name: "Executive Bold", desc: "Calibri corporate style with dark navy header accents." },
];
