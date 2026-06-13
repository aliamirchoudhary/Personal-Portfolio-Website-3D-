import { forwardRef } from 'react'

const AnimatedSlot = forwardRef(function AnimatedSlot({ children, side = 'right' }, ref) {
  const initialLeft = side === 'right' ? '60vw' : '0vw'

  return (
    <div
      ref={ref}
      className="animated-slot"
      style={{
        position: 'fixed',
        top: 0,
        left: initialLeft,
        width: '40vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'visible',
      }}
    >
      {children && (
        <div style={{ pointerEvents: 'auto', width: 'calc(100% - 3rem)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  )
})

export default AnimatedSlot
