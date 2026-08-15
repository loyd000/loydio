"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// How many person icons to show before the +N overflow pill
const MAX_ICONS = 3;

// Maps each icon slot (0-based) to the uploaded file in /public
const VISITOR_ICONS = [
  "/visitor-icon 1.svg",
  "/visitor-icon 2.svg",
  "/visitor-icon 3.svg",
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function VisitCounter() {
  const [visits, setVisits] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        // Check if already counted in this session or within the 24-hour window
        const sessionVisited = typeof window !== "undefined" && sessionStorage.getItem("loyd_visit_session");
        const lastVisit = typeof window !== "undefined" ? localStorage.getItem("loyd_last_visit") : null;
        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const isRecent = lastVisit ? now - parseInt(lastVisit, 10) < ONE_DAY_MS : false;

        const shouldIncrement = !sessionVisited && !isRecent;
        const method = shouldIncrement ? "POST" : "GET";

        const res = await fetch("/api/visits", {
          method,
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          setVisits(json.visits ?? 0);
          if (shouldIncrement && typeof window !== "undefined") {
            sessionStorage.setItem("loyd_visit_session", "true");
            localStorage.setItem("loyd_last_visit", now.toString());
          }
        }
      } catch (err) {
        console.error("[VisitCounter] failed to fetch count", err);
      } finally {
        setLoaded(true);
      }
    };
    run();
  }, []);

  // Don't render until the count is fetched (avoids layout shift)
  if (!loaded) return null;

  const count = visits ?? 0;
  const iconsToRender = Math.max(Math.min(count, MAX_ICONS), 1);
  const overflow = count > MAX_ICONS ? count - MAX_ICONS : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="visit-counter"
        initial={{ opacity: 0, scale: 0.88, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        title={`Visited by ${count} ${count === 1 ? "person" : "people"}`}
        aria-label={`Visited by ${count} ${count === 1 ? "person" : "people"}`}
      >
        {/* Stacked custom visitor icons — last has highest z-index (on top) */}
        <div className="vc-icons" aria-hidden="true">
          {Array.from({ length: iconsToRender }).map((_, i) => (
            <div
              key={i}
              className="vc-icon-wrap"
              style={{ zIndex: i + 1 }}
            >
              <Image
                src={VISITOR_ICONS[i % VISITOR_ICONS.length]}
                alt={`visitor ${i + 1}`}
                width={22}
                height={22}
                className="vc-custom-icon"
              />
            </div>
          ))}

          {/* +N overflow pill — highest z-index, oblong to fit any digit length */}
          {overflow > 0 && (
            <div className="vc-icon-wrap vc-overflow" style={{ zIndex: MAX_ICONS + 1 }}>
              <span className="vc-overflow-label">+{formatCount(overflow)}</span>
            </div>
          )}
        </div>

        {/* "visited" label */}
        <span className="vc-label">
          <span className="vc-label-sub">visited</span>
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
