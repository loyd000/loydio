"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";

const MONO = "'IBM Plex Mono', monospace";

const SENTENCES = [
  { prefix: "I build interfaces with", phrase: "React, Next.js, TypeScript, Tailwind, Framer Motion & Vite." },
  { prefix: "I develop backends with", phrase: "Node.js, Express, PostgreSQL, Supabase, Prisma & REST APIs." },
  { prefix: "I design with",           phrase: "Figma, Photoshop, Canva, Illustrator, Framer & Spline." },
  { prefix: "I ship with",             phrase: "Git, GitHub, Vercel, Docker, VS Code & Linux." },
];

const ROW1 = [
  "React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vite",
  "Node.js", "Express", "PostgreSQL", "Supabase", "Prisma", "REST APIs",
];
const ROW2 = [
  "Figma", "Photoshop", "Canva", "Illustrator", "Framer", "Spline",
  "Git", "GitHub", "Vercel", "Docker", "VS Code", "Linux",
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
    <div style={{ padding: "2.5rem 0", minHeight: 130 }}>
      <p style={{
        fontFamily: MONO,
        fontSize: "clamp(10px, 1.1vw, 12px)",
        opacity: 0.3,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginBottom: "0.75rem",
      }}>
        {SENTENCES[idx].prefix}
      </p>
      <p style={{
        fontFamily: MONO,
        fontSize: "clamp(16px, 2.2vw, 26px)",
        fontWeight: 600,
        lineHeight: 1.4,
        minHeight: "1.5em",
        color: "var(--fg)",
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
    </div>
  );
}

function Marquee({ items, reverse = false, speed = 44 }: { items: string[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
    }}>
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", width: "max-content" }}
      >
        {doubled.map((name, i) => (
          <span
            key={i}
            style={{
              fontFamily: MONO,
              fontSize: 11,
              padding: "6px 16px",
              border: "1px solid var(--border)",
              marginRight: 8,
              whiteSpace: "nowrap",
              opacity: 0.45,
              letterSpacing: "0.1em",
              flexShrink: 0,
              color: "var(--fg)",
            }}
          >
            {name}
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
          <div className="rule" />
          <StackTypewriter inView={inView} />
          <div className="rule" />
        </motion.div>

        <Spacer />

        {/* Marquee strips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <Marquee items={ROW1} speed={48} />
          <Marquee items={ROW2} reverse speed={40} />
        </motion.div>

      </div>
    </section>
  );
}
