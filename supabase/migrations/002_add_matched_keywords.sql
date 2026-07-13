-- Migration: Add matched_keywords column to optimizations table
-- matched_keywords stores the intersection of the JD's required_skills + preferred_skills
-- that were genuinely found in the candidate's resume. This is the single source of truth
-- for both score_keyword_match (derived from this list) and the UI "Top Matched Skills"
-- section (rendered directly from this list). Prevents score/list drift.

ALTER TABLE optimizations
ADD COLUMN IF NOT EXISTS matched_keywords JSONB NOT NULL DEFAULT '[]'::jsonb;
