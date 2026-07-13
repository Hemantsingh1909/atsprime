import { test, expect } from "@playwright/test";

test("Resume template selection and download flow", async ({ page }) => {
  test.setTimeout(300000);
  // 1. Navigate to dashboard page via login redirect
  await page.goto("http://localhost:3000/login?mock_auth=true&redirect=/dashboard");
  await page.waitForLoadState("load");

  // 2. We should see the auth modal. Sign up with a random email to ensure a fresh session.
  const randomEmail = `user_${Math.random().toString(36).substring(2, 11)}@dev.io`;
  
  await page.fill('#name-input', "Test User");
  await page.fill('input[type="email"]', randomEmail);
  await page.fill('input[type="password"]', "Password123");
  await page.fill('#confirm-password-input', "Password123");
  await page.click('button[type="submit"]');

  // Wait for the redirect directly to the dashboard
  await page.waitForURL((url) => url.pathname === "/dashboard");
  await page.waitForLoadState("load");

  // Wait for the auth transition to finish and see STEP 01
  await page.waitForSelector("text=STEP 01", { timeout: 10000 });
  await expect(page.locator("text=Upload your base resume")).toBeVisible();

  // 3. Click Use Sample Resume
  await page.click('button:has-text("Use our sample resume")');
  
  // Verify sample file loaded
  await expect(page.locator("text=Alex_Rivera_Frontend_Engineer.pdf")).toBeVisible();

  // 4. Click Continue to Job Description
  await page.click('button:has-text("Continue to Job Description")');

  // Verify we are at STEP 02
  await page.waitForSelector("text=STEP 02", { timeout: 5000 });
  await expect(page.locator("text=Paste the Target Job")).toBeVisible();

  // 5. Load Sample Job
  await page.click('button:has-text("Load Sample Job")');

  // Verify text area is populated
  const jobText = await page.locator("textarea").inputValue();
  expect(jobText).toContain("Senior Frontend Engineer");

  // 6. Click Optimize & Tailor Resume
  await page.click('button:has-text("Optimize Resume")');

  // Verify STEP 03 analysis starts
  await page.waitForSelector("text=TAILORING ENGINE", { timeout: 5000 });
  
  // 7. Wait for step 4 Results (timeout 60 seconds to allow mock progress + API call to finish)
  // Note: the mock uses process.env.GEMINI_API_KEY, but since the test runs against the local server, 
  // we wait for it to return candidates or fallback.
  await page.waitForSelector("text=Tailored Resume Ready", { timeout: 240000 });
  
  // Verify ATS Score is displayed
  await expect(page.locator("text=ATS Score Compatibility")).toBeVisible();

  // 8. Open inline Template Selection Tab by clicking the header button
  await page.click('button:has-text("Template & PDF")');

  // Verify the visual layout preview container is visible
  await page.waitForSelector("text=Visual Layout Preview", { timeout: 5000 });
  await expect(page.locator("text=Visual Layout Preview")).toBeVisible();

  // 9. Verify the preview iframe is visible
  const previewIframe = page.locator("#resume-preview-iframe");
  await expect(previewIframe).toBeVisible();

  // 10. Verify all 6 templates are rendered in the sidebar list
  const templates = [
    "Classic Harvard",
    "Modern Tech",
    "Elegant Minimalist",
    "Split Sidebar",
    "Creative Slate",
    "Executive Bold"
  ];
  for (const tpl of templates) {
    await expect(page.locator(`text=${tpl}`)).toBeVisible();
  }

  // 11. Select 'Modern Tech' template
  await page.click('text=Modern Tech');
  
  // 12. Trigger PDF download and capture it (button text is "Download PDF" inside the tab view)
  const [downloadPdf] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PDF", exact: true }).first().click()
  ]);

  const pdfFilename = downloadPdf.suggestedFilename();
  expect(pdfFilename).toContain("Modern");
  expect(pdfFilename.endsWith(".pdf")).toBe(true);

  // 13. Verify the inline view remains visible upon successful download
  await expect(page.locator("text=Visual Layout Preview")).toBeVisible();
});
