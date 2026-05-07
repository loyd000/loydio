"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/supabase";

const MONO = "'IBM Plex Mono', monospace";

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const LENS_R = 90;
  const ZOOM = 2.5;

  // Collect all images: screenshots first, then cover as fallback
  const images = project.images?.length
    ? project.images
    : project.image_url
    ? [project.image_url]
    : [];

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const prev = useCallback(() => {
    if (images.length < 2) return;
    setIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const next = useCallback(() => {
    if (images.length < 2) return;
    setIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  const portalRoot = typeof document === "undefined" ? null : document.body;
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: 920,
            maxHeight: "90vh",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: images.length ? "1fr 1fr" : "1fr",
            gridTemplateRows: "1fr",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 14, right: 16, zIndex: 10, fontFamily: MONO, fontSize: 22, border: "none", background: "none", cursor: "pointer", color: "var(--fg)", opacity: 0.4, lineHeight: 1, padding: "4px 8px" }}
            aria-label="Close"
          >×</button>

          {/* ── Left: Carousel ── */}
          {images.length > 0 && (
            <div style={{ position: "relative", background: "var(--border)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Main image */}
              <div
                ref={imgContainerRef}
                style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, cursor: lens ? "none" : undefined }}
                onMouseMove={(e) => {
                  const rect = imgContainerRef.current!.getBoundingClientRect();
                  setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
                }}
                onMouseLeave={() => setLens(null)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <Image
                      src={images[idx]}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Arrows — above lens */}
                {images.length > 1 && (
                  <>
                    <button onClick={prev} aria-label="Previous" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontFamily: MONO, width: 36, height: 36, border: "1px solid var(--border-heavy)", background: "var(--bg)", color: "var(--fg)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>←</button>
                    <button onClick={next} aria-label="Next" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontFamily: MONO, width: 36, height: 36, border: "1px solid var(--border-heavy)", background: "var(--bg)", color: "var(--fg)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>→</button>
                  </>
                )}

                {/* Magnifying lens */}
                {lens && (
                  <div
                    style={{
                      position: "absolute",
                      left: lens.x - LENS_R,
                      top: lens.y - LENS_R,
                      width: LENS_R * 2,
                      height: LENS_R * 2,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.65)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.1)",
                      overflow: "hidden",
                      pointerEvents: "none",
                      zIndex: 15,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        width: lens.w,
                        height: lens.h,
                        left: LENS_R - lens.x * ZOOM,
                        top: LENS_R - lens.y * ZOOM,
                        transform: `scale(${ZOOM})`,
                        transformOrigin: "0 0",
                      }}
                    >
                      <Image src={images[idx]} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div style={{ display: "flex", gap: 4, padding: "8px 10px", background: "var(--bg)", borderTop: "1px solid var(--border)", overflowX: "auto", flexShrink: 0 }}>
                  {images.map((url, i) => (
                    <button
                      key={url}
                      onClick={() => setIdx(i)}
                      style={{ flexShrink: 0, width: 48, height: 36, border: i === idx ? "2px solid var(--fg)" : "2px solid transparent", padding: 0, cursor: "pointer", overflow: "hidden", background: "none" }}
                    >
                      <Image src={url} alt="" width={48} height={36} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </button>
                  ))}
                  <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.35, alignSelf: "center", marginLeft: 4, whiteSpace: "nowrap" }}>{idx + 1} / {images.length}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Right: Details ── */}
          <div style={{ padding: "2.5rem 2rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
              <span className="tag">{project.category}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.35 }}>{project.year}</span>
            </div>

            {/* Title */}
            <h2 style={{ fontFamily: MONO, fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1rem" }}>
              {project.title}
            </h2>

            {/* Description */}
            <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.9, marginBottom: "1.5rem" }}>
              {project.description}
            </p>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "2rem" }}>
                {project.tags.map((t) => (
                  <span key={t} style={{ fontFamily: MONO, fontSize: 10, opacity: 0.4, border: "1px solid var(--border)", padding: "3px 8px" }}>#{t}</span>
                ))}
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
              <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.3, letterSpacing: "0.15em" }}>
                {project.link ? "" : "LOCAL / PRIVATE PROJECT"}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    portalRoot
  );
}
