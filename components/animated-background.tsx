'use client';

import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#07080d]"
    >
      {/* Dynamic Animated Gradient Mesh Blobs (GPU-accelerated) */}
      
      {/* Blob 1: Vibrant Indigo / Blue Flow */}
      <motion.div
        animate={{
          x: ['-10%', '12%', '-5%', '-10%'],
          y: ['-8%', '10%', '-12%', '-8%'],
          scale: [1, 1.15, 0.95, 1],
          rotate: [0, 45, 90, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[15%] -left-[10%] h-[550px] w-[550px] sm:h-[750px] sm:w-[750px] rounded-full bg-gradient-to-tr from-indigo-600/40 via-blue-500/35 to-cyan-400/25 blur-[105px] will-change-transform"
      />

      {/* Blob 2: Electric Violet / Magenta Flow */}
      <motion.div
        animate={{
          x: ['12%', '-8%', '8%', '12%'],
          y: ['8%', '-10%', '12%', '8%'],
          scale: [0.95, 1.12, 1, 0.95],
          rotate: [0, -60, -120, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[20%] -right-[15%] h-[520px] w-[520px] sm:h-[700px] sm:w-[700px] rounded-full bg-gradient-to-bl from-fuchsia-600/35 via-violet-600/35 to-indigo-700/30 blur-[110px] will-change-transform"
      />

      {/* Blob 3: Ocean Cyan / Turquoise Accent */}
      <motion.div
        animate={{
          x: ['-6%', '10%', '-10%', '-6%'],
          y: ['10%', '-8%', '6%', '10%'],
          scale: [1.1, 0.92, 1.05, 1.1],
          rotate: [0, 90, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[20%] left-[15%] h-[500px] w-[500px] sm:h-[680px] sm:w-[680px] rounded-full bg-gradient-to-tr from-cyan-500/30 via-teal-500/25 to-blue-600/20 blur-[115px] will-change-transform"
      />

      {/* Blob 4: Sunset Amber / Warm Accent (tạo chiều sâu màu sắc) */}
      <motion.div
        animate={{
          x: ['8%', '-12%', '6%', '8%'],
          y: ['-6%', '12%', '-8%', '-6%'],
          scale: [0.9, 1.1, 0.95, 0.9],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[40%] left-[25%] h-[400px] w-[400px] sm:h-[550px] sm:w-[550px] rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 blur-[120px] will-change-transform"
      />

      {/* Noise grain overlay cực nhẹ */}
      <div className="absolute inset-0 noise-bg opacity-[0.025]" />

      {/* Vignette mask nhẹ để tập trung thị giác vào trung tâm */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,13,0.65)_100%)]" />
    </div>
  );
}
