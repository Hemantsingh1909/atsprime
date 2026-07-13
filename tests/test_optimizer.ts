import * as dotenv from "dotenv";
import * as path from "path";
import { optimizeResume } from "../app/utils/optimizer";
import { ResumeData, ParsedJobDescriptionFields } from "../app/types/database.types";

// Load local environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Mock Resume 1: Frontend Developer (Jane Doe)
const mockResume1: ResumeData = {
  contact: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    location: "San Francisco, CA",
    links: [
      { label: "GitHub", url: "https://github.com/janedoe" }
    ]
  },
  summary: "Frontend Developer experienced in building web layouts and responsive UI applications using React and vanilla HTML/CSS.",
  experience: [
    {
      title: "Software Engineer I",
      company: "WebCrafters LLC",
      location: "San Francisco, CA",
      start_date: "Jan 2022",
      end_date: "Present",
      bullets: [
        "Responsible for building modular React components for core web portals.",
        "Styled responsive web pages using CSS Grid, Flexbox, and HTML5.",
        "Collaborated with design teams to translate mockups into working user interfaces."
      ]
    }
  ],
  education: [
    {
      institution: "San Francisco State University",
      degree: "B.S.",
      field: "Computer Science",
      start_date: "Sep 2018",
      end_date: "Dec 2021"
    }
  ],
  skills: [
    {
      category: "Frontend Development",
      list: ["React", "JavaScript", "HTML5", "CSS3", "Responsive Design"]
    }
  ]
};

// Mock JD 1: Senior React Developer requiring AWS skills, MS Degree, and AWS Certification
const mockJdText1 = `
We are looking for a Senior React Engineer.
You will lead our frontend architecture, improve Core Web Vitals, and deploy features on AWS.
Qualifications:
- M.S. in Computer Science or related fields.
- 5+ years of experience in frontend development.
- Required Certification: AWS Certified Developer Associate.
- Required Skills: React, Next.js, TypeScript, AWS S3.
`;

const mockJdFields1: ParsedJobDescriptionFields = {
  job_title: "Senior React Engineer",
  seniority_level: "Senior",
  required_years_experience: 5,
  required_degree: "M.S.",
  required_certifications: ["AWS Certified Developer Associate"],
  required_skills: ["React", "Next.js", "TypeScript", "AWS S3"],
  preferred_skills: ["Core Web Vitals"]
};

// Mock Resume 2: Backend Developer (John Smith)
const mockResume2: ResumeData = {
  contact: {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-987-6543",
    location: "New York, NY",
    links: []
  },
  summary: "Detail-oriented Backend Developer with 3 years of hands-on experience building scalable Java APIs and database schemas.",
  experience: [
    {
      title: "Backend Engineer",
      company: "DataSystems Inc",
      location: "New York, NY",
      start_date: "Mar 2023",
      end_date: "Present",
      bullets: [
        "Designed and implemented REST APIs using Java and Spring Boot.",
        "Optimized MySQL database query performance and configured connection pools.",
        "Collaborated with frontend developers to integrate APIs into core application views."
      ]
    }
  ],
  education: [
    {
      institution: "New York Institute of Technology",
      degree: "B.S.",
      field: "Information Technology",
      start_date: "Sep 2019",
      end_date: "Dec 2022"
    }
  ],
  skills: [
    {
      category: "Backend",
      list: ["Java", "Spring Boot", "MySQL", "REST APIs", "Git"]
    }
  ]
};

// Mock JD 2: Java Backend Developer matching John's degree and years, but asking for PostgreSQL and Oracle Java Certification
const mockJdText2 = `
Looking for a Java Backend Developer.
Requirements:
- B.S. in Computer Science or Information Technology.
- 2+ years of experience in backend development.
- Oracle Certified Professional: Java SE Developer certification is a plus.
- Skills: Java, Spring Boot, PostgreSQL, Docker.
`;

const mockJdFields2: ParsedJobDescriptionFields = {
  job_title: "Java Backend Developer",
  seniority_level: "Mid",
  required_years_experience: 2,
  required_degree: "B.S.",
  required_certifications: ["Oracle Certified Professional: Java SE Developer"],
  required_skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
  preferred_skills: []
};

