/**
 * Audit script: generates a real PDF using the same code path as /api/pdf/route.ts
 * Run with: node --input-type=module < scripts/generate_audit_pdf.mjs
 * Or: node scripts/generate_audit_pdf.mjs (as ES module)
 */
import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESUME_TEXT = `Alex Rivera
alex.rivera@example.com | 555-000-1111 | San Francisco, CA | linkedin.com/in/alexrivera

SUMMARY
Senior Full Stack Engineer with 6 years delivering scalable TypeScript/React frontends and Node.js/PostgreSQL backends. Expert at building high-throughput systems and leading cross-functional engineering teams.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2019–Present
- Built scalable REST APIs with Node.js and Express, serving 50K+ daily active requests.
- Led React TypeScript frontend migration, reducing page load time by 40%.
- Deployed containerized microservices with Docker and managed high-availability PostgreSQL clusters.
- Designed UI assets in Figma and collaborated with design teams.

Software Engineer | DataFlow Systems | New York, NY | 2017–2019
- Developed Python data pipelines processing 1M records per day.
- Built internal dashboards using React and D3.js.

EDUCATION
UC Berkeley | B.S. Computer Science | 2013–2017

SKILLS
TypeScript, JavaScript, Python, React, Node.js, Express, Docker, PostgreSQL, Redis, Figma`;

// Inline the template HTML generation (same logic as app/utils/templates.ts)
function parseResumeText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let name = '', contact = '', summary = '', experience = [], education = [], skills = [], projects = [];
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upper = line.toUpperCase();

    if (i === 0) { name = line; continue; }
    if (i === 1 && !['SUMMARY','EXPERIENCE','EDUCATION','SKILLS'].includes(upper)) {
      contact = line; continue;
    }

    if (upper === 'SUMMARY' || upper === 'PROFESSIONAL SUMMARY' || upper === 'ABOUT ME') { currentSection = 'summary'; continue; }
    if (upper === 'EXPERIENCE' || upper === 'WORK EXPERIENCE' || upper === 'PROFESSIONAL EXPERIENCE') { currentSection = 'experience'; continue; }
    if (upper === 'EDUCATION') { currentSection = 'education'; continue; }
    if (upper === 'SKILLS' || upper === 'SKILLS & TECHNOLOGIES' || upper === 'CORE COMPETENCIES') { currentSection = 'skills'; continue; }
    if (upper === 'PROJECTS') { currentSection = 'projects'; continue; }

    switch (currentSection) {
      case 'summary': summary += (summary ? ' ' : '') + line; break;
      case 'experience': experience.push(line); break;
      case 'education': education.push(line); break;
      case 'skills': skills.push(line); break;
      case 'projects': projects.push(line); break;
    }
  }

  return { name, contact, summary, experience, education, skills, projects };
}

function renderExperienceHtml(lines) {
  return lines.map(line => {
    const isBullet = line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ');
    if (isBullet) return `<li>${line.slice(2)}</li>`;
    return `<p style="font-weight:bold; margin-top:10px">${line}</p>`;
  }).join('');
}

function generateTemplateHtml(text, template) {
  const data = parseResumeText(text);
  let styles = '';
  let contentHtml = '';

  if (template === 'modern') {
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
      ${data.summary ? `<h2>Summary</h2><div class="section-content"><p>${data.summary}</p></div>` : ''}
      ${data.experience.length > 0 ? `<h2>Experience</h2><div class="section-content">${renderExperienceHtml(data.experience)}</div>` : ''}
      ${data.education.length > 0 ? `<h2>Education</h2><div class="section-content">${renderExperienceHtml(data.education)}</div>` : ''}
      ${data.skills.length > 0 ? `<h2>Skills & Technologies</h2><div class="section-content"><p>${data.skills.join(', ')}</p></div>` : ''}
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.name} - Tailored Resume</title>
  <style>
    ${styles}
    @media print { body { padding: 0; margin: 0; } }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;
}

async function main() {
  console.log('1. Generating HTML template...');
  const html = generateTemplateHtml(RESUME_TEXT, 'modern');
  console.log('   HTML length:', html.length, 'chars');
  console.log('   Contains name "Alex Rivera":', html.includes('Alex Rivera'));
  console.log('   Contains "TypeScript":', html.includes('TypeScript'));

  console.log('\n2. Launching Playwright headless Chromium...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('3. Setting HTML content...');
  await page.setContent(html, { waitUntil: 'load', timeout: 15000 });

  console.log('4. Generating PDF...');
  const start = Date.now();
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0.2in', bottom: '0.2in', left: '0.2in', right: '0.2in' }
  });
  const elapsed = Date.now() - start;
  console.log(`   PDF generated in ${elapsed}ms`);
  console.log(`   PDF size: ${pdfBuffer.length} bytes`);

  await browser.close();

  const outPath = path.join(__dirname, '..', 'audit_test_resume.pdf');
  writeFileSync(outPath, pdfBuffer);
  console.log(`\n5. PDF written to: ${outPath}`);

  // Check PDF header
  const header = pdfBuffer.slice(0, 8).toString();
  console.log(`   PDF magic bytes: "${header}"`);
  console.log(`   Valid PDF: ${header.startsWith('%PDF')}`);
}

main().catch(err => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
