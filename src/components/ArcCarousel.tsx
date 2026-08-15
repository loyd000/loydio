"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";

export interface ProjectItem {
  id?: string | number;
  title: string;
  status?: "Shipped" | "In progress";
  shipped?: boolean;
  description?: string;
  desc?: string;
  tags: string[];
  link?: string | null;
  image_url?: string | null;
  category?: string;
  year?: string;
}

export interface ArcCarouselProps {
  projects: ProjectItem[];
}

export default function ArcCarousel({ projects }: ArcCarouselProps) {
  const items = projects;
  const N = Math.max(items.length, 1);

  const ANGLE_STEP = 15; // degrees between adjacent cards (tight spacing default)
  const HALF_TOTAL = (N * ANGLE_STEP) / 2;
  const MAX_VISIBLE_DIFF = ANGLE_STEP * 3.4;

  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // States
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Refs for animation & drag state
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const animRafRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const detailItem = items[Math.min(activeIndex, N - 1)];

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Shortest angular distance wrapped into [-HALF_TOTAL, HALF_TOTAL)
  const wrapDiff = useCallback(
    (d: number) => {
      const x =
        (((d + HALF_TOTAL) % (N * ANGLE_STEP)) + N * ANGLE_STEP) %
          (N * ANGLE_STEP) -
        HALF_TOTAL;
      return x;
    },
    [N, ANGLE_STEP, HALF_TOTAL]
  );

  // Measure container geometry (cards sit close together near edge-to-edge as default)
  const getGeometry = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return { w: 800, h: 350, radius: 460, centerX: 400, centerY: 625 };
    const w = wrap.clientWidth || 800;
    const h = 350;
    const radius = Math.max(400, Math.min(w * 0.48, 620));
    const centerX = w / 2;
    const centerY = radius + 165;
    return { w, h, radius, centerX, centerY };
  }, []);

  // Render cards onto arc
  const renderArc = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || reducedMotion) return;

    const { radius, centerX, centerY } = getGeometry();
    const currentOffset = offsetRef.current;
    const cards = stage.children;

    for (let i = 0; i < N; i++) {
      const card = cards[i] as HTMLElement;
      if (!card) continue;

      const diff = wrapDiff(i * ANGLE_STEP - currentOffset);

      if (Math.abs(diff) > MAX_VISIBLE_DIFF) {
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = "scale(0.5)";
        continue;
      }

      const angleDeg = 270 + diff;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      const closeness = 1 - Math.min(Math.abs(diff) / MAX_VISIBLE_DIFF, 1);
      const scale = 0.82 + closeness * 0.34;
      const opacity = 0.22 + closeness * 0.78;
      const rot = diff * 0.32;

      card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(Math.round(closeness * 1000));
      card.style.pointerEvents = "auto";

      const isActive = Math.abs(diff) < ANGLE_STEP * 0.4;
      if (isActive) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    }

    // Determine active index
    const nearest = Math.round(currentOffset / ANGLE_STEP);
    const idx = ((nearest % N) + N) % N;
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      setActiveIndex(idx);
    }
  }, [N, ANGLE_STEP, MAX_VISIBLE_DIFF, wrapDiff, getGeometry, reducedMotion]);

  // Smooth animation to target offset
  const animateTo = useCallback(
    (target: number, duration = 420) => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      const start = offsetRef.current;
      const delta = target - start;
      const startTime = performance.now();

      function step(now: number) {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
        offsetRef.current = start + delta * eased;
        renderArc();
        if (t < 1) {
          animRafRef.current = requestAnimationFrame(step);
        }
      }
      animRafRef.current = requestAnimationFrame(step);
    },
    [renderArc]
  );

  // Navigate to specific index
  const goToIndex = useCallback(
    (i: number) => {
      sound.play("click");
      const nearestRaw = Math.round(offsetRef.current / ANGLE_STEP);
      const nearestIdx = ((nearestRaw % N) + N) % N;
      let deltaIdx = i - nearestIdx;
      if (deltaIdx > N / 2) deltaIdx -= N;
      if (deltaIdx < -N / 2) deltaIdx += N;
      const target = (nearestRaw + deltaIdx) * ANGLE_STEP;
      animateTo(target);
    },
    [N, ANGLE_STEP, animateTo]
  );

  // Initialize and resize listener
  useEffect(() => {
    renderArc();
    const handleResize = () => renderArc();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
    };
  }, [renderArc]);

  // Pointer events (Pointer API handles mouse + touch swipe seamlessly)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    draggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 6) {
      if (!hasDraggedRef.current) {
        hasDraggedRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
      }
    }
    if (hasDraggedRef.current) {
      const DEG_PER_PX = 0.28;
      offsetRef.current = dragStartOffsetRef.current - dx * DEG_PER_PX;
      renderArc();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (hasDraggedRef.current) {
      const dx = e.clientX - dragStartXRef.current;
      const startNearest = Math.round(dragStartOffsetRef.current / ANGLE_STEP);
      
      const DEG_PER_PX = 0.28;
      const totalDegDragged = -dx * DEG_PER_PX; // positive means advancing forward

      let stepShift = 0;
      if (Math.abs(dx) > 15) {
        stepShift = Math.sign(totalDegDragged) * Math.max(1, Math.round(Math.abs(totalDegDragged) / (ANGLE_STEP * 0.55)));
      }

      const target = (startNearest + stepShift) * ANGLE_STEP;
      animateTo(target, 420);
    }
  };

  // Status helper
  const getStatusText = (p: ProjectItem) => {
    if (p.status) return p.status;
    return p.shipped ? "Shipped" : "In progress";
  };

  const isShipped = (p: ProjectItem) => {
    if (p.shipped !== undefined) return p.shipped;
    return p.status?.toLowerCase() === "shipped";
  };

  if (items.length === 0) return null;

  // Reduced motion fallback UI
  if (reducedMotion) {
    return (
      <div style={{ padding: "2rem 0", background: "var(--bg)" }}>
        <div className="section-container">
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: "1.5rem",
            }}
          >
            {items.map((p, i) => (
              <div
                key={p.title + i}
                style={{
                  minWidth: 280,
                  maxWidth: 320,
                  scrollSnapAlign: "start",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: "1.5rem",
                  background: "var(--surface)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--font-display), 'Syne', sans-serif", fontSize: 11, color: "var(--muted)" }}>
                    0{i + 1}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display), 'Syne', sans-serif",
                      fontSize: 10,
                      textTransform: "uppercase",
                      color: isShipped(p) ? "var(--fg)" : "var(--muted)",
                    }}
                  >
                    {getStatusText(p)}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display), 'Syne', sans-serif", fontSize: 20, marginBottom: "0.5rem" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {p.description || p.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => (
                    <span key={t} className="tag" style={{ fontSize: 10 }}>#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "calc(100% + 2 * clamp(1.5rem, 6vw, 5rem))",
        marginLeft: "calc(-1 * clamp(1.5rem, 6vw, 5rem))",
        marginRight: "calc(-1 * clamp(1.5rem, 6vw, 5rem))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Arc Wrap Container ── */}
      <div
        ref={wrapRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Development projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goToIndex(((activeIndexRef.current - 1) % N + N) % N);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goToIndex((activeIndexRef.current + 1) % N);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`arc-wrap ${isDragging ? "dragging" : ""}`}
        style={{
          position: "relative",
          height: 340,
          marginTop: "1rem",
          overflow: "visible",
          touchAction: "pan-y",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div ref={stageRef} className="arc-stage" style={{ position: "relative", width: "100%", height: "100%" }}>
          {items.map((p, i) => (
            <div
              key={p.title + i}
              onClick={() => goToIndex(i)}
              onMouseEnter={() => sound.play("hover")}
              className={`arc-card liquid-glass-card ${i === activeIndex ? "active" : ""}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 250,
                height: 250,
                marginLeft: -125,
                marginTop: -125,
                borderRadius: 16,
                overflow: "hidden",
                willChange: "transform, opacity",
                pointerEvents: "auto",
                cursor: "pointer",
              }}
            >
              <div className="arc-card-inner" style={{ padding: "0.85rem", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
              {/* Liquid specular reflection highlight */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
              {/* Image Screenshot Header */}
              <div
                style={{
                  width: "100%",
                  height: 125,
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--hover-bg)",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    sizes="250px"
                    style={{
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, var(--hover-bg) 0%, var(--border) 100%)",
                      color: "var(--fg)",
                      fontFamily: "var(--font-display), 'Syne', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      opacity: 0.7,
                    }}
                  >
                    [{p.tags[0] || "project"}]
                  </div>
                )}
                {/* Index badge overlay */}
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    fontFamily: "var(--font-display), 'Syne', sans-serif",
                    fontSize: 10,
                    color: "var(--bg)",
                    background: "var(--fg)",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  0{i + 1}
                </span>
              </div>

              {/* Info Bottom */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6, flex: 1, justifyContent: "space-between" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display), 'Syne', sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1.25,
                    color: "var(--fg)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.title}
                </h3>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display), 'Syne', sans-serif",
                      fontSize: 10,
                      color: "var(--muted)",
                    }}
                  >
                    #{p.tags[0] || "dev"}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: isShipped(p) ? "var(--fg)" : "var(--muted)",
                    }}
                  />
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls (Arrows + Dots) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          marginTop: "1.75rem",
          position: "relative",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => goToIndex(((activeIndex - 1) % N + N) % N)}
          onMouseEnter={() => sound.play("hover")}
          aria-label="Previous project"
          className="liquid-glass-btn"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            fontSize: 14,
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          &lt;
        </button>

        <div className="liquid-glass-pill">
          {items.map((_, i) => (
            <div
              key={i}
              onClick={() => goToIndex(i)}
              onMouseEnter={() => sound.play("hover")}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === activeIndex ? "var(--fg)" : "var(--muted)",
                transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
                opacity: i === activeIndex ? 1 : 0.4,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => goToIndex((activeIndex + 1) % N)}
          onMouseEnter={() => sound.play("hover")}
          aria-label="Next project"
          className="liquid-glass-btn"
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            fontSize: 14,
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          &gt;
        </button>
      </div>

      {/* ── Detail Panel ── */}
      <div
        style={{
          maxWidth: 520,
          margin: "2rem auto 3rem",
          padding: "0 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "0.75rem",
          }}
        >
          {getStatusText(detailItem)}
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display), 'Syne', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(22px, 3.5vw, 32px)",
            marginBottom: "0.75rem",
          }}
        >
          {detailItem.title}
        </h2>

        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          {detailItem.description || detailItem.desc}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.25rem",
          }}
        >
          {detailItem.tags.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-display), 'Syne', sans-serif",
                fontSize: 10,
                color: "var(--fg)",
                border: "1px solid var(--border-strong)",
                padding: "3px 8px",
                borderRadius: 3,
              }}
            >
              #{t}
            </span>
          ))}
        </div>

        {detailItem.link && (
          <div style={{ marginTop: "1.25rem" }}>
            <a
              href={detailItem.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.play("hover")}
              onClick={() => sound.play("click")}
              className="btn btn-outline"
              style={{ padding: "8px 18px", fontSize: 11 }}
            >
              Visit Project ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
