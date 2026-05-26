"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";

type Axis = "v" | "h";
type Line = { axis: Axis; pos: number };
type Segment = {
  axis: Axis;
  pos: number; // line position, normalized 0..1
  start: number; // perpendicular start, normalized 0..1
  end: number; // perpendicular end, normalized 0..1
};
type Snapshot = {
  visible: boolean;
  lines: Line[];
  color: string;
  selectMode: boolean;
  selected: string[]; // segment keys
  viewport: { w: number; h: number };
};

// Bump or namespace this per project if multiple apps share an origin.
const STORAGE_KEY = "portfolio/grid-overlay/v1";
const COLUMN_COUNT = 20;
const DEDUPE_EPSILON = 0.001;

// Solid mid-grey reads against both light and dark backgrounds. The toolbar
// colour picker lets the user override per project at runtime.
const DEFAULT_COLOR = "#808080";

// Accent colour for selected segments and select-mode UI. High contrast
// against most user-chosen grid colours.
const SELECTION_COLOR = "#22ddff";
const SELECTION_STRIPE_PX = 3;
const HIT_ZONE_PX = 14;

// ─── Store ────────────────────────────────────────────────────────────────
// Module-scoped state so the snapshot returned to `useSyncExternalStore`
// keeps a stable reference until something actually changes.

const SERVER_SNAPSHOT: Snapshot = {
  visible: false,
  lines: [],
  color: DEFAULT_COLOR,
  selectMode: false,
  selected: [],
  viewport: { w: 0, h: 0 },
};

let snapshot: Snapshot = SERVER_SNAPSHOT;
let hydrated = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const l of listeners) l();
}

type StoredState = Partial<
  Pick<Snapshot, "visible" | "lines" | "color" | "selectMode" | "selected">
>;

function loadFromStorage(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function persist(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      visible: snapshot.visible,
      lines: snapshot.lines,
      color: snapshot.color,
      selectMode: snapshot.selectMode,
      selected: snapshot.selected,
    }),
  );
}

// Fibonacci step widths in base-cell units, applied to both axes from the
// top-left. Cumulative sums place dividing lines at 1, 2, 4, 7, 12, 20, 33,
// 54 cells; any step that falls past the viewport edge is dropped.
const FIB_STEPS = [1, 1, 2, 3, 5, 8, 13, 21] as const;

function defaultLines(w: number, h: number): Line[] {
  const pitch = w / COLUMN_COUNT;
  const out: Line[] = [];

  let cumX = 0;
  for (const step of FIB_STEPS) {
    cumX += step;
    if (cumX >= COLUMN_COUNT) break;
    out.push({ axis: "v", pos: cumX / COLUMN_COUNT });
  }

  if (pitch > 0) {
    const heightInCells = h / pitch;
    let cumY = 0;
    for (const step of FIB_STEPS) {
      cumY += step;
      if (cumY >= heightInCells) break;
      out.push({ axis: "h", pos: (cumY * pitch) / h });
    }
  }
  return out;
}

