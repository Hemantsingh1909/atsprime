"use client";
import { motion } from "framer-motion";

type Light = {
  id: number;
  top: number;
  left: number;
  duration: number;
};

const lights: Light[] = [
  { id: 0, top: 8, left: 12, duration: 4 },
  { id: 1, top: 22, left: 68, duration: 4.3 },
  { id: 2, top: 31, left: 34, duration: 4.6 },
  { id: 3, top: 14, left: 83, duration: 4.9 },
  { id: 4, top: 57, left: 20, duration: 5.2 },
  { id: 5, top: 66, left: 71, duration: 5.5 },
  { id: 6, top: 72, left: 42, duration: 5.8 },
  { id: 7, top: 49, left: 10, duration: 6.1 },
  { id: 8, top: 8, left: 52, duration: 6.4 },
  { id: 9, top: 37, left: 89, duration: 6.7 },
  { id: 10, top: 55, left: 24, duration: 7 },
  { id: 11, top: 69, left: 60, duration: 7.3 },
  { id: 12, top: 12, left: 41, duration: 7.6 },
  { id: 13, top: 49, left: 78, duration: 7.9 },
  { id: 14, top: 22, left: 15, duration: 8.2 },
  { id: 15, top: 64, left: 31, duration: 8.5 },
  { id: 16, top: 81, left: 56, duration: 8.8 },
  { id: 17, top: 29, left: 92, duration: 9.1 },
];

export default function FloatingBlobs() {

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Purple Blob */}
      <motion.div
        animate={{ x: [0, 80, -40, 0], y: [0, -50, 60, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-120px] top-[-80px] h-[420px] w-[420px] rounded-full bg-violet-500/20 blur-[120px]"
      />

      {/* Blue Blob */}
      <motion.div
        animate={{ x: [0, -60, 50, 0], y: [0, 40, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-100px] top-[120px] h-[360px] w-[360px] rounded-full bg-sky-500/15 blur-[110px]"
      />

      {/* Pink Blob */}
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, 50, -40, 0], scale: [1, 1.05, 0.92, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-120px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]"
      />

      {/* Tiny floating lights */}
      {lights.map((light) => (
        <motion.div
          key={light.id}
          initial={{ opacity: 0.15 }}
          animate={{ y: [-10, 10, -10], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: light.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/40 dark:bg-white/20"
          style={{ top: `${light.top}%`, left: `${light.left}%` }}
          suppressHydrationWarning
        />
      ))}
    </div>
  );
}