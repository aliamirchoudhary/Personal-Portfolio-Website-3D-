import { useState, useEffect, useCallback, useRef, useLayoutEffect, lazy, Suspense } from 'react'
import { PERSONAL } from './data/portfolioData'
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

// Loaded only on desktop (>=1024px) and only when the intro animation starts,
// so mobile never parses/executes the heavy slot + all its animated modules.
const MorphTransitionSlot = lazy(() => import('./components/shared/MorphTransitionSlot'))

// Mirror the slot constants (SLOT_W = 460, SLOT_GUTTER = 24) locally so the
// desktop intro layout math doesn't pull in the whole slot module eagerly.
const SLOT_W = 460
const SLOT_GUTTER = 24

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

// GSAP is only needed for the desktop intro/slot animations. Load it lazily so
// mobile never downloads, parses, or runs it (keeps the initial bundle lean).
const loadGSAP = () =>
  Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gs, st]) => {
    gs.gsap.registerPlugin(st.ScrollTrigger)
    return { gsap: gs.gsap, ScrollTrigger: st.ScrollTrigger }
  })

export default function App() {
  const [phase, setPhase] = useState('loading')
  const [activeSection, setActiveSection] = useState('home')
  // Below-fold sections mount in small staggered chunks after the hero has
  // painted. Keeps the initial commit tiny (so no single >50ms blocking task)
  // without ever dropping a section from the layout.
  const [mountedDepth, setMountedDepth] = useState(0)
  const [lowPower] = useState(() => detectLowPowerDevice())
  const [isNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 1024)
  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth > 1024)
  const loadingRef = useRef(null)
  const tlRef = useRef(null)
  const slotRef = useRef(null)
  // Short, snappy loading on any narrow/low-power screen so real content paints
  // fast (the fancy 4.5s sequence is kept for desktop where it's not a core-vital blocker).
  const loadingDuration = (lowPower || isNarrow) ? 900 : LOADING_DURATION
  const dur = (lowPower || isNarrow) ? DURATIONS.low : DURATIONS.normal

  /* ── loading → intro ── */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('intro'), loadingDuration)
    return () => clearTimeout(t1)
  }, [loadingDuration])

  /* ── compact loading layout (no !important CSS) ── */
  useLayoutEffect(() => {
    if (phase !== 'loading') return
    if (!isDesktop || window.innerWidth <= 1024) return
    let cancelled = false
    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      gsap.set('.lpf-scene', { minHeight: '45vh', paddingTop: '2vh' })
      gsap.set('.lpf-root', { width: 240, height: 240, marginTop: '5vh' })
    })
    return () => { cancelled = true }
  }, [phase, isDesktop])

  /* ── intro: loading profile flows to right slot position, matching HomeProfilePicture ── */
  useEffect(() => {
    if (phase !== 'intro') return
    if (!isDesktop || window.innerWidth <= 1024) {
      requestAnimationFrame(() => setPhase('ready'))
      return
    }
    const el = loadingRef.current
    if (!el) return

    // HomeProfilePicture sits 58px right of center inside the slot
    // due to its justify-end Tailwind class. Compensate so the
    // centered .lpf-root aligns with the right-aligned .hpp-root.
    let cancelled = false
    const raf = requestAnimationFrame(() => {
      loadGSAP().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return
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
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [phase])

  /* ── stagger-mount the below-fold sections after first paint ── */
  useEffect(() => {
    if (phase !== 'ready') return
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setMountedDepth(i)
      if (i >= 7) clearInterval(iv)
    }, 90)
    return () => clearInterval(iv)
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
  }, [phase, mountedDepth])

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
          {isDesktop && (
            <Suspense fallback={null}>
              <MorphTransitionSlot ref={slotRef} lowPower={lowPower} />
            </Suspense>
          )}
          <main className="main-wrap" style={{ paddingTop: 96, opacity: phase === 'intro' ? 0 : 1 }}>
            <HomeSection />
            {mountedDepth >= 1 && <AboutSection />}
            {mountedDepth >= 2 && <KryzectSection />}
            {mountedDepth >= 3 && <ExperienceSection />}
            {mountedDepth >= 4 && <EducationSection />}
            {mountedDepth >= 5 && <SkillsSection />}
            {mountedDepth >= 6 && <ProjectsSection />}
            {mountedDepth >= 7 && <ContactSection />}
          </main>
          <Footer scrollToSection={scrollToSection} />
        </>
      )}
    </div>
  )
}
