# Portfolio audit implementation

Implementation branch: `audit/portfolio-hardening`. This record describes repository changes and local validation; it does not imply production deployment or external account configuration. Artifact paths below are relative to the repository root.

The 45 baseline findings remain documented in `AUDIT_REPORT.md`; this file records their implementation. “Implemented” means the repository change is present and locally checked, not that the live Vercel deployment has changed. External acceptance work is listed explicitly below.

## Security and contact reliability

| Finding | Implementation and local evidence | Remaining acceptance |
|---|---|---|
| S01 | Removed visitor auto-replies. Shared atomic Redis rate limits, recipient cooldown, honeypot, expiring idempotency reservations. Mock tests cover limits, concurrent/repeated retries and unavailable storage. | Configure dedicated Redis and verify staging delivery/limits. |
| S02 | Shared strict single-mailbox validation rejects lists, display-name/header syntax, controls, invalid types, excessive lengths and invalid DNS labels. Recipient is always configured owner. | Controlled staging reply-to check. |
| S03 | Updated Nodemailer and vulnerable build/transitive packages. Fresh npm audit reports zero advisories. | Keep recurring advisory checks enabled. |
| S04 | Validation, type checks and byte limits are inside error handling; malformed inputs return bounded 4xx responses. | None for repository fix. |
| S05 | One owner notification replaces the two-delivery flow. Successful retries deduplicate; bookkeeping failure does not falsely report SMTP failure. | SMTP cannot guarantee exactly-once delivery after every ambiguous transport failure; documented. |
| S06 | Client has a 20-second deadline, robust non-JSON/error handling, retained draft/request ID, disabled duplicate submission and persistent accessible status. SMTP has bounded timeouts. | Controlled real delivery/failure check. |
| S07 | Generated Vercel headers include nosniff, frame denial, referrer/permissions policies and report-only CSP with JSON-LD hashes. Build detects stale configuration. | Preview header/CSP review before enabling CSP enforcement. No remote reporting collector configured. |
| S08 | Contact form discloses Gmail delivery, expiring abuse records and deletion contact. No contact text in Redis or application error logs. | Owner must maintain inbox retention/deletion procedures. |

## Loading and motion

| Finding | Implementation and local evidence |
|---|---|
| P01 | Useful content renders immediately. Former blocking intro becomes an optional 1.8-second desktop decoration; repeat sessions, low-power and reduced-motion modes skip it. |
| P02 | Decorative imports have local error boundaries; blocked slot chunk leaves content and contact fields available. Root failure has an email fallback. |
| P03 | Locally hosted fonts, reserved title geometry, image dimensions and responsive preloading. Phone/low-power titles render complete without repeated typing updates. Skills layout CSS ships before paint rather than being injected in an effect. |
| P04 | Removed runtime Google/Fontshare/CDN icon requests and duplicate font injection. Fonts and pinned SVGs have source/license records. |
| P05 | Immediate prerendered content; mobile decorations mount near viewport. Memoized sections prevent whole-page rerenders on active-navigation changes. No GSAP/ScrollTrigger dependency. Entry payload is smaller and checked against a build budget. Mobile lab performance acceptance remains open; see measurements below. |
| P06 | LazyMount uses separate entry/exit margins and measured placeholder height to preserve layout when decoration unmounts. |
| P07 | Reactive reduced-motion, page visibility, offscreen activity, low-power quality and user pause controls stop recurring effects. Phone portrait keeps transform motion with a static glow instead of recurring filter/shadow paints. Pause test confirms cube rotation stops. Skill content remains visible when animation is disabled, covered by a reduced-motion regression assertion. |
| P08 | Responsive mounting avoids hidden mobile decoration instances on desktop; media queries update after resizing. |
| P09 | Responsive WebP portraits, lazy real project preview, local icons, bounded drawing quality, and scoped compositor hints reduce avoidable asset/rendering costs. |
| P10 | Loading portrait CSS is imported before rendering; removed post-paint style injection and original-JPEG suspense fallback. |

