"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
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

const stats = [
  { value: "3+", label: "Years Exp." },
  { value: "20+", label: "Projects" },
  { value: "10+", label: "Clients" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section
      id="about"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--bg)" }}
    >
      <div className="section-container">

        {/* ── Section label ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <span className="eyebrow">About Me</span>
        </motion.div>

        {/* ── Bio + Photo ── */}
        <div className="about-grid" style={{ marginBottom: "4rem" }}>

          {/* Left: bio + stats */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2
              className="section-heading"
              style={{ fontSize: "clamp(22px, 3vw, 34px)", marginBottom: "1.5rem" }}
            >
              Engineered with Precision,<br />Designed with Purpose.
            </h2>

            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
              I&apos;m a full-stack developer and graphic designer with a strong foundation in software engineering, IoT, and user-centered design. I build modern web platforms, mobile apps, and hardware-integrated systems.
            </p>

            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.8, marginBottom: "2rem" }}>
              My focus is on crafting clean, scalable systems — whether a Bluetooth-controlled app, a smart embedded device, or a responsive web platform. I bridge the gap between functionality and design.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: "2.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(24px, 3vw, 36px)",
                      fontWeight: 800,
                      lineHeight: 1,
                      color: "var(--accent)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginTop: 6,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact" className="btn btn-accent">Get in Touch</a>
          </motion.div>

          {/* Right: photo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ maxWidth: 340 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              <Image
                src="/me.jpg"
                alt="John Lloyd De Guzman"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: imgLoaded ? "grayscale(100%)" : "none",
                  transition: "filter 0.5s ease",
                }}
                onLoad={() => setImgLoaded(true)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%)"; }}
              />
            </motion.div>
          </motion.div>

        </div>

        {/* ── Skills ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ marginBottom: "4rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
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
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono), monospace",
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
                background: "linear-gradient(to bottom, var(--accent) 0%, var(--border) 60%, transparent 100%)",
                opacity: 0.35,
              }}
            />

            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.45 + i * 0.1 }}
                style={{
                  paddingLeft: "2rem",
                  paddingBottom: i < experience.length - 1 ? "2rem" : 0,
                  position: "relative",
                }}
              >
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: -5,
                    top: 5,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--accent)" : "var(--bg)",
                    border: `1.5px solid ${i === 0 ? "var(--accent)" : "var(--border-strong)"}`,
                    boxShadow: i === 0 ? "var(--accent-glow)" : "none",
                  }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                  <h3
                    className="section-heading"
                    style={{ fontSize: 16 }}
                  >
                    {exp.role}
                  </h3>
                  <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>
                    {exp.period}
                  </span>
                </div>

                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "var(--muted)", marginBottom: "0.5rem" }}>
                  {exp.company}
                </p>

                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
                  {exp.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
