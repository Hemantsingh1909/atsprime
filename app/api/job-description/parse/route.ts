import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseJobDescription } from "@/app/utils/optimizer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(request: Request) {
  try {
    // 1. Authenticate request via bearer token to preserve RLS context
    const authHeader = request.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json(
        { error: { message: "Authorization token is required to parse job descriptions securely." } },
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
    const { raw_text } = body;

    if (!raw_text || raw_text.trim().length < 20) {
      return NextResponse.json(
        { error: { message: "Job description text is too short or empty." } },
        { status: 400 }
      );
    }

    // 3. Parse via Gemini loop
    const parsedFields = await parseJobDescription(raw_text);

    // 4. Save to job_descriptions table
    const { data: jdRecord, error: dbError } = await supabase
      .from("job_descriptions")
      .insert({
        user_id: userId,
        raw_text: raw_text,
        parsed_fields: parsedFields,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Failed to save parsed job description:", dbError);
      return NextResponse.json(
        { error: { message: `Database save failed: ${dbError.message}` } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: jdRecord,
    });

  } catch (err: any) {
    console.error("JD parse error:", err);
    return NextResponse.json(
      { error: { message: err.message || "An unexpected error occurred during job description parsing." } },
      { status: 500 }
    );
  }
}
