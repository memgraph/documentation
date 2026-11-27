import NextLink from "next/link";
import type { ReactNode } from "react";

// Product tabs preview: the docs home at /docs. One hero, one card per product,
// popular starting points, the tools around the database, and where to get help.

type Product = {
  name: string;
  href: string;
  logo: ReactNode;
  tagline: string;
  audience: string;
  glow: string;
  badge?: string;
  links: { title: string; href: string }[];
};

const ProductLogo = ({ name }: { name: "zero" | "lore" }) => {
  const alt = `Memgraph ${name === "zero" ? "Zero" : "Lore"} logo`;
  return (
    <>
      <img className="product-logo-light h-7 w-auto" src={`/docs/product-logos/${name}-logo.svg`} alt={alt} />
      <img className="product-logo-dark h-7 w-auto" src={`/docs/product-logos/${name}-logo-dark.svg`} alt={alt} />
    </>
  );
};

const PRODUCTS: Product[] = [
  {
    name: "Memgraph",
    href: "/getting-started",
    logo: (
      <span className="flex items-center gap-2">
        <img className="h-7 w-auto" src="/docs/memgraph-logo-navigation.svg" alt="Memgraph logo" />
        <span className="product-logo-label text-lg font-semibold">Memgraph</span>
      </span>
    ),
    tagline:
      "The in-memory graph database that powers real-time AI context: GraphRAG, AI memory, agents and graph analytics.",
    audience: "Developers and operators",
    glow: "from-[#FFC500] via-[#FB6E00] to-[#720096]",
    links: [
      { title: "Getting started", href: "/getting-started" },
      { title: "Query with Cypher", href: "/querying" },
      { title: "Deploy to production", href: "/deployment" },
      { title: "Release notes", href: "/release-notes" },
    ],
  },
  {
    name: "Memgraph Zero",
    href: "/memgraph-zero",
    logo: <ProductLogo name="zero" />,
    tagline:
      "Query data where it lives. Run graph queries over PostgreSQL, ClickHouse, Snowflake and data lakes, without moving the data.",
    audience: "Data and platform engineers",
    glow: "from-[#FF0097] via-[#DD2222] to-[#720096]",
    links: [
      { title: "MemGQL quick start", href: "/memgraph-zero/memgql/quick-start" },
      { title: "Connect data sources", href: "/memgraph-zero/memgql/connect" },
      { title: "Changelog", href: "/memgraph-zero/memgql/changelog" },
    ],
  },
  {
    name: "Memgraph Lore",
    href: "/memgraph-lore",
    logo: <ProductLogo name="lore" />,
    tagline: "Placeholder. A commercial product for business analysts, with its own install.",
    audience: "Business analysts",
    glow: "from-[#FFC500] via-[#FB6E00] to-[#FF0097]",
    badge: "New",
    links: [
      { title: "Install", href: "/memgraph-lore/install" },
      { title: "Release notes", href: "/memgraph-lore/release-notes" },
    ],
  },
];

const POPULAR = [
  { title: "Install Memgraph", text: "Docker, Linux packages or the cloud.", href: "/getting-started/install-memgraph" },
  { title: "Connect your AI assistant", text: "Agent Skills and the docs MCP server.", href: "/getting-started/coding-with-ai" },
  { title: "GraphRAG", text: "Retrieve context by traversing a knowledge graph.", href: "/ai-ecosystem/graph-rag" },
  { title: "AI memory", text: "Give agents memory that persists and connects.", href: "/ai-ecosystem/ai-memory" },
  { title: "Graph algorithms", text: "PageRank, communities, paths and more.", href: "/advanced-algorithms" },
  { title: "Migrate from Neo4j", text: "Move your data and queries over.", href: "/data-migration/migrate-from-neo4j" },
];

const TOOLS = [
  { title: "Memgraph Lab", href: "/memgraph-lab" },
  { title: "mgconsole", href: "/getting-started/cli" },
  { title: "Memgraph Agent", href: "/memgraph-agent" },
  { title: "Client libraries", href: "/client-libraries" },
  { title: "Docs MCP server", href: "/getting-started/coding-with-ai/docs-mcp" },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
    <path d="M3 8h10m0 0L9 4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="mb-8">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FB6E00]">{eyebrow}</p>
    <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">{title}</h2>
  </div>
);

