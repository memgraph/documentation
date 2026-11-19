import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useMenu } from "nextra-theme-docs";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// Search box for the docs, on Algolia DocSearch's index of these docs (the same index
// Memgraph Lab searches). Results drop down under the input, like Nextra's own search,
// whose markup and classes this copies so it looks the same.
//
// The search-only key is public by design: it can only read the index.
const APP_ID = "N801ZM9TWC";
const INDEX_NAME = "memgraph";
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? "";
const ENDPOINT = `https://${APP_ID}-dsn.algolia.net/1/indexes/${INDEX_NAME}/query`;

const MAX_PER_PAGE = 5; // results shown per docs page
const DEBOUNCE_MS = 100;
const HL_START = "\u0001";
const HL_END = "\u0002";
const INPUTS = new Set(["input", "select", "button", "textarea"]);

type Hierarchy = Partial<Record<"lvl0" | "lvl1" | "lvl2" | "lvl3" | "lvl4" | "lvl5" | "lvl6", string | null>>;
type Hit = {
  objectID: string;
  url: string;
  type: string; // "lvl1".."lvl6" for a heading, "content" for a paragraph
  hierarchy: Hierarchy;
  content?: string | null;
  _highlightResult?: { hierarchy?: Record<string, { value: string }> };
  _snippetResult?: { content?: { value: string } };
};
type Result = { id: string; page: string; route: string; title: string; excerpt?: string };
// The "Ask AI about …" option: hands the query to the Kapa chat widget loaded in
// pages/_document.js.
type AskAI = { askAI: string };
type Selection = Result | AskAI;
declare global {
  interface Window {
    Kapa?: { open?: (options?: { query?: string; submit?: boolean }) => void };
  }
}

// Algolia joins dotted words into one ("cycles.get" -> "cyclesget"), which matches
// nothing: headings say only "get()" and code blocks aren't indexed. Search for
// "cycles get" instead.
const toQuery = (text: string) => text.replace(/\./g, " ");

// The crawler stores absolute https://memgraph.com/docs/... URLs. next/link adds the
// /docs base path itself, so keep the path after it, plus the anchor.
function toRoute(url: string): string {
  try {
    const u = new URL(url);
    return (u.pathname.replace(/^\/docs(?=\/|$)/, "") || "/") + u.hash;
  } catch {
    return url;
  }
}

// The crawler stores text HTML-escaped ("Questions &amp; Feedback"). Results render as
// text, not HTML, so turn the escapes back into characters.
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" };
const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) =>
    e[0] !== "#" ? ENTITIES[e.toLowerCase()] ?? m
    : String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))));

const LEVELS = ["lvl6", "lvl5", "lvl4", "lvl3", "lvl2", "lvl1"] as const;

// "…/memgql/connect/mongodb#setup" -> "Mongodb"
function titleFromUrl(url: string): string {
  const last = toRoute(url).split("#")[0].split("/").filter(Boolean).pop() ?? "Documentation";
  const words = last.replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function toResult(hit: Hit): Result {
  // A heading record is titled by its own level; a paragraph by its deepest heading.
  const level = hit.type.startsWith("lvl") ? hit.type : LEVELS.find((l) => hit.hierarchy[l]) ?? "lvl1";
  const title = decode(hit._highlightResult?.hierarchy?.[level]?.value ?? hit.hierarchy[level as keyof Hierarchy] ?? "");
  // Paragraphs show a snippet. Sub-headings ("Warning", "Errors") mean little alone, so they
  // show the headings above them, below the page title: "Errors › Replication failure".
  const depth = Number(level.slice(3));
  const parents = [2, 3, 4, 5]
    .filter((n) => n < depth)
    .map((n) => hit.hierarchy[`lvl${n}` as keyof Hierarchy])
    .filter(Boolean)
    .join(" › ");
  const snippet = hit._snippetResult?.content?.value;
  const excerpt = hit.type === "content" ? snippet && decode(snippet) : decode(parents) || undefined;
  return {
    id: hit.objectID,
    // Grouped by page title (lvl1): the crawler sets lvl0 to "Documentation" everywhere.
    // A few pages have no title in the index; name those after their URL.
    page: hit.hierarchy.lvl1 ? decode(hit.hierarchy.lvl1) : titleFromUrl(hit.url),
    route: toRoute(hit.url),
    title,
    excerpt,
  };
}

// Pages in the order Algolia ranked their best hit, at most MAX_PER_PAGE results each,
// one result per URL.
function groupByPage(hits: Hit[]): Result[] {
  const pages = new Map<string, Result[]>();
  const seen = new Set<string>();
  for (const r of hits.map(toResult)) {
    if (seen.has(r.route)) continue;
    seen.add(r.route);
    const list = pages.get(r.page) ?? [];
    if (list.length < MAX_PER_PAGE) list.push(r);
    pages.set(r.page, list);
  }
  return Array.from(pages.values()).flat();
}

async function searchAlgolia(text: string, signal: AbortSignal): Promise<Result[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    signal,
    headers: { "X-Algolia-Application-Id": APP_ID, "X-Algolia-API-Key": SEARCH_KEY },
    body: JSON.stringify({
      query: toQuery(text),
      hitsPerPage: 20,
      facetFilters: ["language:en"],
      // Rank by the first attribute that matches, not by the one where the words are
      // closest. Otherwise body text with "vector" in its page title outranks the
      // "Create vector index" heading.
      attributeCriteriaComputedByMinProximity: false,
      attributesToRetrieve: ["hierarchy", "url", "type", "content"],
      attributesToHighlight: ["hierarchy.lvl1", "hierarchy.lvl2", "hierarchy.lvl3", "hierarchy.lvl4", "hierarchy.lvl5", "hierarchy.lvl6"],
      attributesToSnippet: ["content:24"],
      snippetEllipsisText: "…",
      highlightPreTag: HL_START,
      highlightPostTag: HL_END,
    }),
  });
  if (!res.ok) throw new Error(`Algolia returned ${res.status}`);
  const data = await res.json();
  return groupByPage(data.hits as Hit[]);
}

