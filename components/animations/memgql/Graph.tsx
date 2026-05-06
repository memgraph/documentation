"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type GraphHandle = {
  addNodeFromViewport: (client: { x: number; y: number }) => void;
  /**
   * Spawn an orange seed and cascade. Each call gets its own list of painted
   * node IDs so multiple cascades can run in parallel without colliding.
   * Returns the painted IDs (in order) and the spotlight (last) ID.
   */
  paintOrangeFromViewport: (client: { x: number; y: number }) => Promise<{
    nodeIds: number[];
    spotlightId: number | null;
  }>;
  /**
   * Eject a specific node toward `viewportTarget` and reset all `otherIdsToClear`
   * back to idle. Used after `paintOrangeFromViewport` so each cascade ejects
   * its own spotlight without affecting concurrent cascades.
   */
  ejectNodeAndClear: (
    nodeId: number,
    otherIdsToClear: number[],
    viewportTarget: { x: number; y: number }
  ) => Promise<void>;
};

type Props = {
  onCountChange?: (count: number) => void;
};

// ---- Tunables -------------------------------------------------------------

const NODE_RADIUS = 3;
const ORANGE_NODE_RADIUS = 4.5;
const PADDING = 28;
const NEIGHBOR_EDGE_COUNT = 6;

// --- Population control ---
// Steady-state population ≈ MAX_AGE_MS / ingestion-interval. The ingestion
// interval lives in PathOverlay (1250ms). Change TARGET_POPULATION here to
// pick how many nodes the graph holds at equilibrium.
const INGESTION_INTERVAL_MS = 1250;
const TARGET_POPULATION = 64;
const HARD_CAP = TARGET_POPULATION + 16;
const INITIAL_NODES = TARGET_POPULATION;

const ENTRY_SPEED_PX_PER_MS = 0.055;
const MIN_ENTRY_DURATION_MS = 1200;
const MAX_ENTRY_DURATION_MS = 7000;
const DEATH_WINDOW_MS = 1400;

const DRIFT_FREQ = 0.00035;
const DRIFT_AMPLITUDE = 18;

// MAX_AGE is derived from population: at the ingestion rate, this is how
// long each node lives at equilibrium.
const MAX_AGE_MS = TARGET_POPULATION * INGESTION_INTERVAL_MS;
// Last stage stays a visible mid-gray; fade-to-invisible is handled by
// opacity in the DEATH_WINDOW so nodes don't merge into the bg color.
const AGE_STAGES: { until: number; color: string }[] = [
  { until: MAX_AGE_MS * 0.25, color: "#bab8bb" },
  { until: MAX_AGE_MS * 0.55, color: "#646265" },
  { until: MAX_AGE_MS * 0.85, color: "#4B4445" },
  { until: MAX_AGE_MS, color: "#3A3536" },
];

const CLUSTER_BIAS = 0.7;
const CLUSTER_JITTER = 120;

// Scene 3 cascade
const CASCADE_MAX_NODES = 4;
const CASCADE_STEP_MS = 750;
// Per-node orange fade-in / fade-out time (ms for full 0↔1 transition).
const ORANGE_FADE_IN_MS = 650;
const ORANGE_FADE_OUT_MS = 1200;

// Scene 4 eject — accelerates out of the graph to match the answer-dot handoff.
const EJECT_DURATION_MS = 450;
const ORPHAN_EDGE_FADE_MS = 700;

const COLOR_ORANGE: [number, number, number] = [251, 110, 0];
const ORANGE_GLOW = "drop-shadow(0 0 6px rgba(251,110,0,0.9))";

// Edge styling. Set EDGE_IDLE_COLOR to null to fall back to per-endpoint age color.
const EDGE_IDLE_COLOR: string | null = "#4B4445";
const EDGE_IDLE_WIDTH = 1;
const EDGE_IDLE_OPACITY = 0.35;
const EDGE_ORANGE_WIDTH = 1;
const EDGE_ORANGE_OPACITY = 0.8;

// ---- Types ---------------------------------------------------------------

type EjectAnim = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startedAt: number;
  durationMs: number;
  onDone: () => void;
  settled: boolean;
};

type Node = {
  id: number;
  entryX: number;
  entryY: number;
  targetX: number;
  targetY: number;
  entryDurationMs: number;
  phaseX: number;
  phaseY: number;
  /** Per-node size multiplier so the graph has visual variety. */
  radiusFactor: number;
  age: number;
  /** Target orange-ness (0 = idle, 1 = fully orange). Lerped toward by `orangeAmount`. */
  orangeTarget: number;
  orangeAmount: number;
  /** True for the last node in the cascade (slightly brighter). */
  isSpotlight: boolean;
  ejectAnim: EjectAnim | null;
};

