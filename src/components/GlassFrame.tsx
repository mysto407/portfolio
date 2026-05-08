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
      {/* White background clipped to the frame shape, sitting below content (z-10).
          No blend mode — black body shows outside the clip, white shows inside, content is untouched. */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'white',
        zIndex: 5,
        pointerEvents: 'none',
        clipPath: 'url(#vb-frame-clip)',
      }} />
    </>
  )
}
