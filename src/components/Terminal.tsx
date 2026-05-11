"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type Line = { type: "input" | "output" | "error"; text: string };
type Mode = { kind: "normal" } | { kind: "flappy" };

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
          "  fetch             — portfolio system info",
          "  ls                — list available files",
          "  cat <file>        — read a file",
          "  open <section>    — scroll to a section",
          "  theme             — toggle light/dark mode",
          "  flappy            — play flappy bird",
          "  date              — current date/time",
          "  clear             — clear terminal",
          "  exit              — close terminal",
        ],
      };

    case "whoami":
      return { lines: ["loyd — developer, designer, and occasional overthinker."] };

    case "fetch":
      return {
        lines: [
          "  loyd@portfolio",
          "  ──────────────────────────────",
          "  Name     : John Lloyd De Guzman",
          "  Role     : Developer & Designer",
          "  OS       : Next.js 16",
          "  Shell    : TypeScript",
          "  WM       : Framer Motion",
          "  Editor   : VS Code",
          "  Frontend : React · Tailwind v4 · Framer Motion",
          "  Backend  : Node · Supabase · PostgreSQL",
          "  Design   : Figma · UI/UX",
          "  Based    : Philippines 🇵🇭",
          "  ──────────────────────────────",
          "  ██ ██ ██ ██ ██ ██ ██ ██",
        ],
      };

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
      if (!SECTIONS.includes(id))
        return { lines: [`open: unknown section '${id}'. Try: ${SECTIONS.join(", ")}`, ""] };
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

/* ── Flappy Bird ──────────────────────────────────────────────────────────── */

function FlappyGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Sync canvas buffer to its rendered size
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // — Game constants —
    const BIRD_X    = Math.floor(W * 0.15);
    const BIRD_SIZE = 11;
    const PIPE_W    = 26;
    const PIPE_GAP  = 120;
    const GRAVITY   = 0.38;
    const FLAP_V    = -7.0;
    const SPEED     = 2.3;
    const PIPE_FREQ = 150; // frames between spawns

    type GState = "idle" | "playing" | "dead";

    let gstate: GState  = "idle";
    let bird            = { y: H / 2, vy: 0 };
    let pipes: { x: number; topH: number; scored: boolean }[] = [];
    let score     = 0;
    let hiScore   = parseInt(localStorage.getItem("flappy-hi") ?? "0", 10);
    let frame     = 0;
    let deadTime  = 0;
    let raf       = 0;

    const die = () => {
      if (gstate !== "playing") return;
      gstate = "dead";
      deadTime = Date.now();
      if (score > hiScore) {
        hiScore = score;
        localStorage.setItem("flappy-hi", String(score));
      }
    };

    const flap = () => {
      if (gstate === "idle") {
        gstate = "playing";
        bird.vy = FLAP_V;
      } else if (gstate === "playing") {
        bird.vy = FLAP_V;
      } else if (gstate === "dead" && Date.now() - deadTime > 600) {
        gstate  = "playing";
        bird    = { y: H / 2, vy: FLAP_V };
        pipes   = [];
        score   = 0;
        frame   = 0;
      }
    };

    const loop = () => {
      // — Background —
      ctx.fillStyle = "#0e0e0e";
      ctx.fillRect(0, 0, W, H);

      // Subtle vertical grid columns (echoes portfolio grid strips)
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 1;
      for (let x = 80; x < W; x += 80) {
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke();
      }

      // — Physics & logic —
      if (gstate === "playing") {
        bird.vy += GRAVITY;
        bird.y  += bird.vy;

        frame++;
        if (frame % PIPE_FREQ === 0) {
          const topH = 48 + Math.random() * (H - PIPE_GAP - 76);
          pipes.push({ x: W + PIPE_W, topH, scored: false });
        }

        for (const p of pipes) {
          p.x -= SPEED;
          if (!p.scored && p.x + PIPE_W < BIRD_X) { p.scored = true; score++; }
        }
        pipes = pipes.filter(p => p.x + PIPE_W > 0);

        // Ceiling / floor
        if (bird.y < 0 || bird.y + BIRD_SIZE >= H) die();

        // Pipe collisions (1px inset for forgiveness)
        for (const p of pipes) {
          if (
            BIRD_X + BIRD_SIZE > p.x + 1 &&
            BIRD_X            < p.x + PIPE_W - 1 &&
            (bird.y < p.topH || bird.y + BIRD_SIZE > p.topH + PIPE_GAP)
          ) die();
        }
      }

      // — Draw pipes —
      for (const p of pipes) {
        const botY  = p.topH + PIPE_GAP;
        const capH  = 9;
        const capOX = 3; // cap overhang x

        // Top shaft
        ctx.fillStyle   = "rgba(255,255,255,0.06)";
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth   = 1;
        ctx.strokeRect(p.x + 0.5, 0.5, PIPE_W - 1, p.topH - 1);

        // Top cap
        ctx.fillStyle   = "rgba(255,255,255,0.1)";
        ctx.fillRect(p.x - capOX, p.topH - capH, PIPE_W + capOX * 2, capH);
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.strokeRect(p.x - capOX + 0.5, p.topH - capH + 0.5, PIPE_W + capOX * 2 - 1, capH - 1);

        // Bottom cap
        ctx.fillStyle   = "rgba(255,255,255,0.1)";
        ctx.fillRect(p.x - capOX, botY, PIPE_W + capOX * 2, capH);
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.strokeRect(p.x - capOX + 0.5, botY + 0.5, PIPE_W + capOX * 2 - 1, capH - 1);

        // Bottom shaft
        ctx.fillStyle   = "rgba(255,255,255,0.06)";
        ctx.fillRect(p.x, botY + capH, PIPE_W, H - botY - capH);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.strokeRect(p.x + 0.5, botY + capH + 0.5, PIPE_W - 1, H - botY - capH - 1);
      }

      // Ground line
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, H - 1, W, 1);

      // — Bird (sharp square with velocity tilt) —
      if (gstate !== "dead") {
        const tilt = Math.max(-20, Math.min(30, bird.vy * 3));
        ctx.save();
        ctx.translate(BIRD_X + BIRD_SIZE / 2, bird.y + BIRD_SIZE / 2);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
        ctx.restore();
      }

      // — HUD —
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font      = `10px ${MONO}`;
      ctx.textAlign = "left";
      ctx.fillText(`score  ${score}`, 14, 18);
      ctx.textAlign = "right";
      ctx.fillText(`best  ${hiScore}`, W - 14, 18);

      // — Idle overlay —
      if (gstate === "idle") {
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.72)";
        ctx.font      = `11px ${MONO}`;
        ctx.fillText("press space to start", W / 2, H / 2 - 12);
        ctx.fillStyle = "rgba(255,255,255,0.26)";
        ctx.font      = `10px ${MONO}`;
        ctx.fillText("space / ↑  to flap  ·  esc  to exit", W / 2, H / 2 + 10);
      }

      // — Dead overlay —
      if (gstate === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.52)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.font      = `12px ${MONO}`;
        ctx.fillText("GAME OVER", W / 2, H / 2 - 20);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font      = `10px ${MONO}`;
        ctx.fillText(`score  ${score}  ·  best  ${hiScore}`, W / 2, H / 2 + 4);
        ctx.fillText("space to retry  ·  esc to exit", W / 2, H / 2 + 22);
      }

      ctx.textAlign = "left";
      raf = requestAnimationFrame(loop);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); }
      if (e.key === "Escape") { e.preventDefault(); onExit(); }
    };

    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [onExit]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "300px" }}
    />
  );
}

