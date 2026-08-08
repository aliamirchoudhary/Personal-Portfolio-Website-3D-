import KryzectLogo from '../ui/KryzectLogo'
import { SOCIAL_LINKS, NAV_LINKS, KRYZECT } from '../../data/portfolioData'

const WC_FONT = "'Clash Display', 'Clash Grotesk', 'Space Grotesk', sans-serif"

export default function Footer({ scrollToSection }) {
  const year = new Date().getFullYear()

  const socialFooter = SOCIAL_LINKS.filter((s) =>
    ['fa-linkedin-in', 'fa-github', 'fa-dollar-sign'].includes(s.icon)
  )

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: 'linear-gradient(135deg, #050508, #0a0a0f)',
        borderTop: '1px solid rgba(108, 151, 247, 0.2)',
        padding: '3rem 2rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          &copy; {year} Muhammad Ali Aamir. All rights reserved.
        </div>

        <div
          style={{
            textAlign: 'center',
            color: '#6C97F7',
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: '0.95rem',
          }}
        >
          Crafted with passion &amp; code
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          {socialFooter.map((s) => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(108, 151, 247, 0.1)',
                border: '1px solid rgba(108, 151, 247, 0.2)',
                color: '#6C97F7',
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#6C97F7'
                e.target.style.color = 'white'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(108, 151, 247, 0.1)'
                e.target.style.color = '#6C97F7'
                e.target.style.transform = 'scale(1)'
              }}
            >
              <i className={`${s.fa || 'fab'} ${s.icon}`} />
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            style={{
              color: '#94a3b8',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              fontFamily: "'Inter', sans-serif",
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#6C97F7' }}
            onMouseLeave={(e) => { e.target.style.color = '#94a3b8' }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* Branding row */}
      <div
        style={{
          maxWidth: 1200,
          margin: '1rem auto 0',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(124,58,237,0.12)',
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        <div
          className="footer-brand"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
            Designed and Developed by my agency:
          </span>

          <a
            href={KRYZECT.url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-brand-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              textDecoration: 'none',
            }}
          >
            <KryzectLogo size={18} />
            <span style={{
              color: '#8FAEFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: WC_FONT,
              letterSpacing: '0.02em',
            }}>
              {KRYZECT.name}
            </span>
          </a>

          <a
            href="https://kryzect.vercel.app/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-brand-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #8FAEFF',
              background: 'transparent',
              color: '#8FAEFF',
              fontWeight: 600,
              fontSize: '0.82rem',
              fontFamily: "'Inter', sans-serif",
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
