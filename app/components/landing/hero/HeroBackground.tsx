"use client";

import FloatingBlobs from "./FloatingBlobs";

export default function HeroBackground() {
  return (
    <>
      {/* Animated blobs */}
      <FloatingBlobs />

      {/* Grid - more subtle */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,#e4e4e70a_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e70a_1px,transparent_1px)]
          bg-[size:80px_80px]
          dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]
        "
      />

      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#FAFBFC_70%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#09090B_70%)]" />

      {/* Premium gradient glow - refined */}
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-400/15 via-purple-400/10 to-transparent blur-[140px]" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-gradient-to-bl from-blue-400/10 via-indigo-400/5 to-transparent blur-[120px]" />
    </>
  );
}