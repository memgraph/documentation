"use client";

// Interactive explainer of the MemGQL mapping format: every source kind a
// vertex or edge can be mapped with, shown as backend rows → graph elements,
// with the JSON that declares them. Hovering a highlighted name links the
// column, the JSON key and the property it becomes.

import React, { useEffect, useRef, useState } from "react";

type Kind = "table" | "graph" | "join" | "content" | "link";
type Tok = "c" | "p" | "l" | "n" | Kind;

const KIND_NAME: Record<Kind, string> = {
  table: "mappedTableSource",
  graph: "mappedGraphSource",
  join: "mappedJoinSource",
  content: "mappedContentSource",
  link: "linkKey",
};

const W = 760;
const H = 300;
const ROW = 21;

// ── Hover-link context ─────────────────────────────────────────────────────────

type Hl = { hl: string | null; set: (id: string | null) => void };
const HlCtx = React.createContext<Hl>({ hl: null, set: () => {} });

function useLink(id?: string) {
  const { hl, set } = React.useContext(HlCtx);
  if (!id) return { on: false, props: {} };
  return {
    on: hl === id,
    props: {
      onMouseEnter: () => set(id),
      onMouseLeave: () => set(null),
      style: { cursor: "pointer" },
    },
  };
}

// ── SVG primitives ─────────────────────────────────────────────────────────────

const d = (ms: number) => ({ animationDelay: `${ms}ms` });

function flow(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

type Col = { n: string; link?: string; w?: number; tok?: Tok };

function Card({
  x,
  y,
  w,
  h,
  conn,
  backend,
  kind,
  title,
  delay = 0,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  conn: string;
  backend: string;
  kind: "sql" | "graph";
  title?: string;
  delay?: number;
  children?: React.ReactNode;
}) {
  const head = w < 200 ? "" : backend;
  return (
    <g className="mgm-fade" style={d(delay)}>
      <rect x={x} y={y} width={w} height={h} rx={8} className="mgm-card" />
      <rect x={x + 8} y={y + 7} width={conn.length * 6.6 + 14} height={15} rx={7.5} className="mgm-connpill" />
      <text x={x + 15} y={y + 18} className="mgm-conn">
        {conn}
      </text>
      <text x={x + conn.length * 6.6 + 30} y={y + 18} className="mgm-soft">
        {head}
        {title && head ? " · " : ""}
        {title && <tspan className="mgm-strong">{title}</tspan>}
      </text>
      <g transform={`translate(${x + w - 22},${y + 8})`} className="mgm-ico">
        {kind === "sql" ? (
          <>
            <rect x={0} y={0} width={13} height={12} rx={2} />
            <line x1={0} y1={4} x2={13} y2={4} />
            <line x1={6.5} y1={4} x2={6.5} y2={12} />
          </>
        ) : (
          <>
            <circle cx={2.5} cy={9} r={2.3} />
            <circle cx={10.5} cy={9.5} r={2.3} />
            <circle cx={6.5} cy={2.5} r={2.3} />
            <line x1={3.6} y1={7} x2={5.4} y2={4.4} />
            <line x1={7.6} y1={4.4} x2={9.4} y2={7.5} />
          </>
        )}
      </g>
      {children}
    </g>
  );
}

function Table({
  x,
  y,
  w,
  conn,
  backend = "PostgreSQL",
  name,
  cols,
  rows,
  delay = 0,
  rowDelay = 250,
  dim,
  marks,
}: {
  x: number;
  y: number;
  w: number;
  conn: string;
  backend?: string;
  name: string;
  cols: Col[];
  rows: string[][];
  delay?: number;
  rowDelay?: number;
  dim?: number[];
  marks?: { row: number; col: number; n: string; delay: number }[];
}) {
  const total = cols.reduce((s, c) => s + (c.w ?? 1), 0);
  const inner = w - 16;
  let acc = x + 8;
  const xs = cols.map((c) => {
    const cx = acc;
    acc += ((c.w ?? 1) / total) * inner;
    return cx;
  });
  const h = 30 + ROW * (rows.length + 1) + 6;
  return (
    <Card x={x} y={y} w={w} h={h} conn={conn} backend={backend} kind="sql" title={name} delay={delay}>
      {cols.map((c, i) => (
        <ColHead key={c.n} c={c} x={xs[i]} y={y + 30} w={((c.w ?? 1) / total) * inner} />
      ))}
      {rows.map((r, ri) => (
        <g key={ri} className="mgm-fade" style={d(delay + 250 + ri * rowDelay)} opacity={dim?.includes(ri) ? 0.45 : 1}>
          <line x1={x + 8} x2={x + w - 8} y1={y + 30 + ROW * (ri + 1)} y2={y + 30 + ROW * (ri + 1)} className="mgm-rule" />
          {r.map((v, ci) => (
            <Cell key={ci} c={cols[ci]} x={xs[ci]} y={y + 30 + ROW * (ri + 1)} w={((cols[ci].w ?? 1) / total) * inner} v={v} />
          ))}
        </g>
      ))}
      {marks?.map((m) => {
        const cw = ((cols[m.col].w ?? 1) / total) * inner;
        return <Mark key={m.n} x={xs[m.col]} y={y + 30 + ROW * (m.row + 1) + 1} w={cw - 2} n={m.n} delay={m.delay} />;
      })}
    </Card>
  );
}

// A numbered outline pairing two equal key values.
function Mark({ x, y, w, n, delay }: { x: number; y: number; w: number; n: string; delay: number }) {
  return (
    <g className="mgm-pop" style={{ ...d(delay), transformOrigin: `${x + w / 2}px ${y + 9}px` }}>
      <rect x={x} y={y} width={w} height={ROW - 2} rx={4} className="mgm-mark" />
      <circle cx={x + w} cy={y} r={6.5} className="mgm-fill-join" />
      <text x={x + w} y={y + 3} textAnchor="middle" className="mgm-markn">
        {n}
      </text>
    </g>
  );
}

function clip(v: string, w: number) {
  const max = Math.max(3, Math.floor((w - 8) / 6.2));
  return v.length > max ? v.slice(0, max - 1) + "…" : v;
}

function ColHead({ c, x, y, w }: { c: Col; x: number; y: number; w: number }) {
  const l = useLink(c.link);
  return (
    <g {...l.props}>
      <rect x={x} y={y} width={w - 2} height={ROW} rx={3} className={l.on ? "mgm-hlbox" : "mgm-colhead"} />
      <text x={x + 5} y={y + 14.5} className={`mgm-mono mgm-t-${c.tok ?? "c"}`}>
        {clip(c.n, w)}
      </text>
    </g>
  );
}

function Cell({ c, x, y, w, v }: { c: Col; x: number; y: number; w: number; v: string }) {
  const l = useLink(c.link);
  return (
    <g {...l.props}>
      {l.on && <rect x={x} y={y + 1} width={w - 2} height={ROW - 2} rx={3} className="mgm-hlbox" />}
      <text x={x + 5} y={y + 14.5} className="mgm-mono mgm-val">
        {clip(v, w)}
      </text>
    </g>
  );
}

type Prop = { k: string; v: string; link?: string; tone?: Kind | "muted" };

function NodeCard({
  x,
  y,
  w,
  label,
  props,
  kind,
  delay = 0,
  ring,
  tag,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  props: Prop[];
  kind: Kind;
  delay?: number;
  ring?: Kind;
  tag?: string;
}) {
  const h = 26 + props.length * 18 + 6;
  return (
    <g className="mgm-pop" style={{ ...d(delay), transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}>
      {ring && <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={12} className={`mgm-ring mgm-k-${ring}`} />}
      <rect x={x} y={y} width={w} height={h} rx={9} className={`mgm-node mgm-k-${kind}`} />
      <text x={x + 10} y={y + 17} className="mgm-label">
        :{label}
      </text>
      {tag && (
        <text x={x + w - 8} y={y + 17} textAnchor="end" className="mgm-tag">
          {tag}
        </text>
      )}
      {props.map((p, i) => (
        <PropLine key={p.k + i} p={p} x={x} y={y + 26 + i * 18} w={w} />
      ))}
    </g>
  );
}

function PropLine({ p, x, y, w }: { p: Prop; x: number; y: number; w: number }) {
  const l = useLink(p.link);
  return (
    <g {...l.props}>
      {l.on && <rect x={x + 4} y={y} width={w - 8} height={17} rx={3} className="mgm-hlbox" />}
      {p.tone && p.tone !== "muted" && <rect x={x + 5} y={y + 3} width={3} height={11} rx={1.5} className={`mgm-fill-${p.tone}`} />}
      <text x={x + 12} y={y + 12.5} className={`mgm-mono ${p.tone === "muted" ? "mgm-muted" : ""}`}>
        <tspan className={p.tone === "muted" ? "" : "mgm-t-p"}>{p.k}</tspan>
        <tspan className="mgm-soft">: </tspan>
        <tspan className="mgm-val">{p.v}</tspan>
      </text>
    </g>
  );
}

function Dot({
  cx,
  cy,
  label,
  kind,
  delay = 0,
  r = 17,
  ring,
  sub,
}: {
  cx: number;
  cy: number;
  label: string;
  kind: Kind;
  delay?: number;
  r?: number;
  ring?: Kind;
  sub?: string;
}) {
  return (
    <g className="mgm-pop" style={{ ...d(delay), transformOrigin: `${cx}px ${cy}px` }}>
      {ring && <circle cx={cx} cy={cy} r={r + 4} className={`mgm-ring mgm-k-${ring}`} />}
      <circle cx={cx} cy={cy} r={r} className={`mgm-node mgm-k-${kind}`} />
      <text x={cx} y={cy + (sub ? -1 : 3.5)} textAnchor="middle" className="mgm-dotlabel">
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 10} textAnchor="middle" className="mgm-dotsub">
          {sub}
        </text>
      )}
    </g>
  );
}

