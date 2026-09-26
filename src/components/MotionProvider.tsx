"use client";

import { MotionConfig } from "framer-motion";

// Framer Motion drives transforms from JS, so the CSS prefers-reduced-motion
// rule in globals.css never reaches it. "user" makes every motion component
// skip transform/layout animation when the OS asks for reduced motion,
// while keeping opacity fades so state changes still read.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
