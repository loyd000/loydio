"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";
import MagnifyImage from "./MagnifyImage";

const MONO = "'IBM Plex Mono', monospace";
const INITIAL_SHOW = 4; // 2-col grid looks better with 4 base
const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

/* ─────────────────────────────────────────────────────────────
   Featured hero card — Lampara live preview
───────────────────────────────────────────────────────────── */
function FeaturedCard({ p, onModal }: { p: Project; onModal: (p: Project) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        border: "1px solid var(--border)",
        borderRadius: 4,
        overflow: "hidden",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px var(--accent-border)"
          : "0 4px 24px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.35s ease",
      }}
    >
      {/* Featured badge */}
      <div style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "var(--accent)",
        color: "#fff",
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        padding: "5px 10px",
        borderRadius: 2,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", opacity: 0.85, flexShrink: 0, animation: "blink 1s step-end infinite" }} />
        Featured
      </div>

      {/* Live preview iframe */}
      <div style={{
        position: "relative",
        width: "100%",
        flex: 1,
        minHeight: 320,
        background: "#0a0a0a",
        overflow: "hidden",
      }}>
        {/* Skeleton while loading */}
        {!iframeLoaded && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, var(--subtle-bg) 25%, var(--hover-bg) 50%, var(--subtle-bg) 75%)",
            backgroundSize: "200% 100%",
            animation: "project-skeleton-pulse 1.4s ease-in-out infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
          }}>
            <div style={{ width: 32, height: 32, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
              Loading preview…
            </span>
          </div>
        )}

        {p.link && (
          <iframe
            src={p.link}
            title={`Live preview of ${p.title}`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: hovered ? "auto" : "none",
            }}
            loading="lazy"
            onLoad={() => setIframeLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}

        {/* Gradient overlay at bottom */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background: "linear-gradient(to top, var(--bg) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
      </div>

      {/* Card info row */}
      <div style={{
        padding: "1.5rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}>
        <div>
          {/* Meta */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", alignSelf: "center" }}>{p.year}</span>
          </div>

          <h3 style={{
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            marginBottom: "0.625rem",
          }}>
            {p.title}
          </h3>

          <p style={{
            fontSize: 14,
            color: "var(--muted)",
            lineHeight: 1.75,
            width: "100%",
          }}>
            {p.description}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "0.875rem" }}>
            {(p.tags ?? []).map((tag) => (
              <span key={tag} style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)" }}>#{tag}</span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        {p.link && (
          <div style={{ marginTop: "0.5rem" }}>
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent"
              style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.85, flexShrink: 0, marginRight: 8 }} />
              Visit Live Site ↗
            </a>
          </div>
        )}
      </div>

      {/* Accent left border */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, bottom: 0,
        width: 3,
        background: "var(--accent)",
        opacity: hovered ? 1 : 0.35,
        transition: "opacity 0.3s ease",
      }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Regular dev project card — 2-column grid
───────────────────────────────────────────────────────────── */
function ProjectCard({ p, i, onModal }: { p: Project; i: number; onModal: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        height: "100%",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent bottom sweep */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, background: "var(--accent)",
        width: hovered ? "100%" : "0%",
        transition: hovered ? "width 0.45s ease" : "width 0.2s ease",
        zIndex: 4,
      }} />

      {p.image_url && (
        <div style={{ overflow: "hidden", flexShrink: 0 }}>
          <div style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 2.8s ease" }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
          </div>
        </div>
      )}

      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: 8 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(p.category || "").split(",").map((c) => (
              <span key={c.trim()} className="tag">{c.trim()}</span>
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>{p.year}</span>
        </div>

        <h3 className="section-heading" style={{ fontSize: 16, marginBottom: "0.5rem" }}>
          {p.title}
        </h3>

        <p style={{
          fontSize: 13,
          color: "var(--muted)",
          lineHeight: 1.75,
          marginBottom: "1rem",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {p.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "1rem" }}>
          {(p.tags ?? []).map((tag) => (
            <span key={tag} style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)" }}>#{tag}</span>
          ))}
        </div>

        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-outline"
            style={{ alignSelf: "flex-start", padding: "8px 16px", fontSize: 10 }}
          >
            View Project ↗
          </a>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onModal(p); }}
            className="btn btn-outline"
            style={{ alignSelf: "flex-start", padding: "8px 16px", fontSize: 10 }}
          >
            View Project →
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Bento Side Card — Compact to prevent Lampara height stretch
───────────────────────────────────────────────────────────── */
function BentoSideCard({ p, i, onModal }: { p: Project; i: number; onModal: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: 20 }}
      animate={cardInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        height: "100%",
        transition: "border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease",
        boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, background: "var(--accent)",
        width: hovered ? "100%" : "0%",
        transition: hovered ? "width 0.45s ease" : "width 0.2s ease",
        zIndex: 4,
      }} />

      {/* Much thinner image aspect ratio to save vertical space */}
      {p.image_url && (
        <div style={{ overflow: "hidden", flexShrink: 0, height: 100 }}>
          <div style={{ transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 2.8s ease", height: "100%" }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      )}

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: 8 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {(p.category || "").split(",").slice(0, 2).map((c) => (
              <span key={c.trim()} className="tag" style={{ fontSize: 9, padding: "2px 6px" }}>{c.trim()}</span>
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 9, color: "var(--muted)", whiteSpace: "nowrap" }}>{p.year}</span>
        </div>

        <h3 className="section-heading" style={{ fontSize: 15, marginBottom: "0.4rem" }}>
          {p.title}
        </h3>

        <p style={{
          fontSize: 12,
          color: "var(--muted)",
          lineHeight: 1.6,
          marginBottom: "1rem",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {p.description}
        </p>

        {p.link ? (
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-outline"
            style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: 9 }}
          >
            View ↗
          </a>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onModal(p); }}
            className="btn btn-outline"
            style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: 9 }}
          >
            View →
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Design card — untouched ──────────────────────────────── */
function DesignCard({ p, i, onModal }: { p: Project; i: number; onModal: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, background: "var(--accent)",
        width: hovered ? "100%" : "0%",
        transition: hovered ? "width 0.5s ease" : "width 0.25s ease",
        zIndex: 4,
      }} />

      {p.image_url ? (
        <div style={{ overflow: "hidden" }}>
          <div style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 3s ease" }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: "100%", aspectRatio: "4 / 3" }}
            />
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "4 / 3", background: "var(--subtle-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.15 }}>
            <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
            <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.875rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(p.category || "").split(",").map((c) => (
              <span key={c.trim()} className="tag">{c.trim()}</span>
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>{p.year}</span>
        </div>
        <h3 className="section-heading" style={{ fontSize: 15 }}>{p.title}</h3>
        <button
          onClick={() => onModal(p)}
          className="btn btn-outline"
          style={{ alignSelf: "flex-start", padding: "8px 16px" }}
        >
          View →
        </button>
      </div>
    </motion.div>
  );
}

/* ── Skeleton ──────────────────────────── */
function SkeletonGrid({ variant = "dev" }: { variant?: "dev" | "design" }) {
  return (
    <div className={variant === "dev" ? "project-grid-2col" : "project-grid"} role="status" aria-label="Loading projects">
      {Array.from({ length: variant === "dev" ? 4 : 3 }).map((_, i) => (
        <div key={i} className="project-skeleton-card" style={{ animationDelay: `${i * 0.12}s` }} aria-hidden>
          <div className="project-skeleton-block" style={{ aspectRatio: variant === "design" ? "4 / 3" : "16 / 9" }} />
          <div style={{ padding: "1.5rem" }}>
            <div className="project-skeleton-title" />
            <div className="project-skeleton-line" style={{ width: "85%" }} />
            <div className="project-skeleton-line" style={{ width: "65%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main section ──────────────────────── */
export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive]                 = useState("All");
  const [devProjects, setDevProjects]       = useState<Project[]>([]);
  const [designProjects, setDesignProjects] = useState<Project[]>([]);
  const [loading, setLoading]               = useState(true);
  const [loadError, setLoadError]           = useState("");
  const [modal, setModal]                   = useState<Project | null>(null);
  const [devShowAll, setDevShowAll]         = useState(false);
  const [designShowAll, setDesignShowAll]   = useState(false);

  useEffect(() => {
    supabase.from("projects").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) { setLoadError(error.message); setLoading(false); return; }
        const all = data ?? [];
        setDevProjects(all.filter((p) => p.type === "dev"));
        setDesignProjects(all.filter((p) => p.type === "design"));
        setLoading(false);
      });
  }, []);

  // 1. Extract Lampara
  const featuredProject = useMemo(() => {
    const lampara = devProjects.find((p) =>
      p.title.toLowerCase().includes("lampara")
    );
    return lampara ?? null;
  }, [devProjects]);

  // 2. Extract Bulletin Machine & Dev CLI + 2 more for the Bento side (2x2)
  const bentoSideProjects = useMemo(() => {
    const required = devProjects.filter(p => 
      p.title.toLowerCase().includes("bulletin") || 
      p.title.toLowerCase().includes("cli")
    );
    const others = devProjects.filter(p => 
      !required.includes(p) && !p.title.toLowerCase().includes("lampara")
    );
    return [...required, ...others].slice(0, 4);
  }, [devProjects]);

  // 3. The remaining projects for the standard grid
  const restDevProjects = useMemo(() => {
    const excludedIds = [
      featuredProject?.id,
      ...bentoSideProjects.map(p => p.id)
    ].filter(Boolean);
    
    return devProjects.filter((p) => !excludedIds.includes(p.id));
  }, [devProjects, featuredProject, bentoSideProjects]);

  const filtered = useMemo(
    () => active === "All"
      ? restDevProjects
      : restDevProjects.filter((p) =>
          (p.category || "").split(",").map((c) => c.trim()).includes(active)
        ),
    [active, restDevProjects]
  );
  const displayedDev    = devShowAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const displayedDesign = designShowAll ? designProjects : designProjects.slice(0, INITIAL_SHOW);

  useEffect(() => { setDevShowAll(false); }, [active]);

  return (
    <section
      id="projects"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--subtle-bg)" }}
    >
      <div className="section-container">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <span className="eyebrow" style={{ marginBottom: "1.25rem" }}>Projects</span>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px, 4vw, 42px)", marginBottom: "1rem", marginTop: "1rem" }}>
            Code that scales,<br />interfaces that inspire.
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 460, lineHeight: 1.75 }}>
            Development projects and graphic design work — spanning web platforms, IoT, mobile apps, and visual design.
          </p>
        </motion.div>

        {/* ── Development ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}
        >
          — Development
        </motion.p>

        {loading ? (
          <>
            {/* Featured skeleton */}
            <div className="project-skeleton-card" style={{ aspectRatio: "16 / 8", marginBottom: "2.5rem" }} aria-hidden />
            <SkeletonGrid />
          </>
        ) : loadError ? (
          <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", padding: "2rem 0" }}>Failed to load projects.</p>
        ) : (
          <>
            {/* Bento grid layout: Strictly Lampara + 2 Side Projects */}
            <div className="bento-grid">
              {featuredProject && (
                <div className="bento-featured">
                  <FeaturedCard p={featuredProject} onModal={setModal} />
                </div>
              )}
              
              <AnimatePresence mode="popLayout">
                {bentoSideProjects.map((p, i) => (
                  <BentoSideCard key={p.id} p={p} i={i} onModal={setModal} />
                ))}
              </AnimatePresence>
            </div>

            {/* Category filter for the rest of the projects */}
            {restDevProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.5rem" }}
              >
                {devCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "7px 14px",
                      border: "1px solid",
                      borderColor: active === cat ? "var(--accent)" : "var(--border-strong)",
                      background: active === cat ? "var(--accent)" : "transparent",
                      color: active === cat ? "#fff" : "var(--fg)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderRadius: 2,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}

            {/* 2-col project grid for the rest */}
            <div className="project-grid-2col">
              <AnimatePresence mode="popLayout">
                {displayedDev.map((p, i) => (
                  <ProjectCard key={p.id} p={p} i={i} onModal={setModal} />
                ))}
              </AnimatePresence>
            </div>

            {filtered.length > INITIAL_SHOW && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => setDevShowAll((v) => !v)}
                  className="btn btn-outline"
                >
                  {devShowAll ? "Show Less ↑" : `Show ${filtered.length - INITIAL_SHOW} More ↓`}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Design — untouched ── */}
        <div style={{ marginTop: "4rem", marginBottom: "1rem" }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}>
            — Graphic Design
          </p>

          {loading ? <SkeletonGrid variant="design" /> : loadError ? null : designProjects.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", padding: "2rem 0", letterSpacing: "0.12em" }}>
              No design work uploaded yet.
            </p>
          ) : (
            <>
              <div className="project-grid">
                <AnimatePresence mode="popLayout">
                  {displayedDesign.map((p, i) => (
                    <DesignCard key={p.id} p={p} i={i} onModal={setModal} />
                  ))}
                </AnimatePresence>
              </div>

              {designProjects.length > INITIAL_SHOW && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
                  <button
                    onClick={() => setDesignShowAll((v) => !v)}
                    className="btn btn-outline"
                  >
                    {designShowAll ? "Show Less ↑" : `Show ${designProjects.length - INITIAL_SHOW} More ↓`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      <style>{`
        /* Bento Grid: Lampara (left 2x2 block) + 4 side projects (right 2x2 block) */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .bento-featured {
          grid-column: span 2;
          grid-row: span 2;
        }
        /* 2-col grid for dev cards */
        .project-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .bento-featured {
            grid-column: span 2;
            grid-row: span 1;
          }
        }
        @media (max-width: 700px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .bento-featured {
            grid-column: span 1;
          }
          .project-grid-2col {
            grid-template-columns: 1fr;
          }
        }
        /* Spinner for iframe loading */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        /* Blinking dot */
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
