# Memgraph documentation

Source for [memgraph.com/docs](https://memgraph.com/docs), built with Nextra 3.
Pages are `.mdx` files in `pages/`; the file path is the URL
(`pages/querying/text-search.mdx` → `/docs/querying/text-search`).

## Writing or changing docs

Memgraph engineers: write docs with the `write-docs-page` skill
(`memgraph/infra`, `agents/docs/skills/write-docs-page`). It covers where a
change belongs, how to write the page, and how to open the docs PR from a
product PR.

The short version, for everyone:

- Prefer editing an existing page over adding one. Search `pages/` for the
  feature, flag or procedure first.
- Every page has `title` and `description` frontmatter and one `#` heading
  that matches the title. Headings are in sentence case.
- Internal links are root-relative, without `/docs` or `.mdx`:
  `[text search](/querying/text-search)`. Link to the final page, not to an
  old address that redirects, and to a `#section` that exists.
- Images go in `public/pages/` and are linked as `/pages/...`, with alt text.
- Every code block has a language; `cypher` blocks run as written on the
  current release, and Cypher comments use `//`. A `cypher` block that isn't
  meant to run says why in its fence: ` ```cypher template` (grammar such as
  `[IF NOT EXISTS]`), `invalid` (wrong on purpose), `neo4j` or `output`.
- A new page is added to its folder's `_meta.ts`, and no page is hidden. A
  renamed, moved or deleted page gets a redirect in `next.config.mjs`, and
  links to it are updated.
- Renaming a heading changes its anchor: update every link to the old one.
- Release notes (`pages/release-notes.mdx`) follow
  `skills/write-changelog-item/SKILL.md`.

## Branches and PRs

- Docs for a product change go to the docs release branch for that release
  (`release/<version>`); other changes go to `main`.
- Use `.github/pull_request_template.md` and name the product PR as
  `memgraph/memgraph#NNNN`.

## Run locally

```bash
pnpm i
pnpm dev    # http://localhost:3000/docs
pnpm check  # links, section links, redirects, sidebar and release-note versions
python3 scripts/check-examples.py --base origin/main  # Cypher examples and names on the pages you changed; needs Docker
```

Both run on every PR.
`pnpm check` reads only the checkout and takes a second. The examples check
runs each changed page's `cypher` blocks on Memgraph in Docker and fails only
on the blocks the PR changes; problems elsewhere on the page show as warnings.
