import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription, uploadedFileBase64 } = await request.json();

    // 1. Extract PDF text if a PDF file is provided
    let activeResumeText = resumeText;
    if (uploadedFileBase64) {
      try {
        const { getDocumentProxy, extractText } = await import("unpdf");
        const pdfBuffer = Buffer.from(uploadedFileBase64, "base64");
        
        // Convert Node Buffer to Uint8Array required by unpdf
        const pdfArray = new Uint8Array(pdfBuffer);
        const pdf = await getDocumentProxy(pdfArray);
        const { text } = await extractText(pdf, { mergePages: true });
        activeResumeText = text;
      } catch (err) {
        const error = err as Error;
        console.error("Error extracting text from PDF resume using unpdf:", error);
        return NextResponse.json(
          { error: { message: `Failed to extract text from PDF resume: ${error.message}` } },
          { status: 400 }
        );
      }
    }

    if (!activeResumeText || !activeResumeText.trim()) {
      return NextResponse.json(
        { error: { message: "Resume content is empty. Please upload a valid resume." } },
        { status: 400 }
      );
    }

    // Secure E2E test bypass: Only active if E2E_TEST_MODE is true AND E2E key matches
    const e2eHeader = request.headers.get("x-e2e-test-key") || "";
    const isE2EMode = process.env.E2E_TEST_MODE === "true" && e2eHeader === "e2e-mock-bypass-token-2026";

    if (isE2EMode) {
      console.log("[GEMINI STATUS]: BYPASSED (Secure E2E test detected via headers and environment. Bypassing live API calls to prevent rate limits.)");
      const fallbackData = {
        originalResumeText: activeResumeText,
        tailoredResumeText: `Alex Rivera
alex.rivera@dev.io | +1 (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Frontend developer with experience building web applications using React and JavaScript. Passionate about writing clean code and improving layouts.

WORK EXPERIENCE
Frontend Developer | TechCorp (2024 - Present)
- Designed and engineered 25+ reusable React & TypeScript components using Tailwind CSS, boosting codebase modularity and reducing rendering times.
- Spearheaded Core Web Vitals audits and bundle-splitting optimizations, reducing Largest Contentful Paint (LCP) by 1.2s and improving SEO indexing scores.
- Partnered with backend engineers to architect RESTful/GraphQL API contracts, ensuring seamless, type-safe data integration across 12+ dashboard views.
- Conducted accessibility (a11y) audits and resolved critical responsive layout bugs, ensuring compliance with WCAG AAA standards across all viewports.

Software Engineer Intern | CodeLabs (2023)
- Wrote JavaScript and HTML/CSS code for marketing pages.
- Worked on user feedback issues and resolved styling bugs.`,
        originalAtsScore: 71,
        optimizedAtsScore: 93,
        matchedKeywords: ["React", "JavaScript", "HTML", "CSS", "TypeScript", "Tailwind CSS", "API contracts", "RESTful", "GraphQL", "Web performance", "Core Web Vitals", "LCP", "SEO", "Accessibility", "a11y"],
        insertedKeywords: ["Next.js", "Tailwind CSS", "Core Web Vitals", "LCP", "Accessibility", "a11y"],
        bulletDiffs: [
          {
            original: "Responsible for building React components and styling with CSS.",
            tailored: "Designed and engineered 25+ reusable React & TypeScript components using Tailwind CSS, boosting codebase modularity and reducing rendering times.",
            improvements: ["Added TypeScript type safety", "Highlighted Tailwind CSS usage", "Quantified component impact (25+)"]
          },
          {
            original: "Worked on page speed performance and improved loading times.",
            tailored: "Spearheaded Core Web Vitals audits and bundle-splitting optimizations, reducing Largest Contentful Paint (LCP) by 1.2s and improving SEO indexing scores.",
            improvements: ["Mentioned Core Web Vitals & LCP", "Linked to business metric (SEO)", "Specified metric improvement (1.2s)"]
          },
          {
            original: "Collaborated with backend devs to integrate APIs.",
            tailored: "Partnered with backend engineers to architect RESTful/GraphQL API contracts, ensuring seamless, type-safe data integration across 12+ dashboard views.",
            improvements: ["Defined API types (RESTful/GraphQL)", "Used active verb (architected)", "Specified scope (12+ views)"]
          },
          {
            original: "Fixed layout alignment problems.",
            tailored: "Conducted accessibility (a11y) audits and resolved critical responsive layout bugs, ensuring compliance with WCAG AAA standards across all viewports.",
            improvements: ["Added accessibility keywords", "Aligned with industry standards (WCAG AAA)", "Emphasized responsiveness"]
          }
        ]
      };

      const simulatedResponse = {
        is_mock: true,
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify(fallbackData)
                }
              ]
            }
          }
        ]
      };

      return NextResponse.json(simulatedResponse);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return NextResponse.json(
        { error: { message: "GEMINI_API_KEY is not configured on the server. Please check your .env.local configuration." } },
        { status: 500 }
      );
    }

    // 2. Shorten prompt text to save token overhead, leveraging responseSchema for structure
    const promptText = `Analyze the provided Resume and Job Description.
Tailor the resume text (summaries, experience bullets, skills) to align with the job description.
Extract and return the original plain text of the resume.
Calculate original vs optimized ATS scores, identify matched keywords, AI-optimized keywords inserted, and provide bullet diffs.

Resume Text:
"""
${activeResumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return the analysis response as a single JSON object matching the provided responseSchema.`;

    const systemInstructionText = `You are the AI engine behind ATSPrime, an AI-powered ATS resume optimization platform. Your task is to analyze resumes against a target job description, improve ATS compatibility, preserve factual accuracy, quantify achievements where possible, optimize keywords naturally, and produce recruiter-friendly, truthful content. Never invent experience or skills. Maintain professional formatting and concise, impactful bullet points.`;

    // 3 & 4. Use the v1beta endpoint (needed for gemini-2.5-flash schemas) and implement retry logic for HTTP 429
    const callGemini = async (attempt = 1): Promise<{ ok: boolean; status: number; data?: unknown; error?: { message?: string } }> => {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }]
              }
            ],
            systemInstruction: {
              parts: [
                {
                  text: systemInstructionText
                }
              ]
            },
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  tailoredResumeText: { type: "STRING" },
                  originalResumeText: { type: "STRING" },
                  originalAtsScore: { type: "INTEGER" },
                  optimizedAtsScore: { type: "INTEGER" },
                  matchedKeywords: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  insertedKeywords: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  bulletDiffs: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        original: { type: "STRING" },
                        tailored: { type: "STRING" },
                        improvements: {
                          type: "ARRAY",
                          items: { type: "STRING" }
                        }
                      },
                      required: ["original", "tailored", "improvements"]
                    }
                  }
                },
                required: [
                  "tailoredResumeText",
                  "originalResumeText",
                  "originalAtsScore",
                  "optimizedAtsScore",
                  "matchedKeywords",
                  "insertedKeywords",
                  "bulletDiffs"
                ]
              }
            }
          })
        }
      );

      if (!res.ok) {
        let errData: { error?: { message?: string } } = {};
        try {
          errData = await res.json();
        } catch {}
 
        const status = res.status;
        const errorMessage = errData.error?.message || "";

        if (status === 429 && attempt <= 5) {
          let waitMs = 5000;
          
          // Try to extract retry time from the error message (e.g. "Please retry in 9.799507319s.")
          const match = errorMessage.match(/Please retry in ([\d\.]+)s/);
          if (match && match[1]) {
            const sec = parseFloat(match[1]);
            if (!isNaN(sec)) {
              waitMs = Math.ceil(sec * 1000) + 500; // Add 500ms safety buffer
            }
          } else {
            const retryAfterHeader = res.headers.get("retry-after");
            if (retryAfterHeader) {
              const retryAfterSec = parseInt(retryAfterHeader, 10);
              if (!isNaN(retryAfterSec)) {
                waitMs = retryAfterSec * 1000;
              } else {
                const retryDate = Date.parse(retryAfterHeader);
                if (!isNaN(retryDate)) {
                  waitMs = Math.max(0, retryDate - Date.now());
                }
              }
            }
          }

          console.warn(`Gemini API returned 429. Retrying in ${waitMs}ms (attempt ${attempt}/5)...`);
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          return callGemini(attempt + 1);
        }

        return { ok: false, status, error: errData.error };
      }

      const data = await res.json();
      return { ok: true, status: res.status, data };
    };

    const result = await callGemini();

    if (!result.ok) {
      console.error(`[GEMINI STATUS]: FAILED (API call failed with status ${result.status})`);
      return NextResponse.json(
        { error: { message: `AI optimization failed: ${result.error?.message || "Gemini API request failed."}` } },
        { status: result.status || 500 }
      );
    }

    console.log("[GEMINI STATUS]: SUCCESS (Successfully connected to Gemini 2.5 Flash API. Returning optimized data.)");
    return NextResponse.json(result.data);
  } catch (err) {
    const error = err as Error;
    console.error("API route optimization error:", error);
    return NextResponse.json(
      { error: { message: error.message || "An unexpected error occurred." } },
      { status: 500 }
    );
  }
}
