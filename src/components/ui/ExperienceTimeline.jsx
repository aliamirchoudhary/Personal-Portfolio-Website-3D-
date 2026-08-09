import { useState, useEffect } from 'react'

export function Timeline({ items = [], activeIndex = -1, fill, rowRefs }) {
  const [visible, setVisible] = useState({})
  const [openDesc, setOpenDesc] = useState({})

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
    <div className="et-timeline">
      <div className="et-line" />
      <div
        className="et-line-fill"
        style={{
          top: fill?.top ?? 0,
          height: fill?.height ?? 0,
          opacity: fill?.opacity ?? 0,
        }}
      />
      {items.map((item, i) => {
        const side = i % 2 === 0 ? "left" : "right"
        const isActive = i === activeIndex
        const isOpen = openDesc[i]
        return (
          <div
            key={item.id}
            data-index={i}
            ref={(el) => (rowRefs.current[i] = el)}
            className={`et-row ${side} ${visible[i] ? "visible" : ""}`}
          >
            <span className={`et-dot ${isActive ? "active" : ""}`} />
            <div className={`et-card ${isActive ? "active" : ""}`}>
              <span className="et-connector" />
              <h3 className="et-degree">{item.role}</h3>
              <p className="et-institution">{item.company}</p>
              <span className="et-years et-mono">{item.year}</span>
              <div>
                <button
                  className={`et-btn ${isOpen ? "open" : ""}`}
                  aria-expanded={isOpen ? "true" : "false"}
                  onClick={() =>
                    setOpenDesc((prev) => ({ ...prev, [i]: !prev[i] }))
                  }
                >
                  {isOpen ? "Hide Details" : "View Details"}{" "}
                  <span className="et-arrow">→</span>
                </button>
              </div>
              <ul className={`et-courses ${isOpen ? "open" : ""}`}>
                <li className="et-course" style={{ alignItems: 'flex-start', lineHeight: 1.5 }}>
                  <svg
                    className="et-course-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ marginTop: 2 }}
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  {item.description}
                </li>
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}