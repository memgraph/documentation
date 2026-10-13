---
name: check-release-milestone
description: Run during and before every release to ensure all merged memgraph PRs have a docs label assigned, have changelog entries and have docs pages where required, that the release PR's tracking checklist and the docs milestone match the Memgraph milestone, and that the release branch passes `pnpm check`. Use when preparing a release branch, before merging into the main branch, or when asked to "check before release". Also use standalone when asked to audit docs labels on a milestone.
---

# Check release milestone

Run this check as PRs merge and before every release to audit docs labels on every merged PR, find PRs that are missing from the changelog or that have no documentation page despite being labeled "Docs needed", and keep the release PR and the docs milestone in step with the Memgraph milestone.

Writing quality is not checked here: docs PRs follow the `write-docs-page` skill (`memgraph/infra`, `agents/docs/skills/write-docs-page`), which covers names, terms and links to new pages, and CI checks links, anchors, names and Cypher examples.

## When to use

- Before merging the main release documentation PR (e.g. `memgraph/documentation#1530` for 3.9)
- When preparing or validating a release branch
- When asked to verify release readiness for docs/changelog

## Assumptions

- **PR list order:** Whenever you present a list of PRs to the user (gaps, backlog,
  docs tracking, changelog queue, audit findings, report tables, etc.), sort by PR
  number **ascending** (smallest → largest). Apply the same order when listing
  documentation PRs linked to memgraph PRs, unless the user asks for a different sort.
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
   - Report in chat:
     - Summary stats: total merged, count per label, count needing attention.
     - An "Issues requiring action" table listing PRs with missing or questionable labels, with a recommended label and a one-line reason (**sorted by PR # ascending**).
   - **Fix or flag:** For PRs missing a label, recommend the correct one. For questionable ones, surface them to the reviewer — do not change the label unilaterally unless it is obviously wrong (e.g. no docs label at all on a pure test PR).

2. **Identify versions**
   - Current release (e.g. `3.9`) and previous one (e.g. `3.8.0`).
   - Memgraph milestone for the release (e.g. `mg-v3.9.0`, milestone 43).
   - The docs version, release branch and docs milestone: drop `mg-v` and a trailing `.0` from the Memgraph milestone title (`mg-v3.9.0` → `3.9`, `release/3.9`, docs milestone `3.9`; a patch keeps its last number, `mg-v3.13.2` → `3.13.2`).
   - The open documentation release PR: linked as `DOCS ->` in the Memgraph milestone description (e.g. `memgraph/documentation#1530`).
   - If the branch, the docs milestone or the release PR is missing, the release hasn't been started: run the `new-release-branch` skill first.

3. **Get the authoritative lists from the docs PR**
   - Fetch the PR body via `gh api repos/memgraph/documentation/pulls/<N> --jq .body`.
   - From the **Docs Integration Tracking** section, extract:
     - Every **Docs needed** line: memgraph PR # and linked doc PR # (or "no doc PR yet").
     - Every **Changelog** line: memgraph PR # (all PRs that need a changelog entry).
     - Every **Breaking changes PRs** line: memgraph PR # marked as breaking.
   - Cross-check against the memgraph milestone (closed + merged only) to catch any PRs the docs PR has not yet listed.

4. **Changelog check**
   - Open `pages/release-notes.mdx` and locate the section for the new release (e.g. `### Memgraph v3.9.0`).
   - For each PR in **Changelog**, confirm it appears in that section (e.g. as `[#NNNN](https://github.com/memgraph/memgraph/pull/NNNN)` or equivalent).
   - For each PR in **Docs needed**, confirm its entry links to the docs page for the change (a root-relative link such as `/querying/text-search#create-text-index`). The docs CI checks that the page and section exist; this step checks that the link is there. List entries without one as **missing docs link** and add the link.
   - Optionally cross-check the memgraph milestone: merged PRs with user-visible work (e.g. **Docs needed**, **Docs - changelog only**) that are absent from that release section should also be treated as **missing from changelog**, even if they were never added to **Changelog** on the docs PR.
   - List any **missing from changelog** with PR numbers (and titles if known).

   **If anything is missing from the changelog:** follow **`skills/write-changelog-item/SKILL.md`** end-to-end for each gap. That skill defines how to write the item (user-friendly / user-centric impact, not engineering work; markdown; PR link; breaking vs non-breaking; whether the change is release-notes-only or must also be propagated into the docs), where to place it in `pages/release-notes.mdx` (correct section, ascending PR # within the section), and requires updating `pages/release-notes.mdx` plus keeping the open documentation release PR description aligned. When updating the docs PR body, use the **Docs Integration Tracking** checklist format described in the Assumptions section — tick `[x]` on the relevant **Changelog** line and, if the PR is also "Docs needed", on the **Docs needed** line once a doc PR exists. Do not use a different format or skip the release PR body update.

   **One item at a time:** When proposing or drafting changelog text, handle **a single PR / single bullet** per turn. Give the full proposed entry (wording, PR link, breaking vs non-breaking if relevant) and any file or release-PR body edits that go with that one item, then **stop and wait for reviewer feedback** before moving to the next missing item. Do not batch multiple proposed changelog bullets or multiple PR remediations in one message — the reviewer must be able to approve, edit, or reject each entry on its own.

5. **Docs page check**
   - For each memgraph PR in the **Docs needed** section, confirm the line links to a documentation PR (not `no doc PR yet`).
   - List any **docs page missing**: merged memgraph PRs labeled "Docs needed" with no corresponding doc PR on the tracking list.

6. **Docs milestone check**
   - Fetch every PR in the docs milestone and every open or merged PR into the release branch:
     ```
     gh pr list --repo memgraph/documentation --state all --search "milestone:<version>" \
       --json number,title,state,baseRefName
     gh pr list --repo memgraph/documentation --state all --base release/<version> \
       --json number,title,state,milestone
     ```
   - Cross-reference:
     - Every docs PR into `release/<version>` (except closed-without-merge) is in the docs milestone. Add the missing ones to it.
     - Every PR in the docs milestone targets `release/<version>`. Flag the others.
     - Every docs PR in the milestone that maps to a memgraph "Docs needed" PR is on the release PR's tracking list.
     - The release PR itself is in the docs milestone.
   - List open docs PRs in the milestone: they block the release.

7. **Site checks**
   - On the release branch, run `pnpm check` (links, section links, redirects, sidebar, release-note versions) and fix what it reports in the release notes. Report problems in other pages to the docs PR that introduced them.

8. **Report**
   - Sort every PR list in the report by PR number ascending (smallest → largest).
   - **Docs label issues:** list every merged PR with a missing or questionable label, the recommended label, and a one-line reason.
   - **Not in changelog:** summarize all gaps (PR numbers and titles). When remediating, apply the **one item at a time** rule from step 4. For each gap, state that remediation follows **`write-changelog-item`** per `skills/write-changelog-item/SKILL.md` (unless the user asked for report-only). Include PRs found only via milestone cross-check.
   - **Missing docs links:** entries for **Docs needed** PRs that did not link their docs page, with the link added.
   - **Docs page missing:** list merged memgraph PRs labeled "Docs needed" with no doc PR on the tracking list; briefly note what's missing (e.g. "TLS .pem-only behavior").
   - **Docs PR tracking list gaps:** if any merged "Docs needed" or "Docs - changelog only" PR is absent from the **Docs Integration Tracking** checklist on the release docs PR, add it using the checklist format from the Assumptions section (unticked `[ ]`, correct section, author handle).
   - **Docs milestone gaps:** docs PRs added to the milestone, PRs in it with the wrong base, and open docs PRs that still block the release.
   - **Site checks:** what `pnpm check` reported and what was fixed.
   - If all lists are empty, state that the release is clear for label audit, changelog, docs pages, docs milestone and site checks.

## References

- **Starting a release:** `skills/new-release-branch/SKILL.md` — creates the release branch, docs milestone and release PR.
- **Missing changelog items:** `skills/write-changelog-item/SKILL.md` — authoritative procedure to add entries and sync the docs release PR.
- Memgraph commits (since last release): `https://github.com/memgraph/memgraph/commits/master/`
- Memgraph milestone (e.g. 3.9): `https://github.com/memgraph/memgraph/milestone/43?closed=1`
- Docs milestones: `https://github.com/memgraph/documentation/milestones`
- Release notes file: `pages/release-notes.mdx`
- Documentation release PR: linked from the milestone or repo (e.g. `memgraph/documentation` open PR for the release).

## Notes

- **Label audit scope:** Step 1 can be run standalone (without the full release check) when asked to "audit docs labels" or "check labels on milestone". When run standalone, produce only the step 1 report — skip steps 2–8.
- **Changelog workflow:** Multiple missing entries are common; never merge several proposed bullets into one reviewer-facing message. One PR → one proposed changelog item → pause for review → next PR.
- **Merged PRs only:** always filter the milestone by `merged_at != null` (use `gh api "repos/memgraph/memgraph/issues?milestone=<id>&state=closed" --jq '[.[] | select(.pull_request != null and .pull_request.merged_at != null)]'`). Closed-without-merge PRs must be ignored entirely.
- PRs labeled **"Docs unnecessary"** (e.g. CI, tests, internal tooling) are excluded; no changelog or docs page required.
- If work landed in a different PR than originally planned, the changelog should reference the **merged** PR that shipped the behavior; if user-visible behavior still has no line in `release-notes.mdx`, treat it as a gap and use **write-changelog-item**.
