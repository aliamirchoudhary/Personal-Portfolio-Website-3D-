import { lazy, Suspense } from 'react'
import { EXPERIENCE } from '../../data/portfolioData'
import LazyMount from '../shared/LazyMount'
const Perceptron = lazy(() =>
  import('../animated/PerceptronAnimation').then((m) => ({ default: m.PerceptronAnimation })),
)
export default function ExperienceSection() {
  return (
    <section id="experience" className="portfolio-section" aria-labelledby="experience-heading">
      <div className="section-content content-right">
        <h2 id="experience-heading" tabIndex={-1} className="gradient-text">
          Experience
        </h2>
        <ol className="timeline-list">
          {EXPERIENCE.map((item) => (
            <li key={item.id} className="timeline-item">
              <article className="experience-card">
                <h3>{item.role}</h3>
                <p className="experience-company">{item.company}</p>
                <span className="timeline-date">{item.year}</span>
                <p className="experience-summary">{item.description.split('. ')[0]}.</p>
                <details>
                  <summary>Contribution details</summary>
                  <p className="detail-body">{item.description}</p>
                </details>
              </article>
            </li>
          ))}
        </ol>
        <div className="mobile-animated-component">
          <LazyMount placeholder={<div style={{ height: 225 }} />}>
            <Suspense fallback={null}>
              <Perceptron maxWidth={300} />
            </Suspense>
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
