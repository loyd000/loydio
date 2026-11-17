"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderClosed, BriefcaseBusiness, Mail } from "lucide-react";

const links = [
  { label: "Work",       id: "work",       Icon: FolderClosed },
  { label: "Experience", id: "experience", Icon: BriefcaseBusiness },
  { label: "Contact",    id: "contact",    Icon: Mail },
];

export default function Navbar() {
  const [active, setActive] = useState("");

  // Highlight the section crossing the middle of the viewport. Contact sits inside
  // Experience, so the later match wins.
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let current = "";
      for (const { id } of links) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= mid && rect.bottom >= mid) current = id;
      }
      // Contact is too short to reach the middle at the end of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) current = "contact";
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="dock"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="#top" className="dock-item dock-logo" aria-label="Back to top">
        <span aria-hidden="true">L</span>
        <span className="dock-tip" aria-hidden="true">Top</span>
      </a>

      <span className="dock-divider" aria-hidden="true" />

      {links.map(({ label, id, Icon }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`dock-item${active === id ? " active" : ""}`}
          aria-label={label}
          aria-current={active === id ? "location" : undefined}
        >
          <Icon size={20} strokeWidth={2} aria-hidden="true" />
          <span className="dock-tip" aria-hidden="true">{label}</span>
        </a>
      ))}
    </motion.nav>
  );
}
