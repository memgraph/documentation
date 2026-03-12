---
name: check_before_release
description: Run before every release to ensure all memgraph PRs have changelog entries and docs pages where required. Use when preparing a release branch, before merging into the main branch, or when asked to "check before release".
---

# Check before release

Run this check before every release to find memgraph PRs that are missing from the changelog or that have no documentation page despite being labeled "Docs needed".

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
   - Optionally fetch the milestone or PR list from `github.com/memgraph/memgraph/milestone/<id>` and find any PR with label "Docs needed" that is **not** mentioned in the docs PR’s "Memgraph PRs Docs Needed" list.
   - List any **docs page missing**: PRs labeled "Docs needed" (or that clearly need a dedicated docs page) with no corresponding doc PR in the release docs PR.

5. **Report**
   - **Not in changelog:** list of memgraph PR numbers (and titles if helpful) that are in Release Notes Required but not in `release-notes.mdx` for this release.
   - **Docs page missing:** list of memgraph PR/issue numbers with "Docs needed" and no doc PR linked in the release docs PR; briefly note what’s missing (e.g. “TLS .pem-only behavior”).
   - If both lists are empty, state that the release is clear for changelog and docs.

## References

- Memgraph commits (since last release): `https://github.com/memgraph/memgraph/commits/master/`
- Memgraph milestone (e.g. 3.9): `https://github.com/memgraph/memgraph/milestone/43?closed=1`
- Release notes file: `pages/release-notes.mdx`
- Documentation release PR: linked from the milestone or repo (e.g. `memgraph/documentation` open PR for the release).

## Notes

- PRs labeled **"Docs unnecessary"** (e.g. CI, tests, internal tooling) are excluded; no changelog or docs page required.
- If a memgraph PR was closed and its work continued in another PR (e.g. #3788 → #3795), treat the one that actually merged; if the closed PR had "Docs needed" and the follow-up is "Docs unnecessary", still report the gap if the behavior is not documented.
