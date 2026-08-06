"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Overlay() {
  const { scrollYProgress } = useScroll({
    // Use the whole document; the Overlay is positioned absolutely
  });

  const yCenter = useTransform(scrollYProgress, [0, 0.3], [0, -30]);
  const opacityCenter = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const yLeft = useTransform(scrollYProgress, [0.3, 0.5], [30, -20]);
  const opacityLeft = useTransform(scrollYProgress, [0.25, 0.35], [0, 1]);

  const yRight = useTransform(scrollYProgress, [0.6, 0.8], [40, -10]);
  const opacityRight = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
      {/* Center title at 0% */}
      <motion.div
        style={{ y: yCenter, opacity: opacityCenter }}
        className="absolute center max-w-xl text-center px-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white">My Name. Creative Developer.</h1>
      </motion.div>

      {/* Left aligned at 30% */}
      <motion.div
        style={{ y: yLeft, opacity: opacityLeft }}
        className="absolute left-8 top-1/3 max-w-md"
      >
        <h2 className="text-3xl font-semibold text-white">I build digital experiences.</h2>
      </motion.div>

      {/* Right aligned at 60% */}
      <motion.div
        style={{ y: yRight, opacity: opacityRight }}
        className="absolute right-8 top-1/2 max-w-md text-right"
      >
        <h2 className="text-3xl font-semibold text-white">Bridging design and engineering.</h2>
      </motion.div>
    </div>
  );
}
