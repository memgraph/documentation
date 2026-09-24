/**
 * Generates llms.txt (https://llmstxt.org/) and clean Markdown versions of every
 * docs page into public/, so that agents fetching memgraph.com/docs get prose
 * instead of a React shell.
 *
 * Outputs:
 *   public/llms.txt          index of every page, ordered by the _meta.ts files
 *   public/<route>.md        cleaned Markdown for each page in pages/
 *
 * Runs from package.json postbuild, alongside next-sitemap.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'pages')
const PUBLIC = path.join(ROOT, 'public')

const SITE = 'https://memgraph.com/docs'

// Sections moved under "## Optional" - reference material an agent can skip
// when context is tight, per the llms.txt spec.
const OPTIONAL_PREFIXES = [
  '/release-notes',
  '/advanced-algorithms/available-algorithms',
  // Not in the root _meta.ts, so it would otherwise become a top-level section
  // named after its own question-shaped title.
  '/coming-soon',
]

const PAGE_EXTS = ['.mdx', '.md']
const MAX_DESC = 160

const CODE_OPEN = '\u0000CODE'
const CODE_CLOSE = '\u0000'

// ---------------------------------------------------------------- frontmatter

function splitFrontmatter(raw) {
  const m = raw.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[kv[1]] = value
  }
  return { data, body: raw.slice(m[0].length) }
}

// ------------------------------------------------------------------ _meta.ts

// _meta.ts files in this repo are plain object literals with no TS syntax, so
// evaluating them is both safe and more robust than pattern matching.
function readMeta(dir) {
  const file = path.join(dir, '_meta.ts')
  if (!fs.existsSync(file)) return null
  const src = fs
    .readFileSync(file, 'utf8')
    .replace(/^\s*export\s+default\s*/, '')
    .replace(/;?\s*$/, '')
  try {
    return new Function(`return (${src})`)()
  } catch (err) {
    console.warn(
      `[llms.txt] could not parse ${path.relative(ROOT, file)}: ${err.message}`
    )
    return null
  }
}

function metaEntry(meta, slug) {
  const value = meta?.[slug]
  if (typeof value === 'string') return { label: value, hidden: false }
  if (value && typeof value === 'object') {
    return {
      label: value.title ?? null,
      hidden: value.display === 'hidden' || value.type === 'separator',
    }
  }
  return { label: null, hidden: false }
}

// ------------------------------------------------------------- MDX -> Markdown

/** Strips the common leading indentation from a block of lines. */
function dedent(text) {
  const lines = text.split('\n')
  const widths = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^[ \t]*/)[0].length)
  const common = widths.length ? Math.min(...widths) : 0
  if (!common) return text
  return lines.map((line) => line.slice(common)).join('\n')
}

