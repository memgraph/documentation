---
name: write_changelog_item
description: Create/write the changelog item / release note for a given Github PR and update the docs release PR description.
---

For a given Github PR write a changelog item.

## Listing PRs

When you present more than one PR to the user (missing changelog queue, docs
gaps, suggested next item with alternatives, etc.), always sort by PR number
**ascending** (smallest → largest).

## Writing the changelog item

Release notes and any related documentation must be **user friendly and
user-centric**.

We are not describing the engineering work we did, but the impact the user
sees.

Write for someone who runs Memgraph, writes Cypher, operates a cluster, or
authors modules — not for someone reading the PR diff. Prefer:

- What changed for the user (faster connect, no crash, new query, new flag).
- Symptoms and outcomes over internals (cache key, planner rewrite, cursor).
- Plain language; spell out jargon unless it is a product term the user
  already knows (`EXISTS`, `SHOW INSTANCES`, config flag names).
- Impersonal wording. Do not address the reader with pronouns such as "you",
  "your", or "we". Prefer "the query", "the client", "operators", "deployments",
  or a plain statement of what happens.

Avoid:

- Describing the implementation ("rewrote X as Y", "removed the Limit
  operator the branch never needed").
- Wording that sounds like a recommendation not to use a feature (e.g. "faster
  when permissions are not used") when the point is that unnecessary work was
  removed.
- Engineering abbreviations without explanation (AST, DDL, UAF, etc.) unless
  the surrounding docs already teach them — prefer the user-facing name or a
  short plain phrase.
- Second-person or first-person address ("you get a warning", "you can now",
  "we fixed"). State the behavior without naming the reader.

The changelog item should be benefit focused (highlight the why). The changelog
item should be in the markdown format, don't remove ticks and markdown links,
don't use bold and italic, use - at the beginning of the item.

Usually the PR has the item written in one of the comments under the PR. Try to
extract that first and improve according to the above description.

If that changelog item is not already there, feel free to create one, again
according to the above guidelines.

If the PR introduces a breaking change, write 2 items: one for the "regular"
sections (Features, Improvements, Bug Fixes) and one for the Breaking section.
The item under the Breaking section should be in the format: "What happened?
What the end-user should do about it?".

## Release notes only, or also the rest of the docs?

When drafting release notes, **always double-check** whether this is something
that should be **only in the release notes**, or whether it needs to be
**propagated within the docs**.

Apply this check primarily when the memgraph PR is labeled
**`Docs - changelog only`**. If it is labeled **`Docs needed`**, a docs page
(or docs PR) is expected as part of the normal docs workflow — track it on the
release docs PR, but do not treat "should this go into the docs?" as an open
question for that label.

For **`Docs - changelog only`**, before proposing or applying a changelog
bullet, ask:

1. Does this introduce or change a **user-facing surface** — Cypher syntax,
   procedure/function, config flag, privilege, HTTP/metrics endpoint, install
   artifact, module API, error/notification behavior that operators rely on?
2. Is that surface already documented on the relevant pages (configuration,
   querying, clustering, custom modules, monitoring, etc.)?
3. Is there already an open docs PR that covers it?

Then decide and **surface the decision to the reviewer** with the draft:

- **Changelog only** — no new knob, command, or documented API is missing from
  the docs; the label fits. Say so briefly.
- **Needs docs propagation despite the label** — e.g. a new/changed config flag
  or command that appears in the release note but nowhere else. Name the target
  page(s) (e.g. `configuration.mdx` next to related `--query-*` flags) and
  either draft that docs change or flag it as a follow-up. Do not silently
  leave a user-facing flag or command only in release notes.

Grep the repo for the new flag, command, or concept name before claiming it is
undocumented.

For **`Docs needed`**, point at the linked docs PR (or `no doc PR yet` on the
tracking list). Keep the release-note bullet aligned with that docs wording
where useful.

Any docs text you write for propagation must follow the same user-friendly,
user-centric rules as the release note.

## Placing the item in `pages/release-notes.mdx`

1. Put the bullet in the correct section/block for the release (for example
   Breaking changes, New features, Bug fixes).
2. Within that section, insert in **ascending memgraph PR number** order
   (smallest → largest). Find the right position by PR # — do not append at the
   end unless this PR is the highest number already in that section.
3. Do not re-sort an in-progress release to fix historical ordering unless the
   user explicitly asks.

## Updating the docs release PR description

After writing the changelog item in `pages/release-notes.mdx`, also update the
description of the open documentation release PR (e.g.
`memgraph/documentation#1530` for 3.9) so the PR keeps a complete overview of
everything integrated in the release.

1. Fetch the current PR body via `gh api`.
2. Add the memgraph PR to the **Release Notes Required** section if it is not
   already listed. Use the same format as the existing entries:
   `- [x] https://github.com/memgraph/memgraph/pull/XXXX @author`
   Append the new entry at the end of the list (before the blank line / TODO).
3. If the memgraph PR has the **"Docs needed"** label and a corresponding
   documentation PR exists, also add it to the **Memgraph PRs Docs Needed**
   section using the existing format:
   `- [x] https://github.com/memgraph/memgraph/pull/XXXX -> https://github.com/memgraph/documentation/pull/YYYY @author`
4. Push the updated body back via `gh api ... -X PATCH -F "body=@file"`.
