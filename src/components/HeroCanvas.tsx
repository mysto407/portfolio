import { useEffect, useRef } from 'react'

const CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩ+-=*/\\|<>[]{}@#!~"
const DIAG_PERIOD = 24
const DIAG_WIDTH = 8
const FONT_SIZE = 13
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.6)
const TICK_MS = 100
const FONT = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`

// Matches FRAME_RECT in VibratingBorder.tsx — frame interior has a white background (GlassFrame),
// so inactive chars need dark color there, light color on the black body outside.
const FRAME = { left: 0.05, top: 0.08, right: 0.95, bottom: 0.92 }
const INACTIVE_INSIDE  = 'rgba(0,0,0,0.1)'
const INACTIVE_OUTSIDE = 'rgba(255,255,255,0.1)'

const wavePos = (r: number, c: number, t: number) => {
  const rw = 1.2 + 0.9 * Math.sin(t * 0.02)
  const cw = 1.0 - 0.5 * Math.cos(t * 0.017)
  const sine = Math.round(6 * Math.sin(r * 0.27 + t * 0.06) + 3 * Math.sin(r * 0.71 + c * 0.05 + t * 0.09))
  return ((Math.round(r * rw + c * cw) + sine) % DIAG_PERIOD + DIAG_PERIOD) % DIAG_PERIOD
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let grid: string[][] = []
    let cols = 0
    let rows = 0
    let charSlot = 0
    let dpr = 1
    let time = 0
    let phase = 0
    let rafId = 0
    let lastTick = 0
    let visible = true

    const setup = () => {
      dpr = window.devicePixelRatio || 1
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.font = FONT
      charSlot = ctx.measureText('A ').width

      const newCols = Math.ceil(cssW / charSlot) + 2
      const newRows = Math.ceil(cssH / LINE_HEIGHT) + 2

      if (newCols !== cols || newRows !== rows) {
        cols = newCols
        rows = newRows
        grid = Array.from({ length: rows }, () =>
          Array.from({ length: cols }, () => CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)])
        )
      }
    }

    const draw = () => {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      ctx.clearRect(0, 0, cssW, cssH)
      ctx.font = FONT

      const frameLeft   = cssW * FRAME.left
      const frameTop    = cssH * FRAME.top
      const frameRight  = cssW * FRAME.right
      const frameBottom = cssH * FRAME.bottom

      for (let r = 0; r < rows; r++) {
        const y = r * LINE_HEIGHT + FONT_SIZE
        if (y - LINE_HEIGHT > cssH) break

        const charMidY = y - FONT_SIZE / 2
        const row = grid[r]

        // Batch inactive chars, flushing when the inside/outside region changes
        let runStr = ''
        let runX = 0
        let runInFrame: boolean | null = null

        const flushRun = () => {
          if (!runStr) return
          ctx.fillStyle = runInFrame ? INACTIVE_INSIDE : INACTIVE_OUTSIDE
          ctx.fillText(runStr, runX, y)
          runStr = ''
          runInFrame = null
        }

        for (let c = 0; c < cols; c++) {
          const x = c * charSlot
          if (x > cssW) break

          const piece = row[c] + (c < cols - 1 ? ' ' : '')
          const active = (wavePos(r, c, time) - phase + DIAG_PERIOD) % DIAG_PERIOD < DIAG_WIDTH
          const inFrame = x >= frameLeft && x < frameRight && charMidY >= frameTop && charMidY < frameBottom

          if (active) {
            flushRun()
            const hue = (c * 4 + r * 9 + time * 7) % 360
            ctx.fillStyle = `hsla(${hue}deg,85%,65%,0.4)`
            ctx.fillText(piece, x, y)
          } else {
            if (inFrame !== runInFrame && runStr) flushRun()
            if (!runStr) { runX = x; runInFrame = inFrame }
            runStr += piece
          }
        }

        flushRun()
      }
    }

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)
      if (!visible || now - lastTick < TICK_MS) return
      lastTick = now

      time++
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((wavePos(r, c, time) - phase + DIAG_PERIOD) % DIAG_PERIOD < DIAG_WIDTH) {
            grid[r][c] = CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)]
          }
        }
      }
      phase = (phase + 1) % DIAG_PERIOD
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
