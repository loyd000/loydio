"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Spacer = ({ h = "2.5rem" }: { h?: string }) => (
  <div style={{ height: h }} aria-hidden />
);

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} style={{ position: "relative", padding: "8rem 0", background: "#fff", overflow: "hidden" }}>
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
          </motion.div>

          {/* ── Right: Photo placeholder ── */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="rule" />
            {/* Photo placeholder — replace src with your image later */}
            <img
              src="/me.jpg"
              alt="John Lloyd De Guzman"
              style={{
                width: "100%",
                aspectRatio: "3 / 4",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />

            <div className="rule" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
