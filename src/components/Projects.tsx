"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";

const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

/* ── View Project button ──────────────── */
function ViewBtn({ project, onModal }: { project: Project; onModal: (p: Project) => void }) {
  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--border-heavy)", color: "var(--fg)", background: "var(--bg)", transition: "background 0.2s, color 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--fg)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
      >
        View Project ↗
      </a>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onModal(project); }}
      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--border-heavy)", color: "var(--fg)", background: "var(--bg)", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--fg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--bg)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
    >
      View Project →
    </button>
  );
}

/* ── Dev project card ─────────────────── */
function ProjectCard({ p, inView, i, onModal }: { p: Project; inView: boolean; i: number; onModal: (p: Project) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", color: "var(--fg)", background: "var(--bg)", display: "flex", flexDirection: "column" }}
    >
      {/* Cover image */}
      {p.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.image_url} alt={p.title} style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block", borderBottom: "1px solid var(--border)" }} />
      )}

      <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <span className="tag">{p.category}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.3 }}>{p.year}</span>
        </div>
        <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>{p.title}</h3>
        <p style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.75, marginBottom: "1.5rem", flex: 1 }}>{p.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
          {p.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.35 }}>#{tag}</span>
          ))}
        </div>
        <ViewBtn project={p} onModal={onModal} />
      </div>
    </motion.div>
  );
}

/* ── Design card ──────────────────────── */
function DesignCard({ p, inView, i, onModal }: { p: Project; inView: boolean; i: number; onModal: (p: Project) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", flexDirection: "column" }}
    >
      {/* Image / placeholder */}
      <div style={{ width: "100%", aspectRatio: "4 / 3", background: "var(--border)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
              <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
              <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span style={{ position: "absolute", bottom: 10, right: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, opacity: 0.2, letterSpacing: "0.2em" }}>DESIGN SAMPLE</span>
          </>
        )}
      </div>

      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1, gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span className="tag">{p.category}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.3 }}>{p.year}</span>
          </div>
          <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</h3>
        </div>
        <ViewBtn project={p} onModal={onModal} />
      </div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────── */
export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("All");
  const [devProjects, setDevProjects] = useState<Project[]>([]);
  const [designProjects, setDesignProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Project | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        const all = data ?? [];
        setDevProjects(all.filter((p) => p.type === "dev"));
        setDesignProjects(all.filter((p) => p.type === "design"));
        setLoading(false);
      });
  }, []);

  const filtered = active === "All" ? devProjects : devProjects.filter((p) => p.category === active);

  return (
    <section id="projects" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Projects</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">05</span>
      </div>

      <div className="section-container">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            Work I&apos;ve Built,<br /><span style={{ opacity: 0.25 }}>and Designed.</span>
          </h2>
          <div className="rule" />
          <div style={{ height: "1.5rem" }} />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 460, lineHeight: 1.8 }}>
            A selection of development projects and graphic design samples — spanning web platforms, IoT systems, mobile apps, and visual work.
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "4rem" }} />

        {/* ══ Dev ══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>— Development</p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} />

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
          <div className="rule" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {devCategories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 16px", border: "1px solid", borderColor: active === cat ? "var(--fg)" : "var(--border-strong)", background: active === cat ? "var(--fg)" : "transparent", color: active === cat ? "var(--bg)" : "var(--fg)", cursor: "pointer", transition: "all 0.2s" }}>
                {cat}
              </button>
            ))}
          </div>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} />

        {loading ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.35, letterSpacing: "0.2em", padding: "2rem 0" }}>LOADING...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", border: "1px solid rgba(0,0,0,0.075)" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} p={p} inView={inView} i={i} onModal={setModal} />
              ))}
            </AnimatePresence>
          </div>
        )}

        <div style={{ height: "5rem" }} />

        {/* ══ Design ══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>— Graphic Design</p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} />

        {loading ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.35, letterSpacing: "0.2em", padding: "2rem 0" }}>LOADING...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", border: "1px solid rgba(0,0,0,0.075)" }}>
            <AnimatePresence mode="popLayout">
              {designProjects.map((p, i) => (
                <DesignCard key={p.id} p={p} inView={inView} i={i} onModal={setModal} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
}
