import { Suspense, forwardRef, lazy, useRef, useEffect, useState, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeProfilePicture from '../animated/HomeProfilePicture'
import { PERSONAL } from '../../data/portfolioData'

const NeuralNetworkGlobe = lazy(() => import('../animated/NeuralNetworkGlobe'))
const PerceptronAnimation = lazy(() => import('../animated/PerceptronAnimation').then((m) => ({ default: m.PerceptronAnimation })))
const SpinningSkillBox = lazy(() => import('../animated/FlippingCard3D').then((m) => ({ default: m.SpinningSkillBox })))
const SkillCube = lazy(() => import('../animated/SkillCube').then((m) => ({ default: m.SkillCube })))
const TechFlowDiagram = lazy(() => import('../animated/TechFlowDiagram'))
const MorphingCommsIcon = lazy(() => import('../animated/MorphingCommsIcon').then((m) => ({ default: m.MorphingCommsIcon })))

gsap.registerPlugin(ScrollTrigger)

export const SLOT_W = 460
export const SLOT_GUTTER = 24
const W = SLOT_W
const GUTTER = SLOT_GUTTER

export const SEQUENCE = [
  { id: 'home',     Component: HomeProfilePicture,  props: { imageSrc: PERSONAL.profileImage, size: 320 }, side: 'right' },
  { id: 'about',    Component: NeuralNetworkGlobe,  props: { size: 320 },                                  side: 'left' },
  { id: 'services', Component: PerceptronAnimation, props: { maxWidth: 600 },                              side: 'right' },
  { id: 'education',Component: SpinningSkillBox,    props: { skills: ['Data Science','Full Stack','Machine Learning','Cloud'], sideLabel: 'AI' }, side: 'left' },
  { id: 'skills',   Component: SkillCube,           props: { size: 200 },                                  side: 'right' },
  { id: 'projects', Component: TechFlowDiagram,     props: {},                                              side: 'left' },
  { id: 'contact',  Component: MorphingCommsIcon,   props: { size: 200 },                                  side: 'right' },
]

function sideToLeft(vw, side) {
  return side === 'right' ? vw - W - GUTTER : GUTTER
}

export default forwardRef(function MorphTransitionSlot({ lowPower = false } = {}, ref) {
  const containerRef = useRef(null)
  const wrapRefs = useRef({})
  const renderRef = useRef(new Set([0]))
  const [renderSet, setRenderSet] = useState(() => new Set([0]))

  const setSlotX = (x) => {
    if (!containerRef.current) return
    containerRef.current.style.setProperty('--slot-x', `${x}px`)
  }

  useImperativeHandle(ref, () => ({
    jumpTo(sectionId) {
      const idx = SEQUENCE.findIndex((s) => s.id === sectionId)
      if (idx < 0) return

      renderRef.current = new Set([idx])
      setRenderSet(new Set([idx]))

      const vw = window.innerWidth
      setSlotX(sideToLeft(vw, SEQUENCE[idx].side))

      Object.values(wrapRefs.current).forEach((el) => {
        if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none' }
      })

      requestAnimationFrame(() => {
        if (wrapRefs.current[idx]) {
          wrapRefs.current[idx].style.opacity = '1'
          wrapRefs.current[idx].style.pointerEvents = 'auto'
        }
      })
    },
  }))

  useEffect(() => {
    const sections = document.querySelectorAll('.portfolio-section')
    if (!sections.length || sections.length < SEQUENCE.length) return

    const vw = window.innerWidth
    setSlotX(sideToLeft(vw, SEQUENCE[0].side))

    Object.values(wrapRefs.current).forEach((el) => {
      if (el) el.style.opacity = '0'
    })
    if (wrapRefs.current[0]) {
      wrapRefs.current[0].style.opacity = '1'
      wrapRefs.current[0].style.pointerEvents = 'auto'
    }

const triggers = []

for (let i = 0; i < SEQUENCE.length - 1; i++) {
  const curSec = sections[i]
  if (!curSec) continue

  const st = ScrollTrigger.create({
    trigger: curSec,
    start: `top top+=96`,
    end: `bottom top+=96`,
      scrub: lowPower ? 0.15 : 0.5,
    invalidateOnRefresh: true,
    onEnter: () => {
          renderRef.current.add(i + 1)
          setRenderSet(new Set(renderRef.current))
        },
        onLeave: () => {
          renderRef.current.delete(i)
          setRenderSet(new Set(renderRef.current))
        },
        onEnterBack: () => {
          renderRef.current.add(i)
          setRenderSet(new Set(renderRef.current))
        },
        onLeaveBack: () => {
          renderRef.current.delete(i + 1)
          setRenderSet(new Set(renderRef.current))
        },
        onUpdate(self) {
          const p = self.progress
          const fromEl = wrapRefs.current[i]
          const toEl = wrapRefs.current[i + 1]
          if (!fromEl || !toEl) return

          const fastExit = 1 - Math.pow(1 - p, 5)
          fromEl.style.opacity = (1 - fastExit).toFixed(3)
          toEl.style.opacity = p.toFixed(3)

          const enteringEl = self.direction === 1 ? toEl : fromEl
          if (p >= 0.95) {
            enteringEl.style.pointerEvents = 'auto'
            ;(enteringEl === toEl ? fromEl : toEl).style.pointerEvents = 'none'
          } else {
            fromEl.style.pointerEvents = +fromEl.style.opacity > +toEl.style.opacity ? 'auto' : 'none'
            toEl.style.pointerEvents = +toEl.style.opacity > +fromEl.style.opacity ? 'auto' : 'none'
          }

          const vw2 = window.innerWidth
          const fromX = sideToLeft(vw2, SEQUENCE[i].side)
          const toX = sideToLeft(vw2, SEQUENCE[i + 1].side)
          const easeOut = 1 - Math.pow(1 - p, 2)
          setSlotX((fromX + (toX - fromX) * easeOut).toFixed(1))
        },
      })

      triggers.push(st)
    }

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      triggers.forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="animated-slot"
      style={{
        position: 'fixed',
        top: 0,
        height: '100vh',
        width: W,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        left: 0,
        transform: 'translate3d(var(--slot-x, 0px), 0, 0)',
        willChange: 'transform',
      }}
    >
      {SEQUENCE.map((item, i) => {
        if (!renderSet.has(i)) return null
        return (
          <div
            key={item.id}
            ref={(el) => { wrapRefs.current[i] = el }}
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              opacity: 0,
              pointerEvents: 'none',
              willChange: 'opacity',
            }}
          >
            <div style={{ pointerEvents: 'inherit', width: 'calc(100% - 1.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
                <item.Component {...item.props} />
              </Suspense>
            </div>
          </div>
        )
      })}
    </div>
  )
})
