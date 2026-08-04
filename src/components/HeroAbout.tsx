"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroAbout() {
  return (
    <section
      id="about"
      className="hero-about-section"
      style={{ background: "var(--bg)", position: "relative", overflow: "hidden" }}
    >
      <div
        className="section-container hero-about-container"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* ═══════════════════════════════════════════
            TOP: Photo (left) + Intro (right)
        ═══════════════════════════════════════════ */}
        <div className="hero-about-grid">

          {/* Left column — photo */}
          <motion.div
            className="hero-about-photo"
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                overflow: "hidden",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                width: "100%",
              }}
            >
              <Image
                src="/me.jpg"
                alt="John Lloyd De Guzman"
                width={600}
                height={600}
                sizes="(max-width: 768px) 260px, 320px"
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
              />
            </div>
          </motion.div>

          {/* Right column — intro */}
          <div className="hero-about-intro">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}
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
                fontSize: "clamp(32px, 5.5vw, 56px)",
                fontWeight: 400,
                lineHeight: 1.15,
                marginBottom: "1rem",
              }}
            >
              Loyd De Guzman
            </motion.h1>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              style={{
                fontFamily: "var(--font-sans), 'Manrope', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--muted)",
                maxWidth: 400,
                lineHeight: 1.8,
                marginBottom: "1.5rem",
              }}
            >
              I build modern web platforms, mobile apps, and hardware-integrated systems —
              bridging the gap between functionality and design.
            </motion.p>

            {/* Social links row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}
            >
              {[
                { label: "github ↗", href: "https://github.com/loyd000" },
                { label: "facebook ↗", href: "https://www.facebook.com/loydixyz" },
                { label: "instagram ↗", href: "https://www.instagram.com/loyd.dg/" },
                { label: "spotify ↗", href: "https://open.spotify.com/user/31ydnj4nyrc2wtyxem7czazbkx5y" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12,
                    color: "var(--fg)",
                    opacity: 0.6,
                    textDecoration: "none",
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.6";
                  }}
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

        </div>
      </div>

      <style>{`
        .hero-about-section { display: block; }
        .hero-about-container {
          padding-top: 5rem;
          padding-bottom: 2rem;
        }
        .hero-about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        .hero-about-photo {
          max-width: 280px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-about-intro {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (min-width: 900px) {
          .hero-about-container {
            padding-top: 6rem;
            padding-bottom: 3rem;
          }
          .hero-about-grid {
            grid-template-columns: 320px 1fr;
            align-items: stretch;
            gap: 3rem;
          }
          .hero-about-photo {
            width: 320px;
            max-width: 320px;
            margin-left: 0;
            margin-right: 0;
          }
        }

        @media (max-width: 899px) {
          .hero-about-container {
            padding-top: 5.5rem;
            padding-bottom: 2rem;
          }
        }

        @media (max-width: 480px) {
          .hero-about-photo {
            max-width: 220px;
          }
        }
      `}</style>
    </section>
  );
}
