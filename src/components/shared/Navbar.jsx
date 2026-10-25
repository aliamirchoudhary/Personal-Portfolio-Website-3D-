import { useEffect, useRef, useState } from 'react'
import { NavJumper } from '../navbar/NavJumper'
import { NAV_LINKS } from '../../data/portfolioData'
import { useMotion } from '../../context/motion'

export default function Navbar({ activeSection, scrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButton = useRef(null),
    menu = useRef(null)
  const { isDesktop } = useMotion()
  const navigate = (event, id) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    setMobileOpen(false)
    scrollToSection(id)
  }
  useEffect(() => {
    if (!mobileOpen) return
    const key = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuButton.current?.focus()
      }
    }
    const outside = (event) => {
      if (!menu.current?.contains(event.target) && !menuButton.current?.contains(event.target))
        setMobileOpen(false)
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', outside)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('pointerdown', outside)
    }
  }, [mobileOpen])
  return (
    <nav className="navbar-container" aria-label="Main navigation">
      <div className="navbar-inner">
        <a
          href="#home"
          onClick={(event) => navigate(event, 'home')}
          className="home-logo"
          aria-label=".py — Home"
        >
          <span className="njx-badge" aria-hidden="true">
            <span className="njx-fold" />
            <span className="njx-badge-label">.py</span>
          </span>
        </a>
        {isDesktop ? (
          <div className="nav-links-desktop">
            <NavJumper links={NAV_LINKS} activeId={activeSection} onSelect={scrollToSection} />
          </div>
        ) : (
          <button
            ref={menuButton}
            className="mobile-menu-btn"
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span aria-hidden="true">{mobileOpen ? '×' : '☰'}</span>
          </button>
        )}
      </div>
      {!isDesktop && mobileOpen && (
        <div id="mobile-navigation" className="mobile-navigation" ref={menu}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={activeSection === link.id ? 'location' : undefined}
              onClick={(event) => navigate(event, link.id)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