/* ── Terminal ─────────────────────────────────────────────────────────────── */

export default function Terminal() {
  const [open, setOpen]         = useState(false);
  const [lines, setLines]       = useState<Line[]>([]);
  const [input, setInput]       = useState("");
  const [history, setHistory]   = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [mode, setMode]         = useState<Mode>({ kind: "normal" });
  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const modeRef   = useRef<Mode>(mode);

  // Keep modeRef in sync so the key handler always reads current mode
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const close = useCallback(() => setOpen(false), []);

  const exitFlappy = useCallback(() => {
    setMode({ kind: "normal" });
    setLines(prev => [...prev, { type: "output", text: "exited flappy bird." }]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Global key handler — backtick opens, Escape closes (unless in flappy)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement).tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === "Escape") {
        // Let FlappyGame handle Escape when it's active
        if (modeRef.current.kind === "flappy") return;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Init banner on first open
  useEffect(() => {
    if (open && lines.length === 0) {
      setLines(BANNER.map(t => ({ type: "output", text: t })));
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  // Reset mode when terminal closes
  useEffect(() => {
    if (!open) setMode({ kind: "normal" });
  }, [open]);

  const submit = () => {
    const raw = input.trim();
    setInput("");
    setHistoryIdx(-1);
    if (!raw) return;

    // Flappy handled here to avoid polluting runCommand
    if (raw === "flappy") {
      setHistory(h => [raw, ...h].slice(0, 50));
      setLines(prev => [...prev, { type: "input", text: raw }]);
      setMode({ kind: "flappy" });
      return;
    }

    setHistory(h => [raw, ...h].slice(0, 50));
    const { lines: out, action } = runCommand(raw);

    if (out[0] === "__clear__") { setLines([]); return; }
    if (out[0] === "__exit__")  { close(); return; }

    setLines(prev => [
      ...prev,
      { type: "input", text: raw },
      ...out.map(t => ({ type: "output" as const, text: t })),
    ]);
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

  const isFlappy = mode.kind === "flappy";

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          onClick={() => setOpen(true)}
          aria-label="Open terminal"
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
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
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.6";
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
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
            onClick={e => { if (e.target === e.currentTarget) close(); }}
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
                {["#ff5f57", "#ffbd2e", "#28c840"].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
                <span style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  marginLeft: 8,
                  letterSpacing: "0.15em",
                }}>
                  {isFlappy ? "loyd@portfolio — flappy bird" : "loyd@portfolio — bash"}
                </span>
                <button
                  onClick={isFlappy ? exitFlappy : close}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    fontFamily: MONO,
                    fontSize: 11,
                  }}
                  aria-label="Close terminal"
                >
                  ✕
                </button>
              </div>

              {/* Output area / Game canvas */}
              {isFlappy ? (
                <FlappyGame onExit={exitFlappy} />
              ) : (
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
                    <div
                      key={i}
                      style={{
                        color: l.type === "input" ? "#7dd3fc" : l.type === "error" ? "#f87171" : "#d4d4d4",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                      }}
                    >
                      {l.type === "input" ? `$ ${l.text}` : l.text}
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}

              {/* Input row — hidden while playing */}
              {!isFlappy && (
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
                    onChange={e => setInput(e.target.value)}
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
