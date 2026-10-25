# Public assistant knowledge

`snapshots/` contains the owner's public GitHub profile README and the READMEs of the nine repositories linked by the portfolio. The files retain source text, repository/path, commit SHA, Git blob SHA, SHA-256 content hash, and actual import time. These are application content, not temporary audit output.

Run `npm run assistant:sync` to refresh them deliberately. The sync resolves README locations through GitHub and fetches the pinned revision. Review content changes, project claims, and conflicting facts before deploying. Source links are immutable commit URLs; importing a file is not independent verification of its claims. No private repository, external page, image, script, or arbitrary linked document is imported.

`sources.json` supplies aliases and reviewed hashes for optional technical AI processing. Technical sections from all nine current project snapshots have been reviewed; profile records stay local. Changed content invalidates its remote hash approval. Do not approve raw profile data or secrets for unpaid AI processing.

`npm run assistant:knowledge` verifies Git blob/content hashes and compiles the public knowledge into ignored `.assistant-temp/`. It also validates coverage and source links. The compiled version changes with source/content changes, and ordinary builds work offline. Missing project snapshots fail visibly.

`owner-profile.json` records age 21 and the interests supplied directly by Ali on 26 October 2026. The date is provenance, not a birth date. Update the stated age deliberately; never increment it by guessing a birthday. These facts are answered locally and cited as directly shared details, without a fabricated external link.

`cv-facts.json` holds reviewed technology groups, expected graduation, project stacks and role responsibilities from the current public PDF. Its SHA-256 must match that PDF: replacing the CV requires reviewing this file too, and stale facts fail the build visibly. The CV remains a local source and is never submitted wholesale to a provider. GitHub stack badges/icons are parsed as text metadata without fetching images, preserving tools that HTML stripping previously lost. A listed skill is not evidence of equal expertise or a deployment of every featured project.

`kryzect.json` contains reviewed public company facts, 12 service areas, process, pricing policy, audience, founder-led team description and IncidentIQ product status. Sources link to pinned files in `Kryzect/Kryzect-Official-Website`; source hashes and the review date preserve provenance. The company email was checked against the live site's organization metadata. Refresh this file deliberately after reviewing changes to those sources; ordinary project README sync does not silently change company claims. Keep roadmap items separate from shipped features and do not add client counts, prices or delivery guarantees without evidence. Company facts and contact details resolve locally, including follow-ups after a company question.

Add a future project to the existing portfolio records, run sync, review, and rebuild. Source-based responses then include it without model training or another manual project list. A new source is local-only until technical review. See [operations](../docs/ASSISTANT_OPERATIONS.md) for the complete workflow, privacy boundary, and free-provider configuration.
