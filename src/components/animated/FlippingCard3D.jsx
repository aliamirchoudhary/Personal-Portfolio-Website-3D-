import React, { useEffect, useRef, useState } from "react"

/**
 * SpinningSkillBox
 * A rectangular 3D box shown from a front-top 3/4 angle so THREE sides are
 * visible at once: the FRONT face, the TOP face, and a SIDE (end-cap) face.
 *
 * Behaviour:
 *  - The box rotates around its X-axis. Every 90deg, the text on the front face
 *    travels up onto the top face, while a brand-new label rotates up from the
 *    bottom onto the front face. The sequence never repeats visibly.
 *  - The two end-caps (the "sides") carry a fixed "CS" badge that visibly spins
 *    as the whole box rotates.
 *  - Hold + drag VERTICALLY to spin it yourself. Releasing snaps to the nearest
 *    face and auto-rotation resumes.
 *
 * Pure CSS 3D transforms — no dependencies. Paste & run.
 *
 * Props:
 *   skills: string[]  // any length; labels cycle through this list forever
 *   sideLabel: string // text shown on the spinning end-caps (default "CS")
 */
export function SpinningSkillBox({
  skills = [
    "Data Science",
    "ML / AI",
    "Full Stack",
    "Cloud / DevOps",
    "Algorithms",
    "Systems",
  ],
  sideLabel = "CS",
}) {
  // Box geometry. Cross-section is square (H === D) so all 4 ring faces match.
  const W = 260 // width  (x)
  const H = 150 // height (the visible front face height)
  const D = 150 // depth  (must equal H for a clean square rotation)

  const faceColors = ["#f1f5f9", "#a78bfa", "#06b6d4", "#f43f5e"]

  // 4 physical ring faces (front/top/back/bottom). We keep their labels in
  // state and silently re-label whichever face is hidden at the back, so the
  // skill list can be infinitely long while front->top continuity is preserved.
  const [labels, setLabels] = useState(() =>
    [0, 1, 2, 3].map((i) => skills[i % skills.length])
  )

  // rotation is in degrees and decreases over time (front face tilts up to top).
  const [rotation, setRotation] = useState(0)
  const [dragging, setDragging] = useState(false)

  const rotationRef = useRef(0)
  const lastStepRef = useRef(0)
  const nextPtrRef = useRef(4) // next skill index to feed onto a hidden face
  const dragRef = useRef({ startY: 0, startRot: 0 })

  rotationRef.current = rotation

  // Auto-rotate one quarter-turn at a time while not being dragged.
  useEffect(() => {
    if (dragging) return
    const id = setInterval(() => setRotation((r) => r - 90), 1200)
    return () => clearInterval(id)
  }, [dragging])

  // When the rounded step advances, relabel the face that is now hidden at the
  // back so it is ready with the next skill before it rotates into view.
  useEffect(() => {
    const step = Math.round(-rotation / 90)
    if (step <= lastStepRef.current) {
      lastStepRef.current = step
      return
    }
    for (let s = lastStepRef.current + 1; s <= step; s++) {
      const backFace = ((s + 2) % 4 + 4) % 4
      const nextSkill = skills[nextPtrRef.current % skills.length]
      nextPtrRef.current += 1
      setLabels((prev) => {
        const copy = prev.slice()
        copy[backFace] = nextSkill
        return copy
      })
    }
    lastStepRef.current = step
  }, [rotation, skills])

  // ---- Drag to spin (vertical) ----
  const onPointerDown = (e) => {
    setDragging(true)
    dragRef.current = { startY: e.clientY, startRot: rotationRef.current }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    const dy = e.clientY - dragRef.current.startY
    // drag up => rotation decreases => box flips forward (same way as auto)
    setRotation(dragRef.current.startRot - dy * 0.8)
  }
  const endDrag = () => {
    if (!dragging) return
    setRotation((r) => Math.round(r / 90) * 90) // snap to nearest face
    setDragging(false)
  }

  const ringFace = (i) => ({
    transform: `rotateX(${i * 90}deg) translateZ(${D / 2}px)`,
    width: W,
    height: H,
    color: faceColors[i],
  })

  return (
    <div className="ssb-scene">
      <style>{CSS}</style>

      <div className="ssb-float">
        <div
          className={`ssb-tilt${dragging ? " ssb-grabbing" : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          style={{ width: W, height: H }}
        >
          <div
            className="ssb-box"
            style={{
              width: W,
              height: H,
              transform: `rotateX(${rotation}deg)`,
              transition: dragging
                ? "none"
                : "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            {/* 4 ring faces: front / top / back / bottom */}
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="ssb-face" style={ringFace(i)}>
                <span className="ssb-label">{labels[i]}</span>
              </div>
            ))}

            {/* End-caps (the visible side). These carry the spinning "CS". */}
            <div
              className="ssb-cap ssb-cap--right"
              style={{
                width: D,
                height: H,
                transform: `rotateY(90deg) translateZ(${W / 2}px)`,
              }}
            >
              <span className="ssb-cap-label">{sideLabel}</span>
            </div>
            <div
              className="ssb-cap ssb-cap--left"
              style={{
                width: D,
                height: H,
                transform: `rotateY(-90deg) translateZ(${W / 2}px)`,
              }}
            >
              <span className="ssb-cap-label">{sideLabel}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@600;700&display=swap');

.ssb-scene {
  perspective: 1100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

/* Gentle idle bob */
.ssb-float { animation: ssb-float 3s ease-in-out infinite; }
@keyframes ssb-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

/* Fixed 3/4 view: tilt down + rotate so front, top and right side all show. */
.ssb-tilt {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-20deg) rotateY(-30deg);
  cursor: grab;
  touch-action: none;
}
.ssb-grabbing { cursor: grabbing; }

.ssb-box {
  position: relative;
  transform-style: preserve-3d;
  will-change: transform;
}

/* Glassmorphic faces */
.ssb-face {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -75px;   /* -H/2 */
  margin-left: -130px; /* -W/2 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(18, 18, 26, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 0 26px rgba(124, 58, 237, 0.45), inset 0 0 18px rgba(167, 139, 250, 0.10);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.ssb-label {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-weight: 700;
  font-size: 26px;
  letter-spacing: -0.02em;
  text-align: center;
  padding: 0 18px;
  text-shadow: 0 0 16px rgba(167, 139, 250, 0.55);
}

/* The spinning end-caps / sides */
.ssb-cap {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -75px;   /* -H/2 */
  margin-left: -75px;  /* -D/2 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background:
    linear-gradient(135deg, rgba(124, 58, 237, 0.28), rgba(6, 182, 212, 0.18)),
    rgba(14, 14, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: inset 0 0 22px rgba(167, 139, 250, 0.18);
}

.ssb-cap-label {
  font-family: "JetBrains Mono", monospace;
  font-weight: 700;
  font-size: 40px;
  letter-spacing: 0.04em;
  color: #06b6d4;
  text-shadow: 0 0 18px rgba(6, 182, 212, 0.7);
}

.ssb-hint {
  margin: 0;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #94a3b8;
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .ssb-float, .ssb-box { animation: none; transition: none; }
}
`

/**
 * Default export: a runnable demo on the deep-space background so you can paste
 * this single file and see it immediately. Import { SpinningSkillBox } to use
 * it inside your own layout with custom skills.
 */
export default function SpinningSkillBoxDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <SpinningSkillBox
        skills={[
          "Data Science",
          "ML / AI",
          "Full Stack",
          "Cloud / DevOps",
          "Algorithms",
          "Distributed Systems",
        ]}
        sideLabel="CS"
      />
    </div>
  )
}
