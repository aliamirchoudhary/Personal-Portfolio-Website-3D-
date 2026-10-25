import { lazy, Suspense } from 'react'
import { RingCarousel } from '../ui/RingCarousel'
import { PROJECTS } from '../../data/portfolioData'
import LazyMount from '../shared/LazyMount'
const Flow = lazy(() => import('../animated/TechFlowDiagram'))
const cards = PROJECTS.map((project) => ({
  ...project,
  title: project.name,
  shortDesc: project.description,
}))
export default function ProjectsSection() {
  return (
    <section id="projects" className="portfolio-section" aria-labelledby="projects-heading">
      <div className="section-content content-left">
        <h2 id="projects-heading" tabIndex={-1} className="gradient-text">
          Featured projects
        </h2>
        <p className="projects-intro">
          Explore the implementation, technical decisions, and source code behind my work.
        </p>
        <RingCarousel cards={cards} />
        <div className="mobile-animated-component">
          <LazyMount placeholder={<div style={{ height: 300 }} />}>
            <Suspense fallback={null}>
              <Flow />
            </Suspense>
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
