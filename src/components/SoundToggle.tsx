"use client";
import { useState, useEffect } from "react";
import { sound } from "@/lib/sound";

export default function SoundToggle() {
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getIsMuted());
    setMounted(true);
    const unsubscribe = sound.subscribe((muted) => setIsMuted(muted));
    return unsubscribe;
  }, []);

  const toggle = () => {
    sound.toggleMute();
  };

  return (
    <button
      onClick={toggle}
      aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
      title={isMuted ? "Sound: Off (click to enable)" : "Sound: On (click to mute)"}
      style={{
        background: "none",
        border: "none",
        color: "var(--fg)",
        cursor: "pointer",
        width: 30,
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: isMuted ? 0.45 : 0.75,
        transition: "opacity 0.18s ease, transform 0.15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = isMuted ? "0.45" : "0.75")}
    >
      {!mounted ? (
        <div style={{ width: 15, height: 15 }} />
      ) : isMuted ? (
        // Muted Speaker Icon (Volume X)
        <svg
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Active Speaker Icon with sound waves
        <svg
          aria-hidden="true"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
