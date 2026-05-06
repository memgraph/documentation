"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import TravelingDot from "./TravelingDot";

export type FlightKind =
  | "ingest"
  | "query"
  | "answer"
  | "mcp"
  | "mcp-back"
  | "agent"
  | "agent-back";

export type PathOverlayHandle = {
  spawnFlight: (kind: FlightKind) => Promise<{ x: number; y: number }>;
  getRouteStart: (
    kind: FlightKind
  ) => { x: number; y: number } | null;
};

type Props = {
  containerRef: React.RefObject<HTMLDivElement>;
  sourcesRef: React.RefObject<HTMLDivElement>;
  memgqlRef: React.RefObject<HTMLDivElement>;
  editorRef: React.RefObject<HTMLDivElement>;
  /** MCP block above the editor — connects to MemGQL via a bidirectional arrow. */
  mcpRef: React.RefObject<HTMLDivElement>;
  /** Agent block to the right — connects to MCP via a bidirectional arrow. */
  agentRef: React.RefObject<HTMLDivElement>;
  onArrive?: (
    kind: FlightKind,
    containerPoint: { x: number; y: number }
  ) => void;
};

type Point = { x: number; y: number };
type Route = { id: string; d: string; type: FlightKind };
type Flight = {
  id: number;
  routeIndex: number;
  startedAt: number;
  kind: FlightKind;
  resolve?: (point: Point) => void;
};

const INGESTION_INTERVAL_MS = 1100;
const DOT_SPEED_PX_PER_MS = 0.12;

const COLOR_INGEST = "#bab8bb";
const COLOR_ORANGE = "#FB6E00";

