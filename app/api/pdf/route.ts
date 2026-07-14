import { NextResponse } from "next/server";
import { generateTemplateHtml } from "@/app/utils/templates";

// Runtime detection: use @sparticuz/chromium-min + playwright-core on serverless
// (Vercel, AWS Lambda), fall back to the locally installed @playwright/test chromium
// in dev/CI where the full binary is available.
// This avoids the 50MB serverless limit and the @playwright/test devDependency issue.
async function getBrowser() {
  const isVercel = process.env.VERCEL === "1";
  const isLambda = process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;
  const isServerless = isVercel || isLambda;

  if (isServerless) {
    // Serverless path: use @sparticuz/chromium-min + playwright-core
    const chromiumMin = await import("@sparticuz/chromium-min");
    const { chromium } = await import("playwright-core");

    const executablePath = await chromiumMin.default.executablePath(
      // Remote Chromium binary URL — sparticuz provides a CDN-hosted build
      // that is downloaded at runtime (not bundled), staying within size limits
      `https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar`
    );

    return chromium.launch({
      args: chromiumMin.default.args,
      executablePath,
      headless: true,
    });
  } else {
    // Local dev / CI path: use the full @playwright/test chromium binary
    const { chromium } = await import("@playwright/test");
    return chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  }
}

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

    // 1. Generate full styled HTML (same function as the on-screen preview iframe)
    const htmlContent = generateTemplateHtml(resumeText, templateId);

    // 2. Launch headless Chromium (serverless-aware)
    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    // 3. Set HTML content
    await page.setContent(htmlContent, { waitUntil: "load", timeout: 15000 });

    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.2in",
        bottom: "0.2in",
        left: "0.2in",
        right: "0.2in",
      },
    });

    await browser.close();

    // 5. Return as downloadable attachment
    const headers = new Headers();
    const formattedTemplateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="ATSPrime_Optimized_Resume_${formattedTemplateName}.pdf"`
    );

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers,
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
