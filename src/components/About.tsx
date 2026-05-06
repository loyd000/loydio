"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

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
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <div className="rule" />
            <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, lineHeight: 1.2 }}>
              Engineered with Precision,<br />
              <span style={{ opacity: 0.25 }}>Designed with Purpose.</span>
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

          {/* ── Right: Photo placeholder ── */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="rule" />
            {/* Photo placeholder — replace src with your image later */}
            <motion.div initial="rest" whileHover="hover" style={{ overflow: "hidden", position: "relative" }}>
              <motion.img
                src="/me.jpg"
                alt="John Lloyd De Guzman"
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
                variants={{
                  rest: { scale: 1, filter: "grayscale(100%) opacity(0.9)" },
                  hover: { scale: 1.05, filter: "grayscale(0%) opacity(1)" }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Shine Overlay */}
              <motion.div
                variants={{
                  rest: { left: "-150%" },
                  hover: { left: "150%" }
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: "35%",
                  background: "#fff",
                  transform: "skewX(-25deg)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>

            <div className="rule" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
