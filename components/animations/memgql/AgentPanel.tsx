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
        className="relative rounded-lg p-[1px] bg-gradient-to-br from-white/40 to-white/0 w-[160px] h-[180px] shrink-0 self-start"
      >
        <div className="relative flex flex-col h-full rounded-[7px] bg-[#0F0F10] overflow-hidden">
          <div className="flex items-center px-3 py-3 border-b border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-white">
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/pages/memgraph-zero/memgql/brain.svg`}
                alt=""
                width={28}
                height={28}
                className={`relative transition-transform duration-300 ${
                  active ? "scale-110" : "scale-100"
                }`}
              />
            </div>

            {/* Status text — re-keys on phase to fade in cleanly. */}
            <div className="flex flex-col items-center gap-1 min-h-[34px]">
              <div
                key={phase}
                className={`text-[11px] font-medium animate-[statusIn_0.35s_ease-out] ${
                  active ? "text-[#FFC500]" : "text-white/70"
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
