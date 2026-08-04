"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";

const MONO = "'IBM Plex Mono', monospace";
const SIDEBAR_W = 200; // px — desktop sidebar width

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const allSections = ["about", "credentials", "projects", "social", "contact"];

    const onScroll = () => {
      let current = "";
      allSections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            current = id;
          }
        }
      });

      if (current) {
        if (["about", "credentials"].includes(current)) setActiveSection("about");
        else if (["projects", "social"].includes(current)) setActiveSection("projects");
        else if (current === "contact") setActiveSection("contact");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    setMenuOpen(false);
    target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── Desktop: Fixed Left Sidebar ── */}
      <aside className="sidebar-nav" aria-label="Main navigation">
        {/* Logo — top */}
        <a
          href="#"
          aria-label="Loyd — back to top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--fg)",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              border: "2px solid var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(12deg)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 700,
                transform: "rotate(-12deg)",
                display: "block",
              }}
            >
              L
            </span>
          </div>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Loyd
          </span>
        </a>

        {/* Nav links — middle */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {links.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isActive ? "var(--accent)" : "var(--fg)",
                  opacity: isActive ? 1 : 0.4,
                  fontWeight: isActive ? 600 : 400,
                  padding: "8px 0",
                  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  paddingLeft: 12,
                  transition: "color 0.2s ease, opacity 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.4";
                }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* Meta — bottom */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <LocalTime />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                className="blink"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--success)",
                  display: "block",
                }}
              />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                Available
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Mobile: Top Bar ── */}
      <header className="mobile-topbar">
        <a
          href="#"
          aria-label="Loyd — back to top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--fg)",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: "2px solid var(--fg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(12deg)",
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, transform: "rotate(-12deg)", display: "block" }}>
              L
            </span>
          </div>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Loyd
          </span>
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            padding: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
            zIndex: 60,
          }}
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            style={{ display: "block", width: 22, height: 1, background: menuOpen ? "var(--accent)" : "var(--fg)", transformOrigin: "center" }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            style={{ display: "block", width: 22, height: 1, background: "var(--fg)" }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            style={{ display: "block", width: 22, height: 1, background: menuOpen ? "var(--accent)" : "var(--fg)", transformOrigin: "center" }}
          />
        </button>
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 50,
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <nav style={{ marginBottom: "3rem" }}>
              {links.map((l, i) => {
                const isActive = activeSection === l.href.slice(1);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06 }}
                  >
                    <a
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      style={{
                        display: "block",
                        fontFamily: "var(--font-display), 'Syne', sans-serif",
                        fontSize: "clamp(32px, 8vw, 52px)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        color: isActive ? "var(--accent)" : "var(--fg)",
                        textDecoration: "none",
                        opacity: isActive ? 1 : 0.5,
                        padding: "0.6rem 0",
                        borderBottom: "1px solid var(--border)",
                        transition: "color 0.2s ease, opacity 0.2s ease",
                      }}
                    >
                      {l.label}
                    </a>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <LocalTime />
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="blink" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", display: "block" }} />
                  <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                    Available
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Desktop sidebar */
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: ${SIDEBAR_W}px;
          padding: 2.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 50;
          background: var(--bg);
          border-right: 1px solid var(--border);
        }

        .mobile-topbar {
          display: none;
        }

        /* Push main content right on desktop */
        body > main,
        body > footer,
        body > section {
          margin-left: ${SIDEBAR_W}px;
        }

        @media (max-width: 899px) {
          .sidebar-nav {
            display: none;
          }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 50;
            padding: 0 1.25rem;
            height: 56px;
            background: var(--nav-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
          }
          body > main,
          body > footer,
          body > section {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  );
}
