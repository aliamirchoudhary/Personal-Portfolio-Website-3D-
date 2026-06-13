import React, { useState } from "react";

/**
 * MorphingCommsIcon
 * A single animated communication icon that cross-fades/morphs between
 * ChatBubble -> Envelope -> Phone -> SMS -> (loop), with:
 *  - rotating conic-gradient ring glow
 *  - gentle pulsing scale
 *  - orbiting glowing particles
 *  - hover: pause morph, intensify glow, speed up particles
 *
 * Self-contained: injects its own Google Fonts + CSS. Drop into any React app.
 * Default export is a full demo page so you can test it standalone.
 */

/* ----------------------------- Design tokens ----------------------------- */
const TOKENS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  glow: "#a78bfa",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
};

/* --------------------------- Inline SVG icon set -------------------------- */
/* Each icon shares the same 24x24 viewBox so cross-fades line up cleanly. */
const ICONS = [
  {
    key: "chat",
    label: "chat",
    // Speech / chat bubble
    path: "M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1Z",
  },
  {
    key: "mail",
    label: "mail",
    // Envelope
    path: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm.4 2L12 13l8.6-6",
  },
  {
    key: "phone",
    label: "phone",
    // Handset
    path: "M6.6 3.5c.4-.4 1.1-.4 1.5 0l2.1 2.1c.4.4.4 1 0 1.5L8.8 8.5c1 2.2 2.8 4 5 5l1.4-1.4c.4-.4 1.1-.4 1.5 0l2.1 2.1c.4.4.4 1.1 0 1.5l-1.6 1.6c-.8.8-2 1-3 .6C9.6 16.4 4.2 11 2.9 5.7c-.3-1 0-2.1.7-2.9l3-1Z",
  },
  {
    key: "sms",
    label: "sms",
    // Rounded SMS bubble with dots
    path: "M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4v-4a2 2 0 0 1-1-2V6a2 2 0 0 1 2-2Z",
  },
];

const HOLD_MS = 1500; // hold time per icon
const MORPH_MS = 400; // fade/scale transition duration

function MorphingCommsIcon({ size = 200 }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Advance the active icon on an interval; pause while hovered.
  React.useEffect(() => {
    if (hovered) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % ICONS.length);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [hovered]);

  const particles = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <style>{CSS}</style>
      <div
        className="mci-root"
        data-hovered={hovered ? "true" : "false"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: size, height: size }}
        aria-label="Animated communication icon"
        role="img"
      >
      {/* Rotating conic-gradient ring */}
      <div className="mci-ring" />

      {/* Glassmorphic inner disc */}
      <div className="mci-disc">
        {/* Orbiting particles */}
        <div className="mci-orbit">
          {particles.map((p) => (
            <span
              key={p}
              className="mci-particle"
              style={{
                transform: `rotate(${(360 / particles.length) * p}deg) translateX(70px)`,
              }}
            />
          ))}
        </div>

        {/* The morphing icon stack */}
        <div className="mci-icon-pulse">
          <svg
            className="mci-svg"
            viewBox="0 0 24 24"
            width="120"
            height="120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="mci-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.654
                          0 0 0 0 0.545
                          0 0 0 0 0.98
                          0 0 0 1 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {ICONS.map((icon, i) => (
              <path
                key={icon.key}
                d={icon.path}
                fill={TOKENS.primary}
                stroke={TOKENS.glow}
                strokeWidth="0.9"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#mci-glow)"
                className="mci-path"
                data-active={i === active ? "true" : "false"}
              />
            ))}
          </svg>
        </div>
      </div>

      <span className="mci-caption">{ICONS[active].label}</span>
    </div>
    </>
  );
}

/* --------------------------- Scoped CSS injection ------------------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

.mci-root {
  position: relative;
  display: grid;
  place-items: center;
  isolation: isolate;
}

/* Rotating conic ring glow */
.mci-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg, ${TOKENS.primary}, ${TOKENS.secondary}, ${TOKENS.primary});
  filter: blur(6px);
  opacity: 0.55;
  animation: mci-spin 4s linear infinite;
  will-change: transform;
  z-index: 0;
}
.mci-root[data-hovered="true"] .mci-ring {
  opacity: 0.85;
  filter: blur(9px);
}

/* Glassmorphic disc */
.mci-disc {
  position: relative;
  width: 78%;
  height: 78%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(18, 18, 26, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    inset 0 0 24px rgba(124, 58, 237, 0.25),
    0 0 38px rgba(124, 58, 237, 0.35);
  transition: box-shadow 300ms ease;
  z-index: 1;
}
.mci-root[data-hovered="true"] .mci-disc {
  box-shadow:
    inset 0 0 30px rgba(167, 139, 250, 0.45),
    0 0 60px rgba(124, 58, 237, 0.6);
}

/* Orbiting particles */
.mci-orbit {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  animation: mci-spin 9s linear infinite;
  will-change: transform;
}
.mci-root[data-hovered="true"] .mci-orbit {
  animation-duration: 3.5s;
}
.mci-particle {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${TOKENS.glow};
  box-shadow: 0 0 10px 2px ${TOKENS.glow};
}

/* Gentle pulse on the icon */
.mci-icon-pulse {
  display: grid;
  place-items: center;
  animation: mci-pulse 1.5s ease-in-out infinite;
  will-change: transform;
  z-index: 2;
}

.mci-svg { display: block; overflow: visible; }

/* Cross-fade + scale morph between icons */
.mci-path {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.8);
  transition: opacity ${MORPH_MS}ms ease, transform ${MORPH_MS}ms ease;
}
.mci-path[data-active="true"] {
  opacity: 1;
  transform: scale(1);
}

.mci-caption {
  position: absolute;
  bottom: -28px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${TOKENS.textSecondary};
}

@keyframes mci-spin {
  to { transform: rotate(360deg); }
}
@keyframes mci-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .mci-ring, .mci-orbit, .mci-icon-pulse { animation: none; }
}

/* ---- Demo page styling ---- */
.mci-demo {
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  gap: 28px;
  background:
    radial-gradient(900px 500px at 50% -10%, rgba(124,58,237,0.18), transparent 60%),
    ${TOKENS.bg};
  color: ${TOKENS.textPrimary};
  font-family: 'Inter', system-ui, sans-serif;
  padding: 48px 16px;
  text-align: center;
}
.mci-demo h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin: 0;
}
.mci-demo p {
  max-width: 38ch;
  margin: 0;
  line-height: 1.6;
  color: ${TOKENS.textSecondary};
}
.mci-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${TOKENS.secondary};
}
`;

/* --------------------------------- Demo ---------------------------------- */
export default function App() {
  return (
    <>
      <style>{CSS}</style>
      <main className="mci-demo">
        <span className="mci-tag">// get in touch</span>
        <h1>Let&apos;s talk.</h1>
        <MorphingCommsIcon size={220} />
        <p>
          A single icon that morphs through every way to reach me — chat, mail,
          call, and text. Hover to pause and watch it glow.
        </p>
      </main>
    </>
  );
}

export { MorphingCommsIcon };
