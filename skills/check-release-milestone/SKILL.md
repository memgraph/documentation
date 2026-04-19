---
name: check_before_release
description: Run before every release to ensure all merged memgraph PRs have a docs label assigned, have changelog entries, have docs pages where required, that all changed text is free of spelling and grammar issues, and that existing documentation cross-links the new content. Use when preparing a release branch, before merging into the main branch, or when asked to "check before release". Also use standalone when asked to audit docs labels on a milestone.
---

# Check before release

Run this check before every release to audit docs labels on every merged PR, find PRs that are missing from the changelog or that have no documentation page despite being labeled "Docs needed", and to catch spelling/grammar issues in changed documentation.

## When to use

- Before merging the main release documentation PR (e.g. `memgraph/documentation#1530` for 3.9)
- When preparing or validating a release branch
- When asked to verify release readiness for docs/changelog

## Assumptions

- Memgraph PRs that need docs are labeled **"Docs needed"** or **"Docs - changelog only"**.
- Only consider **merged** PRs (i.e. `merged_at != null`). PRs that are closed without merging must be ignored entirely — no changelog entry, no doc page, not in the tracking list.
- The release documentation PR (in `memgraph/documentation`) uses the following **Docs Integration Tracking** format (three plain checklist sections — no tables):

```
#### Breaking changes PRs

- [ ] https://github.com/memgraph/memgraph/pull/NNNN — short title @author

#### Docs needed (Memgraph PR → Docs PR)

- [ ] https://github.com/memgraph/memgraph/pull/NNNN → https://github.com/memgraph/documentation/pull/MMMM @author
- [ ] https://github.com/memgraph/memgraph/pull/NNNN → no doc PR yet @author

#### Changelog (all PRs requiring a changelog entry)

- [ ] https://github.com/memgraph/memgraph/pull/NNNN @author
```

Rules for this format:
- **Breaking changes PRs** — every merged PR with the `breaking` label (one line each).
- **Docs needed** — every merged PR labeled `Docs needed`. Each line ends with the doc PR link (or `no doc PR yet` if none exists) and the code PR author's GitHub handle.
- **Changelog** — every merged PR labeled `Docs needed` **or** `Docs - changelog only`. This section deliberately duplicates `Docs needed` PRs — it tracks the changelog entry independently of the doc page. Each line ends with the code PR author's handle.
- Tick `[x]` when the item is complete. GitHub renders `[ ]` as a clickable checkbox so reviewers can tick without editing markdown.

## Steps

1. **Docs label audit**
   - Fetch every merged PR in the milestone:
     ```
     gh api "repos/memgraph/memgraph/issues?milestone=<id>&state=closed&per_page=100" \
       --jq '[.[] | select(.pull_request != null and .pull_request.merged_at != null)] |
             map({number, title, author: .user.login,
                  docs_labels: [.labels[].name | select(startswith("Docs"))]})[]'
     ```
   - For each merged PR classify its docs label state:
     - **OK** — exactly one of: `Docs needed`, `Docs - changelog only`, `Docs unnecessary`.
     - **Missing label** — no docs label at all.
     - **Questionable** — the assigned label appears inconsistent with the PR content (e.g. a pure CI/test PR carrying `Docs needed`, or a user-facing feature carrying `Docs unnecessary`).
   - Apply these heuristics to spot questionable labels:
     - PRs whose title starts with `test:`, `testing:`, `tests:`, `ci:`, `infra:`, or `refactor:` and whose labels include only `infrastructure`, `tests`, `benchmarking`, or `Code improvements` almost always warrant `Docs unnecessary`.
     - PRs labeled `feature` that carry `Docs unnecessary` should be scrutinised — only internal-only features (no new flags, commands, or user-visible behavior) are legitimately `Docs unnecessary`.
     - Build-system / packaging PRs (Conan, CMake, Docker CI changes) are normally `Docs unnecessary` unless they change how end-users build or install Memgraph.
   - For PRs where the label is missing or questionable, fetch the PR body for context:
     ```
     gh pr view <number> --repo memgraph/memgraph --json title,body,labels,author
     ```
   - Produce a **canvas** (read and follow `~/.cursor/skills-cursor/canvas/SKILL.md`) showing:
     - Summary stats: total merged, count per label, count needing attention.
     - An "Issues requiring action" section listing PRs with missing or questionable labels, with a recommended label and a one-line reason.
     - A filterable table of all merged PRs with their current docs label highlighted.
   - **Fix or flag:** For PRs missing a label, recommend the correct one. For questionable ones, surface them to the reviewer — do not change the label unilaterally unless it is obviously wrong (e.g. no docs label at all on a pure test PR).

