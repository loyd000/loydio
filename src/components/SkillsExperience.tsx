"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GitHubContributions from "./GitHubContributions";

const skills = [
  { name: "Next.js", icon: "nextdotjs" },
  { name: "React", icon: "react" },
  { name: "Supabase", icon: "supabase" },
  { name: "Vercel", icon: "vercel" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css" },
  { name: "JavaScript", icon: "javascript" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Flutter", icon: "flutter" },
  { name: "TinyML", icon: "edgeimpulse" },
  { name: "TensorFlow Lite", icon: "tensorflow" },
  { name: "Python", icon: "python" },
  { name: "C++", icon: "cplusplus" },
  { name: "Java", icon: "openjdk" },
  { name: "Arduino", icon: "arduino" },
  { name: "GitHub", icon: "github" },
];

const skillRows = [skills.slice(0, 8), skills.slice(8)];

/*
const journey = [
  {
    label: "2022",
    description: "Jumped into Computer Engineering and started coding in C++, then leveled up to VB.NET where I built a Library System and Student Portal.",
  },
  {
    label: "2023",
    description: "Spent the year grinding through Data Structures, messing around with website design, and joining programming competitions for fun (and pressure).",
  },
  {
    label: "2024",
    description: "Started taking freelance gigs, got way better at building websites, and picked up Arduino/ESP32 projects for clients.",
  },
  {
    label: "2025 – 2026",
    description: "Graduated Computer Engineering, snagged Best Thesis Awardee, and kept coding, building sites, and taking commissions on the side.",
  },
  {
    label: "Thesis",
    description: 'Built CATOK — a gadget that "listens" to young coconuts using TinyML and acoustic signals on an ESP32-S3 to tell if they\'re ripe — and it won Best Thesis.',
  },
  {
    label: "Intern — AMTEC, UPLB",
    description: "Built a WordPress catalogue that pulls live data from Google Sheets, plus a Python app that auto-generates Word reports from Excel files.",
  },
  {
    label: "Current",
    description: "Working WFH as a Claims Assessor for an Australian business solutions company, still open for commissions, figuring out life one day at a time.",
  },
];
*/

export default function SkillsExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="stack" ref={ref} className="lean-section" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="section-kicker">02 — Technologies &amp; Tools</p>
          <div className="tech-logo-loops" aria-label="Technologies and tools">
            {skillRows.map((row, rowIndex) => (
              <div className="tech-logo-loop" key={rowIndex}>
                <div className={`tech-logo-track${rowIndex === 1 ? " tech-logo-track-reverse" : ""}`}>
                  {Array.from({ length: 4 }, () => row).flat().map((skill, index) => (
                    <div
                      className="tech-logo-item"
                      key={`${skill.name}-${index}`}
                      data-name={skill.name}
                      aria-label={index < row.length ? skill.name : undefined}
                      aria-hidden={index >= row.length}
                      role={index < row.length ? "img" : undefined}
                    >
                      <span
                        className="tech-logo-mark"
                        style={{
                          WebkitMaskImage: `url(https://cdn.simpleicons.org/${skill.icon})`,
                          maskImage: `url(https://cdn.simpleicons.org/${skill.icon})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <GitHubContributions />
        </motion.div>
      </div>
    </section>
  );
}
