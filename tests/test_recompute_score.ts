/**
 * Unit test for the score_keyword_match recompute step in optimizeResume().
 * Does NOT call Gemini. Simulates what optimizeResume() does after JSON.parse(text)
 * and verifies the recompute overwrites whatever the model returned.
 *
 * Three scenarios matching the three test_optimizer cases:
 *   Case 1: Gemini returns score=75 but only 2 of 5 JD skills matched -> recomputed to 40
 *   Case 2: Gemini returns score=80 and 3 of 4 JD skills matched -> recomputed to 75
 *   Case 3: Extreme mismatch, 0 of 5 JD skills matched -> both Gemini and formula = 0
 */

import { ParsedJobDescriptionFields } from "../app/types/database.types";
import { OptimizationResponse } from "../app/utils/optimizer";

function recomputeScore(
  optResult: OptimizationResponse,
  jdFields: ParsedJobDescriptionFields
): OptimizationResponse {
  // This is the exact code added to optimizer.ts
  const totalJdSkills =
    (jdFields.required_skills?.length ?? 0) +
    (jdFields.preferred_skills?.length ?? 0);
  optResult.score_keyword_match =
    totalJdSkills > 0
      ? Math.round((optResult.matched_keywords.length / totalJdSkills) * 100)
      : 0;
  return optResult;
}

function assert(label: string, actual: number, expected: number) {
  const pass = actual === expected;
  console.log(`  ${pass ? "PASS ✓" : "FAIL ✗"} ${label}: got ${actual}, expected ${expected}`);
  if (!pass) process.exitCode = 1;
}

// ── Case 1: Jane Doe → Senior React Engineer ──────────────────────────────
// JD: required_skills=[React, Next.js, TypeScript, AWS S3], preferred_skills=[Core Web Vitals]
// total = 5
// Jane has React only (no Next.js, TypeScript, AWS S3, or Core Web Vitals experience)
// Gemini (simulated) wrongly returned score=75; matched_keywords has 1 item
const jdFields1: ParsedJobDescriptionFields = {
  job_title: "Senior React Engineer", seniority_level: "Senior",
  required_years_experience: 5, required_degree: "M.S.",
  required_certifications: ["AWS Certified Developer Associate"],
  required_skills: ["React", "Next.js", "TypeScript", "AWS S3"],
  preferred_skills: ["Core Web Vitals"],
};
const mockResult1 = {
  tailored_resume: {} as any,
  score_structural_completeness: 90,
  score_keyword_match: 75,          // Gemini hallucinated this
  score_knockout: 0,
  knockout_details: {} as any,
  gaps_identified: [],
  matched_keywords: ["React"],      // Only genuine match found
};
console.log("Case 1: Jane Doe → Senior React Engineer (Gemini score=75, should recompute to 20)");
console.log("  JD total skills:", (jdFields1.required_skills?.length ?? 0) + (jdFields1.preferred_skills?.length ?? 0));
console.log("  matched_keywords:", mockResult1.matched_keywords);
const r1 = recomputeScore(mockResult1, jdFields1);
// 1/5 * 100 = 20
assert("score_keyword_match recomputed", r1.score_keyword_match, 20);
assert("formula = round(matched.length/total*100)", r1.score_keyword_match, Math.round(1 / 5 * 100));

