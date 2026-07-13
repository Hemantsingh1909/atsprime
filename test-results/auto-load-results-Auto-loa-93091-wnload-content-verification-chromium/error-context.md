# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auto-load-results.spec.ts >> Auto-load saved resume redirect to Step 4 and template download content verification
- Location: tests/auto-load-results.spec.ts:3:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 240000ms exceeded.
Call log:
  - waiting for locator('text=Tailored Resume Ready') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - banner [ref=e14]:
      - generic [ref=e15]:
        - link "ATSPrime SANDBOX" [ref=e16] [cursor=pointer]:
          - /url: /
          - img [ref=e17]
          - generic [ref=e20]:
            - text: ATSPrime
            - generic [ref=e21]: SANDBOX
        - generic [ref=e22]:
          - generic [ref=e23]: 01. Upload
          - img [ref=e24]
          - generic [ref=e26]: 02. Job Description
          - img [ref=e27]
          - generic [ref=e29]: 03. Analysis
          - img [ref=e30]
          - generic [ref=e32]: 04. Results
        - button "u Test Redirect User" [ref=e35] [cursor=pointer]:
          - generic [ref=e36]: u
          - generic [ref=e37]: Test Redirect User
          - img [ref=e38]
    - generic [ref=e41]:
      - complementary [ref=e42]:
        - navigation [ref=e43]:
          - button "Dashboard" [ref=e44] [cursor=pointer]:
            - img [ref=e45]
            - text: Dashboard
          - button "Results" [ref=e50] [cursor=pointer]:
            - img [ref=e51]
            - text: Results
          - button "Resume Editor" [ref=e54] [cursor=pointer]:
            - img [ref=e55]
            - text: Resume Editor
          - button "AI Review" [ref=e60] [cursor=pointer]:
            - img [ref=e61]
            - text: AI Review
          - button "Cover Letter" [ref=e64] [cursor=pointer]:
            - img [ref=e65]
            - text: Cover Letter
          - button "Job Match" [ref=e67] [cursor=pointer]:
            - img [ref=e68]
            - text: Job Match
        - generic [ref=e71]:
          - generic [ref=e72]:
            - img [ref=e73]
            - generic [ref=e74]: ATS Score
          - img [ref=e76]:
            - generic [ref=e79]: "93"
            - generic [ref=e80]: "%"
          - generic [ref=e82]:
            - img [ref=e83]
            - text: Excellent Match
          - generic [ref=e86]:
            - paragraph [ref=e87]: +22% vs original
            - paragraph [ref=e88]: Good job! Your resume is well optimized for ATS.
          - paragraph [ref=e89]: Score Breakdown
          - generic [ref=e90]:
            - generic [ref=e92]:
              - generic [ref=e93]: Format & Structure
              - generic [ref=e94]: 96%
            - generic [ref=e98]:
              - generic [ref=e99]: Keywords
              - generic [ref=e100]: 91%
            - generic [ref=e104]:
              - generic [ref=e105]: Content Relevance
              - generic [ref=e106]: 90%
            - generic [ref=e110]:
              - generic [ref=e111]: Experience
              - generic [ref=e112]: 89%
            - generic [ref=e116]:
              - generic [ref=e117]: Skills
              - generic [ref=e118]: 94%
        - generic [ref=e121]:
          - generic [ref=e122]:
            - img [ref=e123]
            - generic [ref=e127]: Keywords
          - generic [ref=e128]:
            - generic [ref=e129]: Matched (15)
            - generic [ref=e130]:
              - generic [ref=e131]: React
              - generic [ref=e132]: JavaScript
              - generic [ref=e133]: HTML
              - generic [ref=e134]: CSS
              - generic [ref=e135]: TypeScript
              - generic [ref=e136]: Tailwind CSS
              - generic [ref=e137]: API contracts
              - generic [ref=e138]: RESTful
              - generic [ref=e139]: +7 more
          - generic [ref=e140]:
            - generic [ref=e141]: AI Inserted (6)
            - generic [ref=e142]:
              - generic [ref=e143]: +Next.js
              - generic [ref=e144]: +Tailwind CSS
              - generic [ref=e145]: +Core Web Vitals
              - generic [ref=e146]: +LCP
              - generic [ref=e147]: +Accessibility
              - generic [ref=e148]: +a11y
        - generic [ref=e149]:
          - button "Help & Support" [ref=e150] [cursor=pointer]:
            - img [ref=e151]
            - text: Help & Support
          - button "Sign out" [ref=e154] [cursor=pointer]:
            - img [ref=e155]
            - text: Sign out
      - generic [ref=e158]:
        - generic [ref=e159]:
          - generic [ref=e160]:
            - img [ref=e161]
            - text: Saved to profile
          - generic [ref=e164]:
            - generic [ref=e165]:
              - heading "Your Tailored Resume is Ready" [level=1] [ref=e166]
              - paragraph [ref=e167]: We've optimized your resume for the given job description.
            - generic [ref=e168]:
              - button "Back to Editor" [ref=e169] [cursor=pointer]:
                - img [ref=e170]
                - text: Back to Editor
              - button "Start Over" [ref=e172] [cursor=pointer]:
                - img [ref=e173]
                - text: Start Over
              - generic [ref=e178]:
                - button "Download PDF" [ref=e179] [cursor=pointer]:
                  - img [ref=e180]
                  - text: Download PDF
                - button [ref=e183] [cursor=pointer]:
                  - img [ref=e184]
          - generic [ref=e186]:
            - button "Preview" [ref=e187] [cursor=pointer]
            - button "Template" [ref=e188] [cursor=pointer]
            - button "Sections" [ref=e189] [cursor=pointer]
            - button "AI Enhancements" [ref=e190] [cursor=pointer]
        - generic [ref=e192]:
          - generic [ref=e193]:
            - generic [ref=e194]:
              - generic [ref=e195]: "Template:"
              - generic [ref=e196]:
                - combobox [ref=e197] [cursor=pointer]:
                  - option "Classic Harvard"
                  - option "Modern Tech" [selected]
                  - option "Elegant Minimalist"
                  - option "Split Sidebar"
                  - option "Creative Slate"
                  - option "Executive Bold"
                - img
            - generic [ref=e198]:
              - generic [ref=e199]:
                - button [ref=e200] [cursor=pointer]:
                  - img [ref=e201]
                - button [ref=e203] [cursor=pointer]:
                  - img [ref=e204]
              - button "Full Screen" [ref=e206] [cursor=pointer]:
                - img [ref=e207]
                - text: Full Screen
          - iframe [ref=e213]:
            - generic [active] [ref=f1e1]:
              - heading "Alex Rivera" [level=1] [ref=f1e2]
              - generic [ref=f1e3]: alex.rivera@dev.io | +1 (555) 019-2834 | San Francisco, CA
              - heading "Summary" [level=2] [ref=f1e4]
              - paragraph [ref=f1e6]: Results-oriented professional with a proven track record of success.
              - heading "Experience" [level=2] [ref=f1e7]
              - generic [ref=f1e8]:
                - generic [ref=f1e9]: Frontend Developer | TechCorp (2024 - Present)
                - list [ref=f1e10]:
                  - listitem [ref=f1e11]: Designed and engineered 25+ reusable React & TypeScript components using Tailwind CSS, boosting codebase modularity and reducing rendering times.
                  - listitem [ref=f1e12]: Spearheaded Core Web Vitals audits and bundle-splitting optimizations, reducing Largest Contentful Paint (LCP) by 1.2s and improving SEO indexing scores.
                  - listitem [ref=f1e13]: Partnered with backend engineers to architect RESTful/GraphQL API contracts, ensuring seamless, type-safe data integration across 12+ dashboard views.
                  - listitem [ref=f1e14]: Conducted accessibility (a11y) audits and resolved critical responsive layout bugs, ensuring compliance with WCAG AAA standards across all viewports.
                - generic [ref=f1e15]: Software Engineer Intern | CodeLabs (2023)
                - list [ref=f1e16]:
                  - listitem [ref=f1e17]: Wrote JavaScript and HTML/CSS code for marketing pages.
                  - listitem [ref=f1e18]: Worked on user feedback issues and resolved styling bugs.
              - heading "Education" [level=2] [ref=f1e19]
              - generic [ref=f1e21]: B.S. in Computer Science | University of California
              - heading "Skills & Technologies" [level=2] [ref=f1e22]
              - paragraph [ref=f1e24]: React, Next.js, TypeScript, JavaScript, CSS, HTML
        - generic [ref=e214]:
          - paragraph [ref=e215]: Choose Template
          - generic [ref=e216]:
            - button "Classic Harvard" [ref=e217] [cursor=pointer]:
              - generic [ref=e231]: Classic Harvard
            - button "Modern Tech" [ref=e232] [cursor=pointer]:
              - img [ref=e247]
              - generic [ref=e249]: Modern Tech
            - button "Elegant Minimalist" [ref=e250] [cursor=pointer]:
              - generic [ref=e264]: Elegant Minimalist
            - button "Split Sidebar" [ref=e265] [cursor=pointer]:
              - generic [ref=e279]: Split Sidebar
            - button "Creative Slate" [ref=e280] [cursor=pointer]:
              - generic [ref=e294]: Creative Slate
            - button "Executive Bold" [ref=e295] [cursor=pointer]:
              - generic [ref=e309]: Executive Bold
            - button "View All Templates" [ref=e310] [cursor=pointer]:
              - img [ref=e312]
              - generic [ref=e317]: View All Templates
      - complementary [ref=e318]:
        - generic [ref=e319]:
          - button "Analysis" [ref=e320] [cursor=pointer]
          - button "AI Review" [ref=e321] [cursor=pointer]
        - generic [ref=e322]:
          - generic [ref=e323]:
            - generic [ref=e324]:
              - generic [ref=e325]:
                - img [ref=e326]
                - generic [ref=e330]: Job Match
              - generic [ref=e331]: Highly Relevant
            - generic [ref=e332]:
              - generic [ref=e333]: "93"
              - generic [ref=e334]: "%"
              - img [ref=e336]
            - paragraph [ref=e339]: Your resume is highly relevant to this job description. You match most of the key requirements.
            - paragraph [ref=e340]: Top Matched Skills
            - generic [ref=e341]:
              - generic [ref=e342]:
                - img [ref=e343]
                - generic [ref=e345]: React
              - generic [ref=e346]:
                - img [ref=e347]
                - generic [ref=e349]: JavaScript
              - generic [ref=e350]:
                - img [ref=e351]
                - generic [ref=e353]: HTML
              - generic [ref=e354]:
                - img [ref=e355]
                - generic [ref=e357]: CSS
              - generic [ref=e358]:
                - img [ref=e359]
                - generic [ref=e361]: TypeScript
              - button "+10 more" [ref=e362] [cursor=pointer]
          - generic [ref=e363]:
            - generic [ref=e364]:
              - generic [ref=e365]:
                - img [ref=e366]
                - generic [ref=e368]: Improvement Suggestions
              - generic [ref=e369]:
                - generic [ref=e370]: "5"
                - img [ref=e371]
            - generic [ref=e373]:
              - generic [ref=e374]:
                - img [ref=e375]
                - generic [ref=e378]: Add more quantifiable achievements
              - generic [ref=e379]:
                - img [ref=e380]
                - generic [ref=e383]: Include more metrics in experience
              - generic [ref=e384]:
                - img [ref=e385]
                - generic [ref=e388]: Consider adding certifications
              - generic [ref=e389]:
                - img [ref=e390]
                - generic [ref=e393]: Enhance your summary section
              - generic [ref=e394]:
                - img [ref=e395]
                - generic [ref=e398]: Add technical projects
            - button "Apply All Suggestions" [ref=e399] [cursor=pointer]:
              - text: Apply All Suggestions
              - img [ref=e400]
          - generic [ref=e402]:
            - generic [ref=e403]:
              - img [ref=e404]
              - generic [ref=e407]: Unlock Premium Templates
            - paragraph [ref=e408]: Access 15+ premium templates and advanced customization options.
            - button "Upgrade Now" [ref=e409] [cursor=pointer]:
              - img [ref=e410]
              - text: Upgrade Now
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Auto-load saved resume redirect to Step 4 and template download content verification", async ({ page }) => {
  4  |   test.setTimeout(300000);
  5  | 
  6  |   // 1. Navigate to dashboard page via login redirect to register a new user
  7  |   await page.goto("http://localhost:3000/login?mock_auth=true&redirect=/dashboard");
  8  |   await page.waitForLoadState("load");
  9  | 
  10 |   const randomEmail = `user_${Math.random().toString(36).substring(2, 11)}@dev.io`;
  11 |   
  12 |   await page.fill('#name-input', "Test Redirect User");
  13 |   await page.fill('input[type="email"]', randomEmail);
  14 |   await page.fill('input[type="password"]', "Password123");
  15 |   await page.fill('#confirm-password-input', "Password123");
  16 |   await page.click('button[type="submit"]');
  17 | 
  18 |   // Wait for redirect to dashboard
  19 |   await page.waitForURL((url) => url.pathname === "/dashboard");
  20 |   await page.waitForLoadState("load");
  21 | 
  22 |   // Wait for Step 1
  23 |   await page.waitForSelector("text=STEP 01", { timeout: 10000 });
  24 |   await expect(page.locator("text=Upload your base resume")).toBeVisible();
  25 | 
  26 |   // Click Use our sample resume
  27 |   await page.click('button:has-text("Use our sample resume")');
  28 |   await expect(page.locator("text=Alex_Rivera_Frontend_Engineer.pdf")).toBeVisible();
  29 | 
  30 |   // Click Continue to Job Description
  31 |   await page.click('button:has-text("Continue to Job Description")');
  32 |   await page.waitForSelector("text=STEP 02", { timeout: 5000 });
  33 | 
  34 |   // Load Sample Job
  35 |   await page.click('button:has-text("Load Sample Job")');
  36 |   const jobText = await page.locator("textarea").inputValue();
  37 |   expect(jobText).toContain("Senior Frontend Engineer");
  38 | 
  39 |   // Optimize & Tailor Resume
  40 |   await page.click('button:has-text("Optimize Resume")');
  41 | 
  42 |   // Wait for step 4 Results
