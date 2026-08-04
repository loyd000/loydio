import Link from "next/link";

const MONO = "var(--font-mono), monospace";

export default function NotFound() {
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
      <div style={{ maxWidth: 420 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.3em", opacity: 0.4, marginBottom: "1rem" }}>404</p>
        <h1 style={{ fontSize: "clamp(32px, 7vw, 72px)", lineHeight: 1, marginBottom: "1rem" }}>Page not found.</h1>
        <p style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.8, marginBottom: "2rem" }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </main>
  );
}
