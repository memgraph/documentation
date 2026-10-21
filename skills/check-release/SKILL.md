---
name: check-release
description: Find what a Memgraph documentation release still needs, keep the overview in the release PR up to date, and on release day finish the release. Reports how much of the Memgraph milestone is merged, checks the docs labels on every merged PR in it, release notes for every PR that needs one, a docs PR for every "Docs needed" PR (and no docs for product PRs outside the milestone), the docs milestone and `pnpm check`, and fixes the problems docs PRs noticed in one PR per release; on release day also sets the release dates, updates the direct download links, gets the release PR's examples check passing and closes the docs milestone after the merge. Use while a release is in progress, before merging a release branch into main, or when asked to "check the release", "check before release", run "pre-release" steps or audit docs labels on a milestone.
---

# Check release

Works out what a release still needs from GitHub itself — the Memgraph
milestone, the docs labels on its PRs, the docs milestone and the release
branch — and writes the result as the overview in the release PR
description, so nobody tracks it by hand. Run it as often as needed while
the release is in progress. On release day, run it once more and
finish with the release-day steps.

Writing quality is not checked here: docs PRs follow the `write-docs-page`
skill (`memgraph/infra`, `agents/docs/skills/write-docs-page`), which covers
names, terms and links to new pages, and CI checks links, anchors, names and
Cypher examples.

## Rules

- **Merged PRs only:** a Memgraph PR counts once `merged_at != null`. PRs
  closed without merging are ignored entirely.
- **Docs labels:** every merged PR carries exactly one of `Docs needed`,
  `Docs - changelog only` or `Docs unnecessary`. `Docs needed` means a docs
  PR and a release note; `Docs - changelog only` means a release note;
  `Docs unnecessary` means neither.
- **PR order:** sort every list of PRs by PR number ascending (smallest →
  largest).
- **One release note at a time:** when a release note is missing, draft
  **one** entry with `skills/write-changelog-item/SKILL.md`, then stop and
  wait for the reviewer before the next one. Never batch several entries
  into one message.

## Steps

### 1. Find the release

From the version or Memgraph milestone the user gives (e.g. `mg-v3.15.0`):

- **Version:** drop `mg-v` and a trailing `.0` from the milestone title
  (`mg-v3.15.0` → `3.15`; a patch keeps its last number, `mg-v3.13.2` →
  `3.13.2`).
- **Release branch** `release/<version>`, **docs milestone** `<version>`, and
  the **release PR**, linked as `DOCS ->` in the Memgraph milestone
  description.
- **Release notes section:** the `### Memgraph v<full_version>` heading in
  `pages/release-notes.mdx` on the release branch.

If the branch, the docs milestone or the release PR is missing, the release
hasn't been started: run the `new-release-branch` skill first.

Fetch every PR in the Memgraph milestone once and reuse it below:

```bash
gh api --paginate "repos/memgraph/memgraph/issues?milestone=<id>&state=all&per_page=100" \
  --jq '.[] | select(.pull_request != null) |
        {number, title, author: .user.login, labels: [.labels[].name],
         status: (if .pull_request.merged_at then "merged"
                  elif .state == "open" then (if .draft then "draft" else "open" end)
                  else "closed" end)}'
```

Steps 2–5 use the merged PRs only. Open and draft PRs count only toward
progress; PRs closed without merging are left out entirely.

**Progress:** how much of the Memgraph milestone is merged, which tells how
much docs work can be done now and how much has to wait:

- **All PRs:** merged out of merged + open + draft, as a percentage.
- **Docs work:** the same for PRs labeled `Docs needed` or
  `Docs - changelog only`, split by label: merged ones can be documented
  now, open and draft ones can't yet.

### 2. Docs labels

Classify each merged PR:

- **OK** — exactly one docs label.
- **Missing label** — no docs label.
- **Questionable** — the label looks inconsistent with the PR. Heuristics:
  - PRs whose title starts with `test:`, `testing:`, `tests:`, `ci:`,
    `infra:` or `refactor:` and whose labels include only `infrastructure`,
    `tests`, `benchmarking` or `Code improvements` almost always warrant
    `Docs unnecessary`.
  - PRs labeled `feature` that carry `Docs unnecessary` should be
    scrutinised — only internal-only features (no new flags, commands or
    user-visible behavior) are legitimately `Docs unnecessary`.
  - Build-system / packaging PRs (Conan, CMake, Docker CI changes) are
    normally `Docs unnecessary` unless they change how end-users build or
    install Memgraph.

For missing or questionable labels, read the PR
(`gh pr view <number> --repo memgraph/memgraph --json title,body,labels,author`)
and recommend a label with a one-line reason. Do not change a label yourself
unless it is obviously wrong (e.g. no docs label at all on a pure test PR).

When asked only to "audit docs labels", stop after this step and report.

### 3. Release notes