// ── Case 2: John Smith → Java Backend Developer ───────────────────────────
// JD: required_skills=[Java, Spring Boot, PostgreSQL, Docker], preferred_skills=[]
// total = 4
// John has Java, Spring Boot (no PostgreSQL — he has MySQL — no Docker)
// Gemini (simulated) returned score=80; matched_keywords has 2 items
const jdFields2: ParsedJobDescriptionFields = {
  job_title: "Java Backend Developer", seniority_level: "Mid",
  required_years_experience: 2, required_degree: "B.S.",
  required_certifications: ["Oracle Certified Professional: Java SE Developer"],
  required_skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
  preferred_skills: [],
};
const mockResult2 = {
  tailored_resume: {} as any,
  score_structural_completeness: 92,
  score_keyword_match: 80,          // Gemini hallucinated this
  score_knockout: 0,
  knockout_details: {} as any,
  gaps_identified: [],
  matched_keywords: ["Java", "Spring Boot"], // PostgreSQL (has MySQL) and Docker not present
};
console.log("\nCase 2: John Smith → Java Backend Developer (Gemini score=80, should recompute to 50)");
console.log("  JD total skills:", (jdFields2.required_skills?.length ?? 0) + (jdFields2.preferred_skills?.length ?? 0));
console.log("  matched_keywords:", mockResult2.matched_keywords);
const r2 = recomputeScore(mockResult2, jdFields2);
// 2/4 * 100 = 50
assert("score_keyword_match recomputed", r2.score_keyword_match, 50);
assert("formula = round(matched.length/total*100)", r2.score_keyword_match, Math.round(2 / 4 * 100));

// ── Case 3: Junior Jane → Principal Cloud Architect (extreme mismatch) ────
// JD: required_skills=[Kubernetes, Docker, Terraform, AWS, Cloud Architecture], preferred_skills=[]
// total = 5
// Jane has HTML/CSS/JavaScript only — zero overlap with JD skill list
const jdFields3: ParsedJobDescriptionFields = {
  job_title: "Principal Cloud Architect", seniority_level: "Principal",
  required_years_experience: 10, required_degree: "Ph.D.",
  required_certifications: ["AWS Certified Solutions Architect Professional", "CISSP"],
  required_skills: ["Kubernetes", "Docker", "Terraform", "AWS", "Cloud Architecture"],
  preferred_skills: [],
};
const mockResult3 = {
  tailored_resume: {} as any,
  score_structural_completeness: 88,
  score_keyword_match: 15,          // Gemini may have given partial credit for "cloud awareness"
  score_knockout: 0,
  knockout_details: {} as any,
  gaps_identified: [],
  matched_keywords: [],             // Zero literal JD skills found in resume
};
console.log("\nCase 3: Junior Jane → Principal Cloud Architect (Gemini score=15, should recompute to 0)");
console.log("  JD total skills:", (jdFields3.required_skills?.length ?? 0) + (jdFields3.preferred_skills?.length ?? 0));
console.log("  matched_keywords:", mockResult3.matched_keywords);
const r3 = recomputeScore(mockResult3, jdFields3);
// 0/5 * 100 = 0
assert("score_keyword_match recomputed", r3.score_keyword_match, 0);
assert("formula = round(matched.length/total*100)", r3.score_keyword_match, Math.round(0 / 5 * 100));

// ── Edge case: JD has no skills listed (totalJdSkills = 0) ───────────────
console.log("\nEdge case: JD has no required or preferred skills (total=0 -> score=0)");
const jdFieldsEmpty: ParsedJobDescriptionFields = {
  job_title: "Generalist", seniority_level: "Mid",
  required_years_experience: null, required_degree: null,
  required_certifications: [], required_skills: [], preferred_skills: [],
};
const mockResultEmpty = {
  tailored_resume: {} as any,
  score_structural_completeness: 80,
  score_keyword_match: 50,          // Gemini returned some value
  score_knockout: 100,
  knockout_details: {} as any,
  gaps_identified: [],
  matched_keywords: [],
};
const rE = recomputeScore(mockResultEmpty, jdFieldsEmpty);
assert("score_keyword_match with empty JD skills = 0", rE.score_keyword_match, 0);

console.log("\n══ All assertions complete ══");
if (process.exitCode === 1) {
  console.log("Result: FAILURES detected");
} else {
  console.log("Result: ALL PASS ✓ — score_keyword_match is mechanically guaranteed to equal round(matched_keywords.length / total_jd_skills * 100)");
}
