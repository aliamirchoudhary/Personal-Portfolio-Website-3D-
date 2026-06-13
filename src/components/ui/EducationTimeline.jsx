import React, { useEffect, useRef, useState } from "react"

/* =========================================================================
   GLOBAL STYLE TOKENS  (dark theme only)
   ========================================================================= */
const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  primary: "#7c3aed",
  secondary: "#06b6d4",
  glow: "#a78bfa",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  danger: "#f43f5e",
}

/* Inject Google Fonts + keyframes + base styles once. */
export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

      * { box-sizing: border-box; }

      .et-root {
        background: ${C.bg};
        color: ${C.textPrimary};
        font-family: 'Inter', system-ui, sans-serif;
        min-height: 100vh;
        margin: 0;
        padding: 64px 16px 120px;
        line-height: 1.6;
      }

      .et-display {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .et-mono {
        font-family: 'JetBrains Mono', monospace;
      }

      /* timeline wrapper */
      .et-timeline {
        position: relative;
        max-width: 760px;
        margin: 0 auto;
      }

      /* central vertical line (dim base track) */
      .et-line {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px;
        transform: translateX(-50%);
        background: ${C.primary}26;
        border-radius: 2px;
        overflow: visible;
      }

      /* scroll-driven lit segment that travels between card centers.
         top/height are written every animation frame from the scroll handler,
         so we DON'T transition them (that caused the laggy "catch-up" jump,
         especially when scrolling back up). Only opacity is eased. */
      .et-line-fill {
        position: absolute;
        left: 50%;
        width: 4px;
        transform: translateX(-50%);
        border-radius: 4px;
        background: linear-gradient(to bottom, ${C.primary}, ${C.secondary});
        box-shadow: 0 0 10px 2px ${C.glow}, 0 0 22px 6px ${C.primary}88;
        transition: opacity 0.2s ease;
        will-change: top, height;
        pointer-events: none;
        /* keep below the rows so the dots/circles always paint on top */
        z-index: 0;
      }

      /* one timeline row */
      .et-row {
        position: relative;
        display: flex;
        margin-bottom: 56px;
        opacity: 0;
        transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1);
      }
      .et-row.left  { justify-content: flex-start; transform: translateX(-40px); }
      .et-row.right { justify-content: flex-end;   transform: translateX(40px); }
      .et-row.visible { opacity: 1; transform: translateX(0); }

      /* glassmorphic card */
      .et-card {
        position: relative;
        width: 280px;
        background: ${C.surface}cc;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid ${C.primary}30;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
      }
      .et-card.active {
        border-color: ${C.primary};
        box-shadow: 0 0 0 1px ${C.primary}, 0 8px 40px ${C.primary}55, 0 0 60px ${C.glow}40;
        transform: scale(1.015);
      }

      /* degree is now the prominent heading */
      .et-degree {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 1.15rem;
        color: ${C.textPrimary};
        margin: 0 0 4px;
        letter-spacing: -0.01em;
        line-height: 1.3;
      }
      /* institution is now the smaller secondary label */
      .et-institution {
        font-size: 0.88rem;
        font-weight: 500;
        color: ${C.textSecondary};
        margin: 0 0 10px;
      }
      .et-years {
        display: inline-block;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.72rem;
        color: ${C.secondary};
        border: 1px solid ${C.secondary}40;
        border-radius: 8px;
        padding: 2px 8px;
        margin-bottom: 14px;
      }
      .et-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: ${C.primary}1a;
        color: ${C.primary};
        border: 1px solid ${C.primary}40;
        border-radius: 8px;
        padding: 8px 12px;
        font-family: 'Inter', sans-serif;
        font-size: 0.82rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.25s ease, transform 0.15s ease;
      }
      .et-btn:hover { background: ${C.primary}33; transform: translateX(2px); }
      .et-btn .et-arrow {
        transition: transform 0.3s ease;
      }
      .et-btn.open .et-arrow { transform: rotate(90deg); }

      /* courses reveal — vertical animated list */
      .et-courses {
        list-style: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease, margin 0.35s ease;
      }
      .et-courses.open {
        max-height: 360px;
        opacity: 1;
        margin-top: 14px;
      }
      .et-course {
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.78rem;
        color: ${C.textSecondary};
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid transparent;
        cursor: default;
        transition: color 0.25s ease, background 0.25s ease, border-color 0.25s ease, transform 0.25s ease, padding-left 0.25s ease;
      }
      .et-course-icon {
        width: 15px;
        height: 15px;
        flex: none;
        color: ${C.glow};
        filter: drop-shadow(0 0 4px ${C.glow}aa);
        transition: transform 0.25s ease, color 0.25s ease, filter 0.25s ease;
      }
      .et-course:hover {
        color: ${C.textPrimary};
        background: ${C.glow}12;
        border-color: ${C.glow}33;
        transform: translateX(6px);
        padding-left: 14px;
      }
      .et-course:hover .et-course-icon {
        transform: scale(1.25) rotate(-8deg);
        color: ${C.secondary};
        filter: drop-shadow(0 0 8px ${C.secondary});
      }

      /* connector from card to center */
      .et-connector {
        position: absolute;
        top: 28px;
        height: 2px;
        width: 80px;
        background: linear-gradient(90deg, ${C.primary}, ${C.glow}00);
      }
      .et-row.left  .et-connector { right: -82px; background: linear-gradient(90deg, ${C.glow}00, ${C.primary}); }
      .et-row.right .et-connector { left: -82px; }

      /* glowing dot on the central line */
      .et-dot {
        position: absolute;
        top: 22px;
        left: 50%;
        width: 14px;
        height: 14px;
        transform: translateX(-50%);
        border-radius: 50%;
        background: ${C.surface};
        border: 2px solid ${C.primary}80;
        box-shadow: 0 0 8px 1px ${C.primary}55;
        z-index: 2;
        transition: box-shadow 0.4s ease, transform 0.4s ease, background 0.4s ease, border-color 0.4s ease;
      }
      .et-dot.active {
        background: ${C.glow};
        border-color: ${C.glow};
        transform: translateX(-50%) scale(1.4);
        box-shadow: 0 0 16px 4px ${C.glow}, 0 0 34px 10px ${C.primary};
      }

      @media (max-width: 640px) {
        .et-timeline { max-width: 100%; }
        .et-line, .et-line-fill { left: 20px; }
        .et-row.left, .et-row.right { justify-content: flex-start; padding-left: 48px; }
        .et-dot { left: 20px; }
        .et-row.left .et-connector,
        .et-row.right .et-connector { left: -28px; right: auto; width: 28px; background: linear-gradient(90deg, ${C.primary}, ${C.glow}00); }
        .et-card { width: 100%; max-width: 320px; }
      }
    `}</style>
  )
}

/* =========================================================================
   EDUCATION TIMELINE
   ========================================================================= */
export function EducationTimeline({ items = [], activeIndex = -1, fill, rowRefs }) {
  const [visible, setVisible] = useState({})
  const [openCourses, setOpenCourses] = useState({})

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
        const isOpen = openCourses[i]
        return (
          <div
            key={i}
            data-index={i}
            ref={(el) => (rowRefs.current[i] = el)}
            className={`et-row ${side} ${visible[i] ? "visible" : ""}`}
          >
            <span className={`et-dot ${isActive ? "active" : ""}`} />
            <div className={`et-card ${isActive ? "active" : ""}`}>
              <span className="et-connector" />
              <h3 className="et-degree">{item.degree}</h3>
              <p className="et-institution">{item.institution}</p>
              <span className="et-years et-mono">{item.years}</span>
              <div>
                <button
                  className={`et-btn ${isOpen ? "open" : ""}`}
                  aria-expanded={isOpen ? "true" : "false"}
                  onClick={() =>
                    setOpenCourses((prev) => ({ ...prev, [i]: !prev[i] }))
                  }
                >
                  {isOpen ? "Hide Courses" : "View Courses"}{" "}
                  <span className="et-arrow">→</span>
                </button>
              </div>
              <ul className={`et-courses ${isOpen ? "open" : ""}`}>
                {item.courses?.map((course, ci) => (
                  <li key={ci} className="et-course">
                    <svg
                      className="et-course-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                      <path d="m9 11 3 3L22 4" />
                    </svg>
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* =========================================================================
   DEMO / DEFAULT EXPORT  — scroll-driven line light + active card
   ========================================================================= */
const SAMPLE_ITEMS = [
  {
    institution: "Stanford University",
    degree: "M.S. Computer Science — AI Specialization",
    years: "2022 — 2024",
    courses: ["Deep Learning", "NLP", "Computer Vision", "Distributed Systems"],
  },
  {
    institution: "MIT",
    degree: "B.S. Electrical Engineering & CS",
    years: "2018 — 2022",
    courses: ["Algorithms", "Signals & Systems", "Operating Systems", "Robotics"],
  },
  {
    institution: "Coursera / DeepLearning.AI",
    degree: "Deep Learning Specialization",
    years: "2021",
    courses: ["Neural Networks", "CNNs", "Sequence Models"],
  },
  {
    institution: "Phillips Exeter Academy",
    degree: "High School Diploma — STEM Honors",
    years: "2014 — 2018",
    courses: ["Multivariable Calculus", "Physics C", "Intro to CS"],
  },
]

export default function App() {
  const rowRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [fill, setFill] = useState({ top: 0, height: 0 })

  useEffect(() => {
    const DOT_CENTER = 29 // dot center: top(22) + half height(7)
    const DOT_RADIUS = 7 // half of 14px dot — used to start the fill AFTER the circle

    // Target values computed from scroll position, and the smoothed values
    // actually rendered. A rAF loop eases rendered -> target every frame so
    // motion stays smooth in both directions (no transition catch-up jump).
    let target = { top: 0, height: 0, opacity: 0 }
    const current = { top: 0, height: 0, opacity: 0 }
    let raf = null
    let started = false

    const compute = () => {
      const timeline = document.querySelector(".et-timeline")
      const rows = rowRefs.current.filter(Boolean)
      if (!timeline || rows.length === 0) return

      const tlTop = timeline.getBoundingClientRect().top
      const center = window.innerHeight / 2
      const dotsRel = rows.map((r) => r.offsetTop + DOT_CENTER)
      const dotsView = rows.map((r) => r.getBoundingClientRect().top + DOT_CENTER)

      // The light is one continuous segment: it starts just after the first
      // dot and grows downward to wherever the viewport center currently sits.
      // Scrolled-past cards stay lit because we never shrink the start point.
      const startY = dotsRel[0] + DOT_RADIUS
      const lastY = dotsRel[dotsRel.length - 1] + DOT_RADIUS
      const scrollY = center - tlTop // viewport center in timeline-relative coords
      const fillBottom = Math.max(startY, Math.min(scrollY, lastY))
      const height = fillBottom - startY

      // Active card = the last dot the viewport center has passed.
      let active = 0
      for (let i = 0; i < dotsView.length; i++) {
        if (center >= dotsView[i]) active = i
      }
      setActiveIndex(active)

      target = {
        top: startY,
        height: Math.max(0, height),
        opacity: height > 1 ? 1 : 0,
      }
    }

    // Per-frame easing toward the target (frame-rate independent-ish lerp).
    const tick = () => {
      const ease = 0.18
      current.top += (target.top - current.top) * ease
      current.height += (target.height - current.height) * ease
      current.opacity += (target.opacity - current.opacity) * ease
      setFill({
        top: current.top,
        height: Math.max(0, current.height),
        opacity: current.opacity,
      })
      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      compute()
      if (!started) {
        started = true
        // snap initial position so the light doesn't slide in from 0
        current.top = target.top
        raf = requestAnimationFrame(tick)
      }
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="et-root">
      <GlobalStyles />
      <header style={{ textAlign: "center", marginBottom: 56 }}>
        <p
          className="et-mono"
          style={{ color: C.secondary, fontSize: "0.8rem", margin: "0 0 8px" }}
        >
          {"// section.education"}
        </p>
        <h1 className="et-display" style={{ fontSize: "2.4rem", margin: 0 }}>
          Education Timeline
        </h1>
        <p style={{ color: C.textSecondary, marginTop: 8 }}>
          Scroll to explore — the line lights up as you travel between cards.
        </p>
      </header>

      <EducationTimeline
        items={SAMPLE_ITEMS}
        activeIndex={activeIndex}
        fill={fill}
        rowRefs={rowRefs}
      />
    </div>
  )
}