Continuous wheel replay covered all 14 section boundaries down/up, rapid reversals and pause/resume. Its 90 sampled frames and telemetry are in ignored `test-results/motion/`; visual review checked intermediate crossfades/side changes, not only landing screenshots. These recordings are not an FPS benchmark. Physical low-end Android, Safari/iOS, thermal/GPU behavior and deployed field percentiles remain external checks.

## Layout, navigation and content

| Finding | Implementation and local evidence | Remaining acceptance |
|---|---|---|
| U01 | Responsive named hamburger/menu at tablet widths; 320/390/820/1440 browser checks and screenshots. | Physical rotation check. |
| U02 | Education cards use document-flow layout with readable native course disclosures. | None for repository fix. |
| U03 | Front project is dominant; compact layout shows one readable card. Scoped keys, drag and named controls retain carousel interaction. | None for repository fix. |
| U04 | Removed nested content scrolling; native project dialog has one scroll owner. | None for repository fix. |
| U05 | Removed scroll snap traps and oversized blank travel/mandatory mobile viewport heights; retained intentional desktop artwork transitions. | Owner design review of changed spacing. |
| U06 | Live media-query subscription changes responsive mounting/layout after resize. Resize recovery tested. | Real-device rotation. |
| U07 | Replaced slot timeline with scroll-derived state, cached geometry and post-mount painting of current wrappers. Abrupt jumps, wheel reversals and resizing recover visible artwork. | None for repository fix. |
| U08 | Experience role/company/date/contribution visible by default; detailed text uses native disclosure. | None for repository fix. |
| U09 | Hero actions/value statement, project technology tags, structured details and real Criclytics preview improve scanning. Skill levels are explicitly self-assessed. | Owner must verify factual claims/results and provide additional authentic previews; no new results invented. |
| U10 | Canonical HTTPS/clean social links; Fiverr links to the owner profile. | Signed-out manual verification of restricted social sites; direct Facebook profile replacement requires an owner-provided URL. |

## Accessibility

| Finding | Implementation and local evidence |
|---|---|
| A01 | Associated labels, autocomplete, field limits, shared validation, error focus and aria-invalid. |
| A02 | Project details are native named buttons; scoped arrows and explicit carousel controls. |
| A03 | Native modal dialog, explicit focus wrap, inert background, Escape/backdrop close, body scroll lock and focus restoration. |
| A04 | Menu button has name, expanded state and controls relation; Escape/outside close. |
| A05 | Updated text, button and muted colors; zero axe violations at all four tested widths, including dialog state. |
| A06 | Ordinary document scrolling replaces inaccessible nested regions; modal remains keyboard scrollable. |
| A07 | Persistent role=status feedback retains draft and direct-email alternative on errors. |
| A08 | Real fragment links, responsive scroll offset, destination focus, active location, Back/Forward handling and skip link. |
| A09 | One named navigation, labeled sections, decorative artwork treatment, stable accessible hero title and aria-pressed skill categories. |

Automated checks and keyboard interaction tests are complete locally. A human screen-reader pass and actual browser zoom/physical assistive-technology checks remain acceptance work; axe does not establish complete accessibility compliance.

## Organization and operations

| Finding | Implementation and local evidence | Remaining acceptance |
|---|---|---|
| M01 | Separate Node/browser lint globals; resolved hook/ref/dead-code problems. Lint clean without broad rule suppression. | None. |
| M02 | API/site tests, Playwright/axe regression suite, formatting/lint/build gates, payload budgets and read-only CI workflow with advisory check. | First hosted CI run requires a future authorized push. |
| M03 | Explicit responsive classes/component CSS replace serialized-style substring selectors; removed global body/root style injection. | None. |
| M04 | Canonical skill/project/identity data; structured React detail blocks; generated metadata/no-JS content/security hashes; shared form validation. | None. |
| M05 | Removed unused timelines/demo exports/template assets and GSAP; intentional logo import strategy. | None. |
| M06 | Instance-specific useId SVG/filter references; no fixed logo prefix collisions. | None. |
| M07 | Build prerenders actual React HTML, hydrates it and generates shared-data metadata/no-JS fallback. No-JS and failed decorative-chunk tests pass. | Preview social cards/search rendering after deployment. |
| M08 | Node engine/.nvmrc, lockfile, accurate environment/development docs, sanitized error hooks, local Web Vitals events and generic mail failure logs. | Provider runtime/firewall review, external collector/alerts and staging SMTP credentials are account-side work. |

