"use client";
import { useState, useEffect } from "react";

const MONO = "'IBM Plex Mono', monospace";

const Dot = ({ color = "var(--border-strong)" }: { color?: string }) => (
  <div style={{ width: 3, height: 3, borderRadius: "50%", background: color, flexShrink: 0 }} />
);

export default function CurrentlyStrip() {
  const [time,      setTime]      = useState("--:--:--");
  const [title,     setTitle]     = useState<string | null>(null);
  const [artist,    setArtist]    = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Live PH time
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Spotify
  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/spotify");
        if (!r.ok) return;
        const d = await r.json();
        setTitle(d.title ?? null);
        setArtist(d.artist ?? null);
        setIsPlaying(d.isPlaying ?? false);
      } catch {}
    };
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const truncate = (s: string, n: number) => s.length > n ? s.slice(0, n) + "…" : s;

  const textStyle = {
    fontFamily: MONO,
    fontSize: 9,
    letterSpacing: "0.14em",
    writingMode: "vertical-rl" as const,
    transform: "rotate(180deg)",
    whiteSpace: "nowrap" as const,
    textTransform: "uppercase" as const,
  };

  return (
    <div
      className="currently-strip"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: 32,
        borderLeft: "1px solid var(--border)",
        background: "var(--bg)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {/* PH time */}
      <span style={{ ...textStyle, opacity: 0.5, letterSpacing: "0.1em" }}>
        {time}
      </span>

      <Dot />

      {/* Status */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80" }} />
        <span style={{ ...textStyle, opacity: 0.35 }}>Available</span>
      </div>

      <Dot />

      {/* Spotify */}
      {title ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ ...textStyle, opacity: 0.25, fontSize: 8 }}>
            {isPlaying ? "Now Playing" : "Last Played"}
          </span>
          <span style={{ ...textStyle, opacity: 0.55, fontSize: 9 }}>
            {truncate(title, 22)}
          </span>
          {artist && (
            <span style={{ ...textStyle, opacity: 0.3, fontSize: 8 }}>
              {truncate(artist, 18)}
            </span>
          )}
        </div>
      ) : (
        <span style={{ ...textStyle, opacity: 0.2 }}>Offline</span>
      )}

      <Dot />

      {/* PH label */}
      <span style={{ ...textStyle, opacity: 0.2, letterSpacing: "0.28em" }}>PHL</span>
    </div>
  );
}
