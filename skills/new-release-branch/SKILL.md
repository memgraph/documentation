---
name: new-release-branch
description: >-
  Create a new release branch for Memgraph documentation with the initial
  release-notes scaffold commit and PR. Use when the user wants to start a new
  release, create a release branch, or prepare release notes for a new version.
---

# New Release Branch

Automates the first commit of a new Memgraph documentation release branch:
creates the branch, scaffolds the release-notes titles, and opens a PR.

## Step 1 — Gather information

Ask the user (use `AskQuestion` if available, otherwise ask conversationally):

1. **Branch name** — exact name, e.g. `release/3.9`.
2. **Memgraph version + date** — e.g. `v3.9.0 - March 25th, 2026`.
3. **Lab version + date** — e.g. `v3.9.0 - March 25th, 2026`.
4. **GitHub milestone URL** — for the PR description, e.g.
   `https://github.com/memgraph/memgraph/milestone/44`.

## Step 2 — Create the branch

```bash
cd <documentation-repo-root>
git checkout main && git pull
git checkout -b <branch-name>
```

## Step 3 — Edit `pages/release-notes.mdx`

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

Make **two** changes (use `StrReplace` or equivalent):

### 3a — Add new empty titles above the current latest

Insert immediately after the line `## 🚀 Latest release`:

```
### Memgraph <new_version> - <new_date>

### Lab <new_lab_version> - <new_lab_date>

<LabReleasesClient version="<new_lab_ver>" />
```

### 3b — Move previous latest Memgraph + Lab into "Previous releases"

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

## Step 4 — Commit and push

```bash
git add pages/release-notes.mdx
git commit -m "Add Memgraph <new_version> and Lab <new_lab_version> release note titles"
git push -u origin <branch-name>
```

## Step 5 — Create the PR

Use `gh pr create`. The title should be:

```
Memgraph <new_version>
```

Use this exact body template (fill in the placeholders):

~~~
Make sure to do:
* [ ] update sitemap
* [ ] update direct download links

Milestones
* Memgraph -> <milestone_url>

### Memgraph PRs Docs Needed

#### memgraph

- [ ] {{memgraph_pr_link}} -> {{documentation_pr_link}} {{@author}}

#### helm-charts

- [ ] {{helm-charts_pr_link}} -> {{documentation_pr_link}} {{@author}}

#### prometheus-exporter

- [ ] {{prometheus-exporter_pr_link}} -> {{documentation_pr_link}} {{@author}}

### Release Notes Required

#### memgraph

- [ ] {{memgraph_pr_link}} {{@author}}
~~~

Replace `<milestone_url>` with the actual URL provided by the user.
Keep the `{{...}}` placeholders as-is — they are filled in manually later.

## Step 6 — Report back

Print the PR URL and remind the user to:
- Fill in the PR/author placeholders in the PR description.
- Update the sitemap and direct download links before merging.
