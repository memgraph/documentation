---
name: suggest_improvement
description: Analyze the documentation repository and propose meaningful improvements such as new pages, structural changes, content gaps, outdated sections, or navigation enhancements
---

Analyze the Memgraph documentation repository and propose meaningful, actionable
improvements. Focus on changes that would most benefit users navigating and
learning from the docs.

## Step 1 — Understand the repository layout

Start by exploring the top-level `pages/` directory and the `_meta.ts` files
that control Nextra navigation. The major documentation sections are:

- `getting-started`
- `fundamentals`
- `querying`
- `data-modeling`
- `data-migration`
- `data-streams`
- `database-management`
- `deployment`
- `clustering`
- `advanced-algorithms`
- `custom-query-modules`
- `ai-ecosystem` (GraphRAG, MCP, Skills, Agents, Machine learning, Integrations)
- `client-libraries`
- `memgraph-lab`
- `help-center`
- `release-notes`

Read several MDX files across different sections to get a representative sense
of the content depth and quality.

## Step 2 — Identify improvement opportunities

Look for the following categories of issues:

### 2a. Missing pages or topics
- Features or concepts mentioned in passing but lacking a dedicated page.
- Topics that exist in comparable databases' documentation but are absent here.
- Common user questions (check `help-center` and cross-references) that don't
  have a clear answer page.

### 2b. Structural and navigation improvements
- Sections that have grown too large and could be split.
- Closely related pages in different sections that could be merged or grouped.
- `_meta.ts` ordering that doesn't match the logical learning path a new user
  would follow.
- Top-level sections that could benefit from an index/overview page.

### 2c. Content gaps
- Pages that introduce a feature but lack a working code example.
- Guides that describe "what" but not "how" or "why".
- Pages missing prerequisite links or "next steps" pointers.
- Configuration references that omit default values or valid options.

### 2d. Outdated or inconsistent content
- References to deprecated APIs, old version numbers, or removed features.
- Inconsistent terminology across sections (e.g., mixed use of terms for the
  same concept).
- Copy-pasted boilerplate that is stale relative to the rest of the page.

### 2e. Cross-linking opportunities
- Related pages that don't link to each other.
- Concepts explained in one section that are used but not explained in another.
- "See also" sections that are missing or incomplete.

## Step 3 — Present findings

For each improvement, provide a structured entry with the following fields:

**Title:** A short, descriptive name for the suggestion.

**Type:** One of — `new page`, `restructure`, `content gap`, `outdated content`,
`cross-linking`, `navigation`.

**Affected path(s):** The file or directory path(s) relative to the repo root
(e.g., `pages/querying/read-data.mdx` or `pages/ai-ecosystem/`).

**Description:** What the problem is, what change is proposed, and why it would
help users. Keep this concise but specific enough to act on.

## Step 4 — Prioritize by impact

Sort all suggestions from highest to lowest impact using this rough rubric:

1. **Critical** — Blocks users from completing a core task or causes confusion
   about a key feature.
2. **High** — Improves discoverability or completeness for a commonly used
   feature.
3. **Medium** — Reduces friction for intermediate or advanced users.
4. **Low** — Polish, consistency, or nice-to-have improvements.

Label each suggestion with its priority level.

## Output format

Present the suggestions as a numbered markdown list, ordered by priority. Use
the structured fields above for each entry. End with a brief summary of themes
observed across the suggestions (e.g., "The ai-ecosystem section would benefit
most from additional worked examples.").
