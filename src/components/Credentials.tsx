"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase, type Credential } from "@/lib/supabase";
import MagnifyImage from "./MagnifyImage";

const MONO = "var(--font-mono), monospace";

function CredentialRow({ c, index }: { c: Credential; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={expanded}
        style={{
          width: "100%",
          padding: "1.25rem 0",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", flex: 1 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--muted)", width: "3.5rem", flexShrink: 0 }}>
            {c.year}
          </span>
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              fontSize: 15, 
              fontWeight: 500, 
              color: hovered ? "var(--accent)" : "var(--fg)",
              transition: "color 0.2s ease"
            }}>
              {c.title}
            </h4>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{c.org}</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          <span style={{ 
            fontFamily: MONO, 
            fontSize: 10, 
            letterSpacing: "0.1em",
            textTransform: "uppercase", 
            color: "var(--muted)",
          }} className="hide-on-mobile">
            {c.type}
          </span>
          <motion.div 
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ width: 16, height: 16, color: "var(--muted)" }}
          >
            {/* Plus icon that rotates to an X */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="credential-content">
              {c.description && (
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 600 }}>
                  {c.description}
                </p>
              )}
              
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {c.link && (
                  <a href={c.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 11 }}>
                    View Link ↗
                  </a>
                )}
              </div>
              
              {c.image_url && (
                <div style={{ marginTop: "1.5rem", borderRadius: 4, overflow: "hidden", border: "1px solid var(--border)", maxWidth: 400 }}>
                  <MagnifyImage src={c.image_url} alt={c.title} style={{ width: "100%", height: "auto" }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Credentials() {
  return null; // TODO: re-enable when ready
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    supabase.from("credentials").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setCredentials(data);
        setLoading(false);
      });
  }, []);

  if (loading || credentials.length === 0) return null;

  return (
    <section id="credentials" className="lean-section" ref={ref}>
      {/* Container is constrained to 800px for better typography line-length (UX rule) */}
      <div className="section-container" style={{ maxWidth: 800, margin: "0 auto" }}>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2rem" }}
        >
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem" }}>
            — Accolades
          </p>
          <h2 className="section-heading" style={{ fontSize: "clamp(24px, 3vw, 32px)", marginBottom: "1rem" }}>
            Credentials & Certifications
          </h2>
        </motion.div>

        <div style={{ borderTop: "1px solid var(--border)" }}>
          {credentials.map((c, i) => (
            <CredentialRow key={c.id} c={c} index={i} />
          ))}
        </div>

      </div>

      <style>{`
        .credential-content {
          padding-left: 5rem;
          padding-bottom: 1.5rem;
        }
        @media (max-width: 600px) {
          .credential-content {
            padding-left: 0;
            padding-top: 1rem;
          }
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
