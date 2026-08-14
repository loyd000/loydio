"use client";

import "./globals.css";
import { useEffect } from "react";

const MONO = "var(--font-mono), monospace";

export default function GlobalError({
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
    <html lang="en">
      <body>
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
          <title>Application Error | Loyd</title>
          <div style={{ maxWidth: 460 }}>
            <p style={{ fontSize: 11, letterSpacing: "0.3em", opacity: 0.4, marginBottom: "1rem" }}>ERROR</p>
            <h1 style={{ fontSize: "clamp(32px, 7vw, 72px)", lineHeight: 1, marginBottom: "1rem" }}>
              Something went wrong.
            </h1>
            <p style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.8, marginBottom: "2rem" }}>
              Reload the app shell and try again.
            </p>
            <button onClick={() => reset()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
