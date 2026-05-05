# Portfolio — Claude Context

## Stack
Vite + React + TypeScript + Tailwind CSS. No Next.js — this is a static SPA.

## Architecture

### Key components
- `GlassFrame` — fixed glass overlay using `mix-blend-mode: difference`. Never modify existing layers.
- `VibratingBorder` — SVG path that vibrates on scroll. Sits at `zIndex: 32` above the frame.
- `VibratingGlassCard` — pill buttons with the same vibration effect. Used for logo, nav, quote CTA.
- `TechStackBeam` — animated beams to center icon, rendered only after mount.

### Data
- `src/data/projects.ts` — project list. Add projects here.

## Performance Rules

### RAF animation loops
- **Skip path rebuild when `amplitude < IDLE_THRESHOLD` (0.05)** — the RAF still runs but does nothing expensive at rest. This is the most important optimization.
- **Never call `getBoundingClientRect()` inside a RAF callback.** Cache dimensions with `ResizeObserver` and update the cached value only on resize.
- **Never read `window.innerWidth/Height` inside a RAF callback.** Same — cache on resize.
- **Combine paired path builds into one loop.** `buildPaths()` computes main + glow in a single perimeter traversal.
- Use tuple returns `[x, y, nx, ny]` from geometry samplers — avoids per-sample object allocation.
- Use direct string concatenation in path builders, not `array.push` + `.join`.

### React
- **Module-level constants for static data** — `SECTION_TITLES`, `FRAME`, etc. must not live inside components (recreated every render).
- **No duplicate `useEffect` hooks** — consolidate mount + resize into one effect.
- **`useScrollVelocity` is shared via a ref** — it does not cause re-renders, safe to call in multiple components.

### SVG filters
- The glow blur (`feGaussianBlur`) is expensive. Keep `stdDeviation` ≤ 10 for the main frame, ≤ 6 for cards.
- Each `VibratingGlassCard` instance needs a **unique filter ID** (`useId`). Shared IDs cause filter bleed across elements.

## Vibration Tuning

| Constant | Location | Effect |
|---|---|---|
| `MAX_AMPLITUDE` | VibratingBorder.tsx | Max px displacement of frame border |
| `FREQUENCY` | VibratingBorder.tsx | Sine wave cycles per perimeter |
| `SEGMENTS` | VibratingBorder.tsx | Path resolution (more = smoother, slower) |
| `CARD_MAX_AMPLITUDE` | VibratingBorder.tsx | Max displacement for pill buttons |
| `CARD_FREQUENCY` | VibratingBorder.tsx | Cycles per pill perimeter |
| `INSET` | VibratingBorder.tsx | Glow path offset inward from main path |

## Do Not
- Modify existing layers inside `GlassFrame()` — they are carefully balanced.
- Call `getBoundingClientRect()` in RAF loops.
- Add state updates inside scroll handlers (use refs).
- Add `console.log` to RAF callbacks.
