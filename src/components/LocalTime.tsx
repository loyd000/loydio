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
    <div className="flex flex-col items-end text-[10px] font-mono leading-tight opacity-50">
      <span>{time}</span>
      <span>{date} · PH</span>
    </div>
  );
}
