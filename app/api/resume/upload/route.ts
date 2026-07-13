import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { extractTextFromFile, parseRawResumeText, saveParsedResume } from "@/app/utils/parser";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: Request) {
  try {
    // 1. Authenticate the request via the Authorization header
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: { message: "Authorization token is required to parse resumes securely." } },
        { status: 401 }
      );
    }

    // Initialize Supabase client on behalf of the user/session
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    // Retrieve user profile (confirms token is valid and fetches the user's UUID)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: { message: `Authentication check failed: ${userError?.message || "Invalid session token."}` } },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 2. Parse multi-part form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("session_id") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: { message: "No file was uploaded." } },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: { message: "session_id is required." } },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 3. Extract text from the PDF/DOCX document
    console.log(`[PARSER]: Extracting text from uploaded file: ${file.name} (${file.type})`);
    const rawText = await extractTextFromFile(fileBuffer, file.type, file.name);

    // 4. Pass raw text to Gemini structured parser
    console.log(`[PARSER]: Directing extracted text to Gemini 2.5 Flash for structuring...`);
    const { data: resumeData, warnings } = await parseRawResumeText(rawText);

    // 5. Save structured parsed resume record to Supabase
    console.log(`[PARSER]: Storing structured resume in resumes table for user: ${userId}`);
    const record = await saveParsedResume(supabase, resumeData, rawText, sessionId, userId);

    console.log(`[PARSER]: Ingestion successfully completed for record ID: ${record.id}`);
    
    // Return record data + warnings
    return NextResponse.json({
      success: true,
      data: record,
      warnings,
    });

  } catch (err: any) {
    console.error("Ingestion API handler error:", err);
    return NextResponse.json(
      { error: { message: err.message || "An unexpected error occurred during ingestion." } },
      { status: err.status || 500 }
    );
  }
}
