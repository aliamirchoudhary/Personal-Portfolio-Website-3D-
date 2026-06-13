import { useEffect, useLayoutEffect, useRef, useState } from "react"

/* =====================================================================
   NavJumper  —  single-file, drop-in React component
   ---------------------------------------------------------------------
   GLOBAL STYLE TOKENS (per spec)
     bg #0a0a0f · surface #12121a · primary #7c3aed · secondary #06b6d4
     glow #a78bfa · text-1 #f1f5f9 · text-2 #94a3b8 · danger #f43f5e
   Fonts: Space Grotesk (display) · Inter (body) · JetBrains Mono (code)
   ===================================================================== */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap');

.njx-root {
  --bg: #0a0a0f;
  --surface: #12121a;
  --primary: #7c3aed;
  --secondary: #06b6d4;
  --glow: #a78bfa;
  --text-1: #f1f5f9;
  --text-2: #94a3b8;
  --danger: #f43f5e;
  background: var(--bg);
  color: var(--text-1);
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
}

/* Idle floating bob (sine ease) */
@keyframes njx-bob {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-3px); }
  100% { transform: translateY(0); }
}

/* Landing squash: scaleX(1.2) scaleY(0.85) -> 1 over 80ms */
@keyframes njx-squash {
  0%   { transform: scaleX(1)   scaleY(1); }
  45%  { transform: scaleX(1.2) scaleY(0.85); }
  100% { transform: scaleX(1)   scaleY(1); }
}

/* Wrapper carries the JUMP arc (horizontal + vertical) with elastic easing */
.njx-jumper-wrap {
  position: absolute;
  left: 0;
  transition: transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
  pointer-events: none;
}

/* Inner element owns the idle bob so it never fights the jump transform */
.njx-jumper-bob {
  animation: njx-bob 2s ease-in-out infinite;
  will-change: transform;
}
.njx-jumper-bob.njx-jumping { animation: none; }

.njx-squashing { animation: njx-squash 80ms ease-out; }

/* The .py file badge */
.njx-badge {
  position: relative;
  width: 36px;
  height: 44px;
  background: var(--surface);
  border: 1px solid var(--primary);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  box-shadow:
    0 0 12px -2px var(--primary),
    0 0 24px -6px var(--glow),
    inset 0 0 8px -4px var(--glow);
}
.njx-badge-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: var(--glow);
  letter-spacing: -0.02em;
}

/* Folded corner (top-right) */
.njx-fold {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 11px;
  height: 11px;
  background: var(--bg);
  border-left: 1px solid var(--primary);
  border-bottom: 1px solid var(--primary);
  border-bottom-left-radius: 4px;
  border-top-right-radius: 6px;
}

/* Glassmorphic demo navbar */
.njx-nav {
  position: relative;
  display: inline-flex;
  gap: 8px;
  padding: 14px 20px 64px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 40px -12px rgba(124,58,237,0.35);
}
.njx-link {
  position: relative;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-size: 15px;
  color: var(--text-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: color 200ms ease;
}
.njx-link:hover  { color: var(--text-1); }
.njx-link.njx-active { color: var(--text-1); }
`

/* ---------------------------------------------------------------------
   NavJumper
   props:
     links    : [{ label, id }]
     activeId : string             -> changing this triggers the jump
     onSelect : (id) => void        (optional) fired on link click
   ------------------------------------------------------------------- */
function NavJumper({ links, activeId, onSelect }) {
  const navRef = useRef(null)
  const linkRefs = useRef({})
  const wrapRef = useRef(null)

  const [pos, setPos] = useState({ x: 0, ready: false })
  const [jumping, setJumping] = useState(false)
  const [squashing, setSquashing] = useState(false)
  const prevActive = useRef(activeId)
  const timers = useRef([])

  const BADGE_HALF = 18 // half of 36px width, for centering

  const measure = () => {
    const nav = navRef.current
    const el = linkRefs.current[activeId]
    if (!nav || !el) return
    const navBox = nav.getBoundingClientRect()
    const linkBox = el.getBoundingClientRect()
    const x = linkBox.left - navBox.left + linkBox.width / 2 - BADGE_HALF
    setPos({ x, ready: true })
  }

  // Keep the resting position in sync with layout / active link.
  useLayoutEffect(() => {
    measure()
    const onResize = () => measure()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, links])

  // THE JUMP — runs whenever activeId changes.
  useEffect(() => {
    if (prevActive.current === activeId) return
    prevActive.current = activeId

    timers.current.forEach(clearTimeout)
    timers.current = []

    const wrap = wrapRef.current
    if (!wrap) return

    setJumping(true)
    setSquashing(false)

    // Arc peak: launch up (-20px), scale up (1.15), tumble (-8deg).
    // Horizontal move to the new X happens via the same elastic transition.
    wrap.style.transform = "translate(var(--njx-x), -20px) scale(1.15) rotate(-8deg)"

    // Overshoot: drop PAST rest (+6px), straighten.
    timers.current.push(setTimeout(() => {
      wrap.style.transform = "translate(var(--njx-x), 6px) scale(1) rotate(0deg)"
    }, 230))

    // Land at rest + squash.
    timers.current.push(setTimeout(() => {
      wrap.style.transform = "translate(var(--njx-x), 0px) scale(1) rotate(0deg)"
      setSquashing(true)
    }, 370))

    timers.current.push(setTimeout(() => setSquashing(false), 450))
    timers.current.push(setTimeout(() => setJumping(false), 450))

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [activeId])

  return (
    <>
      <style>{STYLES}</style>
      <nav ref={navRef} className="njx-nav">
        {links.map((link) => (
          <button
            key={link.id}
            ref={(el) => (linkRefs.current[link.id] = el)}
            onClick={() => onSelect && onSelect(link.id)}
            className={`njx-link ${activeId === link.id ? "njx-active" : ""}`}
          >
            {link.label}
          </button>
        ))}

        <div
          ref={wrapRef}
          className="njx-jumper-wrap"
          style={{
            "--njx-x": `${pos.x}px`,
            transform: `translate(${pos.x}px, 0px)`,
            top: 48,
            opacity: pos.ready ? 1 : 0,
          }}
        >
          <div className={`njx-jumper-bob ${jumping ? "njx-jumping" : ""}`}>
            <div className={`njx-badge ${squashing ? "njx-squashing" : ""}`}>
              <span className="njx-fold" />
              <span className="njx-badge-label">.py</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

/* ---------------------------------------------------------------------
   DEMO — default export so you can render this file directly and test.
   Click a link to fire the jump.
   ------------------------------------------------------------------- */
export default function App() {
  const links = [
    { label: "home", id: "home" },
    { label: "work", id: "work" },
    { label: "about", id: "about" },
    { label: "blog", id: "blog" },
    { label: "contact", id: "contact" },
  ]
  const [active, setActive] = useState("home")

  return (
    <div className="njx-root">
      <style>{STYLES}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: 24,
        }}
      >
        <header style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: "#a78bfa",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            // nav_jumper.demo
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "-0.03em",
              margin: "8px 0 6px",
              color: "#f1f5f9",
            }}
          >
            Click a link to make it jump
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15, margin: 0 }}>
            The .py badge launches, tumbles, overshoots, and bounces to rest.
          </p>
        </header>

        <NavJumper links={links} activeId={active} onSelect={setActive} />
      </div>
    </div>
  )
}

export { NavJumper }
