import { useState } from 'react'
import { SOCIAL_LINKS, PERSONAL } from '../../data/portfolioData'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [notification, setNotification] = useState(null)
  const [sending, setSending] = useState(false)

  const showNotification = (type, text) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.name.length < 2) {
      showNotification('error', 'Name must be at least 2 characters')
      return
    }
    if (!emailRegex.test(form.email)) {
      showNotification('error', 'Please enter a valid email address')
      return
    }
    if (form.message.length < 10) {
      showNotification('error', 'Message must be at least 10 characters')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })
      const data = await res.json()
      if (data.success) {
        showNotification('success', data.message)
        setForm({ name: '', email: '', message: '' })
      } else {
        showNotification('error', data.message || 'Something went wrong.')
      }
    } catch {
      showNotification('error', 'Network error — could not send message.')
    }
    setSending(false)
  }

  return (
    <section id="contact" className="portfolio-section" style={{ height: '100vh' }}>
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

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: 960 }}>
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#7c3aed', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: 10,
                    border: '2px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#7c3aed', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: 10,
                    border: '2px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#7c3aed', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: 10,
                    border: '2px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#7c3aed'; e.target.style.boxShadow = '0 0 20px rgba(124,58,237,0.3)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 50,
                  border: 'none',
                  background: sending ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  color: sending ? '#94a3b8' : '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.3s, box-shadow 0.3s, background 0.3s',
                  boxShadow: sending ? 'none' : '0 10px 25px rgba(124,58,237,0.3)',
                }}
                onMouseEnter={(e) => { if (!sending) { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 15px 35px rgba(124,58,237,0.4)' } }}
                onMouseLeave={(e) => { if (!sending) { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 25px rgba(124,58,237,0.3)' } }}
              >
                {sending ? 'Sending...' : <><i className="fas fa-paper-plane" /> Send Message</>}
              </button>
            </form>
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px) scale(1.1)'
                    e.target.style.boxShadow = '0 15px 30px rgba(124,58,237,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <i className={`${s.fa} ${s.icon}`} />
                </a>
              ))}
            </div>

            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="location">📍</span> Based in {PERSONAL.location}
              </p>
              <p style={{ color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="availability">🕐</span> {PERSONAL.availability}
              </p>
              <p style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span role="img" aria-label="languages">🌐</span> {PERSONAL.languages}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            right: 24,
            zIndex: 9999,
            padding: '1rem 1.5rem',
            borderRadius: 12,
            background: notification.type === 'error' ? 'rgba(244, 63, 94, 0.95)' : 'rgba(16, 185, 129, 0.95)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.95rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            animation: 'slideInRight 0.3s ease',
            maxWidth: 360,
          }}
        >
          {notification.text}
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
