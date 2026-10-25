# Public assistant knowledge

`snapshots/` contains the owner's public GitHub profile README and the READMEs of the nine repositories linked by the portfolio. The files retain source text, repository/path, commit SHA, Git blob SHA, SHA-256 content hash, and actual import time. These are application content, not temporary audit output.

Run `npm run assistant:sync` to refresh them deliberately. The sync resolves README locations through GitHub and fetches the pinned revision. Review content changes, project claims, and conflicting facts before deploying. Source links are immutable commit URLs; importing a file is not independent verification of its claims. No private repository, external page, image, script, or arbitrary linked document is imported.

`sources.json` supplies aliases and reviewed hashes for optional technical AI processing. Technical sections from all nine current project snapshots have been reviewed; profile records stay local. Changed content invalidates its remote hash approval. Do not approve raw profile data or secrets for unpaid AI processing.

`npm run assistant:knowledge` verifies Git blob/content hashes and compiles the public knowledge into ignored `.assistant-temp/`. It also validates coverage and source links. The compiled version changes with source/content changes, and ordinary builds work offline. Missing project snapshots fail visibly.

Add a future project to the existing portfolio records, run sync, review, and rebuild. Source-based responses then include it without model training or another manual project list. A new source is local-only until technical review. See [operations](../docs/ASSISTANT_OPERATIONS.md) for the complete workflow, privacy boundary, and free-provider configuration.
