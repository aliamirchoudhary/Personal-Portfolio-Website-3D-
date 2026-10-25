import { useMemo, useState, useSyncExternalStore } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import { MotionContext } from './motion'
const subscribeVisibility = (callback) => {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}
export function MotionProvider({ children }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)'),
    isDesktop = useMediaQuery('(min-width: 1025px)')
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => false,
  )
  const [paused, setPaused] = useState(false)
  const lowPower =
    typeof navigator !== 'undefined' &&
    Boolean(
      navigator.connection?.saveData ||
      (navigator.deviceMemory ?? 8) <= 4 ||
      (navigator.hardwareConcurrency ?? 8) <= 4,
    )
  const value = useMemo(
    () => ({
      animate: !reduced && !paused && visible,
      reduced,
      paused,
      setPaused,
      isDesktop,
      lowPower,
    }),
    [reduced, paused, visible, isDesktop, lowPower],
  )
  return (
    <MotionContext.Provider value={value}>
      <div data-motion={value.animate ? 'on' : 'off'}>{children}</div>
    </MotionContext.Provider>
  )
}