2. **Identify versions**
   - Current release (e.g. `3.9`) and previous one (e.g. `3.8.0`).
   - Memgraph milestone for the release (e.g. `mg-v3.9.0`, milestone 43).
   - The open documentation release PR (e.g. `memgraph/documentation#1530`).

3. **Get the authoritative lists from the docs PR**
   - Fetch the PR body via `gh api repos/memgraph/documentation/pulls/<N> --jq .body`.
   - From the **Docs Integration Tracking** section, extract:
     - Every **Docs needed** line: memgraph PR # and linked doc PR # (or "no doc PR yet").
     - Every **Changelog** line: memgraph PR # (all PRs that need a changelog entry).
     - Every **Breaking changes PRs** line: memgraph PR # marked as breaking.
   - Cross-check against the memgraph milestone (closed + merged only) to catch any PRs the docs PR has not yet listed.

4. **Changelog check**
   - Open `pages/release-notes.mdx` and locate the section for the new release (e.g. `### Memgraph v3.9.0`).
   - For each PR in **Release Notes Required**, confirm it appears in that section (e.g. as `[#NNNN](https://github.com/memgraph/memgraph/pull/NNNN)` or equivalent).
   - Optionally cross-check the memgraph milestone: merged PRs with user-visible work (e.g. **Docs needed**, **Docs - changelog only**) that are absent from that release section should also be treated as **missing from changelog**, even if they were never added to **Release Notes Required** on the docs PR.
   - List any **missing from changelog** with PR numbers (and titles if known).

   **If anything is missing from the changelog:** follow **`skills/write-changelog-item/SKILL.md`** end-to-end for each gap. That skill defines how to write the item (benefit-focused bullet, markdown, PR link, breaking vs non-breaking) and requires updating `pages/release-notes.mdx` plus keeping the open documentation release PR description aligned. When updating the docs PR body, use the **Docs Integration Tracking** checklist format described in the Assumptions section — tick `[x]` on the relevant **Changelog** line and, if the PR is also "Docs needed", on the **Docs needed** line once a doc PR exists. Do not use a different format or skip the release PR body update.

   **One item at a time:** When proposing or drafting changelog text, handle **a single PR / single bullet** per turn. Give the full proposed entry (wording, PR link, breaking vs non-breaking if relevant) and any file or release-PR body edits that go with that one item, then **stop and wait for reviewer feedback** before moving to the next missing item. Do not batch multiple proposed changelog bullets or multiple PR remediations in one message — the reviewer must be able to approve, edit, or reject each entry on its own.

5. **Docs page check**
   - For each memgraph PR in the **Docs needed** section, confirm the line links to a documentation PR (not `no doc PR yet`).
   - Fetch the documentation milestone (e.g. `memgraph/documentation/milestone/<id>`) and cross-reference: any doc PR in the milestone that maps to a memgraph "Docs needed" PR should be reflected on the docs PR's tracking list.
   - List any **docs page missing**: merged memgraph PRs labeled "Docs needed" with no corresponding doc PR on the tracking list.

