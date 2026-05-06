"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import { SCENE_TYPING_DELAY_MS } from "./index";

export type ResultRow = {
  n: { label: string; id: string };
  v: { label: string; id: string };
  m: { label: string; id: string };
};

export type EditorPhase = "idle" | "typing" | "running" | "results";

type Props = {
  /** Full query text — typewriter reveals it; cleared/null = no typing in progress. */
  pendingQuery?: string | null;
  /** Latest committed query (after typewriter completes). */
  committedQuery?: string | null;
  /** Bump to trigger the Run button's click animation. */
  pressToken?: number;
  /** True while the query is "running" — show loading state. */
  running?: boolean;
  /** Results to display once the answer arrives. Null = no results. */
  results?: ResultRow[] | null;
  /** Display timing string for the success bar (e.g. "13 ms"). */
  resultMs?: string;
};

const EditorPanel = forwardRef<HTMLDivElement, Props>(
  (
    {
      pendingQuery,
      committedQuery,
      pressToken = 0,
      running = false,
      results = null,
      resultMs = "13 ms",
    },
    ref
  ) => {
    // Typewriter state.
    const [typed, setTyped] = useState("");
    useEffect(() => {
      if (!pendingQuery) {
        setTyped("");
        return;
      }
      const target = pendingQuery;
      const duration = Math.max(200, SCENE_TYPING_DELAY_MS - 200);
      const start = performance.now();
      let rafId = 0;
      const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const n = Math.floor(target.length * easeOutQuad(t));
        setTyped(target.slice(0, n));
        if (t < 1) rafId = requestAnimationFrame(tick);
        else setTyped(target);
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, [pendingQuery]);

    // Run-button press flash.
    const [pressing, setPressing] = useState(false);
    useEffect(() => {
      if (pressToken === 0) return;
      setPressing(true);
      const t = setTimeout(() => setPressing(false), 220);
      return () => clearTimeout(t);
    }, [pressToken]);

    const displayedCode = pendingQuery ? typed : committedQuery ?? "";
    const showCaret = !!pendingQuery;

    return (
      <div
        ref={ref}
        className="relative rounded-xl p-[1px] bg-gradient-to-br from-white/40 to-white/0 w-[420px] h-[260px] shrink-0"
      >
        <div className="relative flex flex-col h-full rounded-[11px] bg-[#0F0F10] overflow-hidden text-white">
          {/* Header row */}
          <div className="px-4 pt-3 pb-2 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-white">
              GQL
            </div>
          </div>

          {/* Code area */}
          <div className="relative flex bg-[#0c0c0d] min-h-[88px]">
            <div className="select-none px-3 py-3 text-[11px] text-white/30 font-mono leading-[18px]">
              1
            </div>
            <div className="flex-1 px-2 py-3 text-[11px] font-mono leading-[18px]">
              <CypherSyntax text={displayedCode} />
              {showCaret && (
                <span className="inline-block w-[1px] h-[12px] bg-white ml-[1px] align-middle animate-pulse" />
              )}
            </div>
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                disabled
                data-icon="run"
                className={`px-3 py-1.5 rounded-md text-[11px] text-white bg-gradient-to-r from-[#FFC500] via-[#FF8B25] to-[#DD2222] cursor-default transition-all duration-150 ${pressing ? "scale-95 brightness-125" : "scale-100"
                  }`}
              >
                Run query
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 text-[10px]">
            <div className="flex items-center gap-1.5">
              {running ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC500] animate-pulse" />
                  <span className="text-white/70">Running query…</span>
                </>
              ) : results ? (
                <>
                  <span className="text-[#30AF19]">✓ Query successful</span>
                </>
              ) : (
                <span className="text-white/40">Ready</span>
              )}
            </div>
            {results && (
              <div className="text-white/40">{resultMs}</div>
            )}
          </div>

          {/* Results area */}
          <div className="relative flex-1 min-h-[88px] max-h-[88px] overflow-hidden bg-[#0c0c0d]">
            {running ? (
              <div className="flex items-center justify-center h-[60px]">
                <div className="w-[60%] h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-1/3 bg-gradient-to-r from-[#FFC500] to-[#DD2222] animate-[loadingBar_1.4s_ease-in-out_infinite]" />
                </div>
              </div>
            ) : results ? (
              <div className="px-3 py-1 overflow-hidden">
                <div className="grid grid-cols-[24px_1fr_1.5fr_1fr] text-[10px] text-white/45 py-1 border-b border-white/5">
                  <span>#</span>
                  <span>n</span>
                  <span>v</span>
                  <span>m</span>
                </div>
                {results.slice(0, 2).map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[24px_1fr_1.5fr_1fr] text-[10.5px] py-[5px] border-b border-white/5 animate-[chatIn_0.35s_ease-out]"
                  >
                    <span className="text-white/35">{i + 1}</span>
                    <NodeChip label={r.n.label} id={r.n.id} kind="node" />
                    <NodeChip label={r.v.label} id={r.v.id} kind="rel" />
                    <NodeChip label={r.m.label} id={r.m.id} kind="node" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[60px] text-white/30 text-[10px]">
                Run a query to see results
              </div>
            )}
          </div>

          {/* Anchors for the path overlay */}
          <div
            data-anchor="editor-out"
            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0 w-0"
          />
        </div>

        <style jsx>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(150%); }
            100% { transform: translateX(300%); }
          }
          @keyframes chatIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }
);

// Inline GQL syntax styling — keywords colored, rest white.
const GQL_KEYWORDS = new Set([
  "match",
  "optional",
  "return",
  "where",
  "limit",
  "order",
  "by",
  "asc",
  "desc",
  "as",
  "with",
  "and",
  "or",
  "not",
  "true",
  "false",
  "null",
]);
function CypherSyntax({ text }: { text: string }) {
  if (!text) return null;
  // Split on word boundaries while keeping the separators.
  const parts = text.split(/(\b[a-zA-Z_]+\b)/);
  return (
    <>
      {parts.map((p, i) => {
        const lower = p.toLowerCase();
        if (GQL_KEYWORDS.has(lower)) {
          return (
            <span key={i} className="text-[#5BC0EB]">
              {p}
            </span>
          );
        }
        return p.split(/(\d+(?:\.\d+)?)/).map((seg, j) => {
          if (/^\d+(?:\.\d+)?$/.test(seg))
            return (
              <span key={`${i}-${j}`} className="text-[#FFC500]">
                {seg}
              </span>
            );
          return <span key={`${i}-${j}`}>{seg}</span>;
        });
      })}
    </>
  );
}

function NodeChip({
  label,
  id,
  kind,
}: {
  label: string;
  id: string;
  kind: "node" | "rel";
}) {
  return (
    <span className="flex items-center gap-1 truncate">
      <span
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${kind === "node"
            ? "bg-[#0e2a14] text-[#4ade80] border border-[#30AF1955]"
            : "bg-[#2a1a06] text-[#FB6E00] border border-[#FB6E0055]"
          }`}
      >
        <span className="opacity-60">{kind === "node" ? "●" : "→"}</span>
        {label}
      </span>
      <span className="text-white/40">{id}</span>
    </span>
  );
}

EditorPanel.displayName = "EditorPanel";
export default EditorPanel;
