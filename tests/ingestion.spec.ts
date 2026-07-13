import { test, expect } from "@playwright/test";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as fs from "fs";
import * as path from "path";

test("Secure Anonymous Ingestion Integration Test", async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout for real AI calls

  // 1. Generate a real Word (.docx) file containing our messy resume text
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "JANE DOE",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun("Email: jane.doe@example.com\nLocation: Seattle, WA\n(Note: No phone number or social links listed.)"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "WORK EXPERIENCE",
                bold: true,
                size: 20,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun("Senior Developer | Acme Software Corp\nRemote\nDates: Dec 2021 to Present\n- Developed UI pages using Next.js."),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun("EDUCATION"),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun("University of Washington\nDegree: BS in Computer Science\n(No graduation date listed.)"),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const tempFilePath = path.join(__dirname, "temp_messy_resume.docx");
  fs.writeFileSync(tempFilePath, buffer);

  try {
    // 2. Navigate to the dashboard (useSupabase is active, no mock_auth parameter)
    page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));
    page.on("pageerror", (err) => console.error("BROWSER ERROR:", err.message));

    await page.goto("http://localhost:3000/dashboard");
    await page.waitForLoadState("load");

    // 3. Verify anonymous session resolved and Step 1 is loaded
    await page.waitForSelector("text=STEP 01", { timeout: 15000 });
    await expect(page.locator("text=Upload your base resume")).toBeVisible();

    // Print local storage keys for diagnostics
    const lsKeys = await page.evaluate(() => Object.keys(localStorage));
    console.log("Active LocalStorage Keys:", lsKeys);

    // 4. Trigger file upload by setting input files
    console.log("Uploading generated messy resume.docx file...");
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(tempFilePath);

    // 5. Verify parsing state and wait for warnings / success
    console.log("Waiting for backend parsing and RLS database save to complete...");
    
    // The UI should show "Resume Parsing Warnings" if parsed correctly
    await page.waitForSelector("text=Resume Parsing Warnings", { timeout: 45000 });
    
    // Check that warnings are visible in the UI
    const warningsHeader = await page.locator("text=Resume Parsing Warnings").textContent();
    console.log("UI Warning Header:", warningsHeader);

    // Verify Continue button is enabled
    const continueBtn = page.locator('button:has-text("Continue to Job Description")');
    await expect(continueBtn).toBeEnabled();

    // Click continue and confirm navigation to Step 2
    await continueBtn.click();
    await page.waitForSelector("text=STEP 02", { timeout: 5000 });
    await expect(page.locator("text=Paste the Job Description")).toBeVisible();

    // 6. Click Load Sample Job
    console.log("Loading sample job description...");
    await page.click('button:has-text("Load Sample Job")');
    const jobText = await page.locator("textarea").inputValue();
    expect(jobText).toContain("Senior Frontend Engineer");

    // 7. Click Optimize Resume (Triggers real DB parse + optimize loop)
    console.log("Running real database-driven resume optimization...");
    await page.click('button:has-text("Optimize Resume")');

    // 8. Wait for Step 4 Results page to load
    console.log("Waiting for database optimizations record to be created and results to render...");
    await page.waitForSelector("text=Your Tailored Resume is Ready", { timeout: 60000 });
    
    // Verify ATS Score and other elements are visible
    await expect(page.locator("text=ATS Score")).toBeVisible();
    console.log("E2E Real Database-Driven Optimization Test Passed Successfully! 🚀");
  } finally {
    // Cleanup temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});
