"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import type { Credential } from "@/lib/supabase";
import { sound } from "@/lib/sound";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });

export default function CertificationsClient({
  initialCertifications,
}: {
  initialCertifications: Credential[];
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = useMemo(() => {
    const rawTypes = Array.from(new Set(initialCertifications.map((c) => c.type || "certification")));
    return ["all", ...rawTypes];
  }, [initialCertifications]);

  const filtered = useMemo(() => {
    return initialCertifications.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.org.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

      const matchesType = selectedType === "all" || (c.type || "certification") === selectedType;

      return matchesSearch && matchesType;
    });
  }, [initialCertifications, search, selectedType]);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="subpage-main">
        <div className="section-container">

          {/* ── Page Header ── */}
          <div className="subpage-header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/"
                className="subpage-back-link"
                onMouseEnter={() => sound.play("hover")}
                onClick={() => sound.play("click")}
              >
                ← Back
              </Link>

              <p className="section-kicker">— Accolades</p>
              <h1 className="subpage-title">Certifications</h1>
              <p className="subpage-subtitle">
                Official certifications, licenses, and verified industry credentials across AI, cloud systems, full-stack development, and computer engineering.
              </p>
            </motion.div>

            {/* ── Filter Bar & Search ── */}
            <motion.div
              className="subpage-controls-bar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Type Pills */}
              <div className="subpage-filter-bar">
                {types.map((t) => {
                  const isActive = selectedType === t;
                  const count =
                    t === "all"
                      ? initialCertifications.length
                      : initialCertifications.filter((c) => (c.type || "certification") === t).length;

                  return (
                    <button
                      key={t}
                      onClick={() => {
                        sound.play("click");
                        setSelectedType(t);
                      }}
                      onMouseEnter={() => sound.play("hover")}
                      className={`subpage-filter-tab${isActive ? " active" : ""}`}
                      aria-pressed={isActive}
                    >
                      {t === "all" ? "All" : t}
                      <span className="subpage-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search credentials..."
                className="subpage-search-input"
              />
            </motion.div>
          </div>

          {/* ── Certifications Grid ── */}
          {filtered.length === 0 ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted)", letterSpacing: "0.12em", padding: "3rem 0" }}>
              No certifications found matching your filter.
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedType}-${search}`}
                className="certifications-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                {filtered.map((c, index) => {
                  const hasLink = Boolean(c.link);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.48, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="cert-card"
                      onMouseEnter={() => sound.play("hover")}
                    >
                      {/* Badge Icon */}
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

                      {/* Title & Issuer */}
                      <div className="cert-body">
                        <h2 className="cert-title">{c.title}</h2>
                        <p className="cert-org">{c.org}</p>
                        {c.year && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--muted)", marginTop: "4px", opacity: 0.6 }}>
                            {c.year}
                          </span>
                        )}
                        {c.description && (
                          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "0.75rem", lineHeight: 1.5, opacity: 0.85, maxWidth: "240px" }}>
                            {c.description}
                          </p>
                        )}
                      </div>

                      {/* Verify Action */}
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
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
