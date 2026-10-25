import { useCallback, useEffect, useId, useRef } from 'react'
import { useMotion } from '../../context/motion'
import { PERSONAL } from '../../data/portfolioData'
import LoadingProfileFrame from './LoadingProfileFrame'
import LoadingNameTrace from './LoadingNameTrace'
import './brand-intro.css'
import {
  INTRO_SESSION_KEY,
  INTRO_DURATION,
  INTRO_EXIT_DURATION,
  INTRO_TRANSFER_DURATION,
} from '../../../shared/intro'

const releaseStartup = () => {
  delete document.documentElement.dataset.introPending
  delete document.documentElement.dataset.appPending
}

export default function BrandIntro({ requestId = 0 }) {
  const dialog = useRef(null),
    processed = useRef(-1),
    closeTimer = useRef(null),
    transferCleanup = useRef(() => {})
  const titleId = useId()
  const { animate, reduced, lowPower } = useMotion()
  const closeIntro = useCallback((transfer = false) => {
    const node = dialog.current
    if (!node?.open || node.dataset.closing) return
    node.dataset.closing = 'true'
    const finish = () => {
      clearTimeout(closeTimer.current)
      transferCleanup.current()
      node.close()
      delete node.dataset.closing
      delete node.dataset.transferring
    }
    const destination = document.querySelector('.home-artwork [data-home-portrait]')
    const portrait = node.querySelector('.lpf-root')
    const target = destination?.getBoundingClientRect()
    // Match main's desktop handoff; narrow screens and Skip retain a short fade.
    if (
      transfer &&
      innerWidth > 1024 &&
      target?.width &&
      target.top >= 0 &&
      target.bottom <= innerHeight
    ) {
      document.body.classList.add('intro-transfer')
      const from = portrait.getBoundingClientRect()
      const to = destination.getBoundingClientRect()
      node.dataset.transferring = 'true'
      portrait.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;margin:0;transform-origin:0 0;`
      const movement = portrait.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1, easing: 'cubic-bezier(.65,0,.35,1)' },
          {
            transform: `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width})`,
            opacity: 1,
            offset: 0.78,
          },
          {
            transform: `translate(${to.left - from.left}px,${to.top - from.top}px) scale(${to.width / from.width})`,
            opacity: 0,
          },
        ],
        { duration: INTRO_TRANSFER_DURATION, fill: 'both' },
      )
      const arrival = destination.animate(
        [{ opacity: 0 }, { opacity: 0, offset: 0.78 }, { opacity: 1 }],
        { duration: INTRO_TRANSFER_DURATION, fill: 'both' },
      )
      transferCleanup.current = () => {
        movement.cancel()
        arrival.cancel()
        portrait.removeAttribute('style')
        document.body.classList.remove('intro-transfer')
        window.removeEventListener('resize', finish)
        transferCleanup.current = () => {}
      }
      window.addEventListener('resize', finish, { once: true })
      closeTimer.current = setTimeout(finish, INTRO_TRANSFER_DURATION)
      return
    }
    closeTimer.current = setTimeout(finish, INTRO_EXIT_DURATION)
  }, [])
  useEffect(() => {
    if (reduced || (!requestId && lowPower)) {
      releaseStartup()
      return
    }
    if (!animate || processed.current === requestId) return
    const node = dialog.current
    let timer
    // Defer side effects so StrictMode's setup/cleanup replay cannot consume the intro.
    const frame = requestAnimationFrame(() => {
      processed.current = requestId
      if (!requestId) {
        if (location.hash && location.hash !== '#home') {
          releaseStartup()
          return
        }
        try {
          if (sessionStorage.getItem(INTRO_SESSION_KEY)) {
            releaseStartup()
            return
          }
          sessionStorage.setItem(INTRO_SESSION_KEY, 'seen')
        } catch {
          /* The introduction still works when browser storage is unavailable. */
        }
      }
      node.showModal()
      releaseStartup()
      document.body.classList.add('intro-open')
      // This is a brief branded introduction, not simulated download progress.
      timer = setTimeout(() => closeIntro(true), INTRO_DURATION)
    })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      clearTimeout(closeTimer.current)
      transferCleanup.current()
      node.close()
      delete node.dataset.closing
      delete node.dataset.transferring
      document.body.classList.remove('intro-open')
    }
  }, [animate, reduced, lowPower, requestId, closeIntro])
  return (
    <dialog
      ref={dialog}
      className="brand-intro"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        closeIntro()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          dialog.current.querySelector('button').focus()
        }
      }}
      onClose={() => document.body.classList.remove('intro-open')}
    >
      <h2 id={titleId} className="sr-only">
        Welcome to {PERSONAL.name}'s portfolio
      </h2>
      <div className="brand-intro-art" aria-hidden="true">
        <LoadingProfileFrame imageSrc={PERSONAL.profileImage} />
        <div className="brand-intro-name">
          <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={INTRO_DURATION - 500} />
        </div>
      </div>
      <p>{PERSONAL.title}</p>
      <button type="button" className="secondary-button" onClick={() => closeIntro()}>
        Skip introduction
      </button>
    </dialog>
  )
}
