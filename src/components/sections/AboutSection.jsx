import { useState, useEffect, useRef } from 'react'
import { ABOUT_TEXT, PERSONAL, WEBCRAFT } from '../../data/portfolioData'
import WebCraftLogo from '../ui/StartupLogoButton'

const WC_FONT = "'Clash Display', 'Clash Grotesk', 'Space Grotesk', sans-serif"

function formatText(text) {
  const parts = []
  let remaining = text
  while (remaining.length > 0) {
    const idx = remaining.indexOf('WebCraft')
    if (idx === -1) { parts.push(remaining); break }
    if (idx > 0) parts.push(remaining.slice(0, idx))
    parts.push(
      <a key={`wc-${idx}`} href={WEBCRAFT.url} target="_blank" rel="noopener noreferrer"
        style={{ color: '#99ffcc', fontWeight: 700, textDecoration: 'none', fontFamily: WC_FONT }}>
        WebCraft
      </a>
    )
    remaining = remaining.slice(idx + 8)
  }
  return parts
}

export default function AboutSection() {
  const sectionRef = useRef(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAnimKey((k) => k + 1)
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="portfolio-section" style={{ minHeight: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: '40vw',
          width: '60vw',
          padding: '4rem 4rem',
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 2rem',
          }}
        >
          About Me
        </h2>

        {ABOUT_TEXT.map((para, i) => (
          <p
            key={i}
            style={{
              color: '#94a3b8',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              marginBottom: '1.5rem',
              maxWidth: 680,
            }}
          >
            {formatText(para)}
          </p>
        ))}

        <div
          className="glass-card"
          style={{
            padding: '2rem',
            marginTop: '1rem',
            maxWidth: 680,
          }}
        >
          <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '1rem' }}>
            Feel free to reach out for collaboration!
          </p>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
            <i className="fas fa-envelope" style={{ color: '#7c3aed', marginRight: 8 }} />
            <a href={`mailto:${PERSONAL.email}`} style={{ color: '#a78bfa', textDecoration: 'none' }}>
              {PERSONAL.email}
            </a>
            <span style={{ margin: '0 8px', color: '#94a3b8' }}>|</span>
            <i className="fab fa-linkedin-in" style={{ color: '#7c3aed', marginRight: 8 }} />
            <a
              href="https://www.linkedin.com/in/muhammad-ali-aamir2558"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a78bfa', textDecoration: 'none' }}
            >
              LinkedIn Profile
            </a>
          </p>

          <div
            style={{
              marginTop: '1.2rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <a
              href={WEBCRAFT.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
              }}
            >
              <WebCraftLogo key={animKey} size={28} color="#99ffcc" replay={false} />
              <span style={{
                color: '#99ffcc',
                fontWeight: 700,
                fontSize: '1.15rem',
                fontFamily: WC_FONT,
                letterSpacing: '0.02em',
              }}>
                {WEBCRAFT.name}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
