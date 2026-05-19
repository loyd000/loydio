"use client";

import { motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";

type TypewriterTextProps = {
  text1: string;
  text2?: string;
  inView: boolean;
};

type RevealLineProps = {
  text: string;
  lineId: string;
  charOffset: number;
  totalChars: number;
  progress: MotionValue<number>;
  delay: number;
  baseOpacity: number;
};

type RevealCharProps = {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
  delay: number;
  baseOpacity: number;
};

type ScrollRevealTextProps = {
  text: string;
  className?: string;
  delay?: number;
  baseOpacity?: number;
};

const HEADING_BASE_OPACITY = 0.18;
const COPY_BASE_OPACITY = 0.42;
const HEADING_REVEAL_DELAY = 0.22;
const COPY_REVEAL_DELAY = 0.16;
const REVEAL_SPAN = 0.9;

export default function TypewriterText({ text1, text2 }: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 20%"],
  });

  const label = text2 ? `${text1} ${text2}` : text1;
  const totalChars = text1.length + (text2?.length ?? 0);

  if (prefersReducedMotion) {
    return (
      <span>
        {text1}
        {text2 && (
          <>
            <br />
            {text2}
          </>
        )}
      </span>
    );
  }

  return (
    <span ref={ref} className="scroll-reveal-typewriter">
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">
        <RevealLine
          text={text1}
          lineId="t1"
          charOffset={0}
          totalChars={totalChars}
          progress={scrollYProgress}
          delay={HEADING_REVEAL_DELAY}
          baseOpacity={HEADING_BASE_OPACITY}
        />
        {text2 && (
          <>
            <br />
            <RevealLine
              text={text2}
              lineId="t2"
              charOffset={text1.length}
              totalChars={totalChars}
              progress={scrollYProgress}
              delay={HEADING_REVEAL_DELAY}
              baseOpacity={HEADING_BASE_OPACITY}
            />
          </>
        )}
      </span>
    </span>
  );
}

export function ScrollRevealText({
  text,
  className,
  delay = COPY_REVEAL_DELAY,
  baseOpacity = COPY_BASE_OPACITY,
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 94%", "end 28%"],
  });

  if (prefersReducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className ? `scroll-reveal-typewriter ${className}` : "scroll-reveal-typewriter"}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <RevealLine
          text={text}
          lineId="copy"
          charOffset={0}
          totalChars={text.length}
          progress={scrollYProgress}
          delay={delay}
          baseOpacity={baseOpacity}
        />
      </span>
    </span>
  );
}

function RevealLine({ text, lineId, charOffset, totalChars, progress, delay, baseOpacity }: RevealLineProps) {
  return (
    <span className="scroll-reveal-line">
      {text.split("").map((char, index) => (
        <RevealChar
          char={char}
          index={charOffset + index}
          totalChars={totalChars}
          progress={progress}
          delay={delay}
          baseOpacity={baseOpacity}
          key={`${lineId}-${index}`}
        />
      ))}
    </span>
  );
}

function RevealChar({ char, index, totalChars, progress, delay, baseOpacity }: RevealCharProps) {
  const denominator = Math.max(totalChars - 1, 1);
  const availableSpan = Math.min(REVEAL_SPAN, Math.max(0.08, 0.98 - delay));
  const threshold = delay + (index / denominator) * availableSpan;
  const [revealed, setRevealed] = useState(() => progress.get() >= threshold);

  useMotionValueEvent(progress, "change", (latest) => {
    const shouldReveal = latest >= threshold;
    setRevealed((current) => (current === shouldReveal ? current : shouldReveal));
  });

  return (
    <motion.span className="scroll-reveal-char" style={{ opacity: revealed ? 1 : baseOpacity, whiteSpace: "pre" }}>
      {char}
    </motion.span>
  );
}
