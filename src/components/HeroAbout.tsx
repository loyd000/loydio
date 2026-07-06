"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const roles = ["Developer.", "Designer.", "Builder.", "Problem Solver."];

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

export default function HeroAbout() {
  /* ── Typewriter ── */
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping]       = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    const current = roles[roleIndex];
    const i = displayed.length;
    if (typing) {
      if (i < current.length) {
        const t = setTimeout(() => {
          if (mounted.current) setDisplayed(current.slice(0, i + 1));
        }, 75);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          if (mounted.current) setTyping(false);
        }, 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => {
          if (mounted.current) setDisplayed(current.slice(0, i - 1));
        }, 35);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          if (mounted.current) {
            setRoleIndex((prev) => (prev + 1) % roles.length);
            setTyping(true);
          }
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, typing, roleIndex]);

  /* ── Scroll-in for below-fold content ── */
  const belowRef = useRef(null);
  const belowInView = useInView(belowRef, { once: true, margin: "-80px" });

  /* ── Photo hover state ── */
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section
      id="about"
      className="hero-about-section"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Subtle ambient glow — bottom-left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-16%",
          left: "-8%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="section-container hero-about-container"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* ═══════════════════════════════════════════
            TOP: Hero intro + Photo (side by side)
        ═══════════════════════════════════════════ */}
        <div className="hero-about-grid">

          {/* Left column — intro */}
          <div className="hero-about-intro">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}
            >
              <div style={{ width: 24, height: 1, background: "var(--accent)", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)" }}>
                Full-Stack Developer &amp; Graphic Designer
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              style={{
                fontFamily: "var(--font-display), 'Syne', sans-serif",
                fontSize: "clamp(48px, 9vw, 120px)",
                fontWeight: 800,
                lineHeight: 0.93,
                letterSpacing: "-0.03em",
                marginBottom: "1.5rem",
              }}
            >
              Loyd.
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-sans), 'Manrope', sans-serif",
                fontSize: "clamp(14px, 1.5vw, 17px)",
                marginBottom: "1.5rem",
              }}
            >
              <span style={{ color: "var(--muted)", fontWeight: 300 }}>I am a</span>
              <span style={{ fontWeight: 700, minWidth: "clamp(100px, 16vw, 180px)" }}>
                {displayed}
                <span style={{ color: "var(--accent)" }} className="blink">|</span>
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              style={{
                fontFamily: "var(--font-sans), 'Manrope', sans-serif",
                fontSize: 16,
                fontWeight: 400,
                color: "var(--muted)",
                maxWidth: 440,
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              I build modern web platforms, mobile apps, and hardware-integrated systems.
              My focus is on crafting clean, scalable solutions — bridging the gap between functionality and design.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48 }}
              style={{ display: "flex", gap: "2.5rem", marginBottom: "2rem", flexWrap: "wrap" }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-grotesk), 'Space Grotesk', sans-serif",
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
                      fontFamily: "'IBM Plex Mono', monospace",
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
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <a href="#projects" className="btn btn-outline">View Work</a>
              <a href="#contact" className="btn btn-accent">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", opacity: 0.85, flexShrink: 0 }} />
                Let&apos;s Talk
              </a>
            </motion.div>
          </div>

          {/* Right column — photo */}
          <motion.div
            className="hero-about-photo"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                priority
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

        {/* ═══════════════════════════════════════════
            BELOW: Skills + Experience (scroll-revealed)
        ═══════════════════════════════════════════ */}
        <div ref={belowRef} style={{ marginTop: "4rem" }}>

          {/* ── Skills ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={belowInView ? { opacity: 1, y: 0 } : {}}
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
            animate={belowInView ? { opacity: 1, y: 0 } : {}}
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
                  background: "linear-gradient(to bottom, var(--accent) 0%, var(--border) 60%, transparent 100%)",
                  opacity: 0.35,
                }}
              />

              {experience.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={belowInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.1 }}
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
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {exp.period}
                    </span>
                  </div>

                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--muted)", marginBottom: "0.5rem" }}>
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

        {/* Scroll cue — desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="hero-scroll-cue"
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ width: 1, height: 30, background: "var(--accent)", opacity: 0.5 }}
          />
        </motion.div>
      </div>

      <style>{`
        .hero-about-section { display: block; }
        .hero-about-container {
          padding-top: 6rem;
          padding-bottom: 3rem;
        }
        .hero-about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        .hero-about-photo {
          max-width: 300px;
        }
        .hero-scroll-cue { display: none !important; }

        @media (min-width: 900px) {
          .hero-about-section {
            min-height: 100dvh;
            display: flex;
            align-items: center;
          }
          .hero-about-container {
            padding-top: 5rem;
            padding-bottom: 4rem;
          }
          .hero-about-grid {
            grid-template-columns: 3fr 2fr;
            align-items: center;
            gap: 4rem;
          }
          .hero-about-photo {
            max-width: 380px;
            justify-self: end;
          }
          .hero-scroll-cue { display: flex !important; }
        }

        @media (max-width: 480px) {
          .hero-about-photo {
            max-width: 260px;
          }
        }
      `}</style>
    </section>
  );
}
