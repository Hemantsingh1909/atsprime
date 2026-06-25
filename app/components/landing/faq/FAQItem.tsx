"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQItemProps) {
  const contentId = useId();

  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-zinc-200/50
        bg-white/60
        backdrop-blur-sm
        transition-all
        duration-300
        hover:border-indigo-200/50
        hover:shadow-md
        dark:border-zinc-800/50
        dark:bg-zinc-900/40
        dark:hover:border-indigo-500/20
      "
    >
      {/* Button */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-6
          px-6
          py-5
          text-left
          transition-colors
        "
      >
        <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
          {question}
        </h3>

        <motion.div
          animate={{
            rotate: isOpen ? 45 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-indigo-100/50
            dark:bg-indigo-500/10
            text-indigo-600
            dark:text-indigo-400
            transition-colors
            group-hover:bg-indigo-100
            dark:group-hover:bg-indigo-500/20
          "
        >
          <Plus size={18} strokeWidth={2} />
        </motion.div>
      </button>

      {/* Answer */}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            key="content"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{
                y: -10,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: -10,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                border-t
                border-zinc-200/30
                dark:border-zinc-800/50
                px-6
                py-5
              "
            >
              <p className="leading-relaxed text-sm text-zinc-600 dark:text-zinc-400">
                {answer}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}