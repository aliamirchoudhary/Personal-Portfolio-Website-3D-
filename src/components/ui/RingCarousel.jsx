"use client"

import { useState, useRef, useCallback, useEffect } from "react"

/* ------------------------------------------------------------------ *
 *  THEME TOKENS (from global style rules)
 * ------------------------------------------------------------------ */
const THEME = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  glow: "#a78bfa",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
  border: "rgba(255,255,255,0.10)",
}

const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"

/* ------------------------------------------------------------------ *
 *  FONT INJECTOR — loads Google Fonts once so the file is portable.
 * ------------------------------------------------------------------ */
function useGoogleFonts() {
  useEffect(() => {
    const id = "ring-carousel-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
    document.head.appendChild(link)
  }, [])
}

const FONT_DISPLAY = '"Space Grotesk", system-ui, sans-serif'
const FONT_BODY = '"Inter", system-ui, sans-serif'
const FONT_MONO = '"JetBrains Mono", ui-monospace, monospace'

/* ------------------------------------------------------------------ *
 *  RING CAROUSEL
 * ------------------------------------------------------------------ */
function RingCarousel({ cards = [], accentColor = THEME.primary, initialCenter }) {
  useGoogleFonts()

  const [center, setCenter] = useState(initialCenter ?? 0) // index of the card at "12 o'clock"
  const [hovered, setHovered] = useState(null) // offset of hovered card (-2..2)
  const [active, setActive] = useState(null) // card object for modal
  const stageRef = useRef(null)
  const [compact, setCompact] = useState(false)

  const dragState = useRef({ dragging: false, startX: 0, moved: false })
  const wheelLock = useRef(false)

  /* ---- read actual stage width so offsets stay within viewport ---- */
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const w = el.getBoundingClientRect().width
    setCompact(w < 320)
  }, [])

  const total = cards.length

  const step = useCallback(
    (dir) => {
      if (total === 0) return
      setCenter((c) => (c + dir + total) % total)
    },
    [total],
  )

  /* ---- circular offset of a card relative to the center card ---- */
  const offsetOf = (index) => {
    let diff = index - center
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return diff // ... -2,-1,0,1,2 ...
  }

  /* ---- pointer drag ---- */
  const onPointerDown = (e) => {
    dragState.current = { dragging: true, startX: e.clientX, moved: false }
  }
  const onPointerMove = (e) => {
    const s = dragState.current
    if (!s.dragging) return
    const dx = e.clientX - s.startX
    if (Math.abs(dx) > 60) {
      step(dx < 0 ? 1 : -1)
      s.startX = e.clientX
      s.moved = true
    }
  }
  const endDrag = () => {
    dragState.current.dragging = false
  }

  /* ---- horizontal wheel ---- */
  const onWheel = (e) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (Math.abs(delta) < 8 || wheelLock.current) return
    wheelLock.current = true
    step(delta > 0 ? 1 : -1)
    setTimeout(() => (wheelLock.current = false), 220)
  }

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e) => {
      if (active) {
        if (e.key === "Escape") setActive(null)
        return
      }
      if (e.key === "ArrowLeft") step(-1)
      if (e.key === "ArrowRight") step(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active, step])

  /* ---- per-card transform for the "looking outward from inside" ring ---- */
  const transformFor = (offset) => {
    // base values keyed by absolute offset
    const map = compact ? {
      0: { x: 0, z: -70, ry: 0, scale: 0.5, op: 1 },
      1: { x: 82, z: 30, ry: 20, scale: 0.76, op: 1 },
      2: { x: 84, z: 50, ry: 30, scale: 0.84, op: 1 },
    } : {
      0: { x: 0, z: -120, ry: 0, scale: 0.75, op: 1 },
      1: { x: 120, z: 40, ry: 25, scale: 1.0, op: 1 },
      2: { x: 210, z: 90, ry: 40, scale: 1.1, op: 1 },
    }
    const abs = Math.abs(offset)
    const sign = offset < 0 ? -1 : 1
    const base = map[abs] || { x: 280, z: 120, ry: 55, scale: 1.1, op: 0 }

    // hover push: neighbours of the hovered card shift away
    let push = 0
    let scaleBoost = 1
    if (hovered !== null) {
      if (hovered === offset) scaleBoost = 1.08
      else if (Math.abs(hovered - offset) === 1) push = offset < hovered ? -15 : 15
    }

    const x = sign * base.x + push
    const ry = sign * base.ry

    return {
      transform: `translateX(${x}px) translateZ(${base.z}px) rotateY(${ry}deg) scale(${base.scale * scaleBoost})`,
      opacity: base.op,
      zIndex: 100 - abs,
      pointerEvents: abs > 2 ? "none" : "auto",
    }
  }

  return (
    <div style={{ fontFamily: FONT_BODY, color: THEME.textPrimary, userSelect: "none" }}>
      {/* ---- stage ---- */}
      <div
        ref={stageRef}
        className="ring-carousel-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onWheel={onWheel}
        style={{
          width: 380,
          height: 340,
          margin: "0 auto",
          position: "relative",
          perspective: "1100px",
          cursor: "grab",
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cards.map((card, i) => {
            const offset = offsetOf(i)
            const t = transformFor(offset)
            const hide = Math.abs(offset) > 2
            return (
              <article
                key={card.id ?? i}
                onMouseEnter={() => !hide && setHovered(offset)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (dragState.current.moved) return
                  if (!hide) setActive(card)
                }}
                  style={{
                    position: "absolute",
                    width: 200,
                    height: 260,
                    borderRadius: 16,
                    padding: 20,
                    boxSizing: "border-box",
                    background: "rgba(18,18,26,0.65)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: `1px solid ${accentColor}30`,
                    boxShadow: `0 10px 40px -10px ${accentColor}55, 0 0 0 1px ${THEME.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    overflow: "hidden",
                    transformStyle: "preserve-3d",
                    transition: `transform 500ms ${EASE}, opacity 500ms ${EASE}, box-shadow 200ms ease-out`,
                    willChange: "transform, opacity",
                    cursor: "pointer",
                    ...t,
                  }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontSize: 24,
                    background: `${accentColor}22`,
                    border: `1px solid ${accentColor}40`,
                  }}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>

                <h3
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    fontSize: 19,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontFamily: FONT_BODY,
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: THEME.textSecondary,
                    margin: 0,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {card.shortDesc}
                </p>

                <span
                  style={{
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    fontFamily: FONT_MONO,
                    fontSize: 10,
                    letterSpacing: "0.05em",
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: `1px solid ${accentColor}40`,
                    background: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  {"// view details"}
                </span>
              </article>
            )
          })}
        </div>
      </div>

      {/* ---- arrow controls ---- */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 24 }}>
        <ArrowButton dir="left" accentColor={accentColor} onClick={() => step(-1)} />
        <ArrowButton dir="right" accentColor={accentColor} onClick={() => step(1)} />
      </div>

      {/* ---- modal ---- */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "grid",
            placeItems: "center",
            padding: 24,
            background: "rgba(10,10,15,0.9)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            animation: "ringFade 200ms ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(560px, 100%)",
              maxHeight: "85vh",
              borderRadius: 16,
              padding: 32,
              background: "rgba(18,18,26,0.85)",
              border: `1px solid ${accentColor}40`,
              boxShadow: `0 20px 80px -20px ${accentColor}88`,
              overflowY: "auto",
            }}
          >
            <button
          onClick={() => setActive(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') setActive(null) }}
          tabIndex={-1}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 34,
                height: 34,
                borderRadius: 8,
                border: `1px solid ${THEME.border}`,
                background: "transparent",
                color: THEME.textSecondary,
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
                transition: "all 0.2s",
                zIndex: 1,
              }}
              onMouseEnter={(e) => { e.target.style.color = THEME.textPrimary; e.target.style.borderColor = accentColor }}
              onMouseLeave={(e) => { e.target.style.color = THEME.textSecondary; e.target.style.borderColor = THEME.border }}
            >
              ×
            </button>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                marginBottom: 16,
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}40`,
              }}
              aria-hidden="true"
            >
              {active.icon}
            </div>

            <h2
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
                color: THEME.textPrimary,
              }}
            >
              {active.title}
            </h2>

            <div
              className="ring-modal-content"
              style={{
                fontFamily: FONT_BODY,
                fontSize: 15,
                lineHeight: 1.7,
                color: THEME.textSecondary,
                margin: 0,
                maxHeight: '50vh',
                overflowY: 'auto',
                paddingRight: 8,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: active.fullContent }} />
            </div>
            {active.links && active.links.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                {active.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 20px', borderRadius: 10,
                      background: `${accentColor}18`,
                      border: `1px solid ${accentColor}40`,
                      color: THEME.textPrimary,
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: FONT_BODY,
                      letterSpacing: '0.01em',
                      transition: 'all 0.25s ease, transform 0.15s ease',
                      boxShadow: `0 2px 8px ${accentColor}15`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `${accentColor}44`;
                      e.target.style.borderColor = accentColor;
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 20px ${accentColor}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = `${accentColor}18`;
                      e.target.style.borderColor = `${accentColor}40`;
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 2px 8px ${accentColor}15`;
                    }}
                  >
                    <i className="fas fa-arrow-up-right-from-square" style={{ fontSize: 11, color: accentColor }} />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes ringFade{from{opacity:0}to{opacity:1}}
        .ring-modal-content p { margin: 0 0 12px; }
        .ring-modal-content p:last-child { margin-bottom: 0; }
        .ring-modal-content strong,
        .ring-modal-content b { color: #f1f5f9; font-weight: 600; }
        .ring-modal-content ul { margin: 0 0 12px; padding-left: 20px; list-style: none; }
        .ring-modal-content ul li {
          position: relative;
          padding-left: 16px;
          margin-bottom: 6px;
          color: #94a3b8;
        }
        .ring-modal-content ul li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${accentColor};
          box-shadow: 0 0 6px ${accentColor}aa;
        }
        .ring-modal-content::-webkit-scrollbar,
        .ring-modal-content *::-webkit-scrollbar { width: 5px; }
        .ring-modal-content::-webkit-scrollbar-track,
        .ring-modal-content *::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }
        .ring-modal-content::-webkit-scrollbar-thumb,
        .ring-modal-content *::-webkit-scrollbar-thumb { background: ${accentColor}; border-radius: 10px; }
        .ring-modal-content::-webkit-scrollbar-thumb:hover,
        .ring-modal-content *::-webkit-scrollbar-thumb:hover { background: ${THEME.glow}; }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  ARROW BUTTON
 * ------------------------------------------------------------------ */
function ArrowButton({ dir, onClick, accentColor }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={dir === "left" ? "Previous" : "Next"}
      style={{
        width: 46,
        height: 46,
        borderRadius: 8,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        background: hover ? `${accentColor}22` : "rgba(18,18,26,0.65)",
        border: `1px solid ${hover ? accentColor : THEME.border}`,
        color: THEME.textPrimary,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: hover ? `0 0 20px -4px ${accentColor}aa` : "none",
        transition: "all 200ms ease-out",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  )
}

/* ------------------------------------------------------------------ *
 *  DEMO — sample data + page wrapper so the file runs standalone.
 *  (Render <RingCarousel cards={...} /> directly in your own app.)
 * ------------------------------------------------------------------ */
const SAMPLE_CARDS = [
  {
    id: 1,
    title: "Web Design",
    icon: "🎨",
    shortDesc: "Pixel-perfect interfaces with motion and depth.",
    fullContent:
      "End-to-end product design: research, wireframes, high-fidelity UI, and design systems. Built to scale across platforms with accessibility baked in.",
  },
  {
    id: 2,
    title: "Frontend Dev",
    icon: "⚡",
    shortDesc: "Fast, accessible React apps that feel alive.",
    fullContent:
      "Production-grade React, Next.js, and TypeScript. Performance budgets, smooth GPU-accelerated animation, and component architecture you can maintain.",
  },
  {
    id: 3,
    title: "3D & WebGL",
    icon: "🧊",
    shortDesc: "Immersive 3D scenes right in the browser.",
    fullContent:
      "Interactive 3D with Three.js and React Three Fiber — product configurators, hero scenes, and physics-driven experiences that load fast.",
  },
  {
    id: 4,
    title: "Branding",
    icon: "✦",
    shortDesc: "Identity systems with a distinct voice.",
    fullContent:
      "Logo, type, color, and motion guidelines that give your product a memorable, cohesive presence across every touchpoint.",
  },
  {
    id: 5,
    title: "Motion",
    icon: "🌀",
    shortDesc: "Choreographed micro-interactions & transitions.",
    fullContent:
      "Delightful, purposeful motion design — page transitions, scroll choreography, and micro-interactions tuned for 60fps.",
  },
  {
    id: 6,
    title: "Strategy",
    icon: "🧭",
    shortDesc: "Turning fuzzy ideas into shipping roadmaps.",
    fullContent:
      "Product strategy and technical direction: scoping, prioritization, and architecture decisions that keep teams moving fast.",
  },
]

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.textPrimary,
        fontFamily: FONT_BODY,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: "64px 16px",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: THEME.secondary,
          }}
        >
          {"// what i do"}
        </span>
        <h1
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "-0.03em",
            margin: "8px 0 0",
          }}
        >
          Services
        </h1>
      </header>

      <RingCarousel cards={SAMPLE_CARDS} accentColor={THEME.primary} />

      <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: THEME.textSecondary }}>
        drag · scroll · arrows · click a card
      </p>
    </main>
  )
}

export { RingCarousel }