In the release notes section on the release branch:

- Every merged PR labeled `Docs needed` or `Docs - changelog only` has an
  entry with its PR link (`[#NNNN](https://github.com/memgraph/memgraph/pull/NNNN)`).
  If work landed in a different PR than planned, the entry references the
  merged PR that shipped the behavior.
- Every PR labeled `breaking` is under the Breaking changes heading, and only
  there.
- Every `Docs needed` entry links the docs page for the change (a
  root-relative link such as `/querying/text-search#create-text-index`). CI
  checks the page and section exist; this step checks the link is there.

Fix each gap with `write-changelog-item`, one entry at a time.

### 4. Docs PRs

List the docs PRs for the release and the product PRs they name (a docs PR
names its product PR as `memgraph/memgraph#NNNN`):

```bash
gh pr list --repo memgraph/documentation --state all --search "milestone:<version>" \
  --json number,state,baseRefName,body \
  --jq '.[] | {number, state, base: .baseRefName,
              product: [.body | scan("memgraph/memgraph(?:#|/pull/)([0-9]+)") | .[0]]}'
```

- Ignore docs PRs in state `CLOSED`: they were closed without merging.
- Ignore the release PR (titled `Memgraph v<version>`): it names every PR in
  the release.
- Note the docs PRs whose description has a `### Release note corrections`
  section, and which product PRs it lists. The overview points to them.
- Collect the items under `### Noticed, not fixed` in each docs PR
  description, with the docs PR they came from, for step 6. A docs PR
  written before the section had a fixed heading may list them as free text
  ("Noticed, not fixed: …"); read those the same way.
- Every merged PR labeled `Docs needed` has a docs PR. If none names it,
  check the product PR's "Documentation PR link" comment
  (`gh api repos/memgraph/memgraph/issues/<N>/comments`) before calling it
  missing.
- Every product PR a docs PR names is merged and in this Memgraph milestone.
  A docs PR can cover several product PRs, and one of them may move to a
  later release. Its content then documents a feature that doesn't ship:
  move that part to a new docs PR in the next release's docs milestone.
- Open docs PRs still block the release.

### 5. Docs milestone

- Every docs PR into `release/<version>` (except closed-without-merge) is in
  the docs milestone; add the missing ones:
  `gh pr list --repo memgraph/documentation --state all --base release/<version> --json number,state,milestone`.
- Every PR in the docs milestone targets `release/<version>`; flag the others.
- The release PR is in the docs milestone.

### 6. Noticed problems

Docs PRs list broken things they noticed outside their own change under
`### Noticed, not fixed`. Fix them all in one PR per release, into the
release branch so the fixes don't conflict with the release's own changes.

- **When:** once most docs PRs for the release are merged, and at the latest
  before release day. Ask the user before opening the PR; until then, only
  list the items.
- **Find the PR:** it uses the branch `docs/<version>-noticed-fixes`. If it
  exists, add new items to it instead of opening another.
- **Skip** items already fixed on the release branch (read the page there).
- **Fix** each remaining item following the `write-docs-page` skill's
  rules, keeping each fix to the item: no reformatting of the rest of the
  page. Re-run any Cypher example you change on a build with the release's
  changes, such as the newest daily build.
- **Open** the PR as a draft into `release/<version>`, in the docs milestone,
  with no label, titled "Fix problems noticed while writing the <version>
  docs". Fill the body from `.github/pull_request_template.md` with "none"
  as the product PR, and list every item with the docs PR it came from.
  Items you couldn't fix stay listed with the reason.

### 7. Site checks

On the release branch, run `pnpm check` (links, section links, redirects,
sidebar, release-note versions). Fix what it reports in the release notes;
report problems in other pages to the docs PR that introduced them.

### 8. Update the overview in the release PR

The release PR description holds the release overview between two markers.
This skill is the only thing that writes between them: rebuild the block
from steps 1–6 on every run, and leave everything outside the markers as it
is. If the description has no markers yet, add the block at the end; if it
has an older hand-kept "Docs Integration Tracking" section, replace that
section with the block.

~~~
<!-- check-release:start -->
### Docs Integration Tracking

Rebuilt by the `check-release` skill on <YYYY-MM-DD>; edits here are
overwritten. To change what is listed, fix the product PR's docs label.

#### Progress

Memgraph milestone: 166 of 217 PRs merged (76%); 29 open, 22 draft.

| Docs work | Merged (can be done now) | Open or draft (waiting) |
| --- | --- | --- |
| Docs needed | 17 | 10 |
| Docs - changelog only | 53 | 24 |
| **Total** | **70 of 104 (67%)** | **34** |

#### Breaking changes PRs

- [x] https://github.com/memgraph/memgraph/pull/NNNN — short title @author

#### Docs needed (Memgraph PR → Docs PR)

