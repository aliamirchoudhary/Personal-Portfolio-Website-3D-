import { useState, useEffect, useRef } from 'react'
import './skills-grid.css'

// ─── Data (extracted exactly from old HTML) ───────────────────────────────────

import { TECHNICAL_SKILLS, PROFESSIONAL_SKILLS } from '../../data/portfolioData'

// ─── CSS injected once ────────────────────────────────────────────────────────

// ─── SkillCard ────────────────────────────────────────────────────────────────

function SkillCard({ name, pct, delay }) {
  const cardRef = useRef(null)
  const fillRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [barWidth, setBarWidth] = useState('0%')

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const timers = []
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timers.push(
            setTimeout(() => {
              setVisible(true)
              timers.push(setTimeout(() => setBarWidth(`${pct >= 90 ? 90 : 70}%`), 80))
            }, delay),
          )
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [delay, pct])

  return (
    <div
      ref={cardRef}
      className={`sg-skill-card${visible ? ' visible' : ''}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="sg-skill-name">{name}</div>
      <div className="sg-bar-track">
        <div ref={fillRef} className="sg-bar-fill" aria-hidden="true" style={{ width: barWidth }} />
      </div>
      <div className="skill-level">{pct >= 90 ? 'Advanced' : 'Proficient'}</div>
    </div>
  )
}

// ─── SkillsGrid (main export) ─────────────────────────────────────────────────

export default function SkillsGrid() {
  const [activeTab, setActiveTab] = useState('technical')

  const skills = activeTab === 'technical' ? TECHNICAL_SKILLS : PROFESSIONAL_SKILLS

  return (
    <div style={{ width: '100%', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      {/* Tab buttons */}
      <div
        style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.4rem' }}
      >
        <button
          className={`sg-tab-btn${activeTab === 'technical' ? ' active' : ''}`}
          aria-pressed={activeTab === 'technical'}
          onClick={() => setActiveTab('technical')}
        >
          Technical Skills
        </button>
        <button
          className={`sg-tab-btn${activeTab === 'professional' ? ' active' : ''}`}
          aria-pressed={activeTab === 'professional'}
          onClick={() => setActiveTab('professional')}
        >
          Professional Skills
        </button>
      </div>

      <p className="skill-assessment">
        Self-assessed proficiency. See my projects for applied examples.
      </p>
      {/* Skill grid */}
      <div className="sg-scrollable">
        <div className="sg-grid">
          {skills.map((s, i) => (
            <SkillCard key={`${activeTab}-${s.name}`} name={s.name} pct={s.pct} delay={i * 15} />
          ))}
        </div>
      </div>
    </div>
  )
}
