"use client";

import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useScrollProgress } from './ScrollyCanvas';

export default function Overlay() {
  // Get the scroll progress from ScrollyCanvas context
  const scrollYProgress = useScrollProgress();

  // center: visible at start, fades quickly
  const centerY = useTransform(scrollYProgress, [0, 0.12], [0, -30]);
  const centerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // left: appears near 30%
  const leftY = useTransform(scrollYProgress, [0.25, 0.38], [30, -20]);
  const leftOpacity = useTransform(scrollYProgress, [0.25, 0.38], [0, 1]);

  // right: appears near 60%
  const rightY = useTransform(scrollYProgress, [0.55, 0.7], [30, -10]);
  const rightOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <motion.div style={{ y: centerY, opacity: centerOpacity }} className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center">My Name. Creative Developer.</h1>
      </motion.div>

      <motion.div style={{ y: leftY, opacity: leftOpacity }} className="absolute left-8 top-1/3 max-w-md">
        <h2 className="text-3xl font-semibold text-white">I build digital experiences.</h2>
      </motion.div>

      <motion.div style={{ y: rightY, opacity: rightOpacity }} className="absolute right-8 top-1/2 max-w-md text-right">
        <h2 className="text-3xl font-semibold text-white">Bridging design and engineering.</h2>
      </motion.div>
    </div>
  );
}
