# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verification.spec.ts >> Verify Sentry and PostHog initialization
- Location: tests/verification.spec.ts:3:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "ATSPrime SANDBOX" [ref=e6] [cursor=pointer]:
          - /url: /
          - img [ref=e7]
          - generic [ref=e10]:
            - text: ATSPrime
            - generic [ref=e11]: SANDBOX
        - generic [ref=e12]:
          - generic [ref=e13]: 01. Upload
          - img [ref=e14]
          - generic [ref=e16]: 02. Job Description
          - img [ref=e17]
          - generic [ref=e19]: 03. Analysis
          - img [ref=e20]
          - generic [ref=e22]: 04. Results
    - main [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - text: Step 01
          - heading "Upload your base resume" [level=1] [ref=e26]
          - paragraph [ref=e27]: Our AI extracts your experiences to match job requirements.
        - generic [ref=e30] [cursor=pointer]:
          - img [ref=e32]
          - generic [ref=e35]:
            - paragraph [ref=e36]: Drag and drop your resume
            - paragraph [ref=e37]: PDF, DOCX, or TXT (max 5MB)
        - paragraph [ref=e38]:
          - text: No resume on hand?
          - button "Use our sample resume" [ref=e39] [cursor=pointer]
    - contentinfo [ref=e40]:
      - generic [ref=e41]:
        - paragraph [ref=e42]: © 2026 ATSPrime Sandbox. All rights reserved.
        - link "Home" [ref=e44] [cursor=pointer]:
          - /url: /
  - button "Open Next.js Dev Tools" [ref=e50] [cursor=pointer]:
    - img [ref=e51]
  - alert [ref=e54]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Verify Sentry and PostHog initialization", async ({ page }) => {
  4  |   const consoleLogs: string[] = [];
  5  |   page.on("console", (msg) => {
  6  |     consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  7  |   });
  8  | 
  9  |   await page.goto("http://localhost:3000/dashboard?mock_auth=true");
  10 |   await page.waitForLoadState("load");
  11 | 
  12 |   // 1. Verify that Sentry SDK is loaded and initialized (window.__SENTRY__ exists)
  13 |   const isSentryInitialized = await page.evaluate(() => {
  14 |     return typeof (window as unknown as Record<string, unknown>).__SENTRY__ !== "undefined";
  15 |   });
  16 | 
  17 |   // 2. Verify that PostHog key is loaded on the client side
  18 |   const phKey = await page.evaluate(() => {
  19 |     return (window as unknown as Record<string, unknown>).__POSTHOG_KEY__;
  20 |   });
  21 | 
  22 |   // 3. Verify that PostHog itself did not initialize in testing environment
  23 |   const isPostHogInitialized = await page.evaluate(() => {
  24 |     return typeof (window as unknown as Record<string, unknown>).posthog !== "undefined";
  25 |   });
  26 | 
  27 |   console.log("=== Verification Results ===");
  28 |   console.log("Browser console logs during load:");
  29 |   consoleLogs.forEach(log => console.log(log));
  30 |   console.log("Sentry Initialized:", isSentryInitialized);
  31 |   console.log("PostHog Key:", phKey);
  32 |   console.log("PostHog Initialized in test:", isPostHogInitialized);
  33 |   console.log("===========================");
  34 | 
> 35 |   expect(isSentryInitialized).toBe(true);
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  36 |   expect(phKey).toBeDefined();
  37 |   expect(isPostHogInitialized).toBe(false);
  38 | });
  39 | 
  40 | 
```