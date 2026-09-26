"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useSpring, useReducedMotion } from "framer-motion";
import { useChatStream } from "@/lib/useChatStream";
import { useFocusTrap } from "@/lib/useFocusTrap";

const SR_ONLY: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function GengarPet() {
  const isClient = useIsClient();
  // Reduced motion: Gengar parks in the corner as a still sprite — no roaming, no Shadow Balls.
  const reduceMotion = useReducedMotion() ?? false;
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [isWalking, setIsWalking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // ── Shadow Ball Projectile State ──
  const [shadowBall, setShadowBall] = useState<{
    id: number;
    stage: "charging" | "flying";
    chargeX: number;
    chargeY: number;
    targetX: number;
    targetY: number;
  } | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [castSpeech, setCastSpeech] = useState<string | null>(null);

  const isCastingRef = useRef(false);
  const lastCastTimeRef = useRef(0); // stamped on mount so the first cast waits its cooldown
  const mousePosRef = useRef<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
  });

  // Track cursor position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Position spring values for natural roaming
  const springConfig = { damping: 22, stiffness: 35, mass: 0.9 };
  const x = useSpring(100, springConfig);
  const y = useSpring(300, springConfig);

  const roamLoopRef = useRef<NodeJS.Timeout | null>(null);
  const walkEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepRoamRef = useRef<() => void>(() => {});
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusToTriggerRef = useRef(false);

  // Chat Streaming Hook
  const { messages, input, setInput, streaming, sendMessage } = useChatStream();

  // Lock body scroll when chat modal is open
  useEffect(() => {
    if (chatOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [chatOpen]);

  // Shoot Shadow Ball directly at user's cursor (3.2s full sequence)
  const shootShadowBall = useCallback(() => {
    if (
      typeof window === "undefined" ||
      reduceMotion ||
      chatOpen ||
      isInteracting ||
      isCastingRef.current
    ) {
      return;
    }

    const curX = x.get();
    const curY = y.get();
    // Instantly freeze spring motion to avoid any lingering drift
    x.jump(curX);
    y.jump(curY);
    setIsWalking(false);

    const targetX = mousePosRef.current.x;
    const targetY = mousePosRef.current.y;

    // Face the target cursor
    const facingDir = targetX > curX + 38 ? 1 : -1;
    setDirection(facingDir);
    isCastingRef.current = true;
    setIsCasting(true);
    lastCastTimeRef.current = Date.now();

    // Pause roaming while casting the 3.2s attack
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    if (walkEndTimerRef.current) clearTimeout(walkEndTimerRef.current);

    const phrases = [
      "Shadow Ball! 🔮",
      "Take this! 👻",
      "Boo! 😈",
      "Ehehehe! 🔮",
      "Shadow Ball! ⚡",
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setCastSpeech(phrase);

    // Position of charging ball right beside Gengar's hands
    const chargeX = curX + (facingDir === 1 ? 56 : 20);
    const chargeY = curY + 24;
    const ballId = Date.now();

    // ── Phase 1: 0ms - 1000ms (1.0s) Charging beside Gengar (Frames 0-4) ──
    setShadowBall({
      id: ballId,
      stage: "charging",
      chargeX,
      chargeY,
      targetX,
      targetY,
    });

    const CHARGE_DELAY = 1000;
    const TRAVEL_TIME = 1400;
    const DISAPPEAR_TIME = 800;

    // ── Phase 2: 1000ms - 2400ms (1.4s) Flying to cursor (Frames 5-11) ──
    setTimeout(() => {
      if (chatOpen) {
        setShadowBall(null);
        setIsCasting(false);
        isCastingRef.current = false;
        setCastSpeech(null);
        return;
      }

      const freshTargetX = mousePosRef.current.x;
      const freshTargetY = mousePosRef.current.y;

      setShadowBall({
        id: ballId,
        stage: "flying",
        chargeX,
        chargeY,
        targetX: freshTargetX,
        targetY: freshTargetY,
      });

      // ── Phase 3: 2400ms - 3200ms (0.8s) Impact & Disappearance at cursor (Frames 12-15) ──
      setTimeout(() => {
        // Attack completes at 3200ms
        setTimeout(() => {
          setShadowBall(null);
          setIsCasting(false);
          isCastingRef.current = false;
          setCastSpeech(null);
          // Resume roaming after attack
          if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
          roamLoopRef.current = setTimeout(() => stepRoamRef.current(), 1200);
        }, DISAPPEAR_TIME);
      }, TRAVEL_TIME);
    }, CHARGE_DELAY);
  }, [chatOpen, isInteracting, reduceMotion, x, y]);

  // Periodic Shadow Ball firing routine (autonomous ambush)
  useEffect(() => {
    if (reduceMotion) return;
    const shootInterval = setInterval(() => {
      if (chatOpen || isInteracting || isCastingRef.current) return;
      if (Date.now() - lastCastTimeRef.current < 12000) return;

      if (Math.random() < 0.5) {
        shootShadowBall();
      }
    }, 6000);

    return () => clearInterval(shootInterval);
  }, [chatOpen, isInteracting, reduceMotion, shootShadowBall]);

  // Walk or float to a new coordinate on screen
  const walkToSpot = useCallback((targetX: number, targetY: number, travelDurationMs: number) => {
    if (chatOpen || isCastingRef.current) return;

    const currentX = x.get();
    if (targetX > currentX + 15) {
      setDirection(1);
    } else if (targetX < currentX - 15) {
      setDirection(-1);
    }

    setIsWalking(true);
    x.set(targetX);
    y.set(targetY);

    if (walkEndTimerRef.current) clearTimeout(walkEndTimerRef.current);
    walkEndTimerRef.current = setTimeout(() => {
      setIsWalking(false);
    }, Math.max(800, travelDurationMs - 200));
  }, [x, y, chatOpen]);

  // Main active roaming AI
  const stepRoam = useCallback(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined" || isInteracting || isHovered || chatOpen || isCastingRef.current) {
      if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
      roamLoopRef.current = setTimeout(() => stepRoamRef.current(), 1500);
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const minX = 40;
    const maxX = Math.max(minX, width - 110);
    const minY = 100;
    const maxY = Math.max(minY, height - 120);

    const currentX = x.get();
    const currentY = y.get();

    const mode = Math.random();
    let nextX = currentX;
    let nextY = currentY;

    if (mode < 0.45) {
      // Horizontal walk
      const step = (160 + Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
      nextX = Math.min(maxX, Math.max(minX, currentX + step));
      nextY = Math.min(maxY, Math.max(minY, currentY + (Math.random() * 60 - 30)));
    } else if (mode < 0.8) {
      // Diagonal wander
      nextX = minX + Math.random() * (maxX - minX);
      nextY = minY + Math.random() * (maxY - minY);
    } else {
      // Bottom edge walk
      nextX = minX + Math.random() * (maxX - minX);
      nextY = maxY - Math.random() * 60;
    }

    const dist = Math.hypot(nextX - currentX, nextY - currentY);
    const travelTime = Math.max(1200, (dist / 160) * 1000);

    walkToSpot(nextX, nextY, travelTime);

    // Occasional sneak attack upon arrival
    if (Math.random() < 0.35 && Date.now() - lastCastTimeRef.current > 14000) {
      setTimeout(() => {
        if (!chatOpen && !isInteracting && !isCastingRef.current) {
          shootShadowBall();
        }
      }, travelTime + 300);
    }

    const pauseTime = 1200 + Math.random() * 1200;
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    roamLoopRef.current = setTimeout(() => stepRoamRef.current(), travelTime + pauseTime);
  }, [x, y, isInteracting, isHovered, chatOpen, reduceMotion, walkToSpot, shootShadowBall]);

  useEffect(() => {
    stepRoamRef.current = stepRoam;
  }, [stepRoam]);

  useEffect(() => {
    lastCastTimeRef.current = Date.now();
    if (typeof window !== "undefined") {
      const initialX = Math.max(60, window.innerWidth - 150);
      const initialY = Math.max(140, window.innerHeight - 200);
      x.set(initialX);
      y.set(initialY);
    }

    // Reduced motion: stay parked at the starting corner.
    if (reduceMotion) return;

    const initialTimer = setTimeout(() => stepRoamRef.current(), 1000);

    return () => {
      clearTimeout(initialTimer);
      if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
      if (walkEndTimerRef.current) clearTimeout(walkEndTimerRef.current);
    };
  }, [x, y, reduceMotion]);

  // Trap focus in the chat dialog and start on the input. The trigger unmounts while
  // the dialog is open, so focus is returned to it manually via returnFocusToTriggerRef.
  useFocusTrap(dialogRef, chatOpen, { initialFocusRef: inputRef, restoreFocus: false });

  const handleCloseChat = useCallback(() => {
    returnFocusToTriggerRef.current = true;
    setChatOpen(false);
    if (reduceMotion) return;
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    roamLoopRef.current = setTimeout(() => stepRoamRef.current(), 1000);
  }, [reduceMotion]);

  // Close on Escape key
  useEffect(() => {
    if (!chatOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseChat();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chatOpen, handleCloseChat]);

  // Re-focus the trigger when it remounts after the dialog closes
  const triggerRefCallback = useCallback((el: HTMLButtonElement | null) => {
    if (el && returnFocusToTriggerRef.current) {
      returnFocusToTriggerRef.current = false;
      el.focus({ preventScroll: true });
    }
  }, []);

  const handleGengarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chatOpen) {
      setChatOpen(true);
      setIsWalking(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input);
  };

  if (!isClient) return null;

  // Get latest assistant response & user query
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const currentDialogue = lastAssistantMessage?.content || "*materializes from the shadows* Boo! What do you want to know about my trainer Loyd, mortal?";
  // Announced once per reply (not per streamed token) via the polite live region.
  const announcement = streaming ? "Gengar is replying…" : lastAssistantMessage?.content ?? "";
  const gengarSprite = reduceMotion ? "/gengar-still.png" : "/gengar.gif";

  return (
    <>
      {/* ── 1. Roaming Gengar Pet (Visible when Chat is Closed) ── */}
      <AnimatePresence>
        {!chatOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 10045,
              overflow: "hidden",
            }}
          >
            <motion.button
              ref={triggerRefCallback}
              type="button"
              className="gengar-trigger"
              aria-label="Chat with Gengar, Loyd's AI assistant"
              aria-haspopup="dialog"
              aria-expanded={chatOpen}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onDragStart={() => {
                setIsInteracting(true);
              }}
              onDragEnd={(_e, info) => {
                setIsInteracting(false);
                x.set(x.get() + info.offset.x);
                y.set(y.get() + info.offset.y);
                if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
                roamLoopRef.current = setTimeout(() => stepRoamRef.current(), 1500);
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                x,
                y,
                width: 76,
                height: 76,
                padding: 0,
                background: "none",
                border: "none",
                borderRadius: 20,
                color: "inherit",
                pointerEvents: "auto",
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.94, cursor: "grabbing" }}
              onMouseEnter={() => {
                setIsHovered(true);
              }}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleGengarClick}
            >
              {/* Dynamic Ground Oval Shadow */}
              <motion.span
                aria-hidden="true"
                animate={
                  reduceMotion
                    ? { scaleX: 1, scaleY: 1, opacity: 0.55 }
                    : {
                        scaleX: isWalking ? [1, 0.84, 1, 0.84, 1] : [1, 0.88, 1],
                        scaleY: isWalking ? [1, 0.84, 1, 0.84, 1] : [1, 0.88, 1],
                        opacity: isWalking ? [0.65, 0.38, 0.65, 0.38, 0.65] : [0.6, 0.42, 0.6],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: isWalking ? 0.6 : 2.2, repeat: Infinity, ease: "easeInOut" }
                }
                style={{
                  display: "block",
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                  width: 52,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.62) 0%, rgba(30, 8, 44, 0.38) 50%, rgba(0, 0, 0, 0) 75%)",
                  pointerEvents: "none",
                  zIndex: 0,
                  filter: "blur(1px)",
                }}
              />

              {/* Walking Waddle / Ghost Bobbing / Attack Stance */}
              <motion.span
                animate={
                  reduceMotion
                    ? { y: 0, rotate: 0, scale: 1 }
                    : {
                        y: isCasting ? 0 : isWalking ? [0, -6, 0, -6, 0] : [0, -4, 0],
                        rotate: isCasting ? 0 : isWalking ? [-6, 6, -6, 6, 0] : [0, -2, 2, 0],
                        scale: 1,
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: isWalking ? 0.6 : 2.2, repeat: Infinity, ease: "easeInOut" }
                }
                style={{
                  display: "block",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transform: `scaleX(${direction})`,
                  transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 1,
                }}
              >
                <Image
                  src={gengarSprite}
                  alt=""
                  width={76}
                  height={76}
                  priority
                  unoptimized
                  draggable={false}
                  style={{
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                />
              </motion.span>

              {/* Cast Speech / Battle Cry (decorative) */}
              {castSpeech && !isHovered && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    display: "block",
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    width: "max-content",
                    background: "rgba(32, 10, 48, 0.95)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(192, 132, 252, 0.45)",
                    color: "#f3e8ff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    boxShadow: "0 4px 18px rgba(147, 51, 234, 0.5)",
                    zIndex: 12,
                  }}
                >
                  {castSpeech}
                </motion.span>
              )}

              {/* Hover / focus hint (the button's aria-label carries the same meaning) */}
              {isHovered && !castSpeech && (
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: -6, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "block",
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    right: 0,
                    margin: "0 auto",
                    width: "max-content",
                    background: "rgba(18, 18, 22, 0.92)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: "10.5px",
                    letterSpacing: "0.06em",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
                    zIndex: 10,
                  }}
                >
                  Talk with Gengar 💬
                </motion.span>
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* ── 2. Full 3.2s Synchronized Shadow Ball GIF (1.0s Charge + 1.4s Travel + 0.8s Impact) ── */}
      <AnimatePresence>
        {shadowBall && (
          <motion.div
            key={shadowBall.id}
            initial={{
              x: shadowBall.chargeX - 38,
              y: shadowBall.chargeY - 38,
              opacity: 1,
            }}
            animate={
              shadowBall.stage === "charging"
                ? {
                    x: shadowBall.chargeX - 38,
                    y: shadowBall.chargeY - 38,
                    opacity: 1,
                  }
                : {
                    x: shadowBall.targetX - 38,
                    y: shadowBall.targetY - 38,
                    opacity: 1,
                  }
            }
            transition={
              shadowBall.stage === "flying"
                ? { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }
                : { duration: 0.1 }
            }
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 76,
              height: 76,
              pointerEvents: "none",
              zIndex: 10050,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/Shadowball.gif?t=${shadowBall.id}`}
              alt=""
              aria-hidden="true"
              width={76}
              height={76}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. SUMMONED GIANT GENGAR & FULLSCREEN DIALOGUE (PORTAL TO BODY) ── */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {chatOpen && (
              <>
                {/* 100% Fullscreen Dark Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={handleCloseChat}
                  aria-hidden="true"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100vw",
                    height: "100vh",
                    minHeight: "100dvh",
                    background: "rgba(8, 8, 12, 0.96)",
                    backdropFilter: "blur(32px) saturate(180%)",
                    WebkitBackdropFilter: "blur(32px) saturate(180%)",
                    zIndex: 999998,
                  }}
                />

                {/* Floating Content Stage — the dialog */}
                <div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="gengar-chat-title"
                  aria-describedby="gengar-chat-dialogue"
                  tabIndex={-1}
                  className="gengar-dialog"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100vw",
                    height: "100vh",
                    minHeight: "100dvh",
                    zIndex: 999999,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "24px 16px 0",
                    pointerEvents: "none",
                  }}
                >
                  <h2 id="gengar-chat-title" style={SR_ONLY}>
                    Chat with Gengar, Loyd&apos;s AI assistant
                  </h2>
                  <p role="status" aria-live="polite" style={SR_ONLY}>
                    {announcement}
                  </p>

                  <button
                    type="button"
                    onClick={handleCloseChat}
                    aria-label="Close chat"
                    className="gengar-close"
                  >
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                    <span className="gengar-close-hint">esc</span>
                  </button>

                  {/* ── PURE FLOATING TEXT DIALOGUE ── */}
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "relative",
                      zIndex: 30,
                      width: "min(640px, calc(100vw - 32px))",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left",
                      marginBottom: "clamp(24px, 4vh, 44px)",
                      pointerEvents: "auto",
                    }}
                  >
                    {/* Previous user question context (if any) */}
                    {lastUserMessage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                          color: "rgba(255, 255, 255, 0.6)",
                          marginBottom: "10px",
                          textAlign: "left",
                        }}
                      >
                        <span aria-hidden="true">&gt; </span>
                        <span style={SR_ONLY}>You asked: </span>
                        {lastUserMessage.content}
                      </motion.div>
                    )}

                    {/* Floating Gengar Speech Text (Left-aligned) */}
                    <div
                      id="gengar-chat-dialogue"
                      aria-busy={streaming}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "clamp(16px, 2.4vw, 23px)",
                        fontWeight: 500,
                        lineHeight: 1.55,
                        color: "#ffffff",
                        textShadow: "0 2px 20px rgba(0, 0, 0, 0.8)",
                        letterSpacing: "-0.015em",
                        maxWidth: "600px",
                        minHeight: "44px",
                        marginBottom: "24px",
                        textAlign: "left",
                      }}
                    >
                      {currentDialogue}
                      {streaming && (
                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-block",
                            width: "2px",
                            height: "1.1em",
                            background: "#fff",
                            marginLeft: "6px",
                            verticalAlign: "middle",
                            animation: "blink 0.8s infinite",
                          }}
                        />
                      )}
                    </div>

                    {/* ── SEAMLESS USER INPUT LINE WITH BLINKING CARET ── */}
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "440px",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div className="gengar-input-line">
                        <span
                          aria-hidden="true"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "15px",
                            color: "rgba(255, 255, 255, 0.45)",
                            marginRight: "8px",
                            userSelect: "none",
                          }}
                        >
                          &gt;
                        </span>
                        <input
                          ref={inputRef}
                          type="text"
                          className="gengar-input"
                          aria-label="Ask Gengar about Loyd"
                          autoComplete="off"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder={streaming ? "Gengar is speaking..." : "ask something and hit enter..."}
                          // readOnly (not disabled) so keyboard focus stays in the field while Gengar replies
                          readOnly={streaming}
                          aria-busy={streaming}
                        />
                        {input.trim() && !streaming && (
                          <button
                            type="button"
                            onClick={handleSend}
                            aria-label="Send message"
                            className="gengar-send"
                          >
                            [ENTER ↵]
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* ── GIANT GENGAR (CENTERED AT BOTTOM) ── */}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      zIndex: 20,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    <motion.div
                      initial={{ y: 200, opacity: 0 }}
                      animate={{
                        y: streaming ? [-12, 0, -12, 0] : 0,
                        opacity: 1,
                        rotate: streaming ? [-1.5, 1.5, -1.5, 1.5, 0] : [0, -0.6, 0.6, 0],
                      }}
                      exit={{ y: 200, opacity: 0 }}
                      transition={{
                        y: { duration: streaming ? 0.6 : 0.4, ease: "easeOut" },
                        rotate: { duration: streaming ? 0.6 : 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.25 },
                      }}
                      style={{
                        position: "relative",
                        width: "min(580px, 92vw)",
                        height: "auto",
                        aspectRatio: "1 / 1",
                        marginBottom: "clamp(-90px, -12vw, 0px)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      {/* Giant Gengar Oval Ground Shadow / Base Glow */}
                      <motion.div
                        animate={
                          reduceMotion
                            ? { scaleX: 1, opacity: 0.65 }
                            : {
                                scaleX: streaming ? [1, 0.9, 1, 0.9, 1] : [1, 0.96, 1],
                                opacity: streaming ? [0.75, 0.5, 0.75, 0.5, 0.75] : [0.7, 0.55, 0.7],
                              }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: streaming ? 0.6 : 4, repeat: Infinity, ease: "easeInOut" }
                        }
                        style={{
                          position: "absolute",
                          bottom: "clamp(25px, 6vw, 55px)",
                          left: 0,
                          right: 0,
                          margin: "0 auto",
                          width: "72%",
                          height: "18%",
                          borderRadius: "50%",
                          background:
                            "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.8) 0%, rgba(30, 8, 45, 0.45) 50%, rgba(0, 0, 0, 0) 75%)",
                          filter: "blur(6px)",
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                      />
                      <Image
                        src={gengarSprite}
                        alt=""
                        aria-hidden="true"
                        width={580}
                        height={580}
                        priority
                        unoptimized
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          filter: "none",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