// Mock Resume 3: Junior Frontend developer with exactly 1 year of experience and absolutely zero cloud/infrastructure experience
const mockResume3: ResumeData = {
  contact: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    location: "San Francisco, CA",
    links: []
  },
  summary: "Junior Web Developer with 1 year of experience building basic HTML/CSS layouts and simple Javascript interactions.",
  experience: [
    {
      title: "Junior Web Developer",
      company: "Local Web LLC",
      location: "San Francisco, CA",
      start_date: "Jan 2025",
      end_date: "Dec 2025",
      bullets: [
        "Wrote simple HTML and CSS markup for local business websites.",
        "Created basic client-side image galleries using JavaScript."
      ]
    }
  ],
  education: [
    {
      institution: "SF Community College",
      degree: "Associate Degree",
      field: "Web Design",
      start_date: "Sep 2023",
      end_date: "Jun 2024"
    }
  ],
  skills: [
    {
      category: "Web Core",
      list: ["HTML", "CSS", "JavaScript"]
    }
  ]
};

// Mock JD 3: Principal Cloud Architect (Unrealistic target for Jane)
const mockJdText3 = `
We are looking for a Principal Cloud Architect to lead our cloud infrastructure division.
Requirements:
- Ph.D. in Computer Science.
- 10+ years of experience in enterprise cloud architecture.
- Deep expertise in Kubernetes, Docker, Terraform, and AWS cloud automation.
- Must hold AWS Certified Solutions Architect Professional and CISSP certifications.
- Must hold an active Top Secret Security Clearance.
`;

const mockJdFields3: ParsedJobDescriptionFields = {
  job_title: "Principal Cloud Architect",
  seniority_level: "Principal",
  required_years_experience: 10,
  required_degree: "Ph.D.",
  required_certifications: [
    "AWS Certified Solutions Architect Professional",
    "CISSP",
    "Top Secret Security Clearance"
  ],
  required_skills: ["Kubernetes", "Docker", "Terraform", "AWS", "Cloud Architecture"],
  preferred_skills: []
};

