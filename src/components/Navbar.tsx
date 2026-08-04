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

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <aside className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-inner">
          <a href="#" aria-label="Loyd — back to top" className="brand-mark">
            <div className="brand-badge">
              <span>L</span>
            </div>
            <span className="brand-text">Loyd</span>
          </a>

          <nav className="sidebar-links" aria-label="Primary">
            {links.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-meta">
          <LocalTime />
          <div className="sidebar-meta-row">
            <ThemeToggle />
            <div className="availability-pill">
              <span className="blink" />
              <span>Available</span>
            </div>
          </div>
        </div>
      </aside>

      <header className="mobile-topbar">
        <a href="#" aria-label="Loyd — back to top" className="brand-mark mobile-brand">
          <div className="brand-badge">
            <span>L</span>
          </div>
          <span className="brand-text">Loyd</span>
        </a>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`menu-button ${menuOpen ? "menu-button-open" : ""}`}
        >
          <motion.span className="menu-line" animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} />
          <motion.span className="menu-line" animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} />
          <motion.span className="menu-line" animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-overlay-backdrop"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mobile-drawer"
            >
              <div className="mobile-drawer-header">
                <div>
                  <p className="drawer-label">Navigation</p>
                  <h3>Explore the site</h3>
                </div>
                <button className="drawer-close" onClick={closeMenu} aria-label="Close navigation">
                  Close
                </button>
              </div>

              <nav className="mobile-drawer-links" aria-label="Mobile">
                {links.map((l, i) => {
                  const isActive = activeSection === l.href.slice(1);
                  return (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.05 }}
                      className={`mobile-drawer-link ${isActive ? "active" : ""}`}
                    >
                      {l.label}
                    </motion.a>
                  );
                })}
              </nav>

              <div className="mobile-drawer-footer">
                <LocalTime />
                <div className="mobile-drawer-footer-row">
                  <div className="availability-pill">
                    <span className="blink" />
                    <span>Available</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: ${SIDEBAR_W}px;
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 10060;
          background: color-mix(in srgb, var(--bg) 88%, transparent);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-right: 1px solid var(--border);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }

        .brand-mark {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--fg);
          width: fit-content;
        }

        .brand-badge {
          width: 30px;
          height: 30px;
          border: 1.5px solid var(--fg);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(12deg);
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .brand-badge span {
          font-family: ${MONO};
          font-size: 12px;
          font-weight: 700;
          transform: rotate(-12deg);
          display: block;
        }

        .brand-mark:hover .brand-badge {
          transform: rotate(0deg) scale(1.04);
        }

        .brand-text {
          font-family: ${MONO};
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .sidebar-link {
          position: relative;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--fg);
          opacity: 0.56;
          font-weight: 500;
          padding: 0.7rem 0.8rem;
          border-radius: 999px;
          transition: opacity 0.2s ease, color 0.2s ease, background 0.2s ease, transform 0.2s ease;
        }

        .sidebar-link:hover {
          opacity: 0.9;
          background: var(--hover-bg);
          transform: translateX(2px);
        }

        .sidebar-link.active {
          opacity: 1;
          color: var(--accent);
          background: var(--accent-subtle);
        }

        .sidebar-meta {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .sidebar-meta-row,
        .mobile-drawer-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .availability-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          background: var(--hover-bg);
          color: var(--muted);
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .availability-pill .blink {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          display: block;
        }

        .mobile-topbar {
          display: none;
        }

        .mobile-overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10050;
          background: rgba(0, 0, 0, 0.28);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(92vw, 360px);
          z-index: 10060;
          background: var(--surface);
          border-left: 1px solid var(--border);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.12);
          padding: 1.15rem 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mobile-drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }

        .drawer-label {
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.35rem;
        }

        .mobile-drawer-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg);
        }

        .drawer-close {
          border: 1px solid var(--border);
          background: var(--hover-bg);
          color: var(--fg);
          border-radius: 999px;
          padding: 0.45rem 0.7rem;
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .mobile-drawer-link {
          display: block;
          font-family: var(--font-display), 'Syne', sans-serif;
          font-size: clamp(1.2rem, 4vw, 1.7rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--fg);
          text-decoration: none;
          padding: 0.8rem 0.2rem;
          border-bottom: 1px solid var(--border);
          transition: color 0.2s ease, opacity 0.2s ease;
          opacity: 0.7;
        }

        .mobile-drawer-link.active {
          color: var(--accent);
          opacity: 1;
        }

        .mobile-drawer-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

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
            z-index: 10060;
            padding: 0 1rem;
            height: 60px;
            background: var(--nav-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
          }
          .mobile-brand {
            gap: 8px;
          }
          .menu-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            width: 44px;
            height: 44px;
            padding: 0;
            border: 1px solid var(--border);
            border-radius: 999px;
            background: var(--surface);
            cursor: pointer;
          }
          .menu-line {
            display: block;
            width: 18px;
            height: 1px;
            background: var(--fg);
            transform-origin: center;
          }
          body {
            padding-top: 60px;
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
