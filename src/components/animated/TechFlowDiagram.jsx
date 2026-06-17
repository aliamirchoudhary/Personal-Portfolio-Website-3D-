import React, { useRef, useEffect, useMemo } from "react"

/**
 * TechFlowDiagram
 * Drop into any React app (Vite / CRA / Next.js) and render <TechFlowDiagram />
 */

// ---- palette -------------------------------------------------------------
const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  glow: "#a78bfa",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
  line: "#7c3aed",
}

// ---- viewBox layout ------------------------------------------------------
const VB_W = 660
const VB_H = 580

const NODE_W = 116
const NODE_H = 62

const API = { x: VB_W / 2, y: VB_H / 2, w: 168, h: 86, label: "API", sub: "GATEWAY" }

const MODULES = [
  { id: "cloud",  x: 120, y: 90, label: "CLOUD",      icon: "cloud"  },
  { id: "repo",   x: 268, y: 90, label: "REPOSITORY", icon: "repo"   },
  { id: "db",     x: 392, y: 90, label: "DATABASE",   icon: "db"     },
  { id: "ai",     x: 540, y: 90, label: "AI MODULE",  icon: "ai"     },
]

const CLIENT = { id: "client", x: VB_W / 2, y: VB_H - 80, label: "CLIENT", icon: "client" }

// ---- inline SVG icons ----------------------------------------------------
function Icon({ name, size = 22, color }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }
  switch (name) {
    case "client":
      return (
        <svg {...common}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )
    case "cloud":
      return (
        <svg {...common}>
          <path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.34 9.5 4 4 0 0 0 7 19h10.5Z" />
        </svg>
      )
    case "repo":
      return (
        <svg {...common}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        </svg>
      )
    case "db":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      )
    case "ai":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 9h6v6H9zM9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
        </svg>
      )
    case "api":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="7" rx="1.5" />
          <rect x="3" y="13" width="18" height="7" rx="1.5" />
          <path d="M7 7.5h.01M7 16.5h.01M11 7.5h4M11 16.5h4" />
        </svg>
      )
    default:
      return null
  }
}

