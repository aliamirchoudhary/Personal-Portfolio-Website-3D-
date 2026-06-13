import React, { useEffect, useMemo, useRef } from "react";

/* =========================================================================
   PerceptronAnimation
   - Single-file, self-contained React component (SVG + requestAnimationFrame).
   - A multi-layer feed-forward network. ONE input node fires at a time; the
     next input node only fires once the previous signal has reached layer 2.
     Each wave then propagates left -> right through the whole network. The
     mesh is always visible and each edge / node lights up as the wave crosses
     it, before passing the signal onward. The sequence loops continuously.
   - No external libs. Render <PerceptronAnimation /> or the default <Demo />.
   ========================================================================= */

/* ---- Palette (per global style rules) -------------------------------- */
const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed", // violet
  secondary: "#06b6d4", // cyan
  glow: "#a78bfa", // lavender
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
};

/* ---- Network shape & timing ------------------------------------------ */
const LAYERS = [4, 6, 6, 4, 2]; // nodes per layer
const GAP_DURATION = 0.85; // seconds for a signal to cross one layer gap
// A new input node fires every GAP_DURATION (i.e. when the previous signal
// reaches the 2nd layer), cycling through all input nodes forever.

/* ---- Geometry (compact) ---------------------------------------------- */
const VIEW_W = 640;
const VIEW_H = 480;
const PAD_X = 48;
const PAD_Y = 40;
const NODE_R = 16;

function buildPositions(layers) {
  const gaps = layers.length - 1;
  const gapX = (VIEW_W - PAD_X * 2) / gaps;
  return layers.map((count, li) => {
    const x = PAD_X + li * gapX;
    return Array.from({ length: count }, (_, ni) => {
      const t = count === 1 ? 0.5 : ni / (count - 1);
      return { x, y: PAD_Y + t * (VIEW_H - PAD_Y * 2) };
    });
  });
}

/* ---- Color helpers --------------------------------------------------- */
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpColor(a, b, t) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t);
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t);
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

