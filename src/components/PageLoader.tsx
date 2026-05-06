"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADER_DURATION_MS = 1900;

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADER_DURATION_MS);
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(1rem, 3vw, 2rem)",
              color: "var(--fg)",
            }}
          >
            {/* The Logo Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 12 }}
              transition={{
                opacity: { duration: 0.4, ease: "easeOut" },
                scale: { duration: 0.5, ease: "backOut" },
                rotate: { delay: 0.6, duration: 0.5, ease: "backOut" }
              }}
              style={{
                width: "clamp(48px, 8vw, 80px)",
                height: "clamp(48px, 8vw, 80px)",
                border: "clamp(3px, 0.5vw, 6px) solid var(--fg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: -12 }}
                transition={{ delay: 0.6, duration: 0.5, ease: "backOut" }}
                style={{
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 700,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}
              >
                L
              </motion.span>
            </motion.div>
            
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(48px, 8vw, 80px)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              Loyd.
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