> 43 |   await page.waitForSelector("text=Tailored Resume Ready", { timeout: 240000 });
     |              ^ TimeoutError: page.waitForSelector: Timeout 240000ms exceeded.
  44 |   await expect(page.locator("text=ATS Score Compatibility")).toBeVisible();
  45 | 
  46 |   // Wait for auto-save to register
  47 |   await page.waitForTimeout(3000);
  48 | 
  49 |   // 2. Clear sessionStorage to test direct fresh login / page load navigation
  50 |   await page.evaluate(() => {
  51 |     sessionStorage.clear();
  52 |   });
  53 | 
  54 |   // Navigate to /dashboard again
  55 |   await page.goto("http://localhost:3000/dashboard?mock_auth=true");
  56 |   await page.waitForLoadState("load");
  57 | 
  58 |   // Verify that it bypasses Step 1/2/3 and loads straight into Step 4 Results
  59 |   await page.waitForSelector("text=Tailored Resume Ready", { timeout: 20000 });
  60 |   await expect(page.locator("text=ATS Score Compatibility")).toBeVisible();
  61 | 
  62 |   // Open template tab
  63 |   await page.click('button:has-text("Template & PDF")');
  64 |   await page.waitForSelector("text=Visual Layout Preview", { timeout: 5000 });
  65 | 
  66 |   // Select Modern Tech template
  67 |   await page.click('text=Modern Tech');
  68 | 
  69 |   // Download PDF and assert file characteristics
  70 |   const [downloadPdf] = await Promise.all([
  71 |     page.waitForEvent("download"),
  72 |     page.getByRole("button", { name: "Download PDF", exact: true }).first().click()
  73 |   ]);
  74 | 
  75 |   const pdfFilename = downloadPdf.suggestedFilename();
  76 |   expect(pdfFilename).toContain("Modern");
  77 |   expect(pdfFilename.endsWith(".pdf")).toBe(true);
  78 | });
  79 | 
```