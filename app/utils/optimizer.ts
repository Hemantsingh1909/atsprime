import { ResumeData, ParsedJobDescriptionFields } from "../types/database.types";

export interface KnockoutDetails {
  years_experience: { required: number | null; met: boolean; actual: number };
  degree: { required: string | null; met: boolean; actual: string };
  certifications: { required: string[]; met: boolean; missing: string[] };
}

export interface OptimizationResponse {
  tailored_resume: ResumeData;
  score_structural_completeness: number;
  score_keyword_match: number;
  score_knockout: number; // 100 if all pass, 0 if any fail
  knockout_details: KnockoutDetails;
  gaps_identified: string[];
  /**
   * The intersection of the JD's required_skills + preferred_skills that are
   * genuinely present in the candidate's resume. This is the single source of
   * truth for both the score_keyword_match calculation and the UI "Top Matched
   * Skills" list. score_keyword_match = matched_keywords.length / total_jd_skills * 100.
   */
  matched_keywords: string[];
}

export async function parseJobDescription(
  jdText: string
): Promise<ParsedJobDescriptionFields> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please check your .env.local configuration.");
  }

  const promptText = `
You are an expert ATS parser. Parse the provided job description text into the structured fields according to the responseSchema:
- required_skills: Skills/tools/languages explicitly required.
- preferred_skills: Skills/tools/languages preferred or nice-to-have.
- required_years_experience: Parse the minimum years of experience required (e.g. 5 for "5+ years"). If not specified or no years listed, return null.
- required_degree: Parse the minimum required degree level (e.g. "B.S.", "M.S.", "Ph.D."). If not specified, return null.
- required_certifications: Certifications required (e.g. "AWS Certified Solutions Architect").
- job_title: The target job title.
- seniority_level: The seniority level (e.g. "Junior", "Mid", "Senior", "Lead", "Principal").

Job Description Raw Text:
"""
${jdText}
"""

Return a single JSON object matching the provided responseSchema.
`;

  const response = await fetch(
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
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              required_skills: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              preferred_skills: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              required_years_experience: { type: "INTEGER" },
              required_degree: { type: "STRING" },
              required_certifications: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              job_title: { type: "STRING" },
              seniority_level: { type: "STRING" },
            },
            required: [
              "required_skills",
              "preferred_skills",
              "required_years_experience",
              "required_degree",
              "required_certifications",
              "job_title",
              "seniority_level",
            ],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Failed to parse JD with status ${response.status}`
    );
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response received from Gemini for JD parser.");
  }

  return JSON.parse(text) as ParsedJobDescriptionFields;
}

export async function optimizeResume(
  resume: ResumeData,
  jdText: string,
  jdFields: ParsedJobDescriptionFields
): Promise<OptimizationResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured on the server. Please check your .env.local configuration.");
  }

  const promptText = `
You are an expert ATS optimization agent and professional resume writer. Your task is to optimize the provided resume for the given job description (JD) and parsed fields.

## Core Rules for Optimization & Tailoring:
1. STRICT GROUNDING: You must ONLY rephrase, reorder, or emphasize experience that already exists in the input resume. You MUST NOT invent, guess, or fabricate any skills, tools, technologies, certifications, degrees, or achievements that are not already present in the input resume. If there is zero support for a qualification, do NOT invent it.
2. Transferable Rephrasing: Where the user's real experience is transferable, align the wording with the job description's terminology (e.g., if the resume says "managed 5 developers" and the JD asks for "team leadership," rephrase the experience bullet to highlight "team leadership").
3. Exact Job Title Matching: Align the candidate's most recent job title or professional summary title with the target job title ("${jdFields.job_title || ""}") if reasonable, logical, and truthful based on the experience details. Do not fabricate seniority (e.g. do not turn a junior role into a lead role).
4. Gaps Identification: If the job description requires skills, tools, degrees, or certifications that have ZERO support anywhere in the input resume, do NOT insert them into the tailored resume or skills list. Instead, add them explicitly to the "gaps_identified" list.
5. Section Preservation: Maintain the original resume sections: contact, summary, experience, education, and skills.