// Render Algolia's highlight markers as <mark>, without inserting HTML.
function Highlighted({ value }: { value: string }) {
  const parts = value.split(new RegExp(`(${HL_START}[^${HL_END}]*${HL_END})`));
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith(HL_START) ? (
          <span key={i} className="algolia-search-match">
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function Message({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "red" }) {
  return (
    <span className={cn("_flex _select-none _justify-center _gap-2 _p-8 _text-center _text-sm", tone === "red" ? "_text-red-500" : "_text-gray-400")}>
      {children}
    </span>
  );
}

// The DocSearch plan requires the Algolia logo, linked to algolia.com, in the results panel.
// The bottom row, pinned to the bottom of the panel: "Ask AI about …" (when the Kapa
// widget has loaded) and the Algolia logo. Styled in styles/globals.css
// (.algolia-search-footer): Nextra's prebuilt CSS only has the classes Nextra uses.
function Footer({ query, showAskAI }: { query: string; showAskAI: boolean }) {
  return (
    <div className="algolia-search-footer">
      {showAskAI && (
        <ComboboxOption value={{ askAI: query }} className="algolia-search-option algolia-search-ask">
          <span aria-hidden="true">✦</span> Ask AI about <strong>“{query}”</strong>
        </ComboboxOption>
      )}
      <a href="https://www.algolia.com/" target="_blank" rel="noopener noreferrer" className="algolia-search-logo">
        Search by
        <img src="/docs/images/search/algolia-logo.svg" alt="Algolia" width={60} height={18} />
      </a>
    </div>
  );
}

export default function AlgoliaSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { setMenu } = useMenu();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);
  const [isMac, setIsMac] = useState<boolean | null>(null);
  // The Kapa widget loads after the page; check for it when the box is focused.
  const [kapaReady, setKapaReady] = useState(false);

  // "/" and Cmd/Ctrl+K focus the box, as in Nextra's search.
  useEffect(() => {
    setIsMac(navigator.userAgent.includes("Mac"));
    function down(event: KeyboardEvent) {
      const input = inputRef.current;
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName.toLowerCase();
      if (!input || !tag || INPUTS.has(tag) || active?.isContentEditable) return;
      if (event.key === "/" || (event.key === "k" && (event.metaKey || event.ctrlKey))) {
        event.preventDefault();
        input.focus({ preventScroll: true });
      }
    }
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  // Search as the reader types; a newer query cancels the one in flight.
  useEffect(() => {
    const text = value.trim();
    if (!text) {
      setResults([]);
      setLoading(false);
      setError(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      searchAlgolia(text, controller.signal)
        .then((r) => {
          setResults(r);
          setError(false);
          setLoading(false);
        })
        .catch((e) => {
          if (e.name === "AbortError") return;
          setError(true);
          setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  const handleSelect = useCallback(
    async (selection: Selection | null) => {
      if (!selection) return;
      inputRef.current?.blur();
      if ("askAI" in selection) {
        // Open the Kapa chat with the query already asked.
        setMenu(false);
        setValue("");
        window.Kapa?.open?.({ query: selection.askAI, submit: true });
        return;
      }
      await router.push(selection.route);
      setMenu(false);
      setValue("");
    },
    [router, setMenu]
  );

  if (!SEARCH_KEY) return null;

  return (
    <Combobox onChange={handleSelect}>
      <div className={cn("_not-prose _relative _flex _items-center _text-gray-900 dark:_text-gray-300 contrast-more:_text-gray-800 contrast-more:dark:_text-gray-300", className)}>
        <ComboboxInput
          ref={inputRef}
          spellCheck={false}
          autoComplete="off"
          type="search"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onFocus={() => {
            setFocused(true);
            setKapaReady(typeof window.Kapa?.open === "function");
          }}
          onBlur={() => setFocused(false)}
          placeholder="Search documentation…"
          className={({ focus }) =>
            cn(
              "_rounded-lg _px-3 _py-2 _transition-colors",
              "_w-full md:_w-64",
              "_text-base _leading-tight md:_text-sm",
              // Focus ring in Memgraph colors: .algolia-search-input in styles/globals.css.
              "algolia-search-input",
              focus ? "_bg-transparent" : "_bg-black/[.05] dark:_bg-gray-50/10",
              "placeholder:_text-gray-500 dark:placeholder:_text-gray-400",
              "contrast-more:_border contrast-more:_border-current",
              "[&::-webkit-search-cancel-button]:_appearance-none"
            )
          }
        />
        {isMac !== null && !focused && (
          <kbd className="_absolute _my-1.5 _select-none ltr:_right-1.5 rtl:_left-1.5 _h-5 _rounded _bg-white _px-1.5 _font-mono _text-[11px] _font-medium _text-gray-500 _border dark:_border-gray-100/20 dark:_bg-black/50 contrast-more:_border-current contrast-more:_text-current contrast-more:dark:_border-current _items-center _gap-1 _flex max-sm:_hidden">
            {isMac ? (
              <>
                <span className="_text-xs">⌘</span>K
              </>
            ) : (
              "CTRL K"
            )}
          </kbd>
        )}
      </div>
      <ComboboxOptions
        transition
        anchor={{ to: "top end", gap: 10, padding: 16 }}
        className={({ open }) =>
          cn(
            "nextra-search-results algolia-search-panel nextra-scrollbar max-md:_h-full",
            "_border _border-gray-200 _text-gray-100 dark:_border-neutral-800",
            "_z-20 _rounded-xl _py-2.5 _shadow-xl",
            "contrast-more:_border contrast-more:_border-gray-900 contrast-more:dark:_border-gray-50",
            "_backdrop-blur-lg",
            "motion-reduce:_transition-none _transition-opacity",
            open ? "_opacity-100" : "_opacity-0",
            // Messages ("No results found.") take their natural height; results scroll.
            results.length ? "md:!_max-h-[min(calc(100vh-5rem),400px)]" : "",
            "_w-full md:_w-[576px]",
            "empty:_invisible"
          )
        }
      >
        {value.trim() &&
          (error ? (
            <Message tone="red">Search isn't available right now. Try again in a moment.</Message>
          ) : loading && !results.length ? (
            <Message>Searching…</Message>
          ) : results.length ? (
            results.map((r, i) => (
              <Fragment key={r.id}>
                {(i === 0 || results[i - 1].page !== r.page) && (
                  <div className="_mx-2.5 _mb-2 [&:not(:first-child)]:_mt-6 _select-none _border-b _border-black/10 _px-2.5 _pb-1.5 _text-xs _font-semibold _uppercase _text-gray-500 dark:_border-white/20 dark:_text-gray-300 contrast-more:_border-gray-600 contrast-more:_text-gray-900 contrast-more:dark:_border-gray-50 contrast-more:dark:_text-gray-50">
                    {r.page}
                  </div>
                )}
                <ComboboxOption
                  as={NextLink}
                  value={r}
                  href={r.route}
                  className={({ focus }) =>
                    cn(
                      "_mx-2.5 _break-words _rounded-md contrast-more:_border",
                      // Selected result styled like the sidebar's active item: .algolia-search-option.
                      "algolia-search-option",
                      focus ? "contrast-more:_border-current" : "_text-gray-800 dark:_text-gray-300 contrast-more:_border-transparent",
                      "_block _scroll-m-12 _px-2.5 _py-2"
                    )
                  }
                >
                  <div className="_text-base _font-semibold _leading-5">
                    <Highlighted value={r.title} />
                  </div>
                  {r.excerpt && (
                    <div className="excerpt _mt-1 _text-sm _leading-[1.35rem] _text-gray-600 dark:_text-gray-400 contrast-more:dark:_text-gray-50">
                      <Highlighted value={r.excerpt} />
                    </div>
                  )}
                </ComboboxOption>
              </Fragment>
            ))
          ) : (
            <Message>No results found.</Message>
          ))}
        {value.trim() && <Footer query={value.trim()} showAskAI={kapaReady} />}
      </ComboboxOptions>
    </Combobox>
  );
}
