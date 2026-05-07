"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const MONO = "'IBM Plex Mono', monospace";

type SpotifyData = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string | null;
  songUrl?: string | null;
  error?: string;
};

function EqBars({ playing }: { playing: boolean }) {
  const bars = [0.6, 1, 0.75, 0.5, 0.85];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 14 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: playing ? `${h * 100}%` : "30%",
            background: "#1db954",
            borderRadius: 1,
            animation: playing ? `eq-bar-${i} 0.${6 + i * 2}s ease-in-out infinite alternate` : "none",
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

export default function SpotifyWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/spotify", { cache: "no-store" });
        const json: SpotifyData = await res.json();
        if (!json.error && json.title) setData(json);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!visible || !data || !data.title) return null;

  const href = data.songUrl ?? "https://open.spotify.com";

  return (
    <>
      {/* Eq bar keyframes injected inline */}
      <style>{`
        @keyframes eq-bar-0 { from { height: 30% } to { height: 100% } }
        @keyframes eq-bar-1 { from { height: 50% } to { height: 80% } }
        @keyframes eq-bar-2 { from { height: 20% } to { height: 70% } }
        @keyframes eq-bar-3 { from { height: 60% } to { height: 100% } }
        @keyframes eq-bar-4 { from { height: 40% } to { height: 90% } }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "2rem",
          zIndex: 8000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Expanded card */}
        {expanded && (
          <div
            style={{
              marginBottom: 8,
              background: "var(--bg)",
              border: "1px solid var(--border-heavy)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              padding: "12px 14px",
              display: "flex",
              gap: 12,
              alignItems: "center",
              width: 260,
            }}
          >
            {data.albumArt && (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                <Image
                  src={data.albumArt}
                  alt="Album art"
                  width={52}
                  height={52}
                  style={{ display: "block", objectFit: "cover" }}
                />
              </a>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: "#1db954", letterSpacing: "0.18em", marginBottom: 3 }}>
                {data.isPlaying ? "▶ NOW PLAYING" : "⏸ LAST PLAYED"}
              </div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "var(--fg)" }}
              >
                <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {data.title}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, opacity: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                  {data.artist}
                </div>
              </a>
            </div>
            <EqBars playing={data.isPlaying} />
          </div>
        )}

        {/* Mini pill button */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setExpanded((v) => !v)}
            title={data.isPlaying ? `Now playing: ${data.title}` : `Last played: ${data.title}`}
            aria-label={expanded ? "Collapse Spotify widget" : "Expand Spotify widget"}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 12px",
              background: "var(--bg)",
              border: "1px solid var(--border-heavy)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              cursor: "pointer",
              color: "var(--fg)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1db954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <EqBars playing={data.isPlaying} />
          </button>

          <button
            onClick={() => setVisible(false)}
            aria-label="Hide Spotify widget"
            title="Hide"
            style={{
              padding: "6px 8px",
              background: "var(--bg)",
              border: "1px solid var(--border-heavy)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              cursor: "pointer",
              color: "var(--fg)",
              fontFamily: MONO,
              fontSize: 10,
              opacity: 0.5,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
