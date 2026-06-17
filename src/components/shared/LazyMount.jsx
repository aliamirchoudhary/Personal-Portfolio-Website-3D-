"use client"
import { useState, useRef, useEffect } from "react"

export default function LazyMount({ children, margin = "200px", placeholder = <div style={{ height: 200 }} /> }) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true)
          obs.disconnect()
        }
      },
      { rootMargin: margin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])

  return <div ref={ref}>{mounted ? children : placeholder}</div>
}
