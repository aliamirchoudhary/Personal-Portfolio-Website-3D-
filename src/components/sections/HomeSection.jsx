import { useState, useEffect } from 'react'
import { PERSONAL } from '../../data/portfolioData'
import HomeProfilePicture from '../animated/HomeProfilePicture'
import LazyMount from '../shared/LazyMount'

const TYPING_SPEED = 50

export default function HomeSection() {
  const fullTitle = PERSONAL.title
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (idx >= fullTitle.length) return
    const t = setTimeout(() => {
      setDisplayed(fullTitle.slice(0, idx + 1))
      setIdx(idx + 1)
    }, TYPING_SPEED)
    return () => clearTimeout(t)
  }, [idx, fullTitle])

  return (
    <section id="home" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        style={{
          marginLeft: 0,
          width: '60vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
        }}
      >
        <h1
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            margin: '0 0 1rem',
          }}
        >
          {PERSONAL.name}
        </h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            margin: '0 0 2rem',
            minHeight: '1.6em',
          }}
        >
          {displayed}
          <span style={{ animation: 'blink 1s infinite', color: '#a78bfa' }}>|</span>
        </p>

        <a
          href={PERSONAL.resumeUrl}
          download="Muhammad_Ali_Aamir_Resume.pdf"
          className="hover-glow-lift"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            color: '#fff',
            padding: '1rem 2.5rem',
            borderRadius: 50,
            fontSize: '1.1rem',
            fontWeight: 600,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.3)',
          }}
        >
          <i className="fas fa-download" />
          Download Resume
        </a>
      </div>

      <div className="home-mobile-profile">
        <LazyMount margin="250px" placeholder={<div style={{ height: 180 }} />}>
          <HomeProfilePicture imageSrc={PERSONAL.profileImage} size={180} />
        </LazyMount>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .home-mobile-profile { display: none; }
        @media (max-width: 1024px) {
          .home-mobile-profile {
            display: flex !important;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
        }
      `}</style>
    </section>
  )
}
