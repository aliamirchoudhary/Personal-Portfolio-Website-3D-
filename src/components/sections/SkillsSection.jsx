import { lazy, Suspense } from 'react'
import SkillsGrid from '../ui/SkillsGrid'
import LazyMount from '../shared/LazyMount'

const SkillCube = lazy(() =>
  import('../animated/SkillCube').then((m) => ({ default: m.SkillCube })),
)

export default function SkillsSection({ lowPower }) {
  return (
    <section id="skills" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: '40vw',
          width: '60vw',
          height: '100vh',
          padding: '1rem 4rem 4rem',
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
          Skills &amp; Expertise
        </h2>

        <div className="skills-scroll-area" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <SkillsGrid />
        </div>

        <div className="mobile-animated-component" style={{ marginTop: '10vh', marginBottom: '20vh' }}>
          <LazyMount><Suspense fallback={null}><SkillCube lowPower={lowPower} /></Suspense></LazyMount>
        </div>
      </div>
    </section>
  )
}
