// Database TypeScript Types for ATSPrime

export interface LinkItem {
  label: string;
  url: string;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: LinkItem[];
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

// Skills can be a flat list of strings or grouped by category
export type SkillsData = string[] | { category: string; list: string[] }[];

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: EducationItem[];
  skills: SkillsData;
}

export interface ResumeTableRecord {
  id: string;
  user_id: string | null;
  session_id: string;
  contact: ContactInfo;
  summary: string | null;
  experience: WorkExperience[];
  education: EducationItem[];
  skills: SkillsData;
  raw_source_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParsedJobDescriptionFields {
  required_skills: string[];
  preferred_skills: string[];
  required_years_experience: number | null;
  required_degree: string | null;
  required_certifications: string[];
  job_title: string | null;
  seniority_level: string | null;
}

export interface JobDescriptionTableRecord {
  id: string;
  user_id: string | null;
  raw_text: string;
  parsed_fields: ParsedJobDescriptionFields;
  created_at: string;
}

export interface OptimizationTableRecord {
  id: string;
  session_id: string;
  user_id: string | null;
  resume_id: string;
  job_description_id: string;
  tailored_resume: ResumeData;
  score_parseability: number;
  score_keyword_match: number;
  score_knockout: number;
  gaps_identified: string[];
  /**
   * Intersection of JD required_skills + preferred_skills genuinely found in the
   * resume. Single source of truth for both score_keyword_match and the UI list.
   */
  matched_keywords: string[];
  template_id: string | null;
  status: 'draft' | 'previewed' | 'downloaded';
  created_at: string;
  updated_at: string;
}


export interface TemplateTableRecord {
  id: string;
  name: string;
  is_premium: boolean;
  created_at: string;
}
