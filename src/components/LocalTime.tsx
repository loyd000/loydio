"use client";
import { useEffect, useState } from "react";

export default function LocalTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = now.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const d = now.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setTime(t);
      setDate(d);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        lineHeight: 1.5,
        color: "var(--fg)",
        opacity: 0.5,
        letterSpacing: "0.05em",
      }}
    >
      <span>{time}</span>
      <span>{date} · PH</span>
    </div>
  );
}
