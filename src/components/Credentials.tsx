"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type Item = { title: string; org: string; year: string; link?: string };

const certifications: Item[] = [
  { title: "CS50x: Introduction to Computer Science", org: "Harvard University / edX", year: "2023" },
  { title: "Google UX Design Certificate", org: "Google / Coursera", year: "2023" },
  { title: "Responsive Web Design", org: "freeCodeCamp", year: "2022" },
];

const seminars: Item[] = [
  { title: "DevCon Philippines", org: "DevCon PH", year: "2024" },
  { title: "Google I/O Extended Manila", org: "Google Developers", year: "2023" },
  { title: "UI/UX Design Thinking Workshop", org: "Local Tech Community", year: "2023" },
];

const achievements: Item[] = [
  { title: "Best Capstone Project", org: "University", year: "2024" },
  { title: "Dean's Lister", org: "University", year: "2022 — 2024" },
  { title: "1st Place — UI Design Competition", org: "Campus Tech Fest", year: "2023" },
];

const categories = [
  { label: "Certifications", items: certifications },
  { label: "Seminars & Events", items: seminars },
  { label: "Achievements", items: achievements },
];

function CredentialItem({ item, index, inView, groupIndex }: { item: Item; index: number; inView: boolean; groupIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: groupIndex * 0.1 + index * 0.08 }}
    >
      <div className="rule" />
      <div style={{ padding: "1.25rem 0" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: "0.4rem" }}>
          {item.link
            ? <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}>{item.title}</a>
            : item.title
          }
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.45 }}>{item.org}</span>
          <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.3, whiteSpace: "nowrap" }}>{item.year}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Credentials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="credentials" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">Credentials</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">04</span>
      </div>

      <div className="section-container">

        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <div className="rule" />
          <h2 style={{ fontFamily: MONO, fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.1 }}>
            Learned, Certified,<br />
            <span style={{ opacity: 0.25 }}>Recognized.</span>
          </h2>
          <div className="rule" />
          <div style={{ height: "1.5rem" }} />
          <div className="rule" />
          <p style={{ fontSize: 13, opacity: 0.5, maxWidth: 460, lineHeight: 1.8 }}>
            Courses completed, events attended, and recognition earned throughout my journey as a developer and designer.
          </p>
          <div className="rule" />
        </motion.div>

        <div style={{ height: "4rem" }} />

        {/* Three-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 0, border: "1px solid var(--border)" }}>
          {categories.map((cat, gi) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              style={{ borderRight: "1px solid var(--border)", padding: "2rem 2rem 1.5rem" }}
            >
              {/* Column header */}
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 }}>
                  — {cat.label}
                </span>
              </div>

              {/* Items */}
              {cat.items.map((item, ii) => (
                <CredentialItem key={item.title} item={item} index={ii} inView={inView} groupIndex={gi} />
              ))}
              <div className="rule" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
