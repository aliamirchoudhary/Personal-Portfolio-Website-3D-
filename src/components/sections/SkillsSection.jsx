import { lazy, Suspense } from 'react'
import SkillsGrid from '../ui/SkillsGrid'
import LazyMount from '../shared/LazyMount'

const SkillCube = lazy(() =>
  import('../animated/SkillCube').then((m) => ({ default: m.SkillCube })),
)

export default function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section" aria-labelledby="skills-heading">
      <div className="section-content content-right">
        <h2
          id="skills-heading"
          tabIndex={-1}
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

        <div className="skills-scroll-area">
          <SkillsGrid />
        </div>

        <div className="mobile-animated-component">
          <LazyMount margin="600px" unmountMargin="800px">
            <Suspense fallback={null}>
              <SkillCube />
            </Suspense>
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
