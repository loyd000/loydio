"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type NodeCategory = "Frontend" | "Backend" | "Design" | "DevOps";
type Node = { id: string; label: string; category: NodeCategory; x: number; y: number };
type Edge = { a: string; b: string };

// Clusters shifted 55px inward horizontally, 25px inward vertically vs original
const NODES: Node[] = [
  // Frontend — top-left
  { id: "react",     label: "React",         category: "Frontend", x: 203, y: 115 },
  { id: "nextjs",    label: "Next.js",       category: "Frontend", x: 285, y: 90  },
  { id: "ts",        label: "TypeScript",    category: "Frontend", x: 325, y: 170 },
  { id: "tailwind",  label: "Tailwind",      category: "Frontend", x: 220, y: 200 },
  { id: "framer",    label: "Framer Motion", category: "Frontend", x: 150, y: 170 },
  { id: "vite",      label: "Vite",          category: "Frontend", x: 170, y: 80  },

  // Backend — top-right
  { id: "nodejs",    label: "Node.js",       category: "Backend",  x: 595, y: 95  },
  { id: "express",   label: "Express",       category: "Backend",  x: 685, y: 120 },
  { id: "postgres",  label: "PostgreSQL",    category: "Backend",  x: 720, y: 200 },
  { id: "supabase",  label: "Supabase",      category: "Backend",  x: 630, y: 215 },
  { id: "prisma",    label: "Prisma",        category: "Backend",  x: 545, y: 180 },
  { id: "rest",      label: "REST APIs",     category: "Backend",  x: 565, y: 105 },

  // Design — bottom-left
  { id: "figma",     label: "Figma",         category: "Design",   x: 210, y: 310 },
  { id: "photoshop", label: "Photoshop",     category: "Design",   x: 140, y: 355 },
  { id: "canva",     label: "Canva",         category: "Design",   x: 175, y: 425 },
  { id: "illust",    label: "Illustrator",   category: "Design",   x: 270, y: 425 },
  { id: "framerapp", label: "Framer",        category: "Design",   x: 315, y: 345 },
  { id: "spline",    label: "Spline",        category: "Design",   x: 275, y: 285 },

  // DevOps — bottom-right
  { id: "git",       label: "Git",           category: "DevOps",   x: 585, y: 315 },
  { id: "github",    label: "GitHub",        category: "DevOps",   x: 685, y: 290 },
  { id: "vercel",    label: "Vercel",        category: "DevOps",   x: 725, y: 370 },
  { id: "docker",    label: "Docker",        category: "DevOps",   x: 660, y: 425 },
  { id: "vscode",    label: "VS Code",       category: "DevOps",   x: 560, y: 395 },
  { id: "linux",     label: "Linux",         category: "DevOps",   x: 565, y: 325 },
];

const EDGES: Edge[] = [
  { a: "react",    b: "nextjs"    }, { a: "react",    b: "ts"        },
  { a: "react",    b: "framer"   }, { a: "nextjs",   b: "ts"        },
  { a: "nextjs",   b: "tailwind" }, { a: "ts",       b: "tailwind"  },
  { a: "vite",     b: "react"    }, { a: "framer",   b: "tailwind"  },

  { a: "nodejs",   b: "express"  }, { a: "nodejs",   b: "rest"      },
  { a: "express",  b: "rest"     }, { a: "postgres", b: "supabase"  },
  { a: "postgres", b: "prisma"   }, { a: "supabase", b: "prisma"    },
  { a: "supabase", b: "nodejs"   },

  { a: "figma",    b: "photoshop" }, { a: "figma",    b: "framerapp" },
  { a: "figma",    b: "illust"   }, { a: "photoshop", b: "illust"   },
  { a: "canva",    b: "figma"    }, { a: "spline",   b: "framerapp" },
  { a: "spline",   b: "figma"    },

  { a: "git",      b: "github"   }, { a: "git",      b: "vscode"    },
  { a: "github",   b: "vercel"   }, { a: "vercel",   b: "docker"    },
  { a: "docker",   b: "linux"    }, { a: "linux",    b: "git"       },

  { a: "nextjs",   b: "vercel"   }, { a: "react",    b: "figma"     },
  { a: "nodejs",   b: "docker"   }, { a: "supabase", b: "vercel"    },
  { a: "ts",       b: "prisma"   }, { a: "vscode",   b: "react"     },
];

const COLORS_DARK: Record<NodeCategory, string> = {
  Frontend: "#60a5fa",
  Backend:  "#34d399",
  Design:   "#f472b6",
  DevOps:   "#facc15",
};

