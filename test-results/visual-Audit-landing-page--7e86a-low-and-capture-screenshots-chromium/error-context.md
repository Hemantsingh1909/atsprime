# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> Audit landing page for errors, overflow, and capture screenshots
- Location: tests/visual.spec.ts:3:5

# Error details

```
Error: Console errors encountered: Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 ()

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
      - navigation [ref=e10]:
        - link "Resume Builder" [ref=e11] [cursor=pointer]:
          - /url: /builder
        - link "How it Works" [ref=e12] [cursor=pointer]:
          - /url: /#how-it-works
        - link "FAQ" [ref=e13] [cursor=pointer]:
          - /url: /#faq
      - link "Create Account" [ref=e15] [cursor=pointer]:
        - /url: /login
        - button "Create Account" [ref=e16]
  - generic [ref=e23]:
    - generic [ref=e25]:
      - img [ref=e26]
      - text: AI-Powered Resume Optimization
    - heading "Stop rewriting your resume for every job." [level=1] [ref=e28]:
      - text: Stop rewriting
      - text: your resume
      - generic [ref=e29]: for every job.
    - paragraph [ref=e30]: Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
    - generic [ref=e31]:
      - link "Start Free" [ref=e32] [cursor=pointer]:
        - /url: /dashboard
        - text: Start Free
        - img [ref=e33]
      - link "Browse Templates" [ref=e35] [cursor=pointer]:
        - /url: /builder?view=gallery
        - img [ref=e36]
        - text: Browse Templates
    - generic [ref=e42]:
      - generic [ref=e43]:
        - img [ref=e45]
        - generic [ref=e48]: ATS Optimized
      - generic [ref=e49]:
        - img [ref=e51]
        - generic [ref=e53]: AI Powered
      - generic [ref=e54]:
        - img [ref=e56]
        - generic [ref=e59]: Free to Start
  - generic [ref=e61]:
    - generic [ref=e62]:
      - generic [ref=e63]: Workflow
      - heading "From job posting to interview-ready resume in under one minute." [level=2] [ref=e64]
      - paragraph [ref=e65]: ATSPrime removes the repetitive work of tailoring resumes so you can spend more time applying to the jobs that matter.
    - generic [ref=e66]:
      - generic [ref=e67]:
        - generic [ref=e68]:
          - img [ref=e70]
          - img [ref=e74]
        - generic [ref=e77]:
          - generic [ref=e78]: STEP 01
          - heading "Upload Your Resume" [level=3] [ref=e79]
          - paragraph [ref=e80]: Upload your existing PDF or DOCX resume. ATSPrime extracts your experience, education, projects, and skills automatically.
      - generic [ref=e81]:
        - generic [ref=e82]:
          - img [ref=e84]
          - img [ref=e88]
        - generic [ref=e91]:
          - generic [ref=e92]: STEP 02
          - heading "Paste the Job Description" [level=3] [ref=e93]
          - paragraph [ref=e94]: Paste the job description from LinkedIn, Indeed, Greenhouse, Lever, or any company career page.
      - generic [ref=e95]:
        - generic [ref=e96]:
          - img [ref=e98]
          - img [ref=e101]
        - generic [ref=e104]:
          - generic [ref=e105]: STEP 03
          - heading "AI Tailors Everything" [level=3] [ref=e106]
          - paragraph [ref=e107]: Our AI rewrites bullet points, improves achievements, adds ATS keywords, and generates a tailored professional summary.
      - generic [ref=e108]:
        - generic [ref=e109]:
          - img [ref=e111]
          - img [ref=e115]
        - generic [ref=e118]:
          - generic [ref=e119]: STEP 04
          - heading "ATS Optimization" [level=3] [ref=e120]
          - paragraph [ref=e121]: ATSPrime analyzes missing keywords, formatting, readability, and recruiter compatibility to maximize your ATS score.
      - generic [ref=e122]:
        - img [ref=e125]
        - generic [ref=e128]:
          - generic [ref=e129]: STEP 05
          - heading "Download & Apply" [level=3] [ref=e130]
          - paragraph [ref=e131]: Export your optimized resume as PDF or DOCX and apply with confidence in just a few clicks.
  - generic [ref=e133]:
    - generic [ref=e134]:
      - generic [ref=e135]: FAQ
      - heading "Questions? We've got answers." [level=2] [ref=e136]:
        - text: Questions?
        - text: We've got answers.
      - paragraph [ref=e137]: Everything you need to know before using ATSPrime.
    - generic [ref=e138]:
      - generic [ref=e139]:
        - button "Will ATSPrime rewrite my entire resume?" [expanded] [ref=e140]:
          - heading "Will ATSPrime rewrite my entire resume?" [level=3] [ref=e141]
          - img [ref=e143]
        - paragraph [ref=e148]: No. ATSPrime improves your existing resume by rewriting bullet points, optimizing ATS keywords, and tailoring it for each job while preserving your actual experience and achievements.
      - button "Will my resume pass Applicant Tracking Systems (ATS)?" [ref=e150]:
        - heading "Will my resume pass Applicant Tracking Systems (ATS)?" [level=3] [ref=e151]
        - img [ref=e153]
      - button "Can I tailor my resume for different companies?" [ref=e155]:
        - heading "Can I tailor my resume for different companies?" [level=3] [ref=e156]
        - img [ref=e158]
      - button "Do I need to upload my resume every time?" [ref=e160]:
        - heading "Do I need to upload my resume every time?" [level=3] [ref=e161]
        - img [ref=e163]
      - button "Which file formats are supported?" [ref=e165]:
        - heading "Which file formats are supported?" [level=3] [ref=e166]
        - img [ref=e168]
      - button "Is my resume data secure?" [ref=e170]:
        - heading "Is my resume data secure?" [level=3] [ref=e171]
        - img [ref=e173]
      - button "Can I cancel my subscription anytime?" [ref=e175]:
        - heading "Can I cancel my subscription anytime?" [level=3] [ref=e176]
        - img [ref=e178]
      - button "Is there a free plan available?" [ref=e180]:
        - heading "Is there a free plan available?" [level=3] [ref=e181]
        - img [ref=e183]
  - generic [ref=e188]:
    - generic [ref=e189]:
      - generic [ref=e190]:
        - img [ref=e191]
        - text: Ready to Apply
      - heading "Your next interview starts with a better resume." [level=2] [ref=e193]:
        - text: Your next interview
        - text: starts with
        - generic [ref=e194]: a better resume.
      - paragraph [ref=e195]: Upload your resume once. Tailor it for every application in seconds with AI-powered optimization and ATS analysis.
      - link "Start Free" [ref=e197] [cursor=pointer]:
        - /url: /dashboard
        - text: Start Free
        - img [ref=e198]
      - paragraph [ref=e200]: Tailor your resume for any role, instantly.
      - generic [ref=e201]:
        - img [ref=e202]
        - text: No credit card required
    - generic [ref=e205]:
      - generic [ref=e206]:
        - heading "Resume Score" [level=3] [ref=e207]
        - img [ref=e209]
      - generic [ref=e213]:
        - img [ref=e214]
        - generic [ref=e217]:
          - generic [ref=e218]: "94"
          - generic [ref=e219]: ATS Score
      - generic [ref=e220]: ✓ Optimized & Ready to Apply
  - contentinfo [ref=e221]:
    - generic [ref=e222]:
      - generic [ref=e223]:
        - generic [ref=e224]:
          - link "ATSPrime" [ref=e225] [cursor=pointer]:
            - /url: /
            - img [ref=e226]
            - generic [ref=e229]: ATSPrime
          - paragraph [ref=e230]:
            - text: Tailor every resume.
            - text: Land more interviews.
          - generic [ref=e231]:
            - link [ref=e232] [cursor=pointer]:
              - /url: https://x.com/atsprime
              - img [ref=e233]
            - link [ref=e235] [cursor=pointer]:
              - /url: https://linkedin.com/company/atsprime
              - img [ref=e236]
            - link [ref=e240] [cursor=pointer]:
              - /url: https://github.com/Hemantsingh1909/atsprime
              - img [ref=e241]
        - generic [ref=e244]:
          - heading "Product" [level=4] [ref=e245]
          - list [ref=e246]:
            - listitem [ref=e247]:
              - link "How It Works" [ref=e248] [cursor=pointer]:
                - /url: /#how-it-works
            - listitem [ref=e249]:
              - link "FAQ" [ref=e250] [cursor=pointer]:
                - /url: /#faq
        - generic [ref=e251]:
          - heading "Resources" [level=4] [ref=e252]
          - list [ref=e253]:
            - listitem [ref=e254]:
              - link "ATS Guide" [ref=e255] [cursor=pointer]:
                - /url: /ats-guide
            - listitem [ref=e256]:
              - link "Resume Templates" [ref=e257] [cursor=pointer]:
                - /url: /templates
            - listitem [ref=e258]:
              - link "Career Tips" [ref=e259] [cursor=pointer]:
                - /url: /career-tips
            - listitem [ref=e260]:
              - link "Blog" [ref=e261] [cursor=pointer]:
                - /url: /blog
        - generic [ref=e262]:
          - heading "Company" [level=4] [ref=e263]
          - list [ref=e264]:
            - listitem [ref=e265]:
              - link "About" [ref=e266] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e267]:
              - link "Contact" [ref=e268] [cursor=pointer]:
                - /url: /contact
            - listitem [ref=e269]:
              - link "Privacy" [ref=e270] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e271]:
              - link "Terms" [ref=e272] [cursor=pointer]:
                - /url: /terms
      - generic [ref=e273]:
        - generic [ref=e274]:
          - paragraph [ref=e275]: © 2026 ATSPrime. All rights reserved.
          - generic [ref=e281]: All systems operational
        - paragraph [ref=e282]:
          - text: 🚀 Building in Public • Follow our journey →
          - link "@atsprime" [ref=e283] [cursor=pointer]:
            - /url: https://github.com/Hemantsingh1909/resumeai
  - button "Open Next.js Dev Tools" [ref=e289] [cursor=pointer]:
    - img [ref=e290]
  - alert [ref=e293]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test("Audit landing page for errors, overflow, and capture screenshots", async ({ page }) => {
  4   |   const consoleErrors: string[] = [];
  5   |   const pageErrors: string[] = [];
  6   |   const hydrationWarnings: string[] = [];
  7   | 
  8   |   // Listen for console and page errors
  9   |   page.on("console", (msg) => {
  10  |     const text = msg.text();
  11  |     if (msg.type() === "error") {
  12  |       consoleErrors.push(text);
  13  |     }
  14  |     if (text.toLowerCase().includes("hydration")) {
  15  |       hydrationWarnings.push(text);
  16  |     }
  17  |   });
  18  | 
  19  |   page.on("pageerror", (err) => {
  20  |     pageErrors.push(err.message);
  21  |   });
  22  | 
  23  |   // Navigate to home page
  24  |   await page.goto("/");
  25  |   await page.waitForLoadState("load");
  26  | 
  27  |   // Scroll through the page to trigger lazy animations and ensure everything renders
  28  |   await page.evaluate(() => {
  29  |     window.scrollTo(0, document.body.scrollHeight);
  30  |   });
  31  |   await page.waitForTimeout(500);
  32  |   await page.evaluate(() => {
  33  |     window.scrollTo(0, 0);
  34  |   });
  35  |   await page.waitForTimeout(500);
  36  | 
  37  |   // 1. Check for page/javascript errors
  38  |   expect(pageErrors, `Page JS errors encountered: ${pageErrors.join(", ")}`).toEqual([]);
  39  | 
  40  |   // 2. Check for console errors
> 41  |   expect(consoleErrors, `Console errors encountered: ${consoleErrors.join(", ")}`).toEqual([]);
      |                                                                                    ^ Error: Console errors encountered: Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 (), Failed to load resource: the server responded with a status of 400 ()
  42  | 
  43  |   // 3. Check for hydration warnings
  44  |   expect(hydrationWarnings, `Hydration warnings encountered: ${hydrationWarnings.join(", ")}`).toEqual([]);
  45  | 
  46  |   // 4. Check for broken images
  47  |   const images = page.locator("img");
  48  |   const count = await images.count();
  49  |   for (let i = 0; i < count; i++) {
  50  |     const img = images.nth(i);
  51  |     const src = await img.getAttribute("src");
  52  |     const isLoaded = await img.evaluate((element: HTMLImageElement) => {
  53  |       return element.complete && element.naturalWidth > 0;
  54  |     });
  55  |     expect(isLoaded, `Image with src "${src}" failed to load correctly`).toBe(true);
  56  |   }
  57  | 
  58  |   // 5. Check for horizontal overflow scrolling
  59  |   const overflow = await page.evaluate(() => {
  60  |     return document.documentElement.scrollWidth > window.innerWidth;
  61  |   });
  62  |   expect(overflow, "Horizontal overflow scrolling detected").toBe(false);
  63  | 
  64  |   // 6. Check for clipped text elements (overflow: hidden/clip causing cut-off text content)
  65  |   const clippedElements = await page.evaluate(() => {
  66  |     const results: string[] = [];
  67  |     const elements = Array.from(document.querySelectorAll('*'));
  68  |     
  69  |     for (const el of elements) {
  70  |       const style = window.getComputedStyle(el);
  71  |       const isHiddenX = style.overflowX === 'hidden' || style.overflowX === 'clip';
  72  |       const isHiddenY = style.overflowY === 'hidden' || style.overflowY === 'clip';
  73  |       
  74  |       if (!isHiddenX && !isHiddenY) continue;
  75  |       
  76  |       // Check if it has text node children with actual content
  77  |       const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== '');
  78  |       // Or check if it is a tag that usually contains inline text (like span, p, h1-6, button, etc.)
  79  |       const isTextContainer = ['p', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'label', 'li'].includes(el.tagName.toLowerCase());
  80  |       
  81  |       if (el instanceof HTMLElement && (textNodes.length > 0 || isTextContainer)) {
  82  |         if (isHiddenX && el.scrollWidth > el.clientWidth + 2) {
  83  |           results.push(
  84  |             `Horizontal clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
  85  |             `scrollWidth: ${el.scrollWidth}px, clientWidth: ${el.clientWidth}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
  86  |           );
  87  |         }
  88  |         if (isHiddenY && el.scrollHeight > el.clientHeight + 2) {
  89  |           // Check if it has a height limit that causes overflow
  90  |           const heightStyle = el.style.height || style.height;
  91  |           const maxHeightStyle = el.style.maxHeight || style.maxHeight;
  92  |           if (heightStyle !== 'auto' || maxHeightStyle !== 'none') {
  93  |             results.push(
  94  |               `Vertical clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
  95  |               `scrollHeight: ${el.scrollHeight}px, clientHeight: ${el.clientHeight}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
  96  |             );
  97  |           }
  98  |         }
  99  |       }
  100 |     }
  101 |     return results;
  102 |   });
  103 |   expect(clippedElements, `Clipped text elements detected:\n${clippedElements.join("\n")}`).toEqual([]);
  104 | 
  105 |   // 7. Capture screenshots of sections
  106 |   const screenshotsDir = "./tests/screenshots";
  107 |   
  108 |   await page.locator("#hero").screenshot({ path: `${screenshotsDir}/hero.png` });
  109 |   await page.locator("#features").screenshot({ path: `${screenshotsDir}/features.png` });
  110 |   await page.locator("#faq").screenshot({ path: `${screenshotsDir}/faq.png` });
  111 |   await page.locator("footer").screenshot({ path: `${screenshotsDir}/footer.png` });
  112 | });
  113 | 
```