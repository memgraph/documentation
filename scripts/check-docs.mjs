/**
 * Checks the docs source for things that break for readers: links to pages or
 * sections that don't exist, links through a redirect, broken redirects, pages
 * missing from the sidebar, missing images and mismatched release-note versions.
 *
 * It reads only this checkout (no build, no network) and runs in a few seconds.
 * Any problem fails the check. The rules are the ones in AGENTS.md.
 *
 *   node scripts/check-docs.mjs
 *
 * On GitHub Actions, each problem is also shown on the line it's on.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES = path.join(ROOT, 'pages')
const PUBLIC = path.join(ROOT, 'public')
const PAGE_EXTS = ['.mdx', '.md']

const problems = []
function report(file, line, message) {
  problems.push({ file: path.relative(ROOT, file), line, message })
}

// ---------------------------------------------------------------- pages

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

function routeOf(file) {
  const rel = path.relative(PAGES, file).replace(/\.mdx?$/, '').split(path.sep).join('/')
  const route = rel.replace(/(^|\/)index$/, '')
  return '/' + route
}

const pageFiles = walk(PAGES).filter(
  (f) => PAGE_EXTS.includes(path.extname(f)) && !path.basename(f).startsWith('_')
)
const pages = new Map(pageFiles.map((f) => [routeOf(f), f]))
const text = new Map(pageFiles.map((f) => [f, fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')]))

/** The page's lines with fenced code blocks blanked, so line numbers stay right. */
function proseLines(file) {
  let fence = null
  return text.get(file).split('\n').map((line) => {
    if (fence === null) {
      const m = line.match(/^\s*(`{3,}|~{3,})/)
      if (m) fence = m[1]
      return fence === null ? line : ''
    }
    const m = line.match(/^\s*(`{3,}|~{3,})\s*$/)
    if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null
    return ''
  })
}

// ---------------------------------------------------------------- headings

/** Heading id the way Nextra makes it (github-slugger). */
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N} _-]/gu, '')
    .replace(/ /g, '-')
}

const idCache = new Map()
/**
 * Section ids a page has: Markdown headings, explicit [#id], id="" attributes,
 * and the same from .mdx files the page imports.
 */
