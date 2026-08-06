# Portfolio Scrollytelling

This repository contains a Next.js 14 (App Router) TypeScript starter for a high-end scrollytelling personal portfolio using an image-sequence scrubbed via an HTML5 Canvas.

What is included:
- A client-side ScrollyCanvas component that preloads a sequence of WebP frames from /public/sequence and scrubs them via scroll (Framer Motion)
- Overlay component with parallax text sections
- Projects grid with glassmorphism cards
- TailwindCSS + PostCSS configuration

Getting started

1. Install dependencies

```bash
npm install
# or
# yarn
```

2. Add your sequence frames to `public/sequence/` named like `frame_00_delay-0.067s.webp` ...

3. Run dev server

```bash
npm run dev
```

Notes & next steps
- For large sequences consider chunked loading or a compressed sprite approach to reduce memory on mobile.
- Fine-tune Framer Motion spring values in `components/ScrollyCanvas.tsx` for the desired scrub feel.
