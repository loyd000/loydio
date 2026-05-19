"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.78, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ opacity: 1, scale: 1.08 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          style={{
            position: "fixed",
            bottom: 104,
            right: 32,
            zIndex: 7990,
            width: 40,
            height: 40,
            border: "1px solid var(--border-heavy)",
            background: "var(--bg)",
            color: "var(--fg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 16,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--fg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-heavy)";
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
