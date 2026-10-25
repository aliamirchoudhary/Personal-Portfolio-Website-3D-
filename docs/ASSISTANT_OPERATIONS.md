# Portfolio assistant

The assistant is local-first and requires no account, API key, or paid service for source-based answers. It searches a saved public knowledge collection and presents project details with source links. The launcher loads the panel and knowledge only when opened. Conversations live in browser memory, are bounded to recent turns, and disappear on Clear or reload.

## Current capabilities

- Profile, owner-provided age/interests, education, coursework, skills, experience, services, contact/CV navigation, project lists, and project-specific explanations/follow-ups.
- Nine portfolio projects and the profile README are imported as public snapshots with commit/blob hashes and import dates. Curated portfolio project details, reviewed CV facts, and direct owner facts supplement them. The generated index currently includes 196 sections; content changes can change this count.
- Common capability questions resolve against specific evidence before broad biography/project-list routes: deployments and hosted demos, agentic AI, RAG, NLP/computer vision, named technologies, full-stack work, databases, and cloud tools. Unsupported tools are described as undocumented, never as proof of no experience. Spoken/programming languages, expected graduation, employer-specific responsibilities, two-project comparisons, and simple multi-part questions are handled separately.
- Known personal facts and explicit missing facts stay local without spending free AI quota. A generic model profile classification cannot replace a focused local answer with an unrelated biography or skill dump. When a remote request fails, the chat identifies source fallback in its header and explains it with the answer.
- Kryzect answers cover its published service catalog, process, scope-based pricing, audience, contact/booking links and founder-led team. IncidentIQ is identified as in development; roadmap features are not presented as shipped. Company follow-ups retain their subject separately from project context. Personal contact answers include email, phone, LinkedIn and GitHub as trusted actionable links from shared portfolio data; company email is kept distinct.
- Optional AI conversation interprets indirect requests, imperfect wording, comparisons, and follow-ups using the current filtered question, up to four recent filtered questions, and the previous project. It does not require a keyword/project-name match before calling the model. Source-only matching remains conservative and works without a key.
- Questions outside the portfolio receive a scope response; undocumented facts receive an unknown response. This is not general web search or unrestricted tutoring. Model interpretation and factuality checks reduce errors but do not guarantee correct understanding or perfectly grounded prose.
- Source documents are documentation claims, not independently verified performance evidence. Kryzect's start date differs between the CV and website/profile; the assistant explicitly flags this instead of inventing a resolution.
- Opt-in AI conversation sends filtered questions and reviewed technical excerpts. Common contact identifiers and the owner's name are removed; questions explicitly disclosing private information stay local. This filtering is not a complete personal-information detector: visitors must not submit private material. Provider use/retention is disclosed before use. Profile records, assistant replies, email/contact records, and visitor IP are not included in model context. Background questions are interpreted into an allowlisted topic and resolved from local records; technical answers are generated against cited evidence. Responses are schema/source-checked; local source answers remain the fallback.

## AI route: Gemini first, free OpenRouter fallback

Remote mode is **off by default**. Local answers work immediately. The public endpoint is `POST /api/assistant`; local Vite serves the same handler. `npm run preview` does not emulate Vercel functions, so browser regression tests mock the optional remote call.

To activate the remote route, configure these server-only variables in ignored `.env` locally and Vercel environment settings for deployment:

| Variable | Required value / purpose |
| --- | --- |
| `ASSISTANT_REMOTE_ENABLED` | `true` after all checks below; otherwise remote generation stays disabled |
| `ASSISTANT_PROVIDER_REVIEWED` | `true` only after reviewing the selected free provider's data policy and free-account eligibility |
| `OPENROUTER_API_KEY` | Existing free OpenRouter key; never a `VITE_` variable |
| `OPENROUTER_FREE_MODELS` | At most two explicit `:free` IDs, comma-separated, with all catalog prices zero; the legacy singular variable remains supported |
| `GEMINI_API_KEY` | Google AI Studio key, server-only |
| `GEMINI_MODEL` | Reviewed free model; tested with `gemini-3.5-flash-lite` |
| `ASSISTANT_GEMINI_FREE_VERIFIED` | `true` after checking actual free model access and project quota |
| `ASSISTANT_GEMINI_PUBLIC_ELIGIBLE` | `true` only after checking the public client's audience and Google eligibility requirements |
| `ASSISTANT_GEMINI_COUNTRIES` | Comma-separated reviewed deployment countries; default `PK` |
| `GEMINI_REQUESTS_PER_DAY` | Conservative shared Gemini daily ceiling; default 20, not a promise of provider capacity |
| `ASSISTANT_RATE_LIMIT_SECRET` | A long random server secret used to pseudonymize client quota buckets |
| `UPSTASH_REDIS_REST_URL` | Existing eligible free Redis REST endpoint, HTTPS |
| `UPSTASH_REDIS_REST_TOKEN` | Existing Redis REST token |
| `FRONTEND_ORIGIN` | Exact canonical site origin; Vercel preview origin is allowed separately |

