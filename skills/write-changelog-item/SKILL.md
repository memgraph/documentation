---
name: write_changelog_item
description: Create/write the changelog item / release note for a given Github PR and update the docs release PR description.
---

For a given Github PR write a changelog item.

## Writing the changelog item

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
