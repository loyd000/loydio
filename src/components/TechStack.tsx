"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiVite,
  SiNodedotjs, SiExpress, SiPostgresql, SiSupabase, SiPrisma, SiOpenapiinitiative,
  SiFigma, SiCanva, SiThreedotjs,
  SiGit, SiGithub, SiVercel, SiDocker, SiVscodium, SiLinux,
} from "react-icons/si";
import type { IconType } from "react-icons";

const MONO = "'IBM Plex Mono', monospace";

const SENTENCES = [
  { prefix: "I build interfaces with", phrase: "React, Next.js, TypeScript, Tailwind, Framer Motion & Vite." },
  { prefix: "I develop backends with", phrase: "Node.js, Express, PostgreSQL, Supabase, Prisma & REST APIs." },
  { prefix: "I design with",           phrase: "Figma, Photoshop, Canva, Illustrator, Framer & Spline." },
  { prefix: "I ship with",             phrase: "Git, GitHub, Vercel, Docker, VS Code & Linux." },
];

const ALL_TECH: { name: string; Icon: IconType | null }[] = [
  { name: "React",         Icon: SiReact },
  { name: "Next.js",       Icon: SiNextdotjs },
  { name: "TypeScript",    Icon: SiTypescript },
  { name: "Tailwind",      Icon: SiTailwindcss },
  { name: "Framer Motion", Icon: SiFramer },
  { name: "Vite",          Icon: SiVite },
  { name: "Node.js",       Icon: SiNodedotjs },
  { name: "Express",       Icon: SiExpress },
  { name: "PostgreSQL",    Icon: SiPostgresql },
  { name: "Supabase",      Icon: SiSupabase },
  { name: "Prisma",        Icon: SiPrisma },
  { name: "REST APIs",     Icon: SiOpenapiinitiative },
  { name: "Figma",         Icon: SiFigma },
  { name: "Photoshop",     Icon: null },
  { name: "Canva",         Icon: SiCanva },
  { name: "Illustrator",   Icon: null },
  { name: "Framer",        Icon: SiFramer },
  { name: "Spline",        Icon: SiThreedotjs },
  { name: "Git",           Icon: SiGit },
  { name: "GitHub",        Icon: SiGithub },
  { name: "Vercel",        Icon: SiVercel },
  { name: "Docker",        Icon: SiDocker },
  { name: "VS Code",       Icon: SiVscodium },
  { name: "Linux",         Icon: SiLinux },
];

function StackTypewriter({ inView }: { inView: boolean }) {
  const [idx,       setIdx]       = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase,     setPhase]     = useState<"idle" | "typing" | "pausing" | "deleting">("idle");

  useEffect(() => {
    if (inView) setPhase("typing");
  }, [inView]);

  useEffect(() => {
    const full = SENTENCES[idx].phrase;

    if (phase === "typing") {
      if (displayed.length < full.length) {
        const t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 28);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), 2400);
      return () => clearTimeout(t);
    }
    if (phase === "pausing") {
      const t = setTimeout(() => setPhase("deleting"), 0);
      return () => clearTimeout(t);
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 14);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % SENTENCES.length);
        setPhase("typing");
      }, 240);
      return () => clearTimeout(t);
    }
  }, [phase, displayed, idx]);

  return (
    <div style={{ minHeight: 130 }}>
      <div className="rule" />
      <p style={{
        fontFamily: MONO,
        fontSize: "clamp(10px, 1.1vw, 12px)",
        opacity: 0.3,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "0.75rem 0",
      }}>
        {SENTENCES[idx].prefix}
      </p>
      <div className="rule" />
      <p style={{
        fontFamily: MONO,
        fontSize: "clamp(16px, 2.2vw, 26px)",
        fontWeight: 600,
        lineHeight: 1.4,
        minHeight: "1.5em",
        color: "var(--fg)",
        padding: "1rem 0",
      }}>
        {displayed}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
          style={{
            display: "inline-block",
            width: 2,
            height: "0.85em",
            background: "var(--fg)",
            marginLeft: 3,
            verticalAlign: "middle",
          }}
        />
      </p>
      <div className="rule" />
    </div>
  );
}

function Marquee() {
  const doubled = [...ALL_TECH, ...ALL_TECH];
  return (
    <div
      className="full-bleed"
      style={{
        overflow: "hidden",
        maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        padding: "20px 0",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", alignItems: "center", width: "max-content" }}
      >
        {doubled.map((tech, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              fontFamily: MONO,
              fontSize: 15,
              padding: "0 36px",
              whiteSpace: "nowrap",
              opacity: 0.45,
              letterSpacing: "0.08em",
              color: "var(--fg)",
              flexShrink: 0,
              borderRight: "1px solid var(--border)",
            }}
          >
            {tech.Icon && <tech.Icon size={18} style={{ flexShrink: 0 }} />}
            {tech.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const Spacer = ({ h = "2.5rem" }: { h?: string }) => <div style={{ height: h }} aria-hidden />;

export default function TechStack() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="stack"
      ref={ref}
      style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Tech Stack</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">03</span>
      </div>

      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rule" />
          <h2 style={{ fontFamily: MONO, fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            <TypewriterText text1="Balanced Between Logic" text2="and Creativity." inView={inView} />
          </h2>
          <div className="rule" />
          <Spacer h="1.5rem" />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 400, lineHeight: 1.8 }}>
            The tools and technologies I use to build fast, scalable, and beautiful products.
          </p>
          <div className="rule" />
        </motion.div>

        <Spacer />

        {/* Typewriter reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StackTypewriter inView={inView} />
        </motion.div>

        <Spacer />

        {/* Full-bleed marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="rule" />
          <Marquee />
          <div className="rule" />
        </motion.div>

      </div>

    </section>
  );
}
