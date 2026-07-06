"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const allSections = ["about", "credentials", "projects", "social", "contact"];

    const onScroll = () => {
      setScrolled(window.scrollY > 40);

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

    const scroll = () => target.scrollIntoView({ behavior: "smooth" });

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(scroll);
    } else {
      scroll();
    }
  };

  return (
    <>
      {/* ── Fixed Header ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: "0 1px 0 var(--accent-border)",
        } : {}}
      >
        <div className="section-container flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 group"
            aria-label="Loyd — back to top"
          >
            <div
              className="w-7 h-7 flex items-center justify-center rotate-12 group-hover:rotate-0"
              style={{
                border: "2px solid var(--fg)",
                transition: "border-color 0.3s ease, transform 0.3s ease",
              }}
            >
              <span
                className="text-xs font-bold -rotate-12 group-hover:rotate-0 transition-transform duration-300"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                L
              </span>
            </div>
            <span
              className="font-bold text-sm tracking-widest uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                transition: "color 0.3s ease",
              }}
            >
              Loyd
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {links.map((l) => {
              const isActive = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="relative text-xs tracking-widest uppercase"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: isActive ? "var(--accent)" : "var(--fg)",
                    opacity: isActive ? 1 : 0.45,
                    fontWeight: isActive ? 600 : 400,
                    paddingBottom: "4px",
                    transition: "color 0.2s ease, opacity 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.opacity = "0.75";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.opacity = "0.45";
                    }
                  }}
                >
                  {l.label}
                  {/* Blue underline active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "var(--accent)",
                        borderRadius: "1px",
                        display: "block",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-6">
            <LocalTime />
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full blink"
                style={{ background: "var(--success)" }}
              />
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "var(--muted)", fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Available
              </span>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ position: "relative" }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px origin-center"
              style={{ background: menuOpen ? "var(--accent)" : "var(--fg)" }}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-6 h-px"
              style={{ background: "var(--fg)" }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px origin-center"
              style={{ background: menuOpen ? "var(--accent)" : "var(--fg)" }}
            />
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="md:hidden fixed inset-0 z-40"
            style={{
              background: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {/* Big nav links */}
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
                        fontFamily: "'Syne', var(--font-display), sans-serif",
                        fontSize: "clamp(32px, 8vw, 52px)",
                        fontWeight: 700,
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

            {/* Bottom: time + theme + available */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <LocalTime />
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span
                    className="w-2 h-2 rounded-full blink"
                    style={{ background: "var(--success)" }}
                  />
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Available
                  </span>
                </div>
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
