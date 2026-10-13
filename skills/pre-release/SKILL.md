---
name: pre-release
description: Run final pre-release tasks for the documentation site. Updates release note dates and direct download links to the new Memgraph version, checks the release PR is ready, and closes the docs milestone after the merge. Use when preparing a documentation release, before publishing, or when asked to run "pre-release" steps.
---

# Pre-release

Run these steps right before publishing a new documentation release to ensure
release dates are correct and download links point to the latest Memgraph version.

## When to use

- Right before merging/publishing the documentation release branch
- When asked to prepare the docs site for a new Memgraph version
- When asked to run "pre-release" tasks

## Steps

### 1. Update release note dates

Open `pages/release-notes.mdx` and update the dates on the latest release
headings to today's date.

- Look for headings like `### Memgraph v<version> - <date>` and
  `### Lab v<version> - <date>` near the top of the file (under
  "🚀 Latest release").
- Replace the date with today's date in the same format
  (e.g. `May 6th, 2026` → `May 13th, 2026`).
- Only update entries for the version being released.

### 2. Update direct download links

Open `pages/getting-started/install-memgraph/direct-download-links.mdx` and
replace **every** occurrence of the previous version with the new one.

- The file contains download URLs for Docker, CentOS, Debian, Fedora, Rocky,
  Red Hat, and Ubuntu packages.
- Two patterns need updating:
  - Path segments: `v<old>` → `v<new>` (e.g. `v3.8.1` → `v3.9.0`)
  - File names: `<old>` → `<new>` (e.g. `3.8.1` → `3.9.0`)
- Use a global find-and-replace of the bare old version string (e.g. `3.8.1` →
  `3.9.0`) — this covers both patterns in a single pass.
- Verify the result: every URL in the file should reference only the new
  version.

### 3. Check the release PR is ready

- Run `pnpm check` on the release branch; it checks links, redirects, the
  sidebar and that each release-note heading loads the matching version.
- Every item on the release PR's Docs Integration Tracking checklist is
  ticked, and the docs milestone has no open PRs other than the release PR.
  If anything is left, run the `check-release-milestone` skill.

### 4. After the release PR is merged

Close the docs milestone. If PRs are still open in it, ask the user whether
to move them to the next release's milestone first.

```bash
gh api repos/memgraph/documentation/milestones/<milestone_number> \
  --method PATCH -f state=closed
```
