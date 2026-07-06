"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import PageLoader from "./PageLoader";

const SITE_REVEAL_DELAY_MS = 1000;

export default function SiteIntro({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [showSite, setShowSite] = useState(false);
  const revealTimer = useRef<number | null>(null);

  const revealSite = useCallback(() => {
    if (revealTimer.current !== null) return;

    revealTimer.current = window.setTimeout(() => {
      setShowSite(true);
    }, SITE_REVEAL_DELAY_MS);
  }, []);

  useEffect(() => {
    // If user prefers reduced motion, skip the loader entirely
    if (prefersReduced) {
      setShowSite(true);
      return;
    }

    // Guaranteed fallback: reveal after SITE_REVEAL_DELAY_MS even if
    // PageLoader never fires onComplete (e.g. animation skipped/failed)
    revealSite();

    return () => {
      if (revealTimer.current !== null) {
        window.clearTimeout(revealTimer.current);
      }
    };
  }, [prefersReduced, revealSite]);

  // Skip loader for reduced motion users
  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <>
      <PageLoader onComplete={revealSite} />
      {showSite ? children : null}
    </>
  );
}
