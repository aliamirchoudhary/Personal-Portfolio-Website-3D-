import SkillsGrid from '../ui/SkillsGrid'
import { SkillCube } from '../animated/SkillCube'

export default function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: 0,
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
          <SkillCube />
        </div>
      </div>
    </section>
  )
}