type Edge = { from: number; to: number };

type OrphanEdge = {
  id: number;
  // Fixed ghost endpoint (where the ejected node was when it left).
  ghostX: number;
  ghostY: number;
  // Still-alive endpoint — position read from the current render map.
  otherId: number;
  startedAt: number;
  // Color at time of orphaning (so it doesn't suddenly change).
  baseColor: string;
};

// ---- Helpers -------------------------------------------------------------

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const easeInCubic = (t: number) => t * t * t;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToCss(rgb: [number, number, number]): string {
  return `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(
    rgb[2]
  )})`;
}

function blendRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/** Continuously interpolated age color so gray transitions are smooth like the orange one. */
function ageColorRgb(age: number): [number, number, number] {
  if (age <= AGE_STAGES[0].until) return hexToRgb(AGE_STAGES[0].color);
  for (let i = 1; i < AGE_STAGES.length; i++) {
    if (age < AGE_STAGES[i].until) {
      const prev = AGE_STAGES[i - 1];
      const cur = AGE_STAGES[i];
      const t = clamp((age - prev.until) / (cur.until - prev.until), 0, 1);
      return blendRgb(hexToRgb(prev.color), hexToRgb(cur.color), t);
    }
  }
  return hexToRgb(AGE_STAGES[AGE_STAGES.length - 1].color);
}

// ---- Component -----------------------------------------------------------

const EDGE_IDLE_RGB = EDGE_IDLE_COLOR ? hexToRgb(EDGE_IDLE_COLOR) : null;

