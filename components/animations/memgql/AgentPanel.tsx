"use client";

import React, { forwardRef } from "react";
import { useRouter } from "next/router";

export type AgentPhase = "idle" | "calling" | "reasoning" | "receiving";

const PHASE_LABEL: Record<AgentPhase, string> = {
  idle: "Listening",
  calling: "Calling MCP tool",
  reasoning: "Reasoning",
  receiving: "Drafting answer",
};

type Props = {
  phase?: AgentPhase;
};

const AgentPanel = forwardRef<HTMLDivElement, Props>(
  ({ phase = "idle" }, ref) => {
    const active = phase !== "idle";
    const { basePath } = useRouter();
    return (
      <div
        ref={ref}
        className="relative rounded-lg p-[1px] bg-gradient-to-br from-[var(--mg-rim)] to-[var(--mg-rim-fade)] w-[160px] h-[180px] shrink-0 self-start"
      >
        <div className="relative flex flex-col h-full rounded-[7px] bg-[var(--mg-deep)] overflow-hidden">
          <div className="flex items-center px-3 py-3 border-b border-[var(--mg-border)]">
            <div className="text-[10px] uppercase tracking-wider text-[var(--mg-fg-strong)]">
              Agent
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-3 text-center">
            {/* Pulsing brain icon — soft orange glow halo while active. */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              {active && (
                <div
                  className="absolute inset-0 rounded-full bg-[#FB6E00] opacity-50 blur-lg animate-[agentPulse_1.4s_ease-in-out_infinite]"
                  aria-hidden
                />
              )}
              <div
                aria-hidden
                className={`relative bg-[var(--mg-fg)] transition-transform duration-300 ${
                  active ? "scale-110" : "scale-100"
                }`}
                style={{
                  width: 28,
                  height: 28,
                  WebkitMaskImage: `url(${basePath}/pages/memgraph-zero/memgql/brain.svg)`,
                  maskImage: `url(${basePath}/pages/memgraph-zero/memgql/brain.svg)`,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
            </div>

            {/* Status text — re-keys on phase to fade in cleanly. */}
            <div className="flex flex-col items-center gap-1 min-h-[34px]">
              <div
                key={phase}
                className={`text-[11px] font-medium animate-[statusIn_0.35s_ease-out] ${
                  active ? "text-[#FFC500]" : "text-[var(--mg-fg-soft)]"
                }`}
              >
                {PHASE_LABEL[phase]}
                {active && (
                  <span className="ml-0.5">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse [animation-delay:120ms]">
                      .
                    </span>
                    <span className="animate-pulse [animation-delay:240ms]">
                      .
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes agentPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.45;
            }
            50% {
              transform: scale(1.25);
              opacity: 0.75;
            }
          }
          @keyframes statusIn {
            from {
              opacity: 0;
              transform: translateY(2px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

AgentPanel.displayName = "AgentPanel";
export default AgentPanel;
