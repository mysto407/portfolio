import { useEffect, useRef } from 'react'
import type { ColorProfile } from '@/data/colorProfiles'

const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩ+-=*/\\|<>[]{}@#!~"
const DIAG_PERIOD = 24
const DIAG_WIDTH = 8
const FONT_SIZE = 13
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.6)
const SCRAMBLE_MS = 100
const WAVE2_SPEED_RATIO = 0.73
const FONT = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`

// 3D extrusion for wave-lit chars: stacked shadow copies offset down-right under the top fill.
const EXTRUDE_LAYERS = 1
const EXTRUDE_STEP = 10
// Below this alpha bucket the shadow layers are imperceptible — skip them.
const SHADOW_VISIBLE_BUCKET = 2
// Opacity multiplier for the top face only (shadow layers stay at full wave alpha).
const FACE_OPACITY = 0.1

// Cursor repel: chars within REPEL_RADIUS px get pushed outward by up to REPEL_STRENGTH px
// with a (1 - d/R)^2 falloff so the void edge eases smoothly into the surrounding grid.
const REPEL_RADIUS = 140
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS
const REPEL_STRENGTH = 60

// Critically-damped exponential smoothing — position chases the cursor with a slight lag
// (feels weighty, not laggy), intensity eases the void in/out at the last known spot.
const REPEL_POSITION_TAU = 0.06   // ~95% chase in 180ms
const REPEL_INTENSITY_TAU = 0.12  // ~95% fade in 360ms

// Skip the effect on coarse/no-hover devices and when the user prefers reduced motion.
const REPEL_MEDIA_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

// Matches FRAME_RECT in VibratingBorder.tsx — frame interior has a white background (GlassFrame),
// so inactive chars need dark color there, light color on the black body outside.
// All insets are vw-based (cssW * FRAME_INSET_VW) to track the Fibonacci grid (1 cell = 5vw).
const FRAME_INSET_VW = 0.05
const FRAME_INSET_VW_MOBILE = 0.1125
const MOBILE_BREAKPOINT_PX = 768
const INACTIVE_INSIDE  = 'rgba(0,0,0,0.1)'
const INACTIVE_OUTSIDE = 'rgba(255,255,255,0.1)'

// Per-layer shade multipliers for the color path. Layer 0 = top (full color),
// 1..EXTRUDE_LAYERS = progressively darker shadow copies.
const TOTAL_LAYERS = EXTRUDE_LAYERS + 1
const EXTRUDE_SHADES = (() => {
  const arr = new Float32Array(TOTAL_LAYERS)
  arr[0] = 1
  for (let layer = 1; layer < TOTAL_LAYERS; layer++) {
    arr[layer] = 0.25 + (1 - layer / EXTRUDE_LAYERS) * 0.45 // 0.25 deepest → 0.70 closest
  }
  return arr
})()

// Grayscale fillStyle LUT, indexed by [layer * ALPHA_BUCKETS + bucket].
// Eliminates per-char string allocation in the grayscale draw path.
// Row layout: 0 = full-opacity top, 1..EXTRUDE_LAYERS = shadow copies, FACE_LAYER_INDEX = top at FACE_OPACITY.
const ALPHA_BUCKETS = 51 // alpha quantized to 0..0.50 in 0.01 steps
const FACE_LAYER_INDEX = TOTAL_LAYERS
const LUT_ROWS = TOTAL_LAYERS + 1

const buildLut = (topGray: number, shadowGray: number): string[] => {
  const lut = new Array<string>(LUT_ROWS * ALPHA_BUCKETS)
  for (let layer = 0; layer < TOTAL_LAYERS; layer++) {
    const shade = EXTRUDE_SHADES[layer]
    const gray = (topGray + (shadowGray - topGray) * (1 - shade)) | 0
    for (let b = 0; b < ALPHA_BUCKETS; b++) {
      lut[layer * ALPHA_BUCKETS + b] = `rgba(${gray},${gray},${gray},${b / 100})`
    }
  }
  // Top face at FACE_OPACITY — drawn over the shadow stack.
  for (let b = 0; b < ALPHA_BUCKETS; b++) {
    lut[FACE_LAYER_INDEX * ALPHA_BUCKETS + b] = `rgba(${topGray},${topGray},${topGray},${(b / 100) * FACE_OPACITY})`
  }
  return lut
}

// Outside frame (dark background): white top, dark shadows.
// Inside frame (white background): black top, lighter shadows.
const LUT_LIGHT = buildLut(255, 0)
const LUT_DARK = buildLut(0, 255)

// Linear interpolation across a ColorProfile's stops; t in [0, 1]
const sampleProfile = (
  t: number,
  stops: ColorProfile['stops'],
): [number, number, number] => {
  const n = stops.length - 1
  const scaled = t * n
  const lo = Math.min(scaled | 0, n - 1)
  const hi = lo + 1
  const f = scaled - lo
  const [r1, g1, b1] = stops[lo]
  const [r2, g2, b2] = stops[hi]
  return [r1 + (r2 - r1) * f | 0, g1 + (g2 - g1) * f | 0, b1 + (b2 - b1) * f | 0]
}

export function HeroCanvas({ profile }: { profile: ColorProfile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const profileRef = useRef(profile)
  profileRef.current = profile // sync on every render without restarting the effect

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let grid: string[][] = []
    let cols = 0
    let rows = 0
    let cssW = 0
    let cssH = 0
    let charSlot = 0
    let dpr = 1
    let time = 0
    let rafId = 0
    let lastScramble = 0
    let startTime = -1
    let visible = true
    // pre-allocated per-cell wave alpha buffers — computed once in tick, read by draw and scramble.
    // Kept separate (not summed) so the color path can blend wave1 vs wave2 at intersections.
    let a1buf = new Float32Array(0)
    let a2buf = new Float32Array(0)

    // Cursor repel state — raw position from pointer events, sprung position used by draw.
    let cursorClientX = 0
    let cursorClientY = 0
    let cursorActive = false
    let springX = 0
    let springY = 0
    let intensity = 0
    let rectLeft = 0
    let rectTop = 0
    let lastFrameTime = -1

    const repelMedia =
      typeof window.matchMedia === 'function' ? window.matchMedia(REPEL_MEDIA_QUERY) : null
    let repelEnabled = repelMedia ? repelMedia.matches : true

    const updateRect = () => {
      const r = canvas.getBoundingClientRect()
      rectLeft = r.left
      rectTop = r.top
    }

    const setup = () => {
      dpr = window.devicePixelRatio || 1
      cssW = canvas.clientWidth
      cssH = canvas.clientHeight
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = FONT
      // 'A ' includes trailing-space width; active cells draw only the char, spacing via x position
      charSlot = ctx.measureText('A ').width

      const newCols = Math.ceil(cssW / charSlot) + 2
      const newRows = Math.ceil(cssH / LINE_HEIGHT) + 2

      if (newCols !== cols || newRows !== rows) {
        cols = newCols
        rows = newRows
        grid = Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => CHAR_POOL[(Math.random() * CHAR_POOL.length) | 0])
        )
        const size = rows * cols
        a1buf = new Float32Array(size)
        a2buf = new Float32Array(size)
      }

      updateRect()
    }

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH)

      const horizontalInset = cssW * FRAME_INSET_VW
      const verticalInset = cssW < MOBILE_BREAKPOINT_PX ? cssW * FRAME_INSET_VW_MOBILE : cssW * FRAME_INSET_VW
      const frameLeft   = horizontalInset
      const frameTop    = verticalInset
      const frameRight  = cssW - horizontalInset
      const frameBottom = cssH - verticalInset

      const profile = profileRef.current
      const isGrayscale = profile.grayscale === true
      const stops = profile.stops

      // Snapshot sprung cursor state once per draw — read inside the hot per-cell loop.
      const repelOn = intensity > 0.005
      const cursorXLocal = springX
      const cursorYLocal = springY
      const effectiveStrength = REPEL_STRENGTH * intensity

      // flushRun hoisted once per draw call, reset at the start of each row
      let runStr = ''
      let runX = 0
      let runInFrame: boolean | null = null

      const flushRun = (y: number) => {
        if (!runStr) return
        ctx.fillStyle = runInFrame ? INACTIVE_INSIDE : INACTIVE_OUTSIDE
        ctx.fillText(runStr, runX, y)
        runStr = ''
        runInFrame = null
      }

      for (let r = 0; r < rows; r++) {
        const y = r * LINE_HEIGHT + FONT_SIZE
        if (y - LINE_HEIGHT > cssH) break

        const charMidY = y - FONT_SIZE / 2
        const row = grid[r]
        const rowOffset = r * cols
        runStr = ''
        runInFrame = null

        for (let c = 0; c < cols; c++) {
          const x = c * charSlot
          if (x > cssW) break

          const i = rowOffset + c
          const a1 = a1buf[i]
          const a2 = a2buf[i]
          const sum = a1 + a2
          const alpha = sum < 1 ? sum : 1
          const inFrame = x >= frameLeft && x < frameRight && charMidY >= frameTop && charMidY < frameBottom

          // Per-cell repel displacement: (1 - d/R)^2 push outward from sprung cursor.
          let dx = 0
          let dy = 0
          if (repelOn) {
            const cdx = x - cursorXLocal
            const cdy = charMidY - cursorYLocal
            const d2 = cdx * cdx + cdy * cdy
            if (d2 < REPEL_RADIUS_SQ) {
              const d = Math.sqrt(d2)
              if (d > 0.5) {
                const t = 1 - d / REPEL_RADIUS
                const k = (effectiveStrength * t * t) / d
                dx = cdx * k
                dy = cdy * k
              }
            }
          }
          const displaced = dx !== 0 || dy !== 0

          if (alpha > 0) {
            flushRun(y)
            const bucket = (alpha * 50 + 0.5) | 0
            const ch = row[c]
            const drawX = x + dx
            const drawY = y + dy

            if (isGrayscale) {
              const lut = inFrame ? LUT_DARK : LUT_LIGHT
              if (bucket >= SHADOW_VISIBLE_BUCKET) {
                for (let layer = EXTRUDE_LAYERS; layer >= 1; layer--) {
                  ctx.fillStyle = lut[layer * ALPHA_BUCKETS + bucket]
                  ctx.fillText(ch, drawX + EXTRUDE_STEP * layer, drawY + EXTRUDE_STEP * layer)
                }
              }
              ctx.fillStyle = lut[FACE_LAYER_INDEX * ALPHA_BUCKETS + bucket]
              ctx.fillText(ch, drawX, drawY)
            } else {
              // wave1: full range; wave2: 65% toward end — distinct tone, interesting blend at intersections
              const [r1, g1, b1] = sampleProfile(a1, stops)
              const [r2, g2, b2] = sampleProfile(a2 * 0.65, stops)
              const blend = a2 / sum
              const cr = (r1 + (r2 - r1) * blend) | 0
              const cg = (g1 + (g2 - g1) * blend) | 0
              const cb = (b1 + (b2 - b1) * blend) | 0
              const baseAlpha = bucket / 100
              if (bucket >= SHADOW_VISIBLE_BUCKET) {
                for (let layer = EXTRUDE_LAYERS; layer >= 1; layer--) {
                  const shade = EXTRUDE_SHADES[layer]
                  ctx.fillStyle = `rgba(${(cr * shade) | 0},${(cg * shade) | 0},${(cb * shade) | 0},${baseAlpha})`
                  ctx.fillText(ch, drawX + EXTRUDE_STEP * layer, drawY + EXTRUDE_STEP * layer)
                }
              }
              ctx.fillStyle = `rgba(${cr},${cg},${cb},${baseAlpha * FACE_OPACITY})`
              ctx.fillText(ch, drawX, drawY)
            }
          } else if (displaced) {
            // Inactive chars in the repel zone break the run-batch and draw individually with offset.
            flushRun(y)
            ctx.fillStyle = inFrame ? INACTIVE_INSIDE : INACTIVE_OUTSIDE
            ctx.fillText(row[c], x + dx, y + dy)
          } else {
            if (inFrame !== runInFrame && runStr) flushRun(y)
            if (!runStr) { runX = x; runInFrame = inFrame }
            runStr += row[c] + (c < cols - 1 ? ' ' : '')
          }
        }

        flushRun(y)
      }
    }

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)
      if (!visible) return

      if (startTime < 0) startTime = now
      time = (now - startTime) / 100

      // Cursor spring step — runs every frame so the void chases and fades smoothly.
      const dt = lastFrameTime < 0 ? 0.016 : Math.min((now - lastFrameTime) / 1000, 0.05)
      lastFrameTime = now
      if (repelEnabled) {
        // First activation: snap position so the void appears at the cursor, not at (0,0).
        if (cursorActive && intensity < 0.005) {
          springX = cursorClientX - rectLeft
          springY = cursorClientY - rectTop
        }
        const targetIntensity = cursorActive ? 1 : 0
        intensity += (targetIntensity - intensity) * (1 - Math.exp(-dt / REPEL_INTENSITY_TAU))
        if (cursorActive) {
          const tx = cursorClientX - rectLeft
          const ty = cursorClientY - rectTop
          const k = 1 - Math.exp(-dt / REPEL_POSITION_TAU)
          springX += (tx - springX) * k
          springY += (ty - springY) * k
        }
      }

      const phase  = time % DIAG_PERIOD
      const phase2 = (time * WAVE2_SPEED_RATIO) % DIAG_PERIOD

      // Hoist wave coefficients that depend only on time, not r or c.
      const rw1 = 1.2 + 0.9 * Math.sin(time * 0.02)
      const cw1 = 1.0 - 0.5 * Math.cos(time * 0.017)
      const t1a = time * 0.06
      const t1b = time * 0.09
      const rw2 = 0.7 + 0.5 * Math.sin(time * 0.013 + 1.2)
      const cw2 = 1.5 - 0.4 * Math.cos(time * 0.019)
      const t2a = time * 0.05
      const t2b = time * 0.08
      const bellK = Math.PI / DIAG_WIDTH

      for (let r = 0; r < rows; r++) {
        // Per-row precomputed: terms depending on r and time but not c.
        const w1RowSinA = 6 * Math.sin(r * 0.27 + t1a)
        const w1RowB    = r * 0.71 + t1b
        const w2RowA    = r * 0.19 + t2a
        const w2RowSinB = 3 * Math.sin(r * 0.53 + t2b)
        const rTermW1   = r * rw1
        const rTermW2   = r * rw2
        const rowOffset = r * cols
        for (let c = 0; c < cols; c++) {
          const w1 = w1RowSinA + 3 * Math.sin(w1RowB + c * 0.05)
          const w2 = 5 * Math.sin(w2RowA + c * 0.11) + w2RowSinB
          const p1 = ((rTermW1 + c * cw1 + w1) % DIAG_PERIOD + DIAG_PERIOD) % DIAG_PERIOD
          const p2 = ((rTermW2 + c * cw2 + w2) % DIAG_PERIOD + DIAG_PERIOD) % DIAG_PERIOD
          const d1 = (p1 - phase + DIAG_PERIOD) % DIAG_PERIOD
          const d2 = (p2 - phase2 + DIAG_PERIOD) % DIAG_PERIOD
          const i = rowOffset + c
          a1buf[i] = d1 < DIAG_WIDTH ? 0.5 - 0.5 * Math.cos(bellK * d1) : 0
          a2buf[i] = d2 < DIAG_WIDTH ? 0.5 - 0.5 * Math.cos(bellK * d2) : 0
        }
      }

      if (now - lastScramble >= SCRAMBLE_MS) {
        lastScramble = now
        const poolLen = CHAR_POOL.length
        for (let r = 0; r < rows; r++) {
          const rowOffset = r * cols
          const row = grid[r]
          for (let c = 0; c < cols; c++) {
            const i = rowOffset + c
            if (a1buf[i] + a2buf[i] > 0) {
              row[c] = CHAR_POOL[(Math.random() * poolLen) | 0]
            }
          }
        }
      }

      draw()
    }

    setup()
    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting },
      { threshold: 0.05 }
    )
    io.observe(canvas)

    const onPointerMove = (e: PointerEvent) => {
      cursorClientX = e.clientX
      cursorClientY = e.clientY
      cursorActive = true
    }
    const onLeave = () => { cursorActive = false }
    const onScroll = () => { updateRect() }
    const onMediaChange = (e: MediaQueryListEvent) => { repelEnabled = e.matches }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    repelMedia?.addEventListener('change', onMediaChange)

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('scroll', onScroll)
      repelMedia?.removeEventListener('change', onMediaChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
    />
  )
}
