# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-qa.spec.ts >> Responsive Visual QA Audit at 390px
- Location: tests/visual-qa.spec.ts:8:7

# Error details

```
Error: Console errors encountered at 390px: Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 ()

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 5

- Array []
+ Array [
+   "Failed to load resource: the server responded with a status of 400 ()",
+   "Failed to load resource: the server responded with a status of 400 ()",
+   "Failed to load resource: the server responded with a status of 400 ()",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "ATSPrime" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e9]: ATSPrime
      - button "Toggle menu" [ref=e10]:
        - img [ref=e11]
  - generic [ref=e18]:
    - generic [ref=e20]:
      - img [ref=e21]
      - text: AI-Powered Resume Optimization
    - heading "Stop rewriting your resume for every job." [level=1] [ref=e23]:
      - text: Stop rewriting
      - text: your resume
      - generic [ref=e24]: for every job.
    - paragraph [ref=e25]: Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
    - generic [ref=e26]:
      - link "Start Free" [ref=e27] [cursor=pointer]:
        - /url: /dashboard
        - text: Start Free
        - img [ref=e28]
      - link "Browse Templates" [ref=e30] [cursor=pointer]:
        - /url: /builder?view=gallery
        - img [ref=e31]
        - text: Browse Templates
    - generic [ref=e37]:
      - generic [ref=e38]:
        - img [ref=e40]
        - generic [ref=e43]: ATS Optimized
      - generic [ref=e44]:
        - img [ref=e46]
        - generic [ref=e48]: AI Powered
      - generic [ref=e49]:
        - img [ref=e51]
        - generic [ref=e54]: Free to Start
  - generic [ref=e56]:
    - generic [ref=e57]:
      - generic [ref=e58]: Workflow
      - heading "From job posting to interview-ready resume in under one minute." [level=2] [ref=e59]
      - paragraph [ref=e60]: ATSPrime removes the repetitive work of tailoring resumes so you can spend more time applying to the jobs that matter.
    - generic [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - img [ref=e65]
          - img [ref=e69]
        - generic [ref=e72]:
          - generic [ref=e73]: STEP 01
          - heading "Upload Your Resume" [level=3] [ref=e74]
          - paragraph [ref=e75]: Upload your existing PDF or DOCX resume. ATSPrime extracts your experience, education, projects, and skills automatically.
      - generic [ref=e76]:
        - generic [ref=e77]:
          - img [ref=e79]
          - img [ref=e83]
        - generic [ref=e86]:
          - generic [ref=e87]: STEP 02
          - heading "Paste the Job Description" [level=3] [ref=e88]
          - paragraph [ref=e89]: Paste the job description from LinkedIn, Indeed, Greenhouse, Lever, or any company career page.
      - generic [ref=e90]:
        - generic [ref=e91]:
          - img [ref=e93]
          - img [ref=e96]
        - generic [ref=e99]:
          - generic [ref=e100]: STEP 03
          - heading "AI Tailors Everything" [level=3] [ref=e101]
          - paragraph [ref=e102]: Our AI rewrites bullet points, improves achievements, adds ATS keywords, and generates a tailored professional summary.
      - generic [ref=e103]:
        - generic [ref=e104]:
          - img [ref=e106]
          - img [ref=e110]
        - generic [ref=e113]:
          - generic [ref=e114]: STEP 04
          - heading "ATS Optimization" [level=3] [ref=e115]
          - paragraph [ref=e116]: ATSPrime analyzes missing keywords, formatting, readability, and recruiter compatibility to maximize your ATS score.
      - generic [ref=e117]:
        - img [ref=e120]
        - generic [ref=e123]:
          - generic [ref=e124]: STEP 05
          - heading "Download & Apply" [level=3] [ref=e125]
          - paragraph [ref=e126]: Export your optimized resume as PDF or DOCX and apply with confidence in just a few clicks.
  - generic [ref=e128]:
    - generic [ref=e129]:
      - generic [ref=e130]: FAQ
      - heading "Questions? We've got answers." [level=2] [ref=e131]:
        - text: Questions?
        - text: We've got answers.
      - paragraph [ref=e132]: Everything you need to know before using ATSPrime.
    - generic [ref=e133]:
      - generic [ref=e134]:
        - button "Will ATSPrime rewrite my entire resume?" [expanded] [ref=e135]:
          - heading "Will ATSPrime rewrite my entire resume?" [level=3] [ref=e136]
          - img [ref=e138]
        - paragraph [ref=e143]: No. ATSPrime improves your existing resume by rewriting bullet points, optimizing ATS keywords, and tailoring it for each job while preserving your actual experience and achievements.
      - button "Will my resume pass Applicant Tracking Systems (ATS)?" [ref=e145]:
        - heading "Will my resume pass Applicant Tracking Systems (ATS)?" [level=3] [ref=e146]
        - img [ref=e148]
      - button "Can I tailor my resume for different companies?" [ref=e150]:
        - heading "Can I tailor my resume for different companies?" [level=3] [ref=e151]
        - img [ref=e153]
      - button "Do I need to upload my resume every time?" [ref=e155]:
        - heading "Do I need to upload my resume every time?" [level=3] [ref=e156]
        - img [ref=e158]
      - button "Which file formats are supported?" [ref=e160]:
        - heading "Which file formats are supported?" [level=3] [ref=e161]
        - img [ref=e163]
      - button "Is my resume data secure?" [ref=e165]:
        - heading "Is my resume data secure?" [level=3] [ref=e166]
        - img [ref=e168]
      - button "Can I cancel my subscription anytime?" [ref=e170]:
        - heading "Can I cancel my subscription anytime?" [level=3] [ref=e171]
        - img [ref=e173]
      - button "Is there a free plan available?" [ref=e175]:
        - heading "Is there a free plan available?" [level=3] [ref=e176]
        - img [ref=e178]
  - generic [ref=e183]:
    - generic [ref=e184]:
      - generic [ref=e185]:
        - img [ref=e186]
        - text: Ready to Apply
      - heading "Your next interview starts with a better resume." [level=2] [ref=e188]:
        - text: Your next interview
        - text: starts with
        - generic [ref=e189]: a better resume.
      - paragraph [ref=e190]: Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
      - link "Start Free" [ref=e192] [cursor=pointer]:
        - /url: /dashboard
        - text: Start Free
        - img [ref=e193]
      - paragraph [ref=e195]: Tailor your resume for any role, instantly.
      - generic [ref=e196]:
        - img [ref=e197]
        - text: No credit card required
    - generic [ref=e200]:
      - generic [ref=e201]:
        - heading "Resume Score" [level=3] [ref=e202]
        - img [ref=e204]
      - generic [ref=e208]:
        - img [ref=e209]
        - generic [ref=e212]:
          - generic [ref=e213]: "94"
          - generic [ref=e214]: ATS Score
      - generic [ref=e215]: ✓ Optimized & Ready to Apply
  - contentinfo [ref=e216]:
    - generic [ref=e217]:
      - generic [ref=e218]:
        - generic [ref=e219]:
          - link "ATSPrime" [ref=e220] [cursor=pointer]:
            - /url: /
            - img [ref=e221]
            - generic [ref=e224]: ATSPrime
          - paragraph [ref=e225]:
            - text: Tailor every resume.
            - text: Land more interviews.
          - generic [ref=e226]:
            - link [ref=e227] [cursor=pointer]:
              - /url: https://x.com/atsprime
              - img [ref=e228]
            - link [ref=e230] [cursor=pointer]:
              - /url: https://linkedin.com/company/atsprime
              - img [ref=e231]
            - link [ref=e235] [cursor=pointer]:
              - /url: https://github.com/Hemantsingh1909/atsprime
              - img [ref=e236]
        - generic [ref=e239]:
          - heading "Product" [level=4] [ref=e240]
          - list [ref=e241]:
            - listitem [ref=e242]:
              - link "How It Works" [ref=e243] [cursor=pointer]:
                - /url: /#how-it-works
            - listitem [ref=e244]:
              - link "FAQ" [ref=e245] [cursor=pointer]:
                - /url: /#faq
        - generic [ref=e246]:
          - heading "Resources" [level=4] [ref=e247]
          - list [ref=e248]:
            - listitem [ref=e249]:
              - link "ATS Guide" [ref=e250] [cursor=pointer]:
                - /url: /ats-guide
            - listitem [ref=e251]:
              - link "Resume Templates" [ref=e252] [cursor=pointer]:
                - /url: /templates
            - listitem [ref=e253]:
              - link "Career Tips" [ref=e254] [cursor=pointer]:
                - /url: /career-tips
            - listitem [ref=e255]:
              - link "Blog" [ref=e256] [cursor=pointer]:
                - /url: /blog
        - generic [ref=e257]:
          - heading "Company" [level=4] [ref=e258]
          - list [ref=e259]:
            - listitem [ref=e260]:
              - link "About" [ref=e261] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e262]:
              - link "Contact" [ref=e263] [cursor=pointer]:
                - /url: /contact
            - listitem [ref=e264]:
              - link "Privacy" [ref=e265] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e266]:
              - link "Terms" [ref=e267] [cursor=pointer]:
                - /url: /terms
      - generic [ref=e268]:
        - generic [ref=e269]:
          - paragraph [ref=e270]: © 2026 ATSPrime. All rights reserved.
          - generic [ref=e275]: All systems operational
        - paragraph [ref=e276]:
          - text: 🚀 Building in Public • Follow our journey →
          - link "@atsprime" [ref=e277] [cursor=pointer]:
            - /url: https://github.com/Hemantsingh1909/resumeai
  - button "Open Next.js Dev Tools" [ref=e283] [cursor=pointer]:
    - img [ref=e284]
  - alert [ref=e287]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import * as fs from "fs";
  3   | import * as path from "path";
  4   | 
  5   | const viewports = [390, 768, 1024, 1440];
  6   | 
  7   | for (const width of viewports) {
  8   |   test(`Responsive Visual QA Audit at ${width}px`, async ({ page }) => {
  9   |     const consoleErrors: string[] = [];
  10  |     const pageErrors: string[] = [];
  11  |     const hydrationWarnings: string[] = [];
  12  | 
  13  |     // Listen for console and page errors
  14  |     page.on("console", (msg) => {
  15  |       const text = msg.text();
  16  |       if (msg.type() === "error") {
  17  |         consoleErrors.push(text);
  18  |       }
  19  |       if (text.toLowerCase().includes("hydration")) {
  20  |         hydrationWarnings.push(text);
  21  |       }
  22  |     });
  23  | 
  24  |     page.on("pageerror", (err) => {
  25  |       pageErrors.push(err.message);
  26  |     });
  27  | 
  28  |     // Set viewport size
  29  |     const height = width < 768 ? 844 : 900;
  30  |     await page.setViewportSize({ width, height });
  31  | 
  32  |     // Navigate to page
  33  |     await page.goto("/");
  34  |     await page.waitForLoadState("load");
  35  | 
  36  |     // Scroll through the page to trigger lazy animations/render components
  37  |     await page.evaluate(() => {
  38  |       window.scrollTo(0, document.body.scrollHeight);
  39  |     });
  40  |     await page.waitForTimeout(500);
  41  |     await page.evaluate(() => {
  42  |       window.scrollTo(0, 0);
  43  |     });
  44  |     await page.waitForTimeout(500);
  45  | 
  46  |     // 1. Check for page/javascript errors
  47  |     expect(pageErrors, `Page JS errors encountered at ${width}px: ${pageErrors.join(", ")}`).toEqual([]);
  48  | 
  49  |     // 2. Check for console errors
> 50  |     expect(consoleErrors, `Console errors encountered at ${width}px: ${consoleErrors.join(", ")}`).toEqual([]);
      |                                                                                                    ^ Error: Console errors encountered at 390px: Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 ()
  51  | 
  52  |     // 3. Check for hydration warnings
  53  |     expect(hydrationWarnings, `Hydration warnings encountered at ${width}px: ${hydrationWarnings.join(", ")}`).toEqual([]);
  54  | 
  55  |     // 4. Check for broken images
  56  |     const images = page.locator("img");
  57  |     const count = await images.count();
  58  |     for (let i = 0; i < count; i++) {
  59  |       const img = images.nth(i);
  60  |       const src = await img.getAttribute("src");
  61  |       const isLoaded = await img.evaluate((element: HTMLImageElement) => {
  62  |         return element.complete && element.naturalWidth > 0;
  63  |       });
  64  |       expect(isLoaded, `Image with src "${src}" failed to load correctly at ${width}px`).toBe(true);
  65  |     }
  66  | 
  67  |     // 5. Check for horizontal overflow scrolling
  68  |     const overflow = await page.evaluate(() => {
  69  |       return document.documentElement.scrollWidth > window.innerWidth;
  70  |     });
  71  |     expect(overflow, `Horizontal overflow scrolling detected at ${width}px`).toBe(false);
  72  | 
  73  |     // 6. Check for clipped text elements (overflow: hidden/clip causing cut-off text content)
  74  |     const clippedElements = await page.evaluate(() => {
  75  |       const results: string[] = [];
  76  |       const elements = Array.from(document.querySelectorAll('*'));
  77  |       
  78  |       for (const el of elements) {
  79  |         const style = window.getComputedStyle(el);
  80  |         const isHiddenX = style.overflowX === 'hidden' || style.overflowX === 'clip';
  81  |         const isHiddenY = style.overflowY === 'hidden' || style.overflowY === 'clip';
  82  |         
  83  |         if (!isHiddenX && !isHiddenY) continue;
  84  |         
  85  |         // Check if it has text node children with actual content
  86  |         const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== '');
  87  |         // Or check if it is a tag that usually contains inline text (like span, p, h1-6, button, etc.)
  88  |         const isTextContainer = ['p', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'label', 'li'].includes(el.tagName.toLowerCase());
  89  |         
  90  |         if (el instanceof HTMLElement && (textNodes.length > 0 || isTextContainer)) {
  91  |           if (isHiddenX && el.scrollWidth > el.clientWidth + 2) {
  92  |             results.push(
  93  |               `Horizontal clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
  94  |               `scrollWidth: ${el.scrollWidth}px, clientWidth: ${el.clientWidth}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
  95  |             );
  96  |           }
  97  |           if (isHiddenY && el.scrollHeight > el.clientHeight + 2) {
  98  |             const heightStyle = el.style.height || style.height;
  99  |             const maxHeightStyle = el.style.maxHeight || style.maxHeight;
  100 |             if (heightStyle !== 'auto' || maxHeightStyle !== 'none') {
  101 |               results.push(
  102 |                 `Vertical clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
  103 |                 `scrollHeight: ${el.scrollHeight}px, clientHeight: ${el.clientHeight}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
  104 |               );
  105 |             }
  106 |           }
  107 |         }
  108 |       }
  109 |       return results;
  110 |     });
  111 |     expect(clippedElements, `Clipped text elements detected at ${width}px:\n${clippedElements.join("\n")}`).toEqual([]);
  112 | 
  113 |     // 7. Capture screenshots of sections
  114 |     const screenshotsDir = `./tests/screenshots/${width}px`;
  115 |     if (!fs.existsSync(screenshotsDir)) {
  116 |       fs.mkdirSync(screenshotsDir, { recursive: true });
  117 |     }
  118 |     
  119 |     await page.locator("#hero").screenshot({ path: path.join(screenshotsDir, "hero.png") });
  120 |     await page.locator("#features").screenshot({ path: path.join(screenshotsDir, "features.png") });
  121 |     await page.locator("#faq").screenshot({ path: path.join(screenshotsDir, "faq.png") });
  122 |     await page.locator("footer").screenshot({ path: path.join(screenshotsDir, "footer.png") });
  123 |   });
  124 | }
  125 | 
```