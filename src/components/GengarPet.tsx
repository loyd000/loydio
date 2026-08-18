"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { sound } from "@/lib/sound";

const QUOTES = [
  "Gengarrr!",
  "Boo! Did I scare you?",
  "Shadow Sneak activated!",
  "Exploring the website...",
  "Watching you code.",
  "Hehehe~",
  "Night Shade!",
  "Spooky vibes only.",
  "Need full-stack magic?",
  "Patrolling the DOM!",
];

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
  const [speech, setSpeech] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Position spring values tuned for a lively, natural walking & floating speed
  const springConfig = { damping: 22, stiffness: 35, mass: 0.9 };
  const x = useSpring(100, springConfig);
  const y = useSpring(300, springConfig);

  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roamLoopRef = useRef<NodeJS.Timeout | null>(null);
  const walkEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepRoamRef = useRef<() => void>(() => {});

  // Walk or float to a new coordinate on screen
  const walkToSpot = useCallback((targetX: number, targetY: number, travelDurationMs: number) => {
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
  }, [x, y]);

  // Main active roaming AI
  const stepRoam = useCallback(() => {
    if (typeof window === "undefined" || isInteracting || isHovered) {
      // Re-check shortly if busy
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

    // Decide walking behavior style:
    // 1. Horizontal patrol along bottom or current level
    // 2. Diagonal wander
    // 3. Exploring a new random quadrant
    const mode = Math.random();

    let nextX = currentX;
    let nextY = currentY;

    if (mode < 0.45) {
      // Walk horizontally across (step size 160px - 360px)
      const step = (160 + Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);
      nextX = Math.min(maxX, Math.max(minX, currentX + step));
      // Subtle vertical wave
      nextY = Math.min(maxY, Math.max(minY, currentY + (Math.random() * 60 - 30)));
    } else if (mode < 0.8) {
      // Wander to a completely new area of the screen
      nextX = minX + Math.random() * (maxX - minX);
      nextY = minY + Math.random() * (maxY - minY);
    } else {
      // Walk down near the bottom edge
      nextX = minX + Math.random() * (maxX - minX);
      nextY = maxY - Math.random() * 60;
    }

    const dist = Math.hypot(nextX - currentX, nextY - currentY);
    // Approximate travel duration (at ~160px/sec)
    const travelTime = Math.max(1200, (dist / 160) * 1000);

    walkToSpot(nextX, nextY, travelTime);

    // After reaching spot, brief pause (1.2s to 2.4s) before walking again
    const pauseTime = 1200 + Math.random() * 1200;
    if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
    roamLoopRef.current = setTimeout(() => stepRoamRef.current(), travelTime + pauseTime);
  }, [x, y, isInteracting, isHovered, walkToSpot]);

  useEffect(() => {
    stepRoamRef.current = stepRoam;
  }, [stepRoam]);

  useEffect(() => {
    // Initial start position
    if (typeof window !== "undefined") {
      const initialX = Math.max(60, window.innerWidth - 150);
      const initialY = Math.max(140, window.innerHeight - 200);
      x.set(initialX);
      y.set(initialY);
    }

    // Start active roaming after 1s initial delay
    const initialTimer = setTimeout(() => stepRoamRef.current(), 1000);

    return () => {
      clearTimeout(initialTimer);
      if (roamLoopRef.current) clearTimeout(roamLoopRef.current);
      if (walkEndTimerRef.current) clearTimeout(walkEndTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [x, y]);

  const triggerSpeech = (customText?: string) => {
    const text = customText || QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setSpeech(text);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
    }, 2800);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.play("pop");
    setIsInteracting(true);

    triggerSpeech();

    // Dash / teleport to a new spot after being clicked
    setTimeout(() => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const targetX = 50 + Math.random() * (width - 140);
        const targetY = 120 + Math.random() * (height - 180);
        walkToSpot(targetX, targetY, 800);
      }
      setIsInteracting(false);
    }, 500);
  };

  if (!isClient) return null;

  return (
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
        onDragStart={() => {
          setIsInteracting(true);
          sound.play("hover");
        }}
        onDragEnd={(_e, info) => {
          setIsInteracting(false);
          x.set(x.get() + info.offset.x);
          y.set(y.get() + info.offset.y);
          // Resume roaming shortly
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
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94, cursor: "grabbing" }}
        onMouseEnter={() => {
          setIsHovered(true);
          sound.play("hover");
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Walking Waddle & Ghost Bobbing Wrapper */}
        <motion.div
          animate={{
            y: isWalking ? [0, -6, 0, -6, 0] : [0, -4, 0],
            rotate: isWalking ? [-6, 6, -6, 6, 0] : [0, -2, 2, 0],
          }}
          transition={{
            duration: isWalking ? 0.6 : 2.2,
            repeat: Infinity,
            ease: isWalking ? "easeInOut" : "easeInOut",
          }}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transform: `scaleX(${direction})`,
            transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Ghost Aura Shadow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(147, 51, 234, 0) 70%)",
              filter: "blur(6px)",
              transform: isHovered ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              opacity: isHovered ? 0.95 : 0.5,
            }}
          />

          {/* Gengar GIF Sprite */}
          <Image
            src="/gengar.gif"
            alt="Gengar companion"
            width={76}
            height={76}
            priority
            unoptimized
            style={{
              objectFit: "contain",
              pointerEvents: "none",
              filter: isHovered
                ? "drop-shadow(0 0 16px rgba(168, 85, 247, 0.85))"
                : "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))",
              transition: "filter 0.25s ease",
            }}
          />

          {/* Walking Footprints / Dust particles when actively walking */}
          {isWalking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.2, 1.6], y: [0, 6, 12] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: -2,
                left: "40%",
                width: 14,
                height: 4,
                borderRadius: "50%",
                background: "rgba(168, 85, 247, 0.4)",
                filter: "blur(2px)",
                pointerEvents: "none",
              }}
            />
          )}
        </motion.div>

        {/* Speech Bubble */}
        <AnimatePresence>
          {speech && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: -8 }}
              exit={{ opacity: 0, scale: 0.8, y: -4 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(18, 18, 22, 0.9)",
                backdropFilter: "blur(12px) saturate(180%)",
                WebkitBackdropFilter: "blur(12px) saturate(180%)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4), 0 0 12px rgba(168, 85, 247, 0.25)",
                color: "#f3e8ff",
                fontFamily: "var(--font-mono)",
                fontSize: "10.5px",
                letterSpacing: "0.04em",
                padding: "6px 12px",
                borderRadius: "12px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                marginBottom: "4px",
                zIndex: 10,
              }}
            >
              {speech}
              {/* Bubble Arrow */}
              <div
                style={{
                  position: "absolute",
                  bottom: -5,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid rgba(18, 18, 22, 0.9)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
