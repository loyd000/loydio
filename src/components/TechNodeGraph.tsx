"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const MONO = "'IBM Plex Mono', monospace";

type Node = {
  id: string;
  label: string;
  category: "Frontend" | "Backend" | "Design" | "DevOps";
  x: number;
  y: number;
};

type Edge = { a: string; b: string };

// Pre-positioned nodes in 4 cluster regions
// Viewbox: 0 0 900 500  — clusters in four quadrants
const NODES: Node[] = [
  // Frontend — top-left cluster  (~190, 130 center)
  { id: "react",    label: "React",         category: "Frontend", x: 148, y: 90 },
  { id: "nextjs",   label: "Next.js",       category: "Frontend", x: 230, y: 65 },
  { id: "ts",       label: "TypeScript",    category: "Frontend", x: 270, y: 145 },
  { id: "tailwind", label: "Tailwind",      category: "Frontend", x: 165, y: 175 },
  { id: "framer",   label: "Framer Motion", category: "Frontend", x: 95,  y: 145 },
  { id: "vite",     label: "Vite",          category: "Frontend", x: 115, y: 55  },

  // Backend — top-right cluster  (~680, 120 center)
  { id: "nodejs",   label: "Node.js",       category: "Backend",  x: 650, y: 70  },
  { id: "express",  label: "Express",       category: "Backend",  x: 740, y: 95  },
  { id: "postgres", label: "PostgreSQL",    category: "Backend",  x: 775, y: 175 },
  { id: "supabase", label: "Supabase",      category: "Backend",  x: 685, y: 190 },
  { id: "prisma",   label: "Prisma",        category: "Backend",  x: 600, y: 155 },
  { id: "rest",     label: "REST APIs",     category: "Backend",  x: 620, y: 80  },

  // Design — bottom-left cluster  (~195, 385 center)
  { id: "figma",    label: "Figma",         category: "Design",   x: 155, y: 335 },
  { id: "photoshop",label: "Photoshop",     category: "Design",   x: 85,  y: 380 },
  { id: "canva",    label: "Canva",         category: "Design",   x: 120, y: 450 },
  { id: "illust",   label: "Illustrator",   category: "Design",   x: 215, y: 450 },
  { id: "framerapp",label: "Framer",        category: "Design",   x: 260, y: 370 },
  { id: "spline",   label: "Spline",        category: "Design",   x: 220, y: 310 },

  // DevOps — bottom-right cluster  (~680, 390 center)
  { id: "git",      label: "Git",           category: "DevOps",   x: 640, y: 340 },
  { id: "github",   label: "GitHub",        category: "DevOps",   x: 740, y: 315 },
  { id: "vercel",   label: "Vercel",        category: "DevOps",   x: 780, y: 395 },
  { id: "docker",   label: "Docker",        category: "DevOps",   x: 715, y: 450 },
  { id: "vscode",   label: "VS Code",       category: "DevOps",   x: 615, y: 420 },
  { id: "linux",    label: "Linux",         category: "DevOps",   x: 620, y: 350 },
];

// Intra-cluster edges
const EDGES: Edge[] = [
  // Frontend cluster
  { a: "react",    b: "nextjs"   },
  { a: "react",    b: "ts"       },
  { a: "react",    b: "framer"   },
  { a: "nextjs",   b: "ts"       },
  { a: "nextjs",   b: "tailwind" },
  { a: "ts",       b: "tailwind" },
  { a: "vite",     b: "react"    },
  { a: "framer",   b: "tailwind" },

  // Backend cluster
  { a: "nodejs",   b: "express"  },
  { a: "nodejs",   b: "rest"     },
  { a: "express",  b: "rest"     },
  { a: "postgres", b: "supabase" },
  { a: "postgres", b: "prisma"   },
  { a: "supabase", b: "prisma"   },
  { a: "supabase", b: "nodejs"   },

  // Design cluster
  { a: "figma",    b: "photoshop"},
  { a: "figma",    b: "framerapp"},
  { a: "figma",    b: "illust"   },
  { a: "photoshop",b: "illust"   },
  { a: "canva",    b: "figma"    },
  { a: "spline",   b: "framerapp"},
  { a: "spline",   b: "figma"    },

  // DevOps cluster
  { a: "git",      b: "github"   },
  { a: "git",      b: "vscode"   },
  { a: "github",   b: "vercel"   },
  { a: "vercel",   b: "docker"   },
  { a: "docker",   b: "linux"    },
  { a: "linux",    b: "git"      },

  // Cross-cluster bridges
  { a: "nextjs",   b: "vercel"   },
  { a: "react",    b: "figma"    },
  { a: "nodejs",   b: "docker"   },
  { a: "supabase", b: "vercel"   },
  { a: "ts",       b: "prisma"   },
  { a: "vscode",   b: "react"    },
];

