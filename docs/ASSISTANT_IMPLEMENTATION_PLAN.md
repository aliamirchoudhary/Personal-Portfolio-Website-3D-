# Portfolio assistant implementation plan

Status: v1 implemented on `feat/portfolio-assistant`; see [assistant operations](ASSISTANT_OPERATIONS.md) for actual configuration and limitations. This document remains the design record.
Prepared: 25 October 2026.
Owner: Muhammad Ali Aamir (`aliamirchoudhary`).

Implementation adjustment: following the owner's provider preference, eligible Google AI Studio Gemini requests run first, followed by a bounded verified free OpenRouter pool and local source answers. Gemini requires explicit age affirmation, free-project verification, and production audience/country eligibility checks; it is not enabled indiscriminately worldwide. Owner localhost testing and technical preparation are supported. Real-key Gemini testing succeeded; OpenRouter tests encountered free-tier availability/privacy restrictions. See operations for current setup, quotas, and deployment requirements. No paid fallback is implemented.

## 1. Objective and non-negotiable constraints

Build a professional portfolio assistant that answers questions about Ali's public background, experience, skills, services, and projects, including contextual technical follow-ups. It must politely decline unrelated questions and admit when approved information is missing. Future portfolio additions must enter its knowledge through the normal content/deployment workflow.

- Budget is **$0**, with **no credit card** and no purchased API credits.
- The owner already has a free Google AI Studio API key and an OpenRouter API key. Use those only where the applicable free tier and data terms permit.
- Never enable billing, buy credits, use paid models, add paid fallbacks, rely on expiring trial credits, or require a new paid service.
- Preserve the current React/Vite/Vercel architecture, contact form, animations, accessibility, and performance budgets.
- Use a bottom-right launcher with an SVG assistant icon, never an emoji. Do not automatically open the chat.
- Do not train/fine-tune a model or introduce a vector database, agent framework, external search service, hosted chatbot subscription, or another animation library for v1.
- Git mutations require the owner's authorization. This plan does not authorize a branch, commit, push, merge, deployment, scheduled GitHub workflow, or account change.
- Do not request API keys in chat. Configure server environment variables through ignored local environment files and the deployment dashboard when implementation reaches integration.

Success means a useful assistant that remains functional without model access, not an unlimited free generative service.

## 2. Free-provider constraints verified during planning

Recheck these official references during implementation; model catalogs, access, quotas, and terms can change.

| Service | Current planning basis | Implementation consequence |
| --- | --- | --- |
| Google AI Studio / Gemini API | Free limits are model/project-specific, cover request and token dimensions, and are shown in AI Studio. Limits are shared across project keys. | Inspect the owner's actual available model and quotas; never promise a fixed free capacity or create extra keys/accounts to evade limits. |
| OpenRouter | Current pricing lists 20 requests/minute and 50/day without the purchased-credit allowance; failed attempts also consume daily capacity. | Treat the key as a small shared fallback pool for all visitors, also shared with the owner's other usage. Confirm actual remaining quota server-side. |
| OpenRouter free variants | A model needs an actual `:free` catalog entry. A paid model in a fallback array can incur charges. | Permit only verified zero-price `:free` entries. Reject paid IDs and missing/ambiguous price metadata. |
| OpenRouter free router | `openrouter/free` routes only among free models, but selection/capabilities vary. | Optional only after capability/privacy checks. Prefer a tested explicit free model for predictable behavior. |
| Existing hosting/storage | The site already uses Vercel and supports Redis for contact protection; actual configured plans are not established by reading this repository. | Verify existing free resources and usage. No new billable infrastructure dependency. |

Official references:

