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

const mobileMenuLinkStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  color: "var(--fg)",
  display: "block",
  fontSize: 14,
  letterSpacing: "0.28em",
  padding: "0.85rem 0",
  textDecoration: "none",
  textTransform: "uppercase",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const allSections = ["about", "experience", "stack", "credentials", "projects", "social", "contact"];
    
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Find the active section based on what's in the top half of the viewport
      let current = "";
      allSections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section overlaps the top 200px of the screen, it's active
          if (rect.top <= 250 && rect.bottom >= 250) {
            current = id;
          }
        }
      });

      if (current) {
        if (["about", "experience", "stack", "credentials"].includes(current)) setActiveSection("about");
        else if (["projects", "social"].includes(current)) setActiveSection("projects");
        else if (current === "contact") setActiveSection("contact");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: "var(--nav-bg)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--border)",
      } : {}}
    >
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-7 h-7 border-2 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300" style={{ borderColor: "var(--fg)" }}>
            <span className="text-xs font-bold -rotate-12 group-hover:rotate-0 transition-transform duration-300">L</span>
          </div>
          <span className="font-bold text-sm tracking-widest uppercase">Loyd</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className="text-xs tracking-widest uppercase transition-opacity duration-200"
                style={{ opacity: isActive ? 1 : 0.4, fontWeight: isActive ? 700 : 400 }}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7"; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.opacity = "0.4"; }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <LocalTime />
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 blink" />
            <span className="text-[10px] uppercase tracking-widest opacity-60">Available</span>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px origin-center transition-all"
            style={{ background: "var(--fg)" }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-6 h-px"
            style={{ background: "var(--fg)" }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-6 h-px origin-center transition-all"
            style={{ background: "var(--fg)" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
            style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
          >
            <div
              className="section-container"
              style={{ paddingTop: "0.75rem", paddingBottom: "1rem" }}
            >
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={mobileMenuLinkStyle}
                >
                  {l.label}
                </a>
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <LocalTime />
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
