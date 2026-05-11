"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type Line = { type: "input" | "output" | "error"; text: string };

const BANNER = [
  "loyd@portfolio:~$ welcome",
  "─────────────────────────────────────────",
  " John Lloyd De Guzman — Developer & Designer",
  " Type 'help' for available commands.",
  "─────────────────────────────────────────",
];

const FILES: Record<string, string[]> = {
  "about.txt": [
    "Name    : John Lloyd De Guzman",
    "Role    : Developer & Designer",
    "Based   : Philippines",
    "Focus   : Full-stack web, UI/UX, creative tech",
    "Contact : deguzman.johnlloyd12@gmail.com",
  ],
  "projects.txt": [
    "Recent projects — see the Projects section for full details.",
    "",
    "  • Portfolio site (this one) — Next.js 16, Framer Motion",
    "  • Full-stack apps built with React + Supabase",
    "  • UI/UX work in Figma for clients & personal projects",
  ],
  "contact.txt": [
    "Email   : deguzman.johnlloyd12@gmail.com",
    "GitHub  : github.com/lloydio",
    "LinkedIn: linkedin.com/in/john-lloyd-de-guzman",
  ],
};

const SECTIONS = ["about", "stack", "credentials", "projects", "social", "contact"];

function runCommand(raw: string): { lines: string[]; action?: () => void } {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0]?.toLowerCase() ?? "";
  const arg = parts.slice(1).join(" ");

  if (!cmd) return { lines: [] };

  switch (cmd) {
    case "help":
      return {
        lines: [
          "Available commands:",
          "",
          "  help              — show this message",
          "  whoami            — who am I?",
          "  ls                — list available files",
          "  cat <file>        — read a file",
          "  open <section>    — scroll to a section",
          "  theme             — toggle light/dark mode",
          "  date              — current date/time",
          "  clear             — clear terminal",
          "  exit              — close terminal",
        ],
      };

    case "whoami":
      return { lines: ["loyd — developer, designer, and occasional overthinker."] };

    case "ls":
      return { lines: ["about.txt   projects.txt   contact.txt"] };

    case "cat": {
      if (!arg) return { lines: ["Usage: cat <filename>  (try: cat about.txt)"] };
      const content = FILES[arg];
      if (!content) return { lines: [`cat: ${arg}: No such file or directory`] };
      return { lines: content };
    }

    case "open": {
      if (!arg) return { lines: [`Usage: open <section>  (${SECTIONS.join(", ")})`] };
      const id = arg.toLowerCase();
      if (!SECTIONS.includes(id)) return { lines: [`open: unknown section '${id}'. Try: ${SECTIONS.join(", ")}`, ""] };
      return {
        lines: [`Navigating to #${id}...`],
        action: () => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        },
      };
    }

    case "theme":
      return {
        lines: ["Toggling theme..."],
        action: () => {
          const html = document.documentElement;
          const current = html.getAttribute("data-theme");
          html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
        },
      };

    case "date":
      return { lines: [new Date().toString()] };

    case "clear":
      return { lines: ["__clear__"] };

    case "admin":
      return {
        lines: ["Access granted. Redirecting to admin panel..."],
        action: () => { window.location.href = "/admin"; },
      };

    case "exit":
      return { lines: ["__exit__"] };

    default:
      return { lines: [`bash: ${cmd}: command not found. Type 'help' for available commands.`] };
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Backtick key opens/closes terminal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Init banner on first open
  useEffect(() => {
    if (open && lines.length === 0) {
      setLines(BANNER.map((t) => ({ type: "output", text: t })));
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const submit = () => {
    const raw = input.trim();
    setInput("");
    setHistoryIdx(-1);

    if (!raw) return;

    setHistory((h) => [raw, ...h].slice(0, 50));

    const { lines: out, action } = runCommand(raw);

    if (out[0] === "__clear__") {
      setLines([]);
      return;
    }
    if (out[0] === "__exit__") {
      close();
      return;
    }

    const newLines: Line[] = [
      { type: "input", text: raw },
      ...out.map((t) => ({ type: "output" as const, text: t })),
    ];
    setLines((prev) => [...prev, ...newLines]);

    if (action) setTimeout(action, 100);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { submit(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? "" : history[next] ?? "");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="terminal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 9000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0 0 3rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              width: "min(860px, 92vw)",
              maxHeight: "55vh",
              display: "flex",
              flexDirection: "column",
              background: "#0e0e0e",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
          >
            {/* Title bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "#161616",
              flexShrink: 0,
            }}>
              {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
              <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 8, letterSpacing: "0.15em" }}>
                loyd@portfolio — bash
              </span>
              <button
                onClick={close}
                style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: MONO, fontSize: 11 }}
                aria-label="Close terminal"
              >
                ✕
              </button>
            </div>

            {/* Output area */}
            <div style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem 1.25rem",
              fontFamily: MONO,
              fontSize: 12,
              lineHeight: 1.75,
              color: "#d4d4d4",
            }}>
              {lines.map((l, i) => (
                <div key={i} style={{
                  color: l.type === "input" ? "#7dd3fc" : l.type === "error" ? "#f87171" : "#d4d4d4",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}>
                  {l.type === "input" ? `$ ${l.text}` : l.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.6rem 1.25rem",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "#0a0a0a",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#4ade80", userSelect: "none" }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: MONO,
                  fontSize: 12,
                  color: "#d4d4d4",
                  caretColor: "#4ade80",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
