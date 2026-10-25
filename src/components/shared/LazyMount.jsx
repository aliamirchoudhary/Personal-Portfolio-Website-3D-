import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../../context/motion'
import DecorationBoundary from './DecorationBoundary'

export default function LazyMount({
  children,
  margin = '200px',
  unmountMargin = '400px',
  placeholder = <div style={{ height: 200 }} />,
}) {
  const { isDesktop } = useMotion()
  const [mounted, setMounted] = useState(false)
  const ref = useRef(null),
    content = useRef(null)
  const [height, setHeight] = useState(
    placeholder.props?.style?.height || placeholder.props?.height || 200,
  )
  useEffect(() => {
    if (isDesktop || !ref.current) return
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: `${margin} 0px` },
    )
    const leave = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setMounted(false)
      },
      { rootMargin: `${unmountMargin} 0px` },
    )
    enter.observe(ref.current)
    leave.observe(ref.current)
    return () => {
      enter.disconnect()
      leave.disconnect()
    }
  }, [margin, unmountMargin, isDesktop])
  useEffect(() => {
    if (!mounted || !content.current) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.height > 0) setHeight(entry.contentRect.height)
    })
    observer.observe(content.current)
    return () => observer.disconnect()
  }, [mounted])
  if (isDesktop) return null
  return (
    <div ref={ref} className="lazy-artwork" style={{ minHeight: height }}>
      {mounted ? (
        <div ref={content}>
          <DecorationBoundary>{children}</DecorationBoundary>
        </div>
      ) : (
        placeholder
      )}
    </div>
  )
}
