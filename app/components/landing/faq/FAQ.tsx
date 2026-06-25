"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FAQItem from "./FAQItem";
import SupportCard from "./SupportCard";

const faqs = [
  {
    question: "Will ResumeAI rewrite my entire resume?",
    answer:
      "No. ResumeAI improves your existing resume by rewriting bullet points, optimizing ATS keywords, and tailoring it for each job while preserving your actual experience and achievements.",
  },
  {
    question: "Will my resume pass Applicant Tracking Systems (ATS)?",
    answer:
      "ResumeAI analyzes your resume against a job description and recommends improvements commonly associated with stronger ATS compatibility. Because employers use different ATS platforms, no tool can guarantee passing every system.",
  },
  {
    question: "Can I tailor my resume for different companies?",
    answer:
      "Yes. Create and save multiple tailored versions of your resume for different companies and roles, making every application more relevant without starting from scratch.",
  },
  {
    question: "Do I need to upload my resume every time?",
    answer:
      "No. Upload your resume once, then reuse it to generate tailored versions for as many job descriptions as you like.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "ResumeAI supports PDF and DOCX uploads and exports, making it easy to edit, download, and submit your resume wherever you're applying.",
  },
  {
    question: "Is my resume data secure?",
    answer:
      "Yes. Your resumes belong to you. We do not share your documents with employers or third parties without your permission.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. There are no long-term contracts. Upgrade, downgrade, or cancel your subscription whenever you need.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes. You can start with the Free plan to experience ResumeAI before upgrading to unlock unlimited resume tailoring and premium AI features.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-indigo-200/50 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300 backdrop-blur-sm">
            FAQ
          </span>

          <h2 className="mt-8 text-4xl font-bold tracking-tight md:text-5xl text-zinc-900 dark:text-white">
            Questions?
            <br />
            We&apos;ve got answers.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Everything you need to know before using ResumeAI.
          </p>
        </motion.div>

        {/* FAQ */}

        <div className="mt-20 space-y-5">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(
                  openIndex === index
                    ? null
                    : index
                )
              }
            />
          ))}
        </div>

         <SupportCard />
      </div>
    </section>
  );
}