const Graph = forwardRef<GraphHandle, Props>(({ onCountChange }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const orphanEdgesRef = useRef<OrphanEdge[]>([]);
  const orphanIdRef = useRef(0);
  const nextIdRef = useRef(0);
  const seededRef = useRef(false);
  const cascadeIdsRef = useRef<number[]>([]);
  const renderedPosRef = useRef<Map<number, { x: number; y: number }>>(
    new Map()
  );
  const [, setTick] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const onCountChangeRef = useRef(onCountChange);
  onCountChangeRef.current = onCountChange;
  const lastReportedCountRef = useRef(-1);

  const reportCount = () => {
    const n = nodesRef.current.length;
    if (n !== lastReportedCountRef.current) {
      lastReportedCountRef.current = n;
      onCountChangeRef.current?.(n);
    }
  };

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    // clientWidth/Height reflect the unscaled layout box, so they match the
    // SVG's own user-unit coordinate space even when an ancestor has a CSS
    // transform applied (e.g. scale-[0.65] on the wrapper).
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Convert a viewport (client) point to this SVG's local user-unit space. */
  const clientToLocal = (client: { x: number; y: number }) => {
    const el = svgRef.current;
    if (!el) return null;
    const ctm = el.getScreenCTM();
    if (!ctm) return null;
    const p = el.createSVGPoint();
    p.x = client.x;
    p.y = client.y;
    const local = p.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  };

  const spawnAt = (
    entryX: number,
    entryY: number,
    opts: {
      startAge?: number;
      edgeCount?: number;
      orangeTarget?: number;
    } = {}
  ): number => {
    const {
      startAge = 0,
      edgeCount = NEIGHBOR_EDGE_COUNT,
      orangeTarget = 0,
    } = opts;
    const { w, h } = sizeRef.current;
    if (!w || !h) return -1;

    let tx: number;
    let ty: number;
    const existing = nodesRef.current;
    if (existing.length > 0 && Math.random() < CLUSTER_BIAS) {
      const anchor = existing[Math.floor(Math.random() * existing.length)];
      tx = clamp(
        anchor.targetX + (Math.random() - 0.5) * CLUSTER_JITTER,
        PADDING,
        w - PADDING
      );
      ty = clamp(
        anchor.targetY + (Math.random() - 0.5) * CLUSTER_JITTER,
        PADDING,
        h - PADDING
      );
    } else {
      tx = PADDING + Math.random() * (w - PADDING * 2);
      ty = PADDING + Math.random() * (h - PADDING * 2);
    }

    const id = ++nextIdRef.current;
    const nearest = existing
      .map((n) => ({
        id: n.id,
        d: (n.targetX - tx) ** 2 + (n.targetY - ty) ** 2,
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, edgeCount);

    const dist = Math.hypot(tx - entryX, ty - entryY);
    const entryDurationMs = clamp(
      dist / ENTRY_SPEED_PX_PER_MS,
      MIN_ENTRY_DURATION_MS,
      MAX_ENTRY_DURATION_MS
    );

    nodesRef.current.push({
      id,
      entryX,
      entryY,
      targetX: tx,
      targetY: ty,
      entryDurationMs,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      radiusFactor: 0.8 + Math.random() * 0.6,
      age: startAge,
      orangeTarget,
      orangeAmount: 0,
      isSpotlight: false,
      ejectAnim: null,
    });
    for (const n of nearest) edgesRef.current.push({ from: id, to: n.id });
    return id;
  };

  useEffect(() => {
    if (seededRef.current) return;
    const { w, h } = size;
    if (!w || !h) return;
    seededRef.current = true;
    for (let i = 0; i < INITIAL_NODES; i++) {
      const ex = PADDING + Math.random() * (w - PADDING * 2);
      const ey = PADDING + Math.random() * (h - PADDING * 2);
      // Spread seeds across most of the lifespan so the initial graph already
      // shows a mix of fresh, mid-aged, and grey nodes (not all bright white).
      const startAge = Math.random() * MAX_AGE_MS * 0.8;
      spawnAt(ex, ey, { startAge });
      const n = nodesRef.current[nodesRef.current.length - 1];
      if (n) {
        n.entryX = n.targetX;
        n.entryY = n.targetY;
      }
    }
    reportCount();
    setTick((t) => t + 1);
  }, [size]);

  // --- Imperative handle implementations ---

  const addNodeFromViewport = useCallback(
    (client: { x: number; y: number }) => {
      const local = clientToLocal(client);
      if (!local) return;
      spawnAt(local.x, local.y);
      reportCount();
      setTick((t) => t + 1);
    },
    []
  );

  const paintOrangeFromViewport = useCallback(
    async (
      client: { x: number; y: number }
    ): Promise<{ nodeIds: number[]; spotlightId: number | null }> => {
      const local = clientToLocal(client);
      if (!local) return { nodeIds: [], spotlightId: null };
      const entryX = local.x;
      const entryY = local.y;

      // Local cascade — not stored on a shared ref, so concurrent calls can
      // each track their own painted nodes independently.
      const localIds: number[] = [];

      const seedId = spawnAt(entryX, entryY, {
        edgeCount: 1,
        orangeTarget: 1,
      });
      if (seedId < 0) return { nodeIds: [], spotlightId: null };
      const seed = nodesRef.current.find((n) => n.id === seedId);
      if (seed) seed.orangeAmount = 1;
      localIds.push(seedId);
      reportCount();
      setTick((t) => t + 1);

      const visited = new Set<number>([seedId]);
      const queue: number[] = [seedId];

      while (localIds.length < CASCADE_MAX_NODES && queue.length > 0) {
        const current = queue.shift()!;
        const neighbors: number[] = [];
        for (const e of edgesRef.current) {
          if (e.from === current && !visited.has(e.to)) neighbors.push(e.to);
          else if (e.to === current && !visited.has(e.from))
            neighbors.push(e.from);
        }
        for (const nid of neighbors) {
          if (localIds.length >= CASCADE_MAX_NODES) break;
          visited.add(nid);
          const target = nodesRef.current.find((n) => n.id === nid);
          if (!target) continue;
          // Skip nodes already claimed by another concurrent cascade so they
          // don't get reset prematurely when one cascade ejects.
          if (target.orangeTarget > 0) continue;
          await new Promise<void>((r) => setTimeout(r, CASCADE_STEP_MS));
          target.orangeTarget = 1;
          localIds.push(nid);
          queue.push(nid);
          setTick((t) => t + 1);
        }
      }

      const spotlightId = localIds[localIds.length - 1] ?? null;
      if (spotlightId !== null) {
        const lastNode = nodesRef.current.find((n) => n.id === spotlightId);
        if (lastNode) lastNode.isSpotlight = true;
        setTick((t) => t + 1);
      }
      return { nodeIds: localIds, spotlightId };
    },
    []
  );

  const ejectNodeAndClear = useCallback(
    (
      nodeId: number,
      otherIdsToClear: number[],
      client: { x: number; y: number }
    ) =>
      new Promise<void>((resolve) => {
        const local = clientToLocal(client);
        if (!local) return resolve();
        const localX = local.x;
        const localY = local.y;

        const node = nodesRef.current.find((n) => n.id === nodeId);

        // Fade the rest of this cascade's nodes back to idle right away so
        // the graph doesn't snap — they relax as the spotlight is sucked out.
        for (const nid of otherIdsToClear) {
          if (nid === nodeId) continue;
          const other = nodesRef.current.find((n) => n.id === nid);
          if (other) {
            other.orangeTarget = 0;
            other.isSpotlight = false;
          }
        }

        if (!node) return resolve();

        const pos = renderedPosRef.current.get(node.id);
        const fromX = pos?.x ?? node.targetX;
        const fromY = pos?.y ?? node.targetY;

        node.ejectAnim = {
          fromX,
          fromY,
          toX: localX,
          toY: localY,
          startedAt: performance.now(),
          durationMs: EJECT_DURATION_MS,
          onDone: () => {
            const exitX = localX;
            const exitY = localY;
            // Convert edges touching this node to fading orphans anchored at the exit point.
            const detached = edgesRef.current.filter(
              (e) => e.from === node.id || e.to === node.id
            );
            for (const e of detached) {
              const otherId = e.from === node.id ? e.to : e.from;
              const other = nodesRef.current.find((n) => n.id === otherId);
              if (!other) continue;
              orphanEdgesRef.current.push({
                id: ++orphanIdRef.current,
                ghostX: exitX,
                ghostY: exitY,
                otherId,
                startedAt: performance.now(),
                baseColor: rgbToCss(COLOR_ORANGE),
              });
            }
            nodesRef.current = nodesRef.current.filter(
              (n) => n.id !== node.id
            );
            const alive = new Set(nodesRef.current.map((n) => n.id));
            edgesRef.current = edgesRef.current.filter(
              (e) => alive.has(e.from) && alive.has(e.to)
            );
            reportCount();
            setTick((t) => t + 1);
            resolve();
          },
          settled: false,
        };
      }),
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      addNodeFromViewport,
      paintOrangeFromViewport,
      ejectNodeAndClear,
    }),
    [addNodeFromViewport, paintOrangeFromViewport, ejectNodeAndClear]
  );

  // ---- Animation loop ----
  useEffect(() => {
    let rafId: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      for (const n of nodesRef.current) {
        if (n.ejectAnim && !n.ejectAnim.settled) {
          const t = (now - n.ejectAnim.startedAt) / n.ejectAnim.durationMs;
          if (t >= 1) {
            n.ejectAnim.settled = true;
            n.ejectAnim.onDone();
          }
        }

        // Smoothly lerp orangeAmount toward orangeTarget.
        if (n.orangeAmount !== n.orangeTarget) {
          const dir = Math.sign(n.orangeTarget - n.orangeAmount);
          const speed = dir > 0 ? 1 / ORANGE_FADE_IN_MS : 1 / ORANGE_FADE_OUT_MS;
          n.orangeAmount = clamp(
            n.orangeAmount + dir * speed * dt,
            0,
            1
          );
          if (n.orangeAmount === 0) n.isSpotlight = false;
        }

        n.age += dt;
      }

      let removed = false;
      const kept: Node[] = [];
      for (const n of nodesRef.current) {
        // Orange nodes (or those mid-fade-out) stick around past MAX_AGE.
        const keepAlive = n.orangeAmount > 0.05;
        if (n.age > MAX_AGE_MS && !keepAlive) {
          removed = true;
          continue;
        }
        kept.push(n);
      }
      if (kept.length !== nodesRef.current.length) nodesRef.current = kept;

      while (nodesRef.current.length > HARD_CAP) {
        nodesRef.current.shift();
        removed = true;
      }

      if (removed) {
        const alive = new Set(nodesRef.current.map((n) => n.id));
        edgesRef.current = edgesRef.current.filter(
          (e) => alive.has(e.from) && alive.has(e.to)
        );
        reportCount();
      }

      // Expire fully-faded orphan edges.
      if (orphanEdgesRef.current.length > 0) {
        orphanEdgesRef.current = orphanEdgesRef.current.filter(
          (o) => now - o.startedAt < ORPHAN_EDGE_FADE_MS
        );
      }

      setTick((t) => t + 1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ---- Render derivation ----
  type Rendered = {
    x: number;
    y: number;
    color: string;
    /** RGB of the node's idle (age-based, no orange) color — used for edge blending. */
    idleRgb: [number, number, number];
    age: number;
    r: number;
    orangeAmount: number;
    glow: boolean;
    opacity: number;
  };
  const rendered = new Map<number, Rendered>();
  renderedPosRef.current = new Map();
  const now = performance.now();

  for (const n of nodesRef.current) {
    let x: number;
    let y: number;

    if (n.ejectAnim && !n.ejectAnim.settled) {
      const t = clamp(
        (now - n.ejectAnim.startedAt) / n.ejectAnim.durationMs,
        0,
        1
      );
      const e = easeInCubic(t);
      x = n.ejectAnim.fromX + (n.ejectAnim.toX - n.ejectAnim.fromX) * e;
      y = n.ejectAnim.fromY + (n.ejectAnim.toY - n.ejectAnim.fromY) * e;
    } else {
      const t = clamp(n.age / n.entryDurationMs, 0, 1);
      const e = easeOutQuad(t);
      const baseX = n.entryX + (n.targetX - n.entryX) * e;
      const baseY = n.entryY + (n.targetY - n.entryY) * e;
      const amp = DRIFT_AMPLITUDE * clamp(n.age / 2000, 0, 1);
      x =
        baseX +
        Math.sin(now * DRIFT_FREQ + n.phaseX) * amp +
        Math.sin(now * DRIFT_FREQ * 1.7 + n.phaseY) * amp * 0.4;
      y =
        baseY +
        Math.cos(now * DRIFT_FREQ + n.phaseY) * amp +
        Math.cos(now * DRIFT_FREQ * 1.7 + n.phaseX) * amp * 0.4;
    }

    const orange = n.orangeAmount;
    const idleRgb = ageColorRgb(n.age);
    const targetRgb = orange > 0 ? blendRgb(idleRgb, COLOR_ORANGE, orange) : idleRgb;
    const color = rgbToCss(targetRgb);

    const baseR = NODE_RADIUS * n.radiusFactor;
    const orangeR = ORANGE_NODE_RADIUS * n.radiusFactor;
    let r = baseR + (orangeR - baseR) * orange;
    if (n.isSpotlight && orange > 0.2) r = orangeR + 0.8;

    // Age-driven death shrink + fade (only when fully idle).
    let opacity = 1;
    if (orange < 0.05) {
      const timeLeft = MAX_AGE_MS - n.age;
      if (timeLeft < DEATH_WINDOW_MS) {
        const k = Math.max(0, timeLeft / DEATH_WINDOW_MS);
        r = baseR * k;
        opacity = k;
      }
    }

    rendered.set(n.id, {
      x,
      y,
      color,
      idleRgb,
      age: n.age,
      r,
      orangeAmount: orange,
      glow: orange > 0.15,
      opacity,
    });
    renderedPosRef.current.set(n.id, { x, y });
  }

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      {edgesRef.current.map((e, i) => {
        const a = rendered.get(e.from);
        const b = rendered.get(e.to);
        if (!a || !b) return null;
        const orangeMix = Math.max(a.orangeAmount, b.orangeAmount);
        // Idle base: explicit constant if set, otherwise older endpoint's age color.
        const baseRgb =
          EDGE_IDLE_RGB ?? (a.age > b.age ? a.idleRgb : b.idleRgb);
        let stroke: string;
        let opacity: number;
        let width: number;
        if (orangeMix > 0.01) {
          stroke = rgbToCss(blendRgb(baseRgb, COLOR_ORANGE, orangeMix));
          opacity =
            EDGE_IDLE_OPACITY + (EDGE_ORANGE_OPACITY - EDGE_IDLE_OPACITY) * orangeMix;
          width =
            EDGE_IDLE_WIDTH + (EDGE_ORANGE_WIDTH - EDGE_IDLE_WIDTH) * orangeMix;
        } else {
          stroke = rgbToCss(baseRgb);
          opacity = EDGE_IDLE_OPACITY;
          width = EDGE_IDLE_WIDTH;
        }
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={stroke}
            strokeOpacity={opacity}
            strokeWidth={width}
          />
        );
      })}
      {orphanEdgesRef.current.map((o) => {
        const other = rendered.get(o.otherId);
        if (!other) return null;
        const t = clamp((now - o.startedAt) / ORPHAN_EDGE_FADE_MS, 0, 1);
        const opacity = (1 - t) * 0.8;
        return (
          <line
            key={`orphan-${o.id}`}
            x1={o.ghostX}
            y1={o.ghostY}
            x2={other.x}
            y2={other.y}
            stroke={o.baseColor}
            strokeOpacity={opacity}
            strokeWidth={1.4}
          />
        );
      })}
      {nodesRef.current.map((n) => {
        const p = rendered.get(n.id);
        if (!p) return null;
        return (
          <circle
            key={n.id}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.color}
            opacity={p.opacity}
            style={p.glow ? { filter: ORANGE_GLOW } : undefined}
          />
        );
      })}
    </svg>
  );
});

Graph.displayName = "Graph";
export default Graph;