function Rel({
  x1,
  y1,
  x2,
  y2,
  label,
  kind,
  delay = 0,
  bend = 0,
  dashed,
  lx,
  ly,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  kind: Kind;
  delay?: number;
  bend?: number;
  dashed?: boolean;
  lx?: number;
  ly?: number;
}) {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const p = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
  const tx = lx ?? (x1 + 2 * mx + x2) / 4;
  const ty = ly ?? (y1 + 2 * my + y2) / 4;
  return (
    <g className="mgm-fade" style={d(delay)}>
      <path d={p} pathLength={1} className={`mgm-rel mgm-s-${kind} mgm-draw ${dashed ? "mgm-dash" : ""}`} style={d(delay)} markerEnd={`url(#mgm-arr-${kind})`} />
      {label && (
        <g>
          <rect x={tx - label.length * 3.3 - 5} y={ty - 8} width={label.length * 6.6 + 10} height={15} rx={4} className="mgm-relpill" />
          <text x={tx} y={ty + 3.5} textAnchor="middle" className={`mgm-rellabel mgm-c-${kind}`}>
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function Flow({ x1, y1, x2, y2, kind, delay = 0, dot = true }: { x1: number; y1: number; x2: number; y2: number; kind: Kind; delay?: number; dot?: boolean }) {
  const p = flow(x1, y1, x2, y2);
  return (
    <g className="mgm-fade" style={d(delay)}>
      <path d={p} className={`mgm-flow mgm-s-${kind}`} />
      {dot && (
        <circle r={3} className={`mgm-fill-${kind}`}>
          <animateMotion dur="2.4s" repeatCount="indefinite" path={p} begin={`${delay / 1000}s`} />
        </circle>
      )}
    </g>
  );
}

function Chip({ x, y, kind, text, delay = 0 }: { x: number; y: number; kind: Kind; text?: string; delay?: number }) {
  const t = text ?? KIND_NAME[kind];
  const w = t.length * 6.3 + 16;
  return (
    <g className="mgm-pop" style={{ ...d(delay), transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - w / 2} y={y - 10} width={w} height={20} rx={10} className={`mgm-chip mgm-k-${kind}`} />
      <text x={x} y={y + 4} textAnchor="middle" className={`mgm-mono mgm-chiptext mgm-c-${kind}`}>
        {t}
      </text>
    </g>
  );
}

function Note({ x, y, children, anchor = "start", delay = 0 }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end"; delay?: number }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="mgm-note mgm-fade" style={d(delay)}>
      {children}
    </text>
  );
}

function Zone({ x, label }: { x: number; label: string }) {
  return (
    <text x={x} y={14} className="mgm-zone">
      {label}
    </text>
  );
}

// ── JSON with linked tokens ────────────────────────────────────────────────────
// Markup: {{kind:link:text}} where kind is c (column), p (property), l (label),
// n (connector) or a source kind (table, graph, join, content, link).

function Json({ src }: { src: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\{\{(\w+):([\w-]*):(.*?)\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src))) {
    if (m.index > last) parts.push(<Plain key={i++} s={src.slice(last, m.index)} />);
    parts.push(<JTok key={i++} kind={m[1] as Tok} link={m[2] || undefined} text={m[3]} />);
    last = re.lastIndex;
  }
  if (last < src.length) parts.push(<Plain key={i++} s={src.slice(last)} />);
  return <pre className="mgm-json">{parts}</pre>;
}

function Plain({ s }: { s: string }) {
  // Dim the JSON punctuation so the names carry the reading.
  return (
    <>
      {s.split(/("[^"]*")/).map((seg, i) =>
        seg.startsWith('"') ? (
          <span key={i} className="mgm-jkey">
            {seg}
          </span>
        ) : (
          <span key={i} className="mgm-jpunct">
            {seg}
          </span>
        ),
      )}
    </>
  );
}

function JTok({ kind, link, text }: { kind: Tok; link?: string; text: string }) {
  const l = useLink(link);
  return (
    <span {...l.props} className={`mgm-tok mgm-t-${kind} ${link ? "mgm-linked" : ""} ${l.on ? "mgm-tokon" : ""}`}>
      {text}
    </span>
  );
}

// ── Scenes ─────────────────────────────────────────────────────────────────────

type Scene = {
  id: string;
  tab: string;
  kind?: Kind;
  title: string;
  lead: React.ReactNode;
  stage: (go: (id: string) => void) => React.ReactNode;
  h?: number;
  json?: string;
  keys?: React.ReactNode;
  query?: { gql: string; runs: string[] };
  notes?: React.ReactNode[];
};

const C = ({ children }: { children: React.ReactNode }) => <code className="mgm-ic mgm-t-c">{children}</code>;
const P = ({ children }: { children: React.ReactNode }) => <code className="mgm-ic mgm-t-p">{children}</code>;
const K = ({ children }: { children: React.ReactNode }) => <code className="mgm-ic">{children}</code>;

const SCENES: Scene[] = [
  {
    id: "overview",
    tab: "Overview",
    title: "One graph, laid over several connectors",
    lead: (
      <>
        A graph mapping lists <K>vertices</K> and <K>edges</K>. Each one names a label and says where its data
        comes from with a <b>source block</b>. This store graph uses all of them: tables in PostgreSQL (<K>pg</K>),
        nodes in Memgraph (<K>mg</K>). Click any element or step through the tabs.
      </>
    ),
    stage: (go) => (
      <>
        <Zone x={12} label="CONNECTORS" />
        <Zone x={440} label="THE GRAPH YOU QUERY" />
        <Card x={12} y={26} w={300} h={118} conn="pg" backend="PostgreSQL" kind="sql">
          {["customers", "orders", "products", "ticket_content"].map((t, i) => (
            <g key={t} className="mgm-fade" style={d(150 + i * 120)}>
              <rect x={22} y={53 + 22 * i} width={9} height={9} rx={1.5} className="mgm-icofill" />
              <text x={38} y={62 + 22 * i} className="mgm-mono mgm-val">
                {t}
              </text>
            </g>
          ))}
        </Card>
        <Card x={12} y={156} w={300} h={130} conn="mg" backend="Memgraph" kind="graph">
          <g className="mgm-fade" style={d(500)}>
            <circle cx={60} cy={222} r={13} className="mgm-mini" />
            <text x={60} y={225} textAnchor="middle" className="mgm-minilabel">User</text>
            <circle cx={150} cy={250} r={13} className="mgm-mini" />
            <text x={150} y={253} textAnchor="middle" className="mgm-minilabel">Ticket</text>
            <circle cx={150} cy={196} r={13} className="mgm-mini" />
            <text x={150} y={199} textAnchor="middle" className="mgm-minilabel">Product</text>
            <line x1={72} y1={216} x2={137} y2={200} className="mgm-miniedge" />
            <line x1={72} y1={228} x2={137} y2={246} className="mgm-miniedge" />
            <path d="M50,211 C36,190 74,190 66,210" className="mgm-miniedge" fill="none" />
            <text x={196} y={200} className="mgm-mono mgm-soft">REVIEWED</text>
            <text x={196} y={254} className="mgm-mono mgm-soft">OPENED</text>
            <text x={196} y={227} className="mgm-mono mgm-soft">FOLLOWS</text>
          </g>
        </Card>
        {/* flows: source → element */}
        <Flow x1={312} y1={58} x2={452} y2={62} kind="table" delay={700} />
        <Flow x1={312} y1={80} x2={583} y2={56} kind="table" delay={800} dot={false} />
        <Flow x1={312} y1={102} x2={668} y2={62} kind="table" delay={900} />
        <Flow x1={312} y1={124} x2={668} y2={238} kind="content" delay={1000} />
        <Flow x1={312} y1={215} x2={452} y2={215} kind="graph" delay={1100} />
        <Flow x1={312} y1={240} x2={668} y2={244} kind="graph" delay={1200} dot={false} />
        <Flow x1={312} y1={196} x2={668} y2={74} kind="link" delay={1300} />
        <g className="mgm-click" onClick={() => go("table-vertex")}>
          <Dot cx={476} cy={62} label="Customer" kind="table" r={24} delay={900} />
        </g>
        <g className="mgm-click" onClick={() => go("link")}>
          <Dot cx={692} cy={62} label="Product" kind="table" r={24} ring="link" delay={1000} sub="linkKey" />
        </g>
        <g className="mgm-click" onClick={() => go("graph")}>
          <Dot cx={476} cy={215} label="User" kind="graph" r={24} delay={1100} />
        </g>
        <g className="mgm-click" onClick={() => go("content")}>
          <Dot cx={692} cy={244} label="Ticket" kind="graph" r={24} ring="content" delay={1200} sub="+ content" />
        </g>
        <g className="mgm-click" onClick={() => go("table-edge")}>
          <Rel x1={502} y1={62} x2={664} y2={62} label="PURCHASED" kind="table" delay={1400} />
        </g>
        <g className="mgm-click" onClick={() => go("join")}>
          <Rel x1={476} y1={88} x2={476} y2={189} label="HAS_ACCOUNT" kind="join" dashed delay={1500} lx={476} ly={140} />
        </g>
        <g className="mgm-click" onClick={() => go("graph")}>
          <Rel x1={496} y1={198} x2={672} y2={82} label="REVIEWED" kind="graph" delay={1600} lx={590} ly={140} />
          <Rel x1={501} y1={222} x2={666} y2={242} label="OPENED" kind="graph" delay={1700} bend={-0.05} />
          <path d="M458,236 C430,290 520,290 494,236" className="mgm-rel mgm-s-graph mgm-fade" style={d(1800)} markerEnd="url(#mgm-arr-graph)" />
          <text x={476} y={292} textAnchor="middle" className="mgm-rellabel mgm-c-graph mgm-fade" style={d(1800)}>
            FOLLOWS
          </text>
        </g>
      </>
    ),
  },
  {
    id: "table-vertex",
    tab: "Table → vertex",
    kind: "table",
    h: 272,
    title: "mappedTableSource on a vertex: one row, one node",
    lead: (
      <>
        A relational table becomes a label. Every row is a node; <K>metaFields.id</K> names the <b>column</b> that
        identifies it, and each attribute maps a <b>property</b> to a column.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="TABLE ROWS" />
        <Zone x={440} label="NODES" />
        <Table
          x={12}
          y={40}
          w={318}
          conn="pg"
          name="customers"
          cols={[
            { n: "cid", link: "cid", w: 0.6 },
            { n: "full_name", link: "name", w: 1.15 },
            { n: "email", link: "email", w: 1.25 },
            { n: "created_at", link: "created", w: 1.1 },
          ]}
          rows={[
            ["1", "Ada L.", "ada@ex.io", "2024-03-01"],
            ["2", "Alan T.", "alan@ex.io", "2024-05-12"],
            ["3", "Grace H.", "grace@ex.io", "2025-01-07"],
          ]}
          rowDelay={350}
        />
        <Flow x1={330} y1={102} x2={468} y2={70} kind="table" delay={700} />
        <Flow x1={330} y1={123} x2={505} y2={232} kind="table" delay={1050} />
        <Flow x1={330} y1={144} x2={625} y2={232} kind="table" delay={1400} />
        <Chip x={385} y={190} kind="table" delay={500} />
        <NodeCard
          x={470}
          y={30}
          w={238}
          label="Customer"
          kind="table"
          tag="id = cid 1"
          delay={800}
          props={[
            { k: "cid", v: "1", link: "cid" },
            { k: "name", v: '"Ada L."', link: "name" },
            { k: "email", v: '"ada@ex.io"', link: "email" },
            { k: "created_at", v: '"2024-03-01"', link: "created", tone: "muted" },
          ]}
        />
        <Dot cx={522} cy={232} label="Customer" sub="cid 2" kind="table" r={26} delay={1150} />
        <Dot cx={642} cy={232} label="Customer" sub="cid 3" kind="table" r={26} delay={1500} />
        <Note x={470} y={154} delay={1700}>
          grey = not declared, still readable as c.created_at
        </Note>
      </>
    ),
    json: `{ "label": {{l::"Customer"}},
  {{table::"mappedTableSource"}}: {
    "connector": {{n::"pg"}}, "table": "customers",
    "metaFields": { "id": {{c:cid:"cid"}} } },
  "attributes": [
    { "name": {{p:cid:"cid"}}, "type": "Int" },
    { "name": {{p:name:"name"}}, "column": {{c:name:"full_name"}} },
    { "name": {{p:email:"email"}} } ] }`,
    keys: (
      <>
        <K>metaFields.id</K> → column · <K>attributes[].name</K> → property · <K>attributes[].column</K> → column
        (defaults to <K>name</K>)
      </>
    ),
    query: {
      gql: "MATCH (c:Customer) WHERE c.cid = 1 RETURN c.name",
      runs: ["pg   SELECT full_name FROM customers WHERE cid = 1"],
    },
    notes: [
      <>
        <K>id</K> can be a list for a composite key, e.g. <K>["region", "order_no"]</K>.
      </>,
      <>
        <K>attributes</K> need not be exhaustive: <P>c.created_at</P> still reads column <C>created_at</C>. Declare an
        attribute to rename it, type it, or let queries route by it.
      </>,
      <>
        <K>labels: ["Cat", "Animal"]</K> gives every row several labels; a label shared by several mappings is read as a{" "}
        <K>UNION</K> of their tables.
      </>,
      <>
        <K>connector</K> may also be spelled <K>catalog</K>; <K>schema</K> / <K>database</K> qualify the table.
      </>,
    ],
  },
  {
    id: "attributes",
    tab: "Attributes & JSON",
    kind: "table",
    h: 212,
    title: "Attributes: rename, type, and reach into JSON",
    lead: (
      <>
        An attribute is <K>name</K> + optional <K>type</K>, <K>column</K> and <K>path</K>. A <K>path</K> pins one value
        inside a JSON column to its own typed property; type a column <K>Json</K> and it stays a document you can descend
        into.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="TABLE ROWS" />
        <Zone x={440} label="NODE" />
        <Table
          x={12}
          y={48}
          w={318}
          conn="pg"
          name="products"
          cols={[
            { n: "pid", link: "pid", w: 0.45 },
            { n: "title", link: "title", w: 0.9 },
            { n: "props  (jsonb)", link: "props", w: 2.3 },
          ]}
          rows={[
            ["10", "Desk lamp", '{"dims":{"weight":1.2},"color":"red"}'],
            ["11", "Chair", '{"dims":{"weight":7.5},"rohs":true}'],
          ]}
        />
        <Flow x1={330} y1={110} x2={478} y2={93} kind="table" delay={700} />
        <Flow x1={330} y1={110} x2={478} y2={133} kind="table" delay={850} />
        <Chip x={392} y={52} kind="table" text={'path "dims.weight"'} delay={1000} />
        <Chip x={392} y={176} kind="table" text={'type "Json"'} delay={1100} />
        <NodeCard
          x={470}
          y={40}
          w={260}
          label="Product"
          kind="table"
          tag="id = pid 10"
          delay={600}
          props={[
            { k: "pid", v: "10", link: "pid" },
            { k: "title", v: '"Desk lamp"', link: "title" },
            { k: "weight", v: "1.2  (Double)", link: "weight" },
            { k: "props", v: '{dims: {…}, color: "red"}', link: "props" },
          ]}
        />
        <Note x={470} y={176} delay={1300}>
          p.props.color → "red"   (undeclared key, still reachable)
        </Note>
        <Note x={470} y={196} delay={1450}>
          p.weight &gt; 5 compares numbers, not text
        </Note>
      </>
    ),
    json: `{ "label": {{l::"Product"}},
  {{table::"mappedTableSource"}}: {
    "connector": {{n::"pg"}}, "table": "products",
    "metaFields": { "id": {{c:pid:"pid"}} } },
  "attributes": [
    { "name": {{p:pid:"pid"}}, "type": "Int" },
    { "name": {{p:title:"title"}} },
    { "name": {{p:weight:"weight"}}, "column": {{c:props:"props"}},
      "path": {{c:weight:"dims.weight"}}, "type": "Double" },
    { "name": {{p:props:"props"}}, "type": "Json" } ] }`,
    keys: (
      <>
        <K>name</K> → property · <K>column</K> → column · <K>path</K> → location inside that column ·{" "}
        <K>type</K> default <K>String</K>
      </>
    ),
    query: {
      gql: "MATCH (p:Product) WHERE p.weight > 5 RETURN p.title",
      runs: ["pg   SELECT title FROM products WHERE CAST(props #>> '{dims,weight}' AS DOUBLE PRECISION) > 5"],
    },
    notes: [
      <>
        Types: <K>Boolean</K> <K>Int</K> <K>Long</K> <K>Float</K> <K>Double</K> <K>Decimal</K> <K>String</K> <K>Date</K>{" "}
        <K>DateTime</K> <K>Json</K> and more. Recorded, not enforced; a <K>path</K> uses it for the cast.
      </>,
      <>
        <K>path</K> attributes are read-only, and need a backend with JSON support: PostgreSQL, MySQL, DuckDB, SQL Server,
        Fabric, Snowflake.
      </>,
      <>On an edge, attributes work the same way. On a native graph source, only names and types apply.</>,
    ],
  },
  {
    id: "table-edge",
    tab: "Table → edge",
    kind: "table",
    title: "mappedTableSource on an edge: one row, one relationship",
    lead: (
      <>
        An edge table (often a fact or link table) becomes a relationship type. <K>metaFields.from</K> and{" "}
        <K>metaFields.to</K> name the foreign-key <b>columns</b> that point at each endpoint's <K>id</K>.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="TABLE ROWS" />
        <Zone x={440} label="RELATIONSHIPS" />
        <Table x={12} y={26} w={150} conn="pg" name="customers" cols={[{ n: "cid", link: "from" }, { n: "…" }]} rows={[["1", ""], ["2", ""]]} />
        <Table x={180} y={26} w={150} conn="pg" name="products" cols={[{ n: "pid", link: "to" }, { n: "…" }]} rows={[["10", ""], ["11", ""]]} />
        <Table
          x={12}
          y={150}
          w={318}
          conn="pg"
          name="orders"
          cols={[
            { n: "oid", link: "oid" },
            { n: "cid", link: "from" },
            { n: "pid", link: "to" },
            { n: "qty", link: "qty" },
          ]}
          rows={[
            ["100", "1", "10", "2"],
            ["101", "2", "10", "1"],
            ["102", "1", "11", "4"],
          ]}
          delay={300}
          rowDelay={350}
        />
        <path d="M108,180 C108,160 50,150 50,120" className="mgm-fk mgm-fade" style={d(700)} markerEnd="url(#mgm-arr-table)" />
        <path d="M184,180 C184,160 218,150 218,120" className="mgm-fk mgm-fade" style={d(800)} markerEnd="url(#mgm-arr-table)" />
        <Note x={60} y={146} delay={900}>
          from
        </Note>
        <Note x={226} y={146} delay={900}>
          to
        </Note>
        <Dot cx={490} cy={70} label="Customer" sub="cid 1" kind="table" r={26} delay={500} />
        <Dot cx={490} cy={220} label="Customer" sub="cid 2" kind="table" r={26} delay={500} />
        <Dot cx={700} cy={70} label="Product" sub="pid 10" kind="table" r={26} delay={600} />
        <Dot cx={700} cy={220} label="Product" sub="pid 11" kind="table" r={26} delay={600} />
        <Rel x1={516} y1={70} x2={670} y2={70} label="PURCHASED qty 2" kind="table" delay={900} />
        <Rel x1={512} y1={205} x2={676} y2={85} label="qty 1" kind="table" delay={1250} lx={630} ly={120} />
        <Rel x1={512} y1={84} x2={676} y2={204} label="qty 4" kind="table" delay={1600} lx={630} ly={180} />
        <Flow x1={330} y1={222} x2={590} y2={70} kind="table" delay={1000} dot={false} />
        <Flow x1={330} y1={243} x2={630} y2={120} kind="table" delay={1350} dot={false} />
        <Flow x1={330} y1={264} x2={630} y2={180} kind="table" delay={1700} dot={false} />
      </>
    ),
    json: `{ "label": {{l::"PURCHASED"}},
  "from": {{l::"Customer"}}, "to": {{l::"Product"}},
  {{table::"mappedTableSource"}}: {
    "connector": {{n::"pg"}}, "table": "orders",
    "metaFields": {
      "id": {{c:oid:"oid"}}, "from": {{c:from:"cid"}}, "to": {{c:to:"pid"}} } },
  "attributes": [ { "name": {{p:qty:"qty"}}, "type": "Int" } ] }`,
    keys: (
      <>
        edge <K>from</K> / <K>to</K> → vertex <b>labels</b> · <K>metaFields.from</K> / <K>to</K> → <b>columns</b>{" "}
        holding the endpoints' <K>id</K> values
      </>
    ),
    query: {
      gql: "MATCH (c:Customer)-[o:PURCHASED]->(p:Product) RETURN c.name, o.qty, p.title",
      runs: ["pg   SELECT c.full_name, o.qty, p.title FROM customers c JOIN orders o ON o.cid = c.cid JOIN products p ON p.pid = o.pid"],
    },
    notes: [
      <>
        <K>from</K> and <K>to</K> are required on a table edge. A list declares a composite key, matched by position
        against the endpoint's <K>id</K> list.
      </>,
      <>Both endpoints must be in the same connector as the edge table. To cross connectors, use a join edge.</>,
    ],
  },
  {
    id: "graph",
    tab: "Native graph",
    kind: "graph",
    title: "mappedGraphSource: the backend already is a graph",
    lead: (
      <>
        On Memgraph or Neo4j there is nothing to translate: the query passes through as Cypher. The source names only
        the connector, plus the backend's own <K>label</K> when it is exposed under another name.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="MEMGRAPH AS STORED" />
        <Zone x={440} label="AS EXPOSED" />
        <Card x={12} y={30} w={318} h={250} conn="mg" backend="Memgraph" kind="graph">
          <Dot cx={80} cy={110} label="Account" sub="uid 1" kind="graph" r={28} delay={200} />
          <Dot cx={250} cy={110} label="Account" sub="uid 2" kind="graph" r={28} delay={300} />
          <Dot cx={165} cy={225} label="Account" sub="uid 3" kind="graph" r={28} delay={400} />
          <Rel x1={108} y1={110} x2={218} y2={110} label="FOLLOWS" kind="graph" delay={600} />
          <Rel x1={240} y1={136} x2={188} y2={203} label="FOLLOWS" kind="graph" delay={700} />
          <Rel x1={96} y1={133} x2={142} y2={202} label="FOLLOWS" kind="graph" delay={800} />
        </Card>
        <Chip x={385} y={150} kind="graph" delay={900} />
        <Flow x1={330} y1={110} x2={440} y2={110} kind="graph" delay={1000} />
        <Note x={385} y={180} anchor="middle" delay={1100}>
          label "Account" → User
        </Note>
        <Dot cx={500} cy={110} label="User" sub="uid 1" kind="graph" r={28} delay={1200} />
        <Dot cx={670} cy={110} label="User" sub="uid 2" kind="graph" r={28} delay={1300} />
        <Dot cx={585} cy={225} label="User" sub="uid 3" kind="graph" r={28} delay={1400} />
        <Rel x1={528} y1={110} x2={638} y2={110} label="FOLLOWS" kind="graph" delay={1600} />
        <Rel x1={660} y1={136} x2={608} y2={203} label="FOLLOWS" kind="graph" delay={1700} />
        <Rel x1={516} y1={133} x2={562} y2={202} label="FOLLOWS" kind="graph" delay={1800} />
      </>
    ),
    json: `{ "label": {{l:user:"User"}},
  {{graph::"mappedGraphSource"}}: {
    "connector": {{n::"mg"}}, "label": {{l:user:"Account"}} },
  "attributes": [ { "name": {{p::"uid"}}, "type": "Int" },
                  { "name": {{p::"handle"}} } ] },

{ "label": {{l::"FOLLOWS"}}, "from": {{l::"User"}}, "to": {{l::"User"}},
  {{graph::"mappedGraphSource"}}: { "connector": {{n::"mg"}} } }`,
    keys: (
      <>
        no <K>metaFields</K>: the backend's own ids identify nodes · <K>mappedGraphSource.label</K> → the backend's name
        for the label or relationship type
      </>
    ),
    query: {
      gql: "MATCH (u:User)-[:FOLLOWS]->(v:User) RETURN v.handle",
      runs: ["mg   MATCH (u:Account)-[:FOLLOWS]->(v:Account) RETURN v.handle"],
    },
    notes: [
      <>
        Properties are not renamed: <K>column</K> / <K>path</K> on a native attribute are not applied.
      </>,
      <>
        <K>"discover": ["mg"]</K> on the graph reads every label and relationship type from the backend, so you don't
        have to list them.
      </>,
      <>
        A relationship type used between several label pairs is declared once per pair. A native multi-label type is
        spelled <K>"CAT:Product"</K>.
      </>,
    ],
  },
  {
    id: "join",
    tab: "Join edge",
    kind: "join",
    title: "mappedJoinSource: an edge with no table anywhere",
    lead: (
      <>
        The relationship <i>is</i> equality of one <b>property</b> on each endpoint. It is how a traversal crosses
        from one connector into another, here from PostgreSQL customers to Memgraph users.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="TWO CONNECTORS" />
        <Zone x={440} label="EDGES WHERE THE KEYS MATCH" />
        <Table
          x={12}
          y={26}
          w={318}
          conn="pg"
          name="customers"
          cols={[
            { n: "cid", w: 0.5 },
            { n: "full_name", w: 1 },
            { n: "email", link: "fromKey", w: 1.3 },
          ]}
          rows={[
            ["1", "Ada L.", "ada@ex.io"],
            ["2", "Alan T.", "alan@ex.io"],
            ["3", "Grace H.", "grace@ex.io"],
          ]}
          dim={[1]}
          marks={[
            { row: 0, col: 2, n: "1", delay: 900 },
            { row: 2, col: 2, n: "2", delay: 1100 },
          ]}
        />
        <Card x={12} y={160} w={318} h={124} conn="mg" backend="Memgraph" kind="graph">
          {[
            ["ada@ex.io", 70, "1"],
            ["bob@ex.io", 165, ""],
            ["grace@ex.io", 260, "2"],
          ].map(([e, cx, n], i) => (
            <g key={i} opacity={i === 1 ? 0.45 : 1}>
              <Dot cx={cx as number} cy={214} label="User" kind="graph" r={20} delay={300 + i * 100} />
              <LinkedText x={cx as number} y={252} link="toKey" text="email" />
              <LinkedText x={cx as number} y={267} link="toKey" text={e as string} />
              {n && <Mark x={(cx as number) - 42} y={256} w={84} n={n as string} delay={n === "1" ? 900 : 1100} />}
            </g>
          ))}
        </Card>
        <Dot cx={500} cy={60} label="Customer" sub="cid 1" kind="table" r={26} delay={1200} />
        <Dot cx={500} cy={150} label="Customer" sub="cid 2" kind="table" r={26} delay={1250} />
        <Dot cx={500} cy={240} label="Customer" sub="cid 3" kind="table" r={26} delay={1300} />
        <Dot cx={690} cy={60} label="User" sub="ada" kind="graph" r={26} delay={1350} />
        <Dot cx={690} cy={150} label="User" sub="bob" kind="graph" r={26} delay={1400} />
        <Dot cx={690} cy={240} label="User" sub="grace" kind="graph" r={26} delay={1450} />
        <Rel x1={526} y1={60} x2={660} y2={60} label="HAS_ACCOUNT" kind="join" dashed delay={1700} />
        <Rel x1={526} y1={240} x2={660} y2={240} label="HAS_ACCOUNT" kind="join" dashed delay={1900} />
        <Mark x={540} y={46} w={0} n="1" delay={1700} />
        <Mark x={540} y={226} w={0} n="2" delay={1900} />
        <Note x={595} y={154} anchor="middle" delay={2100}>
          no match, no edge
        </Note>
      </>
    ),
    json: `{ "label": {{l::"HAS_ACCOUNT"}},
  "from": {{l::"Customer"}}, "to": {{l::"User"}},
  {{join::"mappedJoinSource"}}: {
    "fromKey": {{p:fromKey:"email"}}, "toKey": {{p:toKey:"email"}} } }`,
    keys: (
      <>
        <K>fromKey</K> / <K>toKey</K> → <b>properties</b> of the endpoint vertices (each resolved through its own
        mapping), not columns
      </>
    ),
    query: {
      gql: "MATCH (c:Customer)-[:HAS_ACCOUNT]->(u:User) RETURN c.name, u.handle",
      runs: [
        "pg   SELECT full_name, email FROM customers",
        "mg   MATCH (u:User) WHERE u.email IN [$emails] RETURN u.email, u.handle",
        "     join on email inside MemGQL",
      ],
    },
    notes: [
      <>No connector, no attributes: the edge has no rows, so it cannot be filtered. Filter the endpoints.</>,
      <>Across connectors: traverse it in a direction, in a single MATCH, with a label on every node.</>,
      <>
        Within one relational connector it is pushed down as one SQL <K>JOIN</K>: a business-key link instead of a
        foreign key into <K>id</K>.
      </>,
    ],
  },
  {
    id: "content",
    tab: "Content source",
    kind: "content",
    h: 262,
    title: "mappedContentSource: some properties live in another connector",
    lead: (
      <>
        A vertex keeps its identity, edges and a few hot properties in its own source, and reads bulky ones (text,
        documents) from a table in <b>another</b> relational connector. Queries see one node.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="TWO HOMES" />
        <Zone x={440} label="ONE NODE" />
        <Card x={12} y={26} w={318} h={110} conn="mg" backend="Memgraph" kind="graph">
          <Dot cx={92} cy={84} label="Ticket" kind="graph" r={24} delay={200} />
          <text x={128} y={74} className="mgm-mono">
            <LinkedSpan link="key" text="ticketId" cls="mgm-t-p" />
            <tspan className="mgm-val">: "T-1"</tspan>
          </text>
          <text x={128} y={94} className="mgm-mono">
            <LinkedSpan link="priority" text="priority" cls="mgm-t-p" />
            <tspan className="mgm-val">: "high"</tspan>
          </text>
        </Card>
        <Table
          x={12}
          y={150}
          w={318}
          conn="docs"
          name="ticket_content"
          cols={[
            { n: "ticket_id", link: "key", w: 0.9 },
            { n: "subject", link: "subject", w: 1 },
            { n: "body", link: "description", w: 1.5 },
          ]}
          rows={[
            ["T-1", "Login fails", "After the reset I can't…"],
            ["T-2", "Invoice", "Please send a copy…"],
          ]}
          dim={[1]}
          delay={300}
        />
        <Flow x1={330} y1={80} x2={470} y2={78} kind="graph" delay={800} />
        <Flow x1={330} y1={222} x2={470} y2={132} kind="content" delay={1000} />
        <Chip x={600} y={226} kind="content" delay={1100} />
        <Note x={600} y={252} anchor="middle" delay={1200}>
          ticketId = ticket_id
        </Note>
        <NodeCard
          x={470}
          y={44}
          w={260}
          label="Ticket"
          kind="graph"
          ring="content"
          delay={900}
          props={[
            { k: "ticketId", v: '"T-1"', link: "key", tone: "graph" },
            { k: "priority", v: '"high"', link: "priority", tone: "graph" },
            { k: "subject", v: '"Login fails"', link: "subject", tone: "content" },
            { k: "description", v: '"After the reset I…"', link: "description", tone: "content" },
          ]}
        />
        <Note x={470} y={162} delay={1500}>
          content table is read only when a query
        </Note>
        <Note x={470} y={176} delay={1500}>
          filters on or returns one of its properties
        </Note>
      </>
    ),
    json: `{ "label": {{l::"Ticket"}},
  {{graph::"mappedGraphSource"}}: { "connector": {{n::"mg"}} },
  "attributes": [ { "name": {{p:key:"ticketId"}} },
                  { "name": {{p:priority:"priority"}} } ],
  {{content::"mappedContentSource"}}: {
    "connector": {{n::"docs"}}, "table": "ticket_content",
    "key": {{p:key:"ticketId"}}, "keyColumn": {{c:key:"ticket_id"}},
    "attributes": [
      { "name": {{p:subject:"subject"}} },
      { "name": {{p:description:"description"}}, "column": {{c:description:"body"}} } ] } }`,
    keys: (
      <>
        <K>key</K> → a <b>property</b> of the vertex · <K>keyColumn</K> → the content-table <b>column</b> holding it
        (defaults to <K>key</K>) · its own <K>attributes</K> list
      </>
    ),
    query: {
      gql: "MATCH (t:Ticket) WHERE t.subject CONTAINS 'login' RETURN t.ticketId, t.description",
      runs: [
        "docs SELECT ticket_id, body FROM ticket_content WHERE subject LIKE '%login%'",
        "mg   MATCH (t:Ticket) WHERE t.ticketId IN [$ids] RETURN t.ticketId",
        "     merged into one Ticket per id",
      ],
    },
    notes: [
      <>Works on top of a table or a graph vertex. Vertices only.</>,
      <>
        Each property has one home: a name is in the vertex's <K>attributes</K> or in the content{" "}
        <K>attributes</K>, never both.
      </>,
      <>
        The content connector is relational and differs from the vertex's own. Here the key is spelled{" "}
        <K>connector</K> only (no <K>catalog</K> alias).
      </>,
      <>A query reading content is a single MATCH … RETURN.</>,
    ],
  },
  {
    id: "link",
    tab: "linkKey",
    kind: "link",
    title: "linkKey: one vertex declared in several connectors",
    lead: (
      <>
        The same entity lives in more than one database. Declare its label once per connector and give every
        declaration the same <K>linkKey</K>, a <b>property</b>; a path may then cross from one connector to the other
        at that node.
      </>
    ),
    stage: () => (
      <>
        <Zone x={12} label="SAME PRODUCT, TWO CONNECTORS" />
        <Zone x={440} label="ONE NODE, ONE PATH" />
        <Table
          x={12}
          y={26}
          w={318}
          conn="pg"
          name="products"
          cols={[
            { n: "pid", w: 0.5 },
            { n: "sku", link: "sku", w: 0.9 },
            { n: "title", link: "title", w: 1.2 },
          ]}
          rows={[["10", "SKU-7", "Desk lamp"]]}
        />
        <Card x={12} y={138} w={318} h={146} conn="mg" backend="Memgraph" kind="graph">
          <Dot cx={70} cy={222} label="User" sub="ada" kind="graph" r={24} delay={300} />
          <Dot cx={220} cy={222} label="Product" kind="graph" r={26} delay={400} />
          <Rel x1={94} y1={222} x2={192} y2={222} label="REVIEWED" kind="graph" delay={600} />
          <text x={220} y={266} textAnchor="middle" className="mgm-mono">
            <LinkedSpan link="sku" text="sku" cls="mgm-t-p" />
            <tspan className="mgm-val">: "SKU-7" · </tspan>
            <LinkedSpan link="rating" text="avgRating" cls="mgm-t-p" />
            <tspan className="mgm-val">: 4.6</tspan>
          </text>
        </Card>
        <Flow x1={330} y1={78} x2={598} y2={118} kind="table" delay={800} />
        <Flow x1={330} y1={222} x2={598} y2={150} kind="graph" delay={900} />
        <Chip x={390} y={140} kind="link" text={'linkKey "sku"'} delay={1000} />
        <Dot cx={480} cy={52} label="Customer" sub="pg" kind="table" r={26} delay={1100} />
        <Dot cx={480} cy={232} label="User" sub="mg" kind="graph" r={26} delay={1150} />
        <NodeCard
          x={600}
          y={92}
          w={150}
          label="Product"
          kind="table"
          ring="link"
          delay={1200}
          props={[
            { k: "sku", v: '"SKU-7"', link: "sku", tone: "link" },
            { k: "title", v: '"Desk lamp"', link: "title", tone: "table" },
            { k: "avgRating", v: "4.6", link: "rating", tone: "graph" },
          ]}
        />
        <Rel x1={504} y1={62} x2={606} y2={94} label="PURCHASED" kind="table" delay={1500} lx={548} ly={64} />
        <Rel x1={504} y1={222} x2={606} y2={170} label="REVIEWED" kind="graph" delay={1700} lx={550} ly={218} />
      </>
    ),
    json: `{ "label": {{l::"Product"}},
  {{table::"mappedTableSource"}}: {
    "connector": {{n::"pg"}}, "table": "products",
    "metaFields": { "id": {{c::"pid"}} } },
  "attributes": [ { "name": {{p:sku:"sku"}} }, { "name": {{p:title:"title"}} } ],
  {{link::"linkKey"}}: {{p:sku:"sku"}} },

{ "label": {{l::"Product"}},
  {{graph::"mappedGraphSource"}}: { "connector": {{n::"mg"}} },
  {{link::"linkKey"}}: {{p:sku:"sku"}} }`,
    keys: (
      <>
        <K>linkKey</K> → a <b>property</b>: a declared plain attribute on a table, the stored property name on
        Memgraph / Neo4j
      </>
    ),
    query: {
      gql: "MATCH (c:Customer)-[:PURCHASED]->(p:Product)<-[:REVIEWED]-(u:User) RETURN c, p, u",
      runs: [
        "pg   SELECT … FROM customers JOIN orders JOIN products   → sku values",
        "mg   MATCH (p:Product)<-[:REVIEWED]-(u:User) WHERE p.sku IN [$skus] RETURN …",
        "     joined on sku: RETURN p is one node with both halves",
      ],
    },
    notes: [
      <>Each edge reads the declaration in its own connector: PURCHASED in pg, REVIEWED in mg.</>,
      <>
        At most one declaration per connector, all naming the same <K>linkKey</K>. A label declared twice without it is
        a duplicate.
      </>,
      <>
        Doesn't combine with <K>mappedContentSource</K>. <K>MATCH (p:Product)</K> alone, with no relationship to place
        it, is refused.
      </>,
    ],
  },
];

function LinkedText({ x, y, link, text }: { x: number; y: number; link: string; text: string }) {
  const l = useLink(link);
  return (
    <text x={x} y={y} textAnchor="middle" className={`mgm-mono ${l.on ? "mgm-t-p mgm-bold" : "mgm-val"}`} {...l.props}>
      {text}
    </text>
  );
}

function LinkedSpan({ link, text, cls }: { link: string; text: string; cls: string }) {
  const l = useLink(link);
  return (
    <tspan className={`${cls} ${l.on ? "mgm-bold mgm-under" : ""}`} {...l.props}>
      {text}
    </tspan>
  );
}

// ── Overview matrix ────────────────────────────────────────────────────────────

const MATRIX: { k: Kind; on: string; conn: React.ReactNode; ids: React.ReactNode; names: string; attrs: string; go: string }[] = [
  { k: "table", on: "vertex, edge", conn: <><K>connector</K> (or <K>catalog</K>)</>, ids: <K>metaFields.id / from / to</K>, names: "columns", attrs: "on the element", go: "table-vertex" },
  { k: "graph", on: "vertex, edge", conn: <><K>connector</K> (or <K>catalog</K>)</>, ids: <>backend ids</>, names: "n/a", attrs: "on the element (names, types)", go: "graph" },
  { k: "join", on: "edge", conn: "none", ids: <K>fromKey / toKey</K>, names: "properties", attrs: "none", go: "join" },
  { k: "content", on: "vertex, add-on", conn: <K>connector</K>, ids: <K>key + keyColumn</K>, names: "property + column", attrs: "inside the block", go: "content" },
  { k: "link", on: "vertex, once per connector", conn: "from its source", ids: <K>linkKey</K>, names: "property", attrs: "on each declaration", go: "link" },
];

function Matrix({ go }: { go: (id: string) => void }) {
  return (
    <div className="mgm-matrixwrap">
      <table className="mgm-matrix">
        <thead>
          <tr>
            <th>Source</th>
            <th>Used on</th>
            <th>Connector key</th>
            <th>Rows / ends found by</th>
            <th>Key fields name</th>
            <th>Attributes live</th>
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((r) => (
            <tr key={r.k} onClick={() => go(r.go)}>
              <td>
                <span className={`mgm-sw mgm-fill-${r.k}`} />
                <code className={`mgm-c-${r.k}`}>{KIND_NAME[r.k]}</code>
              </td>
              <td>{r.on}</td>
              <td>{r.conn}</td>
              <td>{r.ids}</td>
              <td>
                <span className={r.names.includes("column") ? "mgm-t-c" : r.names.includes("propert") ? "mgm-t-p" : ""}>{r.names}</span>
              </td>
              <td>{r.attrs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────────

const AUTO_MS = 11000;

export default function MemGQLMappings() {
  const [idx, setIdx] = useState(0);
  const [hl, setHl] = useState<string | null>(null);
  const [auto, setAuto] = useState(false);
  const [userStopped, setUserStopped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scene = SCENES[idx];

  // Tour the scenes while the visual is on screen, until the reader takes over.
  useEffect(() => {
    if (userStopped) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setAuto(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [userStopped]);

  useEffect(() => {
    if (!auto || hl) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SCENES.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, idx, hl]);

  const go = (id: string) => {
    const i = SCENES.findIndex((s) => s.id === id);
    if (i >= 0) pick(i);
  };
  const pick = (i: number) => {
    setUserStopped(true);
    setAuto(false);
    setHl(null);
    setIdx(i);
  };
  const toggle = () => {
    if (auto) {
      setUserStopped(true);
      setAuto(false);
    } else {
      setUserStopped(false);
      setAuto(true);
    }
  };

  return (
    <HlCtx.Provider value={{ hl, set: setHl }}>
      <div className="mgm" ref={rootRef}>
        <style>{CSS}</style>
        <div className="mgm-tabs" role="tablist" aria-label="Mapping types">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === idx}
              className={`mgm-tabbtn ${i === idx ? "mgm-tabon" : ""}`}
              onClick={() => pick(i)}
            >
              {s.kind && <span className={`mgm-sw mgm-fill-${s.kind}`} />}
              {s.tab}
            </button>
          ))}
          <button className="mgm-play" onClick={toggle} aria-label={auto ? "Pause tour" : "Play tour"} title={auto ? "Pause tour" : "Play tour"}>
            {auto ? "❚❚" : "▶"}
          </button>
        </div>
        {auto && !hl && <div key={idx} className="mgm-progress" style={{ animationDuration: `${AUTO_MS}ms` }} />}

        <div className="mgm-head">
          <div className="mgm-title">{scene.title}</div>
          <div className="mgm-lead">{scene.lead}</div>
        </div>

        <div className="mgm-stagewrap">
          <svg className="mgm-stage" viewBox={`0 0 ${W} ${scene.h ?? H}`} role="img" aria-label={scene.title}>
            <defs>
              {(["table", "graph", "join", "content", "link"] as Kind[]).map((k) => (
                <marker key={k} id={`mgm-arr-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className={`mgm-fill-${k}`} />
                </marker>
              ))}
            </defs>
            <g key={scene.id}>{scene.stage(go)}</g>
          </svg>
        </div>

        {scene.id === "overview" ? (
          <>
            <Matrix go={go} />
            <div className="mgm-legend">
              <span>
                <b className="mgm-t-c">column</b> a name in the backend table
              </span>
              <span>
                <b className="mgm-t-p">property</b> a name queries use (<K>n.email</K>)
              </span>
              <span>Every vertex and edge has exactly one base source; a vertex may add a content source or a linkKey.</span>
            </div>
          </>
        ) : (
          <div key={scene.id} className="mgm-detail">
            <div className="mgm-col">
              <div className="mgm-cap">
                Mapping JSON <span className="mgm-hint">hover a colored name</span>
              </div>
              {scene.json && <Json src={scene.json} />}
              {scene.keys && <div className="mgm-keys">{scene.keys}</div>}
            </div>
            <div className="mgm-col">
              {scene.query && (
                <>
                  <div className="mgm-cap">A query, and roughly what runs</div>
                  <div className="mgm-query">
                    <div className="mgm-gql">{scene.query.gql}</div>
                    {scene.query.runs.map((r, i) => (
                      <div key={i} className="mgm-run mgm-fade" style={d(400 + i * 350)}>
                        <span className="mgm-arrow">↳</span>
                        {r}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {scene.notes && (
                <ul className="mgm-notes">
                  {scene.notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="mgm-foot">
          <button className="mgm-nav" onClick={() => pick((idx + SCENES.length - 1) % SCENES.length)} aria-label="Previous">
            ←
          </button>
          <span className="mgm-count">
            {idx + 1} / {SCENES.length}
          </span>
          <button className="mgm-nav" onClick={() => pick((idx + 1) % SCENES.length)} aria-label="Next">
            →
          </button>
        </div>
      </div>
    </HlCtx.Provider>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
// Scoped under .mgm; dark mode follows Nextra's `html.dark`.

const CSS = `
.mgm{--bg:#fff;--panel:#fafafa;--card:#fff;--fg:#3f3f46;--soft:#71717a;--strong:#18181b;--bd:#0000001a;--rule:#0000000f;
--code:#f6f6f7;--hl:#fde68a66;--col:#b45309;--prop:#15803d;--lab:#18181b;
--table:#2563eb;--graph:#c026d3;--join:#dc2626;--content:#0d9488;--link:#6d28d9;
font-family:inherit;color:var(--fg);background:var(--panel);border:1px solid var(--bd);border-radius:12px;
padding:14px 14px 10px;margin:24px 0;position:relative;overflow:hidden;container:mgm/inline-size}
:is(html.dark,[data-theme="dark"]) .mgm{--bg:#0f0f10;--panel:#141414;--card:#1c1a1b;--fg:#c9c7ca;--soft:#a1a1aa;--strong:#fff;
--bd:#ffffff22;--rule:#ffffff12;--code:#0c0c0d;--hl:#fbbf2433;--col:#fbbf24;--prop:#4ade80;--lab:#fff;
--table:#60a5fa;--graph:#e879f9;--join:#f87171;--content:#2dd4bf;--link:#a78bfa}
.mgm *{box-sizing:border-box}
.mgm code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
.mgm-tabs{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.mgm-tabbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--bd);background:var(--card);color:var(--fg);
border-radius:999px;padding:4px 11px;font-size:12.5px;cursor:pointer;line-height:1.4;transition:background .15s,border-color .15s}
.mgm-tabbtn:hover{border-color:var(--soft)}
.mgm-tabon{background:var(--strong);color:var(--bg);border-color:var(--strong)}
.mgm-play{margin-left:auto;border:1px solid var(--bd);background:var(--card);color:var(--fg);border-radius:999px;width:30px;height:26px;
font-size:10px;cursor:pointer}
.mgm-sw{display:inline-block;width:8px;height:8px;border-radius:2px;flex:none}
.mgm-progress{height:2px;margin-top:8px;background:linear-gradient(90deg,#FFC500,#DD2222,#8C0082);transform-origin:left;
animation:mgm-prog linear both}
@keyframes mgm-prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.mgm-head{margin:12px 2px 4px}
.mgm-title{font-weight:600;color:var(--strong);font-size:15px}
.mgm-lead{font-size:13.5px;line-height:1.55;margin-top:3px;max-width:62em}
.mgm-ic{font-size:12px;background:var(--code);border:1px solid var(--rule);border-radius:4px;padding:0 4px}
.mgm-stagewrap{overflow-x:auto;margin:6px -4px 0}
.mgm-stage{display:block;width:100%;min-width:640px;height:auto;font-size:11px}
.mgm-stage text{fill:var(--fg)}
.mgm-zone{font-size:9.5px;letter-spacing:.12em;fill:var(--soft)!important;font-weight:600}
.mgm-card{fill:var(--card);stroke:var(--bd)}
.mgm-connpill{fill:var(--code);stroke:var(--bd)}
.mgm-conn{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;fill:var(--strong)!important;font-weight:600}
.mgm-soft{fill:var(--soft)!important;color:var(--soft)}
.mgm-strong{fill:var(--strong)!important;font-weight:600}
.mgm-ico{fill:none;stroke:var(--soft);stroke-width:1.1}
.mgm-icofill{fill:none;stroke:var(--table);stroke-width:1.2}
.mgm-colhead{fill:var(--code)}
.mgm-hlbox{fill:var(--hl)}
.mgm-rule{stroke:var(--rule)}
.mgm-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px}
.mgm-val{fill:var(--fg)!important}
.mgm-muted{fill:var(--soft)!important;opacity:.8}
.mgm-bold{font-weight:700}
.mgm-under{text-decoration:underline}
.mgm-t-c{fill:var(--col)!important;color:var(--col)}
.mgm-t-p{fill:var(--prop)!important;color:var(--prop)}
.mgm-t-l{color:var(--lab);font-weight:600}
.mgm-t-n{color:var(--soft);font-style:italic}
.mgm-node{stroke-width:1.6;fill:var(--card)}
.mgm-k-table{stroke:var(--table)}.mgm-k-graph{stroke:var(--graph)}.mgm-k-join{stroke:var(--join)}.mgm-k-content{stroke:var(--content)}.mgm-k-link{stroke:var(--link)}
.mgm-ring{fill:none;stroke-width:2;stroke-dasharray:5 3}
.mgm-fill-table{fill:var(--table);background:var(--table)}.mgm-fill-graph{fill:var(--graph);background:var(--graph)}
.mgm-fill-join{fill:var(--join);background:var(--join)}.mgm-fill-content{fill:var(--content);background:var(--content)}
.mgm-fill-link{fill:var(--link);background:var(--link)}
.mgm-c-table{fill:var(--table)!important;color:var(--table)}.mgm-c-graph{fill:var(--graph)!important;color:var(--graph)}
.mgm-c-join{fill:var(--join)!important;color:var(--join)}.mgm-c-content{fill:var(--content)!important;color:var(--content)}
.mgm-c-link{fill:var(--link)!important;color:var(--link)}
.mgm-s-table{stroke:var(--table)}.mgm-s-graph{stroke:var(--graph)}.mgm-s-join{stroke:var(--join)}.mgm-s-content{stroke:var(--content)}.mgm-s-link{stroke:var(--link)}
.mgm-label{font-weight:700;font-size:11.5px;fill:var(--strong)!important}
.mgm-tag{font-size:9.5px;fill:var(--soft)!important}
.mgm-dotlabel{font-size:9.5px;font-weight:600;fill:var(--strong)!important}
.mgm-dotsub{font-size:8.5px;fill:var(--soft)!important}
.mgm-rel{fill:none;stroke-width:1.6}
.mgm-dash{stroke-dasharray:5 4!important;stroke-dashoffset:0!important;animation:none!important}
.mgm-relpill{fill:var(--panel)}
.mgm-rellabel{font-family:ui-monospace,Menlo,monospace;font-size:9.5px;font-weight:600}
.mgm-flow{fill:none;stroke-width:1.2;stroke-dasharray:3 4;opacity:.55;animation:mgm-flow 1.2s linear infinite}
@keyframes mgm-flow{to{stroke-dashoffset:-14}}
.mgm-fk{fill:none;stroke:var(--table);stroke-width:1.2;stroke-dasharray:2 3}
.mgm-mark{fill:none;stroke:var(--join);stroke-width:1.3}
.mgm-markn{font-size:8.5px;font-weight:700;fill:#fff!important}
.mgm-chip{fill:var(--card);stroke-width:1.3}
.mgm-chiptext{font-size:10px;font-weight:600}
.mgm-note{font-size:10px;fill:var(--soft)!important;font-style:italic}
.mgm-mini{fill:var(--card);stroke:var(--graph);stroke-width:1.2}
.mgm-minilabel{font-size:7.5px;fill:var(--strong)!important}
.mgm-miniedge{stroke:var(--graph);stroke-width:1;opacity:.7}
.mgm-click{cursor:pointer}
.mgm-click:hover{filter:drop-shadow(0 0 4px var(--hl))}
.mgm-fade{animation:mgm-fade .5s ease-out both}
.mgm-pop{animation:mgm-pop .5s cubic-bezier(.2,1.4,.4,1) both}
.mgm-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:mgm-draw .7s ease-out both}
@keyframes mgm-fade{from{opacity:0}to{opacity:1}}
@keyframes mgm-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}
@keyframes mgm-draw{to{stroke-dashoffset:0}}
.mgm-detail{display:grid;grid-template-columns:minmax(0,1fr);gap:4px 16px;margin-top:6px}
@container mgm (min-width:900px){.mgm-detail{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}}
.mgm-cap{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);font-weight:600;margin:4px 0 5px}
.mgm-hint{text-transform:none;letter-spacing:0;font-weight:400;font-style:italic;margin-left:6px}
.mgm-json{margin:0;background:var(--code);border:1px solid var(--bd);border-radius:8px;padding:10px 11px;font-size:11.5px;line-height:1.6;
overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre}
.mgm-jpunct{color:var(--soft)}
.mgm-jkey{color:var(--fg)}
.mgm-tok{border-radius:3px;padding:0 1px;transition:background .12s}
.mgm-tok.mgm-t-table{color:var(--table);font-weight:600}.mgm-tok.mgm-t-graph{color:var(--graph);font-weight:600}
.mgm-tok.mgm-t-join{color:var(--join);font-weight:600}.mgm-tok.mgm-t-content{color:var(--content);font-weight:600}
.mgm-tok.mgm-t-link{color:var(--link);font-weight:600}
.mgm-linked{text-decoration:underline dotted;text-underline-offset:3px}
.mgm-tokon{background:var(--hl)}
.mgm-keys{font-size:12px;margin-top:7px;line-height:1.6}
.mgm-query{background:var(--code);border:1px solid var(--bd);border-radius:8px;padding:9px 11px;font-family:ui-monospace,Menlo,monospace;
font-size:11px;line-height:1.55;overflow-x:auto}
.mgm-gql{color:var(--strong);font-weight:600;white-space:pre-wrap}
.mgm-run{color:var(--soft);white-space:pre-wrap;padding-left:14px;text-indent:-14px}
.mgm-arrow{display:inline-block;width:14px;text-indent:0}
.mgm-notes{margin:9px 0 0;padding-left:17px;font-size:12.5px;line-height:1.55}
.mgm-notes li{margin:3px 0}
.mgm-matrixwrap{overflow-x:auto;margin-top:6px}
.mgm-matrix{width:100%;border-collapse:collapse;font-size:12px;min-width:620px}
.mgm-matrix th{text-align:left;font-weight:600;color:var(--soft);font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;
padding:6px 8px;border-bottom:1px solid var(--bd)}
.mgm-matrix td{padding:6px 8px;border-bottom:1px solid var(--rule);vertical-align:top}
.mgm-matrix tbody tr{cursor:pointer}
.mgm-matrix tbody tr:hover{background:var(--card)}
.mgm-matrix td:first-child{white-space:nowrap}
.mgm-matrix td:first-child .mgm-sw{margin-right:6px}
.mgm-matrix code{font-size:11.5px;font-weight:600}
.mgm-legend{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12px;margin-top:9px;color:var(--soft)}
.mgm-legend b{font-family:ui-monospace,Menlo,monospace;font-weight:600;margin-right:4px}
.mgm-foot{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:10px}
.mgm-nav{border:1px solid var(--bd);background:var(--card);color:var(--fg);border-radius:6px;width:30px;height:24px;cursor:pointer}
.mgm-count{font-size:11px;color:var(--soft);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){.mgm *{animation:none!important}.mgm circle animateMotion{display:none}}
`;