export default function TechFlowDiagram() {
  const lineRefs = useRef([])
  const nodeRefs = useRef({})
  const rafRef = useRef(0)

  const edges = useMemo(() => {
    const off = 3.6
    const make = (id, from, to) => {
      const dx = to.x - from.x
      const dy = to.y - from.y
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len
      const py = dx / len
      return {
        id,
        len,
        fwd: {
          a: { x: from.x + px * off, y: from.y + py * off },
          b: { x: to.x   + px * off, y: to.y   + py * off },
        },
        bwd: {
          a: { x: to.x   - px * off, y: to.y   - py * off },
          b: { x: from.x - px * off, y: from.y - py * off },
        },
      }
    }

    const list = []
    const topY = API.y - API.h / 2
    const n = MODULES.length
    MODULES.forEach((m, i) => {
      const ax = API.x - API.w / 2 + (API.w * (i + 1)) / (n + 1)
      list.push(make(m.id, { x: m.x, y: m.y + NODE_H / 2 }, { x: ax, y: topY }))
    })
    list.push(
      make(
        "client",
        { x: CLIENT.x, y: API.y + API.h / 2 },
        { x: CLIENT.x, y: CLIENT.y - NODE_H / 2 },
      ),
    )
    return list
  }, [])

  useEffect(() => {
    const PERIOD = 1500
    const SEG = 30
    const start = performance.now()

    const tick = (now) => {
      const base = (now - start) / PERIOD

      edges.forEach((e, i) => {
        const refs = lineRefs.current[i]
        if (!refs) return

        const total = e.len + SEG
        const fwdPhase = (base + i * 0.16) % 1
        const bwdPhase = (base + i * 0.16 + 0.5) % 1

        if (refs.fwd) {
          refs.fwd.setAttribute("stroke-dasharray", `${SEG} ${e.len}`)
          refs.fwd.setAttribute("stroke-dashoffset", (SEG - fwdPhase * total).toFixed(2))
        }
        if (refs.bwd) {
          refs.bwd.setAttribute("stroke-dasharray", `${SEG} ${e.len}`)
          refs.bwd.setAttribute("stroke-dashoffset", (SEG - bwdPhase * total).toFixed(2))
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [edges])

  const pct = (v, total) => `${(v / total) * 100}%`

  const renderNode = (node, accent) => (
    <div
      key={node.id}
      ref={(el) => { nodeRefs.current[node.id] = el }}
      className="tfd-node"
      style={{
        position: "absolute",
        left: pct(node.x, VB_W),
        top: pct(node.y, VB_H),
        transform: "translate(-50%, -50%)",
        width: pct(NODE_W, VB_W),
        height: pct(NODE_H, VB_H),
        minWidth: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 16,
        border: `1px solid #ffffff14`,
        background: "rgba(18, 18, 26, 0.55)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: `0 0 0 1px ${accent}22, 0 8px 30px rgba(0,0,0,0.45), 0 0 22px ${accent}26`,
      }}
    >
      <span style={{ color: accent, display: "flex" }}>
        <Icon name={node.icon} color={accent} />
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 10,
          letterSpacing: "0.06em",
          color: COLORS.textSecondary,
          whiteSpace: "nowrap",
        }}
      >
        {node.label}
      </span>
    </div>
  )

  return (
    <div
      className="tfd-wrap"
      style={{
        position: "relative",
        width: "100%",
        background: COLORS.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&family=Space+Grotesk:wght@600;700&display=swap');
        @keyframes tfd-breathe {
          0%, 100% { box-shadow: 0 0 0 1px #7c3aed22, 0 8px 30px rgba(0,0,0,0.45), 0 0 18px #7c3aed22; }
          50%       { box-shadow: 0 0 0 1px #a78bfa33, 0 8px 30px rgba(0,0,0,0.45), 0 0 26px #a78bfa3a; }
        }
        .tfd-node { animation: tfd-breathe 4s ease-in-out infinite; will-change: box-shadow; }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 760,
          aspectRatio: `${VB_W} / ${VB_H}`,
        }}
      >
        {/* SVG connections + travelling light pulses */}
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          height="100%"
          style={{ position: "absolute", inset: 0, display: "block", overflow: "hidden" }}
        >
          <defs>
            <marker
              id="tfd-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.primary} fillOpacity="0.55" />
            </marker>
          </defs>

          {edges.map((e, i) => (
            <g key={e.id}>
              {/* forward base line */}
              <line
                x1={e.fwd.a.x} y1={e.fwd.a.y}
                x2={e.fwd.b.x} y2={e.fwd.b.y}
                stroke={COLORS.line}
                strokeOpacity="0.18"
                strokeWidth="1.4"
                strokeLinecap="round"
                markerEnd="url(#tfd-arrow)"
              />
              {/* forward travelling light (cyan) */}
              <line
                ref={(el) => {
                  if (!lineRefs.current[i]) lineRefs.current[i] = {}
                  lineRefs.current[i].fwd = el
                }}
                x1={e.fwd.a.x} y1={e.fwd.a.y}
                x2={e.fwd.b.x} y2={e.fwd.b.y}
                stroke={COLORS.secondary}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
                style={{ filter: `drop-shadow(0 0 5px ${COLORS.secondary})` }}
              />

              {/* return base line */}
              <line
                x1={e.bwd.a.x} y1={e.bwd.a.y}
                x2={e.bwd.b.x} y2={e.bwd.b.y}
                stroke={COLORS.line}
                strokeOpacity="0.18"
                strokeWidth="1.4"
                strokeLinecap="round"
                markerEnd="url(#tfd-arrow)"
              />
              {/* return travelling light (lavender) */}
              <line
                ref={(el) => {
                  if (!lineRefs.current[i]) lineRefs.current[i] = {}
                  lineRefs.current[i].bwd = el
                }}
                x1={e.bwd.a.x} y1={e.bwd.a.y}
                x2={e.bwd.b.x} y2={e.bwd.b.y}
                stroke={COLORS.glow}
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
                style={{ filter: `drop-shadow(0 0 5px ${COLORS.glow})` }}
              />
            </g>
          ))}
        </svg>

        {/* center API box */}
        <div
          ref={(el) => { nodeRefs.current.api = el }}
          style={{
            position: "absolute",
            left: pct(API.x, VB_W),
            top: pct(API.y, VB_H),
            transform: "translate(-50%, -50%)",
            width: pct(API.w, VB_W),
            height: pct(API.h, VB_H),
            minWidth: 170,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            borderRadius: 16,
            border: `1px solid #ffffff1f`,
            background: "rgba(18, 18, 26, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: `0 0 0 1px ${COLORS.primary}33, 0 10px 40px rgba(0,0,0,0.55), 0 0 38px ${COLORS.primary}40`,
          }}
        >
          <span style={{ color: COLORS.glow, display: "flex" }}>
            <Icon name="api" size={26} color={COLORS.glow} />
          </span>
          <div style={{ textAlign: "center", lineHeight: 1.1 }}>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.02em",
                color: COLORS.textPrimary,
              }}
            >
              {API.label}
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                letterSpacing: "0.14em",
                color: COLORS.textSecondary,
              }}
            >
              {API.sub}
            </div>
          </div>
        </div>

        {/* module nodes (top) + client node (bottom) */}
        {MODULES.map((m) => renderNode(m, COLORS.secondary))}
        {renderNode(CLIENT, COLORS.glow)}
      </div>
    </div>
  )
}