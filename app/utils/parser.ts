import { SupabaseClient } from "@supabase/supabase-js";
import { ResumeData, ResumeTableRecord } from "../types/database.types";
import mammoth from "mammoth";

/**
 * Extracts raw plain text from PDF or DOCX file buffer.
 * Rejects other formats, enforces size limits, and checks for minimum character length
 * to detect non-readable or scanned PDF files.
 */
export async function extractTextFromFile(
  fileBuffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  // 1. Enforce max file size of 10MB
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  if (fileBuffer.length > MAX_SIZE_BYTES) {
    throw new Error(
      `File size exceeds the 10MB limit. The uploaded file is ${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB.`
    );
  }

  const normalizedMime = mimeType.toLowerCase();
  const extension = pathExtension(filename);

  const isPdf = normalizedMime === "application/pdf" || extension === ".pdf";
  const isDocx =
    normalizedMime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx";

  if (!isPdf && !isDocx) {
    throw new Error(
      `Unsupported file type: "${mimeType}" (${filename}). Only PDF (.pdf) and Word (.docx) files are supported.`
    );
  }

  let extractedText = "";

  if (isPdf) {
    try {
      const { getDocumentProxy, extractText: runExtractText } = await import("unpdf");
      const pdfArray = new Uint8Array(fileBuffer);
      const pdf = await getDocumentProxy(pdfArray);
      const { text } = await runExtractText(pdf, { mergePages: true });
      extractedText = text || "";
    } catch (err: any) {
      console.error("PDF extraction error using unpdf:", err);
      throw new Error(`Failed to extract text from PDF: ${err.message || err}`);
    }
  } else {
    try {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = result.value || "";
    } catch (err: any) {
      console.error("DOCX extraction error using mammoth:", err);
      throw new Error(`Failed to extract text from Word document: ${err.message || err}`);
    }
  }

  // 2. Check for empty or non-extractable text (e.g. scanned image PDFs)
  const MIN_CHAR_LENGTH = 50;
  if (!extractedText.trim() || extractedText.trim().length < MIN_CHAR_LENGTH) {
    throw new Error(
      "Could not extract readable text from this file - it may be a scanned image; try exporting a different way."
    );
  }

  return extractedText;
}

/**
 * Parses raw resume text into structured ResumeData using Gemini 2.5 Flash API.
 * Follows strict instructions to never fabricate information and structure scrambled inputs.
 */
export async function parseRawResumeText(
  rawText: string
): Promise<{ data: ResumeData; warnings: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  // Guidelines for honest, non-fabricated parsing
  const promptText = `Parse the following raw resume text into structured JSON.

IMPORTANT: The input text may be scrambled, interleaved, or have lines out of order due to multi-column text extraction failures. 
Your job is to read carefully, reassemble the context, and properly separate sections (e.g. associating bullet points with the correct job title, and separating education from work history). 

Follow these strict instructions:
1. ONLY extract information that is explicitly stated in the raw text.
2. NEVER guess, infer, or fabricate any missing details (such as dates, job titles, or contact info).
3. If a section or field cannot be confidently parsed, is missing, or is highly scrambled/unreadable, do NOT populate it with fallback guesses. Instead, add a descriptive warning message explaining the ambiguity/scrambling issue to the "parsing_warnings" list.
4. For skills, group them into logical categories (e.g., "Languages", "Frameworks") if apparent. If not, put them under a general category "Technical Skills".

Raw Resume Text:
\"\"\"
${rawText}
\"\"\"

Return a single JSON object matching the provided responseSchema.`;

  const systemInstruction = `You are a high-fidelity, strict resume parsing engine capable of reassembling scrambled, multi-column inputs. Your primary directive is 100% factual accuracy. You must extract and structure the exact information present in the source text without inserting any external assumptions or guessing missing values. If information is missing or unclear, record it in the parsing_warnings list.`;

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
            parts: [{ text: promptText }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              contact: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  email: { type: "STRING" },
                  phone: { type: "STRING" },
                  location: { type: "STRING" },
                  links: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        url: { type: "STRING" },
                      },
                      required: ["label", "url"],
                    },
                  },
                },
                required: ["name", "email", "phone", "location", "links"],
              },
              summary: { type: "STRING" },
              experience: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    title: { type: "STRING" },
                    company: { type: "STRING" },
                    location: { type: "STRING" },
                    start_date: { type: "STRING" },
                    end_date: { type: "STRING" },
                    bullets: {
                      type: "ARRAY",
                      items: { type: "STRING" },
                    },
                  },
                  required: ["title", "company", "location", "start_date", "end_date", "bullets"],
                },
              },
              education: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    institution: { type: "STRING" },
                    degree: { type: "STRING" },
                    field: { type: "STRING" },
                    start_date: { type: "STRING" },
                    end_date: { type: "STRING" },
                  },
                  required: ["institution", "degree", "field", "start_date", "end_date"],
                },
              },
              skills: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    category: { type: "STRING" },
                    list: {
                      type: "ARRAY",
                      items: { type: "STRING" },
                    },
                  },
                  required: ["category", "list"],
                },
              },
              parsing_warnings: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
            },
            required: [
              "contact",
              "summary",
              "experience",
              "education",
              "skills",
              "parsing_warnings",
            ],
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini parser API call failed: ${res.status} ${errorText}`);
  }

  const result = await res.json();
  const parsedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!parsedText) {
    throw new Error("Empty response returned from Gemini parsing model.");
  }

  const jsonResult = JSON.parse(parsedText);
  const { parsing_warnings, ...resumeData } = jsonResult;

  return {
    data: resumeData as ResumeData,
    warnings: (parsing_warnings || []) as string[],
  };
}

/**
 * Saves a parsed resume and its raw text into the Supabase database.
 * userId is strictly typed as string because sign-in is guaranteed before upload.
 */
export async function saveParsedResume(
  supabase: SupabaseClient,
  resumeData: ResumeData,
  rawSourceText: string,
  sessionId: string,
  userId: string
): Promise<ResumeTableRecord> {
  const { data, error } = await supabase
    .from("resumes")
    .insert([
      {
        user_id: userId,
        session_id: sessionId,
        contact: resumeData.contact,
        summary: resumeData.summary,
        experience: resumeData.experience,
        education: resumeData.education,
        skills: resumeData.skills,
        raw_source_text: rawSourceText,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save resume record to Supabase: ${error.message}`);
  }

  return data as ResumeTableRecord;
}

// Private helper to extract file extension
function pathExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : "";
}
