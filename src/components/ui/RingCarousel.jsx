import { useEffect, useId, useRef, useState } from 'react'
import useMediaQuery from '../../hooks/useMediaQuery'
import './ring-carousel.css'

export function RingCarousel({ cards = [], initialCenter = 0 }) {
  const [center, setCenter] = useState(initialCenter)
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const compact = useMediaQuery('(max-width: 1024px)')
  const dialog = useRef(null),
    opener = useRef(null),
    drag = useRef(null)
  const titleId = useId()
  const step = (direction) => {
    if (cards.length) setCenter((value) => (value + direction + cards.length) % cards.length)
  }
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
      className="ring-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Project showcase"
      onKeyDown={(event) => {
        if (event.target.closest('dialog,input,textarea')) return
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          step(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
    >
      <div
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
