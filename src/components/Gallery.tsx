"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import TypewriterText from "./TypewriterText";

const items = [
  { id: 1, label: "Dashboard UI", type: "UI Design", cols: 2, rows: 1, color: "#f0f0f0" },
  { id: 2, label: "Mobile App", type: "UI Design", cols: 1, rows: 2, color: "#e8e8e8" },
  { id: 3, label: "Brand Identity", type: "Branding", cols: 1, rows: 1, color: "#ebebeb" },
  { id: 4, label: "E-commerce UI", type: "Web Dev", cols: 2, rows: 1, color: "#f5f5f5" },
  { id: 5, label: "Component Library", type: "UI Design", cols: 1, rows: 1, color: "#e0e0e0" },
  { id: 6, label: "SaaS Platform", type: "Full-Stack", cols: 1, rows: 1, color: "#eeeeee" },
];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<(typeof items)[0] | null>(null);
  const lightboxCloseBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selected) return;
    lightboxCloseBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section
      id="gallery"
      ref={ref}
      style={{ position: "relative", padding: "8rem 0", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.09)", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Gallery</span>
      </div>

      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">05</span>
      </div>

      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "1rem",
            }}
          >
            <TypewriterText text1="Visual Archive." text2="Work & Experiments." inView={inView} />
          </h2>
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 420, lineHeight: 1.8 }}>
            Screenshots, mockups, and visual explorations from past projects and side experiments.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "200px",
            gap: 12,
          }}
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              onClick={() => setSelected(item)}
              style={{
                gridColumn: `span ${item.cols}`,
                gridRow: `span ${item.rows}`,
                background: item.color,
                border: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {/* Placeholder icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" style={{ opacity: 0.2, marginBottom: 8 }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.3 }}>
                {item.label}
              </span>

              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <span style={{ color: "#fff", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600 }}>
                  {item.label}
                </span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {item.type}
                </span>
                <span style={{ color: "#fff", fontSize: 20, marginTop: 8 }}>↗</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={selected?.label}
              style={{ background: "#fff", maxWidth: 640, width: "100%", border: "1px solid rgba(0,0,0,0.1)" }}
            >
              <div
                style={{
                  width: "100%",
                  height: 300,
                  background: selected.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, opacity: 0.3 }}>
                  {selected.label}
                </span>
              </div>
              <div
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{selected.label}</p>
                  <p style={{ fontSize: 10, opacity: 0.4, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 }}>
                    {selected.type}
                  </p>
                </div>
                <button
                  ref={lightboxCloseBtnRef}
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  style={{
                    fontSize: 20,
                    opacity: 0.35,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
