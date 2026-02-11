---
name: write_changelog_item
description: Create/write the changelog item / release note for a given Github PR
---

For a given Github PR write a changelog item.

The changelog item should be benefit focused (highlight the why). The changelog
item should be in the markdown format, don't remove ticks and markdown links,
don't use bold and italic, use - at the beginning of the item.

Usually the PR has the item written in our of the commends under the PR. Try to
extract that first and improve according to the above description.

If that changelog item is not already there, feel free to create one, again
according the the above guidelines.

If the PR introduces the breaking change, wrote 2 items one for the "regular"
sections (Features, Improvements, Bug Fixes, Bug) and one for the Breaking
section. The item under the Breaking section should be in the format: "What
happend? What the end-user should do about it?".
