import { useId } from 'react'
export default function LoadingNameTrace({ name = 'MUHAMMAD ALI AAMIR', duration = 1500 }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  return (
    <svg
      viewBox="0 0 460 65"
      width="100%"
      height="100%"
      aria-hidden="true"
      className="loading-name-trace"
    >
      <defs>
        <filter id={`name-glow-${id}`}>
          <feGaussianBlur stdDeviation="1" />
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
        stroke="#c4b5fd"
        strokeWidth=".8"
        fontFamily="Space Grotesk,sans-serif"
        fontSize="22"
        fontWeight="700"
        style={{
          strokeDasharray: 700,
          strokeDashoffset: 700,
          animation: `name-trace ${duration}ms ease forwards`,
        }}
      >
        {name}
      </text>
    </svg>
  )
}
