"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type NodeCategory = "Frontend" | "Backend" | "Design" | "DevOps";

type Node = {
  id: string;
  label: string;
  category: NodeCategory;
  x: number;
  y: number;
};

type Edge = { a: string; b: string };

const NODES: Node[] = [
  { id: "react",     label: "React",         category: "Frontend", x: 148, y: 90  },
  { id: "nextjs",    label: "Next.js",       category: "Frontend", x: 230, y: 65  },
  { id: "ts",        label: "TypeScript",    category: "Frontend", x: 270, y: 145 },
  { id: "tailwind",  label: "Tailwind",      category: "Frontend", x: 165, y: 175 },
  { id: "framer",    label: "Framer Motion", category: "Frontend", x: 95,  y: 145 },
  { id: "vite",      label: "Vite",          category: "Frontend", x: 115, y: 55  },

  { id: "nodejs",    label: "Node.js",       category: "Backend",  x: 650, y: 70  },
  { id: "express",   label: "Express",       category: "Backend",  x: 740, y: 95  },
  { id: "postgres",  label: "PostgreSQL",    category: "Backend",  x: 775, y: 175 },
  { id: "supabase",  label: "Supabase",      category: "Backend",  x: 685, y: 190 },
  { id: "prisma",    label: "Prisma",        category: "Backend",  x: 600, y: 155 },
  { id: "rest",      label: "REST APIs",     category: "Backend",  x: 620, y: 80  },

  { id: "figma",     label: "Figma",         category: "Design",   x: 155, y: 335 },
  { id: "photoshop", label: "Photoshop",     category: "Design",   x: 85,  y: 380 },
  { id: "canva",     label: "Canva",         category: "Design",   x: 120, y: 450 },
  { id: "illust",    label: "Illustrator",   category: "Design",   x: 215, y: 450 },
  { id: "framerapp", label: "Framer",        category: "Design",   x: 260, y: 370 },
  { id: "spline",    label: "Spline",        category: "Design",   x: 220, y: 310 },

  { id: "git",       label: "Git",           category: "DevOps",   x: 640, y: 340 },
  { id: "github",    label: "GitHub",        category: "DevOps",   x: 740, y: 315 },
  { id: "vercel",    label: "Vercel",        category: "DevOps",   x: 780, y: 395 },
  { id: "docker",    label: "Docker",        category: "DevOps",   x: 715, y: 450 },
  { id: "vscode",    label: "VS Code",       category: "DevOps",   x: 615, y: 420 },
  { id: "linux",     label: "Linux",         category: "DevOps",   x: 620, y: 350 },
];

const EDGES: Edge[] = [
  { a: "react",    b: "nextjs"    }, { a: "react",    b: "ts"       },
  { a: "react",    b: "framer"   }, { a: "nextjs",   b: "ts"       },
  { a: "nextjs",   b: "tailwind" }, { a: "ts",       b: "tailwind" },
  { a: "vite",     b: "react"    }, { a: "framer",   b: "tailwind" },

  { a: "nodejs",   b: "express"  }, { a: "nodejs",   b: "rest"     },
  { a: "express",  b: "rest"     }, { a: "postgres",  b: "supabase" },
  { a: "postgres",  b: "prisma"  }, { a: "supabase", b: "prisma"   },
  { a: "supabase", b: "nodejs"   },

  { a: "figma",    b: "photoshop" }, { a: "figma",    b: "framerapp" },
  { a: "figma",    b: "illust"   }, { a: "photoshop", b: "illust"   },
  { a: "canva",    b: "figma"    }, { a: "spline",   b: "framerapp" },
  { a: "spline",   b: "figma"    },

  { a: "git",      b: "github"   }, { a: "git",      b: "vscode"   },
  { a: "github",   b: "vercel"   }, { a: "vercel",   b: "docker"   },
  { a: "docker",   b: "linux"    }, { a: "linux",    b: "git"      },

  // Cross-cluster bridges
  { a: "nextjs",   b: "vercel"   }, { a: "react",    b: "figma"    },
  { a: "nodejs",   b: "docker"   }, { a: "supabase", b: "vercel"   },
  { a: "ts",       b: "prisma"   }, { a: "vscode",   b: "react"    },
];

