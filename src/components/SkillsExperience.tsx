"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const skills = [
  "Next.js", "React", "TypeScript", "Node.js", "Supabase",
  "PostgreSQL", "TailwindCSS", "Framer Motion", "Figma",
  "Android (Java)", "ESP32 / IoT", "Adobe Illustrator",
  "Adobe Photoshop", "REST APIs", "Git",
];

const experience = [
  {
    role: "Full-Stack Developer",
    company: "Freelance / Self-Employed",
    period: "2022 — Present",
    desc: "Building web platforms and mobile apps for clients, from landing pages to full-stack SaaS products.",
  },
  {
    role: "UI/UX Designer",
    company: "Various Clients",
    period: "2021 — Present",
    desc: "Creating interfaces, design systems, and prototypes in Figma focused on clean, functional design.",
  },
  {
    role: "Web Developer Intern",
    company: "Local Tech Startup",
    period: "2021",
    desc: "Built client-facing web pages in a team, learned agile workflows and REST API integration.",
  },
];

export default function SkillsExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="stack"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-container">
        {/* ── Technologies & Tools ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: "4rem" }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1rem",
            }}
          >
            — Technologies &amp; Tools
          </p>
          <div className="skills-grid">
            {skills.map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        </motion.div>

        {/* ── Experience timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1.5rem",
            }}
          >
            — Experience
          </p>

          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "1px",
                background: "linear-gradient(to bottom, var(--border-strong) 0%, var(--border) 60%, transparent 100%)",
                opacity: 0.4,
              }}
            />

            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                style={{
                  paddingLeft: "2rem",
                  paddingTop: "1.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -4,
                    top: "1.75rem",
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--fg)" : "var(--bg)",
                    border: `1.5px solid ${i === 0 ? "var(--fg)" : "var(--border-strong)"}`,
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontFamily: "var(--font-display), 'Syne', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.2, marginBottom: 4 }}>
                      {exp.role}
                    </h3>
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--muted)", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, maxWidth: 460 }}>
                      {exp.desc}
                    </p>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap", paddingTop: 2 }}>
                    {exp.period}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
