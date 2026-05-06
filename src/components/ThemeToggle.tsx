"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);

    // Add transitioning class so CSS transitions fire only during the switch
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");

    // Remove after transition completes (matches 0.18s in CSS)
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 200);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      style={{
        background: "none",
        border: "1px solid var(--border-strong)",
        color: "var(--fg)",
        cursor: "pointer",
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        flexShrink: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--fg)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