const CATEGORY_COLOR: Record<NodeCategory, string> = {
  Frontend: "#60a5fa",
  Backend:  "#34d399",
  Design:   "#f472b6",
  DevOps:   "#facc15",
};

const LABEL_OFFSET: Record<NodeCategory, { dx: number; dy: number }> = {
  Frontend: { dx: 0, dy: -14 },
  Backend:  { dx: 0, dy: -14 },
  Design:   { dx: 0, dy:  18 },
  DevOps:   { dx: 0, dy:  18 },
};

// Pre-computed drift params per node (deterministic pseudo-random)
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

export default function TechNodeGraph() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<NodeCategory | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);

  useEffect(() => { if (inView) setRevealed(true); }, [inView]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width  / 2) / rect.width);
    mouseY.set((e.clientY - rect.top  - rect.height / 2) / rect.height);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); setHovered(null); };

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

      {/* Category filter buttons */}
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

      {/* 3D tilt wrapper */}
      <div style={{ perspective: "900px" }}>
        <motion.div
          ref={wrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        >
          <svg
            viewBox="0 0 900 510"
            style={{ width: "100%", height: "auto", overflow: "visible", display: "block" }}
            aria-label="Tech stack node graph"
            role="img"
          >
            {/* Category watermarks */}
            {([
              { label: "Frontend", x: 187, y: 26, cat: "Frontend" as NodeCategory },
              { label: "Backend",  x: 693, y: 26, cat: "Backend"  as NodeCategory },
              { label: "Design",   x: 175, y: 497, cat: "Design"  as NodeCategory },
              { label: "DevOps",   x: 700, y: 497, cat: "DevOps"  as NodeCategory },
            ]).map((g) => (
              <text
                key={g.label}
                x={g.x} y={g.y}
                textAnchor="middle"
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  fill: CATEGORY_COLOR[g.cat],
                  letterSpacing: "0.25em",
                  opacity: revealed
                    ? (activeCategory == null || activeCategory === g.cat ? 0.55 : 0.1)
                    : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {g.label.toUpperCase()}
              </text>
            ))}

            {/* Edges */}
            {EDGES.map((e, i) => {
              const na = NODES.find((n) => n.id === e.a)!;
              const nb = NODES.find((n) => n.id === e.b)!;
              const active = edgeActive(e);
              return (
                <line
                  key={i}
                  x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={active ? CATEGORY_COLOR[na.category] : "currentColor"}
                  strokeOpacity={edgeOpacity(e)}
                  strokeWidth={active ? 1.5 : 1}
                  style={{ transition: "stroke-opacity 0.2s ease, stroke-width 0.2s ease" }}
                />
              );
            })}

            {/* Nodes with drift */}
            {NODES.map((node, i) => {
              const d = DRIFT[i];
              const color = CATEGORY_COLOR[node.category];
              const opacity = nodeOpacity(node);
              const isHov = hovered === node.id;
              const off = LABEL_OFFSET[node.category];

              return (
                <motion.g
                  key={node.id}
                  animate={revealed ? {
                    x: [0, d.ax, d.ax * 0.3, -d.ax * 0.7, 0],
                    y: [0, d.ay * 0.5, d.ay, -d.ay * 0.4, 0],
                  } : { x: 0, y: 0 }}
                  transition={{
                    duration: d.period,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: d.delay,
                  }}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Glow ring on hover */}
                  {isHov && (
                    <circle cx={node.x} cy={node.y} r={16} fill={color} fillOpacity={0.15} />
                  )}

                  {/* Node dot */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity } : { opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025 }}
                    r={isHov ? 7 : 5}
                    fill={color}
                    style={{ transition: "fill-opacity 0.2s ease" }}
                  />

                  {/* Label */}
                  <motion.text
                    x={node.x + off.dx}
                    y={node.y + off.dy}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity } : { opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025 + 0.12 }}
                    style={{
                      fontFamily: MONO,
                      fontSize: isHov ? 10 : 9,
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

    </div>
  );
}