- [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini pricing and free-model availability](https://ai.google.dev/gemini-api/docs/pricing)
- [OpenRouter pricing](https://openrouter.ai/pricing)
- [OpenRouter limits and key-status endpoint](https://openrouter.ai/docs/api_reference/limits)
- [OpenRouter free variants and fallback rules](https://openrouter.ai/docs/guides/routing/model-variants/free)
- [OpenRouter free router](https://openrouter.ai/docs/guides/routing/routers/free-router)

Do not freeze a model name in this plan. At integration, test one eligible free Gemini model and one eligible free OpenRouter model against the evaluation set. Configure approved IDs server-side. Model discovery does not grant permission to silently switch to a paid model.

## 3. Privacy and provider eligibility gate

Google's unpaid-service terms say inputs/outputs may be used for improvement and human review, and instruct users not to submit sensitive, confidential, or personal information. Public biographical information can still be personal information; being public or having a visitor consent checkbox is not an exemption from provider terms.

Therefore:

1. Answer identity, location, education, employment, contact details, availability, and other personal-profile questions locally from approved records by default.
2. Never send the raw CV, full profile README, contact-form messages, visitor identifiers, IP addresses, or private information to Gemini's unpaid service.
3. Build a separately reviewed provider-eligible technical project corpus. Remove author/contact identifiers, unrelated personal information, secrets, and repository instructions. Keep source IDs; resolve names and URLs locally after generation.
4. Before enabling arbitrary visitor text for a provider, review that provider's current terms and data practices. A regex PII filter is not a guarantee of compliance.
5. If unpaid Gemini terms do not permit the proposed conversational payload, use Gemini only for locally selected, fixed, reviewed technical prompts; do not forward arbitrary visitor messages/history. This restricted mode can still summarize approved technical project material.
6. OpenRouter has provider-dependent data practices. Review the actual selected free model/provider, not just OpenRouter's policy. Do not assume paid privacy controls are available on a free account. If acceptable routing cannot be enforced, disable that remote route and retain local answers.
7. Block obvious sensitive disclosures locally and advise visitors to use the contact form for private discussion. Do not automatically forward the same message to another provider after a privacy refusal.
8. Keep application conversations in browser memory only. Closing/reopening preserves the conversation; Clear and page reload remove it. No transcript database by default.
9. Do not log raw prompts, replies, contact details, keys, or raw IP addresses. Record only bounded operational metadata when needed.

Place a short notice near the composer before the first remote request, with a compact disclosure for details: messages eligible for AI processing may be sent to Google or an OpenRouter provider, and visitors should not submit private information. Describe actual enabled routes accurately. Do not claim zero retention or that data never leaves the site.

References: [Gemini unpaid-service terms](https://ai.google.dev/gemini-api/terms), [OpenRouter privacy policy](https://openrouter.ai/privacy/).

If provider eligibility cannot be established, complete and ship the local assistant mode; remote generation remains disabled. This is a configuration boundary, not a reason to abandon the widget.

## 4. Knowledge sources and initial repository coverage

Use the owner's GitHub profile README and project READMEs as the primary detailed sources. Reuse the website's structured records for navigation, identity, and project discovery. The current public CV supplies additional facts and conflict checks, not a runtime PDF dependency.

Initial profile source candidate: [aliamirchoudhary/aliamirchoudhary](https://github.com/aliamirchoudhary/aliamirchoudhary). Confirm its existence and resolve its default branch/README through GitHub's API during ingestion; do not assume the branch or filename. The profile README was not fetched successfully during planning, so its facts are not yet verified.

Initial project repositories, already linked by the portfolio:

| Portfolio ID | Repository |
| --- | --- |
| `criclytics` | [Criclytics](https://github.com/aliamirchoudhary/Criclytics) |
| `incidentiq` | [IncidentIQ](https://github.com/aliamirchoudhary/IncidentIQ) |
| `financial-documents` | [Financial-Document-Classifier](https://github.com/aliamirchoudhary/Financial-Document-Classifier) |
| `fashion` | [Fashion-Image-Classifier](https://github.com/aliamirchoudhary/Fashion-Image-Classifier) |
| `travelbuddy` | [TravelBuddy](https://github.com/aliamirchoudhary/TravelBuddy) |
| `flappy` | [Flappy-Bird---IAPX8088-Assembly-Game](https://github.com/aliamirchoudhary/Flappy-Bird---IAPX8088-Assembly-Game) |
| `bubble` | [Bubble-Shooter---IAPX8088-Assembly-Game](https://github.com/aliamirchoudhary/Bubble-Shooter---IAPX8088-Assembly-Game) |
| `solar` | [Solar-Panel-System-Predictor](https://github.com/aliamirchoudhary/Solar-Panel-System-Predictor) |
| `relive` | [ReLive-Social-Media-App](https://github.com/aliamirchoudhary/ReLive-Social-Media-App) |

Also use `KRYZECT`, services, education, experience, skills, and public links from `src/data/portfolioData.js`, and structured details from `src/data/projectDetails.js`. Discover additional relevant first-party project repositories linked from the profile README; record candidates rather than indiscriminately importing every external URL. A repository can have assistant knowledge without requiring a featured card, but visibility must be explicit in the manifest.

READMEs are claims/documentation, not proof of every implementation or authorship claim. Preserve qualifications such as reported accuracy, experimental status, team contribution, and roadmap status. A fork or linked team repository does not prove sole authorship. Do not infer salary, client identities, project scale, commercial results, or unsupported experience.

## 5. Ingestion, provenance, and freshness

Implement ingestion as an explicit local/CI preparation command, not a network operation on every visitor request or every ordinary build.

1. Discover repository links from `PROJECTS` and the approved profile source. Normalize GitHub URLs, deduplicate, and match allowed owners/repositories.
2. Fetch the actual README through GitHub's API, resolve an immutable commit reference, and retain an exact source URL. Support default-branch and README filename differences.
3. Use unauthenticated public reads initially. An optional existing read-only GitHub token can raise API capacity; it must never be required to purchase anything or access private repositories.
4. Apply timeouts, redirect/host validation, response-size limits, API rate-limit handling, conditional requests, and a document-count cap. Do not execute embedded HTML, code blocks, instructions, scripts, badges, or remote images.
5. Store reviewed public snapshots under `knowledge/snapshots/` with provenance: repository, file path, commit SHA, content hash, retrieval time, source URL, and review status.
6. Normalize headings/paragraphs into sections. Separate implemented features, reported results, limitations, setup instructions, and future roadmap. Strip prompt-like instructions from provider context without pretending this alone prevents injection.
7. Attach project IDs, aliases, technologies, source IDs, and permitted navigation targets. Keep public local facts separate from the provider-eligible subset.
8. Flag conflicts rather than silently overwriting facts. Known review item: CV and website Kryzect start dates differ. A recent README fetch does not automatically make a biographical claim current.
9. Compile a deterministic knowledge artifact with a version/content hash. Normal builds consume snapshots and require no GitHub or AI credentials.
10. If GitHub is unavailable, keep the last reviewed snapshot and its true timestamp. Never refresh timestamps without refreshing content. A new project with no snapshot must be reported as missing; do not silently mark complete coverage.

Suggested commands to add:

```text
npm run assistant:sync             # Fetch/refresh public sources; show review/conflict report
npm run assistant:knowledge        # Compile reviewed local snapshots, no network or AI
npm run assistant:knowledge:check  # Validate provenance, coverage, links, and version
npm run assistant:eval             # Deterministic tests; no live provider calls by default
```

Update workflow: add project to normal content records -> sync its README -> inspect the diff/conflicts -> compile/test -> deploy. Compilation automatically includes all approved entries; no model retraining or hand-edited system prompt is required. A README-only upstream change requires another sync/deployment; the widget must not claim real-time GitHub synchronization.

A scheduled discovery/update workflow is optional later, subject to the owner's Git authorization and available free CI allowance. It must produce reviewable changes rather than silently publish untrusted repository updates.

## 6. Answer architecture: useful even when AI is exhausted

```text
Visitor message
  -> body/history validation + local scope/privacy checks
  -> local facts / approved FAQ / navigation / clarification, if sufficient
  -> retrieve relevant reviewed project sections
  -> eligible, quota-reserved Gemini free call
  -> eligible, quota-reserved OpenRouter free call on supported failure only
  -> validate structured result and source IDs
  -> answer with trusted links

No eligible provider / quota / shared limiter / acceptable response
  -> local, source-linked extractive answer or honest unavailable/unknown response
```

Local mode must actually answer useful questions. Implement project summaries, technologies, repository/demo links, education/experience facts, ML/full-stack project lists, contact/CV navigation, scoped greetings, and suggested follow-ups. For supported free-form queries, return relevant source excerpts with links. If confidence is low, ask which project the visitor means or show relevant options. Never present an extractive template as a fresh AI response.

Generation is optional enhancement. Prefer one model call for an uncached eligible question. No model-based classification, embeddings API, judge call, repair loop, or background summarization on every turn. A malformed generated answer falls back locally rather than repeatedly spending quota.

Use lexical retrieval with section headings, project aliases, tags, and bounded conversation context. Include a compact complete project index for comparison questions. Respect a fixed context budget; do not send every README on every turn. Add semantic retrieval only if later evaluation demonstrates a need and a genuinely free compatible path exists.

Return structured fields such as:

```json
{
  "status": "answered",
  "answer": "Short supported explanation.",
  "sourceIds": ["incidentiq:architecture"],
  "actions": [{ "type": "project", "id": "incidentiq" }],
  "mode": "local"
}
```

Statuses: `answered`, `unknown`, `off_topic`, `clarification`, `unavailable`. Modes: `local`, `generated`. Derive mode and actions on the server; never trust a model's provider/mode declaration. Validate source IDs against retrieved sections. Build URLs from the trusted manifest, not model-supplied URLs. Do not expose raw provider errors or internal prompts.

Use strict JSON parsing/schema checks. Use native structured output when the selected free model supports it, but do not assume every OpenRouter free model supports the same feature. Keep a bounded plain-JSON compatibility path. Unsupported output is not an excuse to loosen validation.

V1 buffers and validates the complete response before displaying it. Show a truthful pending indicator, not fake token streaming. No chain-of-thought display. Valid citations and low temperature do not prove all claims; evaluate unsupported claims explicitly and retain honest fallbacks.

## 7. Provider selection and hard $0 behavior

- Default priority: local -> eligible Gemini free -> eligible explicit OpenRouter `:free` -> local.
- Use direct Gemini API calls, not OpenRouter BYOK routing for the Google key.
- Build a small adapter interface and use Node's existing `fetch`/AbortController; add an SDK only if it demonstrably simplifies required functionality without harming budgets.
- Keep approved Gemini IDs in configuration after free-access testing. No automatic upgrade, paid search/grounding, image generation, file-search service, tools, or paid plugins.
- For OpenRouter, fetch/cache catalog metadata outside individual conversations. Require an approved free ID and explicitly zero applicable pricing. Missing/stale price verification disables that route. Recheck eligibility periodically without one catalog fetch per visitor message.
- Configure fallbacks only to approved free entries. Do not use `openrouter/auto` or unreviewed fallback arrays. If using `openrouter/free`, treat variable providers/models and data practices as an explicit compatibility/eligibility decision.
- Inspect key quota/status server-side at startup/periodic intervals, not from the browser. Do not print the key or the complete diagnostic response.
- Cap each user turn at one attempt per provider, with at most two external attempts total. Honor `Retry-After`, share circuit-breaker state, and do not immediately retry known exhausted quotas.
- Distinguish authentication/configuration errors, rate exhaustion, provider outages, content/privacy refusals, and invalid output. A privacy/content refusal is not a trigger to evade the refusal via another model.
- Stop generation on client cancellation where supported; already-consumed requests still count. No retry storms, multi-key quota rotation, or account multiplication.
- Free availability and quality are best effort. If the owner uses the same keys elsewhere, the portfolio's local counters cannot know all external consumption; always handle actual provider failures.

## 8. Abuse protection and free shared storage

Reuse the existing Redis integration pattern only after confirming an existing suitable free database and its remaining command/storage allowance. Use separate `portfolio:assistant:` keys and limits; do not alter contact quotas. A new service requiring a card is not acceptable.

Suggested conservative initial limits, configurable downward to match real provider quota:

| Limit | Starting point |
| --- | --- |
| Visitor message | 1,000 characters; validate bytes as well |
| Request body | 16 KB maximum, enforced before full parsing |
| Conversation context | Last 6 messages, aggregate size/token cap |
| Model output | About 300-500 tokens, with a bounded reasoning budget if applicable |
| Client usage | 3 remote requests/minute, 10/day per pseudonymous IP bucket |
| Session concurrency | 1 generation at a time; browser-only enforcement is not sufficient |
| Provider timeout | Approximately 8 seconds each, 18 seconds overall including fallback |
| OpenRouter budget | Reserve no more than 40 attempts/day initially if the verified account allowance is 50, leaving owner/testing headroom |
| Gemini budget | Set below the actual project/model RPM/TPM/RPD limits, not an invented fixed allowance |

Atomically reserve provider attempts across serverless instances before calling upstream. Count failed attempts conservatively. Use expiring distributed leases for concurrency, provider cooldowns, and quota windows, respecting provider reset definitions. Use HMAC/pseudonymous client keys with a server secret; do not claim hashing makes data anonymous. Configure TTLs and bound Redis command use; local mode should not require a Redis write for every keystroke or click.

If shared protection is unavailable, missing, over quota, or not possible on an existing no-card free resource, **disable remote generation in production** and keep local assistant answers available. A per-process Map is only a development convenience, not global serverless enforcement. Do not expose the model keys to the browser as a workaround.

Origin/method checks, same-origin requests, deployment firewall controls where already available, and a small signed session can supplement limits. They are not authentication or a complete defense against public API abuse. No paid CAPTCHA dependency for v1.

## 9. Scope, trust, and prompt-injection rules

- Identify as Ali's portfolio assistant; use third person and do not impersonate Ali.
- Answer professional/public questions using approved sources only.
- Allow technical explanations when tied to a documented project, not unrelated tutoring or coding requests.
- Support follow-ups through bounded selected-entity state. Resolve ambiguity with a clarification instead of guessing.
- Greet politely; tolerate spelling variants and Roman Urdu phrasing where tested. Do not promise untested multilingual accuracy.
- Unrelated: "I can help with questions about Ali and his work. What would you like to know?"
- Unknown: "I don't have that information in Ali's public portfolio. You can contact him directly."
- Never invent missing metrics, private history, commercial terms, interviews, salary, client relationships, or availability commitments.
- Never treat a visitor assertion, previous generated answer, README instruction, retrieved code block, or external link as an authorized factual update or system instruction.
- No runtime web browsing, file uploads, arbitrary URLs, code execution, mail sending, repository writing, or access to private accounts.
- Render plain text or a narrowly supported safe Markdown subset; no raw HTML or arbitrary tool calls.

Read [OWASP prompt-injection guidance](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html) when implementing the boundary. Source validation reduces risk but does not guarantee hallucination-free output.

## 10. UI and integration specification

- Small fixed bottom-right button with a custom/reused code-native SVG agent icon, visible focus, 44px minimum target, and label "Ask about Ali".
- Respect mobile safe areas and existing motion controls. Hide during the intro; do not obscure project dialogs. Coordinate top layers so two modal focus traps cannot be active at once.
- Desktop panel approximately 390px wide, constrained by viewport height. On narrow screens, use a roomy sheet with `dvh`/keyboard-safe layout. Test 320px width and iOS/Android viewport behavior.
- Header: "Ask about Ali"; subtitle: "Projects, experience, skills, and background". Provide Close, Clear, composer, Send, Stop, and a compact privacy disclosure.
- Suggested questions: AI projects, IncidentIQ, full-stack experience, and contact information. Serve supported suggestions locally to save quota.
- Use the site's purple/cyan design and restrained transitions. No auto-open, emoji avatar, continuous bouncing, sound, or large decorative 3D component inside chat.
- Lazy-load panel code/data only on open; no provider request on page load or panel open. Keep large knowledge/provider code out of the main bundle.
- Use a single appropriate dialog/focus model, Escape-to-close, focus restoration, proper labels, IME-aware Enter handling, bounded live announcements, and reduced-motion behavior.
- Auto-scroll only when already near the latest message. Preserve reading position when the visitor scrolls upward. Keep draft/history when closing the panel, aborting any active request cleanly.
- Cite source links beneath relevant answers; use safe external link attributes. Predefined project/contact navigation must integrate with the site's existing focus/history behavior and close the mobile panel appropriately.
- Local mode/unavailability should offer source-linked answers and useful project/CV/contact actions, not a dead error panel.

## 11. Proposed file and configuration changes

| Proposed path | Responsibility |
| --- | --- |
| `src/components/assistant/AssistantLauncher.jsx` | Tiny launcher and lazy-loading boundary |
| `src/components/assistant/AssistantPanel.jsx` | Accessible chat presentation and lifecycle |
| `src/components/assistant/assistant.css` | Responsive styling and reduced motion |
| `shared/assistant.js` | Request/response limits, public types/schema rules, status names |
| `server/assistant-handler.js` | Request validation, scoped routing, fallback orchestration |
| `server/assistant-retrieval.js` | Local facts, lexical retrieval, selected-entity context |
| `server/assistant-providers.js` | Free-only adapters and bounded upstream calls |
| `server/assistant-store.js` | Atomic shared limits, leases, quota/circuit state |
| `api/assistant.js` | Vercel entry point |
| `knowledge/sources.json` | Approved repositories, visibility, source/privacy eligibility |
| `knowledge/overrides.json` | Explicit owner-reviewed facts and conflict resolution |
| `knowledge/snapshots/` | Public README snapshots and provenance |
| `scripts/sync-assistant-knowledge.mjs` | Explicit GitHub ingestion and review report |
| `scripts/build-assistant-knowledge.mjs` | Offline deterministic compilation/coverage checks |
| `tests/assistant*.test.js` | Backend, retrieval, quota, policy and provider-mock tests |
| `tests/assistant-ui.mjs` | Widget keyboard/mobile/accessibility/failure checks |
| `tests/fixtures/assistant-eval.json` | Approved answer/refusal/source expectations |

Choose one explicit generated-artifact policy: reviewed snapshots/manifests are versioned; compiled server and small local catalogs are generated into ignored build directories. Ensure the serverless bundler includes its artifact explicitly. Import generated local UI data only through the lazy panel boundary. Do not put secrets in any knowledge artifact.

Extend existing `App.jsx`, `scripts/dev-api.js`, `scripts/security.js`, build/check scripts, `.gitignore`, `.env.example`, and operations documentation. Keep `/api/assistant` same-origin; do not allow browser connections directly to AI providers. Set `Cache-Control: no-store` for personalized chat responses. Synchronize generated Vercel configuration through the existing command, not a parallel manual configuration source.

Planned server-only environment names:

```text
ASSISTANT_ENABLED
ASSISTANT_REMOTE_ENABLED
GEMINI_API_KEY
GEMINI_MODEL
OPENROUTER_API_KEY
OPENROUTER_FREE_MODEL
ASSISTANT_RATE_LIMIT_SECRET
# Reuse existing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN only if eligible.
# Provider caps/cooldowns belong in validated configuration or bounded env overrides.
```

Do not use `VITE_` for credentials. Default remote mode to disabled until eligibility, real free quotas, credentials, and distributed protection are verified. No AI keys are needed for normal builds/tests.

## 12. Implementation sequence and acceptance gates

- [ ] **Inventory:** read applicable repository instructions; confirm current branch/status without Git mutations; inspect available existing free infrastructure without exposing secrets.
- [ ] **Sources:** fetch the profile and all listed project READMEs; record additional project candidates; document missing sources, contribution limits, and contradictory facts. Resolve only what evidence/owner instructions establish.
- [ ] **Knowledge:** implement manifests, snapshots, provenance, deterministic compilation, privacy-separated corpora, and missing-source checks. Keep normal builds offline.
- [ ] **Local assistant:** implement retrieval, safe FAQs, unknown/off-topic/clarification behavior, citations, and a useful quota-independent catalog. Demonstrate this before adding an API key.
- [ ] **UI:** implement the SVG launcher, lazy panel, responsive layout, keyboard behavior, intro/dialog coordination, and local interactions.
- [ ] **Provider preflight:** verify eligible free models, actual quota, terms, response capabilities, and no paid fallbacks. Use a minimal live smoke test only, not a broad free-quota-consuming evaluation.
- [ ] **Backend:** implement the endpoint, free adapters, structured validation, distributed reservations, cancellation, cooldowns, and local fallback. Verify no remote access when protection is absent.
- [ ] **Local integration:** expose the endpoint through development middleware; production preview is not a substitute for a real function environment. Use mocks for browser/API regressions.
- [ ] **Quality evaluation:** run mocked tests for supported/unsupported questions and retrieval coverage; manually inspect a small real-provider sample within reserved quota.
- [ ] **Preview validation:** after separate authorization/configuration, test actual Vercel function packaging, free provider access, quotas, and a controlled outage. Preview and production should have isolated counters; separate keys do not necessarily mean separate provider quotas.
- [ ] **Release:** owner reviews behavior/privacy/model choices; run required checks and budgets; deployment/Git actions follow explicit owner instructions. Keep local mode ready and a remote kill switch documented.

Required test cases:

- Exact and paraphrased profile/project questions, technology comparisons, misspelled project names, short follow-ups, and ambiguity.
- Every approved project can be found and cited. Profile knowledge remains usable without sending personal facts upstream.
- Off-topic tutoring, unrelated news, role changes, fake facts, prompt extraction, encoded injection, and malicious README instructions do not grant new scope/tools.
- Model output with missing/unknown sources, arbitrary URLs/actions, HTML, fabricated unsupported facts, excessive length, invalid JSON, or truncation falls back safely.
- Gemini quota exhaustion -> only eligible free OpenRouter route; both unavailable -> useful local response. Privacy refusal -> no evasive cross-provider retry.
- Paid model ID, missing price verification, unavailable required privacy policy, billing-required model, or absent shared limiter -> remote call never happens.
- Concurrent requests across simulated function instances cannot over-reserve quotas; TTL/reset behavior is correct. Contact keys/limits are unaffected.
- Client Abort, timeout, invalid keys, 429/402/403/5xx responses, Redis failure, and malformed requests produce safe bounded behavior without key/prompt leakage.
- A new project becomes answerable after source sync/compile; removed content disappears; stale snapshots retain true dates; GitHub failure does not erase the last good knowledge set.
- 1440/820/390/320 layouts, Escape/Tab/focus restoration, screen-reader announcements, IME input, on-screen keyboard, reduced motion, intro replay, project modal coexistence, and scrolling history.
- Existing `npm run check` and asset budgets pass. Closed-widget performance remains within the current baseline/budgets; no AI or GitHub network traffic occurs on ordinary page load.

Aim for complete coverage of deterministic facts and no unsupported factual claims in the reviewed launch evaluation set. Record misses honestly. Do not advertise a numerical reliability guarantee based on a small test set.

## 13. Maintenance, rollback, and implementation boundaries

Maintain a source-coverage/conflict report and versioned knowledge snapshot. Recheck free model availability, pricing eligibility, and provider terms before model changes. Account status/model retirement may disable remote mode; the local assistant must remain useful.

Rollback order: disable remote mode -> keep local answers -> disable widget if a UI regression requires it. The portfolio, CV, contact form, and other sections must work independently.

No new packages/services are needed to write this plan. During implementation, record any audit-only tools/artifacts in the existing ignored `.lh-temp/AUDIT_TOOL_INVENTORY.md`; distinguish temporary tooling from actual app dependencies.

The next implementation session should start from this file, verify its external assumptions, and execute the checklist in order. Do not quietly revert to the earlier paid-provider recommendation: **$0 and no credit card are hard requirements.**
