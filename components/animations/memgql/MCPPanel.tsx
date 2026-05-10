"use client";

import React, { forwardRef, useEffect, useState } from "react";

type Props = {
  /** Bump to flash the panel — used when a dot arrives and is being processed. */
  pulseToken?: number;
};

const FLASH_MS = 380;

/**
 * Small MCP block that sits above the GQL editor and connects to MemGQL via a
 * single bidirectional arrow. Flashes when a dot arrives.
 */
const MCPPanel = forwardRef<HTMLDivElement, Props>(
  ({ pulseToken = 0 }, ref) => {
    const [flash, setFlash] = useState(false);
    useEffect(() => {
      if (pulseToken === 0) return;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), FLASH_MS);
      return () => clearTimeout(t);
    }, [pulseToken]);

    return (
      <div
        ref={ref}
        className="relative rounded-lg p-[1px] bg-gradient-to-br from-[var(--mg-rim)] to-[var(--mg-rim-fade)] w-[420px] h-[44px] shrink-0"
      >
        <div
          className={`relative flex items-center px-4 h-full rounded-[7px] transition-all duration-200 ${
            flash
              ? "bg-[var(--mg-flash-bg)] shadow-[0_0_18px_rgba(251,110,0,0.55)]"
              : "bg-[var(--mg-deep)]"
          }`}
        >
          <div
            className={`text-[10px] uppercase tracking-wider transition-colors duration-200 ${
              flash ? "text-[#FB6E00]" : "text-[var(--mg-fg-strong)]"
            }`}
          >
            MCP
          </div>
          <div className="ml-auto text-[10px] text-[var(--mg-fg-soft)]">
            Model Context Protocol
          </div>
        </div>
      </div>
    );
  }
);

MCPPanel.displayName = "MCPPanel";
export default MCPPanel;