## Validation record

- `npm run check`: formatting, lint, six API/site tests, production client/SSR prerender build, payload budgets and browser suite. The payload gate was also checked against an intentionally oversized isolated fixture and correctly failed without changing the real build.
- Browser coverage: 320, 390, 820 and 1440 pixels; no horizontal page overflow or page errors; zero axe violations; menu/dialog keyboard operation; failed/non-JSON contact response; rapid scroll/resize; reduced motion; failed decorative chunk; useful no-JS content.
- Contact tests use injected mail transport. No real visitor or owner email was sent.
- `npm audit --json`: zero vulnerabilities after dependency updates.
- `git diff --check`: clean. Branch confirmed as `audit/portfolio-hardening` before the authorized baseline commit.
- Performance results and final artifact measurements are recorded below after isolated lab checks. Local preview timings are not directly comparable to production network/TTFB and do not establish field performance.

## Required before deployment

Production needs `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, alongside the existing mail variables. Without the shared store, the API deliberately returns 503 and offers direct email. See [deployment operations](../OPERATIONS.md) for staging, CSP, monitoring and deployment steps. The live website has not been changed.

## Final lab measurements

Measured sequentially on the final production build through local Vite preview using installed Chrome and Lighthouse 13.5.0 on 2026-10-25. No other audit browser suite ran during this final set. This is a local workstation measurement, not a controlled physical-device or deployed field comparison.

| Run | Performance | Accessibility / best practices / SEO | FCP | LCP | TBT | CLS |
|---|---:|---|---:|---:|---:|---:|
| Mobile 1 | 70 | 100 / 100 / 100 | 3.5 s | 4.0 s | 390 ms | 0 |
| Mobile 2 | 91 | 100 / 100 / 100 | 1.8 s | 2.4 s | 260 ms | 0 |
| Mobile 3 | 93 | 100 / 100 / 100 | 1.8 s | 2.3 s | 230 ms | 0 |
| Desktop | 99 | 100 / 100 / 100 | 0.5 s | 0.7 s | 10 ms | 0.042 |

Mobile median performance is **91**, range **70–93**. Every final run had no browser console errors. Earlier measurements of the same final build also ranged from 79 to 97; these demonstrate variability, not a separate acceptance result. The original production baseline likewise varied (74 and 92), and its network/deployment environment differs from local preview. **A consistent mobile performance improvement has not been established. P05 mobile performance acceptance remains open**, requiring repeat measurements in a stable environment and physical low-end-device checks; the code changes and successful desktop score alone do not close it.

Final reports: `.lh-temp/lighthouse-current-mobile-{1,2,3}.json`, `.lh-temp/lighthouse-current-desktop-final.json`, and `.lh-temp/performance-final-summary.json`. Interim experimental/overlapping measurements are not used in the table above. The unsuccessful offscreen content-visibility experiment was removed.

Vite reports the main entry at **81.36 kB gzip**, compared with the audit baseline's **89.42 kB**, and the former roughly 45 kB gzip GSAP/ScrollTrigger dependency is gone. The independent Node gzip budget checks measured entry 80,624/95,000 bytes, initial HTML 12,610/30,000 bytes, main CSS 6,556/10,000 bytes, and large portrait 28,714/35,000 bytes. Different gzip settings explain the small difference from Vite's printed transfer estimate. Passing transfer limits does not guarantee a mobile score.

The initial intro and repeat-session skip were also captured and checked separately in `test-results/intro/`. Final responsive screenshots and dialog screenshots are in `test-results/`. These generated artifacts are ignored and listed in the cleanup inventory.
