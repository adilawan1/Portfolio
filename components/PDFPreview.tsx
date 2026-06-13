"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
  className?: string;
}

export default function PDFPreview({ url, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjs = await import("pdfjs-dist");

        // Worker is served statically from /public — works with both Turbopack and webpack
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const pdf = await pdfjs.getDocument({ url }).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Measure the container. Fall back to 320 if layout hasn't happened yet.
        const containerWidth =
          canvas.parentElement?.offsetWidth ||
          canvas.parentElement?.clientWidth ||
          320;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / baseViewport.width;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // canvas: null tells pdfjs v6 to use canvasContext path (the stable render path).
        // Passing canvas alone uses an internal path that behaves differently.
        await page.render({ canvas: null, canvasContext: ctx, viewport }).promise;
        if (!cancelled) setState("ready");
      } catch (err) {
        console.error("PDFPreview render error:", err);
        if (!cancelled) setState("error");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="w-5 h-5 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin" />
        </div>
      )}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-[10px] font-mono">
          preview unavailable
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full transition-opacity duration-500 ${
          state === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
