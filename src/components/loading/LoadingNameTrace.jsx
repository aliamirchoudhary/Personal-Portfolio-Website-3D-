import { useId } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
export default function LoadingNameTrace({ name = 'MUHAMMAD ALI AAMIR', duration = 1500 }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const compact = useMediaQuery('(max-width: 600px)')
  const words = name.split(' ')
  const lines = compact && words.length > 1 ? [words[0], words.slice(1).join(' ')] : [name]
  const lettering = lines.map((line, index) => (
    <tspan
      key={index}
      x="230"
      y={compact ? 36 + index * 56 : 34}
      textLength="420"
      lengthAdjust="spacingAndGlyphs"
    >
      {line}
    </tspan>
  ))
  return (
    <svg
      viewBox={compact ? '0 0 460 130' : '0 0 460 65'}
      width="100%"
      height="100%"
      aria-hidden="true"
      className="loading-name-trace"
    >
      <defs>
        <filter id={`name-glow-${id}`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text
        x="230"
        y="34"
        textAnchor="middle"
        dominantBaseline="middle"
        textLength="420"
        lengthAdjust="spacingAndGlyphs"
        fill="#392455"
        fontFamily="Space Grotesk,sans-serif"
        fontSize="32"
        fontWeight="700"
      >
        {lettering}
      </text>
      <text
        x="230"
        y="34"
        textAnchor="middle"
        dominantBaseline="middle"
        textLength="420"
        lengthAdjust="spacingAndGlyphs"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth=".9"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#name-glow-${id})`}
        fontFamily="Space Grotesk,sans-serif"
        fontSize="32"
        fontWeight="700"
        style={{
          strokeDasharray: 160,
          strokeDashoffset: 160,
          animation: `name-trace ${duration}ms ease-in-out 200ms both`,
        }}
      >
        {lettering}
      </text>
    </svg>
  )
}
