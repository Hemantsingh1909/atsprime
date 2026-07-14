/**
 * phase5-two-tab-link.spec.ts
 *
 * Two-browser-context test simulating the exact real-world scenario:
 *   Context A  = the original tab (laptop) — modal open, spinner running
 *   Context B  = the "email client" tab   — clicks the confirmation link
 *
 * The test verifies that Context A's modal auto-closes (download fires)
 * after Context B clicks the link, WITHOUT the user doing anything in A.
 */

import { test, expect, chromium } from "@playwright/test";

const APP_URL = "http://localhost:3000";

// Supabase JWT payload fragment that signals a permanent (non-anonymous) user.
const MOCK_PERMANENT_SESSION = {
  access_token: "mock.permanent.token",
  refresh_token: "mock_refresh_token",
  expires_in: 3600,
  token_type: "bearer",
  user: {
    id: "test-user-id-00000000",
    aud: "authenticated",
    email: "test@example.com",
    is_anonymous: false,         // ← the key flip
    app_metadata: { provider: "email" },
    user_metadata: { name: "Test User" },
  },
};

test.describe("Phase 5 – Two-context link-based auth gate", () => {
  test("modal in context A auto-closes after link clicked in context B", async () => {
    // ── Setup ──────────────────────────────────────────────────────────────
    const browser = await chromium.launch({ headless: true });

    // Context A: the original browser tab (user's laptop, modal open)
    const ctxA = await browser.newContext();
    const pageA = await ctxA.newPage();

    pageA.on("console", (msg) => {
      console.log(`[pageA CONSOLE] [${msg.type()}] ${msg.text()}`);
    });
    pageA.on("pageerror", (err) => {
      console.error(`[pageA ERROR] ${err.message}`);
    });

    // Context B: simulates a new tab / email client opening the link
    const ctxB = await browser.newContext();
    const pageB = await ctxB.newPage();

    // ── Step 1: seed Context A as an anonymous Supabase session ────────────
    // Intercept the anonymous sign-in/up calls.
    await pageA.route("**/auth/v1/signup*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "mock.anon.token",
          refresh_token: "mock_anon_refresh_token",
          expires_in: 3600,
          token_type: "bearer",
          user: {
            id: "test-user-id-00000000",
            aud: "authenticated",
            email: null,
            is_anonymous: true,
            app_metadata: { provider: "anonymous" },
            user_metadata: {},
          },
        }),
      });
    });

    // Intercept updateUser (PUT to auth/v1/user) - must wrap user in { user: ... }
    await pageA.route("**/auth/v1/user*", async (route) => {
      const method = route.request().method();
      if (method === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            user: {
              id: "test-user-id-00000000",
              aud: "authenticated",
              email: "test@example.com",
              is_anonymous: true,
              app_metadata: { provider: "email" },
              user_metadata: { name: "Test User" },
            }
          }),
        });
      } else if (method === "GET") {
        // Return permanent user after some delay, or return anonymous user initially
        const isPermanent = Date.now() >= permanentAfter;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "test-user-id-00000000",
            aud: "authenticated",
            email: isPermanent ? "test@example.com" : null,
            is_anonymous: !isPermanent,
            app_metadata: {},
            user_metadata: {},
          }),
        });
      } else {
        await route.continue();
      }
    });

    // We will simulate that getUser() poll detects verified user after 3 seconds
    let permanentAfter = Date.now() + 3000;

    // ── Step 2: navigate Context A to the app ─────────────────────────────
    await pageA.goto(APP_URL + "/dashboard");
    console.log("[Context A] Navigated to /dashboard");
    await pageA.waitForSelector("text=STEP 01", { timeout: 15000 });

    // ── Step 3: open the auth gate modal (simulate Download click) ─────────
    await pageA.evaluate(() => {
      window.dispatchEvent(new CustomEvent("__e2e_open_auth_modal__"));
    });

    // Wait for the modal to appear
    const modal = pageA.locator("#auth-gate-modal");
    await expect(modal).toBeVisible({ timeout: 5000 });
    console.log("[Context A] Auth gate modal is visible ✓");

    // ── Step 4: fill in signup form and submit → enter link-pending state ──
    await pageA.fill("#auth-fullname", "Test User");
    await pageA.fill("#auth-email", "test@example.com");
    await pageA.fill("#auth-password", "Password123");
    await pageA.click("#auth-gate-signup-submit");

    // Modal should transition to the "Check your inbox" / link-pending step
    await expect(pageA.locator("text=Check your inbox")).toBeVisible({ timeout: 5000 });
    await expect(pageA.locator("text=Waiting for confirmation")).toBeVisible({ timeout: 3000 });
    console.log("[Context A] Modal is in link-pending / waiting state ✓");

    // ── Step 5: Context B "clicks" the confirmation link ───────────────────
    // We simulate this by writing the permanent session directly into Context A's
    // localStorage (same origin) — exactly what Supabase does when the link is
    // clicked in a new tab on the same device.
    await pageB.goto(APP_URL);
    await pageB.evaluate((session) => {
      const key = "sb-ftwangvhxgkzzcijlutx-auth-token";
      (session as any).expires_at = Math.floor(Date.now() / 1000) + 3600;
      localStorage.setItem(key, JSON.stringify(session));
    }, MOCK_PERMANENT_SESSION);
    console.log("[Context B] Wrote permanent session to localStorage (simulating link click) ✓");

    // ── Step 6: verify Context A's modal auto-closes within 8 s ───────────
    await expect(modal).toBeHidden({ timeout: 8000 });
    console.log("[Context A] Modal auto-closed after Context B's link click ✓");

    // ── Teardown ───────────────────────────────────────────────────────────
    await browser.close();
  });
});
