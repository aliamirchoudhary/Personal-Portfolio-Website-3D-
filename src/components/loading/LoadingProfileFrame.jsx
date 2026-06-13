import { useEffect, useRef } from "react"

/**
 * LoadingProfileFrame
 * A self-contained portfolio loading-screen profile frame.
 *
 * Props:
 *   - imageSrc?: string  -> URL for the profile picture. Falls back to a gray placeholder.
 *   - name?: string      -> Optional name rendered below the frame.
 *
 * Drop this file anywhere in a React project and render <LoadingProfileFrame />.
 * Tailwind is optional — all critical styling is inlined via the injected <style> tag.
 */

const STYLE_ID = "loading-profile-frame-styles"

const css = `
/* ---- Fonts ---- */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

/* ---- Keyframes ---- */

/* 1. Mount fade-in + scale */
@keyframes lpf-fade-in {
  0%   { opacity: 0; transform: scale(0.85); }
  100% { opacity: 1; transform: scale(1); }
}

/* 2. Outer glow pulse (sinusoidal ease via cubic-bezier + alternate) */
@keyframes lpf-glow-pulse {
  0% {
    box-shadow: 0 0 30px #7c3aed, 0 0 60px #7c3aed50;
    border-color: #7c3aed80;
  }
  100% {
    box-shadow: 0 0 50px #a78bfa, 0 0 90px #a78bfa70;
    border-color: #a78bfacc;
  }
}

/* 2b. Slow ring rotation */
@keyframes lpf-rotate {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 3. Light sweep — rotating radar arc */
@keyframes lpf-sweep {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 4. Periodic RGB-blur / jitter glitch fx — mostly idle, brief burst every 4s */
@keyframes lpf-photo-fx {
  0%, 84%, 100% {
    filter: blur(0px) saturate(1);
    transform: translate3d(0, 0, 0);
  }
  86% {
    filter: blur(1.5px) drop-shadow(-3px 0 0 #06b6d4) drop-shadow(3px 0 0 #f43f5e) saturate(1.4);
    transform: translate3d(-2px, 1px, 0);
  }
  88% {
    filter: blur(2.5px) drop-shadow(3px 0 0 #06b6d4) drop-shadow(-3px 0 0 #f43f5e) saturate(1.5);
    transform: translate3d(2px, -1px, 0);
  }
  90% {
    filter: blur(1px) drop-shadow(-2px 0 0 #a78bfa) saturate(1.2);
    transform: translate3d(-1px, 0, 0);
  }
  92% {
    filter: blur(0px) saturate(1);
    transform: translate3d(0, 0, 0);
  }
}

/* 5. Inner glow wave — breathing radial light */
@keyframes lpf-inner-wave {
  0%   { opacity: 0.06; transform: scale(0.8); }
  100% { opacity: 0.18; transform: scale(1.1); }
}

/* N/S/E/W dot glow */
@keyframes lpf-dot-glow {
  0%   { box-shadow: 0 0 6px #7c3aed, 0 0 10px #7c3aed80; opacity: 0.7; }
  100% { box-shadow: 0 0 12px #a78bfa, 0 0 20px #a78bfaaa; opacity: 1; }
}

/* ---- Layout / scene ---- */
.lpf-scene {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  background: #0a0a0f;
  font-family: 'Inter', system-ui, sans-serif;
}

.lpf-root {
  position: relative;
  width: 240px;
  height: 240px;
  /* Lift the frame up by ~15% of the viewport height */
  margin-top: -15vh;
  will-change: transform, opacity;
  animation: lpf-fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Glowing pulsing + rotating outer ring */
.lpf-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid #7c3aed80;
  will-change: box-shadow, border-color, transform;
  animation:
    lpf-glow-pulse 1.5s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate,
    lpf-rotate 9s linear infinite;
}

/* Inner 1px ring */
.lpf-ring-inner {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  border: 1px solid #7c3aed80;
  pointer-events: none;
}

/* Light sweep arc */
.lpf-sweep {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  will-change: transform;
  animation: lpf-sweep 2s linear infinite;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    transparent 300deg,
    rgba(167, 139, 250, 0.0) 320deg,
    rgba(167, 139, 250, 0.55) 350deg,
    rgba(241, 245, 249, 0.85) 360deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px));
  pointer-events: none;
}

/* Image clip container */
.lpf-photo-wrap {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  overflow: hidden;
  background: #12121a;
}

.lpf-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 0% 15%;
  display: block;
  will-change: filter, transform;
  animation: lpf-photo-fx 4s ease-in-out infinite;
}

.lpf-photo-placeholder {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 38%, #2a2a3a, #15151f);
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: filter, transform;
  animation: lpf-photo-fx 4s ease-in-out infinite;
}

/* Inner breathing radial glow */
.lpf-inner-wave {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle at center, #7c3aed 0%, transparent 65%);
  will-change: opacity, transform;
  animation: lpf-inner-wave 3s ease-in-out infinite alternate;
}

/* N/S/E/W marker dots */
.lpf-dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a78bfa;
  will-change: box-shadow, opacity;
  animation: lpf-dot-glow 1.5s ease-in-out infinite alternate;
}
.lpf-dot.n { top: -3px;  left: 50%; transform: translateX(-50%); }
.lpf-dot.s { bottom: -3px; left: 50%; transform: translateX(-50%); }
.lpf-dot.e { right: -3px; top: 50%; transform: translateY(-50%); }
.lpf-dot.w { left: -3px;  top: 50%; transform: translateY(-50%); }

/* Name text below */
.lpf-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.5rem;
  color: #f1f5f9;
  animation: lpf-fade-in 0.8s ease 0.2s both;
}
.lpf-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-top: 6px;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .lpf-root, .lpf-ring, .lpf-sweep, .lpf-photo, .lpf-photo-placeholder,
  .lpf-inner-wave, .lpf-dot, .lpf-name {
    animation: none !important;
  }
}
`

export default function LoadingProfileFrame({ imageSrc, name = "Your Name" }) {
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    if (typeof document === "undefined") return
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement("style")
      el.id = STYLE_ID
      el.textContent = css
      document.head.appendChild(el)
    }
    injected.current = true
  }, [])

  return (
    <div className="lpf-scene">
      <div className="lpf-root" role="img" aria-label="Loading profile">
        {/* Inner breathing radial glow */}
        <div className="lpf-inner-wave" aria-hidden="true" />

        {/* Photo */}
        <div className="lpf-photo-wrap">
          {imageSrc ? (
            <img className="lpf-photo" src={imageSrc} alt="" crossOrigin="anonymous" />
          ) : (
            <div className="lpf-photo-placeholder" aria-hidden="true" />
          )}
        </div>

        {/* Glowing pulsing + rotating ring */}
        <div className="lpf-ring" aria-hidden="true">
          <div className="lpf-ring-inner" />
          {/* N/S/E/W markers ride along with the rotating ring */}
          <span className="lpf-dot n" />
          <span className="lpf-dot s" />
          <span className="lpf-dot e" />
          <span className="lpf-dot w" />
        </div>

        {/* Radar light sweep */}
        <div className="lpf-sweep" aria-hidden="true" />
      </div>

      {/* Name text below the frame — commented out, picture only */}
      {/*
      <div style={{ textAlign: "center" }}>
        <div className="lpf-name">{name}</div>
        <div className="lpf-label">Loading Portfolio</div>
      </div>
      */}
    </div>
  )
}
