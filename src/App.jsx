import { useState, useEffect, useCallback, useRef } from 'react'
import { PERSONAL } from './data/portfolioData'
import MorphTransitionSlot from './components/shared/MorphTransitionSlot'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import HomeSection from './components/sections/HomeSection'
import AboutSection from './components/sections/AboutSection'
import ServicesSection from './components/sections/ServicesSection'
import EducationSection from './components/sections/EducationSection'
import SkillsSection from './components/sections/SkillsSection'
import ProjectsSection from './components/sections/ProjectsSection'
import ContactSection from './components/sections/ContactSection'
import LoadingNameTrace from './components/loading/LoadingNameTrace'
import LoadingProfileFrame from './components/loading/LoadingProfileFrame'

const LOADING_DURATION = 4500
const FADE_DURATION = 400

export default function App() {
  const [phase, setPhase] = useState('loading')
  const [activeSection, setActiveSection] = useState('home')
  const [showLoading, setShowLoading] = useState(true)
  const slotRef = useRef(null)

  /* ── loading → fade → ready ── */
  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('fade')
      setTimeout(() => {
        setShowLoading(false)
        setPhase('ready')
      }, FADE_DURATION)
    }, LOADING_DURATION)
    return () => clearTimeout(t1)
  }, [])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (slotRef.current) slotRef.current.jumpTo(id)
  }, [])

  /* ── IntersectionObserver for navbar highlight ── */
  useEffect(() => {
    if (phase === 'loading') return
    const sectionEls = document.querySelectorAll('.portfolio-section')
    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      }
    }, { rootMargin: '-40% 0px -40% 0px' })
    sectionEls.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [phase])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {showLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0a0a0f',
            overflow: 'hidden',
            zIndex: 100,
            transition: `opacity ${FADE_DURATION}ms ease`,
            opacity: phase === 'fade' ? 0 : 1,
          }}
        >
          <LoadingProfileFrame imageSrc={PERSONAL.profileImage} name={PERSONAL.name} />
          <style>{`@media (max-width: 1024px) { .lpf-root { margin-bottom: 80px !important; } }`}</style>
          <div className="loading-name-trace" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={LOADING_DURATION} />
          </div>
        </div>
      )}

      {phase !== 'loading' && (
        <>
          <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
          <MorphTransitionSlot ref={slotRef} />
          <main className="main-wrap" style={{ paddingTop: 96 }}>
            <HomeSection />
            <AboutSection />
            <ServicesSection />
            <EducationSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>
          <Footer scrollToSection={scrollToSection} />
        </>
      )}
    </div>
  )
}
