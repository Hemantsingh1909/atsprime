import { test, expect } from "@playwright/test";

test("Auto-load saved resume redirect to Step 4 and template download content verification", async ({ page }) => {
  test.setTimeout(300000);

  // 1. Navigate to dashboard page via login redirect to register a new user
  await page.goto("http://localhost:3000/login?mock_auth=true&redirect=/dashboard");
  await page.waitForLoadState("load");

  const randomEmail = `user_${Math.random().toString(36).substring(2, 11)}@dev.io`;
  
  await page.fill('#name-input', "Test Redirect User");
  await page.fill('input[type="email"]', randomEmail);
  await page.fill('input[type="password"]', "Password123");
  await page.fill('#confirm-password-input', "Password123");
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL((url) => url.pathname === "/dashboard");
  await page.waitForLoadState("load");

  // Wait for Step 1
  await page.waitForSelector("text=STEP 01", { timeout: 10000 });
  await expect(page.locator("text=Upload your base resume")).toBeVisible();

  // Click Use our sample resume
  await page.click('button:has-text("Use our sample resume")');
  await expect(page.locator("text=Alex_Rivera_Frontend_Engineer.pdf")).toBeVisible();

  // Click Continue to Job Description
  await page.click('button:has-text("Continue to Job Description")');
  await page.waitForSelector("text=STEP 02", { timeout: 5000 });

  // Load Sample Job
  await page.click('button:has-text("Load Sample Job")');
  const jobText = await page.locator("textarea").inputValue();
  expect(jobText).toContain("Senior Frontend Engineer");

  // Optimize & Tailor Resume
  await page.click('button:has-text("Optimize Resume")');

  // Wait for step 4 Results
  await page.waitForSelector("text=Tailored Resume Ready", { timeout: 240000 });
  await expect(page.locator("text=ATS Score Compatibility")).toBeVisible();

  // Wait for auto-save to register
  await page.waitForTimeout(3000);

  // 2. Clear sessionStorage to test direct fresh login / page load navigation
  await page.evaluate(() => {
    sessionStorage.clear();
  });

  // Navigate to /dashboard again
  await page.goto("http://localhost:3000/dashboard?mock_auth=true");
  await page.waitForLoadState("load");

  // Verify that it bypasses Step 1/2/3 and loads straight into Step 4 Results
  await page.waitForSelector("text=Tailored Resume Ready", { timeout: 20000 });
  await expect(page.locator("text=ATS Score Compatibility")).toBeVisible();

  // Open template tab
  await page.click('button:has-text("Template & PDF")');
  await page.waitForSelector("text=Visual Layout Preview", { timeout: 5000 });

  // Select Modern Tech template
  await page.click('text=Modern Tech');

  // Download PDF and assert file characteristics
  const [downloadPdf] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Download PDF", exact: true }).first().click()
  ]);

  const pdfFilename = downloadPdf.suggestedFilename();
  expect(pdfFilename).toContain("Modern");
  expect(pdfFilename.endsWith(".pdf")).toBe(true);
});
