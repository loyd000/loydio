"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";

const roles = ["Developer.", "Designer.", "Builder.", "Problem Solver."];

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIndex];
    const i = displayed.length;
    if (typing) {
      if (i < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, i + 1)), 80);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1800);
        return () => clearTimeout(t);
      }
    } else {
      if (i > 0) {
        const t = setTimeout(() => setDisplayed(current.slice(0, i - 1)), 40);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setRoleIndex((prev) => (prev + 1) % roles.length);
          setTyping(true);
        }, 0);
        return () => clearTimeout(t);
      }
    }
  }, [displayed, typing, roleIndex]);

  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--bg)" }}>

      <div className="section-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* ── Eyebrow ── rule touches element top & bottom */}
          <div className="rule" />
          <div className="eyebrow">Full-Stack Developer &amp; UI Designer</div>
          <div className="rule" />

          <Spacer />

          {/* ── Main heading ── */}
          <div className="rule" />
          <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(72px, 13vw, 160px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.03em" }}>
            <TypewriterText text1="Loyd." inView={inView} />
          </h1>
          <div className="rule" />

          <Spacer />

          {/* ── Typing role ── */}
          <div className="rule" />
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(14px, 1.5vw, 20px)" }}>
            <span style={{ opacity: 0.4 }}>I am a</span>
            <span style={{ fontWeight: 600, minWidth: 180 }}>
              {displayed}<span className="blink">|</span>
            </span>
          </div>
          <div className="rule" />

          <Spacer />

          {/* ── Sub-copy ── */}
          <div className="rule" />
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, opacity: 0.55, maxWidth: 400, lineHeight: 1.8 }}>
            Crafting clean, efficient digital products — from pixel-perfect interfaces to scalable backends.
          </p>
          <div className="rule" />

          <Spacer />

          {/* ── CTAs ── */}
          <div className="rule" />
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="#projects" className="btn btn-outline">View Work</a>
            <a href="#contact" className="btn btn-primary">• Let&apos;s Talk</a>
          </div>
          <div className="rule" />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.35 }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ width: 1, height: 40, background: "var(--border-heavy)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
