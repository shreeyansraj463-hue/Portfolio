"use client";

import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  { title: 'Project A', desc: 'Immersive brand experience with generative motion.' },
  { title: 'Project B', desc: 'Interactive product prototype — Three.js & WebGL.' },
  { title: 'Project C', desc: 'Scrollytelling & data visualization.' },
  { title: 'Project D', desc: 'High-performance web app with refined UX.' },
];

export default function Projects() {
  return (
    <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-12 px-6">
      {projects.map((p, i) => (
        <motion.article
          key={i}
          whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}
          className="glass p-6 rounded-xl transition-shadow"
          style={{ WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="h-40 rounded-md bg-gradient-to-br from-white/3 to-white/2 mb-4 flex items-end p-4">
            <h3 className="text-xl font-semibold text-white">{p.title}</h3>
          </div>
          <p className="text-white/70">{p.desc}</p>
          <div className="mt-4">
            <button className="text-sm px-3 py-2 border border-white/10 rounded-md text-white/90 hover:bg-white/3">View case study</button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
