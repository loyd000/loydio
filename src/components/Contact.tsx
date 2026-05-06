"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={ref}
      style={{ position: "relative", padding: "10rem 0", background: "#fff", overflow: "hidden" }}
    >
      {/* Corner plus markers */}
      <span className="plus-marker" style={{ top: 32, left: 32 }}>+</span>
      <span className="plus-marker" style={{ top: 32, right: 32 }}>+</span>
      <span className="plus-marker" style={{ bottom: 32, left: 32 }}>+</span>
      <span className="plus-marker" style={{ bottom: 32, right: 32 }}>+</span>

      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">06</span>
      </div>

      <div className="section-container" style={{ textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Eyebrow */}
          <div className="rule" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 32, height: 1, background: "#000", opacity: 0.3 }} />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                opacity: 0.4,
              }}
            >
              Let&apos;s Work Together
            </span>
            <div style={{ width: 32, height: 1, background: "#000", opacity: 0.3 }} />
          </div>
          <div className="rule" />

          <Spacer />

          {/* Heading */}
          <div className="rule" />
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(36px, 7vw, 88px)",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Built something<br />
            in mind?<br />
            <span style={{ opacity: 0.25 }}>Let&apos;s make it real.</span>
          </h2>
          <div className="rule" />

          <Spacer />

          {/* Sub-copy */}
          <div className="rule" />
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              opacity: 0.5,
              maxWidth: 420,
              margin: "0 auto",
              lineHeight: 1.85,
            }}
          >
            Let&apos;s discuss your project and discover how we can build
            something great together. Or grab my resume to learn more.
          </p>
          <div className="rule" />

          <Spacer />

          {/* CTA buttons */}
          <div className="rule" />
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="mailto:deguzman.johnlloyd12@gmail.com"
              className="btn btn-primary"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                  animation: "blink 1s step-end infinite",
                }}
              />
              Send an Email
            </a>
            <a
              href="/RESUME_DE GUZMAN.pdf"
              download
              className="btn btn-outline"
            >
              ↓ Download Resume
            </a>
          </div>
          <div className="rule" />

        </motion.div>
      </div>
    </section>
  );
}
