import { useState } from 'react'
import { NavJumper } from '../navbar/NavJumper'
import { NAV_LINKS } from '../../data/portfolioData'

export default function Navbar({ activeSection, scrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleClick = (id) => {
    scrollToSection(id)
    setMobileOpen(false)
  }

  return (
    <nav className="navbar-container"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
        height: 96,
        display: 'flex',
        alignItems: 'center',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 2rem',
        }}
      >
        <button
          onClick={() => handleClick('home')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="njx-badge" style={{ position: 'relative', width: 36, height: 44 }}>
            <span className="njx-fold" />
            <span className="njx-badge-label" style={{ position: 'relative', zIndex: 1 }}>.py</span>
          </div>
        </button>

        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', overflow: 'visible' }}>
          <NavJumper links={NAV_LINKS} activeId={activeSection} onSelect={handleClick} />
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#f1f5f9',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: 0,
            marginLeft: 'auto',
          }}
          className="mobile-menu-btn"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            width: '100%',
            background: 'rgba(10, 10, 15, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 2rem',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(124, 58, 237, 0.15)',
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleClick(link.id)}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                color: activeSection === link.id ? '#a78bfa' : '#94a3b8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 8,
                textAlign: 'left',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        :root {
          --bg: #0a0a0f;
          --surface: #12121a;
          --primary: #7c3aed;
          --secondary: #06b6d4;
          --glow: #a78bfa;
          --text-1: #f1f5f9;
          --text-2: #94a3b8;
          --danger: #f43f5e;
        }
        .navbar-container .njx-nav {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: none !important;
        }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
