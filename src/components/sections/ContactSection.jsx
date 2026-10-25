import { lazy, Suspense } from 'react'
import { SOCIAL_LINKS, PERSONAL } from '../../data/portfolioData'
import LazyMount from '../shared/LazyMount'
import ContactForm from '../ui/ContactForm'

const MorphingCommsIcon = lazy(() =>
  import('../animated/MorphingCommsIcon').then((m) => ({ default: m.MorphingCommsIcon })),
)

export default function ContactSection() {
  return (
    <section id="contact" className="portfolio-section">
      <div className="section-content content-right">
        <h2
          tabIndex={-1}
          style={{
            flexShrink: 0,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            margin: '0 0 0.75rem',
            background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Let's Bring Your Ideas to Life
        </h2>
        <p style={{ flexShrink: 0, color: '#94a3b8', marginBottom: '1.5rem', fontSize: '1rem' }}>
          Ready to start your next project? Let's discuss how we can work together.
        </p>

        <div>
          <div className="contact-grid">
            <div>
              <ContactForm />
            </div>

            <div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: '#f1f5f9',
                  marginBottom: '1.5rem',
                }}
              >
                Connect With Me
              </h3>

              <div
                className="contact-social-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1rem',
                  marginBottom: '2.5rem',
                }}
              >
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="hover-lift"
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(18,18,26,0.8)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(124,58,237,0.2)',
                      color: '#f1f5f9',
                      fontSize: '1.6rem',
                      textDecoration: 'none',
                    }}
                  >
                    <i aria-hidden="true" className={`${s.fa} ${s.icon}`} />
                  </a>
                ))}
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <p
                  style={{
                    color: '#94a3b8',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span role="img" aria-label="location">
                    📍
                  </span>{' '}
                  Based in {PERSONAL.location}
                </p>
                <p
                  style={{
                    color: '#94a3b8',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span role="img" aria-label="availability">
                    🕐
                  </span>{' '}
                  {PERSONAL.availability}
                </p>
                <p style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span role="img" aria-label="languages">
                    🌐
                  </span>{' '}
                  {PERSONAL.languages}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-animated-component">
        <LazyMount margin="250px" placeholder={<div style={{ height: 200 }} />}>
          <Suspense fallback={null}>
            <MorphingCommsIcon />
          </Suspense>
        </LazyMount>
      </div>
    </section>
  )
}
