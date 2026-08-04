"use client";

import { useEffect } from "react";

const MONO = "var(--font-mono), monospace";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: MONO,
      }}
    >
      <div style={{ maxWidth: 460 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", opacity: 0.4, marginBottom: "1rem" }}>ERROR</p>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 72px)", lineHeight: 1, marginBottom: "1rem" }}>
          Something went wrong.
        </h1>
        <p style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.8, marginBottom: "2rem" }}>
          Try reloading this view. If it keeps failing, check the server logs with the error digest.
        </p>
        <button onClick={() => reset()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    </main>
  );
}
