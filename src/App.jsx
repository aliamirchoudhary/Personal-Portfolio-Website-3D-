import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
const INTRO_DURATION = 900

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [phase, setPhase] = useState('loading')
  const [activeSection, setActiveSection] = useState('home')
  const loadingRef = useRef(null)

  /* ── loading → intro ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), LOADING_DURATION)
    return () => clearTimeout(t1)
  }, [])

  /* ── compact loading layout (no !important CSS) ── */
  useLayoutEffect(() => {
    if (phase !== 'loading') return
    gsap.set('.lpf-scene', { minHeight: '45vh', paddingTop: '2vh' })
    gsap.set('.lpf-root', { width: 240, height: 240, marginTop: '5vh' })
  }, [phase])

  /* ── intro: loading profile flows to right slot position, matching HomeProfilePicture ── */
  useLayoutEffect(() => {
    if (phase !== 'intro') return
    const el = loadingRef.current
    if (!el) return

    const vw = window.innerWidth
    const rightX = vw - 460 - 24

    const tl = gsap.timeline({
      onComplete: () => setPhase('ready'),
    })

    tl.to('.lpf-scene', {
      minHeight: '100vh',
      paddingTop: 0,
      duration: 0.7,
      ease: 'power2.inOut',
    }, 0)

    tl.to('.lpf-root', {
      width: 320,
      height: 320,
      marginTop: 0,
      duration: 0.7,
      ease: 'power2.inOut',
    }, 0)

    tl.to(el, {
      left: rightX,
      top: 0,
      width: 460,
      height: '100vh',
      duration: 0.7,
      ease: 'power2.inOut',
    }, 0)

    tl.to(el, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    }, 0.55)

    tl.to('.loading-name-trace', {
      opacity: 0,
      duration: 0.3,
    }, 0)

    tl.to('.main-wrap', {
      opacity: 1,
      duration: 0.5,
    }, 0.15)

    return () => tl.kill()
  }, [phase])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      {(phase === 'loading' || phase === 'intro') && (
        <div
          ref={loadingRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0a0a0f',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <LoadingProfileFrame imageSrc={PERSONAL.profileImage} name={PERSONAL.name} />
          <div className="loading-name-trace" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={LOADING_DURATION} />
          </div>
        </div>
      )}

      {phase !== 'loading' && (
        <>
          <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
          <MorphTransitionSlot />
          <main className="main-wrap" style={{ paddingTop: 96, opacity: phase === 'intro' ? 0 : 1 }}>
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
