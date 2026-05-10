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

// Matches FRAME_RECT in VibratingBorder.tsx — frame interior has a white background (GlassFrame),
// so inactive chars need dark color there, light color on the black body outside.
const FRAME = { left: 0.05, top: 0.08, right: 0.95, bottom: 0.92 }
const INACTIVE_INSIDE  = 'rgba(0,0,0,0.1)'
const INACTIVE_OUTSIDE = 'rgba(255,255,255,0.1)'

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

const wavePos = (r: number, c: number, t: number) => {
  const rw = 1.2 + 0.9 * Math.sin(t * 0.02)
  const cw = 1.0 - 0.5 * Math.cos(t * 0.017)
  const sine = 6 * Math.sin(r * 0.27 + t * 0.06) + 3 * Math.sin(r * 0.71 + c * 0.05 + t * 0.09)
  return ((r * rw + c * cw + sine) % DIAG_PERIOD + DIAG_PERIOD) % DIAG_PERIOD
}

// Second wave: steeper diagonal, different speed — interferes with wave 1
const wavePos2 = (r: number, c: number, t: number) => {
  const rw = 0.7 + 0.5 * Math.sin(t * 0.013 + 1.2)
  const cw = 1.5 - 0.4 * Math.cos(t * 0.019)
  const sine = 5 * Math.sin(r * 0.19 + c * 0.11 + t * 0.05) + 3 * Math.sin(r * 0.53 + t * 0.08)
  return ((r * rw + c * cw + sine) % DIAG_PERIOD + DIAG_PERIOD) % DIAG_PERIOD
}

// d = distance from wave leading edge within [0, DIAG_WIDTH)
const waveDist = (pos: number, phase: number) =>
  (pos - phase + DIAG_PERIOD) % DIAG_PERIOD

// cosine bell: 0 at edges, 1 at center — smooth natural glow
const waveAlpha = (d: number) =>
  d < DIAG_WIDTH ? 0.5 - 0.5 * Math.cos(Math.PI * d / DIAG_WIDTH) : 0

export function HeroCanvas({ profile }: { profile: ColorProfile }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const profileRef = useRef(profile)
  profileRef.current = profile  // sync on every render without restarting the effect

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
    // pre-allocated per-cell buffers — computed once in tick, read by both draw and scramble
    let a1buf = new Float32Array(0)
    let a2buf = new Float32Array(0)

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
          Array.from({ length: cols }, () => CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)])
        )
        const size = rows * cols
        a1buf = new Float32Array(size)
        a2buf = new Float32Array(size)
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, cssW, cssH)

      const frameLeft   = cssW * FRAME.left
      const frameTop    = cssH * FRAME.top
      const frameRight  = cssW * FRAME.right
      const frameBottom = cssH * FRAME.bottom

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
        runStr = ''
        runInFrame = null

        for (let c = 0; c < cols; c++) {
          const x = c * charSlot
          if (x > cssW) break

          const i = r * cols + c
          const a1 = a1buf[i]
          const a2 = a2buf[i]
          const alpha = a1 + a2 < 1 ? a1 + a2 : 1
          const inFrame = x >= frameLeft && x < frameRight && charMidY >= frameTop && charMidY < frameBottom

          if (alpha > 0) {
            flushRun(y)
            const { stops } = profileRef.current
            // wave1: full range; wave2: 65% toward end — distinct tone, interesting blend at intersections
            const [r1, g1, b1] = sampleProfile(a1, stops)
            const [r2, g2, b2] = sampleProfile(a2 * 0.65, stops)
            const blend = a2 / (a1 + a2)
            const cr = (r1 + (r2 - r1) * blend) | 0
            const cg = (g1 + (g2 - g1) * blend) | 0
            const cb = (b1 + (b2 - b1) * blend) | 0
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.round(alpha * 50) / 100})`
            ctx.fillText(row[c], x, y)
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

      const phase  = time % DIAG_PERIOD
      const phase2 = (time * WAVE2_SPEED_RATIO) % DIAG_PERIOD

      // Compute wave values once into typed buffers — reused by both draw and scramble
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          a1buf[i] = waveAlpha(waveDist(wavePos(r, c, time), phase))
          a2buf[i] = waveAlpha(waveDist(wavePos2(r, c, time), phase2))
        }
      }

      if (now - lastScramble >= SCRAMBLE_MS) {
        lastScramble = now
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c
            if (a1buf[i] + a2buf[i] > 0) {
              grid[r][c] = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
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

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      io.disconnect()
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
