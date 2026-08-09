import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PERSONAL } from './data/portfolioData'
import MorphTransitionSlot, { SLOT_W, SLOT_GUTTER, SEQUENCE } from './components/shared/MorphTransitionSlot'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import HomeSection from './components/sections/HomeSection'
import AboutSection from './components/sections/AboutSection'
import KryzectSection from './components/sections/KryzectSection'
import ExperienceSection from './components/sections/ExperienceSection'
import EducationSection from './components/sections/EducationSection'
import SkillsSection from './components/sections/SkillsSection'
import ProjectsSection from './components/sections/ProjectsSection'
import ContactSection from './components/sections/ContactSection'
import LoadingNameTrace from './components/loading/LoadingNameTrace'
import LoadingProfileFrame from './components/loading/LoadingProfileFrame'

const LOADING_DURATION = 4500
const DURATIONS = {
  normal: { slotMove: 0.7, fade: 0.3, showMain: 0.5 },
  low:    { slotMove: 0.42, fade: 0.2, showMain: 0.3 },
}

function detectLowPowerDevice() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false

  const memory = navigator.deviceMemory ?? 8
  const cores = navigator.hardwareConcurrency ?? 8
  const saveData = navigator.connection?.saveData ?? false
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const narrowScreen = window.innerWidth <= 768

  return Boolean(saveData || memory <= 4 || cores <= 4 || (coarsePointer && narrowScreen))
}

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [phase, setPhase] = useState('loading')
  const [activeSection, setActiveSection] = useState('home')
  const [lowPower] = useState(() => detectLowPowerDevice())
  const loadingRef = useRef(null)
  const tlRef = useRef(null)
  const slotRef = useRef(null)
  const loadingDuration = lowPower ? 1200 : LOADING_DURATION
  const dur = lowPower ? DURATIONS.low : DURATIONS.normal

  /* ── loading → intro ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), loadingDuration)
    return () => clearTimeout(t1)
  }, [loadingDuration])

  /* ── compact loading layout (no !important CSS) ── */
  useLayoutEffect(() => {
    if (phase !== 'loading') return
    if (window.innerWidth <= 1024) return
    gsap.set('.lpf-scene', { minHeight: '45vh', paddingTop: '2vh' })
    gsap.set('.lpf-root', { width: 240, height: 240, marginTop: '5vh' })
  }, [phase])

  /* ── intro: loading profile flows to right slot position, matching HomeProfilePicture ── */
  useEffect(() => {
    if (phase !== 'intro') return
    if (window.innerWidth <= 1024) { setPhase('ready'); requestAnimationFrame(() => ScrollTrigger.refresh()); return }
    const el = loadingRef.current
    if (!el) return

    // HomeProfilePicture sits 58px right of center inside the slot
    // due to its justify-end Tailwind class. Compensate so the
    // centered .lpf-root aligns with the right-aligned .hpp-root.
    const raf = requestAnimationFrame(() => {
      const slot = document.querySelector('.animated-slot')
      const slotLeft = slot ? slot.getBoundingClientRect().left : window.innerWidth - SLOT_W - SLOT_GUTTER
      const targetLeft = slotLeft + 58

      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('ready')
          ScrollTrigger.refresh()
        },
      })
      tlRef.current = tl

      tl.to('.lpf-scene', {
        minHeight: '100vh',
        paddingTop: 0,
        duration: dur.slotMove,
        ease: 'power2.inOut',
      }, 0)

      tl.to('.lpf-root', {
        width: 320,
        height: 320,
        marginTop: 0,
        duration: dur.slotMove,
        ease: 'power2.inOut',
      }, 0)

      tl.to(el, {
        left: targetLeft,
        top: 0,
        y: -5,
        width: SLOT_W,
        height: '100vh',
        duration: dur.slotMove,
        ease: 'power2.inOut',
      }, 0)

      tl.to(el, {
        opacity: 0,
        duration: dur.fade,
        ease: 'power2.in',
      }, 0.7)

      tl.to('.loading-name-trace', {
        opacity: 0,
        duration: dur.fade,
      }, 0)

      tl.to('.main-wrap', {
        opacity: 1,
        duration: dur.showMain,
      }, lowPower ? 0 : 0.15)
    })

    return () => {
      cancelAnimationFrame(raf)
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [phase])

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
          <style>{`@media (max-width: 1024px) { .lpf-root { margin-bottom: 80px !important; } }`}</style>
          <div className="loading-name-trace" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={loadingDuration} />
          </div>
        </div>
      )}

      {phase !== 'loading' && (
        <>
          <Navbar activeSection={activeSection} scrollToSection={scrollToSection} />
          <MorphTransitionSlot ref={slotRef} lowPower={lowPower} />
          <main className="main-wrap" style={{ paddingTop: 96, opacity: phase === 'intro' ? 0 : 1 }}>
            <HomeSection />
            <AboutSection />
            <KryzectSection />
            <ExperienceSection />
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
