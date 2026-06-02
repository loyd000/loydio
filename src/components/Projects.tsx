"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";
import MagnifyImage from "./MagnifyImage";

const MONO = "'IBM Plex Mono', monospace";
const INITIAL_SHOW = 3;
const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

/* ── Project card (dev) ───────────────── */
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
      transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent bottom bar sweep */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0,
          height: 2,
          background: "var(--accent)",
          width: hovered ? "100%" : "0%",
          transition: hovered ? "width 0.5s ease" : "width 0.25s ease",
          zIndex: 4,
        }}
      />

      {p.image_url && (
        <div style={{ overflow: "hidden" }}>
          <div style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 3s ease" }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
          </div>
        </div>
      )}

      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem", gap: 8 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(p.category || "").split(",").map((c) => (
              <span key={c.trim()} className="tag">{c.trim()}</span>
            ))}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>{p.year}</span>
        </div>

        <h3
          className="section-heading"
          style={{ fontSize: 16, marginBottom: "0.625rem" }}
        >
          {p.title}
        </h3>

        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.75,
            marginBottom: "1.25rem",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {p.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
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
            style={{ alignSelf: "flex-start", padding: "8px 16px" }}
          >
            View Project ↗
          </a>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onModal(p); }}
            className="btn btn-outline"
            style={{ alignSelf: "flex-start", padding: "8px 16px" }}
          >
            View Project →
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ── Design card ───────────────────────── */
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
      <div
        style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2, background: "var(--accent)",
          width: hovered ? "100%" : "0%",
          transition: hovered ? "width 0.5s ease" : "width 0.25s ease",
          zIndex: 4,
        }}
      />

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
    <div className="project-grid" role="status" aria-label="Loading projects">
      {Array.from({ length: INITIAL_SHOW }).map((_, i) => (
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
  const [active, setActive]               = useState("All");
  const [devProjects, setDevProjects]     = useState<Project[]>([]);
  const [designProjects, setDesignProjects] = useState<Project[]>([]);
  const [loading, setLoading]             = useState(true);
  const [loadError, setLoadError]         = useState("");
  const [modal, setModal]                 = useState<Project | null>(null);
  const [devShowAll, setDevShowAll]       = useState(false);
  const [designShowAll, setDesignShowAll] = useState(false);

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

  const filtered = useMemo(
    () => active === "All" ? devProjects : devProjects.filter((p) => (p.category || "").split(",").map((c) => c.trim()).includes(active)),
    [active, devProjects]
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

        {/* Heading */}
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
          style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}
        >
          — Development
        </motion.p>

        {/* Category filter */}
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

        {loading ? <SkeletonGrid /> : loadError ? (
          <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", padding: "2rem 0" }}>Failed to load projects.</p>
        ) : (
          <>
            <div className="project-grid">
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

        {/* ── Design ── */}
        <div style={{ marginTop: "4rem", marginBottom: "1rem" }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}>
            — Graphic Design
          </p>

          {loading ? <SkeletonGrid variant="design" /> : loadError ? null : (
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
    </section>
  );
}
