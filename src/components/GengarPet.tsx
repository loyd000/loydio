"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
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

  // Walk or float to a new coordinate on screen
  const walkToSpot = useCallback((targetX: number, targetY: number, travelDurationMs: number) => {
    if (chatOpen) return;

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
    if (typeof window === "undefined" || isInteracting || isHovered || chatOpen) {
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

    const pauseTime = 1200 + Math.random() * 1200;
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    roamLoopRef.current = setTimeout(() => stepRoamRef.current(), travelTime + pauseTime);
  }, [x, y, isInteracting, isHovered, chatOpen, walkToSpot]);

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
              {/* Walking Waddle / Ghost Bobbing */}
              <motion.div
                animate={{
                  y: isWalking ? [0, -6, 0, -6, 0] : [0, -4, 0],
                  rotate: isWalking ? [-6, 6, -6, 6, 0] : [0, -2, 2, 0],
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
                    filter: "none",
                  }}
                />
              </motion.div>

              {/* Hover Tooltip Hint */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: -6, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
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

      {/* ── 2. SUMMONED GIANT GENGAR & LEFT-ALIGNED FLOATING TEXT ── */}
      <AnimatePresence>
        {chatOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              height: "100dvh",
              zIndex: 999999,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "24px 16px 0",
            }}
          >
            {/* 100% Solid Dark Blur Fullscreen Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={handleCloseChat}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                background: "rgba(10, 10, 14, 0.94)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                zIndex: 1,
              }}
            />

            {/* ── PURE FLOATING TEXT DIALOGUE (UPPER/CENTER, LEFT-ALIGNED INTERNALLY) ── */}
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

            {/* ── GIANT GENGAR (FLEXBOX CENTERED, LEGS SUBMERGED BELOW) ── */}
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
                  width: "min(580px, 92vw)",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  marginBottom: "clamp(-90px, -12vw, 0px)", // Raised higher on screen
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
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
                  }}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
