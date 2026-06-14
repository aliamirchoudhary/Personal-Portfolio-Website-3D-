import { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeProfilePicture from '../animated/HomeProfilePicture'
import NeuralNetworkGlobe from '../animated/NeuralNetworkGlobe'
import { SkillCube } from '../animated/SkillCube'
import { SpinningSkillBox } from '../animated/FlippingCard3D'
import { PerceptronAnimation } from '../animated/PerceptronAnimation'
import TechFlowDiagram from '../animated/TechFlowDiagram'
import { MorphingCommsIcon } from '../animated/MorphingCommsIcon'
import { PERSONAL } from '../../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

export const SLOT_W = 460
export const SLOT_GUTTER = 24
const W = SLOT_W
const GUTTER = SLOT_GUTTER

export const SEQUENCE = [
  { id: 'home',     Component: HomeProfilePicture,  props: { imageSrc: PERSONAL.profileImage, size: 320 }, side: 'right' },
  { id: 'about',    Component: NeuralNetworkGlobe,  props: { size: 320 },                                  side: 'left' },
  { id: 'services', Component: PerceptronAnimation, props: { maxWidth: 600 },                              side: 'right' },
  { id: 'education',Component: SpinningSkillBox,    props: { skills: ['Data Science','ML / AI','Full Stack','Cloud / DevOps','Algorithms','Systems'], sideLabel: 'FAST' }, side: 'left' },
  { id: 'skills',   Component: SkillCube,           props: { size: 200 },                                  side: 'right' },
  { id: 'projects', Component: TechFlowDiagram,     props: {},                                              side: 'left' },
  { id: 'contact',  Component: MorphingCommsIcon,   props: { size: 200 },                                  side: 'right' },
]

function sideToLeft(vw, side) {
  return side === 'right' ? vw - W - GUTTER : GUTTER
}

export default forwardRef(function MorphTransitionSlot(_props, ref) {
  const containerRef = useRef(null)
  const wrapRefs = useRef({})
  const renderRef = useRef(new Set([0]))
  const [renderSet, setRenderSet] = useState(() => new Set([0]))
  const snapLockRef = useRef(false)

  useImperativeHandle(ref, () => ({
    jumpTo(sectionId) {
      const idx = SEQUENCE.findIndex((s) => s.id === sectionId)
      if (idx < 0) return

      renderRef.current = new Set([idx])
      setRenderSet(new Set([idx]))

      const vw = window.innerWidth
      containerRef.current.style.left = `${sideToLeft(vw, SEQUENCE[idx].side)}px`

      Object.values(wrapRefs.current).forEach((el) => {
        if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none' }
      })

      requestAnimationFrame(() => {
        if (wrapRefs.current[idx]) {
          wrapRefs.current[idx].style.opacity = '1'
          wrapRefs.current[idx].style.pointerEvents = 'auto'
        }
      })

      snapLockRef.current = true
      setTimeout(() => { snapLockRef.current = false }, 1200)
    },
  }))

  useEffect(() => {
    const sections = document.querySelectorAll('.portfolio-section')
    if (!sections.length || sections.length < SEQUENCE.length) return

    const vw = window.innerWidth
    containerRef.current.style.left = `${sideToLeft(vw, SEQUENCE[0].side)}px`

    Object.values(wrapRefs.current).forEach((el) => {
      if (el) el.style.opacity = '0'
    })
    if (wrapRefs.current[0]) {
      wrapRefs.current[0].style.opacity = '1'
      wrapRefs.current[0].style.pointerEvents = 'auto'
    }

const triggers = []
const MORPH_SCROLL = 500

for (let i = 0; i < SEQUENCE.length - 1; i++) {
  const curSec = sections[i]
  if (!curSec) continue

  const st = ScrollTrigger.create({
    trigger: curSec,
    start: `top top`,
    end: `+=${MORPH_SCROLL}`,
    invalidateOnRefresh: true,
    scrub: 1,
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

          const peOn = p <= 0 ? fromEl : (p >= 1 ? toEl : null)
          fromEl.style.pointerEvents = peOn === fromEl ? 'auto' : 'none'
          toEl.style.pointerEvents = peOn === toEl ? 'auto' : 'none'

          const vw2 = window.innerWidth
          const fromX = sideToLeft(vw2, SEQUENCE[i].side)
          const toX = sideToLeft(vw2, SEQUENCE[i + 1].side)
          const easeOut = 1 - Math.pow(1 - p, 2)
          containerRef.current.style.left = `${(fromX + (toX - fromX) * easeOut).toFixed(1)}px`
        },
      })

      triggers.push(st)
    }

    /* ── snap: auto-scroll to next section when 75% past current ── */
    const snapTriggers = []

    for (let i = 0; i < SEQUENCE.length - 1; i++) {
      const curSec = sections[i]
      if (!curSec) continue

      const st = ScrollTrigger.create({
        trigger: curSec,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          if (self.direction === 1 && self.progress > 0.75 && !snapLockRef.current) {
            snapLockRef.current = true
            const next = sections[i + 1]
            if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setTimeout(() => { snapLockRef.current = false }, 1200)
          }
        },
      })
      snapTriggers.push(st)
    }

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      triggers.forEach((t) => t.kill())
      snapTriggers.forEach((t) => t.kill())
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
        willChange: 'left',
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
              <item.Component {...item.props} />
            </div>
          </div>
        )
      })}
    </div>
  )
})
