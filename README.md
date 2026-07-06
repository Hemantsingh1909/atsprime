# ATSPrime

Your resume's AI copilot. ATSPrime analyzes your resume against a job description and helps you tailor it to pass Applicant Tracking Systems (ATS) and stand out to recruiters.

**Live site:** [atsprime.in](https://atsprime.in)

## Tech Stack
- **Frontend & Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion
- **Auth & Database:** Supabase
- **AI:** Google Gemini 2.5 Flash (structured JSON output via responseSchema)
- **Resume Parsing:** unpdf (PDF), mammoth (DOCX)
- **Export:** docx (npm), custom PDF generation
- **Observability:** Sentry, PostHog
- **Testing:** Playwright (e2e + visual regression)

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`:
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it locally.

## Running Tests

This project uses Playwright for end-to-end testing:

```bash
npx playwright test
```

## Why I built this

Job hunting means tailoring dozens of resumes to match specific job descriptions — a slow, repetitive process. ATSPrime automates that tailoring while keeping the output honest and accurate to the user's real experience, rather than fabricating skills or inflating claims.

## Contact

Built by Hemant Satwal — [hemantingh1909@gmail.com](mailto:hemantingh1909@gmail.com) · [LinkedIn](https://www.linkedin.com/in/hemantsatwal/) · [Portfolio](https://hemantsatwal.in)
