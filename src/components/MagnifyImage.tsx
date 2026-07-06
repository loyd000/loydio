"use client";
import { useRef, useState } from "react";
import Image from "next/image";

const LENS_R = 90;
const ZOOM = 2.5;

export default function MagnifyImage({
  src,
  alt,
  sizes = "100vw",
  style,
}: {
  src: string;
  alt: string;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  return (
    <div
      ref={ref}
      style={{ position: "relative", overflow: "hidden", ...style, cursor: lens ? "none" : undefined }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect();
        setLens({ x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height });
      }}
      onMouseLeave={() => setLens(null)}
    >
      <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />

      {lens && (
        <div
          style={{
            position: "absolute",
            left: lens.x - LENS_R,
            top: lens.y - LENS_R,
            width: LENS_R * 2,
            height: LENS_R * 2,
            borderRadius: "50%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Inner div same size as container, scaled from top-left so cursor point maps to lens center */}
          <div
            style={{
              position: "absolute",
              width: lens.w,
              height: lens.h,
              left: LENS_R - lens.x * ZOOM,
              top: LENS_R - lens.y * ZOOM,
              transform: `scale(${ZOOM})`,
              transformOrigin: "0 0",
            }}
          >
            <Image src={src} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
          </div>
        </div>
      )}
    </div>
  );
}
