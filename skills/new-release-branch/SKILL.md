---
name: new-release-branch
description: >-
  Start a Memgraph documentation release: create the release branch and the
  docs milestone, scaffold the release-notes titles, open the release PR and
  link it from the Memgraph milestone. Works for minor (3.15) and patch
  (3.13.2) releases. Use when the user wants to start a new release, create a
  release branch or milestone, or prepare release notes for a new version.
---

# New Release Branch

Sets up everything a release needs in the documentation repo, so that docs
PRs for the release have a branch and a milestone to target:

- the release branch `release/<version>`
- the docs milestone `<version>`
- the release-notes titles on that branch
- the release PR, in the docs milestone, with an empty overview block for
  `check-release` to fill
- a `DOCS ->` link from the Memgraph milestone to the release PR

The `write-docs-page` skill opens docs PRs on this branch and milestone and
never creates them itself, so create both as soon as the Memgraph milestone
exists.

## Step 1 — Gather information

Ask the user for:

1. **Memgraph milestone** — URL or title, e.g.
   `https://github.com/memgraph/memgraph/milestone/58` or `mg-v3.15.0`.
2. **Lab release** — whether Lab ships with this release and, if so, its
   version. Minor releases usually have one; patch releases usually don't
   (Lab patches get their own PR to `main`).

Read the rest from the milestone:

```bash
gh api repos/memgraph/memgraph/milestones/<milestone_number> \
  --jq '{title, due_on, description}'
```

- **Version:** drop `mg-v` and a trailing `.0` from the title, the same rule
  `write-docs-page` uses (`mg-v3.15.0` → `3.15`; a patch keeps its last
  number, `mg-v3.13.2` → `3.13.2`). The version names the branch
  (`release/3.15`) and the docs milestone (`3.15`).
- **Release notes version:** the full version from the title (`v3.15.0`,
  `v3.13.2`).
- **Date:** the milestone's `due_on`, written like `December 2nd, 2026`. The
  `check-release` skill sets the real date on release day.

If the branch already exists (`git ls-remote --heads origin release/<version>`),
stop and tell the user: the release has already been started.

## Step 2 — Create the docs milestone

Check whether the docs milestone exists, and create it if it doesn't, with
the Memgraph milestone's due date:

```bash
gh api "repos/memgraph/documentation/milestones?state=all&per_page=100" \
  --jq '.[] | select(.title == "<version>") | .number'

gh api repos/memgraph/documentation/milestones --method POST \
  -f title='<version>' -f due_on='<due_on>'
```

## Step 3 — Create the branch

```bash
cd <documentation-repo-root>
git checkout main && git pull
git checkout -b release/<version>
```

## Step 4 — Edit `pages/release-notes.mdx`

The file has this high-level structure:

```
## 🚀 Latest release

### Memgraph <previous_version> - <previous_date>
...content...

### Lab <previous_lab_version> - <previous_lab_date>

<LabReleasesClient version="<prev_lab_ver>" />

## Previous releases

### Memgraph <older_version> ...
```

### Patch release

Insert the new Memgraph title immediately after the line
`## 🚀 Latest release`, above the current entries, and move nothing:

```
### Memgraph <new_version> - <new_date>
```

The patch stays under "Latest release" with the minor release it patches.
Add a Lab title only if Lab ships with this patch.

If the next minor release branch is already open, its release notes have
moved the patched minor under `## Previous releases`. When `main` is merged
into that branch after the patch ships, put the patch heading there, above
the minor it patches, and keep a single `## Previous releases` heading.
`pnpm check` fails on a repeated `##` section.

### Minor release

Make **two** changes:

#### 4a — Add new empty titles above the current latest

Insert immediately after the line `## 🚀 Latest release`:

```
### Memgraph <new_version> - <new_date>

### Lab <new_lab_version> - <new_lab_date>

<LabReleasesClient version="<new_lab_ver>" />
```

#### 4b — Move previous latest Memgraph + Lab into "Previous releases"

Take the **entire previous latest block** — from the old
`### Memgraph <prev_version>` heading through the old
`### Lab <prev_lab_version>` + its `<LabReleasesClient ... />` line — and
move it so it appears right after the `## Previous releases` heading (before
whatever was previously the first entry there).

The result should look like:

```
## 🚀 Latest release

### Memgraph <new_version> - <new_date>

### Lab <new_lab_version> - <new_lab_date>

<LabReleasesClient version="<new_lab_ver>" />

## Previous releases

### Memgraph <prev_version> - <prev_date>
...all previous content...

### Lab <prev_lab_version> - <prev_lab_date>

<LabReleasesClient version="<prev_lab_ver>" />

### Memgraph <older_version> ...
```

**Important:** If there are multiple Memgraph patch releases under Latest
(e.g. v3.8.1 and v3.8.0), move *all* of them together with the Lab entry.

**Implementation tip:** Make both changes in one edit by matching from
`## 🚀 Latest release` through `## Previous releases` and rewriting the
entire block at once. This avoids error-prone multi-step edits where
`## Previous releases` can end up in the wrong place.

Run `pnpm check` before committing; it checks that each `LabReleasesClient`
version matches its heading.

## Step 5 — Commit and push

```bash
git add pages/release-notes.mdx
git commit -m "Add Memgraph <new_version> release note titles"
git push -u origin release/<version>
```

Name the Lab version in the commit message too when there is one.

## Step 6 — Create the PR

Open a draft PR from `release/<version>` into `main`, in the docs milestone:

```bash
gh pr create --draft --base main --head release/<version> \
  --title "Memgraph <new_version>" --milestone "<version>" --body-file <file>
```

Use this body (fill in the placeholders):

~~~
Milestones
* Memgraph -> <memgraph_milestone_url>
* Docs -> <docs_milestone_url>

Run the `check-release` skill to see what the release still needs; run it
with "release day" before merging.

<!-- check-release:start -->
### Docs Integration Tracking

Not built yet: run the `check-release` skill.
<!-- check-release:end -->
~~~

`check-release` fills the block between the markers with the release
overview (breaking changes, docs PRs, release notes) from the Memgraph
milestone and its docs labels. Don't edit the block by hand.

## Step 7 — Link the release PR from the Memgraph milestone

Add a `DOCS ->` line to the Memgraph milestone description. Keep what is
already there: read the description first and append the line.

```bash
desc=$(gh api repos/memgraph/memgraph/milestones/<milestone_number> --jq '.description // ""')
gh api repos/memgraph/memgraph/milestones/<milestone_number> --method PATCH \
  -f description="${desc:+$desc
}DOCS -> https://github.com/memgraph/documentation/pull/<pr_number>"
```

## Step 8 — Report back

Print the PR URL and the docs milestone URL, and remind the user to:
- Point docs PRs for the release at `release/<version>` and the `<version>`
  milestone (`write-docs-page` does this on its own).
- Run `check-release` as PRs merge, and on release day before merging.