export default function DocsHome() {
  return (
    <div className="docs-home relative -mt-4 overflow-hidden">
      {/* Background glow and grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#FFC500]/25 via-[#FF0097]/20 to-[#720096]/25 blur-3xl dark:from-[#FFC500]/15 dark:via-[#FF0097]/15 dark:to-[#720096]/25" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(127,127,127,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="pb-20 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/70 bg-white/60 px-4 py-1.5 text-xs font-medium text-neutral-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#FFC500] to-[#FF0097]" />
            Memgraph documentation
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-[#FFC500] via-[#FB6E00] via-50% to-[#720096] bg-clip-text text-transparent">
              build with Memgraph
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            Guides, references and release notes for the Memgraph graph database, Memgraph Zero and
            Memgraph Lore.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <NextLink
              href="/getting-started"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FB6E00] via-[#FF0097] to-[#720096] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF0097]/25 transition hover:shadow-xl hover:shadow-[#FF0097]/40"
            >
              Get started <Arrow />
            </NextLink>
            <NextLink
              href="/getting-started/coding-with-ai"
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-6 py-3 text-sm font-semibold text-neutral-800 backdrop-blur transition hover:border-neutral-400 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/30"
            >
              Connect your AI assistant <Arrow />
            </NextLink>
          </div>
        </section>

        {/* Products */}
        <section className="pb-20">
          <SectionTitle eyebrow="Products" title="Pick your product" />
          <div className="grid gap-6 md:grid-cols-3">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="group relative rounded-2xl p-px">
                {/* Gradient border that lights up on hover */}
                <div aria-hidden="true" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${p.glow} opacity-20 transition-opacity duration-300 group-hover:opacity-100`} />
                <div aria-hidden="true" className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${p.glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30`} />
                <div className="relative flex h-full flex-col rounded-2xl bg-white p-6 dark:bg-[#18181b]">
                  <div className="flex items-center justify-between">
                    <NextLink href={p.href} className="flex items-center">{p.logo}</NextLink>
                    {p.badge && (
                      <span className="rounded-full bg-gradient-to-r from-[#FFC500] to-[#FF0097] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{p.tagline}</p>
                  <p className="mt-4 inline-flex w-fit rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 dark:bg-white/5 dark:text-neutral-300">
                    For {p.audience.toLowerCase()}
                  </p>
                  <ul className="mt-6 space-y-1 border-t border-neutral-200 pt-4 dark:border-white/10">
                    {p.links.map((l) => (
                      <li key={l.href}>
                        <NextLink
                          href={l.href}
                          className="group/link flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          {l.title}
                          <span className="opacity-0 transition group-hover/link:opacity-100">→</span>
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                  <NextLink
                    href={p.href}
                    className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-neutral-900 dark:text-white"
                  >
                    Explore {p.name} <Arrow />
                  </NextLink>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular */}
        <section className="pb-20">
          <SectionTitle eyebrow="Start here" title="Popular starting points" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white/60 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-[#FB6E00]/60 hover:shadow-lg hover:shadow-[#FB6E00]/10 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[#FB6E00]/60"
              >
                <span>
                  <span className="block font-semibold text-neutral-900 dark:text-white">{item.title}</span>
                  <span className="mt-1 block text-sm text-neutral-600 dark:text-neutral-400">{item.text}</span>
                </span>
                <span className="mt-1 text-neutral-400 group-hover:text-[#FB6E00]"><Arrow /></span>
              </NextLink>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="pb-20">
          <SectionTitle eyebrow="Tools" title="Work with Memgraph your way" />
          <div className="flex flex-wrap gap-3">
            {TOOLS.map((t) => (
              <NextLink
                key={t.href}
                href={t.href}
                className="rounded-full border border-neutral-200 bg-white/60 px-5 py-2.5 text-sm font-medium text-neutral-800 transition hover:border-[#720096]/50 hover:bg-[#720096]/5 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-200 dark:hover:border-[#c084fc]/50 dark:hover:bg-[#720096]/20"
              >
                {t.title}
              </NextLink>
            ))}
          </div>
        </section>

        {/* Help */}
        <section className="pb-24">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FB6E00] via-[#FF0097] to-[#720096] p-px">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-white px-8 py-8 dark:bg-[#18181b] sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Stuck? Ask the community.</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Ask Memgraph engineers and other users on Discord, or report a bug on GitHub.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://discord.gg/memgraph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Join Discord <Arrow />
                </a>
                <a
                  href="https://github.com/memgraph/memgraph/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-500 dark:border-white/20 dark:text-white dark:hover:border-white/40"
                >
                  Open an issue
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
