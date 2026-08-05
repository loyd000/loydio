"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";
import MagnifyImage from "./MagnifyImage";
import ArcCarousel, { type ProjectItem } from "./ArcCarousel";

const MONO = "var(--font-mono), monospace";

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
                    ? "calc(-1 * clamp(17.5rem, 52vw, 35rem))"
                    : "clamp(17.5rem, 52vw, 35rem)";
              const id = p.id ?? p.title;
              const hovered = hoveredId === id;

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
                    transform: `translate(-50%, -50%) translateX(${translateX}) translateY(${isActive ? (hovered ? "-3px" : "0px") : "18px"}) scale(${isActive ? 1 : 0.76})`,
                    zIndex: isActive ? 4 : 2,
                    cursor: isActive ? "default" : "pointer",
                    filter: isActive ? "none" : "saturate(0.72)",
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, opacity 0.35s ease, filter 0.35s ease",
                    boxShadow: isActive && hovered ? "0 16px 48px rgba(0,0,0,0.18)" : undefined,
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
                      width: isActive ? "100%" : "0%",
                      transition: "width 0.48s ease",
                      zIndex: 5,
                    }}
                  />

                  {p.image_url ? (
                    <div
                      className="design-carousel-image"
                      style={{
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <MagnifyImage
                        src={p.image_url}
                        alt={p.title}
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 68vw, 620px"
                        style={{ width: "100%", height: "100%" }}
                      />
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
                    <h3 className="section-heading design-carousel-title">{p.title}</h3>

                    {isActive && (
                      <div className="design-carousel-action">
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
/* Ã¢â€â‚¬Ã¢â€â‚¬ Main section Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
function ProjectMessage({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", padding: "2rem 0", letterSpacing: "0.12em" }}>
      {children}
    </p>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [devProjects, setDevProjects] = useState<Project[]>([]);
  const [designProjects, setDesignProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState<Project | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
          setLoading(false);
          return;
        }

        const all = data ?? [];
        setDevProjects(all.filter((project) => project.type === "dev"));
        setDesignProjects(all.filter((project) => project.type === "design"));
        setLoading(false);
      });
  }, []);

  const carouselProjects: ProjectItem[] = devProjects.map((project) => ({
    id: project.id,
    title: project.title,
    status: (["2024", "2025", "2026"].includes(project.year) ? "Shipped" : "In progress") as "Shipped" | "In progress",
    shipped: ["2024", "2025", "2026"].includes(project.year),
    description: project.description,
    tags: project.tags ?? [],
    link: project.link,
    image_url: project.image_url,
  }));

  return (
    <section
      id="projects"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--bg)", paddingTop: "4rem", paddingBottom: "1.5rem" }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "1rem" }}
        >
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
            â€” Projects
          </p>
        </motion.div>

        {loading ? (
          <SkeletonGrid variant="dev" />
        ) : loadError ? (
          <ProjectMessage>Unable to load projects. Please try again later.</ProjectMessage>
        ) : carouselProjects.length === 0 ? (
          <ProjectMessage>No development work uploaded yet.</ProjectMessage>
        ) : (
          <ArcCarousel projects={carouselProjects} />
        )}

        <div style={{ marginTop: "4rem", marginBottom: "1rem" }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1.5rem" }}>
            â€” Graphic Design
          </p>

          {loading ? (
            <SkeletonGrid variant="design" />
          ) : loadError ? (
            <ProjectMessage>Unable to load projects. Please try again later.</ProjectMessage>
          ) : designProjects.length === 0 ? (
            <ProjectMessage>No design work uploaded yet.</ProjectMessage>
          ) : (
            <DesignCarousel projects={designProjects} onModal={setModal} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      <style>{`
        .design-carousel-shell {
          position: relative;
          height: clamp(500px, 64vw, 650px);
          /* Keep the horizontal carousel crop, but let the active card's shadow
             fade into the controls area instead of cutting it at this boundary. */
          overflow: visible;
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
          width: clamp(300px, 68vw, 700px);
          min-height: clamp(430px, 56vw, 585px);
          border-radius: 8px;
          padding: clamp(0.95rem, 1.5vw, 1.15rem);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          will-change: transform, opacity, filter;
          transition:
            opacity 0.34s ease,
            filter 0.34s ease,
            transform 0.54s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .design-carousel-image {
          width: 100%;
          height: clamp(300px, 40vw, 430px);
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .design-carousel-image > div {
          width: 100%;
          height: 100%;
        }
        .design-carousel-placeholder {
          width: 100%;
          height: clamp(300px, 40vw, 430px);
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
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-height: 76px;
          padding: 1rem 0 0;
        }
        .design-carousel-title {
          font-size: clamp(20px, 2.8vw, 31px);
          line-height: 1.1;
          margin: 0;
          max-width: 420px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .design-carousel-content .btn {
          flex-shrink: 0;
        }
        .design-carousel-action {
          flex-shrink: 0;
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
          font-family: var(--font-mono), monospace;
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
        @media (max-width: 700px) {
          .design-carousel-shell {
            height: 500px;
          }
          .design-carousel-card {
            width: min(82vw, 380px);
            min-height: 430px;
          }
          .design-carousel-image,
          .design-carousel-placeholder {
            height: 300px;
          }
          .design-carousel-content {
            align-items: stretch;
            flex-direction: column;
            justify-content: flex-start;
            gap: 0.85rem;
            min-height: auto;
          }
          .design-carousel-content .btn {
            width: 100%;
            justify-content: center;
          }
          .design-carousel-action {
            width: 100%;
          }
          .design-carousel-title {
            font-size: 20px;
          }
          .design-carousel-shell::before,
          .design-carousel-shell::after {
            width: 2.75rem;
          }
        }
`}</style>
    </section>
  );
}
