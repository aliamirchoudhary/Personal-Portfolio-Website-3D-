"use client"

import { useState } from "react"

/**
 * WebCraftLogo
 * ------------
 * Animated hexagon "W" logo (pointy-top orientation — a corner sits on top).
 *
 * Animation timeline (total ~3s, under 4s):
 *   - The whole mark (W + both hexagons) fades in from small to full size
 *     SIMULTANEOUSLY (0s -> 2.5s). The W never appears before the polygons.
 *   - While scaling, the two hexagons rotate in OPPOSITE directions
 *     (outer clockwise, inner counter-clockwise) and spin a little faster
 *     (720deg total) from 0s -> 3s.
 *   - Rotation keeps going ~0.5s AFTER the scale finishes (2.5s -> 3s)
 *     so the spin is noticeable.
 *   - Each hexagon rotates a whole number of turns (720deg), so the final
 *     shape is pixel-identical to the static logo (shape preserved throughout).
 *
 * Props:
 *   size   -> pixel size of the square logo (default 200). Resize freely
 *             for navbar / footer / watermark use.
 *   color  -> accent (mint) color of the strokes + W.
 *   replay -> show a small replay button (handy while testing locally).
 */
export default function WebCraftLogo({
  size = 200,
  color = "#99ffcc",
  replay = true,
}) {
  // `runId` is used as a React key to remount the SVG and replay the animation.
  const [runId, setRunId] = useState(0)

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Scoped styles + font import. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');

        @keyframes wc-pop-in {
          0%   { transform: scale(0.18); opacity: 0; }
          70%  { opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }

        /* Spins at a CONSTANT (medium) speed for most of the run, then
           gently eases to a stop in the final ~0.5s — so it doesn't look
           like it abruptly froze. The per-keyframe timing functions give
           constant speed first (linear) then deceleration (ease-out). */
        @keyframes wc-spin-cw {
          0%      { transform: rotate(0deg);   animation-timing-function: linear; }
          83.333% { transform: rotate(660deg); animation-timing-function: ease-out; }
          100%    { transform: rotate(720deg); }
        }

        @keyframes wc-spin-ccw {
          0%      { transform: rotate(0deg);    animation-timing-function: linear; }
          83.333% { transform: rotate(-660deg); animation-timing-function: ease-out; }
          100%    { transform: rotate(-720deg); }
        }

        /* A light highlight that sweeps ("traces") across the W partway
           through the spin, then fades — final W is the plain solid color. */
        @keyframes wc-trace-fade {
          0%   { opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { opacity: 0; }
        }

        /* The group that scales + fades. transform-origin centered.
           Pop-in is a touch slower now (2.5s). */
        .wc-mark {
          transform-origin: 100px 100px;
          animation: wc-pop-in 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Outer hexagon: clockwise, finishes ~0.5s after the scale.
           Linear timing -> constant speed: it's already spinning at full
           speed the instant it appears (no slow-to-fast ramp). */
        .wc-hex-outer {
          transform-origin: 100px 100px;
          animation: wc-spin-cw 3s linear forwards;
        }

        /* Inner hexagon: counter-clockwise, also constant speed. */
        .wc-hex-inner {
          transform-origin: 100px 100px;
          animation: wc-spin-ccw 3s linear forwards;
        }

        .wc-w {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -1px;
          user-select: none;
        }

        /* The traced highlight overlay on the W. It rides on the spin
           timeline so the sweep happens WHILE the polygons are still
           rotating, then disappears before they stop. */
        .wc-w-trace {
          font-family: 'Montserrat', system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -1px;
          user-select: none;
          animation: wc-trace-fade 3s ease-in-out forwards;
        }

        /* Move the highlight band left -> right across the W. */
        @keyframes wc-trace-sweep {
          from { transform: translateX(-60px); }
          to   { transform: translateX(60px); }
        }
        .wc-trace-band {
          animation: wc-trace-sweep 3s ease-in-out forwards;
        }
      `}</style>

      <svg
        key={runId}
        width={size}
        height={size}
        viewBox="0 0 200 200"
        role="img"
        aria-label="WebCraft logo"
      >
        <defs>
          {/* A soft vertical band of light used to "trace" across the W. */}
          <linearGradient id="wc-trace-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="wc-mark">
          {/* Outer hexagon — POINTY TOP (corner on top), r = 70 */}
          <polygon
            className="wc-hex-outer"
            points="100,30 160.6,65 160.6,135 100,170 39.4,135 39.4,65"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Inner hexagon — POINTY TOP, r = 50.
              Faint translucent fill (#e8e8e8) sits behind the W. */}
          <polygon
            className="wc-hex-inner"
            points="100,50 143.3,75 143.3,125 100,150 56.7,125 56.7,75"
            fill="#e8e8e8"
            fillOpacity="0.18"
            stroke={color}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          <defs>
            {/* Mask shaped like the W — the sweeping band only shows
                where the W is, so the light appears to trace the letter. */}
            <mask id="wc-w-mask">
              <text
                x="100"
                y="101"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="46"
                fill="#ffffff"
                style={{
                  fontFamily: "'Montserrat', system-ui, sans-serif",
                  fontWeight: 900,
                  letterSpacing: "-1px",
                }}
              >
                W
              </text>
            </mask>
          </defs>

          {/* The W — smaller, with breathing room from the inner hexagon.
              Stays upright; fades/scales in with the group only. */}
          <text
            className="wc-w"
            x="100"
            y="101"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="46"
            fill={color}
          >
            W
          </text>

          {/* Light trace overlay: a bright band that sweeps across, masked
              to the W shape. Fades out before the polygons stop. */}
          <g className="wc-w-trace" mask="url(#wc-w-mask)">
            <rect
              className="wc-trace-band"
              x="70"
              y="70"
              width="60"
              height="60"
              fill="url(#wc-trace-grad)"
            />
          </g>
        </g>
      </svg>

      {replay && (
        <button
          type="button"
          onClick={() => setRunId((n) => n + 1)}
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 13,
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${color}`,
            background: "transparent",
            color: color,
            cursor: "pointer",
          }}
        >
          Replay animation
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Optional demo wrapper so you can run this file directly and preview */
/* it on a dark background like your loading screen. Delete if unused. */
/* ------------------------------------------------------------------ */
export function WebCraftLogoDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1c1f1d",
      }}
    >
      <WebCraftLogo size={240} />
    </div>
  )
}
