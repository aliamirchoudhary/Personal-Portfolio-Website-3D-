import { useAnimationActivity } from '../../context/motion'
import { useEffect, useRef } from 'react'

const THEME = {
  bg: '#0a0a0f',
  surface: '#12121a',
  primary: '#7c3aed',
  secondary: '#06b6d4',
  glow: '#a78bfa',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  danger: '#f43f5e',
}

const FACES = [
  {
    key: 'front',
    label: 'lang',
    name: 'Python',
    color: THEME.glow,
    logo: '/tech/python.svg',
  },
  {
    key: 'right',
    label: 'data',
    name: 'SQL',
    color: THEME.secondary,
    logo: '/tech/postgresql.svg',
  },
  {
    key: 'back',
    label: 'lang',
    name: 'C++',
    color: THEME.textPrimary,
    logo: '/tech/cplusplus.svg',
  },
  {
    key: 'left',
    label: 'web',
    name: 'JavaScript',
    color: THEME.glow,
    logo: '/tech/javascript.svg',
  },
  {
    key: 'top',
    label: 'ai',
    name: 'ML / AI',
    color: THEME.secondary,
    logo: '/tech/tensorflow.svg',
  },
  {
    key: 'bottom',
    label: 'ui',
    name: 'React',
    color: THEME.textPrimary,
    logo: '/tech/react.svg',
  },
]

const STYLE_ID = 'skillcube-global-styles'

function useGlobalStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return

    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `


      @keyframes sc-glow-pulse {
        0%, 100% { box-shadow: inset 0 0 24px rgba(167,139,250,0.10), 0 0 18px rgba(124,58,237,0.18); }
        50%      { box-shadow: inset 0 0 40px rgba(167,139,250,0.32), 0 0 34px rgba(124,58,237,0.42); }
      }
      @media (max-width: 768px) {
        .skillcube-face {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          background: rgba(18, 18, 26, 0.95);
        }
      }
      .skillcube-face {
        background: rgba(18, 18, 26, 0.95);
        backface-visibility: hidden;
        box-shadow: inset 0 0 24px rgba(167,139,250,.12), 0 0 18px rgba(124,58,237,.2);
      }
      @media (min-width: 769px) {
        .skillcube-face { animation: sc-glow-pulse 4s ease-in-out infinite; }
      }
      [data-active="false"] .skillcube-face { animation-play-state: paused; }
    `
    document.head.appendChild(style)
  }, [])
}

export function SkillCube({ size = 200 }) {
  const { ref: activityRef, animate, lowPower } = useAnimationActivity()
  useGlobalStyles()

  const half = size / 2
  const boxRef = useRef(null)
  const rotRef = useRef({ x: -18, y: 24 })
  const drag = useRef({ active: false, lastX: 0, lastY: 0 })
  const pausedRef = useRef(false)
  const rafRef = useRef(0)

  const applyRotation = () => {
    if (!boxRef.current) return
    boxRef.current.style.transform = `rotateX(${rotRef.current.x}deg) rotateY(${rotRef.current.y}deg)`
  }

  useEffect(() => {
    if (!animate) {
      applyRotation()
      return
    }
    const isNarrow = lowPower || window.innerWidth <= 768
    const frameInterval = isNarrow ? 1000 / 30 : 1000 / 60 // 30fps mobile, 60fps desktop
    const speed = isNarrow ? 22 : 45 // half speed on mobile
    let prev = performance.now()
    let lastFrameTime = 0

    const loop = (now) => {
      if (pausedRef.current) {
        prev = now
        lastFrameTime = now
        rafRef.current = requestAnimationFrame(loop)
        return
      }
      if (now - lastFrameTime < frameInterval) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }
      lastFrameTime = now
      const dt = (now - prev) / 1000
      prev = now
      if (!drag.current.active) {
        rotRef.current = {
          x: rotRef.current.x,
          y: rotRef.current.y + speed * dt,
        }
        applyRotation()
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onMove = (e) => {
      if (!drag.current.active) return
      const point = e.touches ? e.touches[0] : e
      const dx = point.clientX - drag.current.lastX
      const dy = point.clientY - drag.current.lastY
      drag.current.lastX = point.clientX
      drag.current.lastY = point.clientY
      rotRef.current = {
        x: rotRef.current.x - dy * 0.4,
        y: rotRef.current.y + dx * 0.4,
      }
      applyRotation()
    }
    const onUp = () => {
      drag.current.active = false
      document.body.classList.remove('dragging-artwork')
    }
    const onVisibilityChange = () => {
      pausedRef.current = document.hidden
      if (!document.hidden) prev = performance.now()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    window.addEventListener('touchcancel', onUp)
    applyRotation()
    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
      window.removeEventListener('touchcancel', onUp)
      document.body.classList.remove('dragging-artwork')
    }
  }, [animate, lowPower])

  const startDrag = (e) => {
    if (!animate) return
    const point = e.touches ? e.touches[0] : e
    drag.current = { active: true, lastX: point.clientX, lastY: point.clientY }
    document.body.classList.add('dragging-artwork')
  }

  const faceTransforms = {
    front: `rotateY(0deg) translateZ(${half}px)`,
    right: `rotateY(90deg) translateZ(${half}px)`,
    back: `rotateY(180deg) translateZ(${half}px)`,
    left: `rotateY(-90deg) translateZ(${half}px)`,
    top: `rotateX(90deg) translateZ(${half}px)`,
    bottom: `rotateX(-90deg) translateZ(${half}px)`,
  }

  return (
    <div
      ref={activityRef}
      data-active={animate}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      style={{
        perspective: '900px',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        touchAction: 'none',
      }}
    >
      <div
        ref={boxRef}
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-18deg) rotateY(24deg)',
          willChange: 'transform',
        }}
      >
        {FACES.map((face, i) => (
          <div
            key={face.key}
            className="skillcube-face"
            style={{
              position: 'absolute',
              width: size,
              height: size,
              transform: faceTransforms[face.key],
              border: '1px solid #7c3aed30',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              animationDelay: `${i * 0.66}s`,
              overflow: 'hidden',
            }}
          >
            <img
              src={face.logo}
              alt={face.name + ' logo'}
              crossOrigin="anonymous"
              draggable={false}
              style={{
                width: 52,
                height: 52,
                objectFit: 'contain',
                filter: `drop-shadow(0 0 12px ${face.color}66)`,
                pointerEvents: 'none',
              }}
            />

            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: '-0.02em',
                color: face.color,
                textShadow: `0 0 18px ${face.color}55`,
                textAlign: 'center',
                padding: '0 12px',
              }}
            >
              {face.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
