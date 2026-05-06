"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  path: SVGPathElement | null;
  /** Travel speed in pixels per millisecond. Duration is derived from path length. */
  speed: number;
  color?: string;
  radius?: number;
  onDone: (endPoint: { x: number; y: number }) => void;
};

/**
 * Animates a circle along a given SVG <path> using getPointAtLength + rAF.
 * Writes cx/cy directly via ref to avoid per-frame React re-renders.
 */
export default function TravelingDot({
  path,
  speed,
  color = "#bab8bb",
  radius = 3,
  onDone,
}: Props) {
  const circleRef = useRef<SVGCircleElement | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!path || !circleRef.current) return;
    const total = path.getTotalLength();
    if (!total) return;

    const duration = total / speed;
    let rafId: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const p = path.getPointAtLength(t * total);
      const el = circleRef.current;
      if (el) {
        el.setAttribute("cx", String(p.x));
        el.setAttribute("cy", String(p.y));
      }
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        onDoneRef.current({ x: p.x, y: p.y });
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [path, speed]);

  // The glow tint matches the dot color so it blooms outward instead of
  // washing into the background — works in both light and dark themes.
  return (
    <circle
      ref={circleRef}
      r={radius}
      fill={color}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    />
  );
}
