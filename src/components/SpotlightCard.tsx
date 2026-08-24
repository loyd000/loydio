"use client";
import React, { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "onMouseMove"> {
  spotlightColor?: string;
}

// Adapted from React Bits' SpotlightCard — visual chrome (border/bg/radius) is left
// to the caller's className so it composes with this site's liquid-glass cards.
const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(function SpotlightCard(
  {
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)",
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  forwardedRef
) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
    onFocus?.(e);
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
    onBlur?.(e);
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseEnter?.(e);
    setOpacity(0.6);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = (e) => {
    onMouseLeave?.(e);
    setOpacity(0);
  };

  return (
    <div
      ref={(node) => {
        divRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
});

export default SpotlightCard;
