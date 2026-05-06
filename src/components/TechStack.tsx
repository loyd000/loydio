"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";

const stack = [
  {
    category: "Frontend",
    items: [
      { name: "React", note: "Interactive UI systems" },
      { name: "Next.js", note: "Full-stack web apps" },
      { name: "TypeScript", note: "Safer application code" },
      { name: "Tailwind CSS", note: "Fast responsive styling" },
      { name: "Framer Motion", note: "Polished micro-interactions" },
      { name: "Vite", note: "Fast prototypes and tooling" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Node.js", note: "Server-side app logic" },
      { name: "Express", note: "REST services and APIs" },
      { name: "PostgreSQL", note: "Relational data design" },
      { name: "Supabase", note: "Auth, database, storage" },
      { name: "Prisma", note: "Typed database access" },
      { name: "REST APIs", note: "Clean client-server contracts" },
    ],
  },
  {
    category: "Design",
    items: [
      { name: "Figma", note: "Interfaces and prototypes" },
      { name: "Adobe Photoshop", note: "Image and visual assets" },
      { name: "Canva", note: "Fast social graphics" },
      { name: "Illustrator", note: "Vector and brand work" },
      { name: "Framer", note: "Interactive design builds" },
      { name: "Spline", note: "Lightweight 3D visuals" },
    ],
  },
  {
    category: "DevOps & Tools",
    items: [
      { name: "Git", note: "Versioned workflows" },
      { name: "GitHub", note: "Repos, issues, releases" },
      { name: "Vercel", note: "Production deployments" },
      { name: "Docker", note: "Portable app environments" },
      { name: "VS Code", note: "Daily development setup" },
      { name: "Linux", note: "Server and CLI workflows" },
    ],
  },
];

const techIcons = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Framer Motion", slug: "framer" },
  { name: "Vite", slug: "vite" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "Express", slug: "express" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Supabase", slug: "supabase" },
  { name: "Prisma", slug: "prisma" },
  { name: "Figma", slug: "figma" },
  { name: "Photoshop", slug: "adobephotoshop" },
  { name: "Canva", slug: "canva" },
  { name: "Illustrator", slug: "adobeillustrator" },
  { name: "Git", slug: "git" },
  { name: "GitHub", slug: "github" },
  { name: "Vercel", slug: "vercel" },
  { name: "Docker", slug: "docker" },
  { name: "VS Code", slug: "visualstudiocode" },
  { name: "Linux", slug: "linux" },
];

const simpleIconUrl = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;

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

        {/* Stack grid */}
        <div
          className="stack-grid"
          style={{
            display: "grid",
            border: "1px solid var(--border)",
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
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
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
                  <motion.div
                    key={item.name}
                    className="tech-chip"
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22, delay: gi * 0.1 + ii * 0.045 }}
                    whileHover={{ y: -3, scale: 1.04 }}
                  >
                    <span>{item.name}</span>
                    <span className="tech-chip-note">{item.note}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <Spacer h="2rem" />

        <div className="rule tech-marquee-rule" />
        <motion.div
          className="tech-icon-marquee"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          aria-label="Technology icon gallery"
        >
          <div className="tech-icon-track">
            {[...techIcons, ...techIcons].map((icon, index) => (
              <div className="tech-icon-item" key={`${icon.slug}-${index}`} title={icon.name}>
                <span
                  className="tech-icon-mask"
                  style={{
                    WebkitMaskImage: `url(${simpleIconUrl(icon.slug)})`,
                    maskImage: `url(${simpleIconUrl(icon.slug)})`,
                  }}
                  aria-hidden
                />
                <span>{icon.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="rule tech-marquee-rule" />

      </div>
    </section>
  );
}