The `AI conversation · I’m 18+` checkbox grants permission to send filtered questions and request AI interpretation; it does not bypass server eligibility or provider terms. It is off initially, and the header makes the current mode explicit. The UI falls back locally when no credentials, eligible model, acceptable provider endpoint, or shared limiter is available. Only approved README hashes permit detailed technical excerpts; curated portfolio project summaries remain available as evidence. A per-process memory counter is not used as a production workaround.

The server independently checks the free model catalog (cached per process for up to one hour), rejects nonzero/missing pricing and paid IDs, and sends no model fallback array or paid plugins. The request disables provider fallback and requests data-collection-denying routing. If the selected free model has no compatible endpoint, retain local mode rather than loosen privacy or payment constraints. Catalog verification is not a substitute for keeping the account unbilled and monitoring policy/model changes.

`npm run assistant:preflight` checks the configured OpenRouter model and key's reported free allowance without making an inference call. It prints only selected model/quota/configuration flags, never the key. Do not run broad live model evaluations on the limited free allowance.

Redis keys are isolated under `portfolio:assistant:`. Atomic reservations enforce one in-flight request per client bucket, 3 requests/minute and 20/day per bucket, plus 6/minute and 100/day globally. Separate provider ceilings are Gemini 5/minute and 20/day by default, and OpenRouter 6/minute and 40/day shared across its pool. Windows expire from first use; actual provider quota may be lower or shared with other owner usage. Failed attempts remain counted. Concurrency leases use ownership tokens and expire after 25 seconds; normal completion releases only its own lease. Model and provider cooldowns are independent. If storage fails, remote mode fails closed and the local widget stays useful. Contact counters are unchanged.

The provider request has a 16-second overall application deadline and a 6.5-second deadline per inference attempt; upstream cancellation is attempted when the browser disconnects. Each turn makes at most one Gemini and one OpenRouter inference attempt. Successful Gemini requests never fetch the OpenRouter catalog. Already processed attempts still count. There are no automatic retry loops. Chat endpoint responses use `no-store`; application logs do not include prompts, replies, raw IP addresses, or keys. Provider-side retention remains governed by its terms.

## Gemini eligibility and local setup

Gemini is primary when eligible. Google's terms restrict API clients by age and region, including paid-only access for EEA/Swiss/UK users, and restrict personal information submitted to unpaid services. The checkbox includes an 18-or-older affirmation. Production additionally requires the operator eligibility flag and a trusted Vercel country header matching both the configured list and the reviewed server allowlist (`PK,US,CA,AU,IN,SG,AE`). Unknown or excluded regions use eligible free OpenRouter or local answers. Client-supplied country claims are not accepted. These checks do not replace reviewing whether the public client's intended audience meets Google's terms.

For owner testing, add `GEMINI_API_KEY` to ignored `.env`. Set `GEMINI_MODEL=gemini-3.5-flash-lite`, `ASSISTANT_REMOTE_ENABLED=true`, `ASSISTANT_PROVIDER_REVIEWED=true`, `ASSISTANT_GEMINI_FREE_VERIFIED=true`, `ASSISTANT_GEMINI_LOCAL_TEST=true`, and `ASSISTANT_LOCAL_TEST=true`. Restart `npm run dev` after environment changes, open the chat, and enable `AI conversation · I’m 18+`. The last two flags enable explicit localhost-only testing with bounded in-memory counters and no Redis dependency. This store is never selected on Vercel or in production. Deployment still requires the shared Redis configuration above; local `.env` values are not deployed automatically. Never prefix either API key with `VITE_`.

On 26 October 2026, the owner's configured Google AI Studio key successfully generated a validated IncidentIQ explanation using `gemini-3.5-flash-lite` (approximately 1.4 seconds for the direct provider smoke test). A real browser → local Vite API → Gemini → source-linked widget response also passed, with a visual capture reviewed. Free OpenRouter catalog checks confirmed `google/gemma-4-26b-a4b-it:free` and `nvidia/nemotron-3.5-lightning:free`; live attempts returned a 429 and a 404 privacy-routing restriction respectively. Account privacy settings were preserved. This establishes free access at test time, not future availability or relative model quality. No billing, purchased credits, or paid fallback was enabled.

An optional `npm run assistant:prepare -- --project=incidentiq` command supports owner-run technical drafting after configuring `GEMINI_API_KEY`, a verified freely accessible `GEMINI_MODEL`, and `ASSISTANT_GEMINI_FREE_VERIFIED=true`. Run only where the owner meets Google's service eligibility and has checked that the configured project/model is free. This uses a fixed technical task and approved de-identified excerpts, not a CV, profile, or arbitrary visitor text. The unapproved output is saved only in ignored `.assistant-temp/drafts/`; it never automatically changes public knowledge. No paid provider fallback or retry is performed.