function ensureHydrated(): void {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const stored = loadFromStorage();
  snapshot = {
    visible: stored?.visible ?? false,
    lines: stored?.lines ?? defaultLines(w, h),
    color: stored?.color ?? DEFAULT_COLOR,
    selectMode: stored?.selectMode ?? false,
    selected: stored?.selected ?? [],
    viewport: { w, h },
  };
  window.addEventListener("resize", () => {
    snapshot = {
      ...snapshot,
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
    notify();
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Snapshot {
  ensureHydrated();
  return snapshot;
}

function getServerSnapshot(): Snapshot {
  return SERVER_SNAPSHOT;
}

function setVisible(visible: boolean): void {
  snapshot = { ...snapshot, visible };
  persist();
  notify();
}

function setColor(color: string): void {
  snapshot = { ...snapshot, color };
  persist();
  notify();
}

function setSelectMode(selectMode: boolean): void {
  snapshot = { ...snapshot, selectMode };
  persist();
  notify();
}

function toggleSegment(key: string): void {
  const next = snapshot.selected.includes(key)
    ? snapshot.selected.filter((k) => k !== key)
    : [...snapshot.selected, key];
  snapshot = { ...snapshot, selected: next };
  persist();
  notify();
}

// Shift-click affordance: toggle every segment on the same line at once.
// "All selected → clear; otherwise add the missing ones." Saves clicking
// each segment of a full row/column individually.
function toggleLine(axis: Axis, pos: number): void {
  const lineKeys = computeSegments(snapshot.lines)
    .filter(
      (s) => s.axis === axis && Math.abs(s.pos - pos) < DEDUPE_EPSILON,
    )
    .map(segmentKey);
  if (lineKeys.length === 0) return;
  const sel = new Set(snapshot.selected);
  const allSelected = lineKeys.every((k) => sel.has(k));
  if (allSelected) {
    for (const k of lineKeys) sel.delete(k);
  } else {
    for (const k of lineKeys) sel.add(k);
  }
  snapshot = { ...snapshot, selected: Array.from(sel) };
  persist();
  notify();
}

function clearSelection(): void {
  snapshot = { ...snapshot, selected: [] };
  persist();
  notify();
}

// Mutating actions clear the selection — segment keys would otherwise point
// at lines that no longer exist after the change.
function resetLines(): void {
  const { w, h } = snapshot.viewport;
  snapshot = {
    ...snapshot,
    lines: defaultLines(w, h),
    selected: [],
  };
  persist();
  notify();
}

// Mirror every line to the opposite side of its axis (V@p → V@1-p,
// H@q → H@1-q). Doing both axes at once produces 4-fold symmetry: a
// pattern anchored to the top-left also appears at the other three corners.
function duplicateGrid(): void {
  const seen = new Set(
    snapshot.lines.map((l) => `${l.axis}:${l.pos.toFixed(4)}`),
  );
  const mirrored: Line[] = [];
  for (const line of snapshot.lines) {
    const mirrorPos = 1 - line.pos;
    if (Math.abs(mirrorPos - line.pos) < DEDUPE_EPSILON) continue;
    const key = `${line.axis}:${mirrorPos.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    mirrored.push({ axis: line.axis, pos: mirrorPos });
  }
  snapshot = {
    ...snapshot,
    lines: [...snapshot.lines, ...mirrored],
    selected: [],
  };
  persist();
  notify();
}

// Rotate the layout 90° clockwise in normalized viewport coordinates:
// V@p becomes H@p, and H@q becomes V@(1-q). Four applications are identity.
function rotateGrid(): void {
  const rotated: Line[] = snapshot.lines.map((line) =>
    line.axis === "v"
      ? { axis: "h", pos: line.pos }
      : { axis: "v", pos: 1 - line.pos },
  );
  snapshot = { ...snapshot, lines: rotated, selected: [] };
  persist();
  notify();
}

// ─── Segment derivation ───────────────────────────────────────────────────
// Each line is split into segments by its perpendicular crossings (plus the
// two viewport edges). A segment is the unit of selection.

function uniqSorted(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b);
  const out: number[] = [];
  for (const n of sorted) {
    if (out.length === 0 || Math.abs(out[out.length - 1] - n) > DEDUPE_EPSILON) {
      out.push(n);
    }
  }
  return out;
}

function segmentKey(s: Segment): string {
  return `${s.axis}:${s.pos.toFixed(4)}:${s.start.toFixed(4)}:${s.end.toFixed(4)}`;
}

function computeSegments(lines: Line[]): Segment[] {
  const vPos = uniqSorted(lines.filter((l) => l.axis === "v").map((l) => l.pos));
  const hPos = uniqSorted(lines.filter((l) => l.axis === "h").map((l) => l.pos));
  const segs: Segment[] = [];

  for (const p of vPos) {
    const cuts = [0, ...hPos, 1];
    for (let i = 0; i < cuts.length - 1; i++) {
      segs.push({ axis: "v", pos: p, start: cuts[i], end: cuts[i + 1] });
    }
  }
  for (const p of hPos) {
    const cuts = [0, ...vPos, 1];
    for (let i = 0; i < cuts.length - 1; i++) {
      segs.push({ axis: "h", pos: p, start: cuts[i], end: cuts[i + 1] });
    }
  }
  return segs;
}

// ─── Clipboard format ─────────────────────────────────────────────────────
// Produces a human-and-LLM-readable summary that names line ordinals using
// `col-N` / `row-N` and viewport edges as `top` / `bottom` / `left` / `right`.

function formatSelection(snap: Snapshot): string {
  const { selected, lines, viewport } = snap;
  const vSorted = uniqSorted(
    lines.filter((l) => l.axis === "v").map((l) => l.pos),
  );
  const hSorted = uniqSorted(
    lines.filter((l) => l.axis === "h").map((l) => l.pos),
  );

  function colName(pos: number): string {
    if (pos <= DEDUPE_EPSILON) return "left";
    if (pos >= 1 - DEDUPE_EPSILON) return "right";
    const idx = vSorted.findIndex((p) => Math.abs(p - pos) < DEDUPE_EPSILON);
    if (idx >= 0) return `col-${idx + 1}`;
    return `x=${(pos * 100).toFixed(1)}%`;
  }
  function rowName(pos: number): string {
    if (pos <= DEDUPE_EPSILON) return "top";
    if (pos >= 1 - DEDUPE_EPSILON) return "bottom";
    const idx = hSorted.findIndex((p) => Math.abs(p - pos) < DEDUPE_EPSILON);
    if (idx >= 0) return `row-${idx + 1}`;
    return `y=${(pos * 100).toFixed(1)}%`;
  }

  // Parse selection keys back into segments.
  const segs: Segment[] = [];
  for (const key of selected) {
    const [axis, posStr, startStr, endStr] = key.split(":");
    segs.push({
      axis: axis as Axis,
      pos: parseFloat(posStr),
      start: parseFloat(startStr),
      end: parseFloat(endStr),
    });
  }

  // Group segments by line (same axis+pos) and merge contiguous runs into
  // spans. Reduces noise: 11 individual `col-N → col-N+1` segments become
  // one `left → right [full width, 11 segs]` span.
  type Span = {
    axis: Axis;
    pos: number;
    start: number;
    end: number;
    segCount: number;
  };
  const byLine = new Map<string, Segment[]>();
  for (const s of segs) {
    const k = `${s.axis}:${s.pos.toFixed(4)}`;
    const list = byLine.get(k);
    if (list) list.push(s);
    else byLine.set(k, [s]);
  }
  const spans: Span[] = [];
  for (const list of byLine.values()) {
    list.sort((a, b) => a.start - b.start);
    let cur: Span | null = null;
    for (const s of list) {
      if (cur && Math.abs(cur.end - s.start) < DEDUPE_EPSILON) {
        cur.end = s.end;
        cur.segCount++;
      } else {
        if (cur) spans.push(cur);
        cur = {
          axis: s.axis,
          pos: s.pos,
          start: s.start,
          end: s.end,
          segCount: 1,
        };
      }
    }
    if (cur) spans.push(cur);
  }

  // Stable, scannable order: V before H, then by line position, then by start.
  spans.sort((a, b) => {
    if (a.axis !== b.axis) return a.axis === "v" ? -1 : 1;
    if (Math.abs(a.pos - b.pos) > DEDUPE_EPSILON) return a.pos - b.pos;
    return a.start - b.start;
  });

  const header =
    selected.length === spans.length
      ? `Fibonacci grid selection (${spans.length}) @ viewport ${viewport.w}×${viewport.h}:`
      : `Fibonacci grid selection (${selected.length} segments → ${spans.length} spans) @ viewport ${viewport.w}×${viewport.h}:`;
  const out: string[] = [header];

  // Band detection: exactly two parallel lines selected = the user is pointing
  // at the space between them. Emit a one-line summary with both edges'
  // distances so the reader doesn't have to flip percentages or subtract.
  const uniqLinePositions = uniqSorted(spans.map((s) => s.pos));
  const uniqAxes = new Set(spans.map((s) => s.axis));
  const isBand =
    spans.length >= 2 && uniqAxes.size === 1 && uniqLinePositions.length === 2;
  if (isBand) {
    const axis = spans[0].axis;
    const [p1, p2] = uniqLinePositions;
    if (axis === "h") {
      const y1 = Math.round(p1 * viewport.h);
      const y2 = Math.round(p2 * viewport.h);
      out.push(
        `BAND: H, y=${y1}→${y2}px (height ${y2 - y1}px; top-edge ${y1}px from top / ${viewport.h - y1}px from bottom; bottom-edge ${y2}px from top / ${viewport.h - y2}px from bottom)`,
      );
    } else {
      const x1 = Math.round(p1 * viewport.w);
      const x2 = Math.round(p2 * viewport.w);
      out.push(
        `BAND: V, x=${x1}→${x2}px (width ${x2 - x1}px; left-edge ${x1}px from left / ${viewport.w - x1}px from right; right-edge ${x2}px from left / ${viewport.w - x2}px from right)`,
      );
    }
  }

  for (const span of spans) {
    const { axis, pos, start, end, segCount } = span;
    const isFull = start <= DEDUPE_EPSILON && end >= 1 - DEDUPE_EPSILON;
    const fullLabel = axis === "v" ? "full height" : "full width";
    const tag = isFull
      ? ` [${fullLabel}, ${segCount} seg${segCount === 1 ? "" : "s"}]`
      : segCount > 1
        ? ` [${segCount} segs]`
        : "";
    if (axis === "v") {
      const xPx = Math.round(pos * viewport.w);
      const xRem = viewport.w - xPx;
      out.push(
        `• V ${colName(pos)} (x=${(pos * 100).toFixed(1)}%, ${xPx}px from left / ${xRem}px from right) | ${rowName(start)} → ${rowName(end)}${tag}`,
      );
    } else {
      const yPx = Math.round(pos * viewport.h);
      const yRem = viewport.h - yPx;
      out.push(
        `• H ${rowName(pos)} (y=${(pos * 100).toFixed(1)}%, ${yPx}px from top / ${yRem}px from bottom) | ${colName(start)} → ${colName(end)}${tag}`,
      );
    }
  }
  return out.join("\n");
}

// ─── Component ────────────────────────────────────────────────────────────

// Self-contained styling so the overlay works in any project regardless of
// design-token availability. Override line colour at runtime via the picker.
const TOOLBAR_STYLE: CSSProperties = {
  pointerEvents: "auto",
  background: "rgba(20,20,20,0.85)",
  border: "1px solid rgba(255,255,255,0.15)",
  backdropFilter: "blur(6px)",
  color: "rgba(255,255,255,0.85)",
};

const BTN_CLASS = "px-2 py-1 rounded hover:bg-white/10";
const BTN_MUTED_CLASS =
  "px-2 py-1 rounded text-white/60 hover:bg-white/10 hover:text-white/85";
const BTN_ACTIVE_CLASS = "px-2 py-1 rounded bg-cyan-400/25 text-cyan-100";

export function GridOverlay(): React.ReactNode {
  const { visible, lines, color, selectMode, selected, viewport } =
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const segments = useMemo(() => computeSegments(lines), [lines]);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // `z` toggles the grid, `x` toggles the toolbar. Both ignore modifiers
  // and typing contexts so they don't fight with form inputs.
  useEffect(() => {
    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
    }
    function onKey(e: KeyboardEvent): void {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (isTypingTarget(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        setVisible(!snapshot.visible);
      } else if (key === "x") {
        setToolbarHidden((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleCopy(): Promise<void> {
    const text = formatSelection(snapshot);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch (err) {
      console.error("GridOverlay: clipboard write failed", err);
      setCopyStatus("error");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1500);
  }

  const ready = viewport.w > 0 && viewport.h > 0;
  const copyLabel =
    copyStatus === "copied"
      ? "Copied!"
      : copyStatus === "error"
        ? "Copy failed"
        : `Copy ${selected.length}`;

  return (
    <>
      {visible && ready && (
        <div
          className="fixed inset-0 z-[9998]"
          style={{ pointerEvents: "none" }}
        >
          {lines.map((line, i) => (
            <LineEl
              key={`line-${line.axis}-${i}-${line.pos.toFixed(4)}`}
              line={line}
              color={color}
            />
          ))}
          {segments.map((seg) => {
            const key = segmentKey(seg);
            if (!selectedSet.has(key)) return null;
            return <SelectionStripe key={`sel-${key}`} segment={seg} />;
          })}
          {selectMode &&
            segments.map((seg) => {
              const key = segmentKey(seg);
              return (
                <HitZone
                  key={`hit-${key}`}
                  segment={seg}
                  isSelected={selectedSet.has(key)}
                  onToggle={(e) =>
                    e.shiftKey
                      ? toggleLine(seg.axis, seg.pos)
                      : toggleSegment(key)
                  }
                />
              );
            })}
        </div>
      )}

      {!toolbarHidden && (
        <div
          className="fixed top-3 right-3 z-[9999] flex items-center gap-1 rounded-md px-1.5 py-1 text-xs select-none"
          style={TOOLBAR_STYLE}
        >
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className={BTN_CLASS}
          >
            {visible ? "Grid on" : "Grid off"}
          </button>
          {visible && (
            <>
              <ColorSwatch color={color} onChange={setColor} />
              <button
                type="button"
                onClick={() => setSelectMode(!selectMode)}
                className={selectMode ? BTN_ACTIVE_CLASS : BTN_CLASS}
                title="Click a segment to toggle it. Shift-click to toggle the whole line."
              >
                {selectMode ? "Select on" : "Select"}
              </button>
              {selectMode && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={selected.length === 0}
                    className={`${BTN_CLASS} disabled:opacity-40 disabled:hover:bg-transparent`}
                  >
                    {copyLabel}
                  </button>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className={BTN_MUTED_CLASS}
                    >
                      Clear
                    </button>
                  )}
                </>
              )}
              <button type="button" onClick={duplicateGrid} className={BTN_CLASS}>
                Duplicate
              </button>
              <button type="button" onClick={rotateGrid} className={BTN_CLASS}>
                Rotate
              </button>
              <button
                type="button"
                onClick={resetLines}
                className={BTN_MUTED_CLASS}
              >
                Reset
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function ColorSwatch({
  color,
  onChange,
}: {
  color: string;
  onChange: (next: string) => void;
}): React.ReactNode {
  return (
    <label
      title="Grid colour"
      className="relative inline-block w-5 h-5 rounded cursor-pointer ring-1 ring-white/20 hover:ring-white/50"
      style={{ background: color }}
    >
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Grid colour"
      />
    </label>
  );
}

function LineEl({
  line,
  color,
}: {
  line: Line;
  color: string;
}): React.ReactNode {
  const style: CSSProperties =
    line.axis === "v"
      ? {
          position: "absolute",
          left: `${line.pos * 100}%`,
          top: 0,
          bottom: 0,
          width: 1,
          background: color,
        }
      : {
          position: "absolute",
          top: `${line.pos * 100}%`,
          left: 0,
          right: 0,
          height: 1,
          background: color,
        };
  return <div style={style} />;
}

function SelectionStripe({ segment }: { segment: Segment }): React.ReactNode {
  const half = SELECTION_STRIPE_PX / 2;
  const style: CSSProperties =
    segment.axis === "v"
      ? {
          position: "absolute",
          left: `${segment.pos * 100}%`,
          top: `${segment.start * 100}%`,
          height: `${(segment.end - segment.start) * 100}%`,
          width: SELECTION_STRIPE_PX,
          marginLeft: -half,
          background: SELECTION_COLOR,
          opacity: 0.85,
          pointerEvents: "none",
        }
      : {
          position: "absolute",
          top: `${segment.pos * 100}%`,
          left: `${segment.start * 100}%`,
          width: `${(segment.end - segment.start) * 100}%`,
          height: SELECTION_STRIPE_PX,
          marginTop: -half,
          background: SELECTION_COLOR,
          opacity: 0.85,
          pointerEvents: "none",
        };
  return <div style={style} />;
}

function HitZone({
  segment,
  isSelected,
  onToggle,
}: {
  segment: Segment;
  isSelected: boolean;
  onToggle: (e: { shiftKey: boolean }) => void;
}): React.ReactNode {
  const hitHalf = HIT_ZONE_PX / 2;
  const stripeHalf = SELECTION_STRIPE_PX / 2;
  const hitStyle: CSSProperties =
    segment.axis === "v"
      ? {
          position: "absolute",
          left: `${segment.pos * 100}%`,
          top: `${segment.start * 100}%`,
          height: `${(segment.end - segment.start) * 100}%`,
          width: HIT_ZONE_PX,
          marginLeft: -hitHalf,
          pointerEvents: "auto",
          cursor: "pointer",
        }
      : {
          position: "absolute",
          top: `${segment.pos * 100}%`,
          left: `${segment.start * 100}%`,
          width: `${(segment.end - segment.start) * 100}%`,
          height: HIT_ZONE_PX,
          marginTop: -hitHalf,
          pointerEvents: "auto",
          cursor: "pointer",
        };

  // Hover highlight sits on the line itself (centered inside the hit zone),
  // transparent by default and lit by the parent's :hover via group-hover.
  // Independent of SelectionStripe so it works on both selected and unselected
  // segments.
  const highlightStyle: CSSProperties =
    segment.axis === "v"
      ? {
          position: "absolute",
          left: hitHalf - stripeHalf,
          top: 0,
          bottom: 0,
          width: SELECTION_STRIPE_PX,
          background: SELECTION_COLOR,
          pointerEvents: "none",
        }
      : {
          position: "absolute",
          top: hitHalf - stripeHalf,
          left: 0,
          right: 0,
          height: SELECTION_STRIPE_PX,
          background: SELECTION_COLOR,
          pointerEvents: "none",
        };

  return (
    <div
      style={hitStyle}
      onClick={(e) => onToggle({ shiftKey: e.shiftKey })}
      className="group"
      role="button"
      aria-pressed={isSelected}
      aria-label={`${segment.axis === "v" ? "Vertical" : "Horizontal"} segment`}
    >
      <div
        style={highlightStyle}
        className="opacity-0 group-hover:opacity-60 transition-opacity duration-100"
      />
    </div>
  );
}