function buildStraightPath(from: Point, to: Point): string {
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

/**
 * Two-bend stepped path running HORIZONTALLY: horizontal from `from` to a knee
 * at `kneeX`, vertical to match `to.y`, then horizontal to `to`. For routes that
 * travel left→right with vertical fanning. Falls back to straight if from.y===to.y.
 */
function buildSteppedHPath(
  from: Point,
  to: Point,
  kneeX: number,
  r = 10
): string {
  const dy = to.y - from.y;
  if (Math.abs(dy) < 1) return buildStraightPath(from, to);
  const vSign = Math.sign(dy);
  const hSign = Math.sign(to.x - from.x) || 1;
  const rr = Math.min(
    r,
    Math.abs(dy) / 2,
    Math.abs(from.x - kneeX),
    Math.abs(kneeX - to.x)
  );
  return [
    `M ${from.x} ${from.y}`,
    `L ${kneeX - rr * hSign} ${from.y}`,
    `Q ${kneeX} ${from.y} ${kneeX} ${from.y + rr * vSign}`,
    `L ${kneeX} ${to.y - rr * vSign}`,
    `Q ${kneeX} ${to.y} ${kneeX + rr * hSign} ${to.y}`,
    `L ${to.x} ${to.y}`,
  ].join(" ");
}

const PathOverlay = forwardRef<PathOverlayHandle, Props>(function PathOverlay(
  { containerRef, sourcesRef, memgqlRef, editorRef, mcpRef, agentRef, onArrive },
  ref
) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [flights, setFlights] = useState<Flight[]>([]);
  const rafRef = useRef<number | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const flightIdRef = useRef(0);
  const routesRef = useRef<Route[]>([]);
  routesRef.current = routes;

  const measure = () => {
    const c = containerRef.current;
    const s = sourcesRef.current;
    const m = memgqlRef.current;
    const e = editorRef.current;
    const mcp = mcpRef.current;
    const agent = agentRef.current;
    if (!c || !s || !m || !e || !mcp || !agent) return;

    // CSS transform on an ancestor (e.g. scale-[0.65] on the wrapper) makes
    // getBoundingClientRect return scaled coords while offsetWidth stays at the
    // unscaled layout size. The SVG paints in the unscaled layout space, so we
    // divide every screen-space delta by `scale` to get the SVG's user units.
    const cr = c.getBoundingClientRect();
    const scale = c.offsetWidth ? cr.width / c.offsetWidth : 1;
    const toLocal = (clientX: number, clientY: number) => ({
      x: (clientX - cr.left) / scale,
      y: (clientY - cr.top) / scale,
    });

    const mr = m.getBoundingClientRect();
    const er = e.getBoundingClientRect();

    // Memgraph edges in SVG-local (unscaled) coords.
    const mxLeft = (mr.left - cr.left) / scale;
    const mxRight = mxLeft + mr.width / scale;
    const myTop = (mr.top - cr.top) / scale;
    const mHeight = mr.height / scale;
    const myCenter = myTop + mHeight / 2;

    // Editor edges.
    const exLeft = (er.left - cr.left) / scale;
    const eyTop = (er.top - cr.top) / scale;
    const eyCenter = eyTop + er.height / scale / 2;

    // Each source card → ingestion route from card's RIGHT edge to evenly-spaced
    // points along the graph's LEFT edge. Two-bend stepped paths with all knees
    // sharing one vertical line for symmetry.
    const sourceCards = Array.from(
      s.querySelectorAll<HTMLElement>("[data-source-index]")
    );
    const N = sourceCards.length;
    const ingestRoutes: Route[] = sourceCards.map((card, i) => {
      const rect = card.getBoundingClientRect();
      const sx = (rect.right - cr.left) / scale; // source right edge
      const sy = (rect.top - cr.top + rect.height / 2) / scale;
      // Fan targets across the graph left edge.
      const tx = mxLeft;
      const ty = myTop + ((i + 0.5) / N) * mHeight;
      // All knees aligned on a single vertical line.
      const kneeX = sx + (tx - sx) * 0.55;
      return {
        id: `ingest-${i}`,
        type: "ingest",
        d: buildSteppedHPath({ x: sx, y: sy }, { x: tx, y: ty }, kneeX),
      };
    });

    // Single bidirectional channel between editor and memgql, passing through
    // the bolt. Query and answer flights share the same line but in opposite
    // directions; the answer path is hidden so visually we see one arrow.
    const lineY = eyCenter; // editor and memgraph centers align via flex items-center
    const queryRoute: Route = {
      id: "query",
      type: "query",
      d: buildStraightPath(
        { x: exLeft, y: lineY },
        { x: mxRight, y: lineY }
      ),
    };
    const answerRoute: Route = {
      id: "answer",
      type: "answer",
      d: buildStraightPath(
        { x: mxRight, y: lineY },
        { x: exLeft, y: lineY }
      ),
    };

    // MCP <-> MemGQL — visible mcp + hidden mcp-back (reverse direction for flights).
    const mcpr = mcp.getBoundingClientRect();
    const mcpxLeft = (mcpr.left - cr.left) / scale;
    const mcpxRight = mcpxLeft + mcpr.width / scale;
    const mcpyCenter = (mcpr.top - cr.top + mcpr.height / 2) / scale;
    const mcpToY = myTop + mHeight * 0.18;
    const mcpKneeX = mcpxLeft + (mxRight - mcpxLeft) * 0.5;
    const mcpRoute: Route = {
      id: "mcp",
      type: "mcp",
      d: buildSteppedHPath(
        { x: mcpxLeft, y: mcpyCenter },
        { x: mxRight, y: mcpToY },
        mcpKneeX
      ),
    };
    const mcpBackRoute: Route = {
      id: "mcp-back",
      type: "mcp-back",
      d: buildSteppedHPath(
        { x: mxRight, y: mcpToY },
        { x: mcpxLeft, y: mcpyCenter },
        mcpKneeX
      ),
    };

    // Agent <-> MCP — visible agent + hidden agent-back.
    const ar = agent.getBoundingClientRect();
    const axLeft = (ar.left - cr.left) / scale;
    const ayCenter = (ar.top - cr.top + ar.height / 2) / scale;
    const agentKneeX = mcpxRight + (axLeft - mcpxRight) * 0.5;
    const agentRoute: Route = {
      id: "agent",
      type: "agent",
      d: buildSteppedHPath(
        { x: axLeft, y: ayCenter },
        { x: mcpxRight, y: mcpyCenter },
        agentKneeX
      ),
    };
    const agentBackRoute: Route = {
      id: "agent-back",
      type: "agent-back",
      d: buildSteppedHPath(
        { x: mcpxRight, y: mcpyCenter },
        { x: axLeft, y: ayCenter },
        agentKneeX
      ),
    };

    setRoutes([
      ...ingestRoutes,
      queryRoute,
      answerRoute,
      mcpRoute,
      mcpBackRoute,
      agentRoute,
      agentBackRoute,
    ]);
    setSize({ w: c.clientWidth, h: c.clientHeight });
  };

  const scheduleMeasure = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(c);
    if (sourcesRef.current) ro.observe(sourcesRef.current);
    if (memgqlRef.current) ro.observe(memgqlRef.current);
    if (editorRef.current) ro.observe(editorRef.current);
    if (mcpRef.current) ro.observe(mcpRef.current);
    if (agentRef.current) ro.observe(agentRef.current);
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spawnFlightInternal = useCallback(
    (type: FlightKind, resolve?: (p: Point) => void) => {
      const matches = routesRef.current
        .map((r, i) => (r.type === type ? i : -1))
        .filter((i) => i >= 0);
      if (matches.length === 0) {
        resolve?.({ x: 0, y: 0 });
        return;
      }
      const routeIndex =
        matches[Math.floor(Math.random() * matches.length)];
      setFlights((prev) => [
        ...prev,
        {
          id: ++flightIdRef.current,
          routeIndex,
          startedAt: performance.now(),
          kind: type,
          resolve,
        },
      ]);
    },
    []
  );

  // Background ingestion runs always.
  useEffect(() => {
    const interval = setInterval(
      () => spawnFlightInternal("ingest"),
      INGESTION_INTERVAL_MS
    );
    return () => clearInterval(interval);
  }, [spawnFlightInternal]);

  useImperativeHandle(
    ref,
    () => ({
      spawnFlight: (kind) =>
        new Promise<Point>((resolve) => spawnFlightInternal(kind, resolve)),
      getRouteStart: (kind) => {
        const idx = routesRef.current.findIndex((r) => r.type === kind);
        if (idx < 0) return null;
        const el = pathRefs.current[idx];
        const c = containerRef.current;
        if (!el || !c) return null;
        const cr = c.getBoundingClientRect();
        const scale = c.offsetWidth ? cr.width / c.offsetWidth : 1;
        const p = el.getPointAtLength(0);
        return { x: cr.left + p.x * scale, y: cr.top + p.y * scale };
      },
    }),
    [spawnFlightInternal, containerRef]
  );

  const flightsRef = useRef<Flight[]>([]);
  flightsRef.current = flights;

  const handleDone = useCallback(
    (flightId: number, kind: FlightKind, localPoint: Point) => {
      // localPoint is in the SVG's user-unit space (unscaled). Convert to
      // viewport (client) coords so callers can hand it back to other
      // components that re-apply the same scale.
      const c = containerRef.current;
      let clientPoint = localPoint;
      if (c) {
        const cr = c.getBoundingClientRect();
        const scale = c.offsetWidth ? cr.width / c.offsetWidth : 1;
        clientPoint = {
          x: cr.left + localPoint.x * scale,
          y: cr.top + localPoint.y * scale,
        };
      }
      const f = flightsRef.current.find((x) => x.id === flightId);
      f?.resolve?.(clientPoint);
      setFlights((prev) => prev.filter((x) => x.id !== flightId));
      onArrive?.(kind, clientPoint);
    },
    [onArrive, containerRef]
  );

  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={size.w || "100%"}
      height={size.h || "100%"}
      viewBox={size.w && size.h ? `0 0 ${size.w} ${size.h}` : undefined}
    >
      <defs>
        <marker
          id="memgql-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 1 1 L 9 5 L 1 9"
            fill="none"
            stroke="#FFFFFF66"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {routes.map((r, i) => {
        // *-back routes are reverse-direction duplicates kept in DOM only for
        // getPointAtLength; render with no stroke/markers.
        const hidden =
          r.type === "answer" ||
          r.type === "mcp-back" ||
          r.type === "agent-back";
        return (
          <path
            key={r.id}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={r.d}
            fill="none"
            stroke={hidden ? "none" : "#FFFFFF66"}
            strokeWidth={1}
            strokeDasharray={hidden ? undefined : "4 4"}
            markerEnd={hidden ? undefined : "url(#memgql-arrow)"}
            markerStart={hidden ? undefined : "url(#memgql-arrow)"}
          />
        );
      })}

      {flights.map((f) => (
        <TravelingDot
          key={f.id}
          path={pathRefs.current[f.routeIndex] ?? null}
          speed={DOT_SPEED_PX_PER_MS}
          color={f.kind === "ingest" ? COLOR_INGEST : COLOR_ORANGE}
          radius={f.kind === "ingest" ? 3 : 4}
          onDone={(p) => handleDone(f.id, f.kind, p)}
        />
      ))}
    </svg>
  );
});

export default PathOverlay;
