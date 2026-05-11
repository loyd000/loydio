"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADER_DURATION_MS = 1900;

const LOADING_MESSAGES = [
  "Compiling pixels...",
  "Injecting caffeine...",
  "Initializing creative engine...",
  "Loading frameworks...",
  "Almost there...",
  "Booting up the good vibes...",
  "Deploying aesthetics...",
  "Rendering dreams...",
  "npm install personality...",
  "Warming up the GPU...",
  "Fetching inspiration...",
  "sudo make me a website...",
  "Brewing the perfect layout...",
  "Parsing creativity...",
];

function TypewriterMessage({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");

    const delay = setTimeout(() => {
      const id = setInterval(() => {
        indexRef.current++;
        if (indexRef.current <= text.length) {
          setDisplayed(text.slice(0, indexRef.current));
        } else {
          clearInterval(id);
        }
      }, 40);
      return () => clearInterval(id);
    }, 600); // Wait for logo animation to start

    return () => clearTimeout(delay);
  }, [text]);

  return (
    <span style={{ display: "inline-block", minWidth: "1ch" }}>
      {displayed}
      <span className="blink" style={{ opacity: 0.6 }}>▌</span>
    </span>
  );
}

export default function PageLoader({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [message] = useState(
    () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), LOADER_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: [1, 0.15, 1, 0, 0.65, 0] }}
          transition={{
            duration: 0.42,
            ease: "linear",
            times: [0, 0.12, 0.26, 0.42, 0.62, 1],
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
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

          {/* Randomized loading message with typewriter effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.4,
              color: "var(--fg)",
            }}
          >
            <TypewriterMessage text={message} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