const COLORS_LIGHT: Record<NodeCategory, string> = {
  Frontend: "#1d4ed8",
  Backend:  "#047857",
  Design:   "#be185d",
  DevOps:   "#92400e",
};

const LABEL_OFFSET: Record<NodeCategory, { dx: number; dy: number }> = {
  Frontend: { dx: 0, dy: -17 },
  Backend:  { dx: 0, dy: -17 },
  Design:   { dx: 0, dy:  22 },
  DevOps:   { dx: 0, dy:  22 },
};

// viewBox to zoom into each cluster [minX, minY, width, height]
// width/height chosen so aspect ratio ≈ 900/510 and cluster is well-centered
const CLUSTER_VB: Record<string, [number, number, number, number]> = {
  all:      [0, 0, 900, 510],
  Frontend: [5,   40,  420, 220],
  Backend:  [410, 40,  420, 220],
  Design:   [5,   240, 420, 230],
  DevOps:   [405, 240, 420, 230],
};

const DRIFT = NODES.map((_, i) => ({
  ax:     2 + (i % 3),
  ay:     1.5 + ((i * 17) % 25) / 10,
  period: 4 + ((i * 61) % 40) / 10,
  delay:  (i * 37) % 30 / 10,
}));

function getNeighbors(id: string): Set<string> {
  const s = new Set<string>();
  for (const e of EDGES) {
    if (e.a === id) s.add(e.b);
    if (e.b === id) s.add(e.a);
  }
  return s;
}

const CATEGORIES: NodeCategory[] = ["Frontend", "Backend", "Design", "DevOps"];

// Jittered grid — regular spacing with random per-dot offset for an organic look
const DOT_SPACING = 24;
const DOT_JITTER  = 7;
const DOTS: { x: number; y: number }[] = [];
for (let r = 0; r * DOT_SPACING <= 510; r++)
  for (let c = 0; c * DOT_SPACING <= 900; c++)
    DOTS.push({
      x: c * DOT_SPACING + 12 + (Math.random() - 0.5) * DOT_JITTER * 2,
      y: r * DOT_SPACING + 12 + (Math.random() - 0.5) * DOT_JITTER * 2,
    });

// Grouped data for mobile view
const MOBILE_GROUPS: { category: NodeCategory; items: string[] }[] = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "Vite"] },
  { category: "Backend",  items: ["Node.js", "Express", "PostgreSQL", "Supabase", "Prisma", "REST APIs"] },
  { category: "Design",   items: ["Figma", "Photoshop", "Canva", "Illustrator", "Framer", "Spline"] },
  { category: "DevOps",   items: ["Git", "GitHub", "Vercel", "Docker", "VS Code", "Linux"] },
];

