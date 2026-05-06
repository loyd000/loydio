"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stack = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Supabase", "Prisma", "REST APIs"] },
  { category: "Design", items: ["Figma", "Adobe Photoshop", "Canva", "Illustrator", "Framer", "Spline"] },
  { category: "DevOps & Tools", items: ["Git", "GitHub", "Vercel", "Docker", "VS Code", "Linux"] },
];

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
      style={{ position: "relative", padding: "8rem 0", background: "#fff", overflow: "hidden" }}
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
          animate={inView ? { opacity: 1, y: 0 } : {}}
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
            Balanced Between Logic
            <br />
            <span style={{ opacity: 0.25 }}>and Creativity.</span>
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

        {/* Stack grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            border: "1px solid rgba(0,0,0,0.075)",
          }}
        >
          {stack.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              style={{
                padding: "2rem",
                borderRight: "1px solid rgba(0,0,0,0.075)",
                borderBottom: "1px solid rgba(0,0,0,0.075)",
              }}
            >
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  opacity: 0.35,
                  marginBottom: "1.25rem",
                }}
              >
                {group.category}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {group.items.map((item, ii) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: gi * 0.1 + ii * 0.05 }}
                    whileHover={{ scale: 1.06 }}
                    style={{
                      display: "inline-block",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11,
                      padding: "6px 12px",
                      border: "1px solid rgba(0,0,0,0.075)",
                      cursor: "default",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
