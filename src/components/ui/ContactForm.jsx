import { useRef, useState } from 'react'
import { CONTACT_LIMITS, validateContact } from '../../../shared/contact'
import { PERSONAL } from '../../data/portfolioData'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const submission = useRef(null)
  const inFlight = useRef(false)
  const fields = useRef({})
  const update = (e) => {
    setForm((previous) => ({ ...previous, [e.target.name]: e.target.value }))
    setStatus(null)
    submission.current = null
  }
  const submit = async (e) => {
    e.preventDefault()
    if (inFlight.current) return
    const validation = validateContact(form)
    if (validation.error) {
      setStatus({ type: 'error', text: validation.error, field: validation.field })
      fields.current[validation.field]?.focus()
      return
    }
    inFlight.current = true
    setSending(true)
    setStatus({ type: 'pending', text: 'Sending your message…' })
    submission.current ??= crypto.randomUUID()
    try {
      const response = await fetch('/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': submission.current },
        body: JSON.stringify({ ...validation.values, website: form.website }),
        signal: AbortSignal.timeout(20000),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success)
        throw new Error(
          data.message ||
            'The form is temporarily unavailable. Your draft is saved; try again or email me directly.',
        )
      setStatus({ type: 'success', text: data.message || 'Your message has been received.' })
      setForm({ name: '', email: '', message: '', website: '' })
      submission.current = null
    } catch (error) {
      setStatus({
        type: 'error',
        text: ['TimeoutError', 'AbortError'].includes(error.name)
          ? 'The request timed out. Your draft is saved. Retry to check this submission, or email me directly.'
          : error.message || 'Unable to send. Your draft is saved; please try again.',
      })
    } finally {
      inFlight.current = false
      setSending(false)
    }
  }
  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={sending}>
      {['name', 'email', 'message'].map((field) => (
        <div key={field}>
          <label htmlFor={`contact-${field}`}>{field[0].toUpperCase() + field.slice(1)}</label>
          {field === 'message' ? (
            <textarea
              id={`contact-${field}`}
              ref={(el) => {
                fields.current[field] = el
              }}
              name={field}
              rows={6}
              required
              minLength={10}
              maxLength={CONTACT_LIMITS[field]}
              value={form[field]}
              onChange={update}
              aria-invalid={status?.field === field}
              aria-describedby={status?.field === field ? 'contact-status' : undefined}
            />
          ) : (
            <input
              id={`contact-${field}`}
              ref={(el) => {
                fields.current[field] = el
              }}
              name={field}
              type={field === 'email' ? 'email' : 'text'}
              autoComplete={field}
              required
              minLength={field === 'name' ? 2 : undefined}
              maxLength={CONTACT_LIMITS[field]}
              value={form[field]}
              onChange={update}
              aria-invalid={status?.field === field}
              aria-describedby={status?.field === field ? 'contact-status' : undefined}
            />
          )}
        </div>
      ))}
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          value={form.website}
          onChange={update}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <button type="submit" className="primary-button" disabled={sending}>
        {sending ? 'Sending…' : 'Send message'}
      </button>
      <div
        id="contact-status"
        className={`contact-status ${status?.type || ''}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status?.text}
      </div>
      <div className="contact-form-footer">
        <p className="contact-alternative">
          Email directly: <a href={`mailto:${PERSONAL.email}`}>{PERSONAL.email}</a>
        </p>
        <details className="contact-privacy">
          <summary>Message privacy</summary>
          <p className="privacy-note">
            Your name, email, and message go to my Gmail inbox so I can reply; they are not
            published. Spam-protection records expire within 24 hours. To request deletion,{' '}
            <a href={`mailto:${PERSONAL.email}`}>email me</a>.
          </p>
        </details>
      </div>
    </form>
  )
}
