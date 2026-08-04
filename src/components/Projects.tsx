"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";
import MagnifyImage from "./MagnifyImage";
import ArcCarousel, { type ProjectItem } from "./ArcCarousel";

const MONO = "'IBM Plex Mono', monospace";
const INITIAL_SHOW = 4; // 2-col grid looks better with 4 base
const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

/* ─────────────────────────────────────────────────────────────
   Featured hero card — Lampara live preview
───────────────────────────────────────────────────────────── */
function FeaturedCard({ p, onModal }: { p: Project; onModal: (p: Project) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
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
          ? "0 12px 36px rgba(0,0,0,0.12)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
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
        background: "var(--fg)",
        color: "var(--bg)",
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        padding: "5px 10px",
        borderRadius: 2,
      }}>
        Featured
      </div>

      {/* Project Image Preview */}
      {p.image_url && (
        <div style={{ overflow: "hidden", flexShrink: 0 }}>
          <div style={{ transform: hovered ? "scale(1.03)" : "scale(1)", transition: "transform 1.8s ease" }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 60vw"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
          </div>
        </div>
      )}

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
            fontWeight: 400,
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

/* -- Graphic design carousel -- */
function DesignCarousel({ projects, onModal }: { projects: Project[]; onModal: (p: Project) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const dragStartX = useRef<number | null>(null);
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  if (projects.length === 0) return null;

  const currentIndex = Math.min(activeIndex, projects.length - 1);

  const goToIndex = (index: number) => {
    setActiveIndex(((index % projects.length) + projects.length) % projects.length);
  };

  const getRelativePosition = (index: number) => {
    let relative = index - currentIndex;
    const halfway = projects.length / 2;

    if (relative > halfway) relative -= projects.length;
    if (relative < -halfway) relative += projects.length;

    return relative;
  };

  const handlePointerUp = (clientX: number) => {
    if (dragStartX.current === null || projects.length < 2) return;

    const delta = clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(delta) < 42) return;
    goToIndex(currentIndex + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      className="design-carousel-bleed"
      style={{
        width: "calc(100% + 2 * clamp(1.5rem, 6vw, 5rem))",
        marginLeft: "calc(-1 * clamp(1.5rem, 6vw, 5rem))",
        marginRight: "calc(-1 * clamp(1.5rem, 6vw, 5rem))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 24 }}
        animate={cardInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="design-carousel-shell"
          role="region"
          aria-roledescription="carousel"
          aria-label="Graphic design projects"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goToIndex(currentIndex - 1);
            if (event.key === "ArrowRight") goToIndex(currentIndex + 1);
          }}
          onPointerDown={(event) => {
            dragStartX.current = event.clientX;
          }}
          onPointerUp={(event) => handlePointerUp(event.clientX)}
          onPointerCancel={() => {
            dragStartX.current = null;
          }}
        >
          <div className="design-carousel-stage">
            {projects.map((p, i) => {
              const relative = getRelativePosition(i);
              const distance = Math.abs(relative);
              const isActive = relative === 0;
              const isVisible = distance <= 1;
              const direction = relative < 0 ? -1 : 1;
              const translateX =
                isActive
                  ? "0px"
                  : direction < 0
                    ? "calc(-1 * clamp(17rem, 48vw, 31rem))"
                    : "clamp(17rem, 48vw, 31rem)";
              const id = p.id ?? p.title;
              const hovered = hoveredId === id;
              const categories = (p.category || "Graphic Design")
                .split(",")
                .map((category) => category.trim())
                .filter(Boolean);

              return (
                <div
                  key={id}
                  className={`design-carousel-card liquid-glass-card ${isActive ? "active" : ""}`}
                  aria-hidden={!isVisible}
                  onClick={() => {
                    if (!isActive && isVisible) goToIndex(i);
                  }}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    opacity: isVisible ? (isActive ? 1 : 0.34) : 0,
                    pointerEvents: isVisible ? "auto" : "none",
                    transform: `translate(-50%, -50%) translateX(${translateX}) translateY(${isActive ? "0px" : "18px"}) scale(${isActive ? 1 : 0.76})`,
                    zIndex: isActive ? 4 : 2,
                    cursor: isActive ? "default" : "pointer",
                    filter: isActive ? "none" : "saturate(0.72)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 42%, transparent 100%)",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: 2,
                      background: "var(--accent)",
                      width: hovered || isActive ? "100%" : "0%",
                      transition: hovered || isActive ? "width 0.48s ease" : "width 0.22s ease",
                      zIndex: 5,
                    }}
                  />

                  {p.image_url ? (
                    <div
                      style={{
                        overflow: "hidden",
                        borderRadius: 6,
                        flexShrink: 0,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div
                        style={{
                          transform: hovered && isActive ? "scale(1.045)" : "scale(1)",
                          transition: "transform 2.6s ease",
                        }}
                      >
                        <MagnifyImage
                          src={p.image_url}
                          alt={p.title}
                          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 68vw, 620px"
                          style={{ width: "100%", height: "clamp(190px, 28vw, 282px)" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="design-carousel-placeholder" aria-hidden>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}>
                        <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
                        <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
                        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  <div className="design-carousel-content">
                    <div className="design-carousel-meta">
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)" }}>
                        0{i + 1}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>
                        {p.year}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {categories.slice(0, isActive ? 3 : 1).map((category) => (
                        <span key={category} className="tag" style={{ fontSize: 9, padding: "4px 9px" }}>
                          {category}
                        </span>
                      ))}
                    </div>

                    <h3 className="section-heading design-carousel-title">{p.title}</h3>

                    <p
                      style={{
                        color: "var(--muted)",
                        fontSize: 13,
                        lineHeight: 1.65,
                        display: "-webkit-box",
                        WebkitLineClamp: isActive ? 3 : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.description}
                    </p>

                    {isActive && (
                      <div className="design-carousel-actions">
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
                          {(p.tags ?? []).slice(0, 4).map((tag) => (
                            <span key={tag} style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)" }}>
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {p.link ? (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="btn btn-outline"
                            style={{ padding: "8px 16px", fontSize: 10, minHeight: 38 }}
                          >
                            View Project -&gt;
                          </a>
                        ) : (
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              onModal(p);
                            }}
                            className="btn btn-outline"
                            style={{ padding: "8px 16px", fontSize: 10, minHeight: 38 }}
                          >
                            View Project -&gt;
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {projects.length > 1 && (
          <div className="design-carousel-controls">
            <button
              onClick={() => goToIndex(currentIndex - 1)}
              aria-label="Previous graphic design project"
              className="liquid-glass-btn"
            >
              &lt;
            </button>

            <div className="liquid-glass-pill" aria-label="Graphic design project navigation">
              {projects.map((p, i) => (
                <button
                  key={p.id ?? p.title}
                  onClick={() => goToIndex(i)}
                  aria-label={`Show ${p.title}`}
                  aria-current={i === currentIndex}
                  className="design-carousel-dot"
                  style={{
                    background: i === currentIndex ? "var(--fg)" : "var(--muted)",
                    transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
                    opacity: i === currentIndex ? 1 : 0.4,
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => goToIndex(currentIndex + 1)}
              aria-label="Next graphic design project"
              className="liquid-glass-btn"
            >
              &gt;
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

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

  const carouselProjects: ProjectItem[] = useMemo(() => {
    return devProjects.map((p) => ({
      title: p.title,
      status: (p.year === "2024" || p.year === "2025" || p.year === "2026" ? "Shipped" : "In progress") as "Shipped" | "In progress",
      shipped: p.year === "2024" || p.year === "2025" || p.year === "2026",
      description: p.description,
      tags: p.tags || [],
      link: p.link ?? null,
      image_url: p.image_url ?? null,
    }));
  }, [devProjects]);

  return (
    <section
      id="projects"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--bg)", paddingTop: "4rem", paddingBottom: "1.5rem" }}
    >
      <div className="section-container">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "1rem" }}
        >
          <p
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            — Projects
          </p>
        </motion.div>

        {/* ── Arc Carousel ── */}
        <ArcCarousel projects={carouselProjects} />

        {/* ── Graphic Design ── */}
        <div style={{ marginTop: "4rem", marginBottom: "1rem" }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}>
            — Graphic Design
          </p>

          {loading ? <SkeletonGrid variant="design" /> : loadError ? null : designProjects.length === 0 ? (
            <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", padding: "2rem 0", letterSpacing: "0.12em" }}>
              No design work uploaded yet.
            </p>
          ) : (
            <DesignCarousel projects={designProjects} onModal={setModal} />
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
        .design-carousel-shell {
          position: relative;
          height: clamp(440px, 58vw, 560px);
          overflow: hidden;
          padding: 1rem 0;
          touch-action: pan-y;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
        }
        .design-carousel-shell:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 4px;
        }
        .design-carousel-shell::before,
        .design-carousel-shell::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 6;
          width: clamp(4rem, 16vw, 12rem);
          pointer-events: none;
        }
        .design-carousel-shell::before {
          left: 0;
          background: linear-gradient(to right, var(--bg) 10%, rgba(250, 250, 250, 0));
        }
        .design-carousel-shell::after {
          right: 0;
          background: linear-gradient(to left, var(--bg) 10%, rgba(250, 250, 250, 0));
        }
        .design-carousel-stage {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .design-carousel-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: clamp(280px, 64vw, 620px);
          min-height: clamp(392px, 50vw, 500px);
          border-radius: 8px;
          padding: 0.9rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          will-change: transform, opacity, filter;
          transition:
            opacity 0.34s ease,
            filter 0.34s ease,
            transform 0.54s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .design-carousel-placeholder {
          width: 100%;
          height: clamp(190px, 28vw, 282px);
          border-radius: 6px;
          background: var(--subtle-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .design-carousel-content {
          position: relative;
          z-index: 3;
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1rem 0.1rem 0.1rem;
        }
        .design-carousel-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .design-carousel-title {
          font-size: clamp(18px, 2.6vw, 28px);
          margin: 0;
        }
        .design-carousel-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-top: auto;
        }
        .design-carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
          position: relative;
          z-index: 10;
        }
        .design-carousel-controls .liquid-glass-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          font-size: 14px;
          font-family: 'IBM Plex Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .design-carousel-dot {
          width: 6px;
          height: 6px;
          border: 0;
          border-radius: 50%;
          padding: 0;
          cursor: pointer;
          transition: transform 0.25s ease, opacity 0.25s ease, background 0.25s ease;
        }
        [data-theme="dark"] .design-carousel-shell::before {
          background: linear-gradient(to right, var(--bg) 10%, rgba(9, 9, 11, 0));
        }
        [data-theme="dark"] .design-carousel-shell::after {
          background: linear-gradient(to left, var(--bg) 10%, rgba(9, 9, 11, 0));
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
          .design-carousel-shell {
            height: 500px;
          }
          .design-carousel-card {
            width: min(82vw, 380px);
            min-height: 430px;
          }
          .design-carousel-actions {
            align-items: flex-start;
            flex-direction: column;
          }
          .design-carousel-actions .btn {
            width: 100%;
            justify-content: center;
          }
          .design-carousel-title {
            font-size: 20px;
          }
          .design-carousel-shell::before,
          .design-carousel-shell::after {
            width: 2.75rem;
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
