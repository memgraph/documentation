---
name: check_before_release
description: Run before every release to ensure all memgraph PRs have changelog entries, docs pages where required, that all changed text is free of spelling and grammar issues, and that existing documentation cross-links the new content. Use when preparing a release branch, before merging into the main branch, or when asked to "check before release".
---

# Check before release

Run this check before every release to find memgraph PRs that are missing from the changelog or that have no documentation page despite being labeled "Docs needed", and to catch spelling/grammar issues in changed documentation.

## When to use

- Before merging the main release documentation PR (e.g. `memgraph/documentation#1530` for 3.9)
- When preparing or validating a release branch
- When asked to verify release readiness for docs/changelog

## Assumptions

- Memgraph PRs that need docs are labeled **"Docs needed"** or **"Docs - changelog only"**.
- The release documentation PR (in `memgraph/documentation`) contains two lists:
  - **Memgraph PRs Docs Needed** – memgraph PR numbers with their corresponding doc PRs (e.g. `memgraph#3801 → #1555`).
  - **Release Notes Required** – memgraph PR numbers that must appear in the changelog.

## Steps

1. **Identify versions**
   - Current release (e.g. `3.9`) and previous one (e.g. `3.8.0`).
   - Memgraph milestone for the release (e.g. `mg-v3.9.0`, milestone 43).
   - The open documentation release PR (e.g. `memgraph/documentation#1530`).

2. **Get the authoritative lists from the docs PR**
   - From the PR description, extract:
     - Every **Memgraph PRs Docs Needed** line: memgraph PR # and linked doc PR #.
     - Every **Release Notes Required** line: memgraph PR # (and title if present).

3. **Changelog check**
   - Open `pages/release-notes.mdx` and locate the section for the new release (e.g. `### Memgraph v3.9.0`).
   - For each PR in **Release Notes Required**, confirm it appears in that section (e.g. as `[#NNNN](https://github.com/memgraph/memgraph/pull/NNNN)` or equivalent).
   - List any **missing from changelog**: PRs in Release Notes Required with no link in the release section.

4. **Docs page check**
   - For each memgraph PR listed under **Memgraph PRs Docs Needed**, confirm the description links to a documentation PR (e.g. `→ #1555`).
   - Optionally fetch the milestone or PR list from `github.com/memgraph/memgraph/milestone/<id>` and find any PR with label "Docs needed" that is **not** mentioned in the docs PR's "Memgraph PRs Docs Needed" list.
   - List any **docs page missing**: PRs labeled "Docs needed" (or that clearly need a dedicated docs page) with no corresponding doc PR in the release docs PR.

5. **Grammar and spelling check**
   - Run `git diff main...HEAD -- '*.mdx' '*.md'` (or the appropriate base branch) to get all text changes on the release branch.
   - Review every added or modified line for:
     - **Spelling mistakes** (typos, wrong words).
     - **Broken sentence structure** (e.g. "Fixed X causes Y" instead of "Fixed a bug where X caused Y").
     - **Missing articles** ("creation of init container" → "creation of **an** init container").
     - **Wrong word forms** ("set-up" used as a verb → "set up"; "additionally to" → "in addition to").
     - **Stray punctuation** (accidental periods, double spaces in non-trailing positions).
   - Do **not** rewrite for style or restructure paragraphs. Only fix clear errors: misspellings, missing/wrong articles, broken grammar, and wrong word forms.
   - Apply fixes directly, then list what was changed in the report.

6. **Cross-linking integration check**
   - Run `git diff main...HEAD --name-only -- '*.mdx' '*.md'` to get every file changed on the release branch.
   - For each changed file, identify the **key new concepts** it introduces (new pages, new sections, new Cypher commands, new configuration, renamed behavior). These are the integration targets.
   - Scan the existing documentation on `main` for pages that discuss the same topic area but do **not** yet link to the new content. Efficient approach:
     - Grep for related keywords (e.g. feature name, command name, config flag) across `pages/`.
     - Check hub/landing pages (`_meta.ts` siblings, parent `.mdx` files) that list sub-pages — a new page may be missing from the hub.
     - Check pages that mention the old behavior or a related workflow.
   - Propose **up to 5** high-leverage, minimal edits. Prioritize:
     1. Hub/landing pages missing a link to a new sub-page or section.
     2. Pages that describe a related concept without linking to the new dedicated page (e.g. client-side parameters page not mentioning server-side parameters).
     3. Pages that reference a command or workflow whose behavior changed, where a one-line note + link avoids reader surprise.
   - For each proposal, state: **file**, **location** (section or line range), **what to add** (sentence or callout), and **why** (what reader journey it fixes).
   - After user approval, apply the edits directly.

7. **Report**
   - **Not in changelog:** list of memgraph PR numbers (and titles if helpful) that are in Release Notes Required but not in `release-notes.mdx` for this release.
   - **Docs page missing:** list of memgraph PR/issue numbers with "Docs needed" and no doc PR linked in the release docs PR; briefly note what's missing (e.g. "TLS .pem-only behavior").
   - **Spelling/grammar fixes:** list each fix with file name and a short before → after summary.
   - **Cross-link improvements:** list each proposed (or applied) edit with file, location, what was added, and why.
   - If all lists are empty, state that the release is clear for changelog, docs, grammar, and cross-links.

## References

- Memgraph commits (since last release): `https://github.com/memgraph/memgraph/commits/master/`
- Memgraph milestone (e.g. 3.9): `https://github.com/memgraph/memgraph/milestone/43?closed=1`
- Release notes file: `pages/release-notes.mdx`
- Documentation release PR: linked from the milestone or repo (e.g. `memgraph/documentation` open PR for the release).

## Notes

- PRs labeled **"Docs unnecessary"** (e.g. CI, tests, internal tooling) are excluded; no changelog or docs page required.
- If a memgraph PR was closed and its work continued in another PR (e.g. #3788 → #3795), treat the one that actually merged; if the closed PR had "Docs needed" and the follow-up is "Docs unnecessary", still report the gap if the behavior is not documented.
- The grammar check scope is the diff against `main` (or the base branch). Existing text that was not touched in this release is out of scope.
