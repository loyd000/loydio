"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageLoader from "./PageLoader";

const SITE_REVEAL_DELAY_MS = 1000;

export default function SiteIntro({ children }: { children: React.ReactNode }) {
  const [showSite, setShowSite] = useState(false);
  const revealTimer = useRef<number | null>(null);

  const revealSite = useCallback(() => {
    if (revealTimer.current !== null) return;

    revealTimer.current = window.setTimeout(() => {
      setShowSite(true);
    }, SITE_REVEAL_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (revealTimer.current !== null) {
        window.clearTimeout(revealTimer.current);
      }
    };
  }, []);

  return (
    <>
      <PageLoader onComplete={revealSite} />
      {showSite ? children : null}
    </>
  );
}
