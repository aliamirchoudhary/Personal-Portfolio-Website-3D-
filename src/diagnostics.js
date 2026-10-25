// Local diagnostics only: no analytics destination, identifiers, or contact text.
export function startDiagnostics() {
  const record = (metric) => {
    const detail = { name: metric.name, value: metric.value, rating: metric.rating }
    window.__portfolioVitals ??= {}
    window.__portfolioVitals[metric.name] = detail
    window.dispatchEvent(new CustomEvent('portfolio:vital', { detail }))
  }
  const start = () =>
    import('web-vitals')
      .then(({ onCLS, onINP, onLCP }) => {
        onCLS(record)
        onINP(record)
        onLCP(record)
      })
      .catch(() => {})
  if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 4000 })
  else window.setTimeout(start, 1500)
  window.addEventListener('error', () =>
    window.dispatchEvent(new CustomEvent('portfolio:error', { detail: { type: 'runtime' } })),
  )
  window.addEventListener('unhandledrejection', () =>
    window.dispatchEvent(new CustomEvent('portfolio:error', { detail: { type: 'promise' } })),
  )
}
