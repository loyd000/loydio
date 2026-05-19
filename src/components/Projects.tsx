"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Project } from "@/lib/supabase";
import ProjectModal from "./ProjectModal";
import MagnifyImage from "./MagnifyImage";
import TypewriterText from "./TypewriterText";
import ScrambleText from "./ScrambleText";

const MONO = "'IBM Plex Mono', monospace";
const INITIAL_SHOW = 3;

const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

/* ── View Project button with scramble ── */
function ViewBtn({ project, onModal, cardHovered }: { project: Project; onModal: (p: Project) => void; cardHovered?: boolean }) {
  const [scrTrigger, setScrTrigger] = useState(0);

  useEffect(() => {
    if (cardHovered) setScrTrigger((n) => n + 1);
  }, [cardHovered]);

  const label = project.link ? "View Project ↗" : "View Project →";

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--border-heavy)", color: "var(--fg)", background: "var(--bg)", transition: "background 0.2s, color 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--fg)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
      >
        {cardHovered ? <ScrambleText text={label} startDelay={0} trigger={scrTrigger} /> : label}
      </a>
    );
  }
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onModal(project); }}
      style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid var(--border-heavy)", color: "var(--fg)", background: "var(--bg)", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--fg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--bg)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)"; }}
    >
      {cardHovered ? <ScrambleText text={label} startDelay={0} trigger={scrTrigger} /> : label}
    </button>
  );
}

/* ── Dev project card ─────────────────── */
function ProjectCard({ p, inView, i, onModal }: { p: Project; inView: boolean; i: number; onModal: (p: Project) => void }) {
  const [descScroll, setDescScroll] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapRef.current) {
      setMaxScroll(Math.max(0, wrapRef.current.scrollHeight - wrapRef.current.clientHeight));
    }
  }, [p.description]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (maxScroll === 0) return;
      e.preventDefault();
      setDescScroll(prev => Math.max(0, Math.min(maxScroll, prev + e.deltaY * 0.6)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [maxScroll]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", color: "var(--fg)", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Progress bar sweep */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: "var(--fg)",
          width: hovered ? "100%" : "0%",
          transition: hovered ? "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "width 0.3s ease",
          zIndex: 4,
        }}
      />

      {p.image_url && (
        <div style={{ overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
          </div>
        </div>
      )}

      <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(p.category || "").split(",").map(c => <span key={c.trim()} className="tag">{c.trim()}</span>)}
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.3 }}>{p.year}</span>
        </div>

        <h3 style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>{p.title}</h3>

        {/* Description window — scroll wheel scrolls the text */}
        <div
          ref={wrapRef}
          style={{ position: "relative", height: 63, overflow: "hidden", marginBottom: "1.5rem" }}
        >
          <motion.p
            style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.75, margin: 0 }}
            animate={{ y: -descScroll }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {p.description}
          </motion.p>
          {maxScroll > 0 && descScroll < maxScroll && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 20, background: "linear-gradient(to bottom, transparent, var(--bg))", pointerEvents: "none" }} />
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.5rem" }}>
          {(p.tags ?? []).map((tag) => <span key={tag} style={{ fontFamily: MONO, fontSize: 10, opacity: 0.35 }}>#{tag}</span>)}
        </div>
        <ViewBtn project={p} onModal={onModal} cardHovered={hovered} />
      </div>
    </motion.div>
  );
}

/* ── Design card ──────────────────────── */
function DesignCard({ p, inView, i, onModal }: { p: Project; inView: boolean; i: number; onModal: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Progress bar sweep */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: "var(--fg)",
          width: hovered ? "100%" : "0%",
          transition: hovered ? "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "width 0.3s ease",
          zIndex: 4,
        }}
      />

      {/* Image / placeholder */}
      {p.image_url ? (
        <div style={{ overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            transform: hovered ? "scale(1.08)" : "scale(1)",
            transition: "transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}>
            <MagnifyImage
              src={p.image_url}
              alt={p.title}
              sizes="(max-width: 900px) 100vw, 33vw"
              style={{ width: "100%", aspectRatio: "4 / 3", background: "var(--border)" }}
            />
          </div>
        </div>
      ) : (
        <div style={{ width: "100%", aspectRatio: "4 / 3", background: "var(--border)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
            <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
            <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
            <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <span style={{ position: "absolute", bottom: 10, right: 12, fontFamily: MONO, fontSize: 9, opacity: 0.2, letterSpacing: "0.2em" }}>DESIGN SAMPLE</span>
        </div>
      )}

      <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", flex: 1, gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(p.category || "").split(",").map(c => (
                <span key={c.trim()} className="tag">{c.trim()}</span>
              ))}
            </div>
            <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.3 }}>{p.year}</span>
          </div>
          <h3 style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{p.title}</h3>
        </div>
        <ViewBtn project={p} onModal={onModal} cardHovered={hovered} />
      </div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────── */
