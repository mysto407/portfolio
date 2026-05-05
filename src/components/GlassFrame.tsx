import type { CSSProperties, ReactNode } from 'react'

const FRAME = { left: '5%', top: '8vh', width: '90%', height: '84vh' } as const
const FRAME_RADIUS = '0px'

const frameLayer = (extra: CSSProperties): CSSProperties => ({
  position: 'fixed',
  left: FRAME.left,
  top: FRAME.top,
  width: FRAME.width,
  height: FRAME.height,
  borderRadius: FRAME_RADIUS,
  pointerEvents: 'none',
  ...extra,
})


export function GlassCard({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  const radius = (style?.borderRadius as string) ?? '999px'
  return (
    <div style={{
      position: 'relative',
      backdropFilter: 'invert(1)',
      borderRadius: radius,
      boxShadow: [
        '0 0 0 1px rgba(255,255,255,0.70)',
        'inset 0 0 0 1px rgba(255,255,255,0.55)',
        'inset 0 4px 12px rgba(255,255,255,0.45)',
        'inset 0 -4px 12px rgba(0,0,0,0.14)',
      ].join(', '),
      ...style,
    }}>
      {children}
    </div>
  )
}

export function GlassFrame() {
  return (
    <>
      {/* Full-screen inversion overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'white',
        mixBlendMode: 'difference',
        zIndex: 15,
        pointerEvents: 'none',
      }} />

      {/* Un-inversion clipped to the vibrating frame shape (clip path provided by VibratingBorder) */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'white',
        mixBlendMode: 'difference',
        zIndex: 20,
        pointerEvents: 'none',
        clipPath: 'url(#vb-frame-clip)',
      }} />
    </>
  )
}