const CATEGORY_COLOR: Record<Node["category"], string> = {
  Frontend: "#60a5fa",
  Backend:  "#34d399",
  Design:   "#f472b6",
  DevOps:   "#facc15",
};

const LABEL_OFFSET: Record<Node["category"], { dx: number; dy: number }> = {
  Frontend: { dx: 0,    dy: -14 },
  Backend:  { dx: 0,    dy: -14 },
  Design:   { dx: 0,    dy:  18 },
  DevOps:   { dx: 0,    dy:  18 },
};

function getNeighbors(id: string): Set<string> {
  const s = new Set<string>();
  for (const e of EDGES) {
    if (e.a === id) s.add(e.b);
    if (e.b === id) s.add(e.a);
  }
  return s;
}

export default function TechNodeGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  const neighbors = hovered ? getNeighbors(hovered) : null;

  const isNodeActive = (id: string) =>
    hovered == null || hovered === id || (neighbors?.has(id) ?? false);

  const isEdgeActive = (e: Edge) =>
    hovered == null || e.a === hovered || e.b === hovered;

  return (
    <div ref={sectionRef} style={{ width: "100%" }}>
      <svg
        ref={ref}
        viewBox="0 0 900 510"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-label="Tech stack node graph"
        role="img"
      >
        {/* Category group labels */}
        {([
          { label: "Frontend", x: 187, y: 28, cat: "Frontend" },
          { label: "Backend",  x: 693, y: 28, cat: "Backend"  },
          { label: "Design",   x: 175, y: 495, cat: "Design"  },
          { label: "DevOps",   x: 700, y: 495, cat: "DevOps"  },
        ] as { label: string; x: number; y: number; cat: Node["category"] }[]).map((g) => (
          <text
            key={g.label}
            x={g.x}
            y={g.y}
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 9,
              fill: CATEGORY_COLOR[g.cat],
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              opacity: inView ? (hovered == null || g.cat === (NODES.find((n) => n.id === hovered)?.category) ? 0.6 : 0.15) : 0,
              transition: "opacity 0.25s ease",
            }}
          >
            {g.label.toUpperCase()}
          </text>
        ))}

        {/* Edges */}
        {EDGES.map((e, i) => {
          const na = NODES.find((n) => n.id === e.a)!;
          const nb = NODES.find((n) => n.id === e.b)!;
          const active = isEdgeActive(e);
          return (
            <line
              key={i}
              x1={na.x} y1={na.y}
              x2={nb.x} y2={nb.y}
              stroke={active && hovered ? CATEGORY_COLOR[na.category] : "currentColor"}
              strokeOpacity={active ? (hovered ? 0.45 : 0.15) : 0.04}
              strokeWidth={active && hovered ? 1.5 : 1}
              style={{ transition: "stroke-opacity 0.2s ease, stroke-width 0.2s ease" }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const color = CATEGORY_COLOR[node.category];
          const active = isNodeActive(node.id);
          const isHov = hovered === node.id;
          const off = LABEL_OFFSET[node.category];

          return (
            <g
              key={node.id}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Outer glow ring */}
              {isHov && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={16}
                  fill={color}
                  fillOpacity={0.12}
                  style={{ transition: "r 0.2s ease" }}
                />
              )}
              {/* Node dot */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isHov ? 7 : active ? 5 : 4}
                fill={active ? color : "currentColor"}
                fillOpacity={active ? 1 : 0.15}
                initial={{ r: 0, opacity: 0 }}
                animate={revealed ? { r: isHov ? 7 : active ? 5 : 4, opacity: 1 } : { r: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.025, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transition: "r 0.2s ease, fill-opacity 0.2s ease" }}
              />
              {/* Label */}
              <motion.text
                x={node.x + off.dx}
                y={node.y + off.dy}
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={revealed ? { opacity: active ? (isHov ? 1 : 0.65) : 0.15 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: i * 0.025 + 0.15 }}
                style={{
                  fontFamily: MONO,
                  fontSize: isHov ? 10 : 9,
                  fill: active ? color : "currentColor",
                  userSelect: "none",
                  pointerEvents: "none",
                  transition: "font-size 0.15s ease, fill 0.2s ease",
                }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: 24, marginTop: "1.5rem", flexWrap: "wrap" }}>
        {(Object.entries(CATEGORY_COLOR) as [Node["category"], string][]).map(([cat, color]) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontFamily: MONO, fontSize: 10, opacity: 0.5, letterSpacing: "0.15em" }}>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