- [x] https://github.com/memgraph/memgraph/pull/NNNN → https://github.com/memgraph/documentation/pull/MMMM @author
- [ ] https://github.com/memgraph/memgraph/pull/NNNN → no doc PR yet @author

#### Changelog (all PRs requiring a changelog entry)

- [ ] https://github.com/memgraph/memgraph/pull/NNNN @author
- [ ] https://github.com/memgraph/memgraph/pull/NNNN @author ⚠ corrections in memgraph/documentation#MMMM

#### Missing docs labels

- [ ] https://github.com/memgraph/memgraph/pull/NNNN @author

#### Noticed, not fixed

- [ ] `pages/<path>.mdx`: what's wrong — from memgraph/documentation#MMMM
<!-- check-release:end -->
~~~

What goes in each section, in ascending PR number order (the numbers in
Progress are an example):

- **Progress:** from step 1, counted fresh on every run.

- **Breaking changes PRs:** merged PRs labeled `breaking`. Ticked when the
  entry is under the Breaking changes heading in the release notes.
- **Docs needed:** merged PRs labeled `Docs needed`, with their docs PR (or
  `no doc PR yet`). Ticked when the docs PR is merged. A product PR with
  several docs PRs lists all of them; tick it when all are merged.
- **Changelog:** merged PRs labeled `Docs needed` or `Docs - changelog only`.
  This deliberately repeats the `Docs needed` PRs: it tracks the release
  note apart from the docs page. Ticked when the entry is in the release
  notes. When a docs PR lists release note corrections for the product PR,
  end the line with `⚠ corrections in memgraph/documentation#MMMM`, so
  whoever writes the entry starts from them.
- **Missing docs labels:** merged PRs with no docs label. Leave the section
  out when there are none.
- **Noticed, not fixed:** the items from step 6. Ticked when the
  noticed-fixes PR that fixes them is merged; an item it couldn't fix ends
  with the reason. Leave the section out when there are none.

Write the description with `gh api`, not `gh pr edit` (which can fail on
this repo):

```bash
gh api repos/memgraph/documentation/pulls/<release_pr> --jq .body > body.md
# replace the block between the markers in body.md
gh api repos/memgraph/documentation/pulls/<release_pr> -X PATCH -F body=@body.md
```

### 9. Report

Sort every PR list by PR number ascending, and skip sections with nothing to
report:

- **Progress:** the step 1 numbers, as in the overview.
- **Docs labels:** missing or questionable labels, the recommended label and
  a one-line reason.
- **Release notes:** PRs with no entry, breaking changes outside the Breaking
  section, `Docs needed` entries with no docs link, and docs PRs with release
  note corrections for entries already written (check the entry follows
  them).
- **Docs PRs:** `Docs needed` PRs with no docs PR (with the author's
  `@handle`), open docs PRs, and docs PRs that name a product PR not merged
  in this milestone (with that PR's milestone).
- **Docs milestone:** PRs added to it, PRs in it with the wrong base.
- **Noticed problems:** items found, and the noticed-fixes PR (or that it
  hasn't been opened yet).
- **Site checks:** what `pnpm check` reported and what was fixed. On
  release day, also the release PR's `Examples and names` result.

Link the release PR so the user can see the updated overview. If every
section is empty, say the release is ready.

## Release day

Run these only when the user says it's release day, after steps 1–9 report
the release ready, including a merged noticed-fixes PR (step 6).

### 10. Set the release dates

In `pages/release-notes.mdx`, set the date on the release's
`### Memgraph v<version> - <date>` heading (and its `### Lab v<version> -
<date>` heading, if Lab ships with it) to today, in the same format (e.g.
`May 6th, 2026` → `May 13th, 2026`).

### 11. Update the direct download links

In `pages/getting-started/install-memgraph/direct-download-links.mdx`,
replace **every** occurrence of the previous version with the new one.

- The file has download URLs for Docker, CentOS, Debian, Fedora, Rocky, Red
  Hat and Ubuntu packages, with the version both in path segments (`v3.8.1`)
  and file names (`3.8.1`).
- A global find-and-replace of the bare old version string (e.g. `3.8.1` →
  `3.9.0`) covers both patterns in one pass.
- Verify every URL in the file references only the new version.

Run `pnpm check` again, then commit and push to the release branch.

Before the release PR is merged, its `Examples and names` CI job must pass.
It runs the Cypher examples the release changes on the new version's image,
so it can only pass once that image is published; rerun it then. Fix what it
reports on the release branch: a block that isn't meant to run gets a fence
mark (` ```cypher invalid `, `template`, `neo4j` or `output`), and a real
broken example goes back to the docs PR that introduced it.

### 12. After the release PR is merged

Close the docs milestone. If PRs are still open in it, ask the user whether
to move them to the next release's milestone first.

```bash
gh api repos/memgraph/documentation/milestones/<milestone_number> \
  --method PATCH -f state=closed
```
