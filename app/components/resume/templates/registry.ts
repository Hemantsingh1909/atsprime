import dynamic from "next/dynamic";
import { TemplateMetadata, ResumeData } from "@/app/types/resume";

// Lazy-load template components for better performance
export const templateComponents: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  classic: dynamic(() => import("./ATSClassic")),
  modern: dynamic(() => import("./Modern")),
  executive: dynamic(() => import("./Executive")),
  harvard: dynamic(() => import("./Harvard")),
  minimal: dynamic(() => import("./Minimal")),
  creative: dynamic(() => import("./Creative")),
  corporate: dynamic(() => import("./Corporate")),
};

export const templatesList: TemplateMetadata[] = [
  {
    id: "classic",
    name: "Classic Harvard",
    desc: "Conservative serif academic layout optimized for strict corporate standards.",
    isPremium: false,
    atsScore: 98,
    isPopular: true,
  },
  {
    id: "modern",
    name: "Modern Tech Sidebar",
    desc: "A bold, dual-column design with a distinct metadata sidebar for technical skills.",
    isPremium: false,
    atsScore: 95,
  },
  {
    id: "executive",
    name: "Executive Bold",
    desc: "Elegant Georgia serif layout featuring dark navy accents for leadership roles.",
    isPremium: false,
    atsScore: 96,
  },
  {
    id: "harvard",
    name: "Harvard Academic",
    desc: "Centered header traditional design suited for academic, medical, or law profiles.",
    isPremium: false,
    atsScore: 97,
  },
  {
    id: "minimal",
    name: "Sleek Minimalist",
    desc: "Generous whitespace, subtle font weights, and clean tabular grid columns.",
    isPremium: false,
    atsScore: 94,
    isPopular: true,
  },
  {
    id: "creative",
    name: "Creative Neon",
    desc: "Stark dark mode aesthetic featuring gradient accents and custom mono tags.",
    isPremium: false,
    atsScore: 93,
  },
  {
    id: "corporate",
    name: "Solid Corporate",
    desc: "Calibri-inspired grid design with strong accent divider bars.",
    isPremium: false,
    atsScore: 96,
  },
];
