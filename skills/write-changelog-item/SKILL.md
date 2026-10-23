---
name: write-changelog-item
description: Create/write the changelog item / release note for a given Github PR in `pages/release-notes.mdx` on the release branch. Use when asked to write a release note or changelog entry, or when `check-release` finds a PR missing from the release notes.
---

Writes one release note for a Memgraph PR. When listing several PRs, sort
them by PR number ascending.

## Writing the changelog item

Release notes and any related documentation must be **user friendly and
user-centric**: describe the impact the user sees, not the engineering work.

Write for someone who runs Memgraph, writes Cypher, operates a cluster, or
authors modules — not for someone reading the PR diff. Prefer:

- What changed for the user (faster connect, no crash, new query, new flag).
- For a bug fix, what works now: "Edge vector indexes recover correctly after
  a crash or snapshot load." Add the trigger only when it helps an operator
  recognize the situation ("while a new MAIN's first commit arrives").
- Symptoms and outcomes over internals (cache key, planner rewrite, cursor).
- Plain language; spell out jargon unless it is a product term the user
  already knows (`EXISTS`, `SHOW INSTANCES`, config flag names).
- Impersonal wording. Do not address the reader with pronouns such as "you",
  "your", or "we". Prefer "the query", "the client", "operators", "deployments",
  or a plain statement of what happens.

Avoid:

- Describing the implementation ("rewrote X as Y", "removed the Limit
  operator the branch never needed"), including how a bug used to fail: the
  crash path, the race, the dangling pointer or the missing lock.
- Wording that sounds like a recommendation not to use a feature (e.g. "faster
  when permissions are not used") when the point is that unnecessary work was
  removed.
- Engineering abbreviations without explanation (AST, DDL, UAF, etc.) unless
  the surrounding docs already teach them — prefer the user-facing name or a
  short plain phrase.
- Second-person or first-person address ("you get a warning", "you can now",
  "we fixed"). State the behavior without naming the reader.

Lead with the benefit. Write the item as one Markdown bullet starting with
`-`: keep code ticks and links, and use no bold or italic.

Link the docs page for the change in the item whenever there is one: the page
from the docs PR for a **Docs needed** PR, or the existing page that covers the
changed flag, command or behavior. Link the section when there is one, with a
root-relative link: `[text search](/querying/text-search#create-text-index)`.
Readers and agents look at the release notes first to learn what changed; the
link takes them to how it works now. A bug fix with no page to point to needs
no link.

Start from the release note in the product PR's comments, if there is one,
and improve it by the rules above. The PR description and that note describe
the PR as it was opened. If a later PR in the same series (one stacked on it
or changing the same behavior) changed what users see, describe the behavior
that ships: read the later PRs, or the code at the release tag.

Then read the docs PR that covers the product PR: the open or merged one
whose description names it as `memgraph/memgraph#NNNN`, not the release PR
(titled `Memgraph v<version>`) and not one closed without merging. Its
`### Release note corrections` section lists, for the whole series of
product PRs, where the release note is wrong or misses something, checked
against the build after the last PR in the series. Where it disagrees with
the comment, follow the docs PR. An older docs PR without that section may
still note release-note problems in its description; read them the same
way.

If the product PR has no release note, write one by the same rules.

If the PR introduces a breaking change, put it **only** under the Breaking
section — do not also list it under New features, Improvements, or Bug fixes.
The Breaking item should be in the format: "What happened? What the end-user
should do about it?".

## Release notes only, or also the rest of the docs?

When drafting release notes, **always double-check** whether this is something
that should be **only in the release notes**, or whether it needs to be
**propagated within the docs**.

Apply this check primarily when the memgraph PR is labeled
**`Docs - changelog only`**. If it is labeled **`Docs needed`**, a docs page
(or docs PR) is expected as part of the normal docs workflow, so do not treat
"should this go into the docs?" as an open question for that label.

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

For **`Docs needed`**, find the docs PR (its body names the product PR as
`memgraph/memgraph#NNNN`) and keep the release-note bullet aligned with its
wording where useful. If there is none yet, say so.

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
