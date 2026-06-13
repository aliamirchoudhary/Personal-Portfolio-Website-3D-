import { useEffect, useRef } from "react"

const NODE_COUNT = 110
const EDGE_DISTANCE = 0.46 // threshold on unit sphere to connect nodes
const MAX_WAVES = 3 // concurrent propagating cascades
const MAX_HOPS = 6 // how many generations a cascade ripples outward

// Colors from the design system (as "r, g, b" so we can vary alpha)
const COLOR_NODE = "167, 139, 250" // #a78bfa lavender
const COLOR_EDGE = "124, 58, 237" // #7c3aed violet
const COLOR_SIGNAL = "6, 182, 212" // #06b6d4 cyan

export default function NeuralNetworkGlobe({ size = 320 }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Handle high-DPI displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size * 0.42 // globe radius in px
    const fov = 2.2 // perspective field-of-view factor

    // --- Generate nodes using a Fibonacci sphere for even distribution ---
    const nodes = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      nodes.push({
        x: Math.cos(theta) * r,
        y,
        z: Math.sin(theta) * r,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 1.5,
      })
    }

    // --- Precompute edges between nearby nodes + adjacency list ---
    const edges = []
    const neighbors = nodes.map(() => []) // neighbors[i] = [{ node, edge }]
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dz = nodes[i].z - nodes[j].z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < EDGE_DISTANCE) {
          const edgeIndex = edges.length
          edges.push({ a: i, b: j })
          neighbors[i].push({ node: j, edge: edgeIndex })
          neighbors[j].push({ node: i, edge: edgeIndex })
        }
      }
    }

    // --- Active signals: a cascade ("wave") starts at one node, fires to all
    // its neighbors, and when each signal arrives it re-fires to THAT node's
    // neighbors — rippling outward generation by generation (hop by hop). ---
    const signals = []
    let waveSeq = 0

    // Fire from a single node to all its neighbors that this wave hasn't
    // reached yet — rippling outward generation by generation (hop by hop).
    const fireFrom = (src, wave, hop) => {
      nodes[src].fireUntil = performance.now() + 350
      if (hop >= MAX_HOPS) return
      const visited = waveVisited.get(wave)
      const conns = neighbors[src]
      for (let k = 0; k < conns.length; k++) {
        const target = conns[k].node
        if (visited && visited.has(target)) continue // already lit by this wave
        if (visited) visited.add(target)
        signals.push({
          edge: conns[k].edge,
          from: src,
          to: target,
          progress: 0,
          speed: 0.9 + Math.random() * 0.5,
          wave,
          hop,
        })
      }
    }

    // Start a brand-new cascade from a random (or given) origin node.
    const fireWave = (source) => {
      const src = source != null ? source : Math.floor(Math.random() * NODE_COUNT)
      const wave = waveSeq++
      const visited = new Set([src])
      waveVisited.set(wave, visited)
      fireFrom(src, wave, 0)
    }

    const startTime = performance.now()
    let lastTime = startTime
    const rotationPeriod = 20000 // 20s per full Y rotation (auto-spin)

    // --- Rotation state (auto-spin + user drag with inertia) ---
    let rotY = 0 // accumulated Y rotation from drag
    let rotX = 0 // accumulated X rotation from drag (clamped)
    let velY = 0
    let velX = 0
    let dragging = false
    let lastPointerX = 0
    let lastPointerY = 0
    let burstTimer = 0

    const proj = new Array(NODE_COUNT).fill(null).map(() => ({
      sx: 0,
      sy: 0,
      scale: 1,
      depth: 0, // 0 = far, 1 = near
    }))

    // Tracks which nodes each active wave has already lit, so a cascade
    // expands outward without bouncing back and looping forever.
    const waveVisited = new Map() // wave id -> Set of node ids

    const render = (now) => {
      const elapsed = now - startTime
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      // auto-spin contribution + user drag + inertia
      const autoAngle = (elapsed / rotationPeriod) * Math.PI * 2
      if (!dragging) {
        rotY += velY
        rotX += velX
        velY *= 0.94 // friction
        velX *= 0.94
      }
      // clamp vertical tilt so the globe never flips fully
      rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX))

      const angleY = autoAngle + rotY
      const cosY = Math.cos(angleY)
      const sinY = Math.sin(angleY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      ctx.clearRect(0, 0, size, size)

      // --- Rotate around Y then X, and project ---
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i]
        // Y-axis rotation
        let rx = n.x * cosY - n.z * sinY
        let rz = n.x * sinY + n.z * cosY
        let ry = n.y
        // X-axis rotation (tilt)
        const ry2 = ry * cosX - rz * sinX
        const rz2 = ry * sinX + rz * cosX
        ry = ry2
        rz = rz2

        const persp = fov / (fov - rz)
        proj[i].sx = center + rx * radius * persp
        proj[i].sy = center + ry * radius * persp
        proj[i].scale = persp
        proj[i].depth = (rz + 1) / 2
      }

      // --- Draw edges (behind nodes) ---
      for (let e = 0; e < edges.length; e++) {
        const pa = proj[edges[e].a]
        const pb = proj[edges[e].b]
        const depth = (pa.depth + pb.depth) / 2
        const opacity = 0.1 + depth * 0.3
        ctx.strokeStyle = `rgba(${COLOR_EDGE}, ${opacity.toFixed(3)})`
        ctx.lineWidth = 0.5 + depth * 0.7
        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy)
        ctx.lineTo(pb.sx, pb.sy)
        ctx.stroke()
      }

      // --- Update + draw signals (cyan pulses traveling along edges) ---
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s]
        sig.progress += sig.speed * dt
        if (sig.progress >= 1) {
          // signal reached its target -> re-fire from there to the next ring
          fireFrom(sig.to, sig.wave, sig.hop + 1)
          signals.splice(s, 1)
          continue
        }
        // orient from `from` -> `to` (proj is symmetric, so pick by node id)
        const pFrom = proj[sig.from]
        const pTo = proj[sig.to]
        const t = sig.progress

        const depth = (pFrom.depth + pTo.depth) / 2
        const lineAlpha = (0.5 + depth * 0.5) * Math.sin(t * Math.PI)
        ctx.strokeStyle = `rgba(${COLOR_SIGNAL}, ${lineAlpha.toFixed(3)})`
        ctx.lineWidth = 1.2 + depth * 1.2
        ctx.beginPath()
        ctx.moveTo(pFrom.sx, pFrom.sy)
        ctx.lineTo(pTo.sx, pTo.sy)
        ctx.stroke()

        const dx = pFrom.sx + (pTo.sx - pFrom.sx) * t
        const dy = pFrom.sy + (pTo.sy - pFrom.sy) * t
        const dotR = (1.5 + depth * 2) * (0.6 + 0.4 * Math.sin(t * Math.PI))
        ctx.save()
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgba(${COLOR_SIGNAL}, 0.9)`
        ctx.fillStyle = `rgba(${COLOR_SIGNAL}, ${(0.8 + depth * 0.2).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(dx, dy, dotR, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // periodically start a new cascade from a random node
      burstTimer -= dt
      // count how many distinct waves still have signals in flight
      const liveWaves = new Set()
      for (let s = 0; s < signals.length; s++) liveWaves.add(signals[s].wave)
      // drop visited-sets for waves that have fully died out
      for (const w of waveVisited.keys()) {
        if (!liveWaves.has(w)) waveVisited.delete(w)
      }
      if (burstTimer <= 0 && liveWaves.size < MAX_WAVES) {
        fireWave()
        burstTimer = 1.2 + Math.random() * 1.5
      }

      // --- Draw nodes (sorted far -> near for correct overlap) ---
      const order = [...Array(NODE_COUNT).keys()].sort(
        (i, j) => proj[i].depth - proj[j].depth,
      )

      for (const i of order) {
        const n = nodes[i]
        const p = proj[i]

        const pulse = 0.5 + 0.5 * Math.sin((elapsed / 1000) * n.pulseSpeed + n.pulsePhase)
        let fired = pulse > 0.85 ? (pulse - 0.85) / 0.15 : 0
        // extra flash when this node fired a burst
        if (n.fireUntil && now < n.fireUntil) fired = 1

        const baseR = 2.5 + p.depth * 2
        const r = baseR + fired * 1.8
        const baseAlpha = 0.35 + p.depth * 0.55
        const alpha = Math.min(1, baseAlpha + fired * 0.4)

        ctx.save()
        ctx.shadowBlur = 6 + p.depth * 8 + fired * 10
        ctx.shadowColor = `rgba(${COLOR_NODE}, ${(0.6 + fired * 0.4).toFixed(3)})`
        ctx.fillStyle = `rgba(${COLOR_NODE}, ${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    // --- Pointer drag handlers ---
    const onPointerDown = (e) => {
      dragging = true
      velY = 0
      velX = 0
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      canvas.setPointerCapture?.(e.pointerId)
    }
    const onPointerMove = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastPointerX
      const dy = e.clientY - lastPointerY
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      const k = 0.01 // sensitivity
      rotY += dx * k
      rotX += dy * k
      velY = dx * k // carry momentum for inertia on release
      velX = dy * k
    }
    const onPointerUp = (e) => {
      dragging = false
      canvas.releasePointerCapture?.(e.pointerId)
    }

    canvas.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)

    // seed an initial cascade
    fireWave()

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [size])

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", cursor: "grab", touchAction: "none" }}
      />
    </div>
  )
}
