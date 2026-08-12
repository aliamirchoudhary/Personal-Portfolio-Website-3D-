import { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeProfilePicture from '../animated/HomeProfilePicture'
import NeuralNetworkGlobe from '../animated/NeuralNetworkGlobe'
import { PerceptronAnimation } from '../animated/PerceptronAnimation'
import { SpinningSkillBox } from '../animated/FlippingCard3D'
import { SkillCube } from '../animated/SkillCube'
import TechFlowDiagram from '../animated/TechFlowDiagram'
import { MorphingCommsIcon } from '../animated/MorphingCommsIcon'
import KryzectLogo from '../ui/KryzectLogo'
import { PERSONAL } from '../../data/portfolioData'

gsap.registerPlugin(ScrollTrigger)

export const SLOT_W = 460
export const SLOT_GUTTER = 24
const W = SLOT_W
const GUTTER = SLOT_GUTTER

// Matches the CSS var(--slot-cross-gap). The slot only crosses over this
// empty region between sections, so traveling never overlaps section content.
const CROSS_GAP = 0.6 // fraction of viewport height
const CONTENT_VH = typeof window !== 'undefined' ? window.innerHeight : 0
const CROSS_GAP_PX = CONTENT_VH * CROSS_GAP

export const SEQUENCE = [
  { id: 'home',     Component: HomeProfilePicture,  props: { imageSrc: PERSONAL.profileImage, size: 320 }, side: 'right' },
  { id: 'about',    Component: NeuralNetworkGlobe,   props: { size: 320 },                                  side: 'left' },
  { id: 'kryzect',  Component: KryzectLogo,          props: { size: 240 },                                 side: 'right' },
{ id: 'experience', Component: PerceptronAnimation, props: { maxWidth: 460 },                             side: 'left' },
  { id: 'education', Component: SpinningSkillBox,     props: { skills: ['Data Science','Full Stack','Machine Learning','Cloud'], sideLabel: 'AI' }, side: 'right' },
  { id: 'skills',   Component: SkillCube,             props: { size: 200 },                                side: 'left' },
  { id: 'projects', Component: TechFlowDiagram,       props: {},                                            side: 'right' },
  { id: 'contact',  Component: MorphingCommsIcon,     props: { size: 200 },                                side: 'left' },
]

function sideToLeft(vw, side) {
  return side === 'right' ? vw - W - GUTTER : GUTTER
}

export default forwardRef(function MorphTransitionSlot({ lowPower = false } = {}, ref) {
  const containerRef = useRef(null)
  const wrapRefs = useRef({})
  const renderRef = useRef(new Set([0]))
  const [renderSet, setRenderSet] = useState(() => new Set([0]))
  const vwRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0)

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

      setSlotX(sideToLeft(vwRef.current, SEQUENCE[idx].side))

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

    vwRef.current = window.innerWidth
    const onResize = () => { vwRef.current = window.innerWidth }
    window.addEventListener('resize', onResize)

    setSlotX(sideToLeft(vwRef.current, SEQUENCE[0].side))

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
  const nextSec = sections[i + 1]
  if (!curSec || !nextSec) continue

  const st = ScrollTrigger.create({
    trigger: curSec,
    // Travel starts as the current section's UI begins going up (its top
    // reaches the navbar line) and completes exactly when the destination
    // section's heading arrives at that same line — so the slot glides at the
    // pace of the scrolling UI and lands as the new heading reaches the navbar.
    start: () => curSec.getBoundingClientRect().top + window.scrollY - 96,
    end: () => nextSec.getBoundingClientRect().top + window.scrollY - 96,
    scrub: lowPower ? true : 0.5,
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

          // Linear over the whole span: starts as the source clears the screen,
          // ends as the destination clears it. r = p (progress), no rescaling.
          const r = p

          const vw = vwRef.current
          const fromX = sideToLeft(vw, SEQUENCE[i].side)
          const toX = sideToLeft(vw, SEQUENCE[i + 1].side)

          if (lowPower) {
            fromEl.style.opacity = (1 - r).toFixed(2)
            toEl.style.opacity = r.toFixed(2)
            if (r > 0.8) { toEl.style.pointerEvents = 'auto'; fromEl.style.pointerEvents = 'none' }
            else if (r < 0.2) { fromEl.style.pointerEvents = 'auto'; toEl.style.pointerEvents = 'none' }
            setSlotX((fromX + (toX - fromX) * r).toFixed(1))
          } else {
            fromEl.style.opacity = (1 - r).toFixed(2)
            toEl.style.opacity = r.toFixed(2)
            if (r >= 0.95) {
              toEl.style.pointerEvents = 'auto'
              fromEl.style.pointerEvents = 'none'
            } else if (r <= 0.05) {
              fromEl.style.pointerEvents = 'auto'
              toEl.style.pointerEvents = 'none'
            }
            // Linear, steady movement — slow, not a fast snap across.
            setSlotX((fromX + (toX - fromX) * r).toFixed(1))
          }
        },
      })

      triggers.push(st)
    }

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('resize', onResize)
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
              <item.Component {...item.props} />
            </div>
          </div>
        )
      })}
    </div>
  )
})
