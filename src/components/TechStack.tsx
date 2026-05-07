"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";
import TechNodeGraph from "./TechNodeGraph";


const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

export default function TechStack() {
  const ref = useRef(null);
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rule" />
          <h2
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(28px, 4.5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
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

        <div className="rule" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ padding: "2.5rem 0" }}
        >
          <TechNodeGraph />
        </motion.div>
        <div className="rule" />

      </div>
    </section>
  );
}
