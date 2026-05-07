"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

/* ── SVG Icons ──────────────────────────────────────────────── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.074.11 18.09.12 18.1a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

const RiotIcon = () => (
  <Image src="/riot-logo.png" alt="Riot Games" width={28} height={28} className="riot-icon" style={{ objectFit: "contain" }} />
);

/* ── Social data ──────────────────────── */
const socials = [
  {
    platform: "Facebook",
    handle: "@loydixyz",
    href: "https://www.facebook.com/loydixyz",
    Icon: FacebookIcon,
    external: true,
  },
  {
    platform: "Instagram",
    handle: "@loyd.dg",
    href: "https://www.instagram.com/loyd.dg/",
    Icon: InstagramIcon,
    external: true,
  },
  {
    platform: "GitHub",
    handle: "loyd000",
    href: "https://github.com/loyd000",
    Icon: GitHubIcon,
    external: true,
  },
  {
    platform: "Spotify",
    handle: "Open Profile",
    href: "https://open.spotify.com/user/31ydnj4nyrc2wtyxem7czazbkx5y?si=1c16cc07016b4bcf",
    Icon: SpotifyIcon,
    external: true,
  },
  {
    platform: "Discord",
    handle: "loydi66",
    href: null,
    Icon: DiscordIcon,
    external: false,
  },
  {
    platform: "Riot",
    handle: "Sonder #1335",
    href: null,
    Icon: RiotIcon,
    external: false,
  },
];

export default function Social() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="social"
      ref={ref}
      style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}
    >
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Social</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">06</span>
      </div>

      <div className="section-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            <TypewriterText text1="Find Me" text2="Across the Internet." inView={inView} />
          </h2>
          <div className="rule" />
          <Spacer h="1.5rem" />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 400, lineHeight: 1.8 }}>
            Connect, follow, or just lurk — I&apos;m around on these platforms.
          </p>
          <div className="rule" />
        </motion.div>

        <Spacer />

        {/* Grid */}
        <div className="rule" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        }}>
          {socials.map((s, i) => {
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "2rem",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  minHeight: 180,
                  background: "var(--bg)",
                  transition: s.external ? "background 0.2s" : undefined,
                  position: "relative",
                  cursor: s.external ? "pointer" : "default",
                }}
                onMouseEnter={s.external ? (e) => (e.currentTarget.style.background = "var(--hover-bg)") : undefined}
                onMouseLeave={s.external ? (e) => (e.currentTarget.style.background = "var(--bg)") : undefined}
              >
                {/* Top row: icon + arrow */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <div style={{ opacity: 0.8 }}>
                    <s.Icon />
                  </div>
                  {s.external && (
                    <span style={{
                      fontSize: 16,
                      opacity: 0.2,
                      transition: "opacity 0.2s, transform 0.2s",
                    }}
                    className="project-arrow"
                    >↗</span>
                  )}
                </div>

                {/* Bottom: platform + handle */}
                <div>
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    opacity: 0.35,
                    marginBottom: "0.4rem",
                  }}>
                    {s.platform}
                  </p>
                  <p style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}>
                    {s.handle}
                  </p>
                </div>
              </motion.div>
            );

            return s.href ? (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                {card}
              </a>
            ) : (
              <div key={s.platform} style={{ display: "block" }}>
                {card}
              </div>
            );
          })}
        </div>
        <div className="rule" />

      </div>
    </section>
  );
}
