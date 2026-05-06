"use client";

import React, { forwardRef, useEffect, useState } from "react";
import Graph, { GraphHandle } from "./Graph";

type Props = {
  nodeCount?: number;
  pulseToken?: number;
  graphRef?: React.Ref<GraphHandle>;
  onGraphCountChange?: (n: number) => void;
};

const MemGQLPanel = forwardRef<HTMLDivElement, Props>(
  ({ nodeCount = 0, pulseToken = 0, graphRef, onGraphCountChange }, ref) => {
    const [flash, setFlash] = useState(false);

    useEffect(() => {
      if (pulseToken === 0) return;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      return () => clearTimeout(t);
    }, [pulseToken]);

    return (
      <div
        ref={ref}
        className="relative rounded-lg p-[1px] bg-gradient-to-br from-[#FFC500] via-[#DD2222] to-[#8C0082] w-[340px] h-[320px] shrink-0"
      >
        <div className="relative h-full rounded-[7px] bg-[#141414] overflow-hidden">
          {/* Graph fills the entire panel — no header strip eating vertical space. */}
          <Graph ref={graphRef} onCountChange={onGraphCountChange} />

          {/* Floating "Zero ETL" pill, top-left */}
          <div className="absolute top-[-1px] left-[-1px] z-10 rounded-br-md p-[1px] bg-gradient-to-br from-[#8C0082] via-[#FFC500] to-[#DD2222]">
            <div className="rounded-br-md bg-[#141414] px-2 py-1 text-[10px] uppercase tracking-wider text-[#FFC500]">
              Zero ETL
            </div>
          </div>

          {/* Floating "MemGQL" pill, top-right */}
          <div className="absolute top-[-1px] right-[-1px] z-10 rounded-bl-md p-[1px] bg-gradient-to-br from-[#DD2222] via-[#FFC500] to-[#8C0082]">
            <div className="rounded-bl-md bg-[#141414] px-2 py-1 text-[10px] uppercase tracking-wider text-white">
              MemGQL
            </div>
          </div>

          {/* Graph-updated badge hidden per design — keep flash + count props in case we re-enable. */}
          <div className="hidden">
            <span>{flash ? "flash" : "idle"}</span>
            <span>{nodeCount}</span>
          </div>
        </div>
      </div>
    );
  }
);

MemGQLPanel.displayName = "MemgqlPanel";
export default MemGQLPanel;
