"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "@/components/ProjectModal";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });

const MONO = "var(--font-mono), monospace";
const DISPLAY = "var(--font-display), sans-serif";

type Filter = "all" | "dev" | "design";

/* ── Skeleton card ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="proj-card proj-card-skeleton" aria-hidden>
      <div className="proj-card-img-wrap proj-skeleton-img" />
      <div className="proj-card-body">
        <div className="proj-skeleton-line" style={{ width: "65%", height: 14, marginBottom: 8 }} />
        <div className="proj-skeleton-line" style={{ width: "90%", height: 11 }} />
        <div className="proj-skeleton-line" style={{ width: "75%", height: 11, marginTop: 4 }} />
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          <div className="proj-skeleton-line" style={{ width: 44, height: 20, borderRadius: 4 }} />
          <div className="proj-skeleton-line" style={{ width: 44, height: 20, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

/* ── Project card ──────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  onModal,
}: {
  project: Project;
  index: number;
  onModal: (p: Project) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hasLink = Boolean(project.link);

  return (
    <motion.div
      ref={ref}
      className="proj-card liquid-glass-card"
      initial={{ opacity: 0, y: 28 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay: (index % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* image */}
      <div className="proj-card-img-wrap">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            style={{ objectFit: "cover", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}
            className="proj-card-img"
          />
        ) : (
          <div className="proj-card-img-placeholder" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.18 }}>
              <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
              <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* type badge */}
        <span className={`proj-type-badge proj-type-${project.type}`}>
          {project.type === "dev" ? "Dev" : "Design"}
        </span>

        {/* year badge */}
        <span className="proj-year-badge">{project.year}</span>

        {/* hover overlay */}
        <div className="proj-card-overlay">
          {hasLink ? (
            <a
              href={project.link!}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-cta-btn liquid-glass-btn"
              onClick={(e) => e.stopPropagation()}
            >
              View Project →
            </a>
          ) : (
            <button className="proj-cta-btn liquid-glass-btn" onClick={() => onModal(project)}>
              View Details →
            </button>
          )}
        </div>
      </div>

      {/* body */}
      <div className="proj-card-body" onClick={() => !hasLink && onModal(project)} style={{ cursor: hasLink ? "default" : "pointer" }}>
        <h2 className="proj-card-title">{project.title}</h2>
        {project.description && (
          <p className="proj-card-desc">{project.description}</p>
        )}
        {(project.tags ?? []).length > 0 && (
          <div className="proj-card-tags">
            {(project.tags ?? []).slice(0, 4).map((t) => (
              <span key={t} className="proj-tag">#{t}</span>
            ))}
          </div>
        )}
        {hasLink && (
          <a
            href={project.link!}
            target="_blank"
            rel="noopener noreferrer"
            className="proj-card-link"
          >
            Open →
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modal, setModal] = useState<Project | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoading(false); return; }
        setAllProjects(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all" ? allProjects :
    filter === "dev" ? allProjects.filter((p) => p.type === "dev") :
    allProjects.filter((p) => p.type === "design");

  const devCount = allProjects.filter((p) => p.type === "dev").length;
  const designCount = allProjects.filter((p) => p.type === "design").length;

  const tabs: { label: string; value: Filter; count: number }[] = [
    { label: "All", value: "all", count: allProjects.length },
    { label: "Dev", value: "dev", count: devCount },
    { label: "Design", value: "design", count: designCount },
  ];

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="projects-page-main">
        {/* ── Page header ── */}
        <section className="projects-page-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/" className="projects-back-link">
              ← Back
            </Link>
            <p className="projects-page-eyebrow">— Work</p>
            <h1 className="projects-page-title">Projects</h1>
            <p className="projects-page-subtitle">
              A collection of dev and design work — things I built, shipped, or explored.
            </p>
          </motion.div>

          {/* ── Filter tabs ── */}
          <motion.div
            className="projects-filter-bar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={`projects-filter-tab${filter === tab.value ? " active" : ""}`}
                onClick={() => setFilter(tab.value)}
                aria-pressed={filter === tab.value}
                id={`filter-${tab.value}`}
              >
                {tab.label}
                {!loading && (
                  <span className="projects-filter-count">{tab.count}</span>
                )}
              </button>
            ))}
          </motion.div>
        </section>

        {/* ── Grid ── */}
        <section className="projects-page-grid-section section-container">
          {loading ? (
            <div className="proj-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <p className="projects-page-message">Unable to load projects. Please try again later.</p>
          ) : filtered.length === 0 ? (
            <p className="projects-page-message">No projects found.</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                className="proj-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {filtered.map((p, i) => (
                  <ProjectCard key={p.id} project={p} index={i} onModal={setModal} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>

      <style>{`
        /* ── Page layout ── */
        .projects-page-main {
          min-height: 100vh;
          background: var(--bg);
          padding-top: 6rem;
        }
        .projects-page-header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem clamp(1.5rem, 6vw, 5rem) 2rem;
        }
        .projects-back-link {
          display: inline-block;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          margin-bottom: 2rem;
          transition: color 0.2s ease;
        }
        .projects-back-link:hover { color: var(--fg); }

        .projects-page-eyebrow {
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.75rem;
        }
        .projects-page-title {
          font-family: ${DISPLAY};
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--fg);
          margin-bottom: 1rem;
        }
        .projects-page-subtitle {
          font-size: 13px;
          color: var(--muted);
          max-width: 440px;
          line-height: 1.75;
          margin-bottom: 2.5rem;
        }
        .projects-page-message {
          font-family: ${MONO};
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.12em;
          padding: 3rem 0;
        }

        /* ── Filter bar ── */
        .projects-filter-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--subtle-bg);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 4px;
          width: fit-content;
        }
        .projects-filter-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: ${MONO};
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          background: none;
          border: none;
          border-radius: 999px;
          padding: 6px 16px;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .projects-filter-tab:hover { color: var(--fg); }
        .projects-filter-tab.active {
          color: var(--fg);
          background: var(--bg);
          box-shadow: 0 1px 6px rgba(0,0,0,0.08);
        }
        [data-theme="dark"] .projects-filter-tab.active {
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .projects-filter-count {
          font-size: 9px;
          opacity: 0.45;
          font-weight: 600;
        }

        /* ── Grid ── */
        .projects-page-grid-section {
          padding-bottom: 6rem;
        }
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .proj-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .proj-grid { grid-template-columns: 1fr; gap: 1rem; }
        }

        /* ── Card ── */
        .proj-card {
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .proj-card:hover {
          transform: translateY(-2px);
        }

        /* ── Card image area ── */
        .proj-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: var(--subtle-bg);
          overflow: hidden;
        }
        .proj-card-img {
          object-fit: cover;
        }
        .proj-card:hover .proj-card-img {
          transform: scale(1.04);
        }
        .proj-card-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Overlay on hover ── */
        .proj-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
          backdrop-filter: blur(2px);
        }
        .proj-card:hover .proj-card-overlay { opacity: 1; }

        .proj-cta-btn {
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 999px;
          padding: 8px 20px;
          cursor: pointer;
          text-decoration: none;
        }

        /* ── Badges ── */
        .proj-type-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-family: ${MONO};
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(16px) saturate(175%);
          -webkit-backdrop-filter: blur(16px) saturate(175%);
          border: 1px solid rgba(255, 255, 255, 0.52);
          box-shadow: 
            inset 0 1.5px 0 0 rgba(255, 255, 255, 0.9),
            inset 1.5px 0 0 0 rgba(255, 255, 255, 0.38),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.04),
            inset -1px 0 0 0 rgba(0, 0, 0, 0.02),
            0 0 0 0.5px rgba(255, 255, 255, 0.26),
            0 2px 10px 0 rgba(0, 0, 0, 0.05);
        }
        .proj-type-dev {
          color: var(--fg);
        }
        .proj-type-design {
          color: var(--fg);
        }
        [data-theme="dark"] .proj-type-badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 
            inset 0 1.5px 0 0 rgba(255, 255, 255, 0.48),
            inset 1.5px 0 0 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 0 rgba(0, 0, 0, 0.52),
            inset -1px 0 0 0 rgba(0, 0, 0, 0.28),
            0 0 0 0.5px rgba(255, 255, 255, 0.1),
            0 2px 10px 0 rgba(0, 0, 0, 0.2);
        }
        .proj-year-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          font-family: ${MONO};
          font-size: 9px;
          opacity: 0.5;
          color: #fff;
          letter-spacing: 0.12em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        /* ── Card body ── */
        .proj-card-body {
          padding: 1.1rem 1.25rem 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .proj-card-title {
          font-family: ${DISPLAY};
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 700;
          line-height: 1.2;
          color: var(--fg);
          margin: 0 0 0.45rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .proj-card-desc {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 0.75rem;
          flex: 1;
        }
        .proj-card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 0.75rem;
        }
        .proj-tag {
          font-family: ${MONO};
          font-size: 9px;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 2px 7px;
          border-radius: 2px;
          letter-spacing: 0.08em;
        }
        .proj-card-link {
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--fg);
          text-decoration: none;
          margin-top: auto;
          opacity: 0.55;
          transition: opacity 0.2s ease;
          align-self: flex-start;
        }
        .proj-card-link:hover { opacity: 1; }

        /* ── Skeleton ── */
        .proj-card-skeleton {
          pointer-events: none;
        }
        .proj-skeleton-img {
          background: var(--subtle-bg);
          animation: proj-shimmer 1.4s ease-in-out infinite;
        }
        .proj-skeleton-line {
          background: var(--subtle-bg);
          border-radius: 3px;
          animation: proj-shimmer 1.4s ease-in-out infinite;
        }
        @keyframes proj-shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
          .projects-page-main { padding-top: 5rem; }
          .projects-page-header { padding-bottom: 1.5rem; }
          .projects-filter-bar { width: 100%; justify-content: center; }
          .projects-filter-tab { flex: 1; justify-content: center; }
        }
      `}</style>
    </>
  );
}
