import React from 'react'

/**
 * KryzectLogo
 * -----------
 * Self-contained Kryzect brand mark (navy backdrop + evolving outer ring +
 * one continuous center pencil-trace). Ported from the Kryzect design spec.
 *
 * Props:
 *   size   -> pixel size of the square logo (default 200).
 *   replay -> show a small replay button (handy while testing locally).
 */
export default function KryzectLogo({ size = 200, replay = true }) {
  const strokeWidth = 4
  const outerSpeed = 40 // seconds per full rotation

  const colorBackground = '#0A1120'
  const colorSurface = '#111A2E'
  const colorText = '#F5F7FF'
  const colorSecondary = '#8892AC'
  const colorAccent = '#8FAEFF'
  const colorAccentActive = '#6C97F7'
  const outerCircumference = 2 * Math.PI * 75

  const oArc = (outerCircumference * 120) / 360
  const oGap = (outerCircumference * 60) / 360
  const outerDashArray = `${oArc.toFixed(2)} ${oGap.toFixed(2)}`

  const uniqueId = `kryzect-logo-static`

  const outerDecay = 1.5

  const diamondLen = 45.3
  const lineLen = 60
  const arcLen = 49.5

  const lineDuration = 0.6
  const diamondDuration = 0.55
  const arcUpDuration = 0.55
  const arcDownDuration = 0.55

  const lineDelay = 0
  const diamondDelay = lineDelay + lineDuration
  const arcUpDelay = diamondDelay + diamondDuration
  const arcDownDelay = arcUpDelay + arcUpDuration

  const lineHead = 14
  const diamondHead = 11
  const arcHead = 12

  const centerStrokeWidth = strokeWidth * 1.15
  const centerGlowStrokeWidth = strokeWidth * 1.45

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'block', overflow: 'visible' }}
    >
      <defs>
        <filter id={`glow-${uniqueId}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="coreBlur" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="haloBlur" />
          <feMerge>
            <feMergeNode in="haloBlur" />
            <feMergeNode in="coreBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>{`
          @keyframes logoFadeIn {0% {opacity: 0;} 100% {opacity: 1;}}
          .logo-root-${uniqueId} {animation: logoFadeIn 0.5s ease-out forwards; opacity: 0;}

          @keyframes spinBaseOuter {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
          @keyframes spinDecayOuter {0% {transform: rotate(0deg);} 100% {transform: rotate(300deg);}}
          .track-outer-base-${uniqueId} {
            transform-origin: 100px 100px;
            animation: spinBaseOuter ${outerSpeed}s linear infinite;
          }
          .track-outer-decay-${uniqueId} {
            transform-origin: 100px 100px;
            animation: spinDecayOuter ${outerDecay}s cubic-bezier(0.16,1,0.3,1) forwards;
          }

          @keyframes traceLine {0% {stroke-dashoffset: ${lineLen + 1}; opacity: 0;} 1% {opacity: 1;} 100% {stroke-dashoffset: 0; opacity: 1;}}
          @keyframes traceDiamond {0% {stroke-dashoffset: ${diamondLen + 1}; opacity: 0;} 1% {opacity: 1;} 100% {stroke-dashoffset: 0; opacity: 1;}}
          @keyframes traceArcUp {0% {stroke-dashoffset: ${arcLen + 1}; opacity: 0;} 1% {opacity: 1;} 100% {stroke-dashoffset: 0; opacity: 1;}}
          @keyframes traceArcDown {0% {stroke-dashoffset: ${arcLen + 1}; opacity: 0;} 1% {opacity: 1;} 100% {stroke-dashoffset: 0; opacity: 1;}}

          @keyframes glowLine {0% {stroke-dashoffset: ${lineLen + 1}; opacity: 1;} 78% {stroke-dashoffset: -${lineHead}; opacity: 1;} 100% {stroke-dashoffset: -${lineHead}; opacity: 0;}}
          @keyframes glowDiamond {0% {stroke-dashoffset: ${diamondLen + 1}; opacity: 1;} 78% {stroke-dashoffset: -${diamondHead}; opacity: 1;} 100% {stroke-dashoffset: -${diamondHead}; opacity: 0;}}
          @keyframes glowArcUp {0% {stroke-dashoffset: ${arcLen + 1}; opacity: 1;} 78% {stroke-dashoffset: -${arcHead}; opacity: 1;} 100% {stroke-dashoffset: -${arcHead}; opacity: 0;}}
          @keyframes glowArcDown {0% {stroke-dashoffset: ${arcLen + 1}; opacity: 1;} 78% {stroke-dashoffset: -${arcHead}; opacity: 1;} 100% {stroke-dashoffset: -${arcHead}; opacity: 0;}}

          .trace-line-${uniqueId} {stroke-dasharray: ${lineLen} ${lineLen + 2}; stroke-dashoffset: ${lineLen + 1}; opacity: 0; animation: traceLine ${lineDuration}s ease-in-out ${lineDelay}s forwards;}
          .trace-diamond-${uniqueId} {stroke-dasharray: ${diamondLen} ${diamondLen + 2}; stroke-dashoffset: ${diamondLen + 1}; opacity: 0; animation: traceDiamond ${diamondDuration}s ease-in-out ${diamondDelay}s forwards;}
          .trace-arc-up-${uniqueId} {stroke-dasharray: ${arcLen} ${arcLen + 2}; stroke-dashoffset: ${arcLen + 1}; opacity: 0; animation: traceArcUp ${arcUpDuration}s ease-in-out ${arcUpDelay}s forwards;}
          .trace-arc-down-${uniqueId} {stroke-dasharray: ${arcLen} ${arcLen + 2}; stroke-dashoffset: ${arcLen + 1}; opacity: 0; animation: traceArcDown ${arcDownDuration}s ease-in-out ${arcDownDelay}s forwards;}

          .glow-line-${uniqueId} {stroke-dasharray: ${lineHead} ${lineLen + 2}; stroke-dashoffset: ${lineLen + 1}; animation: glowLine ${lineDuration}s ease-in-out ${lineDelay}s forwards; filter: brightness(3) url(#glow-${uniqueId}); opacity: 0;}
          .glow-diamond-${uniqueId} {stroke-dasharray: ${diamondHead} ${diamondLen + 2}; stroke-dashoffset: ${diamondLen + 1}; animation: glowDiamond ${diamondDuration}s ease-in-out ${diamondDelay}s forwards; filter: brightness(3) url(#glow-${uniqueId}); opacity: 0;}
          .glow-arc-up-${uniqueId} {stroke-dasharray: ${arcHead} ${arcLen + 2}; stroke-dashoffset: ${arcLen + 1}; animation: glowArcUp ${arcUpDuration}s ease-in-out ${arcUpDelay}s forwards; filter: brightness(3) url(#glow-${uniqueId}); opacity: 0;}
          .glow-arc-down-${uniqueId} {stroke-dasharray: ${arcHead} ${arcLen + 2}; stroke-dashoffset: ${arcLen + 1}; animation: glowArcDown ${arcDownDuration}s ease-in-out ${arcDownDelay}s forwards; filter: brightness(3) url(#glow-${uniqueId}); opacity: 0;}
        `}</style>

      <rect x="0" y="0" width="200" height="200" rx="32" ry="32" fill={colorSurface} />

      <g className={`track-outer-base-${uniqueId}`}>
        <g className={`track-outer-decay-${uniqueId}`}>
          <circle cx="100" cy="100" r="75" fill="none" stroke={colorAccent} strokeWidth={strokeWidth * 1.5} strokeDasharray={outerDashArray} strokeLinecap="round" />
        </g>
      </g>

      <circle cx="100" cy="100" r="55" fill="none" stroke={colorSecondary} strokeWidth={strokeWidth * 1.5} />

      <g style={{ filter: `drop-shadow(0 0.5px 1.4px ${colorBackground}CC)` }}>
        <polygon className={`trace-diamond-${uniqueId}`} points="85,92 93,100 85,108 77,100" fill="none" stroke={colorBackground} strokeWidth={centerStrokeWidth} strokeLinejoin="round" strokeLinecap="round" transform="translate(1.3, 1.6)" />
        <line className={`trace-line-${uniqueId}`} x1="77" y1="70" x2="77" y2="130" stroke={colorBackground} strokeWidth={centerStrokeWidth} strokeLinecap="round" transform="translate(1.3, 1.6)" />
        <path className={`trace-arc-up-${uniqueId}`} d="M 89 96 A 55 55 0 0 1 132 75" fill="none" stroke={colorBackground} strokeWidth={centerStrokeWidth} strokeLinecap="round" transform="translate(1.3, 1.6)" />
        <path className={`trace-arc-down-${uniqueId}`} d="M 89 104 A 55 55 0 0 0 132 129" fill="none" stroke={colorBackground} strokeWidth={centerStrokeWidth} strokeLinecap="round" transform="translate(1.3, 1.6)" />

        <polygon className={`trace-diamond-${uniqueId}`} points="85,92 93,100 85,108 77,100" fill="none" stroke={colorAccentActive} strokeWidth={centerStrokeWidth} strokeLinejoin="round" strokeLinecap="round" />
        <line className={`trace-line-${uniqueId}`} x1="77" y1="70" x2="77" y2="130" stroke={colorAccentActive} strokeWidth={centerStrokeWidth} strokeLinecap="round" />
        <path className={`trace-arc-up-${uniqueId}`} d="M 89 96 A 55 55 0 0 1 132 75" fill="none" stroke={colorAccentActive} strokeWidth={centerStrokeWidth} strokeLinecap="round" />
        <path className={`trace-arc-down-${uniqueId}`} d="M 89 104 A 55 55 0 0 0 132 129" fill="none" stroke={colorAccentActive} strokeWidth={centerStrokeWidth} strokeLinecap="round" />

        <polygon className={`trace-diamond-${uniqueId}`} points="85,92 93,100 85,108 77,100" fill="none" stroke={colorAccent} strokeWidth={centerStrokeWidth * 0.4} strokeLinejoin="round" strokeLinecap="round" transform="translate(-0.6, -0.8)" />
        <line className={`trace-line-${uniqueId}`} x1="77" y1="70" x2="77" y2="130" stroke={colorAccent} strokeWidth={centerStrokeWidth * 0.4} strokeLinecap="round" transform="translate(-0.6, -0.8)" />
        <path className={`trace-arc-up-${uniqueId}`} d="M 89 96 A 55 55 0 0 1 132 75" fill="none" stroke={colorAccent} strokeWidth={centerStrokeWidth * 0.4} strokeLinecap="round" transform="translate(-0.6, -0.8)" />
        <path className={`trace-arc-down-${uniqueId}`} d="M 89 104 A 55 55 0 0 0 132 129" fill="none" stroke={colorAccent} strokeWidth={centerStrokeWidth * 0.4} strokeLinecap="round" transform="translate(-0.6, -0.8)" />

        <polygon className={`glow-diamond-${uniqueId}`} points="85,92 93,100 85,108 77,100" fill="none" stroke="#F5F7FF" strokeWidth={centerGlowStrokeWidth} strokeLinejoin="round" strokeLinecap="round" />
        <line className={`glow-line-${uniqueId}`} x1="77" y1="70" x2="77" y2="130" stroke="#F5F7FF" strokeWidth={centerGlowStrokeWidth} strokeLinecap="round" />
        <path className={`glow-arc-up-${uniqueId}`} d="M 89 96 A 55 55 0 0 1 132 75" fill="none" stroke="#F5F7FF" strokeWidth={centerGlowStrokeWidth} strokeLinecap="round" />
        <path className={`glow-arc-down-${uniqueId}`} d="M 89 104 A 55 55 0 0 0 132 129" fill="none" stroke="#F5F7FF" strokeWidth={centerGlowStrokeWidth} strokeLinecap="round" />
      </g>
    </svg>
  )
}