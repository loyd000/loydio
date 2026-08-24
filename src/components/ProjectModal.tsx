"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/supabase";

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), 'Syne', sans-serif";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dragStartX = useRef<number | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Collect all images: screenshots first, then cover as fallback
  const images = project.images?.length
    ? project.images
    : project.image_url
    ? [project.image_url]
    : [];

  // Lock body scroll + focus close button on open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  const prevImg = useCallback(() => {
    if (images.length < 2) return;
    setIdx((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextImg = useCallback(() => {
    if (images.length < 2) return;
    setIdx((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, prevImg, nextImg]);

  // Swipe nav on image
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (delta < 0) {
      nextImg();
    } else {
      prevImg();
    }
  };

  const portalRoot = typeof document === "undefined" ? null : document.body;
  if (!portalRoot) return null;

  const hasLink = Boolean(project.link);

  return createPortal(
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="pm-backdrop"
        className="pm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={handleClose}
        aria-label="Close modal"
      >
        {/* ── Modal shell ── */}
        <motion.div
          key="pm-shell"
          className="pm-shell"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          {/* ── Close button ── */}
          <button
            ref={closeBtnRef}
            onClick={handleClose}
            className="pm-close"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>

          {/* ── Left pane: Image gallery ── */}
          {images.length > 0 && (
            <div className="pm-gallery">
              {/* Main image with swipe support */}
              <div
                className="pm-main-img"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <Image
                      src={images[idx]}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      fill
                      sizes="(max-width: 720px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      priority={idx === 0}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Arrow nav */}
                {images.length > 1 && (
                  <>
                    <button className="pm-arrow pm-arrow-left" onClick={prevImg} aria-label="Previous image">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="pm-arrow pm-arrow-right" onClick={nextImg} aria-label="Next image">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Counter pill */}
                    <div className="pm-img-counter">
                      {idx + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="pm-thumbstrip">
                  {images.map((url, i) => (
                    <button
                      key={url}
                      onClick={() => setIdx(i)}
                      className={`pm-thumb${i === idx ? " active" : ""}`}
                      aria-label={`View screenshot ${i + 1}`}
                      aria-pressed={i === idx}
                    >
                      <Image
                        src={url}
                        alt=""
                        width={56}
                        height={40}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Right pane: Details ── */}
          <div className="pm-details">
            {/* Top meta row */}
            <div className="pm-meta-row">
              {project.category && (
                <span className="pm-badge">{project.category}</span>
              )}
              <span className="pm-type-dot" data-type={project.type} />
              <span className="pm-year">{project.year}</span>
            </div>

            {/* Title */}
            <h2 className="pm-title">{project.title}</h2>

            {/* Divider */}
            <div className="pm-divider" />

            {/* Description */}
            {project.description && (
              <p className="pm-desc">{project.description}</p>
            )}

            {/* Tags */}
            {(project.tags ?? []).length > 0 && (
              <div className="pm-tags">
                {(project.tags ?? []).map((t) => (
                  <span key={t} className="pm-tag">#{t}</span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="pm-footer">
              {hasLink ? (
                <a
                  href={project.link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-cta"
                >
                  <span>View Project</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ) : (
                <span className="pm-private">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Private / Local
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    portalRoot
  );
}

/* ─────────────────────────────────────────────────────────────────
   Scoped styles — injected inline to avoid globals.css bloat
   ───────────────────────────────────────────────────────────────── */
const STYLES = `
  /* Backdrop */
  .pm-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  /* Shell */
  .pm-shell {
    position: relative;
    width: 100%;
    max-width: 960px;
    max-height: 88vh;
    background: var(--bg);
    border: 1px solid var(--border-strong);
    border-radius: 16px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.06) inset,
      0 32px 80px rgba(0,0,0,0.4),
      0 8px 20px rgba(0,0,0,0.2);
  }

  /* Close */
  .pm-close {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 20;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--border-strong);
    background: var(--bg);
    color: var(--fg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }
  .pm-close:hover {
    opacity: 1;
    background: var(--fg);
    color: var(--bg);
    transform: scale(1.07);
  }
  [data-theme="dark"] .pm-close:hover { color: var(--bg); }

  /* ── Gallery pane ── */
  .pm-gallery {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--subtle-bg);
    border-right: 1px solid var(--border);
  }
  .pm-main-img {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
    cursor: grab;
  }
  .pm-main-img:active { cursor: grabbing; }

  /* Arrows */
  .pm-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.22);
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .pm-arrow:hover {
    background: rgba(0,0,0,0.72);
    border-color: rgba(255,255,255,0.45);
    transform: translateY(-50%) scale(1.08);
  }
  .pm-arrow-left { left: 12px; }
  .pm-arrow-right { right: 12px; }

  /* Counter pill */
  .pm-img-counter {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-family: ${MONO};
    font-size: 9px;
    letter-spacing: 0.12em;
    color: #fff;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 999px;
    padding: 3px 10px;
    white-space: nowrap;
  }

  /* Thumbnail strip */
  .pm-thumbstrip {
    display: flex;
    gap: 4px;
    padding: 8px 10px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    overflow-x: auto;
    flex-shrink: 0;
    scrollbar-width: none;
  }
  .pm-thumbstrip::-webkit-scrollbar { display: none; }
  .pm-thumb {
    flex-shrink: 0;
    width: 52px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid transparent;
    padding: 0;
    cursor: pointer;
    background: none;
    transition: border-color 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
    opacity: 0.5;
  }
  .pm-thumb.active {
    border-color: var(--fg);
    opacity: 1;
    transform: scale(1.05);
  }
  .pm-thumb:hover:not(.active) { opacity: 0.8; }

  /* ── Details pane ── */
  .pm-details {
    padding: clamp(1.5rem, 3vw, 2.5rem);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  /* Meta row */
  .pm-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .pm-badge {
    font-family: ${MONO};
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fg);
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    padding: 3px 10px;
  }
  .pm-type-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .pm-type-dot[data-type="dev"]    { background: #3b82f6; }
  .pm-type-dot[data-type="design"] { background: #a855f7; }
  .pm-year {
    font-family: ${MONO};
    font-size: 10px;
    opacity: 0.35;
    letter-spacing: 0.1em;
    margin-left: auto;
  }

  /* Title */
  .pm-title {
    font-family: ${DISPLAY};
    font-size: clamp(20px, 2.8vw, 30px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--fg);
    margin: 0 0 1.25rem;
  }

  .pm-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 1.25rem;
  }

  /* Description */
  .pm-desc {
    font-size: 13px;
    line-height: 1.85;
    color: var(--muted);
    margin: 0 0 1.25rem;
    flex: 1;
  }

  /* Tags */
  .pm-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 1.5rem;
  }
  .pm-tag {
    font-family: ${MONO};
    font-size: 9.5px;
    letter-spacing: 0.1em;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 3px 8px;
  }

  /* Footer / CTA */
  .pm-footer {
    margin-top: auto;
    padding-top: 1.25rem;
    border-top: 1px solid var(--border);
  }
  .pm-cta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: ${MONO};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--bg);
    background: var(--fg);
    border: 1px solid var(--fg);
    border-radius: 999px;
    padding: 10px 20px;
    transition: background 0.22s ease, color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
  }
  .pm-cta:hover {
    background: transparent;
    color: var(--fg);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
  .pm-private {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: ${MONO};
    font-size: 9.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.55;
  }

  /* ════════════════════════════════════════════════
     MOBILE — bottom sheet style
     ════════════════════════════════════════════════ */
  @media (max-width: 720px) {
    .pm-backdrop {
      align-items: flex-end;
      padding: 0;
    }
    .pm-shell {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      max-width: 100%;
      max-height: 92dvh;
      border-radius: 20px 20px 0 0;
      border-bottom: none;
    }
    .pm-gallery {
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    .pm-main-img {
      height: clamp(200px, 52vw, 320px);
      flex: none;
    }
    .pm-close {
      top: 12px;
      right: 12px;
    }
    .pm-details {
      padding: 1.25rem 1.25rem 2rem;
      max-height: 50dvh;
    }
    .pm-title {
      font-size: clamp(18px, 5vw, 24px);
    }
    /* Drag handle pill at top of modal */
    .pm-shell::before {
      content: "";
      display: block;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 36px;
      height: 4px;
      border-radius: 999px;
      background: var(--border-strong);
      opacity: 0.4;
      z-index: 20;
      pointer-events: none;
    }
  }
`;

// Inject styles once into <head> when the modal first mounts
if (typeof document !== "undefined") {
  const id = "pm-styles";
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
}
