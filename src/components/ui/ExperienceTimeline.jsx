import { useState, useEffect } from 'react'

const XC = {
  surface: '#12121a',
  surfaceHi: '#161a24',
  primary: '#7c3aed',
  secondary: '#06b6d4',
  glow: '#a78bfa',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
}

export function TimelineStyles() {
  return (
    <style>{`
      .xp-timeline {
        position: relative;
        max-width: 720px;
        margin: 0 auto;
      }

      .xp-line {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 22px;
        width: 2px;
        transform: translateX(-50%);
        background: ${XC.primary}26;
        border-radius: 2px;
      }

      .xp-line-fill {
        position: absolute;
        left: 22px;
        width: 5px;
        transform: translateX(-50%);
        border-radius: 5px;
        background: linear-gradient(${XC.primary}, ${XC.secondary});
        box-shadow: 0 0 12px 3px ${XC.glow}, 0 0 26px 8px ${XC.primary}88;
        transition: opacity 0.2s ease;
        will-change: top, height;
        pointer-events: none;
      }

      .xp-row {
        position: relative;
        margin-bottom: 44px;
        padding-left: 56px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1);
      }
      .xp-row.visible { opacity: 1; transform: translateY(0); }

      .xp-dot {
        position: absolute;
        top: 20px;
        left: 22px;
        width: 14px;
        height: 14px;
        transform: translateX(-50%);
        border-radius: 50%;
        background: ${XC.surface};
        border: 2px solid ${XC.primary}80;
        box-shadow: 0 0 8px 1px ${XC.primary}55;
        z-index: 2;
        transition: box-shadow 0.4s ease, transform 0.4s ease, background 0.4s ease, border-color 0.4s ease;
      }
      .xp-dot.active {
        background: ${XC.glow};
        border-color: ${XC.glow};
        transform: translateX(-50%) scale(1.4);
        box-shadow: 0 0 16px 4px ${XC.glow}, 0 0 34px 10px ${XC.primary};
      }

      .xp-connector {
        position: absolute;
        top: 20px;
        left: -30px;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, ${XC.primary}, ${XC.glow}00);
      }

      /* ---- sweep card: front face covers, description sits behind ---- */
      .xp-card {
        position: relative;
        border-radius: 16px;
        background: ${XC.surface};
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        border: 1px solid ${XC.primary}30;
      }
      .xp-card.active {
        border-color: ${XC.primary};
        box-shadow: 0 0 0 1px ${XC.primary}, 0 8px 40px ${XC.primary}55;
      }

      /* description layer is always behind, sized by content */
      .xp-desc {
        padding: 22px 22px 24px;
        background: linear-gradient(135deg, ${XC.surface}, ${XC.surfaceHi});
        color: ${XC.textSecondary};
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* front face covers description; sweeps up on hover to reveal it */
      .xp-front {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 22px 22px 24px;
        background: linear-gradient(135deg, ${XC.surface}, ${XC.surfaceHi});
        border: 1px solid ${XC.primary}22;
        border-radius: 16px;
        transform-origin: top center;
        transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
        cursor: pointer;
        will-change: transform;
        z-index: 1;
      }
      .xp-card.hovered .xp-front { transform: translateY(-104%); z-index: 0; }

      .xp-role {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 1.15rem;
        color: ${XC.textPrimary};
        margin: 0 0 4px;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }
      .xp-company {
        font-size: 0.9rem;
        font-weight: 600;
        color: ${XC.glow};
        margin: 0 0 10px;
      }
      .xp-year {
        display: inline-block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        color: ${XC.secondary};
        border: 1px solid ${XC.secondary}40;
        border-radius: 8px;
        padding: 2px 8px;
      }

      .xp-hint {
        margin-top: 14px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        color: ${XC.textSecondary};
        opacity: 0.7;
      }

      @media (max-width: 640px) {
        .xp-row { padding-left: 40px; }
        .xp-line, .xp-line-fill, .xp-dot { left: 12px; }
        .xp-connector { left: -24px; width: 24px; }
        .xp-front { box-shadow: none; }
      }
    `}</style>
  )
}

export function Timeline({ items = [], activeIndex = -1, fill, rowRefs }) {
  const [visible, setVisible] = useState({})
  const [hovered, setHovered] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = { ...prev }
          entries.forEach((entry) => {
            const idx = Number(entry.target.dataset.index)
            if (entry.isIntersecting) next[idx] = true
          })
          return next
        })
      },
      { threshold: 0.25 }
    )
    rowRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items, rowRefs])

  return (
    <div className="xp-timeline">
      <div className="xp-line" />
      <div
        className="xp-line-fill"
        style={{
          top: fill?.top ?? 0,
          height: fill?.height ?? 0,
          opacity: fill?.opacity ?? 0,
        }}
      />
      {items.map((item, i) => {
        const isActive = i === activeIndex
        const isHovered = hovered[i]
        return (
          <div
            key={item.id}
            data-index={i}
            ref={(el) => (rowRefs.current[i] = el)}
            className={`xp-row ${visible[i] ? "visible" : ""}`}
            onMouseEnter={() => setHovered((p) => ({ ...p, [i]: true }))}
            onMouseLeave={() => setHovered((p) => ({ ...p, [i]: false }))}
            onTouchStart={() => setHovered((p) => ({ ...p, [i]: !p[i] }))}
          >
            <span className={`xp-dot ${isActive ? "active" : ""}`} />
            <div className={`xp-card ${isActive ? "active" : ""} ${isHovered ? "hovered" : ""}`}>
              <span className="xp-connector" />
              <div className="xp-desc">{item.description}</div>
              <div className="xp-front">
                <h3 className="xp-role">{item.role}</h3>
                <p className="xp-company">{item.company}</p>
                <span className="xp-year xp-mono">{item.year}</span>
                <span className="xp-hint">hover to reveal what I did</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}