function MobileStackView({ colors }: { colors: Record<NodeCategory, string> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {MOBILE_GROUPS.map((group) => (
        <div key={group.category}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[group.category], flexShrink: 0 }} />
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: colors[group.category], opacity: 0.8 }}>
              {group.category}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {group.items.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  padding: "6px 12px",
                  border: `1px solid ${colors[group.category]}40`,
                  color: colors[group.category],
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TechNodeGraph() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const sectionRef   = useRef(null);
  const vbCurrent    = useRef<number[]>([0, 0, 900, 510]);
  const vbTarget     = useRef<number[]>([0, 0, 900, 510]);
  const rafId        = useRef<number>(0);
  const dotRafId     = useRef<number>(0);
  const dotMouse       = useRef({ x: -9999, y: -9999 });
  const ripples        = useRef<{ x: number; y: number; t: number }[]>([]);
  const lastRippleT    = useRef(0);
  const isHoveringRef  = useRef(false);
  const nextIdleRipple = useRef(performance.now() + 1500 + Math.random() * 1500);

  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [hovered,        setHovered]        = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<NodeCategory | null>(null);
  const [revealed,       setRevealed]       = useState(false);
  const [isDark,         setIsDark]         = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const CATEGORY_COLOR = isDark ? COLORS_DARK : COLORS_LIGHT;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springCfg = { stiffness: 55, damping: 18, mass: 0.6 };
  const smoothX = useSpring(mouseX, springCfg);
  const smoothY = useSpring(mouseY, springCfg);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [3, -3]);

  useEffect(() => { if (inView) setRevealed(true); }, [inView]);

  // Smooth viewBox zoom via RAF lerp (no re-renders during animation)
  useEffect(() => {
    const target = CLUSTER_VB[activeCategory ?? "all"];
    vbTarget.current = [...target];

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const next = vbCurrent.current.map((v, i) => lerp(v, vbTarget.current[i], 0.1));
      vbCurrent.current = next;
      svgRef.current?.setAttribute("viewBox", next.join(" "));
      const settled = next.every((v, i) => Math.abs(v - vbTarget.current[i]) < 0.15);
      if (settled) {
        vbCurrent.current = [...vbTarget.current];
        svgRef.current?.setAttribute("viewBox", vbTarget.current.join(" "));
      } else {
        rafId.current = requestAnimationFrame(tick);
      }
    };

    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [activeCategory]);

  // Dot grid canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const r = canvas.getBoundingClientRect();
      canvas.width  = r.width  * dpr;
      canvas.height = r.height * dpr;
    });
    ro.observe(canvas);
    { const dpr = window.devicePixelRatio || 1; const r = canvas.getBoundingClientRect(); canvas.width = r.width * dpr; canvas.height = r.height * dpr; }

    const baseRGB  = isDark ? "255,255,255" : "0,0,0";
    const baseOpac = isDark ? 0.09 : 0.06;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { dotRafId.current = requestAnimationFrame(draw); return; }

      const dpr   = window.devicePixelRatio || 1;
      const cw    = canvas.width;
      const ch    = canvas.height;
      const scaleX = cw / 900;
      const scaleY = ch / 510;

      ctx.clearRect(0, 0, cw, ch);

      const now   = performance.now();
      const mouse = dotMouse.current;
      ripples.current = ripples.current.filter(r => now - r.t < 2000);

      // Idle auto-ripples when cursor is not over the component
      if (!isHoveringRef.current && now > nextIdleRipple.current) {
        nextIdleRipple.current = now + 1500 + Math.random() * 1500;
        ripples.current = [...ripples.current, {
          x: Math.random() * 880 + 10,
          y: Math.random() * 490 + 10,
          t: now,
        }].slice(-6);
      }

      for (const dot of DOTS) {
        let intensity = 0;

        for (const rp of ripples.current) {
          const elapsed   = (now - rp.t) / 1000;
          const dist      = Math.hypot(dot.x - rp.x, dot.y - rp.y);
          const wavefront = elapsed * 130;
          const delta     = (dist - wavefront) / 65;
          const wave      = Math.exp(-delta * delta);
          const decay     = Math.exp(-elapsed * 1.2);
          intensity += wave * decay;
        }

        const cd = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
        intensity += Math.max(0, 1 - cd / 80) * 0.5;
        intensity  = Math.min(intensity, 1);

        const opacity = baseOpac + intensity * (isDark ? 0.56 : 0.38);
        const radius  = (1.2 + intensity * 1.4) * dpr;

        ctx.beginPath();
        ctx.arc(dot.x * scaleX, dot.y * scaleY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseRGB},${opacity})`;
        ctx.fill();
      }

      dotRafId.current = requestAnimationFrame(draw);
    };

    dotRafId.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(dotRafId.current); };
  }, [isDark]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    isHoveringRef.current = true;
    mouseX.set((e.clientX - rect.left  - rect.width  / 2) / rect.width);
    mouseY.set((e.clientY - rect.top   - rect.height / 2) / rect.height);

    // SVG-space coords for dot grid
    const svgX = (e.clientX - rect.left) * (900 / rect.width);
    const svgY = (e.clientY - rect.top)  * (510 / rect.height);
    dotMouse.current = { x: svgX, y: svgY };

    // Throttled ripple spawn
    const now = performance.now();
    if (now - lastRippleT.current > 65) {
      lastRippleT.current = now;
      ripples.current = [...ripples.current, { x: svgX, y: svgY, t: now }].slice(-8);
    }
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    mouseX.set(0); mouseY.set(0); setHovered(null);
    dotMouse.current = { x: -9999, y: -9999 };
    nextIdleRipple.current = performance.now() + 1500 + Math.random() * 1000;
  };

  const neighbors = hovered ? getNeighbors(hovered) : null;

  const nodeOpacity = (node: Node) => {
    const inCat = activeCategory == null || activeCategory === node.category;
    if (!inCat) return 0.07;
    if (hovered == null) return 0.9;
    return hovered === node.id || (neighbors?.has(node.id) ?? false) ? 1 : 0.12;
  };

  const edgeOpacity = (e: Edge) => {
    const na = NODES.find((n) => n.id === e.a)!;
    const nb = NODES.find((n) => n.id === e.b)!;
    if (activeCategory != null && (na.category !== activeCategory || nb.category !== activeCategory)) return 0.03;
    if (hovered == null) return 0.14;
    return e.a === hovered || e.b === hovered ? 0.55 : 0.04;
  };

  const edgeActive = (e: Edge) => hovered != null && (e.a === hovered || e.b === hovered);

  return (
    <div ref={sectionRef} style={{ width: "100%" }}>

      {/* Filter buttons — desktop only */}
      <div className="techgraph-desktop">
      <div style={{ display: "flex", gap: 8, marginBottom: "1.75rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => {
          const on = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(on ? null : cat)}
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "6px 16px",
                border: `1px solid ${on ? CATEGORY_COLOR[cat] : "var(--border-strong)"}`,
                background: on ? `${CATEGORY_COLOR[cat]}1a` : "transparent",
                color: on ? CATEGORY_COLOR[cat] : "var(--fg)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {cat}
            </button>
          );
        })}
        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
              padding: "6px 14px", border: "1px solid var(--border)", background: "transparent",
              color: "var(--fg)", opacity: 0.4, cursor: "pointer",
            }}
          >
            Clear ✕
          </button>
        )}
      </div>

      </div>{/* /filter buttons desktop wrapper */}

      {/* Desktop: SVG node graph */}
      <div className="techgraph-desktop">
      <div style={{ perspective: "900px", overflow: "hidden" }}>
        <motion.div
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={activeCategory ? { position: "relative" } : { position: "relative", rotateX, rotateY }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <svg
            ref={svgRef}
            viewBox="0 0 900 510"
            style={{ width: "100%", height: "auto", display: "block", overflow: "hidden", position: "relative", zIndex: 1 }}
            aria-label="Tech stack node graph"
            role="img"
          >
            {/* Category labels */}
            {([
              { label: "Frontend", x: 237, y: 50,  cat: "Frontend" as NodeCategory },
              { label: "Backend",  x: 635, y: 50,  cat: "Backend"  as NodeCategory },
              { label: "Design",   x: 228, y: 466, cat: "Design"   as NodeCategory },
              { label: "DevOps",   x: 640, y: 466, cat: "DevOps"   as NodeCategory },
            ]).map((g) => (
              <text key={g.label} x={g.x} y={g.y} textAnchor="middle" style={{
                fontFamily: MONO, fontSize: 10, fill: CATEGORY_COLOR[g.cat],
                letterSpacing: "0.25em",
                opacity: revealed ? (activeCategory == null || activeCategory === g.cat ? 0.55 : 0.1) : 0,
                transition: "opacity 0.3s ease",
              }}>
                {g.label.toUpperCase()}
              </text>
            ))}

            {/* Edges */}
            {EDGES.map((e, i) => {
              const na = NODES.find((n) => n.id === e.a)!;
              const nb = NODES.find((n) => n.id === e.b)!;
              const active = edgeActive(e);
              return (
                <line key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={active ? CATEGORY_COLOR[na.category] : "currentColor"}
                  strokeOpacity={edgeOpacity(e)}
                  strokeWidth={active ? 1.5 : 1}
                  style={{ transition: "stroke-opacity 0.2s ease, stroke-width 0.2s ease" }}
                />
              );
            })}

            {/* Nodes */}
            {NODES.map((node, i) => {
              const d    = DRIFT[i];
              const color = CATEGORY_COLOR[node.category];
              const opacity = nodeOpacity(node);
              const isHov   = hovered === node.id;
              const off = LABEL_OFFSET[node.category];

              return (
                <motion.g
                  key={node.id}
                  animate={revealed ? {
                    x: [0, d.ax, d.ax * 0.3, -d.ax * 0.7, 0],
                    y: [0, d.ay * 0.5, d.ay, -d.ay * 0.4, 0],
                  } : { x: 0, y: 0 }}
                  transition={{ duration: d.period, repeat: Infinity, ease: "easeInOut", delay: d.delay }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {isHov && <circle cx={node.x} cy={node.y} r={20} fill={color} fillOpacity={0.15} />}

                  <motion.circle
                    cx={node.x} cy={node.y}
                    r={isHov ? 9 : 6}
                    fill={color}
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity } : { opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025 }}
                  />

                  <motion.text
                    x={node.x + off.dx} y={node.y + off.dy}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity } : { opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025 + 0.12 }}
                    style={{
                      fontFamily: MONO,
                      fontSize: isHov ? 13 : 11,
                      fill: color,
                      userSelect: "none",
                      pointerEvents: "none",
                      transition: "font-size 0.15s ease",
                    }}
                  >
                    {node.label}
                  </motion.text>
                </motion.g>
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 24, marginTop: "1.5rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLOR[cat] }} />
            <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.45, letterSpacing: "0.15em" }}>{cat}</span>
          </div>
        ))}
      </div>
      </div>{/* /techgraph-desktop */}

      {/* Mobile: grouped chip list */}
      <div className="techgraph-mobile">
        <MobileStackView colors={CATEGORY_COLOR} />
      </div>
    </div>
  );
}
