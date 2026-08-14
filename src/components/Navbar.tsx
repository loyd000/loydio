"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "About",    href: "#about",    route: false },
  { label: "Projects", href: "/projects", route: true  },
  { label: "Contact",  href: "#contact",  route: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [scrolled,      setScrolled]      = useState(false);

  useEffect(() => {
    // On the /projects page, always mark projects as active — no scrolling needed.
    if (pathname === "/projects") {
      setActiveSection("projects");
      setScrolled(true);
      return;
    }
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
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isRoute: boolean) => {
    if (isRoute) return; // let the browser follow the <a> href normally
    e.preventDefault();
    // If we're not on the home page, go home first then let the hash resolve
    if (pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }
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
        <div className="logo-badge backdrop-blur-[12px]">
          <span>L</span>
        </div>
      </a>

      {/* PILL NAVBAR - top on desktop, docked at the bottom on mobile */}
      <nav className={`pill-nav backdrop-blur-[22px] backdrop-saturate-[1.9]${scrolled ? " pill-nav-scrolled" : ""}`} aria-label="Main navigation">
        <div className="pill-nav-inner">
          {links.map((l) => {
            // For route links, match by pathname; for hash links, match by scroll section.
            const isActive = l.route
              ? pathname === l.href || pathname.startsWith(l.href + "/")
              : activeSection === l.href.slice(1);
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
      </nav>
    </>
  );
}
