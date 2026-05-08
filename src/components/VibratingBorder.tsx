import { useEffect, useId, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

// ── types ────────────────────────────────────────────────────

interface RoundedRect {
  x: number; y: number; w: number; h: number; r: number
}

// ── geometry ─────────────────────────────────────────────────

// Returns [px, py, nx, ny] — tuple avoids per-sample object allocation
function samplePerimeter(rect: RoundedRect, t: number): [number, number, number, number] {
  const { x, y, w, h, r } = rect
  const sH = w - 2 * r
  const sV = h - 2 * r
  const arc = (Math.PI / 2) * r
  const total = 2 * (sH + sV) + 4 * arc
  let pos = ((t % 1) + 1) % 1 * total

  if (pos < sH) return [x + r + pos, y, 0, -1]
  pos -= sH

  if (pos < arc) {
    const a = -Math.PI / 2 + (pos / arc) * (Math.PI / 2)
    const ca = Math.cos(a), sa = Math.sin(a)
    return [x + w - r + ca * r, y + r + sa * r, ca, sa]
  }
  pos -= arc

  if (pos < sV) return [x + w, y + r + pos, 1, 0]
  pos -= sV

  if (pos < arc) {
    const a = (pos / arc) * (Math.PI / 2)
    const ca = Math.cos(a), sa = Math.sin(a)
    return [x + w - r + ca * r, y + h - r + sa * r, ca, sa]
  }
  pos -= arc

  if (pos < sH) return [x + w - r - pos, y + h, 0, 1]
  pos -= sH

  if (pos < arc) {
    const a = Math.PI / 2 + (pos / arc) * (Math.PI / 2)
    const ca = Math.cos(a), sa = Math.sin(a)
    return [x + r + ca * r, y + h - r + sa * r, ca, sa]
  }
  pos -= arc

  if (pos < sV) return [x, y + h - r - pos, -1, 0]
  pos -= sV

  const a = Math.PI + (pos / arc) * (Math.PI / 2)
  const ca = Math.cos(a), sa = Math.sin(a)
  return [x + r + ca * r, y + r + sa * r, ca, sa]
}

// Single loop produces both main and glow paths — halves perimeter traversals
function buildPaths(
  rect: RoundedRect,
  amplitude: number,
  frequency: number,
  phase: number,
  segments: number,
  inset: number,
): [string, string] {
  const tau2 = frequency * Math.PI * 2

  if (rect.r === 0) {
    const { x, y, w, h } = rect
    const perimeter = 2 * (w + h)
    const segsPerEdge = Math.max(2, Math.floor(segments / 4))
    let main = '', glow = '', idx = 0
    const d = 1 / Math.SQRT2

    const pt = (px: number, py: number, nx: number, ny: number, t: number) => {
      const disp = amplitude * Math.sin(t * tau2 + phase)
      const cmd = idx++ === 0 ? 'M' : 'L'
      main += `${cmd}${(px + nx * disp).toFixed(2)},${(py + ny * disp).toFixed(2)}`
      glow += `${cmd}${(px + nx * (disp - inset)).toFixed(2)},${(py + ny * (disp - inset)).toFixed(2)}`
    }

    const edgePts = (x0: number, y0: number, x1: number, y1: number, nx: number, ny: number, t0: number, t1: number) => {
      for (let i = 1; i < segsPerEdge; i++) {
        const frac = i / segsPerEdge
        pt(x0 + frac * (x1 - x0), y0 + frac * (y1 - y0), nx, ny, t0 + frac * (t1 - t0))
      }
    }

    const t1 = w / perimeter
    const t2 = (w + h) / perimeter
    const t3 = (2 * w + h) / perimeter

    pt(x,   y,   -d, -d, 0);  edgePts(x, y,   x+w, y,   0,  -1, 0,  t1)
    pt(x+w, y,    d, -d, t1); edgePts(x+w, y, x+w, y+h, 1,   0, t1, t2)
    pt(x+w, y+h,  d,  d, t2); edgePts(x+w, y+h, x, y+h, 0,   1, t2, t3)
    pt(x,   y+h, -d,  d, t3); edgePts(x, y+h, x, y,    -1,   0, t3, 1)

    return [main + ' Z', glow + ' Z']
  }

  let main = '', glow = ''
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const [px, py, nx, ny] = samplePerimeter(rect, t)
    const disp = amplitude * Math.sin(t * tau2 + phase)
    const dispG = disp - inset
    const cmd = i === 0 ? 'M' : 'L'
    main += `${cmd}${(px + nx * disp).toFixed(2)},${(py + ny * disp).toFixed(2)}`
    glow += `${cmd}${(px + nx * dispG).toFixed(2)},${(py + ny * dispG).toFixed(2)}`
  }

  return [main + ' Z', glow + ' Z']
}

