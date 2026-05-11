"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type Line = { type: "input" | "output" | "error"; text: string };

// Interactive mode state
type Mode =
  | { kind: "normal" }
  | { kind: "typerace"; target: string; startTime: number }
  | { kind: "hack"; step: number }
  | { kind: "matrix" };

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

/* ── Type Race phrases ────────────────── */
const TYPERACE_PHRASES = [
  "const app = express();",
  "npm install framer-motion",
  "git commit -m \"ship it\"",
  "SELECT * FROM users WHERE active = true;",
  "export default function Home() {",
  "docker compose up -d",
  "const [state, setState] = useState(null);",
  "npx create-next-app@latest",
  "console.log(\"Hello, World!\");",
  "import React from 'react';",
];

/* ── Hack simulation data ─────────────── */
const HACK_LINES = [
  "[*] Initializing breach protocol...",
  "[*] Scanning target network... 192.168.1.0/24",
  "[+] Found 3 open ports: 22, 80, 443",
  "[*] Bypassing firewall rules...",
  "[+] Firewall bypassed. Injecting payload...",
  "[*] Decrypting AES-256 cipher...",
  "    ░░░░░░░░░░░░░░░░░░░░░░░░ 0%",
  "    ████░░░░░░░░░░░░░░░░░░░░ 18%",
  "    ████████░░░░░░░░░░░░░░░░ 35%",
  "    ████████████░░░░░░░░░░░░ 52%",
  "    ████████████████░░░░░░░░ 71%",
  "    ████████████████████░░░░ 87%",
  "    ████████████████████████ 100%",
  "[+] Cipher cracked successfully.",
  "[*] Extracting credentials...",
  `    admin:${Array.from({ length: 16 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`,
  `    root:${Array.from({ length: 16 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`,
  "[*] Establishing reverse shell...",
  "[+] Connection established on port 4444.",
  "[*] Downloading /etc/shadow...",
  "[+] Download complete. 2.4KB transferred.",
  "[*] Cleaning logs...",
  "[+] Tracks covered. Session terminated.",
  "",
  "╔══════════════════════════════════════╗",
  "║        ACCESS GRANTED ✓             ║",
  "║   Just kidding. This is a portfolio ║",
  "╚══════════════════════════════════════╝",
];

/* ── Matrix characters ────────────────── */
const MATRIX_CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
function randomMatrixLine(width: number): string {
  return Array.from({ length: width }, () =>
    Math.random() > 0.7 ? MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] : " "
  ).join("");
}