// Code must survive the JSX stripping below untouched, so it is pulled out and
// reinserted afterwards. Fences are tracked with a line scanner rather than a
// regex: the docs contain lines like ```kubectl apply -f sc.yaml``` , and
// pairing those off as block fences desynchronises every fence after them.
function protectCode(text) {
  const blocks = []
  const mask = (content) => {
    blocks.push(content)
    return `${CODE_OPEN}${blocks.length - 1}${CODE_CLOSE}`
  }

  const out = []
  let fence = null

  for (const line of text.split('\n')) {
    const m = line.match(/^[ \t]*(`{3,}|~{3,})(.*)$/)

    if (fence) {
      fence.lines.push(line)
      const closes =
        m && m[1][0] === fence.char && m[1].length >= fence.length && !m[2].trim()
      if (closes) {
        out.push(mask(dedent(fence.lines.join('\n'))))
        fence = null
      }
      continue
    }

    if (m) {
      // Per CommonMark a backtick fence's info string cannot contain a
      // backtick, so ```foo``` on one line is an inline span, not a fence.
      const char = m[1][0]
      if (char === '~' || !m[2].includes('`')) {
        fence = { char, length: m[1].length, lines: [line] }
        continue
      }
    }

    out.push(line)
  }

  // An unterminated fence still holds code; keep it verbatim.
  if (fence) out.push(mask(fence.lines.join('\n')))

  // Inline spans can legitimately contain angle brackets, e.g. `<Foo>`.
  const masked = out.join('\n').replace(/`[^`\n]+`/g, (span) => mask(span))

  return { masked, blocks }
}

function restoreCode(text, blocks) {
  return text.replace(
    /\u0000CODE(\d+)\u0000/g,
    (_, i) => blocks[Number(i)]
  )
}

function unwrapTabs(text) {
  return text.replace(/<Tabs\b([^>]*)>([\s\S]*?)<\/Tabs>/g, (_, attrs, inner) => {
    const itemsMatch = attrs.match(/items=\{\[([\s\S]*?)\]\}/)
    const labels = itemsMatch
      ? [...itemsMatch[1].matchAll(/['"`]([^'"`]*)['"`]/g)].map((m) => m[1])
      : []
    // Tab bodies are indented in the source; left alone, that indentation
    // would read as a Markdown code block.
    let i = 0
    return inner
      .split(/<Tabs\.Tab\b[^>]*>/)
      .map((segment, index) => {
        const body = dedent(segment.replace(/<\/Tabs\.Tab>/g, '').trim())
        if (index === 0) return body
        const label = labels[i++]
        return `${label ? `**${label}**\n\n` : ''}${body}`
      })
      .filter(Boolean)
      .join('\n\n')
  })
}

