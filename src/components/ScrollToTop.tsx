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
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ opacity: 1, scale: 1.08 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="scroll-to-top-btn"
          style={{
            position: "fixed",
            bottom: 104,
            right: 32,
            zIndex: 7990,
            width: 42,
            height: 42,
            borderRadius: 10,
            border: "1px solid rgba(255, 255, 255, 0.4)",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            color: "var(--fg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            fontSize: 16,
            boxShadow: "inset 0 1px 1px 0 rgba(255,255,255,0.7), 0 6px 20px rgba(0,0,0,0.1)",
            transition: "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--fg)";
            e.currentTarget.style.background = "rgba(255,255,255,0.8)";
            e.currentTarget.style.boxShadow = "inset 0 1.5px 1.5px 0 rgba(255,255,255,0.9), 0 8px 28px rgba(0,0,0,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            e.currentTarget.style.background = "rgba(255,255,255,0.55)";
            e.currentTarget.style.boxShadow = "inset 0 1px 1px 0 rgba(255,255,255,0.7), 0 6px 20px rgba(0,0,0,0.1)";
          }}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
