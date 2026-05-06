"use client";
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#000",
        color: "#fff",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "2rem 0",
      }}
    >
      <div
        className="section-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 24,
              border: "1px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(12deg)",
            }}
          >
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 700, transform: "rotate(-12deg)", display: "block" }}>
              L
            </span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, opacity: 0.35 }}>
            © {year} Loyd — John Lloyd De Guzman
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          {["About", "Projects", "Experience", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                opacity: 0.3,
                textDecoration: "none",
                color: "#fff",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.3")}
            >
              {link}
            </a>
          ))}
          <a
            href="mailto:deguzman.johnlloyd12@gmail.com"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              opacity: 0.3,
              textDecoration: "none",
              color: "#fff",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.3")}
          >
            ✉ deguzman.johnlloyd12@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
