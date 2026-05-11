"use client";
import { useEffect, useState, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export default function ScrambleText({
  text,
  startDelay = 400,
  trigger = 0,
}: {
  text: string;
  startDelay?: number;
  trigger?: number;
}) {
  const rand = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  const [output, setOutput] = useState(() => text.split("").map(rand).join(""));
  const locked = useRef<boolean[]>(text.split("").map(() => false));

  useEffect(() => {
    locked.current = text.split("").map(() => false);
    const isInitial = trigger === 0;
    const start = performance.now() + (isInitial ? startDelay : 0);
    const lockOffset = isInitial ? 700 : 1050;
    const lockStep = isInitial ? 130 : 110;

    const id = setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed < 0) return;

      text.split("").forEach((_, i) => {
        if (elapsed > lockOffset + i * lockStep) locked.current[i] = true;
      });

      setOutput(
        text.split("").map((ch, i) => (locked.current[i] ? ch : rand())).join("")
      );

      if (locked.current.every(Boolean)) clearInterval(id);
    }, 30);

    return () => clearInterval(id);
  }, [text, startDelay, trigger]);

  return <>{output}</>;
}