function runCommand(raw: string): { lines: string[]; action?: () => void; mode?: Mode } {
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
          "  hack              — breach the mainframe",
          "  type-race         — test your typing speed",
          "  matrix            — enter the matrix",
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

    case "hack":
      return {
        lines: ["[*] BREACH PROTOCOL v3.7 — Starting..."],
        mode: { kind: "hack", step: 0 },
      };

    case "type-race": {
      const phrase = TYPERACE_PHRASES[Math.floor(Math.random() * TYPERACE_PHRASES.length)];
      return {
        lines: [
          "╔═══ TYPE RACE ═══════════════════════════╗",
          "║ Type the following as fast as you can:   ║",
          "╚══════════════════════════════════════════╝",
          "",
          `  ▸ ${phrase}`,
          "",
        ],
        mode: { kind: "typerace", target: phrase, startTime: Date.now() },
      };
    }

    case "matrix":
      return {
        lines: ["Entering the Matrix..."],
        mode: { kind: "matrix" },
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
  const [mode, setMode] = useState<Mode>({ kind: "normal" });
  const [inputLocked, setInputLocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const close = useCallback(() => setOpen(false), []);

  // Clean up animation timers
  const clearTimers = useCallback(() => {
    animTimers.current.forEach(clearTimeout);
    animTimers.current = [];
  }, []);

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

  // ── Hack animation ──
  useEffect(() => {
    if (mode.kind !== "hack") return;
    clearTimers();
    setInputLocked(true);

    HACK_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { type: "output", text: line }]);
        // Last line: unlock input
        if (i === HACK_LINES.length - 1) {
          setMode({ kind: "normal" });
          setInputLocked(false);
        }
      }, (i + 1) * 180);
      animTimers.current.push(t);
    });

    return clearTimers;
  }, [mode.kind === "hack" ? mode.step : null, clearTimers]);

  // ── Matrix animation ──
  useEffect(() => {
    if (mode.kind !== "matrix") return;
    clearTimers();
    setInputLocked(true);

    const totalLines = 30;
    for (let i = 0; i < totalLines; i++) {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { type: "output", text: randomMatrixLine(60) }]);
        if (i === totalLines - 1) {
          const end = setTimeout(() => {
            setLines((prev) => [
              ...prev,
              { type: "output", text: "" },
              { type: "output", text: "Wake up, Neo..." },
              { type: "output", text: "The Matrix has you." },
              { type: "output", text: "" },
            ]);
            setMode({ kind: "normal" });
            setInputLocked(false);
          }, 300);
          animTimers.current.push(end);
        }
      }, (i + 1) * 100);
      animTimers.current.push(t);
    }

    return clearTimers;
  }, [mode.kind === "matrix" ? "active" : null, clearTimers]);

  // Clean up on close
  useEffect(() => {
    if (!open) {
      clearTimers();
      setMode({ kind: "normal" });
      setInputLocked(false);
    }
  }, [open, clearTimers]);

  const submit = () => {
    const raw = input.trim();
    setInput("");
    setHistoryIdx(-1);

    if (!raw) return;

    // Handle type-race mode
    if (mode.kind === "typerace") {
      const elapsed = (Date.now() - mode.startTime) / 1000;
      const words = mode.target.split(" ").length;
      const wpm = Math.round((words / elapsed) * 60);
      const isCorrect = raw === mode.target;

      const results: Line[] = [
        { type: "input", text: raw },
        { type: "output", text: "" },
        {
          type: isCorrect ? "output" : "error",
          text: isCorrect
            ? `✓ Correct! Time: ${elapsed.toFixed(2)}s — ${wpm} WPM`
            : `✗ Incorrect! You typed:`,
        },
      ];

      if (!isCorrect) {
        // Show diff: highlight wrong characters
        const diff = mode.target
          .split("")
          .map((ch, i) => (raw[i] === ch ? ch : `[${raw[i] ?? "·"}]`))
          .join("");
        results.push({ type: "error", text: `  ${diff}` });
        results.push({ type: "output", text: `  Expected: ${mode.target}` });
      } else if (wpm >= 80) {
        results.push({ type: "output", text: "  🔥 Blazing fast!" });
      } else if (wpm >= 50) {
        results.push({ type: "output", text: "  ⚡ Not bad!" });
      } else {
        results.push({ type: "output", text: "  🐌 Keep practicing!" });
      }

      results.push({ type: "output", text: "" });
      results.push({ type: "output", text: "Type 'type-race' to try again." });

      setLines((prev) => [...prev, ...results]);
      setMode({ kind: "normal" });
      return;
    }

    setHistory((h) => [raw, ...h].slice(0, 50));

    const { lines: out, action, mode: newMode } = runCommand(raw);

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

    if (newMode) setMode(newMode);
    if (action) setTimeout(action, 100);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { submit(); return; }
    if (mode.kind !== "normal" && mode.kind !== "typerace") return; // Ignore arrows during animations
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

  // Input placeholder text based on mode
  const placeholder = mode.kind === "typerace" ? "Type the phrase above..." : "";

  return (
    <>
      {/* Floating terminal trigger — visible on all devices */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          onClick={() => setOpen(true)}
          aria-label="Open terminal"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MONO,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 8000,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            opacity: 0.6,
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.6"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {">_"}
        </motion.button>
      )}

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
                <span style={{ fontFamily: MONO, fontSize: 12, color: inputLocked ? "#666" : "#4ade80", userSelect: "none" }}>$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={inputLocked}
                  placeholder={placeholder}
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
                    color: inputLocked ? "#666" : "#d4d4d4",
                    caretColor: "#4ade80",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
