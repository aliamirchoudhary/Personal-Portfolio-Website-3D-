import { useState, useRef, useEffect, useCallback } from 'react'
import { PERSONAL } from './data/portfolioData'
import AnimatedSlot from './components/shared/AnimatedSlot'
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
import HomeProfilePicture from './components/animated/HomeProfilePicture'
import NeuralNetworkGlobe from './components/animated/NeuralNetworkGlobe'
import { SkillCube } from './components/animated/SkillCube'
import { SpinningSkillBox } from './components/animated/FlippingCard3D'
import { PerceptronAnimation } from './components/animated/PerceptronAnimation'
import { MorphingCommsIcon } from './components/animated/MorphingCommsIcon'
import TechFlowDiagram from './components/animated/TechFlowDiagram'

const COMPONENT_CONFIG = {
  home:     { component: HomeProfilePicture,  props: { imageSrc: PERSONAL.profileImage, size: 320 }, side: 'right' },
  about:    { component: NeuralNetworkGlobe,  props: { size: 320 },                                  side: 'left' },
  services: { component: SkillCube,           props: { size: 200 },                                  side: 'right' },
  education:{ component: SpinningSkillBox,    props: { skills: ['Data Science','ML / AI','Full Stack','Cloud / DevOps','Algorithms','Systems'], sideLabel: 'FAST' }, side: 'left' },
  skills:   { component: PerceptronAnimation, props: { maxWidth: 600 },                              side: 'right' },
  projects: { component: TechFlowDiagram,     props: {},                                              side: 'left' },
  contact:  { component: MorphingCommsIcon,   props: { size: 200 },                                  side: 'right' },
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const slotRef = useRef(null)

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

  useEffect(() => {
    if (!slotRef.current || loading) return
    slotRef.current.style.opacity = '1'
    slotRef.current.style.transform = 'scale(1)'
  }, [activeSection, loading])

  const config = COMPONENT_CONFIG[activeSection]
  const ActiveComponent = config?.component

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
      {config && (
        <AnimatedSlot ref={slotRef} side={config.side}>
          <ActiveComponent {...config.props} />
        </AnimatedSlot>
      )}
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
