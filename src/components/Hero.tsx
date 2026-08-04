"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const roles = ["Developer.", "Designer.", "Builder.", "Problem Solver."];

export default function Hero() {
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

  return (
    <section
      className="hero-section"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Right-side hero artwork */}
      <motion.div
        aria-hidden
        className="hero-image-stage"
        initial={{ opacity: 0, x: 56, scale: 1.04 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-image-bg" />
      </motion.div>

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="section-container hero-container"
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}
        >
          <div style={{ width: 24, height: 1, background: "var(--accent)", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-mono), var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted)" }}>
            Full-Stack Developer &amp; Graphic Designer
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          style={{
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            fontSize: "clamp(52px, 10vw, 130px)",
            fontWeight: 400,
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
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            marginBottom: "1.25rem",
          }}
        >
          <span style={{ color: "var(--muted)", fontWeight: 300 }}>I am a</span>
          <span style={{ fontWeight: 700, minWidth: "clamp(100px, 16vw, 180px)" }}>
            {displayed}
            <span style={{ color: "var(--accent)" }} className="blink">|</span>
          </span>
        </motion.div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.42 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 400,
            color: "var(--muted)",
            maxWidth: 380,
            lineHeight: 1.75,
            marginBottom: "2rem",
          }}
        >
          Crafting clean, efficient digital products — from pixel-perfect interfaces to scalable backends.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.52 }}
          style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
        >
          <a href="#projects" className="btn btn-outline">View Work</a>
          <a href="#contact" className="btn btn-accent">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block", opacity: 0.85, flexShrink: 0 }} />
            Let&apos;s Talk
          </a>
        </motion.div>

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
        .hero-section { display: block; }
        .hero-image-stage {
          position: absolute;
          top: 0;
          right: clamp(-2rem, -2vw, 0rem);
          z-index: 0;
          width: min(64vw, 940px);
          height: 100dvh;
          pointer-events: none;
        }
        .hero-image-stage::before {
          content: "";
          position: absolute;
          inset: 12% 6% 8% 26%;
          background: radial-gradient(circle at 62% 48%, var(--accent-subtle), transparent 66%);
          filter: blur(24px);
          opacity: 0.85;
          animation: hero-glow-pulse 7s ease-in-out infinite;
          pointer-events: none;
        }
        .hero-image-bg {
          position: absolute;
          inset: 0;
          background-image: url('/Hero.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          filter: drop-shadow(0 24px 42px rgba(0, 0, 0, 0.18));
          opacity: var(--hero-image-opacity, 1);
          pointer-events: none;
          transform-origin: 62% 50%;
          animation: hero-art-drift 11s ease-in-out infinite;
          will-change: transform, filter;
        }
        .hero-container {
          padding-top: 6rem;
          padding-bottom: 3rem;
        }
        .hero-scroll-cue { display: none !important; }

        [data-theme="dark"] .hero-image-stage::before {
          opacity: 1;
          background: radial-gradient(circle at 62% 48%, rgba(220, 38, 38, 0.16), transparent 66%);
        }

        [data-theme="dark"] .hero-image-bg {
          filter: drop-shadow(0 28px 46px rgba(0, 0, 0, 0.44));
        }

        @keyframes hero-art-drift {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(-0.8deg) scale(1.01);
          }
          50% {
            transform: translate3d(-12px, -14px, 0) rotate(0.7deg) scale(1.035);
          }
        }

        @keyframes hero-glow-pulse {
          0%, 100% {
            transform: scale(0.94);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.95;
          }
        }

        @media (max-width: 899px) {
          .hero-image-stage {
            top: 4rem;
            right: -20vw;
            width: 110vw;
            height: 70vh;
            --hero-image-opacity: 0.12;
          }

          .hero-image-stage::before {
            inset: 16% 14% 12% 34%;
            opacity: 0.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image-stage::before,
          .hero-image-bg {
            animation: none;
          }
        }

        @media (min-width: 900px) {
          .hero-section {
            min-height: 100dvh;
            display: flex;
            align-items: center;
          }
          .hero-container {
            padding-top: 5rem;
            padding-bottom: 4rem;
          }
          .hero-scroll-cue { display: flex !important; }
        }
      `}</style>
    </section>
  );
}
