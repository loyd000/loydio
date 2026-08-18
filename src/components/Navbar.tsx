"use client";
import { useEffect, useRef, useState, useCallback, KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import VisitCounter from "./VisitCounter";
import { useChatStream } from "@/lib/useChatStream";
import { sound } from "@/lib/sound";

const links = [
  { label: "About",    href: "#about",    route: false },
  { label: "Projects", href: "/projects", route: true  },
  { label: "Contact",  href: "#contact",  route: false },
];

const SUGGESTIONS = [
  "What's your tech stack?",
  "Tell me about your projects",
  "How can I contact you?",
  "What makes you unique?",
];

const THINKING_WORDS = [
  "Flibbertigibbeting",
  "Discombobulating",
  "Combobulating",
  "Noodling",
  "Wrangling",
  "Herding",
];

function ThinkingIndicator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * THINKING_WORDS.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % THINKING_WORDS.length);
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="chat-thinking" aria-label="Thinking...">
      <svg
        className="chat-thinking-star"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <span className="chat-thinking-text">{THINKING_WORDS[index]}...</span>
    </div>
  );
}

const LONG_PRESS_MS = 600;

export default function Navbar() {
  const pathname = usePathname();
  const isProjectsRoute = pathname === "/projects";
  const [activeSection, setActiveSection] = useState("");
  const [scrolled,      setScrolled]      = useState(false);
  const [chatOpen,      setChatOpen]      = useState(false);
  const [isClosing,     setIsClosing]     = useState(false);
  const [holding,       setHolding]       = useState(false);
  const [showHint,      setShowHint]      = useState(false);

  const effectiveActiveSection = isProjectsRoute ? "projects" : activeSection;
  const effectiveScrolled = isProjectsRoute ? true : scrolled;
  const effectiveShowHint = showHint && !chatOpen && !holding;

  const holdTimer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldSucceed = useRef(false);
  const holdStartTime  = useRef(0);
  const messagesEnd    = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLTextAreaElement>(null);
  const navRef         = useRef<HTMLElement>(null);

  const { messages, input, setInput, streaming, sendMessage, reset } = useChatStream();

  // ── Global Interactive Sound Listeners ────────────────────────────────
  useEffect(() => {
    sound.initGlobalListeners();
  }, []);

  // ── Idle Detection (shows after 2s stillness; on movement, fades after 2s) ──
  useEffect(() => {
    if (chatOpen || holding) {
      return;
    }

    let hideTimeout: ReturnType<typeof setTimeout> | null = null;
    let idleTimeout: ReturnType<typeof setTimeout> | null = null;

    const onActivity = () => {
      if (!hideTimeout) {
        hideTimeout = setTimeout(() => {
          setShowHint(false);
          hideTimeout = null;
        }, 2000);
      }

      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        if (!chatOpen && !holding) {
          setShowHint(true);
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
        }
      }, 2000);
    };

    const events = ["mousemove", "scroll", "touchstart", "touchmove", "keydown", "click"];
    events.forEach((evt) => window.addEventListener(evt, onActivity, { passive: true }));

    idleTimeout = setTimeout(() => {
      if (!chatOpen && !holding) {
        setShowHint(true);
      }
    }, 2000);

    return () => {
      if (idleTimeout) clearTimeout(idleTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
      events.forEach((evt) => window.removeEventListener(evt, onActivity));
    };
  }, [chatOpen, holding]);

  // ── Scroll tracking ──────────────────────────────────────────────────
  useEffect(() => {
    if (isProjectsRoute) {
      return;
    }
    const allSections = ["about", "credentials", "projects", "social", "contact"];
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let current = "";
      allSections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) current = id;
        }
      });
      if (current) {
        if (["about", "credentials"].includes(current)) setActiveSection("about");
        else if (["projects", "social"].includes(current)) setActiveSection("projects");
        else if (current === "contact") setActiveSection("contact");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProjectsRoute]);

  // ── Auto-scroll messages ──────────────────────────────────────────────
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when chat opens ───────────────────────────────────────
  useEffect(() => {
    if (chatOpen && !isClosing) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [chatOpen, isClosing]);

  // ── Sequential close: fade text first, then shrink navbar ─────────────
  const closeChat = useCallback(() => {
    if (isClosing) return;
    sound.play("close");
    setIsClosing(true);
    setTimeout(() => {
      setChatOpen(false);
      setIsClosing(false);
      reset();
    }, 140);
  }, [isClosing, reset]);

  // ── Close on Escape ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && chatOpen) closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen, closeChat]);

  // ── Close on click outside ────────────────────────────────────────────
  useEffect(() => {
    if (!chatOpen) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeChat();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [chatOpen, closeChat]);

  // ── Long-press handlers ───────────────────────────────────────────────
  const startHold = useCallback((e?: React.SyntheticEvent) => {
    if (chatOpen) return;
    didHoldSucceed.current = false;
    holdStartTime.current = e ? e.timeStamp : 0;
    setHolding(true);
    setShowHint(false);
    holdTimer.current = setTimeout(() => {
      didHoldSucceed.current = true;
      setHolding(false);
      setChatOpen(true);
      sound.play("morph");
    }, LONG_PRESS_MS);
  }, [chatOpen]);

  const cancelHold = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setHolding(false);
  }, []);

  // ── Nav click (Normal click navigates; long-press hold is suppressed) ──
  const handleNavClick = useCallback((
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isRoute: boolean
  ) => {
    // If the user held the navbar to open chat, cancel default link navigation!
    const isHoldTimeout = holdStartTime.current > 0 && e.timeStamp - holdStartTime.current >= LONG_PRESS_MS;
    if (didHoldSucceed.current || isHoldTimeout) {
      e.preventDefault();
      e.stopPropagation();
      didHoldSucceed.current = false;
      return;
    }

    sound.play("click");
    if (isRoute) return;
    e.preventDefault();
    if (pathname !== "/") {
      window.location.assign(`/${href}`);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);

  // ── Send message with sound ───────────────────────────────────────────
  const handleSendMessage = (text: string) => {
    if (!text.trim() || streaming) return;
    sound.play("messageSend");
    sendMessage(text);
  };

  // ── Send on Enter (Shift+Enter = newline) ─────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <>
      {/* LOGO - fixed top-left */}
      <a
        href="#"
        onMouseEnter={() => sound.play("hover")}
        onClick={(e) => {
          e.preventDefault();
          sound.play("click");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Loyd - back to top"
        className="logo-corner"
      >
        <div className="logo-badge backdrop-blur-[12px]">
          <span>L</span>
        </div>
      </a>

      {/*
        CENTERING WRAPPER — fixed full-width flex center.
        The pill sits in the flex center naturally, with layout morph expansion.
      */}
      <div className="pill-nav-wrapper">
        <div className="pill-nav-relative-anchor">
          <motion.nav
            ref={navRef}
            layout
            transition={{
              layout: { type: "spring", stiffness: 280, damping: 24, mass: 0.85 },
            }}
            className={[
              "pill-nav",
              "backdrop-blur-[22px] backdrop-saturate-[1.9]",
              effectiveScrolled && !chatOpen ? "pill-nav-scrolled" : "",
              holding ? "pill-nav-holding" : "",
              chatOpen ? "pill-nav-chat" : "",
            ].filter(Boolean).join(" ")}
            aria-label={chatOpen ? "Chat with Loyd's AI" : "Main navigation"}
            whileHover={!chatOpen && !holding ? { scale: 1.03 } : undefined}
            whileTap={!chatOpen && !holding ? { scale: 0.98 } : undefined}
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
          >
            <AnimatePresence mode="wait" initial={false}>
              {/* ── NAV LINKS (compact state) ───────────────────── */}
              {!chatOpen ? (
                <motion.div
                  key="nav-links"
                  className="pill-nav-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, delay: 0.08 }}
                >
                  {links.map((l) => {
                    const isActive = l.route
                      ? pathname === l.href || pathname.startsWith(l.href + "/")
                      : effectiveActiveSection === l.href.slice(1);
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        onMouseEnter={() => sound.play("hover")}
                        onClick={(e) => handleNavClick(e, l.href, l.route)}
                        className={`pill-link${isActive ? " active" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="pill-indicator"
                            className="pill-active-bg"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="pill-link-label">{l.label}</span>
                      </a>
                    );
                  })}
                  <div className="pill-divider" />
                  <SoundToggle />
                  <ThemeToggle />
                </motion.div>
              ) : (
                /* ── CHAT PANEL (expanded state) ─────────────────── */
                <motion.div
                  key="chat-panel"
                  className="chat-panel-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isClosing ? 0 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: isClosing ? 0.12 : 0.2,
                    delay: isClosing ? 0 : 0.08,
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="chat-header">
                    <div className="chat-header-info">
                      <span className="chat-header-dot" aria-hidden="true" />
                      <span className="chat-header-title">Ask me anything</span>
                    </div>
                    <button
                      className="chat-close-btn"
                      onMouseEnter={() => sound.play("hover")}
                      onClick={closeChat}
                      aria-label="Close chat"
                    >
                      ×
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="chat-messages" role="log" aria-live="polite">
                    {messages.length === 0 && (
                      <motion.div
                        className="chat-empty"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="chat-empty-title">Hey there 👋</p>
                        <p className="chat-empty-sub">
                          Ask me anything about Loyd — his work, skills, or projects.
                        </p>
                        <div className="chat-chips">
                          {SUGGESTIONS.map((s) => (
                            <button
                              key={s}
                              className="chat-chip"
                              onMouseEnter={() => sound.play("hover")}
                              onClick={() => handleSendMessage(s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        className={`chat-bubble ${
                          msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                        }`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {msg.role === "assistant" && msg.content === "" && streaming ? (
                          <ThinkingIndicator />
                        ) : (
                          <>
                            {msg.content}
                            {msg.role === "assistant" &&
                              streaming &&
                              i === messages.length - 1 && (
                                <span className="chat-cursor" aria-hidden="true" />
                              )}
                          </>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEnd} />
                  </div>

                  {/* Input */}
                  <div className="chat-input-row">
                    <textarea
                      ref={inputRef}
                      className="chat-input"
                      placeholder="Ask something..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      disabled={streaming}
                      aria-label="Chat message input"
                    />
                    <button
                      className="chat-send-btn"
                      onMouseEnter={() => sound.play("hover")}
                      onClick={() => handleSendMessage(input)}
                      disabled={streaming || !input.trim()}
                      aria-label="Send message"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>

          {/* ── Idle Floating Hint (text only + monochrome star) ── */}
          <motion.div
            className="nav-hint-floating"
            initial={false}
            animate={{
              opacity: effectiveShowHint ? 1 : 0,
              scale: effectiveShowHint ? 1 : 0.94,
              y: effectiveShowHint ? 0 : 3,
              pointerEvents: "none",
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <svg
              className="nav-hint-sparkle-svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span className="nav-hint-text">hold to chat with me</span>
          </motion.div>
        </div>
      </div>

      {/* VISIT COUNTER - fixed top-right */}
      <div className="visit-counter-corner">
        <VisitCounter />
      </div>
    </>
  );
}
