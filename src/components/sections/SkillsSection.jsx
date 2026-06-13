import SkillsGrid from '../ui/SkillsGrid'

export default function SkillsSection() {
  return (
    <section id="skills" className="portfolio-section" style={{ minHeight: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: 0,
          width: '60vw',
          padding: '4rem 4rem',
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 2rem',
          }}
        >
          Skills & Expertise
        </h2>

        <SkillsGrid />
      </div>
    </section>
  )
}
