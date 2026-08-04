"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setDark(localStorage.getItem("theme") === "dark");
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");

    const apply = () => document.documentElement.setAttribute("data-theme", next ? "dark" : "light");

    if (!document.startViewTransition) { apply(); return; }
    document.startViewTransition(apply);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      style={{
        background: "none",
        border: "none",
        color: "var(--fg)",
        cursor: "pointer",
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        flexShrink: 0,
        opacity: 0.7,
        transition: "opacity 0.18s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
