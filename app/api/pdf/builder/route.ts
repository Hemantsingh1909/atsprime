import { NextResponse } from "next/server";
import { chromium } from "@playwright/test";
import React from "react";

// Import template components directly to avoid next/dynamic client wrappers on the server
import ATSClassic from "@/app/components/resume/templates/ATSClassic";
import Modern from "@/app/components/resume/templates/Modern";
import Executive from "@/app/components/resume/templates/Executive";
import Harvard from "@/app/components/resume/templates/Harvard";
import Minimal from "@/app/components/resume/templates/Minimal";
import Creative from "@/app/components/resume/templates/Creative";
import Corporate from "@/app/components/resume/templates/Corporate";

const serverTemplateComponents: Record<string, React.ComponentType<any>> = {
  classic: ATSClassic,
  modern: Modern,
  executive: Executive,
  harvard: Harvard,
  minimal: Minimal,
  creative: Creative,
  corporate: Corporate,
};

export async function POST(request: Request) {
  try {
    const { resumeData, templateId } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: { message: "resumeData is required." } },
        { status: 400 }
      );
    }

    if (!templateId) {
      return NextResponse.json(
        { error: { message: "templateId is required." } },
        { status: 400 }
      );
    }

    // 1. Get the React template component from the server components record
    const TemplateComponent = serverTemplateComponents[templateId];
    if (!TemplateComponent) {
      return NextResponse.json(
        { error: { message: `Template '${templateId}' not found in registry.` } },
        { status: 400 }
      );
    }

    // 2. Dynamically import react-dom/server to bypass Next.js client bundling restrictions
    const { renderToStaticMarkup } = await import("react-dom/server");
    const templateElement = React.createElement(TemplateComponent, { data: resumeData });
    const renderedMarkup = renderToStaticMarkup(templateElement);

    // 3. Construct a self-contained HTML page with Tailwind CDN, typography, and color adjustments
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    violet: '#7928ca',
                    'violet-deep': '#4c2889',
                    primary: '#171717',
                    'on-primary': '#ffffff',
                    ink: '#171717',
                    hairline: '#ebebeb',
                    canvas: '#ffffff',
                    'canvas-soft': '#fafafa'
                  }
                }
              }
            }
          </script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;850;900&family=Geist+Mono&family=Inter:wght@400;500;600;700;800;900&display=swap');
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
              background-color: white;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
            }
          </style>
        </head>
        <body>
          <div style="width: 210mm; min-height: 297mm; margin: 0 auto; background: white;">
            ${renderedMarkup}
          </div>
        </body>
      </html>
    `;

    // 4. Launch Playwright headless Chromium with sandbox-disabling args
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 5. Load generated HTML content and wait for network/styles to settle
    await page.setContent(htmlContent, { waitUntil: "load", timeout: 10000 });

    // 6. Generate A4 PDF buffer (Single Page Format)
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

    // 7. Stream PDF back as attachment download
    const headers = new Headers();
    const formattedTemplateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="ATSPrime_Resume_${formattedTemplateName}.pdf"`
    );

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers
    });
  } catch (err: any) {
    console.error("Builder PDF generation route error:", err.stack || err);
    return NextResponse.json(
      { error: { message: err.message || "An unexpected error occurred during PDF generation." } },
      { status: 500 }
    );
  }
}
