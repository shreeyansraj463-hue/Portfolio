"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useSpring } from "framer-motion";

type ScrollyCanvasProps = {
  frameCount?: number;
  pathPrefix?: string; // path inside /public, e.g. "/sequence/"
  fileNameFactory?: (i: number) => string;
  className?: string;
};

export default function ScrollyCanvas({
  frameCount = 90,
  pathPrefix = "/sequence/",
  fileNameFactory = (i: number) =>
    `frame_${String(i).padStart(2, "0")}_delay-0.067s.webp`,
  className,
}: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);

  // Hook up Framer Motion scroll tied to the outer container.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the progress for silky scrubbing
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  // Preload images
  useEffect(() => {
    imagesRef.current = new Array(frameCount);
    setLoadedCount(0);

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `${pathPrefix}${fileNameFactory(i)}`;
      img.decoding = "async";
      img.loading = "eager";
      img.onload = () => {
        imagesRef.current[i] = img;
        setLoadedCount((c) => c + 1);
      };
      img.onerror = () => {
        imagesRef.current[i] = img;
        setLoadedCount((c) => c + 1);
      };
    }
  }, [frameCount, pathPrefix, fileNameFactory]);

  // Resize canvas to DPR and available screen
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // draw helper: object-fit: cover
  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas;
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    const iw = img.width;
    const ih = img.height;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, cw, ch);

    ctx.drawImage(img, dx, dy, sw, sh);
  };

  // Render loop and subscription to smoothProgress
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastFrameIndex = -1;

    const unsubscribe = smoothProgress.onChange((v) => {
      const idx = Math.min(frameCount - 1, Math.max(0, Math.floor(v * frameCount)));
      currentFrameRef.current = idx;
      if (idx !== lastFrameIndex) {
        lastFrameIndex = idx;
        if (imagesRef.current[idx]) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const img = imagesRef.current[idx];
            if (img && ctx) drawImageCover(ctx, img);
          });
        }
      }
    });

    if (imagesRef.current[0]) {
      drawImageCover(ctx, imagesRef.current[0]);
    }

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, frameCount]);

  // If images finish loading, ensure we draw the current frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (loadedCount > 0) {
      const idx = currentFrameRef.current;
      const img = imagesRef.current[idx];
      if (img) drawImageCover(ctx, img);
    }
  }, [loadedCount]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[500vh] ${className ?? ""}`}
      aria-hidden
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            display: "block",
            backgroundColor: "transparent",
          }}
        />
        {loadedCount < frameCount && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-white/80 bg-black/40 px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">
              Loading frames — {Math.round((loadedCount / frameCount) * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