// ── shared RAF orchestrator ───────────────────────────────────
// One requestAnimationFrame loop drives all vibrating components instead of N separate loops.

type TickFn = () => void
const _rafSubscribers = new Set<TickFn>()
let _rafId: number | null = null

function _rafLoop() {
  _rafSubscribers.forEach(fn => fn())
  _rafId = requestAnimationFrame(_rafLoop)
}

function subscribeToRAF(fn: TickFn): () => void {
  _rafSubscribers.add(fn)
  if (_rafSubscribers.size === 1) {
    _rafId = requestAnimationFrame(_rafLoop)
  }
  return () => {
    _rafSubscribers.delete(fn)
    if (_rafSubscribers.size === 0 && _rafId !== null) {
      cancelAnimationFrame(_rafId)
      _rafId = null
    }
  }
}

// ── shared scroll velocity ────────────────────────────────────
// One scroll listener shared across all component instances instead of N separate listeners.

const _sharedVelocity = { current: 0 }
let _scrollEl: Element | null = null
let _scrollListenerCount = 0
let _scrollLastY = 0
let _scrollLastTime = 0
let _scrollDecayTimer: ReturnType<typeof setTimeout>

function _onScroll() {
  const now = performance.now()
  const dt = now - _scrollLastTime
  const dy = Math.abs((_scrollEl?.scrollTop ?? 0) - _scrollLastY)
  _sharedVelocity.current = dt > 0 ? dy / dt : 0
  _scrollLastY = _scrollEl?.scrollTop ?? 0
  _scrollLastTime = now
  clearTimeout(_scrollDecayTimer)
  _scrollDecayTimer = setTimeout(() => { _sharedVelocity.current = 0 }, 120)
}

function useSharedScrollVelocity(selector: string) {
  useEffect(() => {
    if (_scrollListenerCount === 0) {
      _scrollEl = document.querySelector(selector)
      if (_scrollEl) {
        _scrollLastY = _scrollEl.scrollTop
        _scrollLastTime = performance.now()
        _scrollEl.addEventListener('scroll', _onScroll, { passive: true })
      }
    }
    _scrollListenerCount++
    return () => {
      _scrollListenerCount--
      if (_scrollListenerCount === 0 && _scrollEl) {
        _scrollEl.removeEventListener('scroll', _onScroll)
        clearTimeout(_scrollDecayTimer)
        _scrollEl = null
      }
    }
  }, [selector])

  return _sharedVelocity
}

// ── constants ────────────────────────────────────────────────

const IDLE_THRESHOLD = 0.05

// Safari on iOS renders a floating bottom toolbar (~83px) that overlaps page content.
// window.innerHeight includes that area, so we shrink the frame height to clear the toolbar.
// Chrome on iOS excludes its chrome from window.innerHeight — no adjustment needed there.
const IS_IOS_SAFARI = /iP(?:hone|od|ad)/.test(navigator.userAgent)
  && /WebKit/.test(navigator.userAgent)
  && !/CriOS|FxiOS/.test(navigator.userAgent)

const FRAME_RECT = { left: 0.05, top: 0.08, width: 0.90, height: 0.84 }
// Shorter height so the bottom edge clears Safari's floating toolbar (bottom at 87% vs 92%)
const FRAME_RECT_IOS_SAFARI = { left: 0.05, top: 0.08, width: 0.90, height: 0.79 }
const CORNER_RADIUS = 0
const SEGMENTS = 360
const FREQUENCY = 4
const MAX_AMPLITUDE = 28
const INSET = 4

const CARD_SEGMENTS = 80    // was 140 — pill borders need far fewer points
const CARD_FREQUENCY = 2
const CARD_MAX_AMPLITUDE = 5
const CARD_INSET = 2

// ── VibratingBorder ──────────────────────────────────────────

