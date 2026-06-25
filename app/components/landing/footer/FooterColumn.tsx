"use client";

import Link from "next/link";

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export default function FooterColumn({
  title,
  links,
}: FooterColumnProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">
        {title}
      </h4>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="
                text-sm
                text-zinc-600
                transition-colors
                hover:text-violet-600
                dark:text-zinc-400
                dark:hover:text-violet-400
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}