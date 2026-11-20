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
        <svg width="24" height="24" viewBox="0 0 1024 1024" aria-hidden="true">
          <path
            d="M 426.00 924.61 C106.46,856.34 22.54,838.10 22.71,836.95 C22.97,835.17 51.04,703.44 132.35,322.23 C166.65,161.49 195.00,29.67 195.37,29.30 C195.73,28.93 210.09,31.63 227.27,35.28 C244.44,38.94 277.40,45.96 300.50,50.89 C323.60,55.81 461.98,85.33 608.00,116.48 C1002.52,200.64 1004.37,201.03 1004.66,201.33 C1004.81,201.48 966.11,383.60 918.66,606.05 C853.25,912.71 832.04,1010.53 830.95,1010.66 C830.15,1010.75 647.92,972.03 426.00,924.61 ZM 785.50 935.75 C787.79,926.15 931.99,248.66 931.77,248.49 C931.21,248.02 245.43,101.99 243.82,102.00 C242.60,102.00 241.84,103.44 241.04,107.25 C240.44,110.14 207.39,265.05 167.59,451.50 C127.80,637.95 95.40,790.68 95.60,790.89 C96.02,791.35 780.66,937.70 783.23,937.88 C784.26,937.95 785.18,937.08 785.50,935.75 ZM 427.00 524.50 L 427.00 385.00 L 457.50 385.00 L 488.00 385.00 L 488.00 500.00 L 488.00 615.00 L 548.00 615.00 L 608.00 615.00 L 608.00 639.50 L 608.00 664.00 L 517.50 664.00 L 427.00 664.00 L 427.00 524.50 Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="50"
            strokeLinejoin="round"
          />
        </svg>
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