// <CodeSnippet code="..." /> holds install commands in a prop; dropping the tag
// with the generic stripper would lose the command itself.
function unwrapCodeSnippets(text) {
  return text.replace(/<CodeSnippet\b([^>]*?)\/?>/g, (_, attrs) => {
    const code =
      attrs.match(/code=\{\s*(['"`])([\s\S]*?)\1\s*\}/)?.[2] ??
      attrs.match(/code=(['"])([\s\S]*?)\1/)?.[2]
    return code ? `\n\`\`\`bash\n${code}\n\`\`\`\n` : ''
  })
}

// <Steps> bodies carry their headings as JSX, e.g.
// {<h3 className="custom-header">Install</h3>} - 2143 of them across the docs.
function convertJsxHeadings(text) {
  return text.replace(
    /\{?\s*<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>\s*\}?/g,
    (_, level, body) => {
      const title = body.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      return title ? `\n${'#'.repeat(Number(level))} ${title}\n` : ''
    }
  )
}

// Docs links are root-relative because Nextra's basePath resolves them. Served
// as plain .md under /docs, they would point at the marketing site instead.
function absolutiseLinks(text) {
  // The target must stay on one line: a malformed link elsewhere in the docs
  // (a missing closing paren) would otherwise swallow the next paragraph.
  return text.replace(/\]\(\/(?!\/)([^)\s]*)\)/g, (match, target) => {
    if (target.startsWith('docs/')) return match
    return `](${SITE}/${target})`
  })
}

function unwrapCallouts(text) {
  return text.replace(
    /<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g,
    (_, attrs, inner) => {
      const typeMatch = attrs.match(/type=["']([^"']+)["']/)
      const label = typeMatch ? typeMatch[1] : 'note'
      const heading = label.charAt(0).toUpperCase() + label.slice(1)
      const quoted = inner
        .trim()
        .split('\n')
        .map((line) => `> ${line}`.trimEnd())
        .join('\n')
      return `\n> **${heading}**\n>\n${quoted}\n`
    }
  )
}

function unwrapCards(text) {
  return text.replace(/<Cards\b[^>]*>([\s\S]*?)<\/Cards>/g, (_, inner) => {
    const cards = [...inner.matchAll(/<Cards\.Card\b([^>]*?)\/?>/g)].map((m) => {
      const title = m[1].match(/title=["']([^"']*)["']/)?.[1]
      const href = m[1].match(/href=["']([^"']*)["']/)?.[1]
      if (!title) return null
      return href ? `- [${title}](${href})` : `- ${title}`
    })
    return `\n${cards.filter(Boolean).join('\n')}\n`
  })
}

function mdxToMarkdown(raw, { title }) {
  const { body } = splitFrontmatter(raw)
  const { masked, blocks } = protectCode(body)

  let out = masked
    // Component and module wiring carries no prose.
    .replace(/^[ \t]*import\s+[\s\S]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, '')
    .replace(/^[ \t]*import\s+['"][^'"]+['"];?[ \t]*$/gm, '')
    .replace(/^[ \t]*export\s+(?:default|const|let|var|function)\b.*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

  out = convertJsxHeadings(out)
  out = unwrapCodeSnippets(out)
  out = unwrapCallouts(out)
  out = unwrapCards(out)
  out = unwrapTabs(out)
  out = absolutiseLinks(out)

  out = out
    // Remaining Nextra/custom components: drop the tags, keep the prose. Only
    // capitalised (JSX) names are touched, so raw HTML in Markdown survives.
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)*\b[^>]*\/?>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  out = restoreCode(out, blocks)

  // Every page should open with an H1; most MDX bodies already have one.
  if (!/^#\s+/m.test(out) && title) out = `# ${title}\n\n${out}`
  return `${out}\n`
}

// ------------------------------------------------------------------ page tree

function pageFileFor(dir, slug) {
  for (const ext of PAGE_EXTS) {
    const file = path.join(dir, `${slug}${ext}`)
    if (fs.existsSync(file)) return file
  }
  return null
}

function slugsIn(dir) {
  const seen = new Set()
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    if (entry.isDirectory()) seen.add(entry.name)
    else if (PAGE_EXTS.includes(path.extname(entry.name))) {
      seen.add(entry.name.replace(/\.mdx?$/, ''))
    }
  }
  return seen
}

/** Ordered slugs for a directory: _meta.ts order first, then the rest. */
function orderedSlugs(dir, meta) {
  const present = slugsIn(dir)
  const ordered = []
  for (const slug of Object.keys(meta ?? {})) {
    if (present.has(slug)) {
      ordered.push(slug)
      present.delete(slug)
    }
  }
  return [...ordered, ...[...present].sort()]
}

/** Walks pages/, returning a tree of { route, title, description, children }. */
function buildTree(dir, routePrefix) {
  const meta = readMeta(dir)
  const nodes = []

  for (const slug of orderedSlugs(dir, meta)) {
    const { label, hidden } = metaEntry(meta, slug)
    if (hidden) continue

    const file = pageFileFor(dir, slug)
    const subdir = path.join(dir, slug)
    const hasChildren =
      fs.existsSync(subdir) && fs.statSync(subdir).isDirectory()
    const route = `${routePrefix}/${slug}`

    let title = label
    let description = ''
    if (file) {
      const { data } = splitFrontmatter(fs.readFileSync(file, 'utf8'))
      title = label || data.title || slug
      description = data.description || ''
    }

    nodes.push({
      route,
      file,
      title: title || slug,
      description,
      children: hasChildren ? buildTree(subdir, route) : [],
    })
  }
  return nodes
}

// --------------------------------------------------------------- .md emission

let written = 0

function emitMarkdown(nodes) {
  for (const node of nodes) {
    if (node.file) {
      const raw = fs.readFileSync(node.file, 'utf8')
      const target = path.join(PUBLIC, `${node.route.replace(/^\//, '')}.md`)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.writeFileSync(target, mdxToMarkdown(raw, { title: node.title }))
      written++
    }
    emitMarkdown(node.children)
  }
}

// ------------------------------------------------------------ llms.txt output

function truncate(text) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= MAX_DESC) return clean
  return `${clean.slice(0, MAX_DESC - 1).replace(/[\s,.;:-]+$/, '')}...`
}

function renderNode(node, depth, lines) {
  if (node.file) {
    const indent = '  '.repeat(depth)
    const url = `${SITE}${node.route}.md`
    const desc = node.description ? `: ${truncate(node.description)}` : ''
    lines.push(`${indent}- [${node.title}](${url})${desc}`)
  }
  for (const child of node.children) {
    renderNode(child, node.file ? depth + 1 : depth, lines)
  }
}

function isOptional(route) {
  return OPTIONAL_PREFIXES.some((p) => route === p || route.startsWith(`${p}/`))
}

/** Flattens a subtree into bullets, ignoring hierarchy (used for Optional). */
function flatten(node, lines) {
  if (node.file) {
    const desc = node.description ? `: ${truncate(node.description)}` : ''
    lines.push(`- [${node.title}](${SITE}${node.route}.md)${desc}`)
  }
  for (const child of node.children) flatten(child, lines)
}

/** Splits a section's nodes into the parts that stay and the parts deferred. */
function partition(nodes) {
  const keep = []
  const optional = []
  for (const node of nodes) {
    if (isOptional(node.route)) {
      optional.push(node)
      continue
    }
    const split = partition(node.children)
    keep.push({ ...node, children: split.keep })
    optional.push(...split.optional)
  }
  return { keep, optional }
}

function build() {
  const tree = buildTree(PAGES, '')
  const home = tree.find((n) => n.route === '/index')
  const sections = tree.filter((n) => n.route !== '/index')

  emitMarkdown(tree)

  const lines = []
  lines.push('# Memgraph documentation')
  lines.push('')
  lines.push(
    '> Memgraph is the graph engine for AI context, built for real-time graph',
    '> reasoning. It complements vector search with structured, connected context',
    '> and traceable multi-hop reasoning across enterprise data in milliseconds.',
    '> One in-memory engine serves two workloads: AI context (GraphRAG, AI memory',
    '> and agentic reasoning) and real-time graph analytics. Memgraph speaks Cypher',
    '> and runs graph algorithms, vector search and GraphRAG pipelines in-database.'
  )
  lines.push('')
  lines.push(
    'Every link below points at a plain Markdown version of a documentation page.',
    'Strip the trailing `.md` from any URL to get the browsable HTML page.',
    'The wider company site is indexed separately at https://memgraph.com/llms.txt.'
  )
  lines.push('')
  lines.push(
    'For coding agents:',
    '',
    '- Search these docs over MCP at `https://mcp-docs.memgraph.com`, with no API key.',
    '  In Claude Code: `claude mcp add --transport http memgraph-docs https://mcp-docs.memgraph.com`.',
    `  Other clients: ${SITE}/ai-ecosystem/mcp.md.`,
    '- Install Memgraph Agent Skills for Cypher, data modeling, MAGE algorithms, query',
    '  modules and GraphRAG with `npx skills add memgraph/skills`, or in Claude Code with',
    `  \`/plugin marketplace add memgraph/skills\`. Skill list: ${SITE}/ai-ecosystem/skills.md.`
  )
  lines.push('')

  if (home?.file) {
    lines.push('## Overview')
    lines.push('')
    lines.push(
      `- [${home.title}](${SITE}/index.md): ${truncate(home.description)}`
    )
    lines.push('')
  }

  const deferred = []
  for (const section of sections) {
    const { keep, optional } = partition([section])
    deferred.push(...optional)
    if (!keep.length) continue

    const body = []
    for (const node of keep) renderNode(node, 0, body)
    if (!body.length) continue

    lines.push(`## ${section.title}`)
    lines.push('')
    lines.push(...body)
    lines.push('')
  }

  if (deferred.length) {
    const body = []
    for (const node of deferred) flatten(node, body)
    if (body.length) {
      lines.push('## Optional')
      lines.push('')
      lines.push(
        'Version history and the per-algorithm reference. Useful for specific',
        'lookups, safe to skip when context is limited.'
      )
      lines.push('')
      lines.push(...body)
      lines.push('')
    }
  }

  fs.writeFileSync(path.join(PUBLIC, 'llms.txt'), `${lines.join('\n').trimEnd()}\n`)

  const linkCount = lines.filter((l) => l.trimStart().startsWith('- [')).length
  console.log(`[llms.txt] public/llms.txt - ${linkCount} links`)
  console.log(`[llms.txt] wrote ${written} Markdown pages into public/`)
}

build()
