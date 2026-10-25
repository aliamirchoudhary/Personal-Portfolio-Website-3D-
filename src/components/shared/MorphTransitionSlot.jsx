import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMotion } from '../../context/motion'
import DecorationBoundary from './DecorationBoundary'
import HomeArtwork from './HomeArtwork'
import Logo from '../ui/KryzectLogo'
const Globe = lazy(() => import('../animated/NeuralNetworkGlobe'))
const Perceptron = lazy(() =>
  import('../animated/PerceptronAnimation').then((m) => ({ default: m.PerceptronAnimation })),
)
const Box = lazy(() =>
  import('../animated/FlippingCard3D').then((m) => ({ default: m.SpinningSkillBox })),
)
const Cube = lazy(() => import('../animated/SkillCube').then((m) => ({ default: m.SkillCube })))
const Flow = lazy(() => import('../animated/TechFlowDiagram'))
const Comms = lazy(() =>
  import('../animated/MorphingCommsIcon').then((m) => ({ default: m.MorphingCommsIcon })),
)
const sequence = [
  ['home', HomeArtwork, {}],
  ['about', Globe, { size: 320 }],
  ['kryzect', Logo, { size: 240 }],
  ['experience', Perceptron, { maxWidth: 400 }],
  [
    'education',
    Box,
    { skills: ['Data Science', 'Full Stack', 'Machine Learning', 'Cloud'], sideLabel: 'AI' },
  ],
  ['skills', Cube, { size: 200 }],
  ['projects', Flow, {}],
  ['contact', Comms, { size: 200 }],
]

export default function MorphTransitionSlot() {
  const root = useRef(null),
    wrappers = useRef({}),
    current = useRef({ index: 0, next: 0, progress: 0, left: 0 })
  const rendered = useRef('0:0')
  const [indices, setIndices] = useState([0, 0])
  const { animate } = useMotion()
  const paint = () => {
    const state = current.current
    if (root.current) root.current.style.transform = `translate3d(${state.left}px,0,0)`
    for (const [key, element] of Object.entries(wrappers.current)) {
      if (!element) continue
      const index = Number(key)
      const opacity =
        state.index === state.next
          ? index === state.index
            ? 1
            : 0
          : index === state.index
            ? 1 - state.progress
            : index === state.next
              ? state.progress
              : 0
      element.style.opacity = String(opacity)
      element.style.pointerEvents = opacity > 0.95 ? 'auto' : 'none'
      element.inert = opacity < 0.95
    }
  }
  useLayoutEffect(() => {
    if (current.current.left === 0 && scrollY === 0)
      current.current.left = innerWidth - Math.min(460, innerWidth * 0.36) - 24
    paint()
  }, [indices])
  useEffect(() => {
    let frame = null,
      positions = [],
      disposed = false
    const measure = () => {
      positions = sequence.map(
        ([id]) => document.getElementById(id).getBoundingClientRect().top + scrollY - 96,
      )
    }
    const update = () => {
      frame = null
      let index = 0
      while (index < sequence.length - 1 && scrollY >= positions[index + 1] - 1) index++
      let next = Math.min(index + 1, sequence.length - 1)
      let progress =
        next === index
          ? 0
          : Math.max(
              0,
              Math.min(1, (scrollY - positions[index]) / (positions[next] - positions[index])),
            )
      if (progress < 0.001) next = index
      if (!animate) {
        index = progress > 0.5 ? next : index
        next = index
        progress = 0
      }
      const width = Math.min(460, innerWidth * 0.36)
      const leftFor = (i) => (i % 2 === 0 ? innerWidth - width - 24 : 24)
      current.current = {
        index,
        next,
        progress,
        left: leftFor(index) + (leftFor(next) - leftFor(index)) * progress,
      }
      const key = `${index}:${next}`
      if (rendered.current !== key) {
        rendered.current = key
        setIndices([index, next])
      }
      paint()
    }
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    const resize = () => {
      if (!disposed) {
        measure()
        schedule()
      }
    }
    const observer = new ResizeObserver(resize)
    document.querySelectorAll('.portfolio-section').forEach((element) => observer.observe(element))
    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    document.fonts?.ready.then(resize)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
    }
  }, [animate])
  return (
    <div ref={root} className="animated-slot" aria-hidden="true">
      {[...new Set(indices)].map((index) => {
        const [, Artwork, props] = sequence[index]
        return (
          <div
            key={index}
            data-section={sequence[index][0]}
            className="slot-artwork"
            ref={(element) => {
              wrappers.current[index] = element
            }}
          >
            <DecorationBoundary
              fallback={
                <img
                  className="artwork-fallback"
                  src="/profile-320.webp"
                  width="200"
                  height="200"
                  alt=""
                />
              }
            >
              <Suspense fallback={null}>
                <Artwork {...props} />
              </Suspense>
            </DecorationBoundary>
          </div>
        )
      })}
    </div>
  )
}
