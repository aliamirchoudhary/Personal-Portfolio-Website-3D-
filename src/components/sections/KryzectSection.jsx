import { PERSONAL } from '../../data/portfolioData'
import KryzectLogo from '../ui/KryzectLogo'
import LazyMount from '../shared/LazyMount'

const ACCENT = '#8FAEFF'
const CTA_BG = '#7c3aed'
const KRYZECT_TITLE = '#F5F7FF'
const WT_SOFT = '#a78bfa'

const LINKS = [
  { label: "Visit Kryzect", url: "https://kryzect.vercel.app/", icon: "fas fa-globe", primary: true },
  { label: "Explore Services", url: "https://kryzect.vercel.app/services", icon: "fas fa-layer-group", primary: false },
  { label: "Contact Kryzect", url: "https://kryzect.vercel.app/contact", icon: "fas fa-envelope", primary: false },
]

export default function KryzectSection() {
  return (
    <section id="kryzect" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: 0,
          width: '60vw',
          height: '100vh',
          padding: '1rem 4rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <h2
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
            fontFamily: "'Clash Display', 'Space Grotesk', sans-serif",
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
          Every engagement starts by understanding your goals and vision before a single
          technical recommendation is made: clarity before code.
        </p>

        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#64748b',
            fontSize: '0.92rem',
            margin: '0 0 1.5rem',
            flexShrink: 0,
          }}
        >
          <i className="fas fa-feather-alt" style={{ color: ACCENT }} />
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
              <i className={l.icon} />
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
          From websites and custom software to AI solutions and workflow automation, Kryzect
          helps businesses design, build, and scale digital products.
          <span style={{ color: '#e2e8f0' }}>
            {''} Take a look at what we build and reach out to start your project.
          </span>
        </p>

        <div className="mobile-animated-component" style={{ marginTop: 'auto' }}>
          <LazyMount><KryzectLogo size={260} /></LazyMount>
        </div>
      </div>
    </section>
  )
}