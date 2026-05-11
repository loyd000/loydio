"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import TypewriterText from "./TypewriterText";

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

const stats = [
  { value: 3, suffix: "+", label: "Years Exp." },
  { value: 20, suffix: "+", label: "Projects" },
  { value: 10, suffix: "+", label: "Clients" },
];

function CountUp({ end, suffix, inView }: { end: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round((frame / total) * end));
      if (frame >= total) clearInterval(timer);
    }, 1200 / total);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <>{count}{suffix}</>;
}

/* ── 3D Tilt Card ─────────────────────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number>(0);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0–1
      const y = (e.clientY - rect.top) / rect.height;   // 0–1
      const rotateY = (x - 0.5) * 24;   // ±12°
      const rotateX = (0.5 - y) * 24;   // ±12°
      setTilt({ rotateX, rotateY, glareX: x * 100, glareY: y * 100 });
    });
  }, []);

  const handleEnter = () => setHovering(true);
  const handleLeave = () => {
    setHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  // Dynamic shadow — shifts opposite to tilt
  const shadowX = -tilt.rotateY * 0.8;
  const shadowY = tilt.rotateX * 0.8;

  return (
    <div
      style={{ perspective: "1000px" }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={cardRef}
        style={{
          position: "relative",
          overflow: "hidden",
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${hovering ? 1.02 : 1})`,
          transition: hovering
            ? "transform 0.1s ease-out, box-shadow 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease",
          boxShadow: hovering
            ? `${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.25), 0 10px 40px rgba(0,0,0,0.15)`
            : "0 4px 20px rgba(0,0,0,0.08)",
          willChange: "transform",
        }}
      >
        {children}

        {/* Glare overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
            opacity: hovering ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "var(--bg)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)" }}>
        <span className="vertical-label">About Me</span>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span className="section-watermark">01</span>
      </div>

      <div className="section-container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "start" }}>

          {/* ── Left: Bio ── */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }} transition={{ duration: 0.7 }}>
            <div className="rule" />
            <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, lineHeight: 1.2 }}>
              <TypewriterText text1="Engineered with Precision," text2="Designed with Purpose." inView={inView} />
            </h2>
            <div className="rule" />

            <Spacer />

            <div className="rule" />
            <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.9 }}>
              I&apos;m a full-stack developer and graphic designer with a strong foundation in software engineering, IoT, and user-centered design. I specialize in building modern web platforms, mobile applications, and hardware-integrated systems that not only function efficiently but also deliver visually engaging experiences.
            </p>
            <div className="rule" />

            <Spacer h="1.5rem" />

            <div className="rule" />
            <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.9 }}>
              I&apos;ve worked on multiple client projects, academic systems, and thesis-level applications, developing production-ready solutions using technologies like ESP32, Android development, and modern web frameworks. Alongside development, I create visual assets, UI designs, and branding materials that enhance usability and communication.
            </p>
            <div className="rule" />

            <Spacer h="1.5rem" />

            <div className="rule" />
            <p style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.9 }}>
              My focus is on crafting clean, scalable, and reliable systems—whether it&apos;s a Bluetooth-controlled application, a smart embedded device, or a responsive web platform. I aim to bridge the gap between functionality and design, turning complex ideas into intuitive and impactful digital experiences.
            </p>
            <div className="rule" />

            <Spacer />

            <div className="rule" />
            <a href="#contact" className="btn btn-primary">Get in Touch</a>
            <div className="rule" />

            <Spacer />

            <div className="rule" />
            <div style={{ display: "flex", gap: "2.5rem" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, lineHeight: 1 }}>
                    <CountUp end={s.value} suffix={s.suffix} inView={inView} />
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4, marginTop: 6 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="rule" />
          </motion.div>

          {/* ── Right: 3D Tilt Photo ── */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="rule" />
            <TiltCard>
              <motion.div
                initial="rest"
                whileHover="hover"
                style={{ width: "100%", aspectRatio: "3 / 4", position: "relative" }}
              >
                <motion.div
                  style={{ width: "100%", height: "100%", position: "relative" }}
                  variants={{
                    rest: { filter: "grayscale(100%) opacity(0.9)" },
                    hover: { filter: "grayscale(0%) opacity(1)" },
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src="/me.jpg"
                    alt="John Lloyd De Guzman"
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </motion.div>
              </motion.div>
            </TiltCard>
            <div className="rule" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
