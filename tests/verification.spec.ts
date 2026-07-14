import { test, expect } from "@playwright/test";

test("Verify Sentry and PostHog initialization", async ({ page }) => {
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto("http://localhost:3000/dashboard?mock_auth=true");
  await page.waitForLoadState("load");
  // Wait for the client-side JS bundle to load and execute (hydration indicate)
  await page.waitForFunction(() => typeof (window as any).__POSTHOG_KEY__ !== "undefined", { timeout: 10000 });

  // 1. Verify that Sentry SDK is loaded and initialized (window.__SENTRY__ exists)
  const isSentryInitialized = await page.evaluate(() => {
    return typeof (window as unknown as Record<string, unknown>).__SENTRY__ !== "undefined";
  });

  // 2. Verify that PostHog key is loaded on the client side
  const phKey = await page.evaluate(() => {
    return (window as unknown as Record<string, unknown>).__POSTHOG_KEY__;
  });

  // 3. Verify that PostHog itself did not initialize in testing environment
  const isPostHogInitialized = await page.evaluate(() => {
    return typeof (window as unknown as Record<string, unknown>).posthog !== "undefined";
  });

  console.log("=== Verification Results ===");
  console.log("Browser console logs during load:");
  consoleLogs.forEach(log => console.log(log));
  console.log("Sentry Initialized:", isSentryInitialized);
  console.log("PostHog Key:", phKey);
  console.log("PostHog Initialized in test:", isPostHogInitialized);
  console.log("===========================");

  expect(isSentryInitialized).toBe(true);
  expect(phKey).toBeDefined();
  expect(isPostHogInitialized).toBe(false);
});

