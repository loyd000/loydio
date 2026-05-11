"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrambleText from "./ScrambleText";

const roles = ["Developer.", "Designer.", "Builder.", "Problem Solver."];

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const lastT     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Small canvas scaled up via CSS — cheap film grain at ~15fps
    const GW = 300, GH = 200;
    canvas.width  = GW;
    canvas.height = GH;

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (now - lastT.current < 66) return; // ~15fps
      lastT.current = now;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img  = ctx.createImageData(GW, GH);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = Math.floor(Math.random() * 18 + 4);
      }
      ctx.putImageData(img, 0, 0);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.6,
        mixBlendMode: "overlay",
        zIndex: 2,
      }}
    />
  );
}

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [scrambleTrigger, setScrambleTrigger] = useState(0);
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
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--bg)", overflow: "hidden" }}>

      <GrainOverlay />

      <div className="section-container" style={{ paddingTop: "7rem", paddingBottom: "5rem", position: "relative", zIndex: 3 }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {/* ── Eyebrow ── */}
          <div className="rule" />
          <div className="eyebrow">Full-Stack Developer &amp; Graphic Designer</div>
          <div className="rule" />

          <Spacer />

          {/* ── Main heading with scramble ── */}
          <div className="rule" />
          <h1
            onMouseEnter={() => setScrambleTrigger(n => n + 1)}
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(72px, 13vw, 160px)", fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.03em", cursor: "default" }}
          >
            <ScrambleText text="Loyd." startDelay={600} trigger={scrambleTrigger} />
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

        {/* Subtle terminal hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 4, duration: 1.5 }}
          style={{
            position: "absolute",
            bottom: 44,
            right: 32,
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: 0.2,
          }}
        >
          {/* Desktop hint */}
          <span className="terminal-hint-desktop" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "var(--fg)" }}>
            press <kbd style={{ padding: "1px 5px", border: "1px solid var(--border-heavy)", fontSize: 10 }}>`</kbd> for terminal
          </span>
          {/* Mobile hint */}
          <span className="terminal-hint-mobile" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.15em", color: "var(--fg)" }}>
            tap <span style={{ fontWeight: 700 }}>&gt;_</span> for terminal
          </span>
          <span className="blink" style={{ color: "var(--fg)", fontSize: 10 }}>▌</span>
        </motion.div>
      </div>
    </section>
  );
}