function sectionIds(file, seenFiles = new Set()) {
  if (idCache.has(file)) return idCache.get(file)
  seenFiles.add(file)
  const ids = new Set()
  const count = new Map()
  const lines = proseLines(file)
  for (const line of lines) {
    const h = line.match(/^\s*#{2,6}\s+(.*?)\s*#*\s*$/)
    if (h) {
      let s
      const explicit = h[1].match(/\[#([^\]]+)\]\s*$/)
      if (explicit) s = explicit[1]
      else {
        const plain = h[1]
          .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
          .replace(/<[^>]+>/g, '')
          .replace(/[`*\\]/g, '')
          .trim()
        s = slug(plain)
      }
      const n = count.get(s) || 0
      ids.add(n === 0 ? s : `${s}-${n}`)
      count.set(s, n + 1)
    }
    for (const m of line.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(m[1])
  }
  for (const line of lines) {
    const imp = line.match(/^import\s+\w+\s+from\s+['"](\.{1,2}\/[^'"]+\.mdx?)['"]/)
    if (!imp) continue
    const target = path.resolve(path.dirname(file), imp[1])
    if (text.has(target) && !seenFiles.has(target)) {
      for (const id of sectionIds(target, seenFiles)) ids.add(id)
    } else if (!fs.existsSync(target)) {
      report(file, lines.indexOf(line) + 1, `imports ${imp[1]}, which doesn't exist`)
    }
  }
  idCache.set(file, ids)
  return ids
}

// ---------------------------------------------------------------- redirects

const strip = (u) => u.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/'
// /page.md is the Markdown version of /page, written to public/ at build time.
const mdPage = (u) => /\.md$/.test(u) && pages.has(u.replace(/\.md$/, '').replace(/\/index$/, '') || '/')
// A pattern such as /clustering/:path* stands for every page under its fixed part.
const isPattern = (u) => u.includes('/:')
const fixedPart = (u) => u.split('/:')[0] || '/'
const folderExists = (u) => fs.existsSync(path.join(PAGES, u)) && fs.statSync(path.join(PAGES, u)).isDirectory()
const isStatic = (u) => {
  const p = path.join(PUBLIC, decodeURI(strip(u)).replace(/^\//, ''))
  return p.startsWith(PUBLIC) && fs.existsSync(p) && fs.statSync(p).isFile()
}

const CONFIG = path.join(ROOT, 'next.config.mjs')
const configText = fs.readFileSync(CONFIG, 'utf8')
const redirects = []
for (const m of configText.matchAll(
  /source:\s*(['"])([^'"]+)\1,\s*destination:\s*(['"])([^'"]+)\3/g
)) {
  redirects.push({ source: m[2], destination: m[4], line: configText.slice(0, m.index).split('\n').length })
}
const sourceCount = (configText.match(/\bsource:/g) || []).length
if (sourceCount !== redirects.length) {
  report(CONFIG, 1, `read ${redirects.length} of ${sourceCount} redirects; write each as source: '...', destination: '...'`)
}
const bySource = new Map()
const patterns = []

for (const r of redirects) {
  const at = (msg) => report(CONFIG, r.line, `redirect ${r.source}: ${msg}`)
  if (bySource.has(r.source)) at(`duplicate source (also on line ${bySource.get(r.source).line})`)
  else if (isPattern(r.source)) patterns.push(r)
  else bySource.set(r.source, r)
  if (!r.source.startsWith('/')) at('the source must start with /')
  if (r.source.includes('#')) at("a source with # never fires; the browser doesn't send the #section")
  if (r.source.startsWith('/docs/') || r.destination.startsWith('/docs/')) at('leave /docs out; it is added automatically')
  if (!isPattern(r.source) && pages.has(strip(r.source))) at(`hides the live page ${pages.get(strip(r.source)) && path.relative(ROOT, pages.get(strip(r.source)))}`)
}

/** Follow redirects from a route: { route, steps, loop }. */
function follow(route) {
  let cur = strip(route)
  const seen = new Set([cur])
  let steps = 0
  while (bySource.has(cur) && steps < 20) {
    const dest = bySource.get(cur).destination
    if (/^https?:/.test(dest)) return { route: dest, steps: steps + 1, external: true }
    cur = strip(dest)
    steps++
    if (seen.has(cur)) return { route: cur, steps, loop: true }
    seen.add(cur)
  }
  return { route: cur, steps }
}

for (const r of patterns) {
  const at = (msg) => report(CONFIG, r.line, `redirect ${r.source}: ${msg}`)
  if (isPattern(r.destination) && !folderExists(fixedPart(r.destination))) at(`there are no pages under ${fixedPart(r.destination)}`)
  if (folderExists(fixedPart(r.source))) at(`hides the live pages under ${fixedPart(r.source)}`)
}

for (const r of bySource.values()) {
  if (r.source.includes('#') || /^https?:/.test(r.destination)) continue
  const at = (msg) => report(CONFIG, r.line, `redirect ${r.source}: ${msg}`)
  if (!r.destination.startsWith('/')) {
    at('the destination must start with /')
    continue
  }
  const end = follow(r.source)
  if (end.loop) at('redirect loop')
  else if (end.external) continue
  else if (end.steps > 1) at(`takes ${end.steps} steps; point it straight at ${end.route}`)
  else if (!pages.has(end.route) && !isStatic(end.route) && !mdPage(end.route)) at(`${r.destination} is not a page`)
  else if (r.destination.includes('#') && pages.has(end.route)) {
    const id = r.destination.split('#')[1]
    if (!sectionIds(pages.get(end.route)).has(id)) at(`${end.route} has no section #${id}`)
  }
}

// ---------------------------------------------------------------- links

const LINK = /\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)|\bhref=\{?["'`]([^"'`]+)["'`]\}?/g
const DOCS_URL = /^https?:\/\/(www\.)?memgraph\.com\/docs(\/|$|#)/

for (const [route, file] of pages) {
  proseLines(file).forEach((line, i) => {
    for (const m of line.replace(/`[^`]*`/g, '').matchAll(LINK)) {
      const url = m[1] || m[2]
      const at = (msg) => report(file, i + 1, `${url}: ${msg}`)
      if (url.startsWith('(')) {
        at('extra parentheses around the link')
        continue
      }
      if (DOCS_URL.test(url)) {
        at(`write docs links as ${url.replace(DOCS_URL, '/').replace(/^\/+/, '/')} (no https://memgraph.com/docs)`)
        continue
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('{')) continue
      if (url.startsWith('#')) {
        const id = decodeURIComponent(url.slice(1))
        if (id && !sectionIds(file).has(id)) at(`this page has no section #${id}`)
        continue
      }
      if (!url.startsWith('/')) {
        at('use a root-relative link such as /querying/text-search, not a relative one')
        continue
      }
      if (url.startsWith('/docs/')) {
        at(`leave out /docs: ${url.slice(5)}`)
        continue
      }
      if (/\.mdx?(#|\?|$)/.test(url)) {
        at('leave out .md/.mdx')
        continue
      }
      const target = strip(url)
      const id = url.includes('#') ? decodeURIComponent(url.split('#')[1]) : ''
      if (pages.has(target)) {
        if (id && !sectionIds(pages.get(target)).has(id)) at(`${target} has no section #${id}`)
        continue
      }
      if (isStatic(target) || mdPage(target)) continue
      const pattern = patterns.find((r) => target.startsWith(fixedPart(r.source) + '/'))
      if (pattern) {
        at(`goes through the redirect ${pattern.source}; link to the page it lands on instead`)
        continue
      }
      if (bySource.has(target)) {
        const end = follow(target)
        const fixed = end.external || end.loop ? end.route : end.route + (bySource.get(target).destination.includes('#') ? '#' + bySource.get(target).destination.split('#')[1] : id ? '#' + id : '')
        at(`goes through a redirect; link to ${fixed} instead`)
        continue
      }
      at('no page or file at this address')
    }
  })
}

// ---------------------------------------------------------------- sidebar

function readMeta(file) {
  const src = fs.readFileSync(file, 'utf8').replace(/^\s*export\s+default\s*/m, '').replace(/;?\s*$/, '')
  try {
    return new Function(`return (${src})`)()
  } catch (err) {
    report(file, 1, `can't read this _meta file: ${err.message}`)
    return null
  }
}

for (const dir of [PAGES, ...walk(PAGES).map(path.dirname)].filter((d, i, a) => a.indexOf(d) === i)) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const names = new Set(
    entries
      .filter((e) => !e.name.startsWith('_') && (e.isDirectory() || PAGE_EXTS.includes(path.extname(e.name))))
      .map((e) => e.name.replace(/\.mdx?$/, ''))
  )
  if (names.size === 0) continue
  const metaFile = path.join(dir, '_meta.ts')
  if (!fs.existsSync(metaFile)) {
    report(dir, 1, 'this folder has pages but no _meta.ts, so their order and titles in the sidebar are not set')
    continue
  }
  const meta = readMeta(metaFile)
  if (!meta) continue
  const metaLines = fs.readFileSync(metaFile, 'utf8').split('\n')
  const lineOf = (key) => metaLines.findIndex((l) => l.includes(`"${key}"`) || l.includes(`'${key}'`) || l.trim().startsWith(`${key}:`)) + 1 || 1
  for (const [key, value] of Object.entries(meta)) {
    if (key === '*' || key.startsWith('--')) continue
    const isLink = value && typeof value === 'object' && (value.href || value.type === 'separator' || value.type === 'menu')
    if (!isLink && !names.has(key)) report(metaFile, lineOf(key), `"${key}" is in the sidebar but there is no page or folder with that name`)
    if (value && typeof value === 'object' && value.display === 'hidden' && names.has(key)) {
      report(metaFile, lineOf(key), `"${key}" is hidden from the sidebar but still published; list it, or delete it and add a redirect`)
    }
  }
  for (const name of names) {
    if (!(name in meta)) report(metaFile, 1, `${name} is missing from this _meta.ts, so it shows at the end of the sidebar section`)
  }
}

// ---------------------------------------------------------------- release notes

const NOTES = path.join(PAGES, 'release-notes.mdx')
if (fs.existsSync(NOTES)) {
  const lines = text.get(NOTES).split('\n')
  const seen = new Map()
  let current = null
  lines.forEach((line, i) => {
    const h = line.match(/^#{2,4}\s+(.+?)\s+v(\d+\.\d+\.\d+)\b/)
    if (h) {
      current = { product: h[1].trim(), version: h[2], line: i + 1 }
      const key = `${current.product} v${current.version}`
      if (seen.has(key)) report(NOTES, i + 1, `${key} appears twice (also on line ${seen.get(key)})`)
      else seen.set(key, i + 1)
      return
    }
    if (/^#{1,2}\s/.test(line)) current = null
    if (!current) return
    for (const m of line.matchAll(/\bversion=["'{]+v?([\d.]+)["'}]+/g)) {
      if (m[1] !== current.version) {
        report(NOTES, i + 1, `loads version ${m[1]} under the ${current.product} v${current.version} heading`)
      }
    }
  })
}

// ---------------------------------------------------------------- output

problems.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
const gh = process.env.GITHUB_ACTIONS === 'true'
for (const p of problems) {
  console.log(`${p.file}:${p.line}: ${p.message}`)
  if (gh) console.log(`::error file=${p.file},line=${p.line}::${p.message.replace(/%/g, '%25').replace(/\n/g, '%0A')}`)
}
if (problems.length) {
  console.log(`\n${problems.length} problem(s). See AGENTS.md for the rules.`)
  process.exit(1)
}
console.log(`Checked ${pages.size} pages and ${redirects.length} redirects: no problems.`)
