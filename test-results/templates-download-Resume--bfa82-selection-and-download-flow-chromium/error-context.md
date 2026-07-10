# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: templates-download.spec.ts >> Resume template selection and download flow
- Location: tests/templates-download.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Upload your base resume.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Upload your base resume.')

```

```yaml
- alert
- banner:
  - link "ATSPrime SANDBOX":
    - /url: /
    - img
    - text: ATSPrime SANDBOX
  - text: 01. Upload
  - img
  - text: 02. Job Description
  - img
  - text: 03. Analysis
  - img
  - text: 04. Results
  - button "u Test User":
    - text: u Test User
    - img
- main:
  - text: Step 01
  - heading "Upload your base resume" [level=1]
  - paragraph: Our AI extracts your experiences to match job requirements.
  - img
  - paragraph: Drag and drop your resume
  - paragraph: PDF, DOCX, or TXT (max 5MB)
  - paragraph:
    - text: No resume on hand?
    - button "Use our sample resume"
- contentinfo:
  - paragraph: © 2026 ATSPrime Sandbox. All rights reserved.
  - link "Home":
    - /url: /
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test("Resume template selection and download flow", async ({ page }) => {
  4   |   test.setTimeout(300000);
  5   |   // 1. Navigate to dashboard page via login redirect
  6   |   await page.goto("http://localhost:3000/login?mock_auth=true&redirect=/dashboard");
  7   |   await page.waitForLoadState("load");
  8   | 
  9   |   // 2. We should see the auth modal. Sign up with a random email to ensure a fresh session.
  10  |   const randomEmail = `user_${Math.random().toString(36).substring(2, 11)}@dev.io`;
  11  |   
  12  |   await page.fill('#name-input', "Test User");
  13  |   await page.fill('input[type="email"]', randomEmail);
  14  |   await page.fill('input[type="password"]', "Password123");
  15  |   await page.fill('#confirm-password-input', "Password123");
  16  |   await page.click('button[type="submit"]');
  17  | 
  18  |   // Wait for the redirect directly to the dashboard
  19  |   await page.waitForURL((url) => url.pathname === "/dashboard");
  20  |   await page.waitForLoadState("load");
  21  | 
  22  |   // Wait for the auth transition to finish and see STEP 01
  23  |   await page.waitForSelector("text=STEP 01", { timeout: 10000 });
> 24  |   await expect(page.locator("text=Upload your base resume.")).toBeVisible();
      |                                                               ^ Error: expect(locator).toBeVisible() failed
  25  | 
  26  |   // 3. Click Use Sample Resume
  27  |   await page.click('button:has-text("Use Sample Resume")');
  28  |   
  29  |   // Verify sample file loaded
  30  |   await expect(page.locator("text=Alex_Rivera_Frontend_Engineer.pdf")).toBeVisible();
  31  | 
  32  |   // 4. Click Continue to Job Description
  33  |   await page.click('button:has-text("Continue to Job Description")');
  34  | 
  35  |   // Verify we are at STEP 02
  36  |   await page.waitForSelector("text=STEP 02", { timeout: 5000 });
  37  |   await expect(page.locator("text=Paste the Target Job.")).toBeVisible();
  38  | 
  39  |   // 5. Load Sample Job
  40  |   await page.click('button:has-text("Load Sample Job")');
  41  | 
  42  |   // Verify text area is populated
  43  |   const jobText = await page.locator("textarea").inputValue();
  44  |   expect(jobText).toContain("Senior Frontend Engineer");
  45  | 
  46  |   // 6. Click Optimize & Tailor Resume
  47  |   await page.click('button:has-text("Optimize & Tailor Resume")');
  48  | 
  49  |   // Verify STEP 03 analysis starts
  50  |   await page.waitForSelector("text=TAILORING ENGINE", { timeout: 5000 });
  51  |   
  52  |   // 7. Wait for step 4 Results (timeout 60 seconds to allow mock progress + API call to finish)
  53  |   // Note: the mock uses process.env.GEMINI_API_KEY, but since the test runs against the local server, 
  54  |   // we wait for it to return candidates or fallback.
  55  |   await page.waitForSelector("text=Tailored Resume Ready.", { timeout: 240000 });
  56  |   
  57  |   // Verify ATS Score is displayed
  58  |   await expect(page.locator("text=ATS Match Score Comparison")).toBeVisible();
  59  | 
  60  |   // 8. Open inline Template Selection Tab by clicking the header button
  61  |   await page.click('button:has-text("Download PDF / Preview")');
  62  | 
  63  |   // Verify the visual layout preview container is visible
  64  |   await page.waitForSelector("text=Visual Layout Preview", { timeout: 5000 });
  65  |   await expect(page.locator("text=Visual Layout Preview")).toBeVisible();
  66  | 
  67  |   // 9. Verify the preview iframe is visible
  68  |   const previewIframe = page.locator("#resume-preview-iframe");
  69  |   await expect(previewIframe).toBeVisible();
  70  | 
  71  |   // 10. Verify all 6 templates are rendered in the sidebar list
  72  |   const templates = [
  73  |     "Classic Harvard",
  74  |     "Modern Tech",
  75  |     "Elegant Minimalist",
  76  |     "Split Sidebar",
  77  |     "Creative Slate",
  78  |     "Executive Bold"
  79  |   ];
  80  |   for (const tpl of templates) {
  81  |     await expect(page.locator(`text=${tpl}`)).toBeVisible();
  82  |   }
  83  | 
  84  |   // 11. Select 'Modern Tech' template
  85  |   await page.click('text=Modern Tech');
  86  |   
  87  |   // 12. Trigger PDF download and capture it (button text is "Download PDF" inside the tab view)
  88  |   const [downloadPdf] = await Promise.all([
  89  |     page.waitForEvent("download"),
  90  |     page.getByRole("button", { name: "Download PDF", exact: true }).click()
  91  |   ]);
  92  | 
  93  |   const pdfFilename = downloadPdf.suggestedFilename();
  94  |   expect(pdfFilename).toContain("Modern");
  95  |   expect(pdfFilename.endsWith(".pdf")).toBe(true);
  96  | 
  97  |   // 13. Verify the inline view remains visible upon successful download
  98  |   await expect(page.locator("text=Visual Layout Preview")).toBeVisible();
  99  | });
  100 | 
```