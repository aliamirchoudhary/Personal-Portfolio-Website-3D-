import { useState, useRef, useEffect } from "react"

export default function LazyMount({ children, margin = "200px", unmountMargin = "400px", placeholder = <div style={{ height: 200 }} /> }) {
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setMounted(entry.isIntersecting)
      },
      { rootMargin: `${unmountMargin} 0px` },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [unmountMargin])

  return <div ref={ref}>{mounted ? children : placeholder}</div>
}
