import { createContext, useContext, useEffect, useRef, useState } from 'react'
export const MotionContext = createContext({ animate: true, isDesktop: false, lowPower: false })
export function useMotion() {
  return useContext(MotionContext)
}
export function useAnimationActivity() {
  const ref = useRef(null),
    [inView, setInView] = useState(false)
  const motion = useMotion()
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px',
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, animate: motion.animate && inView, lowPower: motion.lowPower }
}
