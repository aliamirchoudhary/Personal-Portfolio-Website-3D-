"use client"

import { useId } from "react"

/**
 * HomeProfilePicture
 * The "resting home state" of the profile picture, settled on the right side
 * of the home section. Shares the double-ring frame from the loading screen.
 *
 * Props:
 *   - imageSrc: string  (the portrait to display)
 *   - size: number      (frame diameter in px, default 320)
 */
export default function HomeProfilePicture({ imageSrc, size = 320 }) {
  // Unique id so multiple instances don't collide on injected keyframes.
  const uid = useId().replace(/[:]/g, "")
  const cls = (name) => `hpp-${name}-${uid}`

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&display=swap');

    /* 1. FLOAT — gentle vertical bob */
    @keyframes ${cls("float")} {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-12px); }
    }

    /* 2. GLOW PULSE — outer ring box-shadow soft <-> intense */
    @keyframes ${cls("glow")} {
      0%, 100% {
        box-shadow:
          0 0 18px 2px #7c3aed55,
          0 0 36px 6px #a78bfa33,
          inset 0 0 12px 0 #7c3aed44;
      }
      50% {
        box-shadow:
          0 0 34px 6px #7c3aedaa,
          0 0 64px 14px #a78bfa66,
          inset 0 0 20px 2px #7c3aed77;
      }
    }

    /* 3. LIGHT SWEEP — rotating glowing arc around border */
    @keyframes ${cls("sweep")} {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* 4. PHOTO FX — periodic RGB-blur / jitter glitch burst (same as LoadingProfileFrame) */
    @keyframes ${cls("photoFx")} {
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

    /* 5. SHEEN SWEEP — diagonal light band glides across the glass periodically */
    @keyframes ${cls("sheen")} {
      0%, 70%, 100% { transform: translateX(-160%) rotate(18deg); }
      85%           { transform: translateX(160%) rotate(18deg); }
    }

    /* 6. VIGNETTE PULSE — subtle cinematic edge-darkening breathing */
    @keyframes ${cls("vignette")} {
      0%, 100% { opacity: 0.45; }
      50%      { opacity: 0.7; }
    }

    .${cls("root")} {
      position: relative;
      width: ${size}px;
      height: ${size}px;
      will-change: transform;
      animation: ${cls("float")} 3s ease-in-out infinite;
    }

    /* Outer glowing ring */
    .${cls("ring")} {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px solid #ffffff10;
      will-change: box-shadow;
      animation: ${cls("glow")} 2s ease-in-out infinite;
    }

    /* Rotating light-sweep arc (conic gradient masked to a thin ring) */
    .${cls("sweep")} {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(
        from 0deg,
        transparent 0deg,
        transparent 280deg,
        #a78bfa55 320deg,
        #a78bfaff 350deg,
        #06b6d4ff 360deg
      );
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px));
              mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px));
      will-change: transform;
      animation: ${cls("sweep")} 2.5s linear infinite;
    }

    /* Circular image clip */
    .${cls("photoWrap")} {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      overflow: hidden;
      background: #12121a;
      box-shadow: inset 0 0 24px 0 #00000088;
    }

    .${cls("photo")} {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 0% 15%;
      display: block;
      will-change: filter, transform;
      animation: ${cls("photoFx")} 4s ease-in-out infinite;
    }

    .${cls("placeholder")} {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 38%, #2a2a3a, #15151f);
      color: #94a3b8;
      font-family: "JetBrains Mono", monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
    }

    /* Cinematic vignette — darkens edges, breathes subtly */
    .${cls("vignette")} {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle at 50% 42%, transparent 52%, #00000099 100%);
      will-change: opacity;
      animation: ${cls("vignette")} 5s ease-in-out infinite;
    }

    /* Diagonal sheen band sweeping across the glass */
    .${cls("sheenWrap")} {
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      overflow: hidden;
      pointer-events: none;
    }
    .${cls("sheen")} {
      position: absolute;
      top: -50%;
      left: 0;
      width: 40%;
      height: 200%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        #ffffff10 40%,
        #a78bfa44 50%,
        #ffffff10 60%,
        transparent 100%
      );
      will-change: transform;
      animation: ${cls("sheen")} 5s ease-in-out infinite;
    }

    /* N/S/E/W glowing dot markers */
    .${cls("dot")} {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #a78bfa;
      box-shadow: 0 0 8px 2px #a78bfaaa, 0 0 14px 4px #7c3aed66;
    }
    .${cls("dotN")} { top: -4px;  left: 50%; transform: translateX(-50%); }
    .${cls("dotS")} { bottom: -4px; left: 50%; transform: translateX(-50%); }
    .${cls("dotE")} { right: -4px; top: 50%;  transform: translateY(-50%); background: #06b6d4; box-shadow: 0 0 8px 2px #06b6d4aa, 0 0 14px 4px #06b6d466; }
    .${cls("dotW")} { left: -4px;  top: 50%;  transform: translateY(-50%); background: #06b6d4; box-shadow: 0 0 8px 2px #06b6d4aa, 0 0 14px 4px #06b6d466; }

    @media (prefers-reduced-motion: reduce) {
      .${cls("root")},
      .${cls("ring")},
      .${cls("sweep")},
      .${cls("photo")},
      .${cls("sheen")},
      .${cls("vignette")} {
        animation: none !important;
      }
    }
  `

  return (
    <div className="flex w-full items-center justify-end">
      <style>{css}</style>
      <div className={cls("root")} role="img" aria-label="Profile picture">
        <div className={cls("ring")} />
        <div className={cls("sweep")} />

        <div className={cls("photoWrap")}>
          {imageSrc ? (
            /*// eslint-disable-next-line @next/next/no-img-element*/
            <img className={cls("photo")} src={imageSrc} alt="Portrait" crossOrigin="anonymous" />
          ) : (
            <div className={cls("placeholder")}>NO IMAGE</div>
          )}
        </div>

        <div className={cls("vignette")} />
        <div className={cls("sheenWrap")}>
          <div className={cls("sheen")} />
        </div>

        <span className={`${cls("dot")} ${cls("dotN")}`} />
        <span className={`${cls("dot")} ${cls("dotS")}`} />
        <span className={`${cls("dot")} ${cls("dotE")}`} />
        <span className={`${cls("dot")} ${cls("dotW")}`} />
      </div>
    </div>
  )
}
