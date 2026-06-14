import { useRef, useState, useEffect } from 'react'
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
  const scrollRef = useRef(null)

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const rows = rowRefs.current.filter(Boolean)
    if (rows.length === 0) return

    const startY = rows[0].offsetTop + DOT_CENTER + DOT_RADIUS
    const totalDist = rows[rows.length - 1].offsetTop - rows[0].offsetTop

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl
      const maxScroll = scrollHeight - clientHeight
      const p = maxScroll > 0 ? scrollTop / maxScroll : 0

      const currentFillH = p * totalDist

      let active = 0
      for (let i = 0; i < rows.length; i++) {
        if (p >= (i + 0.5) / rows.length) active = i
      }
      setActiveIndex(active)
      setFill({
        top: startY,
        height: Math.max(0, currentFillH),
        opacity: currentFillH > 1 ? 1 : 0,
      })
    }

    update()
    scrollEl.addEventListener('scroll', update, { passive: true })
    return () => scrollEl.removeEventListener('scroll', update)
  }, [])

  return (
    <section id="education" className="portfolio-section" style={{ minHeight: '100vh' }}>
      <GlobalStyles />
      <div
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
        <h2
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 2rem',
            flexShrink: 0,
          }}
        >
          Education
        </h2>

        <div ref={scrollRef} className="edu-scroll-area" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <EducationTimeline items={eduItems} activeIndex={activeIndex} fill={fill} rowRefs={rowRefs} />
        </div>
      </div>
    </section>
  )
}
