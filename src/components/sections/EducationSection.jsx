import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EducationTimeline, GlobalStyles } from '../ui/EducationTimeline'
import { EDUCATION } from '../../data/portfolioData'

const eduItems = EDUCATION.map((e) => ({
  ...e,
  years: e.year,
}))

const DOT_CENTER = 29
const DOT_RADIUS = 7

export default function EducationSection() {
  const rowRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [fill, setFill] = useState({ top: 0, height: 0, opacity: 0 })
  const triggerRef = useRef(null)

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean)
    if (rows.length === 0) return

    const startY = rows[0].offsetTop + DOT_CENTER + DOT_RADIUS
    const totalDist = rows[rows.length - 1].offsetTop - rows[0].offsetTop
    const lastY = rows[rows.length - 1].offsetTop + DOT_CENTER + DOT_RADIUS

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        const p = self.progress
        const currentFillH = p * totalDist
        const currentFillTop = startY

        let active = 0
        for (let i = 0; i < rows.length; i++) {
          if (p >= (i + 0.5) / rows.length) active = i
        }
        setActiveIndex(active)
        setFill({
          top: currentFillTop,
          height: Math.max(0, currentFillH),
          opacity: currentFillH > 1 ? 1 : 0,
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section id="education" className="portfolio-section" style={{ minHeight: '100vh' }}>
      <GlobalStyles />
      <div
        ref={triggerRef}
        style={{
          marginLeft: '40vw',
          width: '60vw',
          height: '100vh',
          padding: '4rem 4rem 0',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <div className="edu-scroll-area" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <h2
            className="gradient-text"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '2.5rem',
              margin: '0 0 2rem',
            }}
          >
            Education
          </h2>

          <EducationTimeline items={eduItems} activeIndex={activeIndex} fill={fill} rowRefs={rowRefs} />
        </div>
      </div>
    </section>
  )
}
