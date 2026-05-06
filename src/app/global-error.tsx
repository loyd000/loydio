"use client";

import "./globals.css";
import { useEffect } from "react";

const MONO = "'IBM Plex Mono', monospace";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
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
            <button onClick={() => unstable_retry()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
