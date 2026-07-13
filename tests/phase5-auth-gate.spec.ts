import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test("Phase 5: Auth gate and anonymous-to-permanent session transfer", async ({ page }) => {
  test.setTimeout(120000);

  // Set up mock console/error listeners for diagnostics
  page.on("console", (msg) => {
    console.log(`[BROWSER CONSOLE] [${msg.type()}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    console.error(`[BROWSER ERROR] ${err.message}`);
  });

  // 1. Intercept Supabase Auth endpoints to control anonymous vs permanent state
  let isAnonymousSession = true;

  await page.route("**/auth/v1/signup*", async (route, request) => {
    const postData = JSON.parse(request.postData() || "{}");
    console.log("Mock Supabase Auth signup call:", postData);
    
    // If it's an anonymous sign up or email link
    if (request.url().includes("anonymous=true") || !postData.email) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock.anon.token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "mock-anon-refresh-123",
          user: {
            id: "99999999-9999-9999-9999-999999999999",
            aud: "authenticated",
            role: "authenticated",
            email: "",
            phone: "",
            confirmed_at: "2026-07-14T02:00:00Z",
            is_anonymous: true,
            user_metadata: {},
            identities: [],
            created_at: "2026-07-14T02:00:00Z",
            updated_at: "2026-07-14T02:00:00Z"
          }
        })
      });
    } else {
      // Permanent account creation (credential linking)
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "99999999-9999-9999-9999-999999999999", // Must be identical ID
            aud: "authenticated",
            role: "authenticated",
            email: postData.email,
            phone: "",
            confirmation_sent_at: "2026-07-14T02:00:00Z",
            confirmed_at: null,
            is_anonymous: true, // Still anonymous until verified
            user_metadata: {
              name: postData.data?.name || "Test User"
            },
            identities: [],
            created_at: "2026-07-14T02:00:00Z",
            updated_at: "2026-07-14T02:00:00Z"
          }
        })
      });
    }
  });

  await page.route("**/auth/v1/verify*", async (route, request) => {
    const postData = JSON.parse(request.postData() || "{}");
    console.log("Mock Supabase Auth verify OTP call:", postData);
    
    // Set session status to permanent
    isAnonymousSession = false;

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access_token: "mock.perm.token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "mock-perm-refresh-456",
        user: {
          id: "99999999-9999-9999-9999-999999999999", // ID remains identical
          aud: "authenticated",
          role: "authenticated",
          email: postData.email,
          phone: "",
          confirmed_at: "2026-07-14T02:01:00Z",
          is_anonymous: false, // is_anonymous flips false
          user_metadata: {
            name: "Alex Rivera"
          },
          identities: [
            {
              id: "identity-1",
              user_id: "99999999-9999-9999-9999-999999999999",
              identity_data: { email: postData.email },
              provider: "email"
            }
          ],
          created_at: "2026-07-14T02:00:00Z",
          updated_at: "2026-07-14T02:01:00Z"
        }
      })
    });
  });

  // Mock token/user refresh endpoint to maintain the mocked session status
  await page.route("**/auth/v1/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "99999999-9999-9999-9999-999999999999",
        aud: "authenticated",
        role: "authenticated",
        email: isAnonymousSession ? "" : "alex.rivera@example.com",
        phone: "",
        confirmed_at: "2026-07-14T02:00:00Z",
        is_anonymous: isAnonymousSession,
        user_metadata: isAnonymousSession ? {} : { name: "Alex Rivera" },
        created_at: "2026-07-14T02:00:00Z",
        updated_at: "2026-07-14T02:00:00Z"
      })
    });
  });

  // 2. Intercept App AI Endpoints to avoid Gemini quota consumption
  await page.route("**/api/resume/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: "mock-resume-id-123",
          raw_source_text: "Alex Rivera senior engineer resume",
          parsed_fields: {
            contact: { name: "Alex Rivera", email: "alex@example.com", phone: "555-000-1111", location: "San Francisco, CA", links: [] },
            summary: "Senior software engineer with 6 years of experience in TypeScript, React, Node.js, PostgreSQL, and Docker.",
            experience: [{
              title: "Senior Software Engineer", company: "TechCorp Inc.", location: "San Francisco, CA",
              start_date: "2019-01", end_date: "Present",
              bullets: [
                "Built scalable REST APIs using Node.js and Express.",
                "Led migration of frontend from Angular to React TypeScript.",
                "Deployed microservices on Docker and managed PostgreSQL databases.",
                "Designed marketing graphics in Photoshop and Figma."
              ]
            }],
            education: [{ institution: "UC Berkeley", degree: "B.S.", field: "Computer Science", start_date: "2013", end_date: "2017" }],
            skills: [
              { category: "Languages", list: ["TypeScript", "JavaScript", "Python"] },
              { category: "Frameworks", list: ["React", "Node.js", "Express"] },
              { category: "Infrastructure", list: ["Docker", "PostgreSQL", "Redis"] },
              { category: "Design", list: ["Photoshop", "Figma"] }
            ]
          }
        }
      })
    });
  });

  await page.route("**/api/job-description/parse", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: "mock-jd-id-456",
          raw_text: "Full Stack Engineer. Requires TypeScript, React, Node.js, PostgreSQL. Preferred: Docker, Redis, GraphQL, AWS.",
          parsed_fields: {
            job_title: "Full Stack Engineer",
            required_years_experience: 4,
            required_degree: "B.S.",
            required_certifications: [],
            required_skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
            preferred_skills: ["Docker", "Redis", "GraphQL", "AWS"]
          }
        }
      })
    });
  });

  await page.route("**/api/resume/optimize", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        data: {
          id: "mock-optimization-id-789",
          score_parseability: 93,
          score_keyword_match: 75,
          score_knockout: 100,
          matched_keywords: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "Redis"],
          gaps_identified: [
            "No GraphQL experience found in resume.",
            "No AWS infrastructure or certification experience mentioned."
          ],
          knockout_details: {
            years_experience: { required: 4, met: true, actual: 6 },
            degree: { required: "B.S.", met: true, actual: "B.S. Computer Science" },
            certifications: { required: [], met: true, missing: [] }
          },
          tailored_resume: {
            contact: { name: "Alex Rivera", email: "alex@example.com", phone: "555-000-1111", location: "San Francisco, CA", links: [] },
            summary: "Senior Full Stack Engineer with 6 years delivering scalable TypeScript/React frontends and Node.js/PostgreSQL backends.",
            experience: [{
              title: "Senior Software Engineer", company: "TechCorp Inc.", location: "San Francisco, CA",
              start_date: "2019-01", end_date: "Present",
              bullets: [
                "Built scalable REST APIs with Node.js and Express, serving 50K+ daily requests.",
                "Led React TypeScript frontend migration, reducing load time by 40%.",
                "Deployed containerized microservices with Docker and managed high-availability PostgreSQL clusters.",
                "Designed UI assets in Photoshop and Figma for marketing campaigns."
              ]
            }],
            education: [{ institution: "UC Berkeley", degree: "B.S.", field: "Computer Science", start_date: "2013", end_date: "2017" }],
            skills: [
              { category: "Languages", list: ["TypeScript", "JavaScript", "Python"] },
              { category: "Frameworks", list: ["React", "Node.js", "Express"] },
              { category: "Infrastructure", list: ["Docker", "PostgreSQL", "Redis"] },
              { category: "Design", list: ["Photoshop", "Figma"] }
            ]
          }
        }
      })
    });
  });

  // Mock PDF/DOCX download APIs to return a simple dummy file blob
  await page.route("**/api/docx", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      body: Buffer.from("mock-docx-file-contents")
    });
  });

  // 3. Navigate to dashboard (useSupabase is active, no mock_auth parameter)
  console.log("Navigating to dashboard with real Supabase Auth active...");
  await page.goto("http://localhost:3000/dashboard");
  await page.waitForLoadState("load");

  // 4. Verify anonymous session resolved and Step 1 loaded without triggering any gate
  await page.waitForSelector("text=STEP 01", { timeout: 15000 });
  await expect(page.locator("text=Upload your base resume")).toBeVisible();

  // Create temporary resume file
  const tempResumePath = path.join(__dirname, "alex_resume_test.docx");
  fs.writeFileSync(tempResumePath, "Dummy resume content");

  try {
    // 5. Complete Step 1: Upload
    console.log("Step 1: Uploading resume...");
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(tempResumePath);
    await page.waitForSelector('button:has-text("Continue to Job Description")', { timeout: 15000 });
    await page.click('button:has-text("Continue to Job Description")');

    // 6. Complete Step 2: Paste Job Description
    console.log("Step 2: Entering job description...");
    await page.waitForSelector("text=STEP 02", { timeout: 5000 });
    await page.fill("textarea", "Full Stack Engineer. Requires TypeScript, React, Node.js, PostgreSQL. Preferred: Docker, Redis, GraphQL, AWS.");
    
    // 7. Complete Step 3: Run Optimization
    console.log("Step 3: Running optimize...");
    await page.click('button:has-text("Optimize Resume")');

    // 8. Wait for Step 4 Results Page
    console.log("Step 4: Results ready...");
    await page.waitForSelector("text=Your Tailored Resume is Ready", { timeout: 30000 });

    // Verify Template Selection works without auth gate
    console.log("Verifying template tab access is public...");
    await page.click('button:has-text("Template")');
    await expect(page.locator("text=Choose Template")).toBeVisible();

    // Verify template swap works publicly
    await page.click('button:has-text("Modern Tech")');

    // 9. Verify auth gate trigger on Download button click
    console.log("Clicking Download PDF to trigger auth gate...");
    // Open format selector and click download
    await page.click('button:has-text("Download PDF")');

    // Confirm that the inline AuthGateModal is displayed
    console.log("Verifying AuthGateModal is visible...");
    await page.waitForSelector("#auth-gate-modal", { timeout: 5000 });
    await expect(page.locator("#auth-gate-modal")).toBeVisible();
    await expect(page.locator("text=Create a free account to download")).toBeVisible();

    // 10. Fill out Sign-up form and submit
    console.log("Filling out signup form...");
    await page.fill("#auth-fullname", "Alex Rivera");
    await page.fill("#auth-email", "alex.rivera@example.com");
    await page.fill("#auth-password", "SecurePassword123");
    await page.click("#auth-gate-signup-submit");

    // 11. Confirm transition to OTP step
    console.log("Verifying OTP screen is active...");
    await page.waitForSelector("text=Check your email", { timeout: 5000 });
    await expect(page.locator("text=We sent a 6-digit code to alex.rivera@example.com")).toBeVisible();

    // 12. Submit the 6-digit OTP code to verify and confirm
    console.log("Submitting verification code...");
    const [download] = await Promise.all([
      page.waitForEvent("download"), // Verify that the download triggers automatically!
      page.fill("#auth-otp-code", "123456"), // Typing OTP triggers verification
      page.click("#auth-gate-otp-submit")
    ]);

    console.log("Download event triggered successfully! File:", download.suggestedFilename());
    expect(download.suggestedFilename()).toContain("Modern");

    // 13. Verify the modal is closed and Step 4 remains open
    await expect(page.locator("#auth-gate-modal")).not.toBeVisible();
    await expect(page.locator("text=Your Tailored Resume is Ready")).toBeVisible();
    
    console.log("E2E Auth Gate and Anonymous-to-Permanent conversion test passed successfully! 🚀");
  } finally {
    if (fs.existsSync(tempResumePath)) {
      fs.unlinkSync(tempResumePath);
    }
  }
});
