"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";

const MONO = "'IBM Plex Mono', monospace";
const SIDEBAR_W = 220; // px — desktop sidebar width

const links = [
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
];

export default function Navbar() {
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeSection,  setActiveSection]  = useState("");
  const [scrolled,       setScrolled]       = useState(false);

  /* ── Active-section tracker ── */
  useEffect(() => {
    const allSections = ["about", "credentials", "projects", "social", "contact"];

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "";
      allSections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) current = id;
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

  /* ── Escape key closes menu ── */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : prev;
    return () => { document.body.style.overflow = prev; };
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
      {/* ════════════════════════════════════════
          DESKTOP SIDEBAR
      ════════════════════════════════════════ */}
      <aside className="sidebar-nav" aria-label="Main navigation">
        {/* Top: brand */}
        <div className="sidebar-inner">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Loyd — back to top" className="brand-mark">
            <div className="brand-badge">
              <span>L</span>
            </div>
            <span className="brand-text">Loyd</span>
          </a>

          {/* Nav links */}
          <nav className="sidebar-links" aria-label="Primary">
            {links.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="sidebar-link-bar" />
                  <span className="sidebar-link-label">{l.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom: meta */}
        <div className="sidebar-meta">
          <LocalTime />
          <div className="sidebar-meta-row">
            <ThemeToggle />
            <div className="availability-pill">
              <span className="avail-dot" />
              <span>Available</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MOBILE TOPBAR
      ════════════════════════════════════════ */}
      <header className={`mobile-topbar ${scrolled ? "mobile-topbar-scrolled" : ""}`}>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          aria-label="Loyd — back to top"
          className="brand-mark mobile-brand"
        >
          <div className="brand-badge">
            <span>L</span>
          </div>
          <span className="brand-text">Loyd</span>
        </a>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`menu-button ${menuOpen ? "menu-button-open" : ""}`}
        >
          <motion.span className="menu-line" animate={menuOpen ? { rotate: 45, y: 6 }  : { rotate: 0, y: 0 }} />
          <motion.span className="menu-line" animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} />
          <motion.span className="menu-line" animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
        </button>
      </header>

      {/* ════════════════════════════════════════
          MOBILE DRAWER
      ════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="mobile-overlay-backdrop"
              onClick={closeMenu}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="mobile-drawer-header">
                <div>
                  <p className="drawer-label">Navigation</p>
                  <h3 className="drawer-heading">Explore the site</h3>
                </div>
                <button
                  className="drawer-close"
                  onClick={closeMenu}
                  aria-label="Close navigation"
                >
                  {/* X icon */}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="1" y1="1" x2="13" y2="13" />
                    <line x1="13" y1="1" x2="1" y2="13" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="mobile-drawer-links" aria-label="Mobile navigation">
                {links.map((l, i) => {
                  const isActive = activeSection === l.href.slice(1);
                  return (
                    <motion.a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
                      className={`mobile-drawer-link ${isActive ? "active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="drawer-link-index">0{i + 1}</span>
                      <span className="drawer-link-label">{l.label}</span>
                      <span className="drawer-link-arrow">↗</span>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="mobile-drawer-footer">
                <LocalTime />
                <div className="mobile-drawer-footer-row">
                  <div className="availability-pill">
                    <span className="avail-dot" />
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
        /* ══════════════════════════════════════
           DESKTOP SIDEBAR
        ══════════════════════════════════════ */
        .sidebar-nav {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: ${SIDEBAR_W}px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 10060;
          background: color-mix(in srgb, var(--bg) 85%, transparent);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border-right: 1px solid var(--border);
          /* Subtle gradient shimmer on the right edge */
          box-shadow: inset -1px 0 0 0 var(--border-mid), 4px 0 24px rgba(0,0,0,0.04);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* ── Brand mark ── */
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
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s ease, border-color 0.2s ease;
        }

        .brand-badge span {
          font-family: ${MONO};
          font-size: 12px;
          font-weight: 700;
          transform: rotate(-12deg);
          display: block;
          transition: color 0.2s ease;
        }

        .brand-mark:hover .brand-badge {
          transform: rotate(0deg) scale(1.06);
          background: var(--fg);
          border-color: var(--fg);
        }

        .brand-mark:hover .brand-badge span {
          color: var(--bg);
        }

        .brand-text {
          font-family: ${MONO};
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.9;
        }

        /* ── Sidebar nav links ── */
        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: ${MONO};
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--fg);
          opacity: 0.45;
          font-weight: 500;
          padding: 0.65rem 0.75rem;
          border-radius: 6px;
          transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
          overflow: hidden;
        }

        /* The left accent bar */
        .sidebar-link-bar {
          display: block;
          width: 2px;
          height: 0;
          background: var(--fg);
          border-radius: 2px;
          flex-shrink: 0;
          transition: height 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
          opacity: 0;
        }

        .sidebar-link-label {
          transition: transform 0.2s ease;
        }

        .sidebar-link:hover {
          opacity: 0.8;
          background: var(--hover-bg);
          transform: translateX(2px);
        }

        .sidebar-link.active {
          opacity: 1;
          background: var(--accent-subtle);
        }

        .sidebar-link.active .sidebar-link-bar {
          height: 14px;
          opacity: 1;
        }

        /* ── Sidebar meta ── */
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

        /* ── Availability pill ── */
        .availability-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          background: var(--hover-bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .avail-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          display: block;
          flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
          animation: avail-pulse 2.2s ease-out infinite;
        }

        @keyframes avail-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.55); }
          60%  { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        /* ══════════════════════════════════════
           MOBILE TOPBAR
        ══════════════════════════════════════ */
        .mobile-topbar {
          display: none;
        }

        /* ══════════════════════════════════════
           MOBILE OVERLAY + DRAWER
        ══════════════════════════════════════ */
        .mobile-overlay-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10050;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(88vw, 340px);
          z-index: 10060;
          background: var(--surface);
          border-left: 1px solid var(--border);
          box-shadow: -16px 0 48px rgba(0, 0, 0, 0.14);
          padding: 1.25rem 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .mobile-drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          margin-bottom: 0.75rem;
        }

        .drawer-label {
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.3rem;
        }

        .drawer-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg);
          font-family: var(--font-display), 'Syne', sans-serif;
        }

        .drawer-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid var(--border-strong);
          background: var(--hover-bg);
          color: var(--fg);
          border-radius: 6px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }

        .drawer-close:hover {
          background: var(--subtle-bg);
          border-color: var(--fg);
          transform: rotate(90deg);
        }

        /* ── Mobile nav links ── */
        .mobile-drawer-links {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mobile-drawer-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          text-decoration: none;
          color: var(--fg);
          padding: 1rem 0.25rem;
          border-bottom: 1px solid var(--border);
          opacity: 0.55;
          transition: opacity 0.2s ease, padding-left 0.2s ease;
        }

        .mobile-drawer-link:hover {
          opacity: 0.9;
          padding-left: 0.5rem;
        }

        .mobile-drawer-link.active {
          opacity: 1;
        }

        .drawer-link-index {
          font-family: ${MONO};
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--muted);
          min-width: 20px;
          flex-shrink: 0;
          transition: color 0.2s ease;
        }

        .mobile-drawer-link.active .drawer-link-index {
          color: var(--fg);
        }

        .drawer-link-label {
          font-family: var(--font-display), 'Syne', sans-serif;
          font-size: clamp(1.25rem, 5vw, 1.6rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          flex: 1;
        }

        .drawer-link-arrow {
          font-size: 0.9rem;
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          color: var(--muted);
        }

        .mobile-drawer-link:hover .drawer-link-arrow,
        .mobile-drawer-link.active .drawer-link-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-drawer-footer {
          margin-top: auto;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* ══════════════════════════════════════
           LAYOUT OFFSET — push content right of sidebar
        ══════════════════════════════════════ */
        main, footer {
          margin-left: ${SIDEBAR_W}px;
        }

        /* ══════════════════════════════════════
           RESPONSIVE — mobile breakpoint
        ══════════════════════════════════════ */
        @media (max-width: 899px) {
          .sidebar-nav {
            display: none;
          }

          main, footer {
            margin-left: 0;
          }

          body {
            padding-top: 60px;
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
            padding: 0 1.25rem;
            height: 60px;
            background: color-mix(in srgb, var(--bg) 88%, transparent);
            backdrop-filter: blur(16px) saturate(160%);
            -webkit-backdrop-filter: blur(16px) saturate(160%);
            border-bottom: 1px solid transparent;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .mobile-topbar-scrolled {
            border-bottom-color: var(--border);
            box-shadow: 0 4px 24px rgba(0,0,0,0.06);
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
            width: 40px;
            height: 40px;
            padding: 0;
            border: 1px solid var(--border-strong);
            border-radius: 8px;
            background: var(--surface);
            cursor: pointer;
            transition: background 0.18s ease, border-color 0.18s ease;
          }

          .menu-button:hover {
            background: var(--hover-bg);
            border-color: var(--fg);
          }

          .menu-line {
            display: block;
            width: 18px;
            height: 1.5px;
            background: var(--fg);
            border-radius: 2px;
            transform-origin: center;
          }
        }
      `}</style>
    </>
  );
}