6. **Grammar and spelling check**
   - Run `git diff main...HEAD -- '*.mdx' '*.md'` (or the appropriate base branch) to get all text changes on the release branch.
   - Review every added or modified line for:
     - **Spelling mistakes** (typos, wrong words).
     - **Broken sentence structure** (e.g. "Fixed X causes Y" instead of "Fixed a bug where X caused Y").
     - **Missing articles** ("creation of init container" → "creation of **an** init container").
     - **Wrong word forms** ("set-up" used as a verb → "set up"; "additionally to" → "in addition to").
     - **Stray punctuation** (accidental periods, double spaces in non-trailing positions).
     - **Capitalization** - if the text is dealing with high availability and mentioning MAIN and REPLICA instances, use capital letters. When using in plural, write MAINs and REPLICAs.
     
   - Do **not** rewrite for style or restructure paragraphs. Only fix clear errors: misspellings, missing/wrong articles, broken grammar, and wrong word forms.
   - Apply fixes directly, then list what was changed in the report.

7. **Cross-linking integration check**
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

8. **Report**
   - **Docs label issues:** list every merged PR with a missing or questionable label, the recommended label, and a one-line reason. The canvas from step 1 serves as the primary deliverable for this section.
   - **Not in changelog:** summarize all gaps (PR numbers and titles). When remediating, apply the **one item at a time** rule from step 4. For each gap, state that remediation follows **`write_changelog_item`** per `skills/write-changelog-item/SKILL.md` (unless the user asked for report-only). Include PRs found only via milestone cross-check.
   - **Docs page missing:** list merged memgraph PRs labeled "Docs needed" with no doc PR on the tracking list; briefly note what's missing (e.g. "TLS .pem-only behavior").
   - **Docs PR tracking list gaps:** if any merged "Docs needed" or "Docs - changelog only" PR is absent from the **Docs Integration Tracking** checklist on the release docs PR, add it using the checklist format from the Assumptions section (unticked `[ ]`, correct section, author handle).
   - **Spelling/grammar fixes:** list each fix with file name and a short before → after summary.
   - **Cross-link improvements:** list each proposed (or applied) edit with file, location, what was added, and why.
   - If all lists are empty, state that the release is clear for label audit, changelog, docs, grammar, and cross-links.

## References

- **Canvas skill:** `~/.cursor/skills-cursor/canvas/SKILL.md` — required for producing the label audit canvas in step 1.
- **Missing changelog items:** `skills/write-changelog-item/SKILL.md` — authoritative procedure to add entries and sync the docs release PR.
- Memgraph commits (since last release): `https://github.com/memgraph/memgraph/commits/master/`
- Memgraph milestone (e.g. 3.9): `https://github.com/memgraph/memgraph/milestone/43?closed=1`
- Release notes file: `pages/release-notes.mdx`
- Documentation release PR: linked from the milestone or repo (e.g. `memgraph/documentation` open PR for the release).

## Notes

- **Label audit scope:** Step 1 can be run standalone (without the full release check) when asked to "audit docs labels" or "check labels on milestone". When run standalone, produce only the canvas and a brief chat summary — skip steps 2–8.
- **Changelog workflow:** Multiple missing entries are common; never merge several proposed bullets into one reviewer-facing message. One PR → one proposed changelog item → pause for review → next PR.
- **Merged PRs only:** always filter the milestone by `merged_at != null` (use `gh api "repos/memgraph/memgraph/issues?milestone=<id>&state=closed" --jq '[.[] | select(.pull_request != null and .pull_request.merged_at != null)]'`). Closed-without-merge PRs must be ignored entirely.
- PRs labeled **"Docs unnecessary"** (e.g. CI, tests, internal tooling) are excluded; no changelog or docs page required.
- If work landed in a different PR than originally planned, the changelog should reference the **merged** PR that shipped the behavior; if user-visible behavior still has no line in `release-notes.mdx`, treat it as a gap and use **write_changelog_item**.
- The grammar check scope is the diff against `main` (or the base branch). Existing text that was not touched in this release is out of scope.
- When writing the local tracking file (`.release-tracking/vX.Y.Z.md`), keep it in sync with the docs PR body — both should reflect the same checklist state.
