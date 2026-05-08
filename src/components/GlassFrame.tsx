import type { CSSProperties, ReactNode } from 'react'

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
      {/* Full-screen inversion overlay — 100vh covers behind Safari's floating bottom toolbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'white',
        mixBlendMode: 'difference',
        zIndex: 15,
        pointerEvents: 'none',
      }} />

      {/* Un-inversion clipped to the vibrating frame shape (clip path provided by VibratingBorder) */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100vh',
        background: 'white',
        mixBlendMode: 'difference',
        zIndex: 20,
        pointerEvents: 'none',
        clipPath: 'url(#vb-frame-clip)',
      }} />
    </>
  )
}
