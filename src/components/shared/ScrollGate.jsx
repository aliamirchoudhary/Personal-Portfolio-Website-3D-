import { useState, useRef, useEffect } from 'react'

export default function ScrollGate({ children, rootMargin = '0px 0px -150px 0px' }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [visible, rootMargin])

  if (visible) return children
  return <div ref={ref} style={{ minHeight: '100vh' }} />
}
