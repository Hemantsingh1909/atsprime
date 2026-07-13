import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { optimizeResume } from "@/app/utils/optimizer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: Request) {
  try {
    // 1. Authenticate request via bearer token to preserve RLS context
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: { message: "Authorization token is required to optimize resumes securely." } },
        { status: 401 }
      );
    }

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

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: { message: `Authentication check failed: ${userError?.message || "Invalid session token."}` } },
        { status: 401 }
      );
    }

    const userId = user.id;

    // 2. Read parameters
    const body = await request.json().catch(() => ({}));
    const { resume_id, job_description_id, session_id } = body;

    if (!resume_id || !job_description_id || !session_id) {
      return NextResponse.json(
        { error: { message: "Missing required parameters: resume_id, job_description_id, and session_id are all required." } },
        { status: 400 }
      );
    }

    // 3. Fetch Resume and Job Description from Supabase (under RLS constraints)
    const { data: resumeRecord, error: resumeError } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resume_id)
      .single();

    if (resumeError || !resumeRecord) {
      return NextResponse.json(
        { error: { message: `Failed to retrieve resume: ${resumeError?.message || "Record not found."}` } },
        { status: 404 }
      );
    }

    const { data: jdRecord, error: jdError } = await supabase
      .from("job_descriptions")
      .select("*")
      .eq("id", job_description_id)
      .single();

    if (jdError || !jdRecord) {
      return NextResponse.json(
        { error: { message: `Failed to retrieve job description: ${jdError?.message || "Record not found."}` } },
        { status: 404 }
      );
    }

    // 4. Run optimization loop
    // Cast database records to correct structures
    const inputResume = {
      contact: resumeRecord.contact,
      summary: resumeRecord.summary || "",
      experience: resumeRecord.experience || [],
      education: resumeRecord.education || [],
      skills: resumeRecord.skills || [],
    };

    const inputJdText = jdRecord.raw_text;
    const inputJdFields = jdRecord.parsed_fields;

    const optResult = await optimizeResume(inputResume, inputJdText, inputJdFields);

    // 5. Insert optimization result record into optimizations table
    const { data: optRecord, error: dbError } = await supabase
      .from("optimizations")
      .insert({
        session_id: session_id,
        user_id: userId,
        resume_id: resume_id,
        job_description_id: job_description_id,
        tailored_resume: optResult.tailored_resume,
        score_parseability: optResult.score_structural_completeness, // Map score_structural_completeness to database score_parseability column
        score_keyword_match: optResult.score_keyword_match,
        score_knockout: optResult.score_knockout, // Binary 100/0 score
        gaps_identified: optResult.gaps_identified,
        matched_keywords: optResult.matched_keywords,
        status: "draft",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to save optimization record:", dbError);
      return NextResponse.json(
        { error: { message: `Database save failed: ${dbError.message}` } },
        { status: 500 }
      );
    }

    // Return the saved record along with the detailed knockout details and structural completeness renames in the response
    return NextResponse.json({
      success: true,
      data: {
        ...optRecord,
        score_structural_completeness: optResult.score_structural_completeness,
        knockout_details: optResult.knockout_details,
        matched_keywords: optResult.matched_keywords,
      },
    });

  } catch (err: any) {
    console.error("Resume optimization error:", err);
    return NextResponse.json(
      { error: { message: err.message || "An unexpected error occurred during resume optimization." } },
      { status: 500 }
    );
  }
}
