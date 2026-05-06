"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import DataSourcesRow from "./DataSourcesRow";
import MemGQLPanel from "./MemGQLPanel";
import EditorPanel, { ResultRow } from "./EditorPanel";
import MCPPanel from "./MCPPanel";
import AgentPanel, { AgentPhase } from "./AgentPanel";
import PathOverlay, { PathOverlayHandle, FlightKind } from "./PathOverlay";
import { GraphHandle } from "./Graph";

const SCENE_INITIAL_DELAY_MS = 1500;
export const SCENE_TYPING_DELAY_MS = 1700;
const SCENE_AFTER_TYPING_DELAY_MS = 350;
const SCENE_POST_CASCADE_DELAY_MS = 400;
const SCENE_RESULT_LINGER_MS = 3500;

type QueryPair = {
  text: string;
  rows: ResultRow[];
  ms: string;
};

function BoltBadge() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-md p-[1px] bg-gradient-to-br flex flex-col items-center from-[#FFC500] via-[#DD2222] to-[#8C0082]">
        <div className="rounded-[5px] bg-[var(--mg-panel)] p-1 flex flex-col items-center justify-center gap-1">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fb6e00"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <div className="text-[9px] uppercase tracking-wider text-[var(--mg-fg-strong)]">
            Bolt
          </div>
        </div>
      </div>
    </div>
  );
}

const QUERIES: QueryPair[] = [
  {
    text: "MATCH (n)-[v]-(m) RETURN n, v, m LIMIT 500",
    ms: "13 ms",
    rows: [
      {
        n: { label: "Person", id: "ID 77" },
        v: { label: "WORKS_AT", id: "ID 66" },
        m: { label: "Company", id: "ID 78" },
      },
      {
        n: { label: "Stop", id: "ID 79" },
        v: { label: "ROUTE", id: "ID 190" },
        m: { label: "Stop", id: "ID 783" },
      },
      {
        n: { label: "Stop", id: "ID 80" },
        v: { label: "ROUTE", id: "ID 191" },
        m: { label: "Stop", id: "ID 82" },
      },
      {
        n: { label: "Stop", id: "ID 81" },
        v: { label: "ROUTE", id: "ID 192" },
        m: { label: "Stop", id: "ID 83" },
      },
    ],
  },
  {
    text: "MATCH (n:Person)-[v:WORKS_AT]->(m:Company) RETURN n, v, m LIMIT 200",
    ms: "21 ms",
    rows: [
      {
        n: { label: "Person", id: "ID 12" },
        v: { label: "WORKS_AT", id: "ID 401" },
        m: { label: "Company", id: "ID 47" },
      },
      {
        n: { label: "Person", id: "ID 14" },
        v: { label: "WORKS_AT", id: "ID 402" },
        m: { label: "Company", id: "ID 53" },
      },
      {
        n: { label: "Person", id: "ID 47" },
        v: { label: "WORKS_AT", id: "ID 510" },
        m: { label: "Company", id: "ID 88" },
      },
    ],
  },
  {
    text: "MATCH (n:Account)-[v:SEND]->(m:Account) WHERE m.flagged = true RETURN n, v, m",
    ms: "8 ms",
    rows: [
      {
        n: { label: "Account", id: "ID 901" },
        v: { label: "SEND", id: "ID 661" },
        m: { label: "Account", id: "ID 902" },
      },
      {
        n: { label: "Account", id: "ID 911" },
        v: { label: "SEND", id: "ID 662" },
        m: { label: "Account", id: "ID 904" },
      },
    ],
  },
  {
    text: "MATCH (n:Stop)-[v:ROUTE]->(m:Stop) WHERE v.duration < 60 RETURN n, v, m ORDER BY v.duration LIMIT 100",
    ms: "16 ms",
    rows: [
      {
        n: { label: "Stop", id: "ID 14" },
        v: { label: "ROUTE", id: "ID 2030" },
        m: { label: "Stop", id: "ID 15" },
      },
      {
        n: { label: "Stop", id: "ID 22" },
        v: { label: "ROUTE", id: "ID 2104" },
        m: { label: "Stop", id: "ID 31" },
      },
      {
        n: { label: "Stop", id: "ID 31" },
        v: { label: "ROUTE", id: "ID 2207" },
        m: { label: "Stop", id: "ID 44" },
      },
    ],
  },
];

