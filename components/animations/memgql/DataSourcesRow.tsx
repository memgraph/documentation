"use client";

import React, { forwardRef } from "react";
import { useRouter } from "next/router";

type Source = {
  id: string;
  label: string;
  icon: string;
};

// Icons are colocated with the memgraph-zero page assets. We deliberately use
// a plain <img> rather than next/image: SVGs go through Next's optimizer only
// when `dangerouslyAllowSVG` is enabled in next.config, which we don't want
// to flip on globally just for these inline marks.
const ICON_BASE = "/pages/memgraph-zero/memgql";
const SOURCES: Source[] = [
  { id: "postgres", label: "Postgres", icon: `${ICON_BASE}/postgresql.svg` },
  { id: "iceberg", label: "Iceberg", icon: `${ICON_BASE}/iceberg.svg` },
  { id: "clickhouse", label: "Clickhouse", icon: `${ICON_BASE}/clickhouse.svg` },
  { id: "memgraph", label: "Memgraph", icon: `${ICON_BASE}/memgraph.svg` },
];

/**
 * Vertical column of data sources — sits on the left in horizontal layout.
 * Each card's RIGHT edge anchors an ingestion route into the MemGQL graph.
 */
const DataSourcesRow = forwardRef<HTMLDivElement>((_, ref) => {
  const { basePath } = useRouter();
  return (
    <div ref={ref} className="flex flex-col gap-3 shrink-0">
      {SOURCES.map((s, i) => (
        <div
          key={s.id}
          data-source-index={i}
          className="relative flex flex-row items-center gap-2.5 rounded-lg border border-[var(--mg-border)] bg-[var(--mg-card)] px-3.5 py-2.5 w-[148px]"
        >
          {/* mask-image lets the icon pick up the parent text color, so it
              follows the theme without per-theme SVG variants. */}
          <div
            aria-hidden
            className="opacity-90 shrink-0 bg-[var(--mg-fg)]"
            style={{
              width: 24,
              height: 24,
              WebkitMaskImage: `url(${basePath}${s.icon})`,
              maskImage: `url(${basePath}${s.icon})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          <div className="text-[13px] text-[var(--mg-fg)] leading-tight">
            {s.label}
          </div>
          <div
            data-anchor="source-out"
            className="absolute top-1/2 right-0 -translate-y-1/2 h-0 w-0"
          />
        </div>
      ))}
    </div>
  );
});

DataSourcesRow.displayName = "DataSourcesRow";
export default DataSourcesRow;
