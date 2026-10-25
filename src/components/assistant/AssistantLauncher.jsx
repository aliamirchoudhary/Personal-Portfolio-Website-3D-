import { lazy, Suspense, useRef, useState } from 'react'
import AssistantBoundary from './AssistantBoundary'
const Panel = lazy(() => import('./AssistantPanel'))
function AgentIcon() {
  return (
    <svg viewBox="0 0 24 24" width="25" height="25" fill="none" aria-hidden="true">
      <path d="M8 4h8l5 5v7l-4 4H7l-4-4V9l5-5Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 10h.01M15 10h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 15h8M12 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
export default function AssistantLauncher({ onNavigate }) {
  const [open, setOpen] = useState(false),
    [loaded, setLoaded] = useState(false)
  const launcher = useRef(null)
  const close = () => {
    setOpen(false)
    launcher.current?.focus({ preventScroll: true })
  }
  return (
    <>
      <button
        ref={launcher}
        className="assistant-launcher"
        aria-label="Ask about Ali"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setLoaded(true)
          setOpen(true)
        }}
      >
        <AgentIcon />
        <span className="assistant-launcher-label">Ask about Ali</span>
      </button>
      {loaded && (
        <AssistantBoundary
          onClose={() => {
            setOpen(false)
            setLoaded(false)
            launcher.current?.focus()
          }}
        >
          <Suspense
            fallback={
              open ? (
                <div className="assistant-loading" role="status">
                  Opening assistant… <button onClick={close}>Cancel</button>
                </div>
              ) : null
            }
          >
            <Panel open={open} onClose={close} onNavigate={onNavigate} />
          </Suspense>
        </AssistantBoundary>
      )}
    </>
  )
}
