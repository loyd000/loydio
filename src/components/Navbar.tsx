"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact"  },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled,      setScrolled]      = useState(false);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* LOGO - fixed top-left */}
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        aria-label="Loyd - back to top"
        className="logo-corner"
      >
        <div className="logo-badge">
          <span>L</span>
        </div>
      </a>

      {/* PILL NAVBAR - always visible, smaller on mobile */}
      <nav className={`pill-nav${scrolled ? " pill-nav-scrolled" : ""}`} aria-label="Main navigation">
        <div className="pill-nav-inner">
          {links.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`pill-link${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill-indicator"
                    className="pill-active-bg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="pill-link-label">{l.label}</span>
              </a>
            );
          })}
          <div className="pill-divider" />
          <ThemeToggle />
        </div>
      </nav>

      <style>{`
        .logo-corner {
          position: fixed;
          top: 20px;
          left: 24px;
          z-index: 10070;
          text-decoration: none;
        }
        .logo-badge {
          width: 34px;
          height: 34px;
          border: 1.5px solid var(--fg);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(12deg);
          background: color-mix(in srgb, var(--bg) 70%, transparent);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s ease, border-color 0.2s ease;
        }
        .logo-badge span {
          font-family: var(--font-mono), monospace;
          font-size: 12px;
          font-weight: 700;
          color: var(--fg);
          transform: rotate(-12deg);
          display: block;
          transition: color 0.2s ease;
        }
        .logo-corner:hover .logo-badge {
          transform: rotate(0deg) scale(1.06);
          background: var(--fg);
        }
        .logo-corner:hover .logo-badge span {
          color: var(--bg);
        }

        /* PILL NAV */
        .pill-nav {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10060;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(22px) saturate(190%);
          -webkit-backdrop-filter: blur(22px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 999px;
          box-shadow:
            inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.75),
            inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
            0 4px 24px 0 rgba(0, 0, 0, 0.08),
            0 1px 3px 0 rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease;
        }
        [data-theme="dark"] .pill-nav {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow:
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -1px 2px 0 rgba(0, 0, 0, 0.5),
            0 4px 24px 0 rgba(0, 0, 0, 0.3),
            0 1px 3px 0 rgba(0, 0, 0, 0.2);
        }
        .pill-nav-scrolled {
          box-shadow:
            inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.75),
            inset 0 -1px 1px 0 rgba(0, 0, 0, 0.04),
            0 8px 32px 0 rgba(0, 0, 0, 0.12),
            0 2px 6px 0 rgba(0, 0, 0, 0.06);
        }
        [data-theme="dark"] .pill-nav-scrolled {
          box-shadow:
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.22),
            inset 0 -1px 2px 0 rgba(0, 0, 0, 0.5),
            0 8px 32px 0 rgba(0, 0, 0, 0.5),
            0 2px 6px 0 rgba(0, 0, 0, 0.3);
        }

        .pill-nav-inner {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 5px 6px;
        }

        .pill-link {
          position: relative;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--fg);
          padding: 6px 14px;
          border-radius: 999px;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.55;
          transition: opacity 0.2s ease;
          white-space: nowrap;
        }
        .pill-link:hover { opacity: 0.9; }
        .pill-link.active { opacity: 1; }

        .pill-active-bg {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.07);
          z-index: 0;
        }
        [data-theme="dark"] .pill-active-bg {
          background: rgba(255, 255, 255, 0.1);
        }

        .pill-link-label {
          position: relative;
          z-index: 1;
        }

        .pill-divider {
          width: 1px;
          height: 18px;
          background: var(--border-strong);
          opacity: 0.45;
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* MOBILE - same pill, just tighter */
        @media (max-width: 640px) {
          .logo-corner {
            top: 14px;
            left: 16px;
          }
          .logo-badge {
            width: 28px;
            height: 28px;
          }
          .logo-badge span {
            font-size: 10px;
          }
          .pill-nav {
            top: 14px;
          }
          .pill-nav-inner {
            padding: 4px 5px;
            gap: 1px;
          }
          .pill-link {
            padding: 5px 10px;
            font-size: 9.5px;
            letter-spacing: 0.1em;
          }
          .pill-divider {
            height: 14px;
            margin: 0 2px;
          }
        }

        main, footer { margin-left: 0 !important; }
        body { padding-top: 0 !important; }
      `}</style>
    </>
  );
}