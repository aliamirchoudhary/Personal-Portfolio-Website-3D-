import { useState, useEffect, useCallback } from 'react'
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

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  const LOADING_DURATION = 4500

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADING_DURATION)
    return () => clearTimeout(timer)
  }, [])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (loading) return
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
  }, [loading])

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#0a0a0f', overflow: 'hidden' }}>
        <style>{`.lpf-scene { min-height: 45vh !important; margin-top: 0 !important; padding-top: 2vh !important; background: transparent !important; } .lpf-root { margin-top: 5vh !important; }`}</style>
        <LoadingProfileFrame imageSrc={PERSONAL.profileImage} name={PERSONAL.name} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={LOADING_DURATION} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
      {!loading && <MorphTransitionSlot />}
      <main style={{ paddingTop: 96 }}>
        <HomeSection />
        <AboutSection />
        <ServicesSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer scrollToSection={scrollToSection} />
    </div>
  )
}
