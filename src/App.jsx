import { lazy, memo, Suspense, useCallback, useEffect, useState } from 'react'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import HomeSectionView from './components/sections/HomeSection'
import AboutSectionView from './components/sections/AboutSection'
import KryzectSectionView from './components/sections/KryzectSection'
import ExperienceSectionView from './components/sections/ExperienceSection'
import EducationSectionView from './components/sections/EducationSection'
import SkillsSectionView from './components/sections/SkillsSection'
import ProjectsSectionView from './components/sections/ProjectsSection'
import ContactSectionView from './components/sections/ContactSection'
import DecorationBoundary from './components/shared/DecorationBoundary'
import { MotionProvider } from './context/MotionContext'
import { useMotion } from './context/motion'
import { NAV_LINKS } from './data/portfolioData'
import BrandIntro from './components/loading/BrandIntro'
import AssistantLauncher from './components/assistant/AssistantLauncher'

const MorphTransitionSlot = lazy(() => import('./components/shared/MorphTransitionSlot'))
// Active navigation and visibility updates must not rerender every content section.
// Context consumers inside each section still receive motion/responsive changes.
const HomeSection = memo(HomeSectionView)
const AboutSection = memo(AboutSectionView)
const KryzectSection = memo(KryzectSectionView)
const ExperienceSection = memo(ExperienceSectionView)
const EducationSection = memo(EducationSectionView)
const SkillsSection = memo(SkillsSectionView)
const ProjectsSection = memo(ProjectsSectionView)
const ContactSection = memo(ContactSectionView)

function Portfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const [introRequest, setIntroRequest] = useState(0)
  const replayIntro = useCallback(() => setIntroRequest((value) => value + 1), [])
  const { animate, isDesktop, paused, setPaused, reduced } = useMotion()
  const navigate = useCallback(
    (id, { history = true, focus = true } = {}) => {
      const element = document.getElementById(id)
      if (!element) return
      if (history && location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
      if (focus) element.querySelector('h1,h2')?.focus({ preventScroll: true })
      element.scrollIntoView({ behavior: animate ? 'smooth' : 'instant', block: 'start' })
    },
    [animate],
  )
  useEffect(() => {
    const onHistory = () => {
      const id = location.hash.slice(1)
      if (NAV_LINKS.some((link) => link.id === id)) navigate(id, { history: false, focus: false })
    }
    const initial = requestAnimationFrame(onHistory)
    window.addEventListener('popstate', onHistory)
    window.addEventListener('hashchange', onHistory)
    return () => {
      cancelAnimationFrame(initial)
      window.removeEventListener('popstate', onHistory)
      window.removeEventListener('hashchange', onHistory)
    }
  }, [navigate])
  useEffect(() => {
    let frame
    const update = () => {
      frame = null
      const line = window.innerHeight * 0.35
      let id = 'home'
      for (const link of NAV_LINKS)
        if (document.getElementById(link.id)?.getBoundingClientRect().top <= line) id = link.id
      setActiveSection(id)
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', scroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', scroll)
    }
  }, [])
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar activeSection={activeSection} scrollToSection={navigate} />
      <DecorationBoundary fallback={null}>
        <BrandIntro requestId={introRequest} />
      </DecorationBoundary>
      {isDesktop && (
        <DecorationBoundary
          fallback={
            <div className="static-artwork" aria-hidden="true">
              ✦
            </div>
          }
        >
          <Suspense fallback={null}>
            <MorphTransitionSlot />
          </Suspense>
        </DecorationBoundary>
      )}
      <main
        id="main"
        className="main-wrap"
        tabIndex={-1}
        onClick={(event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return
          const anchor = event.target.closest('a[href^="#"]')
          const id = anchor?.getAttribute('href').slice(1)
          if (anchor?.target === '_blank' || !NAV_LINKS.some((link) => link.id === id)) return
          event.preventDefault()
          navigate(id)
        }}
      >
        <HomeSection onReplayIntro={replayIntro} />
        <AboutSection />
        <KryzectSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <div className="motion-controls">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          disabled={reduced}
        >
          {reduced ? 'Reduced motion enabled' : paused ? 'Resume animations' : 'Pause animations'}
        </button>
      </div>
      <Footer scrollToSection={navigate} />
      <AssistantLauncher onNavigate={navigate} />
    </>
  )
}
export default function App() {
  return (
    <MotionProvider>
      <Portfolio />
    </MotionProvider>
  )
}
