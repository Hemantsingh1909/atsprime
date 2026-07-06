import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const viewports = [390, 768, 1024, 1440];

for (const width of viewports) {
  test(`Responsive Visual QA Audit at ${width}px`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const hydrationWarnings: string[] = [];

    // Listen for console and page errors
    page.on("console", (msg) => {
      const text = msg.text();
      if (msg.type() === "error") {
        consoleErrors.push(text);
      }
      if (text.toLowerCase().includes("hydration")) {
        hydrationWarnings.push(text);
      }
    });

    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    // Set viewport size
    const height = width < 768 ? 844 : 900;
    await page.setViewportSize({ width, height });

    // Navigate to page
    await page.goto("/");
    await page.waitForLoadState("load");

    // Scroll through the page to trigger lazy animations/render components
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // 1. Check for page/javascript errors
    expect(pageErrors, `Page JS errors encountered at ${width}px: ${pageErrors.join(", ")}`).toEqual([]);

    // 2. Check for console errors
    expect(consoleErrors, `Console errors encountered at ${width}px: ${consoleErrors.join(", ")}`).toEqual([]);

    // 3. Check for hydration warnings
    expect(hydrationWarnings, `Hydration warnings encountered at ${width}px: ${hydrationWarnings.join(", ")}`).toEqual([]);

    // 4. Check for broken images
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const isLoaded = await img.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalWidth > 0;
      });
      expect(isLoaded, `Image with src "${src}" failed to load correctly at ${width}px`).toBe(true);
    }

    // 5. Check for horizontal overflow scrolling
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(overflow, `Horizontal overflow scrolling detected at ${width}px`).toBe(false);

    // 6. Check for clipped text elements (overflow: hidden/clip causing cut-off text content)
    const clippedElements = await page.evaluate(() => {
      const results: string[] = [];
      const elements = Array.from(document.querySelectorAll('*'));
      
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        const isHiddenX = style.overflowX === 'hidden' || style.overflowX === 'clip';
        const isHiddenY = style.overflowY === 'hidden' || style.overflowY === 'clip';
        
        if (!isHiddenX && !isHiddenY) continue;
        
        // Check if it has text node children with actual content
        const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== '');
        // Or check if it is a tag that usually contains inline text (like span, p, h1-6, button, etc.)
        const isTextContainer = ['p', 'span', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'label', 'li'].includes(el.tagName.toLowerCase());
        
        if (el instanceof HTMLElement && (textNodes.length > 0 || isTextContainer)) {
          if (isHiddenX && el.scrollWidth > el.clientWidth + 2) {
            results.push(
              `Horizontal clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
              `scrollWidth: ${el.scrollWidth}px, clientWidth: ${el.clientWidth}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
            );
          }
          if (isHiddenY && el.scrollHeight > el.clientHeight + 2) {
            const heightStyle = el.style.height || style.height;
            const maxHeightStyle = el.style.maxHeight || style.maxHeight;
            if (heightStyle !== 'auto' || maxHeightStyle !== 'none') {
              results.push(
                `Vertical clip in <${el.tagName.toLowerCase()}> (class: "${el.className || ''}"): ` +
                `scrollHeight: ${el.scrollHeight}px, clientHeight: ${el.clientHeight}px. Text: "${el.textContent?.trim().slice(0, 30)}..."`
              );
            }
          }
        }
      }
      return results;
    });
    expect(clippedElements, `Clipped text elements detected at ${width}px:\n${clippedElements.join("\n")}`).toEqual([]);

    // 7. Capture screenshots of sections
    const screenshotsDir = `./tests/screenshots/${width}px`;
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    await page.locator("#hero").screenshot({ path: path.join(screenshotsDir, "hero.png") });
    await page.locator("#features").screenshot({ path: path.join(screenshotsDir, "features.png") });
    await page.locator("#faq").screenshot({ path: path.join(screenshotsDir, "faq.png") });
    await page.locator("footer").screenshot({ path: path.join(screenshotsDir, "footer.png") });
  });
}