export function VibratingBorder() {
  const pathRef = useRef<SVGPathElement>(null)
  const clipRef = useRef<SVGPathElement>(null)
  const rectRef = useRef<RoundedRect>({ x: 0, y: 0, w: 0, h: 0, r: CORNER_RADIUS })
  const velocityRef = useSharedScrollVelocity('main')

  // useLayoutEffect so clip path is set before first paint (avoids a flash of inverted screen)
  useLayoutEffect(() => {
    const update = () => {
      const fr = IS_IOS_SAFARI ? FRAME_RECT_IOS_SAFARI : FRAME_RECT
      rectRef.current = {
        x: window.innerWidth * fr.left,
        y: window.innerHeight * fr.top,
        w: window.innerWidth * fr.width,
        h: window.innerHeight * fr.height,
        r: CORNER_RADIUS,
      }
      const [main] = buildPaths(rectRef.current, 0, FREQUENCY, 0, SEGMENTS, INSET)
      clipRef.current?.setAttribute('d', main)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let amplitude = 0
    let phase = 0
    let wasVibrating = false

    const tick = () => {
      const target = Math.min(velocityRef.current * 20, MAX_AMPLITUDE)
      amplitude += (target - amplitude) * 0.14

      if (amplitude > IDLE_THRESHOLD) {
        wasVibrating = true
        phase += 0.07 + amplitude * 0.015
        const [main] = buildPaths(rectRef.current, amplitude, FREQUENCY, phase, SEGMENTS, INSET)
        clipRef.current?.setAttribute('d', main)
        pathRef.current?.setAttribute('d', main)
      } else if (wasVibrating) {
        wasVibrating = false
        const [main] = buildPaths(rectRef.current, 0, FREQUENCY, phase, SEGMENTS, INSET)
        clipRef.current?.setAttribute('d', main)
      }
    }

    return subscribeToRAF(tick)
  }, [velocityRef])

  return (
    <svg aria-hidden style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 32, overflow: 'visible' }}>
      <defs>
        <clipPath id="vb-frame-clip" clipPathUnits="userSpaceOnUse">
          <path ref={clipRef} />
        </clipPath>
      </defs>
      <path ref={pathRef} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
    </svg>
  )
}

// ── VibratingGlassCard ───────────────────────────────────────

const GLASS_SHADOW = [
  '0 0 0 1px rgba(255,255,255,0.70)',
  'inset 0 0 0 1px rgba(255,255,255,0.55)',
  'inset 0 4px 12px rgba(255,255,255,0.45)',
  'inset 0 -4px 12px rgba(0,0,0,0.14)',
].join(', ')

export function VibratingGlassCard({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  const uid = useId().replace(/:/g, '')
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const rectRef = useRef<RoundedRect | null>(null)
  const velocityRef = useSharedScrollVelocity('main')

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      rectRef.current = { x: 0, y: 0, w: width, h: height, r: height / 2 }
      const [main, glow] = buildPaths(rectRef.current, 0, CARD_FREQUENCY, 0, CARD_SEGMENTS, CARD_INSET)
      pathRef.current?.setAttribute('d', main)
      glowRef.current?.setAttribute('d', glow)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let amplitude = 0
    let phase = 0

    const tick = () => {
      const target = Math.min(velocityRef.current * 20, CARD_MAX_AMPLITUDE)
      amplitude += (target - amplitude) * 0.14

      if (amplitude > IDLE_THRESHOLD && rectRef.current) {
        phase += 0.07 + amplitude * 0.015
        const [main, glow] = buildPaths(rectRef.current, amplitude, CARD_FREQUENCY, phase, CARD_SEGMENTS, CARD_INSET)
        pathRef.current?.setAttribute('d', main)
        glowRef.current?.setAttribute('d', glow)
      }
    }

    return subscribeToRAF(tick)
  }, [velocityRef])

  const radius = (style?.borderRadius as string) ?? '999px'

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', backdropFilter: 'invert(1)', borderRadius: radius, boxShadow: GLASS_SHADOW, ...style }}
    >
      <svg aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
        <defs>
          <filter id={`vbc-glow-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <path ref={glowRef} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="12" filter={`url(#vbc-glow-${uid})`} />
        <path ref={pathRef} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      </svg>
      {children}
    </div>
  )
}
