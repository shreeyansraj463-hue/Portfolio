"use client";

import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { useScroll, useSpring, MotionValue } from "framer-motion";

// Create context to share scroll progress with Overlay
const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

export const useScrollProgress = () => {
  const context = useContext(ScrollProgressContext);
  if (!context) {
    throw new Error("useScrollProgress must be used within ScrollyCanvas");
  }
  return context;
};

type ScrollyCanvasProps = {
  frameCount?: number;
  pathPrefix?: string;
  fileNameFactory?: (i: number) => string;
  className?: string;
  children?: React.ReactNode;
};

export default function ScrollyCanvas({
  frameCount = 90,
  pathPrefix = "/sequence/",
  fileNameFactory = (i: number) => `frame_${String(i).padStart(2, "0")}_delay-0.067s.webp`,
  className,
  children,
}: ScrollyCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(new Array(frameCount).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(0);

  // framer scroll tied to container
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  // chunked preload to avoid memory spikes
  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frameCount).fill(null);
    setLoadedCount(0);

    const firstBatch = Math.min(8, frameCount);
    const batchSize = 8;
    let idx = 0;

    const loadImage = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager" as any;
        img.src = `${pathPrefix}${fileNameFactory(i)}`;
        img.onload = () => {
          imagesRef.current[i] = img;
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
        img.onerror = () => {
          // still store the element to avoid holes
          imagesRef.current[i] = img;
          if (!cancelled) setLoadedCount((c) => c + 1);
          resolve();
        };
      });

    (async function preload() {
      // load first batch sequentially for quick paint
      for (; idx < firstBatch; idx++) {
        // eslint-disable-next-line no-await-in-loop
        await loadImage(idx);
      }

      // schedule remaining in batches during idle
      const schedule = () => {
        if (cancelled) return;
        const start = idx;
        const end = Math.min(frameCount, start + batchSize);
        const promises: Promise<void>[] = [];
        for (let i = start; i < end; i++) promises.push(loadImage(i));
        idx = end;
        Promise.all(promises).then(() => {
          if (idx < frameCount) {
            if ("requestIdleCallback" in window) {
              (window as any).requestIdleCallback(schedule, { timeout: 500 });
            } else {
              setTimeout(schedule, 160);
            }
          }
        });
      };

      if (idx < frameCount) schedule();
    })();

    return () => {
      cancelled = true;
    };
  }, [frameCount, pathPrefix, fileNameFactory]);

  // resize canvas for DPR and set transform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const width = Math.round(rect.width * dpr) || Math.round(window.innerWidth * dpr);
      const height = Math.round(rect.height * dpr) || Math.round(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // redraw current frame
      const img = imagesRef.current[currentFrameRef.current];
      if (img && ctx) drawImageCover(ctx, img);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    const canvas = ctx.canvas;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    // clear with background to avoid flashes
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, sw, sh);
  };

  // subscribe to smoothProgress and draw frames
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastIdx = -1;

    const unsub = smoothProgress.onChange((v) => {
      const clamped = Math.min(1, Math.max(0, v || 0));
      const frameIndex = Math.floor(clamped * (frameCount - 1));
      currentFrameRef.current = frameIndex;
      if (frameIndex !== lastIdx) {
        lastIdx = frameIndex;
        const img = imagesRef.current[frameIndex];
        if (img) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => drawImageCover(ctx, img));
        }
      }
    });

    // attempt draw first loaded frame
    const firstImg = imagesRef.current[0];
    if (firstImg) drawImageCover(ctx, firstImg);

    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, frameCount]);

  // draw when images load to update visible frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const idx = currentFrameRef.current;
    const img = imagesRef.current[idx];
    if (img) drawImageCover(ctx, img);
  }, [loadedCount]);

  return (
    <ScrollProgressContext.Provider value={smoothProgress}>
      <div ref={containerRef} className={`relative w-full h-[500vh] ${className ?? ""}`} aria-hidden>
        <div className="sticky top-0 h-screen w-full flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ objectFit: "cover", width: "100%", height: "100%", display: "block", backgroundColor: "transparent" }}
          />
          {loadedCount < frameCount && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-white/80 bg-black/40 px-3 py-2 rounded-md backdrop-blur-sm border border-white/10">Loading frames — {Math.round((loadedCount / frameCount) * 100)}%</div>
            </div>
          )}
          {/* Overlay positioned absolutely within scroll container */}
          <div className="pointer-events-none absolute inset-0 z-30">
            {children}
          </div>
        </div>
      </div>
    </ScrollProgressContext.Provider>
  );
}
