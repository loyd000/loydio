"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { supabase, type Credential } from "@/lib/supabase";
import { sound } from "@/lib/sound";

export default function Certifications() {
  const [certifications, setCertifications] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    supabase
      .from("credentials")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setCertifications(data);
        }
        setLoading(false);
      });
  }, []);

  // Display up to 3 on the home page
  const displayed = certifications.slice(0, 3);

  if (!loading && displayed.length === 0) return null;

  return (
    <section id="certifications" ref={ref} className="lean-section" style={{ background: "var(--bg)" }}>
      <div className="section-container">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.25rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p
            className="section-kicker"
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "lowercase",
              color: "var(--muted)",
            }}
          >
            04 — certifications
          </p>

          <Link
            href="/certifications"
            className="proj-view-all-link"
            onMouseEnter={() => sound.play("hover")}
            onClick={() => sound.play("click")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ALL CERTIFICATIONS →
          </Link>
        </motion.div>

        {/* Loading Skeleton or Cards Grid */}
        {loading ? (
          <div className="certifications-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cert-card-skeleton" />
            ))}
          </div>
        ) : (
          <div className="certifications-grid">
            {displayed.map((c, index) => {
              const hasLink = Boolean(c.link);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="cert-card"
                  onMouseEnter={() => sound.play("hover")}
                >
                  {/* Top: Badge Icon */}
                  <div className="cert-badge-wrapper">
                    {c.image_url ? (
                      <Image
                        src={c.image_url}
                        alt={`${c.title} badge`}
                        width={34}
                        height={34}
                        className="cert-badge-img"
                      />
                    ) : (
                      <svg
                        className="cert-badge-fallback-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="24"
                        height="24"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    )}
                  </div>

                  {/* Middle: Title & Issuer */}
                  <div className="cert-body">
                    <h3 className="cert-title">{c.title}</h3>
                    <p className="cert-org">{c.org}</p>
                  </div>

                  {/* Bottom: Verify CTA */}
                  <div className="cert-action-row">
                    {hasLink ? (
                      <a
                        href={c.link!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-verify-btn"
                        onClick={() => sound.play("click")}
                        aria-label={`Verify ${c.title} credential`}
                      >
                        &#123; VERIFY &#125;
                      </a>
                    ) : (
                      <span className="cert-verify-btn disabled">
                        &#123; VERIFIED &#125;
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
