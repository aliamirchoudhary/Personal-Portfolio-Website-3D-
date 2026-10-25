import { lazy, Suspense, useEffect, useState } from 'react'
import { PERSONAL } from '../../data/portfolioData'
import { useMotion } from '../../context/motion'
import LazyMount from '../shared/LazyMount'
const Portrait = lazy(() => import('../animated/HomeProfilePicture'))

export default function HomeSection({ onReplayIntro }) {
  const { animate, isDesktop, lowPower, reduced, paused } = useMotion()
  const typeTitle = animate && isDesktop && !lowPower
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!typeTitle || count >= PERSONAL.title.length) return
    const timer = setTimeout(() => setCount((value) => value + 1), 35)
    return () => clearTimeout(timer)
  }, [typeTitle, count])
  const portraitFallback = (
    <img
      className="artwork-fallback"
      src="/profile-320.webp"
      srcSet="/profile-320.webp 320w, /profile-640.webp 640w"
      sizes="(max-width: 1024px) 180px, 320px"
      width="180"
      height="180"
      style={{ width: 180, height: 180 }}
      alt=""
    />
  )
  return (
    <section id="home" className="portfolio-section" aria-labelledby="home-heading">
      <div className="section-content content-left">
        <h1
          id="home-heading"
          tabIndex={-1}
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: 'clamp(2.5rem,5vw,4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: '0 0 1rem',
          }}
        >
          {PERSONAL.name}
        </h1>
        <p className="hero-title">
          <span className="sr-only">{PERSONAL.title}</span>
          <span aria-hidden="true" className="hero-title-reserve">
            {PERSONAL.title}
          </span>
          <span aria-hidden="true" className="hero-title-typed">
            {typeTitle ? PERSONAL.title.slice(0, count) : PERSONAL.title}
            <span className="typing-cursor">|</span>
          </span>
        </p>
        <p className="hero-summary">{PERSONAL.tagline}</p>
        <div className="hero-actions">
          <a href="#projects" className="primary-button">
            View projects
          </a>
          <a href="#contact" className="secondary-button">
            Get in touch
          </a>
          <a
            href={PERSONAL.resumeUrl}
            download="Muhammad_Ali_Aamir_Resume.pdf"
            className="secondary-button"
          >
            Download resume
          </a>
        </div>
        <button
          type="button"
          className="intro-replay-link"
          onClick={onReplayIntro}
          disabled={reduced || paused}
        >
          ↻ Replay introduction
        </button>
      </div>
      <div className="home-mobile-profile">
        <LazyMount placeholder={portraitFallback}>
          <Suspense fallback={portraitFallback}>
            <Portrait imageSrc={PERSONAL.profileImage} size={180} />
          </Suspense>
        </LazyMount>
      </div>
    </section>
  )
}
