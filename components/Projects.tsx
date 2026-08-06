"use client";

import React from "react";

export default function Projects() {
  const items = [
    { title: "Project A", desc: "Immersive brand experience" },
    { title: "Project B", desc: "Product interaction design" },
    { title: "Project C", desc: "Generative visuals & motion" },
    { title: "Project D", desc: "High-performance web app" },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, idx) => (
        <article key={idx} className="glass p-6 rounded-xl hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-shadow">
          <div className="h-40 rounded-md bg-gradient-to-br from-white/3 to-white/2 mb-4 flex items-end p-4">
            <h3 className="text-xl font-semibold text-white">{it.title}</h3>
          </div>
          <p className="text-white/70">{it.desc}</p>
          <div className="mt-4">
            <button className="text-sm px-3 py-2 border border-white/10 rounded-md text-white/90 hover:bg-white/3">View case study</button>
          </div>
        </article>
      ))}
    </div>
  );
}