## Scoring Rules:
- matched_keywords (string[]): FIRST, compute this field. Scan the FULL input resume text (all sections: summary, experience bullets, skills lists) for each skill in the JD's required_skills and preferred_skills lists. If a skill is genuinely present (exact match OR clear semantic synonym — e.g. "JS" matches "JavaScript", "Postgres" matches "PostgreSQL"), add the JD's canonical skill string to matched_keywords. Do NOT add skills from the resume that are not in the JD's required_skills or preferred_skills lists (e.g. if the resume has "Photoshop" but the JD does not list it, it must NOT appear in matched_keywords).
- score_keyword_match (0-100): Derive this ONLY from matched_keywords. Formula: round(matched_keywords.length / max(required_skills.length + preferred_skills.length, 1) * 100). This must be consistent with matched_keywords — not independently estimated.
- score_structural_completeness (0-100): Check the structural consistency of the tailored resume (e.g. no orphaned fields, well-formatted dates, complete locations, structured contact fields).
- score_knockout (100 or 0): Binary result. If ALL required years of experience, degrees, and certifications are met, set to 100. If ANY required knockout check is failed/unmet, set to 0.
- knockout_details: Perform a strict knockout check and return detailed results comparing JD requirements:
  - Required Years of Experience (${jdFields.required_years_experience ?? "none"} years)
  - Required Degree Level ("${jdFields.required_degree || "none"}")
  - Required Certifications (${JSON.stringify(jdFields.required_certifications || [])})
  against what is demonstrable in the candidate's education and experience. Count the candidate's actual years of experience from their experience list.

Input Resume JSON:
${JSON.stringify(resume, null, 2)}

Job Description Raw Text:
"""
${jdText}
"""

Parsed Job Description Fields:
${JSON.stringify(jdFields, null, 2)}

Return a single JSON object matching the provided responseSchema.
`;

  const systemInstruction = `You are a strict ATS Resume Optimization Engine. You must tailor the user's resume without fabricating any experiences or skills. Unmet requirements must go into gaps_identified, and knockout checks must be evaluated strictly. Return the exact JSON structure specified in the schema.`;

  const response = await fetch(
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
              tailored_resume: {
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
                      required: [
                        "title",
                        "company",
                        "location",
                        "start_date",
                        "end_date",
                        "bullets",
                      ],
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
                      required: [
                        "institution",
                        "degree",
                        "field",
                        "start_date",
                        "end_date",
                      ],
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
                },
                required: [
                  "contact",
                  "summary",
                  "experience",
                  "education",
                  "skills",
                ],
              },
              score_structural_completeness: { type: "INTEGER" },
              score_keyword_match: { type: "INTEGER" },
              score_knockout: { type: "INTEGER" },
              knockout_details: {
                type: "OBJECT",
                properties: {
                  years_experience: {
                    type: "OBJECT",
                    properties: {
                      required: { type: "INTEGER" },
                      met: { type: "BOOLEAN" },
                      actual: { type: "INTEGER" },
                    },
                    required: ["required", "met", "actual"],
                  },
                  degree: {
                    type: "OBJECT",
                    properties: {
                      required: { type: "STRING" },
                      met: { type: "BOOLEAN" },
                      actual: { type: "STRING" },
                    },
                    required: ["required", "met", "actual"],
                  },
                  certifications: {
                    type: "OBJECT",
                    properties: {
                      required: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                      },
                      met: { type: "BOOLEAN" },
                      missing: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                      },
                    },
                    required: ["required", "met", "missing"],
                  },
                },
                required: ["years_experience", "degree", "certifications"],
              },
              gaps_identified: {
                type: "ARRAY",
                items: { type: "STRING" },
              },
              matched_keywords: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "The subset of the JD required_skills + preferred_skills that are genuinely present in the candidate's resume. Used as the source of truth for score_keyword_match and the UI Top Matched Skills list.",
              },
            },
            required: [
              "tailored_resume",
              "score_structural_completeness",
              "score_keyword_match",
              "score_knockout",
              "knockout_details",
              "gaps_identified",
              "matched_keywords",
            ],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.error?.message || `Gemini API call failed with status ${response.status}`
    );
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response received from Gemini.");
  }

  const optResult = JSON.parse(text) as OptimizationResponse;

  // Mechanically enforce score_keyword_match = matched_keywords.length / total_jd_skills.
  // This overwrites whatever Gemini returned, closing KL-001: the score is now guaranteed
  // to be consistent with the matched_keywords list by construction, not by model compliance.
  const totalJdSkills =
    (jdFields.required_skills?.length ?? 0) +
    (jdFields.preferred_skills?.length ?? 0);
  optResult.score_keyword_match =
    totalJdSkills > 0
      ? Math.round((optResult.matched_keywords.length / totalJdSkills) * 100)
      : 0;

  return optResult;
}

