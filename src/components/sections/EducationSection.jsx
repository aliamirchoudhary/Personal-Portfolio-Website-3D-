import { lazy, Suspense } from 'react'
import { EDUCATION } from '../../data/portfolioData'
import LazyMount from '../shared/LazyMount'
const Box = lazy(() =>
  import('../animated/FlippingCard3D').then((m) => ({ default: m.SpinningSkillBox })),
)
export default function EducationSection() {
  return (
    <section id="education" className="portfolio-section" aria-labelledby="education-heading">
      <div className="section-content content-left">
        <h2 id="education-heading" tabIndex={-1} className="gradient-text">
          Education
        </h2>
        <ol className="education-list">
          {EDUCATION.map((item) => (
            <li className="education-card" key={item.id}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              <span className="timeline-date">{item.year}</span>
              <details>
                <summary>View courses</summary>
                <ul className="detail-body">
                  {item.courses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
        <div className="mobile-animated-component">
          <LazyMount>
            <Suspense fallback={null}>
              <Box
                skills={['Data Science', 'Full Stack', 'Machine Learning', 'Cloud']}
                sideLabel="AI"
              />
            </Suspense>
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
