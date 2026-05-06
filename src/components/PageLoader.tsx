"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            Loyd.
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
