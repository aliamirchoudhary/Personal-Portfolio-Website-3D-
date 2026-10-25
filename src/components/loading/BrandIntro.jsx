import { useCallback, useEffect, useId, useRef } from 'react'
import { useMotion } from '../../context/motion'
import { PERSONAL } from '../../data/portfolioData'
import LoadingProfileFrame from './LoadingProfileFrame'
import LoadingNameTrace from './LoadingNameTrace'
import './brand-intro.css'
import { INTRO_SESSION_KEY, INTRO_DURATION, INTRO_EXIT_DURATION } from '../../../shared/intro'

const releaseStartup = () => {
  delete document.documentElement.dataset.introPending
  delete document.documentElement.dataset.appPending
}

export default function BrandIntro({ requestId = 0 }) {
  const dialog = useRef(null),
    processed = useRef(-1),
    closeTimer = useRef(null)
  const titleId = useId()
  const { animate, reduced, lowPower } = useMotion()
  const closeIntro = useCallback(() => {
    const node = dialog.current
    if (!node?.open || node.dataset.closing) return
    node.dataset.closing = 'true'
    closeTimer.current = setTimeout(() => {
      node.close()
      delete node.dataset.closing
    }, INTRO_EXIT_DURATION)
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
      timer = setTimeout(closeIntro, INTRO_DURATION)
    })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
      clearTimeout(closeTimer.current)
      node.close()
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
          <LoadingNameTrace name={PERSONAL.name.toUpperCase()} duration={1800} />
        </div>
      </div>
      <p>{PERSONAL.title}</p>
      <button type="button" className="secondary-button" onClick={closeIntro}>
        Skip introduction
      </button>
    </dialog>
  )
}
