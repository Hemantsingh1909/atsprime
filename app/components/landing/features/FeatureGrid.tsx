"use client";

import { FileDiff, Gauge, FilePenLine, FolderKanban, Download } from "lucide-react";

import FeatureCard from "./FeatureCard";

import ATSPreview from "./ATSPreview";
import ResumeDiffPreview from "./ResumeDiffPreview";
import CoverLetterPreview from "./CoverLetterPreview";
import VersionPreview from "./VersionPreview";
import ExportPreview from "./ExportPreview";

export default function FeatureGrid() {
  return (
    <div
      className="
        mt-20
        grid
        auto-rows-[340px]
        gap-6

        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {/* Resume Diff */}

      <FeatureCard
        title="AI Resume Tailoring"
        description="Transform weak resume bullets into recruiter-ready achievements."
        icon={<FileDiff size={22} />}
        className="xl:col-span-2"
      >
        <ResumeDiffPreview />
      </FeatureCard>

      {/* ATS */}

      <FeatureCard
        title="ATS Optimization"
        description="Improve recruiter compatibility with AI-powered keyword analysis."
        icon={<Gauge size={22} />}
      >
        <ATSPreview />
      </FeatureCard>

      {/* Cover Letter */}

      <FeatureCard
        title="Cover Letter Generator"
        description="Generate personalized cover letters in seconds."
        icon={<FilePenLine size={22} />}
      >
        <CoverLetterPreview />
      </FeatureCard>

      {/* Export */}

      <FeatureCard
        title="Export Anywhere"
        description="Download PDF, DOCX, or copy your optimized resume instantly."
        icon={<Download size={22} />}
      >
        <ExportPreview />
      </FeatureCard>

      {/* Resume Versions */}

      <FeatureCard
        title="Resume Versions"
        description="Keep a tailored resume for every company you apply to."
        icon={<FolderKanban size={22} />}
        className="xl:col-span-3"
      >
        <VersionPreview />
      </FeatureCard>
    </div>
  );
}