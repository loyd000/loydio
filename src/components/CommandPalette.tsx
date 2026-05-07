"use client";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";
const EMAIL = "deguzman.johnlloyd12@gmail.com";

type CommandItem = {
  id: string;
  label: string;
  category: string;
  keywords: string;
  action: () => void;
  icon?: string;
};

function getCommands(toggleTheme: () => void): CommandItem[] {
  const scrollTo = (id: string) => () => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return [
    // Navigation
    { id: "nav-hero",        label: "Go to Home",        category: "Navigate", keywords: "home top hero",         icon: "↑", action: scrollTo("hero") },
    { id: "nav-about",       label: "Go to About",       category: "Navigate", keywords: "about me bio",          icon: "◈", action: scrollTo("about") },
    { id: "nav-experience",  label: "Go to Experience",  category: "Navigate", keywords: "experience work jobs",  icon: "◈", action: scrollTo("experience") },
    { id: "nav-stack",       label: "Go to Tech Stack",  category: "Navigate", keywords: "stack tech skills",     icon: "◈", action: scrollTo("stack") },
    { id: "nav-credentials", label: "Go to Credentials", category: "Navigate", keywords: "credentials certs",     icon: "◈", action: scrollTo("credentials") },
    { id: "nav-projects",    label: "Go to Projects",    category: "Navigate", keywords: "projects work portfolio",icon: "◈", action: scrollTo("projects") },
    { id: "nav-social",      label: "Go to Social",      category: "Navigate", keywords: "social links github",   icon: "◈", action: scrollTo("social") },
    { id: "nav-contact",     label: "Go to Contact",     category: "Navigate", keywords: "contact email",         icon: "◈", action: scrollTo("contact") },

    // Actions
    { id: "act-theme",    label: "Toggle Theme",      category: "Actions", keywords: "theme dark light mode",  icon: "◑", action: toggleTheme },
    {
      id: "act-copy",
      label: "Copy Email",
      category: "Actions",
      keywords: "copy email clipboard",
      icon: "⌘",
      action: () => { navigator.clipboard.writeText(EMAIL).catch(() => {}); },
    },
    {
      id: "act-resume",
      label: "Download Resume",
      category: "Actions",
      keywords: "resume cv download",
      icon: "↓",
      action: () => {
        const a = document.createElement("a");
        a.href = "/RESUME_DE GUZMAN.pdf";
        a.download = "RESUME_DE GUZMAN.pdf";
        a.click();
      },
    },

    // Socials
    { id: "soc-github",   label: "GitHub",   category: "Socials", keywords: "github code repos",   icon: "↗", action: () => window.open("https://github.com/lloydio", "_blank") },
    { id: "soc-linkedin", label: "LinkedIn", category: "Socials", keywords: "linkedin profile",    icon: "↗", action: () => window.open("https://linkedin.com/in/john-lloyd-de-guzman", "_blank") },
  ];
}

function fuzzyMatch(query: string, target: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleTheme = useCallback(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", html.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }, []);

  const commands = useMemo(() => getCommands(toggleTheme), [toggleTheme]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.trim();
    return commands.filter((c) =>
      fuzzyMatch(q, c.label) || fuzzyMatch(q, c.keywords) || fuzzyMatch(q, c.category)
    );
  }, [query, commands]);

  // Group filtered by category
  const grouped = useMemo(() => {
    const map: Record<string, CommandItem[]> = {};
    for (const c of filtered) {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    }
    return map;
  }, [filtered]);

  // Flattened ordered list for keyboard nav
  const flat = useMemo(() => filtered, [filtered]);

  useEffect(() => { setSelected(0); }, [query]);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const close = () => setOpen(false);

  const execute = (cmd: CommandItem) => {
    if (cmd.id === "act-copy") {
      navigator.clipboard.writeText(EMAIL).then(() => {
        setCopied(true);
        if (copyTimeout.current) clearTimeout(copyTimeout.current);
        copyTimeout.current = setTimeout(() => setCopied(false), 1800);
      }).catch(() => {});
    } else {
      cmd.action();
    }
    close();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected((i) => Math.min(i + 1, flat.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelected((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") {
      const cmd = flat[selected];
      if (cmd) execute(cmd);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${selected}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9100,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "12vh",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              width: "min(600px, 92vw)",
              background: "var(--bg)",
              border: "1px solid var(--border-heavy)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "70vh",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={handleKey}
          >
            {/* Search row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontFamily: MONO, fontSize: 12, opacity: 0.35 }}>⌘K</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                spellCheck={false}
                aria-label="Search commands"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: MONO,
                  fontSize: 13,
                  color: "var(--fg)",
                }}
              />
              <kbd style={{
                fontFamily: MONO,
                fontSize: 9,
                padding: "3px 7px",
                border: "1px solid var(--border-strong)",
                color: "var(--fg)",
                opacity: 0.4,
                letterSpacing: "0.1em",
              }}>ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ overflowY: "auto", flex: 1 }}>
              {flat.length === 0 ? (
                <div style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  opacity: 0.35,
                  padding: "2rem",
                  textAlign: "center",
                  letterSpacing: "0.15em",
                }}>
                  NO RESULTS
                </div>
              ) : (
                Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      opacity: 0.3,
                      padding: "10px 18px 4px",
                    }}>
                      {cat}
                    </div>
                    {items.map((cmd) => {
                      const idx = globalIdx++;
                      const isActive = selected === idx;
                      return (
                        <div
                          key={cmd.id}
                          data-idx={idx}
                          onClick={() => execute(cmd)}
                          onMouseEnter={() => setSelected(idx)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "11px 18px",
                            cursor: "pointer",
                            background: isActive ? "var(--subtle-bg)" : "transparent",
                            borderLeft: isActive ? "2px solid var(--fg)" : "2px solid transparent",
                            transition: "background 0.1s ease",
                          }}
                        >
                          <span style={{ fontFamily: MONO, fontSize: 13, opacity: 0.45, width: 16, textAlign: "center", flexShrink: 0 }}>
                            {cmd.icon}
                          </span>
                          <span style={{ fontFamily: MONO, fontSize: 12, flex: 1 }}>
                            {cmd.id === "act-copy" && copied ? "✓ Copied!" : cmd.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              display: "flex",
              gap: 16,
              padding: "8px 18px",
              borderTop: "1px solid var(--border)",
              fontFamily: MONO,
              fontSize: 9,
              opacity: 0.3,
              letterSpacing: "0.12em",
            }}>
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
