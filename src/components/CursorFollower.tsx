"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const RING_SIZE = 32;
const DOT_SIZE = 6;
const MAGNETIC_RANGE = 80; // px — how close cursor must be to snap
const MAGNETIC_STRENGTH = 0.35; // 0–1 — pull strength toward element center

export default function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [hasMouse, setHasMouse] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Ring follows with spring
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.8 });

  // Dot follows exactly
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Ring scale for hover effect
  const ringScale = useSpring(1, { stiffness: 300, damping: 25 });

  // Scroll fade
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrolling, setScrolling] = useState(false);

  const findMagneticTarget = useCallback((x: number, y: number): { cx: number; cy: number } | null => {
    const els = document.querySelectorAll("a, button, [data-magnetic]");
    let closest: { cx: number; cy: number; dist: number } | null = null;

    els.forEach((el) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      if (dist < MAGNETIC_RANGE && (!closest || dist < closest.dist)) {
        closest = { cx, cy, dist };
      }
    });

    return closest;
  }, []);

  useEffect(() => {
    // Only show on devices with fine pointer (mouse)
    const mq = window.matchMedia("(pointer: fine)");
    setHasMouse(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!hasMouse) return;

    const onMove = (e: MouseEvent) => {
      const rawX = e.clientX;
      const rawY = e.clientY;

      // Dot always follows exactly
      dotX.set(rawX - DOT_SIZE / 2);
      dotY.set(rawY - DOT_SIZE / 2);

      // Check for magnetic target
      const target = findMagneticTarget(rawX, rawY);
      if (target) {
        // Lerp toward target center
        const lerpX = rawX + (target.cx - rawX) * MAGNETIC_STRENGTH;
        const lerpY = rawY + (target.cy - rawY) * MAGNETIC_STRENGTH;
        mouseX.set(lerpX - RING_SIZE / 2);
        mouseY.set(lerpY - RING_SIZE / 2);
      } else {
        mouseX.set(rawX - RING_SIZE / 2);
        mouseY.set(rawY - RING_SIZE / 2);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = !!(t.closest("a") || t.closest("button") || t.closest("[data-magnetic]"));
      setIsHovering(interactive);
      ringScale.set(interactive ? 1.6 : 1);
    };

    const onScroll = () => {
      setScrolling(true);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setScrolling(false), 150);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [hasMouse, mouseX, mouseY, dotX, dotY, ringScale, findMagneticTarget]);

  // Don't render on mobile or when user prefers reduced motion
  if (!hasMouse || prefersReduced) return null;

  return (
    <>
      {/* Ring cursor */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          border: isHovering ? "none" : "1.5px solid var(--fg)",
          background: isHovering ? "var(--fg)" : "transparent",
          opacity: scrolling ? 0.15 : isHovering ? 0.15 : 0.45,
          x: ringX,
          y: ringY,
          scale: ringScale,
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: "difference",
          transition: "opacity 0.25s ease, background 0.2s ease, border 0.2s ease",
        }}
      />

      {/* Center dot */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "var(--fg)",
          opacity: scrolling ? 0.2 : 0.8,
          x: dotX,
          y: dotY,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}
