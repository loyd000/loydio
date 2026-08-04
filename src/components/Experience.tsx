"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Freelance / Self-Employed",
    period: "2022 — Present",
    desc: "Designing and developing web applications for clients across the Philippines and globally. From landing pages to full-stack SaaS platforms.",
    tags: ["Next.js", "React", "Node.js", "Supabase"],
  },
  {
    role: "UI/UX Designer",
    company: "Various Clients",
    period: "2021 — Present",
    desc: "Creating user interfaces, design systems, and prototypes in Figma. Focused on clean, functional design that converts.",
    tags: ["Figma", "Adobe XD", "Framer", "Prototyping"],
  },
  {
    role: "Web Developer Intern",
    company: "Local Tech Startup",
    period: "2021",
    desc: "Built and maintained client-facing web pages, learned agile workflows, and contributed to a team-based product.",
    tags: ["React", "CSS", "REST APIs"],
  },
];

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={ref}
      className="section-mobile-pad"
      style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}
    >


      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rule" />
          <h2 className="section-heading" style={{ fontSize: "clamp(28px, 4.5vw, 42px)" }}>
            Where I&apos;ve<br />Worked & Grown.
          </h2>
          <div className="rule" />
        </motion.div>

        <Spacer />

        <div style={{ position: "relative" }}>
          {/* Timeline vertical line */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, var(--accent) 0%, var(--border) 60%, transparent 100%)",
              opacity: 0.4,
            }}
          />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className="rule" />
              <div style={{ position: "relative", paddingLeft: "3rem", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
                {/* Timeline dot — accent filled */}
                <div
                  style={{
                    position: "absolute",
                    left: -5,
                    top: "2.75rem",
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--accent)" : "var(--bg)",
                    border: `1.5px solid ${i === 0 ? "var(--accent)" : "var(--border-strong)"}`,
                    boxShadow: i === 0 ? "var(--accent-glow)" : "none",
                    transition: "background 0.3s ease",
                  }}
                />
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3
                      className="section-heading"
                      style={{ fontSize: 18, marginBottom: "0.25rem", color: "var(--fg)" }}
                    >
                      {exp.role}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 11,
                        color: "var(--muted)",
                        marginBottom: "1rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.8, maxWidth: 500, marginBottom: "1.25rem" }}>
                      {exp.desc}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {exp.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11,
                      color: "var(--muted)",
                      whiteSpace: "nowrap",
                      paddingTop: 4,
                    }}
                  >
                    {exp.period}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="rule" />
        </div>
      </div>
    </section>
  );
}
