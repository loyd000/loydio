"use client";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import VisitCounter from "./VisitCounter";

const links = [
  { label: "About",    href: "#about",    route: false },
  { label: "Projects", href: "/projects", route: true  },
  { label: "Contact",  href: "#contact",  route: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const isProjectsRoute = pathname === "/projects";
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const effectiveActiveSection = isProjectsRoute ? "projects" : activeSection;
  const effectiveScrolled = isProjectsRoute ? true : scrolled;

  // ── Scroll tracking ──────────────────────────────────────────────────
  useEffect(() => {
    if (isProjectsRoute) return;

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
  }, [isProjectsRoute]);

  // ── Nav click handler ────────────────────────────────────────────────
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute: boolean) => {
      if (isRoute) return;
      e.preventDefault();
      if (pathname !== "/") {
        window.location.assign(`/${href}`);
        return;
      }
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [pathname]
  );

  return (
    <>
      {/* LOGO - fixed top-left */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Loyd - back to top"
        className="logo-corner"
      >
        <div className="logo-badge backdrop-blur-[12px]">
          <span>L</span>
        </div>
      </a>

      {/* Centered Pill Navigation */}
      <div className="pill-nav-wrapper">
        <div className="pill-nav-relative-anchor">
          <motion.nav
            layout
            transition={{
              layout: { type: "spring", stiffness: 280, damping: 24, mass: 0.85 },
            }}
            className={[
              "pill-nav",
              "backdrop-blur-[22px] backdrop-saturate-[1.9]",
              effectiveScrolled ? "pill-nav-scrolled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Main navigation"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="pill-nav-inner">
              {links.map((l) => {
                const isActive = l.route
                  ? pathname === l.href || pathname.startsWith(l.href + "/")
                  : effectiveActiveSection === l.href.slice(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href, l.route)}
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
          </motion.nav>
        </div>
      </div>

      {/* VISIT COUNTER - fixed top-right */}
      <div className="visit-counter-corner">
        <VisitCounter />
      </div>
    </>
  );
}
