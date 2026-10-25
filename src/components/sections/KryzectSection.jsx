import { Suspense } from 'react'
import { PERSONAL } from '../../data/portfolioData'
import LazyMount from '../shared/LazyMount'
import KryzectLogo from '../ui/KryzectLogo'

const ACCENT = '#8FAEFF'
const CTA_BG = '#7c3aed'
const KRYZECT_TITLE = '#F5F7FF'
const WT_SOFT = '#a78bfa'

const LINKS = [
  {
    label: 'Visit Kryzect',
    url: 'https://kryzect.vercel.app/',
    icon: 'fas fa-globe',
    primary: true,
  },
  {
    label: 'Explore Services',
    url: 'https://kryzect.vercel.app/services',
    icon: 'fas fa-layer-group',
    primary: false,
  },
  {
    label: 'Contact Kryzect',
    url: 'https://kryzect.vercel.app/contact',
    icon: 'fas fa-envelope',
    primary: false,
  },
]

export default function KryzectSection() {
  return (
    <section id="kryzect" className="portfolio-section">
      <div className="section-content content-left">
        <h2
          tabIndex={-1}
          style={{
            color: KRYZECT_TITLE,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 1rem',
            flexShrink: 0,
          }}
        >
          Kryzect
        </h2>

        <p
          style={{
            color: ACCENT,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '1.6rem',
            letterSpacing: '0.03em',
            margin: '0 0 0.75rem',
            flexShrink: 0,
          }}
        >
          Think First. Build Better.
        </p>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.02rem',
            lineHeight: 1.7,
            margin: '0 0 0.5rem',
            maxWidth: 640,
            flexShrink: 0,
          }}
        >
          Kryzect is my software engineering and AI company — built on the belief that software
          fails more often because the wrong problem is solved than because of poor programming.
          Every engagement starts by understanding your goals and vision before a single technical
          recommendation is made: clarity before code.
        </p>

        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#a5b2c6',
            fontSize: '0.92rem',
            margin: '0 0 1.5rem',
            flexShrink: 0,
          }}
        >
          <i aria-hidden="true" className="fas fa-feather-alt" style={{ color: ACCENT }} />
          Founded &amp; built by {PERSONAL.name} (me), using the ideas that power this portfolio.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            margin: '0 0 1.5rem',
            flexShrink: 0,
          }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.2rem',
                borderRadius: 8,
                border: `1px solid ${l.primary ? CTA_BG : WT_SOFT}`,
                background: l.primary ? CTA_BG : 'rgba(167, 139, 250, 0.08)',
                color: l.primary ? '#ffffff' : WT_SOFT,
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                textDecoration: 'none',
                transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
              }}
            >
              <i aria-hidden="true" className={l.icon} />
              {l.label}
            </a>
          ))}
        </div>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.98rem',
            lineHeight: 1.7,
            maxWidth: 620,
            flexShrink: 0,
          }}
        >
          From websites and custom software to AI solutions and workflow automation, Kryzect helps
          businesses design, build, and scale digital products.
          <span style={{ color: '#e2e8f0' }}>
            {''} Take a look at what we build and reach out to start your project.
          </span>
        </p>

        <div className="mobile-animated-component">
          <LazyMount>
            <Suspense fallback={null}>
              <KryzectLogo size={260} />
            </Suspense>
          </LazyMount>
        </div>
      </div>
    </section>
  )
}
