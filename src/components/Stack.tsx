"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";

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

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          cursor: "pointer",
          x: 0,
          y: 0,
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        cursor: "grab",
        touchAction: "none",
        x,
        y,
        rotateX,
        rotateY,
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
  /** Accessible name for the stack, e.g. "Photo gallery". */
  ariaLabel?: string;
  /** Id of visible instructions to announce on focus. */
  ariaDescribedBy?: string;
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  ariaLabel = "Card stack",
  ariaDescribedBy,
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  // Auto-advancing motion is skipped entirely for reduced-motion users
  const reduceMotion = useReducedMotion() ?? false;
  const isPaused = hoverPaused || focusPaused;
  const [order, setOrder] = useState<number[]>(() => cards.map((_, index) => index));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < mobileBreakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const currentOrder = useMemo(() => {
    const valid = order.filter((i) => i < cards.length);
    const missing = Array.from({ length: cards.length }, (_, i) => i).filter((i) => !valid.includes(i));
    return [...valid, ...missing];
  }, [order, cards.length]);

  // Deterministic pseudo-random rotations to avoid SSR mismatches and pure-render violations
  const rotations = useMemo(() => {
    return cards.map((_, index) => {
      if (!randomRotation) return 0;
      const pseudo = ((Math.sin(index * 12.9898 + 78.233) * 43758.5453) % 1);
      return pseudo * 10 - 5;
    });
  }, [cards, randomRotation]);

  const sendToBack = useCallback((index: number) => {
    setOrder((prev) => {
      const filtered = prev.filter((i) => i !== index);
      return [index, ...filtered];
    });
  }, []);

  // Keyboard: → / ↓ / Enter / Space send the top card to the back (next);
  // ← / ↑ bring the bottom card to the top (previous).
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (currentOrder.length <= 1) return;
    let next: number[] | null = null;

    if (["ArrowRight", "ArrowDown", "Enter", " "].includes(e.key)) {
      next = [currentOrder[currentOrder.length - 1], ...currentOrder.slice(0, -1)];
    } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
      next = [...currentOrder.slice(1), currentOrder[0]];
    }
    if (!next) return;

    e.preventDefault();
    setOrder(next);
    // The last entry renders on top
    setAnnouncement(`Photo ${next[next.length - 1] + 1} of ${cards.length}`);
  };

  useEffect(() => {
    if (!autoplay || reduceMotion || currentOrder.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setOrder((prev) => {
        if (prev.length <= 1) return prev;
        const last = prev[prev.length - 1];
        const rest = prev.slice(0, -1);
        return [last, ...rest];
      });
    }, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, reduceMotion, isPaused, currentOrder.length]);

  if (cards.length === 0) return null;

  return (
    <div
      role="group"
      aria-roledescription="photo stack"
      aria-label={`${ariaLabel}, ${cards.length} ${cards.length === 1 ? "photo" : "photos"}`}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      // Hold still while someone is reading or navigating it by keyboard
      onFocus={() => setFocusPaused(true)}
      onBlur={() => setFocusPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        perspective: 600,
        borderRadius: 16,
      }}
      onMouseEnter={() => pauseOnHover && setHoverPaused(true)}
      onMouseLeave={() => pauseOnHover && setHoverPaused(false)}
    >
      <span role="status" aria-live="polite" style={SR_ONLY}>
        {announcement}
      </span>
      {currentOrder.map((cardIndex, stackPosition) => {
        const cardContent = cards[cardIndex];
        const rotation = rotations[cardIndex] ?? 0;
        if (!cardContent) return null;

        return (
          <CardRotate
            key={cardIndex}
            onSendToBack={() => sendToBack(cardIndex)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                width: "100%",
                height: "100%",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
              }}
              onClick={() => shouldEnableClick && sendToBack(cardIndex)}
              animate={{
                rotateZ: (currentOrder.length - stackPosition - 1) * 4 + rotation,
                scale: 1 + stackPosition * 0.06 - currentOrder.length * 0.06,
                transformOrigin: "90% 90%",
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {cardContent}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