function ProjectSkeletonGrid({ variant = "dev" }: { variant?: "dev" | "design" }) {
  const imageAspect = variant === "design" ? "4 / 3" : "16 / 9";
  const label = variant === "design" ? "Loading design work" : "Loading development projects";

  return (
    <div className="project-grid" role="status" aria-label={label}>
      {Array.from({ length: INITIAL_SHOW }).map((_, i) => (
        <div
          className="project-skeleton-card"
          key={`${variant}-skeleton-${i}`}
          style={{ animationDelay: `${i * 0.12}s` }}
          aria-hidden="true"
        >
          <div className="project-skeleton-block" style={{ aspectRatio: imageAspect }} />
          <div style={{ padding: variant === "design" ? "1.25rem 1.5rem" : "1.75rem 2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: "1.25rem" }}>
              <div className="project-skeleton-pill" />
              <div className="project-skeleton-meta" />
            </div>
            <div className="project-skeleton-title" />
            <div className="project-skeleton-line" style={{ width: "92%" }} />
            <div className="project-skeleton-line" style={{ width: "68%" }} />
            <div style={{ display: "flex", gap: 8, marginTop: "1.5rem" }}>
              <div className="project-skeleton-tag" />
              <div className="project-skeleton-tag" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("All");
  const [devProjects, setDevProjects] = useState<Project[]>([]);
  const [designProjects, setDesignProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState<Project | null>(null);
  const [devShowAll, setDevShowAll] = useState(false);
  const [designShowAll, setDesignShowAll] = useState(false);

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
        setDevProjects(all.filter((p) => p.type === "dev"));
        setDesignProjects(all.filter((p) => p.type === "design"));
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(
    () => active === "All" ? devProjects : devProjects.filter((p) => (p.category || "").split(",").map(c => c.trim()).includes(active)),
    [active, devProjects]
  );
  const displayedDev = devShowAll ? filtered : filtered.slice(0, INITIAL_SHOW);
  const displayedDesign = designShowAll ? designProjects : designProjects.slice(0, INITIAL_SHOW);

  useEffect(() => { setDevShowAll(false); }, [active]);

  return (
    <section id="projects" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Projects</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">05</span>
      </div>

      <div className="section-container">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: MONO, fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            <TypewriterText text1="Code that scales," text2="interfaces that inspire." inView={inView} />
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

        <div style={{ height: "1.5rem" }} />

        {loading ? (
          <>
            <div className="rule" />
            <ProjectSkeletonGrid />
            <div className="rule" />
          </>
        ) : loadError ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.5, letterSpacing: "0.1em", padding: "2rem 0" }}>PROJECTS FAILED TO LOAD</div>
        ) : (
          <>
            <div className="rule" />
            <div className="project-grid">
              <AnimatePresence mode="popLayout">
                {displayedDev.map((p, i) => (
                  <ProjectCard key={p.id} p={p} inView={inView} i={i} onModal={setModal} />
                ))}
              </AnimatePresence>
            </div>
            <div style={{ height: "1.5rem" }} />
            {filtered.length > INITIAL_SHOW ? (
              <>
                <div className="rule" />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => setDevShowAll((v) => !v)}
                    aria-expanded={devShowAll}
                    style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 28px", border: "1px solid var(--border-heavy)", background: "transparent", color: "var(--fg)", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fg)"; e.currentTarget.style.color = "var(--bg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg)"; }}
                  >
                    {devShowAll ? "Show Less ↑" : `Show More (${filtered.length - INITIAL_SHOW} more) ↓`}
                  </button>
                </div>
                <div className="rule" />
              </>
            ) : (
              <div className="rule" />
            )}
          </>
        )}

        <div style={{ height: "5rem" }} />

        {/* ══ Design ══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>— Graphic Design</p>
          <div className="rule" />
        </motion.div>

        {loading ? (
          <>
            <div className="rule" />
            <ProjectSkeletonGrid variant="design" />
            <div className="rule" />
          </>
        ) : loadError ? (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.5, letterSpacing: "0.1em", padding: "2rem 0" }}>DESIGN WORK FAILED TO LOAD</div>
        ) : (
          <>
            <div className="rule" />
            <div className="project-grid">
              <AnimatePresence mode="popLayout">
                {displayedDesign.map((p, i) => (
                  <DesignCard key={p.id} p={p} inView={inView} i={i} onModal={setModal} />
                ))}
              </AnimatePresence>
            </div>
            <div style={{ height: "1.5rem" }} />
            {designProjects.length > INITIAL_SHOW ? (
              <>
                <div className="rule" />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={() => setDesignShowAll((v) => !v)}
                    aria-expanded={designShowAll}
                    style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "10px 28px", border: "1px solid var(--border-heavy)", background: "transparent", color: "var(--fg)", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fg)"; e.currentTarget.style.color = "var(--bg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg)"; }}
                  >
                    {designShowAll ? "Show Less ↑" : `Show More (${designProjects.length - INITIAL_SHOW} more) ↓`}
                  </button>
                </div>
                <div className="rule" />
              </>
            ) : (
              <div className="rule" />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <ProjectModal project={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </section>
  );
}
