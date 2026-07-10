import { NextResponse } from "next/server";
import { chromium } from "@playwright/test";
import { generateTemplateHtml } from "@/app/utils/templates";

export async function POST(request: Request) {
  try {
    const { resumeText, templateId } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: { message: "resumeText is required." } },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: { message: "templateId is required." } },
        { status: 400 }
      );
    }

    // 1. Generate full styled HTML
    const htmlContent = generateTemplateHtml(resumeText, templateId);

    // 2. Launch Playwright headless Chromium with sandbox-disabling args
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 3. Set content of the page
    await page.setContent(htmlContent, { waitUntil: "load", timeout: 10000 });

    // 4. Generate PDF buffer (Single Page Format)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      pageRanges: "1",
      margin: {
        top: "0.2in",
        bottom: "0.2in",
        left: "0.2in",
        right: "0.2in"
      }
    });

    await browser.close();

    // 5. Construct direct attachment response
    const headers = new Headers();
    const formattedTemplateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="ATSPrime_Optimized_Resume_${formattedTemplateName}.pdf"`
    );

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers
    });
  } catch (err) {
    const error = err as Error;
    console.error("API route PDF generation error:", error.stack || error);
    return NextResponse.json(
      { error: { message: error.message || "An unexpected error occurred during PDF generation." } },
      { status: 500 }
    );
  }
}