export function PerceptronAnimation({ maxWidth = 560 }) {
  const positions = useMemo(() => buildPositions(LAYERS), []);
  const numInputs = LAYERS[0];
  const numGaps = LAYERS.length - 1;

  // Node metadata + element refs (parallel arrays).
  const nodeMeta = useMemo(() => {
    const out = [];
    positions.forEach((layer, li) =>
      layer.forEach((n, ni) => out.push({ layer: li, index: ni, cx: n.x, cy: n.y }))
    );
    return out;
  }, [positions]);

  // Edge metadata + element refs.
  const edgeMeta = useMemo(() => {
    const out = [];
    for (let i = 0; i < positions.length - 1; i++) {
      positions[i].forEach((src, si) => {
        positions[i + 1].forEach((dst) => {
          out.push({ gap: i, si, x1: src.x, y1: src.y, x2: dst.x, y2: dst.y });
        });
      });
    }
    return out;
  }, [positions]);

  const nodeEls = useRef([]);
  const edgeEls = useRef([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Static, gently lit fallback.
      nodeEls.current.forEach((el) => {
        if (!el) return;
        el.style.fill = COLORS.surface;
        el.style.stroke = COLORS.secondary;
        el.style.strokeOpacity = "0.5";
      });
      edgeEls.current.forEach((el) => {
        if (el) el.style.opacity = "0.18";
      });
      return;
    }

    const start = performance.now();
    const triangle = (x) => Math.max(0, 1 - Math.abs(x)); // peak 1 at x=0

    const frame = (now) => {
      const t = (now - start) / 1000;
      const g = t / GAP_DURATION; // global position measured in "gaps"

      // Active waves: wave k started at k * GAP_DURATION, front = g - k.
      // It is in-flight while front in [0, numGaps].
      const kMin = Math.floor(g - numGaps);
      const kMax = Math.ceil(g);

      // --- Nodes ---
      for (let m = 0; m < nodeMeta.length; m++) {
        const meta = nodeMeta[m];
        const el = nodeEls.current[m];
        if (!el) continue;
        let intensity = 0;
        for (let k = kMin; k <= kMax; k++) {
          if (k < 0) continue;
          const origin = ((k % numInputs) + numInputs) % numInputs;
          const front = g - k;
          if (front < -0.5 || front > numGaps + 0.5) continue;
          // Layer 0 only lights its own origin node; deeper layers light fully.
          if (meta.layer === 0 && meta.index !== origin) continue;
          const v = triangle((front - meta.layer) / 0.5);
          if (v > intensity) intensity = v;
        }
        const scale = 1 + 0.45 * intensity;
        el.style.fill = lerpColor(COLORS.surface, COLORS.primary, intensity);
        el.style.stroke = lerpColor(COLORS.secondary, COLORS.glow, intensity);
        el.style.strokeOpacity = (0.4 + 0.6 * intensity).toFixed(3);
        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.filter =
          intensity > 0.04
            ? `drop-shadow(0 0 ${(12 * intensity).toFixed(1)}px ${COLORS.glow})`
            : "none";
      }

      // --- Edges ---
      for (let m = 0; m < edgeMeta.length; m++) {
        const meta = edgeMeta[m];
        const el = edgeEls.current[m];
        if (!el) continue;
        let bestOpacity = 0;
        let bestProgress = 0;
        for (let k = kMin; k <= kMax; k++) {
          if (k < 0) continue;
          const origin = ((k % numInputs) + numInputs) % numInputs;
          const front = g - k;
          // Gap 0 edges only flow from the firing origin node.
          if (meta.gap === 0 && meta.si !== origin) continue;
          const p = front - meta.gap; // progress within this gap (0..1)
          if (p < 0 || p > 1) continue;
          const op = Math.sin(Math.PI * p); // 0 at ends, 1 mid-travel
          if (op > bestOpacity) {
            bestOpacity = op;
            bestProgress = p;
          }
        }
        el.style.opacity = bestOpacity.toFixed(3);
        el.style.strokeDashoffset = (100 * (1 - bestProgress)).toFixed(2);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [nodeMeta, edgeMeta, numInputs, numGaps]);

  const css = `
.perc-wrap { width: 100%; }
.perc-svg { display: block; width: 100%; height: auto; }
.perc-float { animation: percFloat 7s ease-in-out infinite; transform-origin: center; }
@keyframes percFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
.perc-edge-base { stroke: ${COLORS.textSecondary}; stroke-opacity: 0.16; stroke-width: 1; }
.perc-edge-flow {
  fill: none;
  stroke: ${COLORS.glow};
  stroke-width: 2.2;
  stroke-linecap: round;
  opacity: 0;
  filter: drop-shadow(0 0 5px ${COLORS.glow});
}
.perc-node {
  stroke-width: 2.4;
  fill: ${COLORS.surface};
  stroke: ${COLORS.secondary};
  transform-box: fill-box;
  transform-origin: center;
  will-change: transform, filter;
}
`;

  return (
    <div className="perc-wrap" style={{ maxWidth, margin: "0 auto" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <svg
        className="perc-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Animated multi-layer neural network: input nodes fire one at a time and the signal propagates left to right"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className="perc-float">
          {edgeMeta.map((e, i) => {
            const d = `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`;
            return (
              <g key={`e-${i}`}>
                <path className="perc-edge-base" d={d} />
                <path
                  className="perc-edge-flow"
                  d={d}
                  pathLength={100}
                  strokeDasharray="22 100"
                  ref={(el) => (edgeEls.current[i] = el)}
                />
              </g>
            );
          })}

          {nodeMeta.map((n, i) => (
            <circle
              key={`n-${i}`}
              className="perc-node"
              cx={n.cx}
              cy={n.cy}
              r={NODE_R}
              ref={(el) => (nodeEls.current[i] = el)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ---- Standalone demo (default export) -------------------------------- */
export default function Demo() {
  const fontsCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');
* { box-sizing: border-box; }
html, body, #root { height: 100%; }
body { margin: 0; }
`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(1000px 500px at 50% -10%, #15131f 0%, ${COLORS.bg} 60%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: fontsCss }} />
      <div
        style={{
          width: "min(620px, 100%)",
          background: "rgba(18, 18, 26, 0.55)",
          border: `1px solid ${COLORS.glow}1a`,
          borderRadius: 16,
          padding: "28px 24px",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: `0 0 0 1px #ffffff10, 0 30px 80px -30px ${COLORS.primary}55`,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: COLORS.secondary,
            marginBottom: 10,
          }}
        >
          // neural.signal.propagation
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontSize: 26,
            lineHeight: 1.1,
            color: COLORS.textPrimary,
            margin: "0 0 6px",
          }}
        >
          Multi-Layer Perceptron
        </h1>
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            lineHeight: 1.6,
            margin: "0 0 20px",
            maxWidth: 520,
          }}
        >
          Input nodes fire one at a time — the next only fires once the previous
          signal reaches the second layer. Each wave then travels through the
          mesh, lighting every connection and node as it passes.
        </p>
        <PerceptronAnimation />
      </div>
    </div>
  );
}
