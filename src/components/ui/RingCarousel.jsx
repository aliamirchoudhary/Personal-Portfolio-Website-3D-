import { useCallback, useEffect, useId, useRef, useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import './ring-carousel.css'

export function RingCarousel({ cards = [], initialCenter = 0 }) {
  const [center, setCenter] = useState(initialCenter)
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const compact = useMediaQuery('(max-width: 1024px)')
  const root = useRef(null),
    stage = useRef(null),
    centerRef = useRef(center)
  const hintId = useId()
  const dialog = useRef(null),
    opener = useRef(null),
    drag = useRef(null)
  const titleId = useId()
  const step = useCallback(
    (direction) => {
      if (cards.length) setCenter((value) => (value + direction + cards.length) % cards.length)
    },
    [cards.length],
  )
  useEffect(() => {
    centerRef.current = center
  }, [center])
  useEffect(() => {
    const node = stage.current
    const gesture = { total: 0, last: 0, direction: 0, locked: false }
    const wheel = (event) => {
      if (active || event.ctrlKey || cards.length < 2 || !event.target.closest('.project-card'))
        return
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (!delta) return
      const now = performance.now(),
        direction = Math.sign(delta)
      if (now - gesture.last > 180 || direction !== gesture.direction) {
        gesture.total = 0
        gesture.locked = false
      }
      gesture.last = now
      gesture.direction = direction
      // Consume inertia from this gesture, then let a fresh gesture leave either end.
      if (gesture.locked) {
        event.preventDefault()
        return
      }
      if (
        (direction < 0 && centerRef.current === 0) ||
        (direction > 0 && centerRef.current === cards.length - 1)
      )
        return
      event.preventDefault()
      gesture.total +=
        delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1)
      if (Math.abs(gesture.total) >= 32) {
        root.current.focus({ preventScroll: true })
        step(direction)
        gesture.locked = true
      }
    }
    node.addEventListener('wheel', wheel, { passive: false })
    return () => node.removeEventListener('wheel', wheel)
  }, [active, cards.length, step])
  useEffect(() => {
    const key = (event) => {
      if (
        active ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.target.closest('input,textarea,select,[contenteditable=true],dialog')
      )
        return
      const focused = document.activeElement,
        section = root.current.closest('section')
      const inCarousel = root.current.contains(focused)
      const onSectionHeading = focused?.matches('h2') && section?.contains(focused)
      if (!inCarousel && !onSectionHeading) return
      const bounds = root.current.getBoundingClientRect()
      if (bounds.bottom <= 0 || bounds.top >= innerHeight) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        root.current.focus({ preventScroll: true })
        step(event.key === 'ArrowLeft' ? -1 : 1)
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        root.current.focus({ preventScroll: true })
        setCenter(event.key === 'Home' ? 0 : Math.max(0, cards.length - 1))
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [active, cards.length, step])
  const offset = (index) => {
    let difference = index - center
    if (difference > cards.length / 2) difference -= cards.length
    if (difference < -cards.length / 2) difference += cards.length
    return difference
  }
  const open = (card, element) => {
    if (drag.current?.moved) return
    opener.current = element
    setActive(card)
  }
  useEffect(() => {
    if (!active || !dialog.current) return
    const node = dialog.current,
      body = document.body
    node.showModal()
    body.classList.add('dialog-open')
    node.querySelector('button')?.focus()
    return () => {
      if (node.open) node.close()
      body.classList.remove('dialog-open')
      opener.current?.focus({ preventScroll: true })
    }
  }, [active])
  const pointerDown = (event) => {
    if (event.target.closest('button,a')) return
    root.current.focus({ preventScroll: true })
    drag.current = { x: event.clientX, moved: false, pointer: event.pointerId }
  }
  const pointerMove = (event) => {
    if (!drag.current || drag.current.ended) return
    const dx = event.clientX - drag.current.x
    if (Math.abs(dx) > 65) {
      step(dx < 0 ? 1 : -1)
      drag.current.moved = true
      drag.current.x = event.clientX
    }
  }
  const pointerUp = () => {
    if (drag.current) drag.current.ended = true
  }
  return (
    <div
      ref={root}
      tabIndex={0}
      className="ring-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Project showcase"
      aria-describedby={hintId}
    >
      <div
        ref={stage}
        className="ring-carousel-stage"
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={() => {
          drag.current = null
        }}
        onPointerLeave={() => {
          drag.current = null
        }}
      >
        {cards.map((card, index) => {
          const distance = offset(index),
            hidden = compact ? distance !== 0 : Math.abs(distance) > 1
          const transform = compact
            ? 'none'
            : `translateX(${distance * 205}px) translateZ(${distance === 0 ? 65 : -65}px) rotateY(${-distance * 16}deg) scale(${distance === 0 ? 1 : 0.82})`
          return (
            <article
              className={`project-card${distance === 0 ? ' is-current' : ''}`}
              key={card.id}
              aria-hidden={hidden}
              inert={hidden}
              style={{
                transform,
                opacity: hidden ? 0 : distance === 0 ? 1 : 0.6,
                zIndex: distance === 0 ? 3 : 1,
                pointerEvents: hidden ? 'none' : 'auto',
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="project-symbol" aria-hidden="true">
                {['◈', '✦', '◎', '▣', '◆', '☀', '◌'][index % 7]}
              </div>
              {card.preview && (
                <img
                  className="project-preview"
                  src={card.preview}
                  alt=""
                  loading="lazy"
                  width="640"
                  height="360"
                />
              )}
              <h3>{card.title}</h3>
              <p>{card.shortDesc}</p>
              <ul className="project-tags" aria-label="Technologies">
                {card.tags?.slice(0, 4).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <button
                type="button"
                className="project-details"
                onPointerDown={() => {
                  drag.current = null
                }}
                onClick={(event) => open(card, event.currentTarget)}
                aria-label={`View details for ${card.title}`}
                style={{ boxShadow: hovered === index ? '0 0 20px #7c3aed22' : undefined }}
              >
                View details <span aria-hidden="true">↗</span>
              </button>
            </article>
          )
        })}
      </div>
      <p id={hintId} className="carousel-hint">
        Scroll over a card, drag, or use ← → to browse. Scroll outside the cards to continue.
      </p>
      <div className="carousel-controls">
        <button type="button" aria-label="Previous project" onClick={() => step(-1)}>
          ←
        </button>
        <p aria-live="polite" aria-atomic="true">
          {center + 1} / {cards.length}
          <span className="sr-only"> — {cards[center]?.title}</span>
        </p>
        <button type="button" aria-label="Next project" onClick={() => step(1)}>
          →
        </button>
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby={titleId}
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = [
            ...event.currentTarget.querySelectorAll('button:not([disabled]),a[href]'),
          ]
          const first = controls[0],
            last = controls.at(-1)
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const box = dialog.current.getBoundingClientRect()
            if (
              event.clientX < box.left ||
              event.clientX > box.right ||
              event.clientY < box.top ||
              event.clientY > box.bottom
            )
              setActive(null)
          }
        }}
      >
        {active && (
          <div className="project-dialog-panel">
            <button
              type="button"
              className="dialog-close"
              aria-label="Close project details"
              onClick={() => setActive(null)}
            >
              ×
            </button>
            <h2 id={titleId}>{active.title}</h2>
            <div className="project-description">
              {active.details?.length ? (
                active.details.map((block, index) =>
                  block.type === 'list' ? (
                    <ul key={index}>
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : block.type === 'heading' ? (
                    <h3 key={index}>{block.text}</h3>
                  ) : (
                    <p key={index}>{block.text}</p>
                  ),
                )
              ) : (
                <p>{active.shortDesc}</p>
              )}
            </div>
            <div className="project-links">
              {active.links?.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
