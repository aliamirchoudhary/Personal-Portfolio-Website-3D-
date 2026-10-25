import { useEffect, useRef, useState } from 'react'
import knowledge from '../../../.assistant-temp/knowledge.json'
import {
  answerLocal,
  ASSISTANT_LIMITS,
  SUGGESTIONS,
  resolveAction,
} from '../../../shared/assistant'
import './assistant.css'

export default function AssistantPanel({ open, onClose, onNavigate }) {
  const dialog = useRef(null),
    input = useRef(null),
    history = useRef(null),
    controller = useRef(null),
    nearBottom = useRef(true),
    sequence = useRef({ value: 0 }),
    selectedProject = useRef(null)
  const [messages, setMessages] = useState([]),
    [draft, setDraft] = useState(''),
    [pending, setPending] = useState(false),
    [allowAI, setAllowAI] = useState(false),
    [announcement, setAnnouncement] = useState('')
  const stop = () => {
    sequence.current.value++
    controller.current?.abort()
    controller.current = null
    setPending(false)
  }
  useEffect(() => {
    const node = dialog.current
    const generation = sequence.current
    if (open) {
      node.showModal()
      document.body.classList.add('assistant-open')
      input.current?.focus()
    } else if (node.open) node.close()
    return () => {
      generation.value++
      controller.current?.abort()
      node.close()
      document.body.classList.remove('assistant-open')
    }
  }, [open])
  useEffect(() => {
    if (!messages.length && history.current) history.current.scrollTop = 0
    else if (nearBottom.current && history.current)
      history.current.scrollTop = history.current.scrollHeight
  }, [messages, pending])
  function close() {
    dialog.current?.close()
    stop()
    onClose()
  }
  function clear() {
    stop()
    setMessages([])
    setDraft('')
    selectedProject.current = null
    setAnnouncement('Conversation cleared.')
    input.current?.focus()
  }
  async function submit(value = draft) {
    const message = value.trim()
    if (!message || message.length > ASSISTANT_LIMITS.message || pending) return
    setDraft('')
    nearBottom.current = true
    const local = answerLocal(message, knowledge, selectedProject.current)
    const previous = selectedProject.current
    selectedProject.current = local.projectId
    const turn = ++sequence.current.value
    setMessages((items) => [...items.slice(-38), { role: 'user', answer: message }])
    let response = local
    if (allowAI && local.status === 'answered' && local.projectId) {
      setPending(true)
      controller.current = new AbortController()
      const timeout = setTimeout(() => controller.current?.abort(), 18000)
      try {
        const result = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, projectId: previous, enhance: true, adult: true }),
          signal: controller.current.signal,
        })
        if (result.ok) {
          const data = await result.json()
          if (
            typeof data.answer === 'string' &&
            data.answer.length <= ASSISTANT_LIMITS.output &&
            ['local', 'generated'].includes(data.mode) &&
            Array.isArray(data.sourceIds)
          )
            response = data
        } else
          response = {
            ...local,
            notice: 'AI assistance is unavailable. Showing the documented answer.',
          }
      } catch {
        response = {
          ...local,
          notice: 'AI assistance is unavailable. Showing the documented answer.',
        }
      } finally {
        clearTimeout(timeout)
      }
    }
    if (sequence.current.value !== turn) return
    setPending(false)
    controller.current = null
    setMessages((items) => [...items, { ...response, role: 'assistant' }])
    setAnnouncement(
      response.status === 'off_topic'
        ? 'This question is outside the portfolio.'
        : 'A new answer is ready.',
    )
  }
  function navigate(event, href) {
    if (!href?.startsWith('#') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    dialog.current?.close()
    stop()
    onClose()
    requestAnimationFrame(() => onNavigate(href.slice(1)))
  }
  return (
    <dialog
      ref={dialog}
      className="assistant-panel"
      aria-labelledby="assistant-title"
      aria-describedby="assistant-subtitle"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClose={() => {
        // StrictMode can queue a cleanup close event before reopening the dialog.
        if (dialog.current?.open) return
        document.body.classList.remove('assistant-open')
        if (open) close()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const controls = [
          ...dialog.current.querySelectorAll(
            'button:not([disabled]),a[href],input,textarea,summary',
          ),
        ].filter((el) => el.getClientRects().length)
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
    >
      <header className="assistant-header">
        <div>
          <p className="assistant-eyebrow">PORTFOLIO ASSISTANT</p>
          <h2 id="assistant-title">Ask about Ali</h2>
          <p id="assistant-subtitle">Projects, experience, and the thinking behind them.</p>
        </div>
        <button
          type="button"
          className="assistant-icon-button"
          aria-label="Close assistant"
          onClick={close}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </header>
      <div className="assistant-toolbar">
        <span>
          <span className="assistant-dot" /> Portfolio knowledge
        </span>
        <button onClick={clear} type="button">
          Clear conversation
        </button>
      </div>
      <div
        className="assistant-messages"
        ref={history}
        tabIndex={0}
        aria-label="Conversation"
        onScroll={() => {
          const el = history.current
          nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 90
        }}
      >
        {!messages.length && (
          <div className="assistant-welcome">
            <div className="assistant-welcome-mark" aria-hidden="true">
              &lt;/&gt;
            </div>
            <h3>A closer look at the work.</h3>
            <p>
              I can help you explore Ali’s projects, skills, and background, with links to the
              original sources.
            </p>
            <div className="assistant-suggestions">
              {SUGGESTIONS.map((question) => (
                <button key={question} type="button" onClick={() => submit(question)}>
                  {question}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <p className="assistant-boundary">I only answer questions about Ali and his work.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <article
            key={index}
            className={`assistant-message ${message.role === 'user' ? 'assistant-message-user' : ''}`}
            aria-label={message.role === 'user' ? 'Your message' : 'Assistant answer'}
          >
            <span className="assistant-message-author">
              {message.role === 'user'
                ? 'You'
                : message.mode === 'generated'
                  ? 'Assistant · AI-assisted'
                  : 'Assistant · Portfolio sources'}
            </span>
            <p>{message.answer}</p>
            {!!message.sourceIds?.length && (
              <div className="assistant-sources" aria-label="Answer sources">
                {[...new Set(message.sourceIds)].map((id) => {
                  const source = knowledge.sources.find((s) => s.id === id)
                  return source ? (
                    <a
                      key={id}
                      href={source.url}
                      target={source.url.startsWith('https:') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      onClick={(event) => navigate(event, source.url)}
                    >
                      {source.label}
                      {source.url.startsWith('https:') && (
                        <span className="sr-only"> (opens in a new tab)</span>
                      )}
                    </a>
                  ) : null
                })}
              </div>
            )}
            {!!message.actions?.length && (
              <div className="assistant-actions">
                {message.actions.map((action) => {
                  const href = resolveAction(action.id, knowledge)
                  return href ? (
                    <a
                      key={action.id}
                      href={href}
                      onClick={(event) => navigate(event, href)}
                      {...(href.startsWith('https:')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {action.label}
                    </a>
                  ) : null
                })}
              </div>
            )}
            {message.notice && <small className="assistant-notice">{message.notice}</small>}
          </article>
        ))}
        {pending && (
          <p className="assistant-pending" role="status">
            Checking the project documentation…
          </p>
        )}
      </div>
      <form
        className="assistant-composer"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <label className="sr-only" htmlFor="assistant-question">
          Your question about Ali
        </label>
        <textarea
          id="assistant-question"
          ref={input}
          value={draft}
          maxLength={ASSISTANT_LIMITS.message}
          rows={2}
          placeholder="Ask about a project or experience…"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              submit()
            }
          }}
        />
        <div className="assistant-send-row">
          <span>
            {draft.length}/{ASSISTANT_LIMITS.message}
          </span>
          {pending ? (
            <button type="button" onClick={stop}>
              Stop
            </button>
          ) : (
            <button type="submit" disabled={!draft.trim()}>
              Send <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
        <label className="assistant-ai-option">
          <input
            type="checkbox"
            checked={allowAI}
            onChange={(event) => setAllowAI(event.target.checked)}
          />{' '}
          I’m 18 or older; allow AI-assisted explanations
        </label>
        <details className="assistant-privacy">
          <summary>Sources &amp; privacy</summary>
          <p>
            Answers use the portfolio and saved public GitHub READMEs. Optional AI sends only a
            selected technical task and reviewed project excerpts to Google or an approved free
            OpenRouter provider, not your message or personal profile. Providers may retain or
            review that material. Never share private information. Conversations stay in this page’s
            memory; Clear or reload removes them.
          </p>
          <p>
            Sources last imported{' '}
            {knowledge.sources
              .map((s) => s.date)
              .filter(Boolean)
              .sort()
              .at(-1)}
            . AI availability is limited; source-based answers remain available.
          </p>
        </details>
      </form>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </dialog>
  )
}
