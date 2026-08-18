"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { sound } from "@/lib/sound";
import { useChatStream } from "@/lib/useChatStream";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function GengarPet() {
  const isClient = useIsClient();
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
  const lastCastTimeRef = useRef(Date.now());
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

  // Play Gengar cry sound (or fallback to synth pop)
  const playGengarSound = useCallback(() => {
    if (sound.getIsMuted()) return;
    try {
      const audio = new Audio("/gengar.mp3");
      audio.volume = 0.75;
      audio.play().catch(() => {
        sound.play("morph");
      });
    } catch {
      sound.play("morph");
    }
  }, []);

  // Shoot Shadow Ball directly at user's cursor (3.2s full sequence)
  const shootShadowBall = useCallback(() => {
    if (
      typeof window === "undefined" ||
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

    // Play Gengar cry sound when starting the attack!
    playGengarSound();

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
        sound.play("shadowballImpact");

        // Attack completes at 3200ms
        setTimeout(() => {
          setShadowBall(null);
          setIsCasting(false);
          isCastingRef.current = false;
          setCastSpeech(null);
          // Resume roaming after attack
          if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
          roamLoopRef.current = setTimeout(stepRoam, 1200);
        }, DISAPPEAR_TIME);
      }, TRAVEL_TIME);
    }, CHARGE_DELAY);
  }, [chatOpen, isInteracting, x, y]);

  // Periodic Shadow Ball firing routine (autonomous ambush)
  useEffect(() => {
    const shootInterval = setInterval(() => {
      if (chatOpen || isInteracting || isCastingRef.current) return;
      if (Date.now() - lastCastTimeRef.current < 12000) return;

      if (Math.random() < 0.5) {
        shootShadowBall();
      }
    }, 6000);

    return () => clearInterval(shootInterval);
  }, [chatOpen, isInteracting, shootShadowBall]);

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
  }, [x, y, isInteracting, isHovered, chatOpen, walkToSpot, shootShadowBall]);

  useEffect(() => {
    stepRoamRef.current = stepRoam;
  }, [stepRoam]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const initialX = Math.max(60, window.innerWidth - 150);
      const initialY = Math.max(140, window.innerHeight - 200);
      x.set(initialX);
      y.set(initialY);
    }

    const initialTimer = setTimeout(() => stepRoamRef.current(), 1000);

    return () => {
      clearTimeout(initialTimer);
      if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
      if (walkEndTimerRef.current) clearTimeout(walkEndTimerRef.current);
    };
  }, [x, y]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [chatOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!chatOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sound.play("close");
        setChatOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chatOpen]);

  const handleGengarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chatOpen) {
      playGengarSound();
      setChatOpen(true);
      setIsWalking(false);
    }
  };

  const handleCloseChat = () => {
    sound.play("close");
    setChatOpen(false);
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    roamLoopRef.current = setTimeout(stepRoam, 1000);
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sound.play("messageSend");
    sendMessage(input);
  };

  if (!isClient) return null;

  // Get latest assistant response & user query
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant");
  const currentDialogue = lastAssistantMessage?.content || "*materializes from the shadows* Boo! What do you want to know about my trainer Loyd, mortal?";

  return (
    <>
      {/* ── 1. Roaming Gengar Pet (Visible when Chat is Closed) ── */}
      <AnimatePresence>
        {!chatOpen && (
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 10045,
              overflow: "hidden",
            }}
          >
            <motion.div
              drag
              dragMomentum={false}
              dragElastic={0.1}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onDragStart={() => {
                setIsInteracting(true);
                sound.play("hover");
              }}
              onDragEnd={(_e, info) => {
                setIsInteracting(false);
                x.set(x.get() + info.offset.x);
                y.set(y.get() + info.offset.y);
                if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
                roamLoopRef.current = setTimeout(stepRoam, 1500);
              }}
              style={{
                position: "absolute",
                x,
                y,
                width: 76,
                height: 76,
                pointerEvents: "auto",
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.94, cursor: "grabbing" }}
              onMouseEnter={() => {
                setIsHovered(true);
                sound.play("hover");
              }}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleGengarClick}
            >
              {/* Dynamic Ground Oval Shadow */}
              <motion.div
                animate={{
                  scaleX: isWalking ? [1, 0.84, 1, 0.84, 1] : [1, 0.88, 1],
                  scaleY: isWalking ? [1, 0.84, 1, 0.84, 1] : [1, 0.88, 1],
                  opacity: isWalking ? [0.65, 0.38, 0.65, 0.38, 0.65] : [0.6, 0.42, 0.6],
                }}
                transition={{
                  duration: isWalking ? 0.6 : 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
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
              <motion.div
                animate={{
                  y: isCasting ? 0 : isWalking ? [0, -6, 0, -6, 0] : [0, -4, 0],
                  rotate: isCasting ? 0 : isWalking ? [-6, 6, -6, 6, 0] : [0, -2, 2, 0],
                  scale: 1,
                }}
                transition={{
                  duration: isWalking ? 0.6 : 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transform: `scaleX(${direction})`,
                  transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/gengar.gif"
                  alt="Gengar AI Companion"
                  width={76}
                  height={76}
                  priority
                  unoptimized
                  style={{
                    objectFit: "contain",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>

              {/* Cast Speech / Battle Cry */}
              {castSpeech && !isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.8 }}
                  animate={{ opacity: 1, y: -8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
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
                </motion.div>
              )}

              {/* Hover Tooltip Hint */}
              {isHovered && !castSpeech && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: -6, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
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
                </motion.div>
              )}
            </motion.div>
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
              alt="Gengar Shadow Ball"
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

                {/* Floating Content Stage */}
                <div
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
                        animate={{ opacity: 0.55 }}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                          color: "rgba(255, 255, 255, 0.7)",
                          marginBottom: "10px",
                          textAlign: "left",
                        }}
                      >
                        &gt; {lastUserMessage.content}
                      </motion.div>
                    )}

                    {/* Floating Gengar Speech Text (Left-aligned) */}
                    <div
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
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1.5px solid rgba(255, 255, 255, 0.22)",
                          padding: "6px 0",
                          transition: "border-color 0.2s ease",
                        }}
                      >
                        <span
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
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder={streaming ? "Gengar is speaking..." : "ask something and hit enter..."}
                          disabled={streaming}
                          style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontFamily: "var(--font-mono)",
                            outline: "none",
                            caretColor: "#ffffff",
                          }}
                        />
                        {input.trim() && !streaming && (
                          <button
                            onClick={handleSend}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#fff",
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              cursor: "pointer",
                              padding: "2px 6px",
                              opacity: 0.8,
                            }}
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
                        animate={{
                          scaleX: streaming ? [1, 0.9, 1, 0.9, 1] : [1, 0.96, 1],
                          opacity: streaming ? [0.75, 0.5, 0.75, 0.5, 0.75] : [0.7, 0.55, 0.7],
                        }}
                        transition={{
                          duration: streaming ? 0.6 : 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
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
                        src="/gengar.gif"
                        alt="Giant Looming Gengar"
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
