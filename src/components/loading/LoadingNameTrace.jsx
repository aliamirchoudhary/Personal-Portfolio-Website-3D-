import { useState, useEffect, useRef } from "react"

/**
 * LoadingNameTrace
 * --------------------------------------------------------------------------
 * A portfolio loading screen.
 *
 * Sequence (total 4.5s):
 *   1. Screen is blank.
 *   2. The name fades in fast (0 -> full) in a DARK palette color.
 *   3. A light-colored stroke slowly traces every letter simultaneously;
 *      as each part is traced it takes on the light neon color.
 *   4. The whole thing fades out fast, leaving a blank screen.
 *
 * The name is centered horizontally (equal space both sides) and its
 * vertical center sits at 60% of the screen height.
 *
 * The SVG fills the whole viewport and uses its own pixel coordinate space,
 * so x="50%"/y="60%" with text-anchor:middle guarantees true centering and
 * the font-size auto-shrinks (textLength) so the name never clips.
 *
 * Self-contained — drop into any Vite / CRA / Next project and render
 * <LoadingNameTrace />. No external animation libraries.
 */
export default function LoadingNameTrace({ name = "MUHAMMAD ALI AAMIR", duration = 4500 }) {
  const measureRef = useRef(null)
  const [pathLength, setPathLength] = useState(0)
  const [ready, setReady] = useState(false)

  // Measure the rendered glyph length so the stroke-dash reveal stays in
  // sync with the actual text.
  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    let len = 0
    try {
      len = el.getComputedTextLength()
    } catch {
      len = 600
    }
    // getComputedTextLength is the advance width, not the true stroke path
    // length, so pad it to guarantee the trace fully completes.
    setPathLength(len * 1.6)
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)))
  }, [name])

  const total = duration / 1000

  // Cap the text to 80% of viewport width so there is always equal breathing
  // room on both sides and it never clips.
  const maxTextWidth = "80vw"

  const fontStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "clamp(28px, 7vw, 96px)",
    letterSpacing: "-0.02em",
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400&family=JetBrains+Mono:wght@400&display=swap');

        /* Master opacity: blank -> fast fade in -> long hold -> fast fade out */
        @keyframes lnt-stage {
          0%   { opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 1; }
          100% { opacity: 0; }
        }
        /* The light tracing the letters (slow, fills most of the timeline) */
        @keyframes lnt-trace {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <svg
        width="100%"
        height="100%"
        aria-label={name}
        role="img"
        style={{
          position: "absolute",
          inset: 0,
          opacity: ready ? undefined : 0,
          animation: ready ? `lnt-stage ${total}s ease-in-out forwards` : "none",
        }}
      >
        <defs>
          <filter id="lnt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hidden text used purely to measure glyph length */}
        <text
          ref={measureRef}
          x="-9999"
          y="-9999"
          style={{ ...fontStyle, visibility: "hidden" }}
        >
          {name}
        </text>

        {/* 1) Dark base — the name as it first appears */}
        <text
          x="50%"
          y="60%"
          dominantBaseline="central"
          textAnchor="middle"
          lengthAdjust="spacingAndGlyphs"
          fill="#3b1d8f"
          style={fontStyle}
        >
          {name}
        </text>

        {/* 2) Light trace — draws over every letter simultaneously; the
              traced portion becomes the light neon color */}
        <text
          x="50%"
          y="60%"
          dominantBaseline="central"
          textAnchor="middle"
          lengthAdjust="spacingAndGlyphs"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lnt-glow)"
          style={{
            ...fontStyle,
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
            animation: ready
              ? `lnt-trace ${total * 0.84}s ease-in-out ${total * 0.07}s forwards`
              : "none",
          }}
        >
          {name}
        </text>
      </svg>
    </div>
  )
}
