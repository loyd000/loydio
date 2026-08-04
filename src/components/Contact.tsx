"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const EMAIL = "deguzman.johnlloyd12@gmail.com";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="lean-section"
      style={{ background: "var(--bg)", textAlign: "center" }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="contact-glass-wrapper"
        >
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "1.5rem" }}>
            <div style={{ width: 28, height: 1, background: "var(--accent)", opacity: 0.5 }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>
              Let&apos;s Work Together
            </span>
            <div style={{ width: 28, height: 1, background: "var(--accent)", opacity: 0.5 }} />
          </div>

          {/* Heading */}
          <h2
            className="section-heading"
            style={{
              fontSize: "clamp(22px, 5vw, 52px)",
              maxWidth: 700,
              margin: "0 auto 1.25rem",
            }}
          >
            Built something in mind?<br />Let&apos;s make it real.
          </h2>

          {/* Sub-copy */}
          <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 400, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
            Open to freelance projects, collaborations, and opportunities. Reach out and let&apos;s talk.
          </p>

          {/* CTAs */}
          <div
            className="contact-ctas"
            style={{ display: "flex", justifyContent: "center", gap: "0.875rem", flexWrap: "wrap" }}
          >
            <a
              href={`mailto:${EMAIL}`}
              className="btn btn-accent"
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block", opacity: 0.8 }} />
              Send an Email
            </a>
            <button
              onClick={copyEmail}
              className="btn btn-outline"
              aria-live="polite"
            >
              {copied ? "✓ Copied!" : "Copy Email"}
            </button>
            <a href="/RESUME_DE_GUZMAN.pdf" download className="btn btn-outline">
              ↓ Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
