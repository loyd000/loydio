"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ── Dev Projects ─────────────────────── */
const devCategories = ["All", "Web Dev", "Full-Stack", "Mobile", "IoT", "Tools"];

const devProjects = [
  {
    title: "E-Commerce Platform",
    desc: "Full-featured online store with inventory management, Stripe payments, and admin dashboard.",
    category: "Full-Stack",
    tags: ["Next.js", "Supabase", "Stripe"],
    year: "2024",
    link: "#",
  },
  {
    title: "Portfolio CMS",
    desc: "A headless CMS for creatives — manage work, write case studies, and publish with one click.",
    category: "Web Dev",
    tags: ["React", "Node.js", "MongoDB"],
    year: "2024",
    link: "#",
  },
  {
    title: "Smart Attendance System",
    desc: "IoT-integrated attendance platform using ESP32 and RFID with a real-time web dashboard.",
    category: "IoT",
    tags: ["ESP32", "RFID", "Supabase"],
    year: "2024",
    link: "#",
  },
  {
    title: "Bluetooth Controller App",
    desc: "Android application for BLE communication with embedded hardware devices.",
    category: "Mobile",
    tags: ["Android", "Kotlin", "BLE"],
    year: "2023",
    link: "#",
  },
  {
    title: "Task Management App",
    desc: "Minimalist productivity app with real-time collaboration, drag-and-drop boards, and smart reminders.",
    category: "Full-Stack",
    tags: ["Next.js", "Prisma", "WebSockets"],
    year: "2023",
    link: "#",
  },
  {
    title: "Dev CLI Tool",
    desc: "Command-line tool that scaffolds project structures with custom templates and git hooks.",
    category: "Tools",
    tags: ["Node.js", "Commander.js", "Bash"],
    year: "2022",
    link: "#",
  },
];

/* ── Graphic Design Projects ──────────── */
const designProjects = [
  { title: "Brand Identity System", category: "Branding", year: "2024" },
  { title: "UI Kit & Design System", category: "UI Design", year: "2024" },
  { title: "Event Poster Series", category: "Print Design", year: "2023" },
  { title: "Mobile App UI", category: "UI Design", year: "2023" },
  { title: "Social Media Kit", category: "Digital", year: "2023" },
  { title: "Logo Collection", category: "Branding", year: "2022" },
];

/* ── Shared card grid ─────────────────── */
function ProjectCard({
  title, desc, category, tags, year, link, inView, i,
}: { title: string; desc: string; category: string; tags: string[]; year: string; link: string; inView: boolean; i: number }) {
  return (
    <motion.a
      href={link}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{
        display: "block",
        padding: "2rem",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        textDecoration: "none",
        color: "var(--fg)",
        position: "relative",
        background: "var(--bg)",
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <span className="tag">{category}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.3 }}>{year}</span>
      </div>
      <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 15, fontWeight: 700, marginBottom: "0.75rem", lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.75, marginBottom: "1.5rem" }}>{desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {tags.map((tag) => (
          <span key={tag} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.35 }}>#{tag}</span>
        ))}
      </div>
      <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: 16, opacity: 0, transition: "opacity 0.2s" }} className="project-arrow">↗</div>
    </motion.a>
  );
}

function DesignCard({ title, category, year, inView, i }: { title: string; category: string; year: string; inView: boolean; i: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      style={{
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        transition: "background 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg)")}
    >
      {/* Image placeholder */}
      <div style={{
        width: "100%",
        aspectRatio: "4 / 3",
        background: "var(--border)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.12 }}>
          <rect x="3" y="3" width="18" height="18" stroke="var(--fg)" strokeWidth="1" />
          <circle cx="8.5" cy="8.5" r="2" stroke="var(--fg)" strokeWidth="1" />
          <path d="M3 16l5-5 4 4 3-3 6 6" stroke="var(--fg)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
        <span style={{ position: "absolute", bottom: 10, right: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, opacity: 0.2, letterSpacing: "0.2em" }}>DESIGN SAMPLE</span>
      </div>
      <div style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span className="tag">{category}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, opacity: 0.3 }}>{year}</span>
        </div>
        <h3 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? devProjects : devProjects.filter((p) => p.category === active);

  return (
    <section
      id="projects"
      ref={ref}
      style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Projects</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">04</span>
      </div>

      <div className="section-container">

        {/* ── Section heading ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            Work I&apos;ve Built,<br />
            <span style={{ opacity: 0.25 }}>and Designed.</span>
          </h2>
          <div className="rule" />
          <div style={{ height: "1.5rem" }} aria-hidden />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 460, lineHeight: 1.8 }}>
            A selection of development projects and graphic design samples — spanning web platforms, IoT systems, mobile apps, and visual work.
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "4rem" }} aria-hidden />

        {/* ══ Sub-section 1: Development ══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>
            — Development
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} aria-hidden />

        {/* Filter tabs */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
          <div className="rule" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {devCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "8px 16px",
                  border: "1px solid",
                  borderColor: active === cat ? "var(--fg)" : "var(--border-strong)",
                  background: active === cat ? "var(--fg)" : "transparent",
                  color: active === cat ? "var(--bg)" : "var(--fg)",
                  cursor: "none",
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} aria-hidden />

        {/* Dev grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", border: "1px solid rgba(0,0,0,0.075)" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProjectCard key={p.title} {...p} inView={inView} i={i} />
            ))}
          </AnimatePresence>
        </div>

        <div style={{ height: "5rem" }} aria-hidden />

        {/* ══ Sub-section 2: Graphic Design ══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>
            — Graphic Design
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "2rem" }} aria-hidden />

        {/* Design grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", border: "1px solid rgba(0,0,0,0.075)" }}>
          <AnimatePresence mode="popLayout">
            {designProjects.map((p, i) => (
              <DesignCard key={p.title} {...p} inView={inView} i={i} />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