async function runTests() {
  console.log("==========================================");
  console.log("STARTING ADJUSTED ATS CORE OPTIMIZATION LOOP TESTS");
  console.log("==========================================\n");

  try {
    // Test Case 1
    console.log("--- TEST CASE 1: Jane Doe (Frontend) to Senior React Engineer (High Gap/Failed Knockouts) ---");
    console.log("Target JD Title:", mockJdFields1.job_title);
    console.log("Required Exp:", mockJdFields1.required_years_experience, "years");
    console.log("Required Certs:", mockJdFields1.required_certifications);
    console.log("Optimizing...");

    const result1 = await optimizeResume(mockResume1, mockJdText1, mockJdFields1);

    console.log(">>> OUTPUT 1 RESULTS <<<");
    console.log("Tailored Resume Title:", result1.tailored_resume.experience[0]?.title);
    console.log("Sub-Scores:");
    console.log("  - Structural Completeness:", result1.score_structural_completeness);
    console.log("  - Keyword Match Score:", result1.score_keyword_match);
    console.log("  - Knockout Score (Binary):", result1.score_knockout);
    console.log("Matched Keywords:", result1.matched_keywords);
    const total1 = (mockJdFields1.required_skills?.length ?? 0) + (mockJdFields1.preferred_skills?.length ?? 0);
    const expected1 = total1 > 0 ? Math.round((result1.matched_keywords.length / total1) * 100) : 0;
    const agree1 = result1.score_keyword_match === expected1;
    console.log(`Score/List Agreement: score=${result1.score_keyword_match}, formula=${expected1}, match=${agree1 ? "PASS ✓" : "FAIL ✗"}`);
    console.log("Knockout Details:", JSON.stringify(result1.knockout_details, null, 2));
    console.log("Identified Gaps:", result1.gaps_identified);
    console.log("Tailored Summary:", result1.tailored_resume.summary);
    console.log("Tailored Experience Bullets:", result1.tailored_resume.experience[0]?.bullets);
    console.log("Tailored Skills List:", JSON.stringify(result1.tailored_resume.skills, null, 2));
    console.log("------------------------------------------\n");

    // Test Case 2
    console.log("--- TEST CASE 2: John Smith (Backend) to Java Backend Developer (Good Match/Missing Cert Gap) ---");
    console.log("Target JD Title:", mockJdFields2.job_title);
    console.log("Required Exp:", mockJdFields2.required_years_experience, "years");
    console.log("Required Certs:", mockJdFields2.required_certifications);
    console.log("Optimizing...");

    const result2 = await optimizeResume(mockResume2, mockJdText2, mockJdFields2);

    console.log(">>> OUTPUT 2 RESULTS <<<");
    console.log("Tailored Resume Title:", result2.tailored_resume.experience[0]?.title);
    console.log("Sub-Scores:");
    console.log("  - Structural Completeness:", result2.score_structural_completeness);
    console.log("  - Keyword Match Score:", result2.score_keyword_match);
    console.log("  - Knockout Score (Binary):", result2.score_knockout);
    console.log("Matched Keywords:", result2.matched_keywords);
    const total2 = (mockJdFields2.required_skills?.length ?? 0) + (mockJdFields2.preferred_skills?.length ?? 0);
    const expected2 = total2 > 0 ? Math.round((result2.matched_keywords.length / total2) * 100) : 0;
    const agree2 = result2.score_keyword_match === expected2;
    console.log(`Score/List Agreement: score=${result2.score_keyword_match}, formula=${expected2}, match=${agree2 ? "PASS ✓" : "FAIL ✗"}`);
    console.log("Knockout Details:", JSON.stringify(result2.knockout_details, null, 2));
    console.log("Identified Gaps:", result2.gaps_identified);
    console.log("Tailored Summary:", result2.tailored_resume.summary);
    console.log("Tailored Experience Bullets:", result2.tailored_resume.experience[0]?.bullets);
    console.log("Tailored Skills List:", JSON.stringify(result2.tailored_resume.skills, null, 2));
    console.log("------------------------------------------\n");

    // Test Case 3 (Stress Test Case)
    console.log("--- TEST CASE 3: Jane Doe (Junior/1 Year Exp) to Principal Cloud Architect (Extreme Mismatch) ---");
    console.log("Target JD Title:", mockJdFields3.job_title);
    console.log("Required Exp:", mockJdFields3.required_years_experience, "years");
    console.log("Required Certs:", mockJdFields3.required_certifications);
    console.log("Optimizing...");

    const result3 = await optimizeResume(mockResume3, mockJdText3, mockJdFields3);

    console.log(">>> OUTPUT 3 RESULTS <<<");
    console.log("Tailored Resume Title:", result3.tailored_resume.experience[0]?.title);
    console.log("Sub-Scores:");
    console.log("  - Structural Completeness:", result3.score_structural_completeness);
    console.log("  - Keyword Match Score:", result3.score_keyword_match);
    console.log("  - Knockout Score (Binary):", result3.score_knockout);
    console.log("Matched Keywords:", result3.matched_keywords);
    const total3 = (mockJdFields3.required_skills?.length ?? 0) + (mockJdFields3.preferred_skills?.length ?? 0);
    const expected3 = total3 > 0 ? Math.round((result3.matched_keywords.length / total3) * 100) : 0;
    const agree3 = result3.score_keyword_match === expected3;
    console.log(`Score/List Agreement: score=${result3.score_keyword_match}, formula=${expected3}, match=${agree3 ? "PASS ✓" : "FAIL ✗"}`);
    console.log("Knockout Details:", JSON.stringify(result3.knockout_details, null, 2));
    console.log("Identified Gaps:", result3.gaps_identified);
    console.log("Tailored Summary:", result3.tailored_resume.summary);
    console.log("Tailored Experience Bullets:", result3.tailored_resume.experience[0]?.bullets);
    console.log("Tailored Skills List:", JSON.stringify(result3.tailored_resume.skills, null, 2));
    console.log("==========================================");

  } catch (err) {
    console.error("Test execution failed:", err);
  }
}

runTests();