Review current [Google terms](https://ai.google.dev/gemini-api/terms), [Gemini quotas](https://ai.google.dev/gemini-api/docs/rate-limits), [OpenRouter free variants](https://openrouter.ai/docs/guides/routing/model-variants/free), and [OpenRouter privacy](https://openrouter.ai/privacy/) before activation or provider changes. Account-side quota, regional eligibility, free database allowance, and deployment settings cannot be established by local source-code tests.

## Update knowledge

```sh
npm run assistant:sync
npm run assistant:knowledge
npm run assistant:knowledge:check
npm run check
```

The sync command reads the public profile README and GitHub repository links in `PROJECTS`. It resolves README paths/default branches through GitHub and records an immutable source commit. It does not execute content or fetch arbitrary links. Fetch failures keep prior snapshots and make the sync command fail visibly. It needs no AI key or GitHub token; normal builds/tests consume reviewed snapshots offline. Public GitHub API quotas still apply.

For a new featured project, add its regular portfolio record and GitHub link, run sync, inspect its README, and rebuild. Missing snapshots/coverage fail the build/check instead of quietly losing the project. Update the profile snapshot for profile README changes. A new repository that is not linked by the portfolio is not silently published as featured work; add its record first. The profile README is indexed as a source, not used to grant trust to arbitrary linked repositories. There is no scheduled/background GitHub fetch or claim of real-time freshness.

`knowledge/sources.json` holds aliases and content hashes approved for remote technical processing. Technical excerpts from all nine current project READMEs have been reviewed. A changed snapshot no longer matches its approval hash, so its detailed README remains locally answerable but is not sent upstream until its technical content is reviewed and the hash updated. Author/contact identifiers and URLs are removed from remote context, and setup/author/contribution material is excluded from normal retrieval. Academic-context excerpts are excluded from remote context. The public profile README stays local.

Snapshots and source policy are versioned. `.assistant-temp/` is ignored and regenerated before dev, tests, and build. It contains the server/client knowledge artifact, version hash, coverage report, and optional owner drafts. Vercel includes the generated knowledge JSON in the assistant function explicitly. Never put API keys, private material, or paid-provider configuration in knowledge files. Public source snapshots include only public READMEs.

The source index is more complete than the offline rule-based recognizer. AI conversation handles semantic interpretation and can make qualified comparisons from documented features. It receives a bounded project catalog and a balanced selection of relevant reviewed excerpts, not entire repositories. Missing context can still produce an unknown answer. Do not invent facts or widen scope to general questions. Profile facts copied into the UI should continue to come from structured content, not a duplicate biography.

## Validation and rollback

`npm run check` includes unit/API/provider-mock tests, offline compilation, original portfolio browser regressions, and assistant tests at desktop, 390px, and 320px widths. Assistant checks cover lazy loading, local answers without network calls, citations, scope refusal, AI opt-in, semantic request routing, bounded history, local profile resolution, focus/clear/reopen/navigation, and axe accessibility. Layout checks require the conversation to occupy over 60% of panel height at each tested width. The compact header/composer and wider desktop panel prioritize reading space. Live provider/API-account validation remains a separate small controlled test.

The conversational revision also passed a three-turn live Gemini browser check: an indirect request about easing production-outage writeups identified IncidentIQ; “the cricket one” in a follow-up produced a sourced comparison with Criclytics; a question about “academic grounding” resolved to local education records. Visual captures were reviewed at desktop, 390px, and 320px. The 320px conversation area measured 450px of a 614px panel (approximately 73%). These are representative checks, not a guarantee for every phrasing.

The subsequent question-understanding revision added regression cases for age, interests and unshared favorites, deployment examples, agentic AI, unsupported Django experience, CV/badge skills, scoped project questions, expected graduation, employer responsibilities, comparisons and compound questions. All four reported examples were checked through the real handler: Gemini produced direct deployment and agentic-AI answers with project citations; age and undocumented Django stayed local without inference calls. Common questions are tested in both source mode and simulated provider failure at desktop, 390px and 320px.

Remote kill switch: unset `ASSISTANT_REMOTE_ENABLED` or set it to `false`, then redeploy. Local answers keep working. If a widget regression requires disabling it entirely, remove the `AssistantLauncher` mount in `App.jsx`; the rest of the portfolio has no dependency on the assistant. A lazy-chunk error is isolated by the widget's error boundary.

No npm dependencies were added for this feature. Temporary browser capture helpers remain in ignored `.lh-temp/`; snapshots are application knowledge, not temporary audit artifacts.