export default function MemGQLAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const memgqlRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const mcpRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<GraphHandle>(null);
  const pathOverlayRef = useRef<PathOverlayHandle>(null);

  const [nodeCount, setNodeCount] = useState(0);
  const [pulseToken, setPulseToken] = useState(0);
  const [mcpPulseToken, setMcpPulseToken] = useState(0);
  const [agentPhase, setAgentPhase] = useState<AgentPhase>("idle");
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [committedQuery, setCommittedQuery] = useState<string | null>(null);
  const [pressToken, setPressToken] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const [resultMs, setResultMs] = useState<string>("13 ms");

  const handleArrive = useCallback(
    (kind: FlightKind, clientPoint: { x: number; y: number }) => {
      if (kind !== "ingest") return;
      setPulseToken((t) => t + 1);
      graphRef.current?.addNodeFromViewport(clientPoint);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const loop = async () => {
      await wait(SCENE_INITIAL_DELAY_MS);
      let qIdx = 0;
      while (!cancelled) {
        const overlay = pathOverlayRef.current;
        const graph = graphRef.current;
        if (!overlay || !graph) {
          await wait(500);
          continue;
        }

        const q = QUERIES[qIdx % QUERIES.length];
        qIdx++;

        // 1. Type the query. Old results stay visible while typing — they only
        //    clear when the user "clicks" Run, which mirrors real editor UX.
        setCommittedQuery(null);
        setPendingQuery(q.text);
        await wait(SCENE_TYPING_DELAY_MS);
        if (cancelled) return;
        setCommittedQuery(q.text);
        setPendingQuery(null);

        await wait(SCENE_AFTER_TYPING_DELAY_MS);
        if (cancelled) return;

        // 2. "Click" Run query — now results clear and loading begins.
        setPressToken((t) => t + 1);
        setResults(null);
        setRunning(true);
        await wait(180);
        if (cancelled) return;

        // 3. Query dot flies editor → graph.
        const queryArrival = await overlay.spawnFlight("query");
        if (cancelled) return;

        // 4. Cascade (its own local node-id list — runs in parallel with agent).
        const { nodeIds, spotlightId } = await graph.paintOrangeFromViewport(
          queryArrival
        );
        if (cancelled) return;
        await wait(SCENE_POST_CASCADE_DELAY_MS);
        if (cancelled) return;

        // 5. Eject only THIS cascade's spotlight, fading just THIS cascade's nodes.
        const answerStart = overlay.getRouteStart("answer");
        if (spotlightId !== null) {
          const others = nodeIds.filter((id) => id !== spotlightId);
          await graph.ejectNodeAndClear(
            spotlightId,
            others,
            answerStart ?? queryArrival
          );
        }
        if (cancelled) return;

        // 6. Answer dot flies graph → editor.
        await overlay.spawnFlight("answer");
        if (cancelled) return;

        // 7. Show results.
        setRunning(false);
        setResults(q.rows);
        setResultMs(q.ms);

        await wait(SCENE_RESULT_LINGER_MS);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  // Agent scene: agent → MCP → memgraph → MCP → agent. Runs in parallel.
  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));
    const AGENT_INITIAL_DELAY_MS = 3500;
    const AGENT_REST_MS = 2200;
    const POST_CASCADE_MS = 400;
    const MCP_PROCESS_MS = 450; // illusion of the dot moving inside MCP

    const loop = async () => {
      await wait(AGENT_INITIAL_DELAY_MS);
      while (!cancelled) {
        const overlay = pathOverlayRef.current;
        const graph = graphRef.current;
        if (!overlay || !graph) {
          await wait(500);
          continue;
        }

        setAgentPhase("calling");
        await overlay.spawnFlight("agent");
        if (cancelled) return;
        // Dot reaches MCP — flash the panel and dwell briefly before forwarding.
        setMcpPulseToken((t) => t + 1);
        await wait(MCP_PROCESS_MS);
        if (cancelled) return;
        setAgentPhase("reasoning");
        const arrival = await overlay.spawnFlight("mcp");
        if (cancelled) return;

        const { nodeIds, spotlightId } = await graph.paintOrangeFromViewport(
          arrival
        );
        if (cancelled) return;
        await wait(POST_CASCADE_MS);
        if (cancelled) return;

        const mcpBackStart = overlay.getRouteStart("mcp-back");
        if (spotlightId !== null) {
          const others = nodeIds.filter((id) => id !== spotlightId);
          await graph.ejectNodeAndClear(
            spotlightId,
            others,
            mcpBackStart ?? arrival
          );
        }
        if (cancelled) return;

        setAgentPhase("receiving");
        await overlay.spawnFlight("mcp-back");
        if (cancelled) return;
        // Dot reaches MCP from the graph — flash + dwell before passing back to agent.
        setMcpPulseToken((t) => t + 1);
        await wait(MCP_PROCESS_MS);
        if (cancelled) return;
        await overlay.spawnFlight("agent-back");
        if (cancelled) return;
        setAgentPhase("idle");

        await wait(AGENT_REST_MS);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="scale-[0.65] max-[1160px]:hidden min-[1280px]:scale-[0.55] min-[1400px]:scale-[0.65]
        [--mg-panel:#FAFAFA] [--mg-card:#FFFFFF] [--mg-deep:#FFFFFF] [--mg-code:#F8F8F8]
        [--mg-fg:#3F3F46] [--mg-fg-soft:#71717A] [--mg-fg-strong:#18181B]
        [--mg-border:#0000001a] [--mg-edge:#00000059] [--mg-dot:#71717A]
        [--mg-rim:#00000066] [--mg-rim-fade:#00000000]
        [--mg-chip-node-bg:#DCFCE7] [--mg-chip-node-fg:#15803D] [--mg-chip-node-bd:#86EFAC]
        [--mg-chip-rel-bg:#FFEDD5] [--mg-chip-rel-fg:#C2410C] [--mg-chip-rel-bd:#FDBA74]
        [--mg-flash-bg:#FFF1E1]
        dark:[--mg-panel:#141414] dark:[--mg-card:#231F20] dark:[--mg-deep:#0F0F10] dark:[--mg-code:#0c0c0d]
        dark:[--mg-fg:#BAB8BB] dark:[--mg-fg-soft:#FFFFFFB3] dark:[--mg-fg-strong:#FFFFFF]
        dark:[--mg-border:#FFFFFF22] dark:[--mg-edge:#FFFFFF66] dark:[--mg-dot:#BAB8BB]
        dark:[--mg-rim:#FFFFFF66] dark:[--mg-rim-fade:#FFFFFF00]
        dark:[--mg-chip-node-bg:#0e2a14] dark:[--mg-chip-node-fg:#4ade80] dark:[--mg-chip-node-bd:#30AF1955]
        dark:[--mg-chip-rel-bg:#2a1a06] dark:[--mg-chip-rel-fg:#FB6E00] dark:[--mg-chip-rel-bd:#FB6E0055]
        dark:[--mg-flash-bg:#1c1108]"
    >
      <div
        ref={containerRef}
        className="relative flex flex-row gap-[80px] items-center justify-center"
      >
        <DataSourcesRow ref={sourcesRef} />
        <MemGQLPanel
          ref={memgqlRef}
          graphRef={graphRef}
          nodeCount={nodeCount}
          pulseToken={pulseToken}
          onGraphCountChange={setNodeCount}
        />
        {/* Two bolt badges centered in the gap between the panels. */}
        <div className="-mx-[40px] z-10 flex flex-col gap-4">
          <div className="mb-[72px]">
            <BoltBadge />
          </div>
          <div className="mb-[64px]">
            <BoltBadge />
          </div>
        </div>
        <div className="relative flex flex-col items-center shrink-0">
          <MCPPanel ref={mcpRef} pulseToken={mcpPulseToken} />
          <div className="h-[24px]" />
          <EditorPanel
            ref={editorRef}
            pendingQuery={pendingQuery}
            committedQuery={committedQuery}
            pressToken={pressToken}
            running={running}
            results={results}
            resultMs={resultMs}
          />
        </div>
        <AgentPanel ref={agentRef} phase={agentPhase} />
        <PathOverlay
          ref={pathOverlayRef}
          containerRef={containerRef}
          sourcesRef={sourcesRef}
          memgqlRef={memgqlRef}
          editorRef={editorRef}
          mcpRef={mcpRef}
          agentRef={agentRef}
          onArrive={handleArrive}
        />
      </div>
    </div>
  );
}
