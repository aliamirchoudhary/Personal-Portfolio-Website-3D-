# Portfolio audit — 25 October 2026

## Assessment

The visual identity is coherent and the animation work is distinctive. The existing optimizations help: small local icon fonts, a 62 KB portrait, separate animation chunks, viewport mounting, and canvas glow caching are all sensible. Keep the visual identity, but make the content and navigation independent of the animation system.

The highest priorities are the contact endpoint's abuse surface, keyboard accessibility, narrow-screen clipping, and resilience when an animation chunk fails. There is no confirmed critical compromise. This report records **45 findings**, including lower-priority engineering improvements and explicitly marked design judgments; they are not 45 equally severe bugs. The dedicated [motion pass](MOTION_AUDIT.md) refined the scrolling findings and added P10 after the original 44-finding audit.

This is the historical baseline, recorded before implementation. Current remediation and remaining acceptance work are documented in [FIX_PROGRESS.md](FIX_PROGRESS.md). Generated measurements and recordings remain local under the repository-root `.lh-temp/` directory and are not committed.

## Scope and evidence

- Repository baseline: `543ba71`, with a clean working tree before the audit.
- Production: <https://ali-aamir-portfolio.vercel.app/>. The production JS/CSS hashes matched the fresh local build.
- Local: production build served through Vite preview at `http://127.0.0.1:4173/`; this does not run Vercel serverless functions.
- Headless installed Chrome through Playwright. Inspected all eight sections in production at desktop size, and locally at desktop, tablet, and phone widths. Additional aligned screenshots cover 1440, 1025, 820, 390, and 320 pixels. Browser audit phone heights were 844/640; additional interaction checks used 900px height.
- Automated axe scans, navigation clicks, modal keyboard behavior, mocked frontend error responses, reduced-motion startup, animation-chunk failure, local mocked backend input tests, build/lint, npm advisory queries, deployed response headers, and public link requests.
- Contact delivery was mocked locally. **No real contact messages or automatic replies were sent.** The production endpoint was checked with GET only (405).
- Initial sandbox network failures were environmental; network-enabled reruns loaded production, fonts, and icons successfully with no page errors or failed requests in the normal section sweep.

Evidence files:

- Browser scans and resource lists (`.lh-temp/browser-audit.json`, local artifact)
- Interaction and clipping measurements (`.lh-temp/interactions.json`, local artifact)
- Public URLs, headers, navigation (`.lh-temp/network.json`, local artifact)
- Mobile Lighthouse run 1 (`.lh-temp/lighthouse-production-mobile.json`, local artifact), mobile repeat (`.lh-temp/lighthouse-production-mobile-repeat.json`, local artifact), desktop (`.lh-temp/lighthouse-production-desktop.json`, local artifact)
- Dependency advisory results (`.lh-temp/dependency-audit.json`, local artifact)
- Audit browser script (`.lh-temp/audit.cjs`, local artifact), interaction script (`.lh-temp/interactions.cjs`, local artifact), network script (`.lh-temp/network.cjs`, local artifact)

This is a broad code and browser audit, not a guarantee that every possible defect has been found. Real iOS Safari, Firefox, physical low-end hardware, assistive-technology sessions, production secrets/IAM, Vercel firewall settings, SMTP delivery, inbox placement, and real-user analytics were not available. Account-side controls may mitigate some application risks; they were not assumed. No load testing or destructive exploitation was performed.

## Measured baseline

Lighthouse 13.5.0, production URL, fresh browser runs. Mobile uses simulated throttling: 4x CPU slowdown, 150ms RTT, approximately 1.6 Mbps, 412×823 emulation. These are lab results on this host, not field Core Web Vitals. Run 1 overlapped other audit work; the later repeat had less competing browser activity. Two runs do not establish a statistical baseline.

| Metric | Mobile run 1 | Mobile repeat | Desktop |
|---|---:|---:|---:|
| Performance | 74 | 92 | 96 |
| Accessibility | 86 | 86 | 91 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| First contentful paint | 1.9s | 1.9s | 0.9s |
| Largest contentful paint | 2.9s | 2.5s | 1.3s |
| Total blocking time | 650ms | 230ms | 0ms |
| Cumulative layout shift | 0.103 | 0.002 | 0.026 |
| Speed index | 3.1s | 2.6s | 1.1s |

The variation matters: mobile is capable of a good result, but the first run exposes sensitivity to timing and host contention. Do not label the site permanently “74” or permanently “92.” The desktop 96 also does not capture the full 4.5-second wait before the main page mounts: the loading portrait can paint before useful content is accessible.

Google's field targets are LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile. TBT is a lab diagnostic, not measured field INP. [Google Web Vitals guidance](https://web.dev/articles/vitals).

Build passes. Main JS: 298.74 KB raw / 89.42 KB gzip; CSS: 12.10 KB / 3.25 KB gzip. GSAP and ScrollTrigger add approximately 45 KB gzip on desktop, plus animation chunks. Build warns that the Kryzect logo's dynamic import cannot split it because it is also imported statically. Lint fails: **21 errors, 2 warnings**.

## Priority definitions

- **P1:** fix first: abuse exposure, loss of essential functionality, or important access barriers.
- **P2:** meaningful usability, performance, reliability, or maintenance issue.
- **P3:** cleanup, defense in depth, or optional editorial/design improvement.
- **Confirmed:** reproduced or directly established from the relevant implementation. **Risk:** code permits the behavior, but production abuse/failure was not exercised. **Design:** professional judgment, not an objective functional failure.

## Security and contact reliability — 8 findings

### S01 — P1 — Automatic-reply endpoint can be abused for unsolicited mail

**Evidence:** `api/send-contact.js` accepts unauthenticated POSTs, sends to the owner and then to the supplied `email`, without an application rate limit, bot challenge, honeypot, or recipient cooldown. No application origin validation exists; the example `FRONTEND_ORIGIN` variable is unused. External firewall controls were not inspected.

**Impact:** scripts can consume Gmail quota, spam the owner, and send branded replies to third parties. CORS alone would not stop direct scripted calls.

**Fix:** add shared/serverless-safe rate limits, strict body limits, a honeypot and bot challenge where needed, per-recipient cooldown, and operational abuse monitoring. Consider omitting automatic replies until those controls exist. Treat origin checks as supplementary. **Validation:** mocked burst requests return 429 and do not call the mail transport; ordinary requests still work.

### S02 — P1 — Backend accepts recipient lists instead of one validated mailbox

**Confirmed:** with SMTP mocked, `{name:'A', email:'one@example.com, two@example.com', message:'x'}` returned 200 and passed both recipients to Nodemailer. The frontend regex is bypassable by direct API calls. Server validation checks only nonempty trimmed values.

**Fix:** validate normalized string inputs on the server, enforce one plain email address, reject control characters, lists, groups, arrays, and objects, and bound all lengths. Apply the same rules on the frontend for consistent feedback. **Validation:** one mailbox accepted; comma-separated, newline-containing, malformed, and oversized addresses rejected before mail parsing.

### S03 — P1 — Vulnerable production mail dependency

**Confirmed:** installed Nodemailer is 8.0.11. `npm audit --omit=dev` reports one high-severity affected production package. Full dependency audit reports 12 affected packages: 8 high and 4 moderate, including development tooling. These counts are package-level audit results, not 12 proven exploits in this site.

The address-parser denial-of-service advisory is particularly relevant because user-controlled `email` reaches `to` without a server length bound. No exploit payload was executed. File/URL access and other mail advisories require their own reachability assessment; this handler does not accept arbitrary Nodemailer options. [Address-parser advisory](https://github.com/advisories/GHSA-v53p-9fqp-m79j).

**Fix:** upgrade Nodemailer to a compatible version clear of all current advisories (the audit offered 10.2.1), review major-version changes, and test with a mocked transport and a controlled staging mailbox. Update affected build dependencies separately; do not blindly run a forced major Tailwind migration. **Validation:** production advisory scan clear, recipient validation tests pass, staging delivery confirmed.

### S04 — P2 — Malformed request bodies throw outside the error handler

**Confirmed:** undefined body throws during destructuring; numeric `name` throws at `.trim()`. Both happen before `try`. This bypasses the API's intended JSON error contract.

**Fix:** validate content type, object shape, string types, and sizes inside a top-level controlled error boundary. Return 400/413/415 as appropriate and use an `Allow: POST` header on 405 responses. **Validation:** missing/null/scalar/array/object field cases return structured errors without invoking SMTP.

### S05 — P2 — Partial mail delivery is reported as total failure

**Confirmed from code:** the owner email is sent first; the reply is sent second. If the second fails, the API returns 500 even though the owner received the message. A retry can duplicate the owner's email.

**Fix:** define owner acceptance as the main success criterion, make acknowledgement best-effort or queued, and add a bounded idempotency mechanism. **Validation:** simulate first-send success/second-send failure and verify no misleading total failure or duplicate owner delivery on retry.

### S06 — P2 — Contact submission has no explicit client deadline

**Evidence:** frontend `fetch` has no abort deadline and SMTP options have no task-specific connection/socket deadlines. Library/platform defaults are not tailored to the UI. The frontend checks `data.success` without checking HTTP status and assumes every response is JSON.

**Fix:** add an abort deadline, check `res.ok`, tolerate non-JSON gateway responses, preserve the draft, provide retry guidance, and configure SMTP timeouts within function execution limits. **Validation:** mocked timeout, HTML 502, JSON 429/500, and success all leave the UI usable. Draft retention on a mocked 500 already works and should be preserved.

### S07 — P2 — Missing deployed browser security policy headers

**Confirmed:** production HTML has HSTS, but no CSP, frame-ancestors/X-Frame-Options, X-Content-Type-Options, Referrer-Policy, or Permissions-Policy. `vercel.json` only defines the API rewrite. Absence is defense-in-depth debt, not evidence of an active injection.

**Fix:** add a narrowly scoped header policy and initially deploy CSP in report-only mode. Account for inline style blocks, inline font-load handlers, JSON-LD, fonts, and image CDNs before enforcement. Replace inline font handlers if needed. Restrict framing, disable unnecessary browser capabilities, and set nosniff/referrer behavior. **Validation:** inspect deployed HTML, assets, and API headers; no unexpected CSP violations or broken rendering.

### S08 — P3 — Contact data handling is undisclosed

**Evidence:** the form collects name/email/message and sends it through Gmail; no nearby explanation of processing/retention is present. External fonts and icons also contact third parties. This is a transparency improvement, not a jurisdiction-specific legal finding.

**Fix:** add a short privacy note describing the contact workflow and practical retention/contact policy. Self-host fonts/icons to reduce third-party requests. **Validation:** the note matches actual behavior and does not claim controls that are not implemented.

## Performance and animation lifecycle — 10 findings

### P01 — P1 — Artificial intro blocks useful content

**Confirmed:** `App.jsx` mounts the main page only after a fixed 4500ms desktop or 900ms narrow/low-power timer. Every full visit repeats it; no skip control exists. Reduced-motion desktop still had the loader and no main at 1.5 seconds.

**Fix:** render meaningful content immediately. Run an optional decorative intro alongside it; skip it for reduced motion, save-data, repeat visits, and slow devices. **Validation:** heading, navigation, and primary action are available on the first useful render without waiting for the timer.

### P02 — P1 — Animation chunk failure can remove the whole page

**Confirmed locally:** blocking the GSAP asset led to no main content after 7.5 seconds. Lazy animation loading has no React error boundary, and `loadGSAP().then(...)` has no rejection fallback.

**Fix:** isolate decorative components behind error boundaries, catch failed imports, and advance to a static ready state on failure. A missing animation must not prevent the portfolio from rendering. **Validation:** abort each lazy chunk independently and verify readable sections and working navigation remain.

### P03 — P2 — Font loading and intro changes can destabilize the hero

**Confirmed:** the first mobile Lighthouse run recorded 0.103 CLS, largely on the hero container; web fonts were identified among causes. Repeat CLS was 0.002, so the problem is timing-sensitive. The typewriter's blinking cursor also appeared in shift diagnostics.

**Fix:** consolidate fonts, self-host essential subsets, use metric-adjusted fallback fonts, reserve portrait/text geometry across phases, and keep the cursor from altering line breaks. **Validation:** repeated cold-load traces on throttled mobile with CLS ≤0.1; preferably ≤0.05 for margin.

### P04 — P2 — Duplicate font loaders and avoidable external dependencies

**Confirmed:** `index.html`, `RingCarousel.jsx`, and `SkillCube.jsx` request overlapping Google font families with different weight lists; the cube adds another link. Clash Display adds another font origin. The cube loads six unversioned jsDelivr devicon SVGs.

**Fix:** centralize typography and remove component-level font injection. Keep only used weights/families, self-host licensed subsets, and bundle or pin the small SVG icons. **Validation:** one intentional font setup, fewer origins/requests, stable fallback rendering with external hosts blocked.

### P05 — P2 — Mobile content mounting still does substantial synchronous work

**Evidence:** all section modules mount together after the loading phase. First-run Lighthouse attributed about 3.5s to style/layout out of 7.0s main-thread work and flagged forced reflow. Mobile repeat TBT remained 230ms. `content-visibility` helps paint/layout but does not prevent React work and effects.

**Fix:** profile the mount before rewriting it; batch geometry reads/writes, avoid synchronous measurement cascades, and defer expensive decorative or interactive subtrees. Keep essential text available. **Validation:** repeated isolated traces show lower long-task cost; target median mobile TBT ≤200ms without hiding content to improve the score.

### P06 — P2 — LazyMount ignores its prefetch margin and changes layout on unmount

**Confirmed:** the `margin` prop is unused; every caller actually uses `unmountMargin` (400px default). The wrapper swaps full components for generic 180–300px placeholders, potentially changing height and restarting animation state on re-entry.

**Fix:** implement the documented enter/exit margins or simplify the API; preserve measured height/aspect ratio and decide explicitly whether each animation should pause or unmount. **Validation:** scroll back/forth and jump between sections without unexpected position changes or repeated unnecessary initialization.

### P07 — P2 — Reduced-motion and low-power behavior is incomplete

**Confirmed:** some components honor reduced motion, but the App intro, neural globe, cube loop, typewriter, navbar bob, and several transitions lack a unified policy. `lowPower` mainly changes intro/slot behavior; it is not passed as a quality budget to most animations.

**Fix:** introduce a shared motion/quality preference, render static meaningful states under reduced motion, allow animation pause, and lower canvas complexity/fps for constrained devices. Do not use viewport width as the only performance signal. **Validation:** reduced-motion inspection across every section; essential information remains visible with animation stopped.

### P08 — P2 — Hidden desktop mobile decorations can still mount

**Evidence:** mobile animation wrappers exist in the DOM on desktop and are hidden with CSS. LazyMount observers do not explicitly gate on the responsive mode. A hidden element near the observer root can still intersect. The mobile hero wrapper can import/render a second portrait near the top despite being hidden.

**Fix:** conditionally render decoration trees according to a reactive media query; pause/cancel work on actual visibility changes rather than relying only on CSS. Some loops also continue requesting rAF while their pause flag is set. **Validation:** inspect active loops/components at desktop/mobile and on backgrounding; hidden alternatives do no sustained work.

### P09 — P3 — Small remaining asset and rendering costs

**Evidence:** portrait is JPEG without responsive variants; Lighthouse estimated about 25 KB image savings. Font Awesome uses `font-display:block` and Lighthouse estimated ~180ms font-display savings in run 1. Broad permanent `will-change`, animated shadows, and backdrop blurs create potential compositing costs; their device impact needs profiling.

**Fix:** responsive WebP/AVIF portrait variants, SVG icons or appropriate font-display, apply `will-change` during activity only, and reduce blur/shadow cost on constrained devices after measuring. **Validation:** compare image transfer and sustained frame profiles; preserve image quality and existing small icon payloads.

### P10 — P2 — Loading portrait can briefly paint before its styles

**New motion-pass finding:** the first captured frame in fresh mobile, reduced-motion, and throttled contexts showed an oversized rectangular portrait at the upper-left; subsequent frames showed the intended centered circular loader. `LoadingProfileFrame.jsx` injects its essential CSS in `useEffect`, after the initial DOM commit. Unstyled frame (`.lh-temp/motion/frame-01110.jpg`, local artifact), following styled frame (`.lh-temp/motion/frame-01111.jpg`, local artifact). Sampling does not establish the exact flash duration.

**Fix:** load the loader's essential CSS through the normal stylesheet pipeline before rendering it, rather than installing it in a post-paint effect. **Validation:** cold-load frame sequences, including throttled and reduced-motion cases, never display the raw oversized portrait.

## Visual layout, navigation, and content — 10 findings

### U01 — P1 — Tablet navbar clips navigation

**Confirmed visually at 820px:** desktop links remain enabled until 768px; Contact extends past the viewport. Screenshot (`.lh-temp/tablet-home.png`, local artifact).

**Fix:** switch to the compact menu when the link row no longer fits (likely around 1024px), or use a measured layout breakpoint. **Validation:** all links visible and operable at 768, 820, 912, 1024px and enlarged text.

### U02 — P1 — Education cards are clipped on narrow layouts

**Confirmed:** at 320px, right-hand card bounds extended to 344px; at 390px to 414px, and at 820px to 828px. Ancestor clipping means a lack of a page scrollbar does not prove the content fits. 320px screenshot (`.lh-temp/aligned-320-education.png`, local artifact).

**Fix:** make mobile timeline tracks use the available width after timeline padding; bound card widths and reveal transforms within the scroll container. **Validation:** card content, borders, and course controls remain inside their container at 320–1024px, including expanded courses.

### U03 — P2 — Project carousel obscures the project that should be central

**Confirmed visually:** center cards are farther back, smaller, and heavily overlapped; side cards dominate. At mobile size, headings/descriptions become tiny and clipped, and the intended featured project is difficult to inspect. Mobile screenshot (`.lh-temp/aligned-390-projects.png`, local artifact).

**Fix:** keep the 3D effect on spacious screens but make the active card dominant and unobscured. Use a single-card swipe/list presentation on mobile, with project index/count and clear controls. **Validation:** every project title and details action is discoverable by touch and keyboard.

### U04 — P2 — Nested scrolling makes information easy to miss

**Confirmed:** About, Experience, Education, Skills, and Contact use fixed-height inner scroll areas. Skills has both an outer scroll area and `.sg-scrollable`. At 390×900, Contact's inner area was 650px high with 1054px content; scrolling the page alone does not reveal all contact content.

**Fix:** use normal document flow on mobile and preferably for text-heavy desktop sections. If inner scrolling is essential, use one scroll owner with a visible affordance and keyboard access. **Validation:** a visitor can read all content with ordinary page scrolling, zoom, and keyboard navigation.

### U05 — P2 — Excessive empty travel distance and mobile animation spacing

**Confirmed implementation/design:** desktop inserts 60vh gaps between seven sections; mobile sections retain 100vh minimums, and several decorations add 10vh top plus 20vh bottom margins. The page measured ~11,326px tall at 1440×900. Mobile Projects shows a large gap between controls and its diagram.

**Fix:** reduce crossing distance, derive animation travel from actual layout, and replace mobile viewport-sized spacers with bounded spacing tokens. **Validation:** compare full-page screenshots and time to reach Projects/Contact; retain breathing room without long empty screens.

### U06 — P2 — Responsive mode is frozen at initial render

**Confirmed from code:** App stores `isDesktop`/`isNarrow` once. Resizing mobile→desktop never enables the slot; desktop→mobile retains a hidden mounted slot. Width changes in the slot update a ref but do not fully reconcile the responsive tree.

**Fix:** use a subscribed `matchMedia` hook and cleanly initialize/tear down mode-specific effects on breakpoint changes. **Validation:** resize and rotate repeatedly across 1024px with no missing decoration, duplicate loops, or stale layout.

### U07 — P2 — Slot visibility can desynchronize during abrupt scrolling

**Confirmed locally in aligned programmatic jumps and the dedicated rapid-wheel pass:** several sections arrived with the decorative slot empty. Rapid forward/back wheel input returned to Home with the portrait mounted at opacity zero for the remaining ~1.7 seconds of that stage; ordinary continuous scrolling across all seven boundaries and back correctly displayed the slot. `onUpdate` returns unless both old and new wrappers exist while callbacks asynchronously change the mounted set. This is a fast-scroll/restore resilience issue, not a claim that ordinary nav is always broken. See the [motion evidence and input distinctions](MOTION_AUDIT.md).

**Fix:** derive visible components and their opacity from current scroll position in a consistent update, then reconcile mounts. Avoid relying on an old wrapper still existing to set the new wrapper visible. **Validation:** scrollbar dragging, Home/End, instant scrolling, history restoration, and rapid direction changes leave the correct decoration visible.

### U08 — P2 — Experience descriptions depend on hidden gestures

**Confirmed:** descriptions sit behind a front face, revealed by mouse hover or touch-start toggling. Mobile still says “hover to reveal what I did.” Keyboard users cannot trigger the same behavior, and a touch scroll can toggle a card unintentionally. Screenshot (`.lh-temp/aligned-390-experience.png`, local artifact).

**Fix:** show a short contribution summary by default; use an explicit accessible expand button for detail. **Validation:** keyboard, mouse, and touch all expose the same information without accidentally opening on scroll.

### U09 — P3 — Portfolio evidence is harder to scan than it needs to be

**Design judgment:** the hero offers only Download Resume; project cards share generic code icons; descriptions and numerical skill percentages carry more weight than visible outcomes. Dense About text delays concise evidence of expertise.

**Fix:** add “View projects”/“Contact” hero actions; show a small set of strong project screenshots, personal contribution, technical tradeoffs, and verified outcomes. Replace unexplained skill percentages with evidence or understandable proficiency groupings. **Validation:** a new visitor can identify specialty, strongest work, and contact path in a brief scan. This is editorial work, not a prerequisite for fixing bugs.

### U10 — P3 — URL and professional-content cleanup

**Confirmed:** Kryzect links in shared data use HTTP and redirect to HTTPS; X URL contains share tracking parameters; project GitHub URLs use `.git` and redirect. Skill values differ between the shared data and actual grid (Python 88 vs 94). Some service data links to generic Fiverr rather than a specific gig, though that data is not currently the main Kryzect section.

**Fix:** use canonical HTTPS URLs, remove tracking parameters, normalize repository links, verify dormant service content before reuse, and consolidate skills. Verify dates, availability, and promised 24-hour response time against reality rather than guessing changes. **Validation:** canonical links resolve and the displayed content has one authoritative source.

## Accessibility and interaction semantics — 9 findings

### A01 — P1 — Form labels are not associated with fields

**Confirmed by axe:** all three labels lack matching `htmlFor`/field `id`. Visible text is not an accessible label automatically.

**Fix:** associate labels, add appropriate autocomplete, required/min/max constraints, and persistent per-field help/errors. **Validation:** each input has the correct accessible name and clicking its label focuses it.

### A02 — P1 — Project details cannot be opened by keyboard

**Confirmed:** carousel cards are clickable `<article>` elements without a native focusable details control or Enter/Space behavior. Arrow buttons change the carousel but do not offer an accessible way to open each project's details.

**Fix:** add a native button/link for each project's details; scope arrow-key behavior to the focused carousel. The current window-level arrow handler also changes projects while typing or interacting elsewhere. **Validation:** Tab/Enter can open every project and text-field cursor keys do not rotate the carousel.

### A03 — P1 — Modal does not manage focus or inert background

**Confirmed:** on opening a project dialog, focus remained on BODY; Tab went to a background navbar button. Close has `tabIndex=-1`; body overflow remains visible. There is no focus trap, initial focus, focus restoration, or background inertness. Escape does close it.

**Fix:** use an accessible dialog primitive or native `<dialog>` with appropriate focus/scroll handling, tabbable close button, and focus restoration. [W3C modal interaction pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). **Validation:** Tab/Shift+Tab stay in the modal, Escape closes, and focus returns to its opener.

### A04 — P1 — Mobile menu button is unnamed and lacks state

**Confirmed by axe/code:** icon-only button has no accessible label, `aria-expanded`, or `aria-controls`. Escape did not close the opened mobile menu during the interaction check.

**Fix:** add name/state/control association, Escape close behavior, and sensible focus handling; dismiss on navigation and breakpoint changes. Give the `.py` home control a meaningful Home label too. **Validation:** screen readers announce the menu and its state correctly; keyboard users can open, navigate, and dismiss it.

### A05 — P2 — Text contrast failures

**Confirmed by axe:** production desktop scan found nine failing nodes, including labels (3.46:1), carousel “view details” text (3.17:1), and muted Kryzect attribution (4.15:1), all below the relevant 4.5:1 normal-text threshold.

**Fix:** introduce tested foreground/background tokens, lighten purple text or darken its background, and avoid low-opacity text for important content. **Validation:** scan default/hover/focus/modal/tab states; normal text ≥4.5:1 and large text ≥3:1.

### A06 — P2 — Scroll regions are not reliably keyboard accessible

**Confirmed by axe:** `.sg-scrollable` fails desktop focusability; narrow layouts expose additional inaccessible inner text scrolling. Browser-specific auto-focusability should not be assumed across Safari and other engines.

**Fix:** prefer normal flow; otherwise give necessary regions a label, intentional tab stop, and visible focus. **Validation:** keyboard-only users can read every item in Safari/Chromium without a mouse.

### A07 — P2 — Contact notifications are visual-only and short-lived

**Confirmed:** success/error toast has no live-region role; mocked failure produced zero `[aria-live]`, alert, or status regions. It disappears after four seconds and does not focus/associate field errors.

**Fix:** use an appropriate polite status/assertive error announcement, persistent inline errors, and a stable submission status. **Validation:** screen reader announces success/error once; users can locate and correct invalid fields without racing a timeout.

### A08 — P2 — Navigation lacks URL/focus semantics and a skip link

**Confirmed:** section navigation uses buttons and `scrollIntoView`; it does not update a fragment/history, move focus to the destination, or expose `aria-current`. No skip-to-main link exists. Direct hash handling after deferred section mounting is not implemented and needs dedicated regression coverage.

**Fix:** use real section anchors with progressive enhancement, meaningful destination focus, current-location state, correct responsive scroll offset, and a visible-on-focus skip link. **Validation:** copy/open section URLs, Back/Forward, keyboard activation, and reduced-motion navigation work.

### A09 — P3 — Semantics need a final consistency pass

**Evidence:** axe reports indistinguishable nested navigation landmarks and portrait content outside landmarks; Skills uses visually styled category buttons without explicit selected-state semantics. Decorative graphics/icons are not consistently distinguished from meaningful content, and the typed role text lacks a stable accessible equivalent.

**Fix:** use one labeled main navigation, mark decorative artwork appropriately, expose selected category state (or implement the full tabs pattern), and provide a complete stable accessible role/title independent of typing. **Validation:** inspect the accessibility tree and complete a manual screen-reader pass; automated axe alone is insufficient.

## Organization, maintainability, SEO, and operations — 8 findings

### M01 — P2 — Lint is currently failing

**Confirmed:** 21 errors and 2 warnings. Examples include browser-only ESLint globals applied to the Node API (`process` undefined), unused imports/props/variables, a render-time ref write, and effect dependency warnings.

**Fix:** separate Node/browser lint environments, remove real dead code, move ref synchronization to the correct lifecycle, and resolve hook dependencies. Avoid globally disabling rules to make the check green. **Validation:** `npm run lint` and `npm run build` both pass.

### M02 — P2 — No automated regression gate for the fragile behavior

**Evidence:** package scripts have no test command and there is no checked-in CI workflow. Existing Lighthouse JSON is a historical snapshot, not a repeatable gate.

**Fix:** add focused API validation/mail-failure tests and a small browser smoke suite for mobile nav, keyboard dialog, responsive layout, chunk failure, and section navigation. Add build/lint/audit checks to CI and a modest performance budget. **Validation:** introduce a deliberate regression locally and confirm the relevant check catches it.

### M03 — P2 — Styling depends on serialized inline-style strings

**Confirmed:** responsive selectors such as `[style*="margin-left"]` and `[style*="grid-template-columns"]`, repeated `!important`, and competing global CSS make layout depend on implementation details. The mobile margin reset is assigned three times in succession. Cube injection also writes global html/body/root styles.

**Fix:** migrate to explicit section/layout classes, scoped component styles, shared spacing/color/breakpoint tokens, and ordinary grid/flex layout. Do it incrementally after visual baselines are captured. **Validation:** screenshots match intentional design and unrelated component edits cannot silently disable responsiveness.

### M04 — P2 — Content has multiple sources of truth

**Confirmed:** SkillsGrid owns arrays that duplicate and disagree with `portfolioData.js`; ProjectsSection owns extensive HTML descriptions separately from project data; identity/contact/experience information is also repeated in index metadata and the no-JS fallback.

**Fix:** consolidate content into structured objects and render modal content as React elements; derive generated metadata/fallback content from the same source where practical. **Validation:** changing one record updates every intended presentation with no stale duplicated facts.

### M05 — P3 — Demo scaffolding and misleading lazy imports remain

**Confirmed:** EducationTimeline has an unused standalone demo App/sample universities and continuous rAF code; this default export is not the live education section and is not a confirmed runtime drain. Other unused props/state and Vite/React template assets remain. KryzectLogo's lazy import is ineffective because it is already static elsewhere.

**Fix:** remove demo-only exports/assets and unused APIs; make import strategy intentional. Preserve useful reusable components. **Validation:** clean lint/build output and no accidental demo content in the shipping UI.

### M06 — P3 — SVG IDs collide across logo instances

**Confirmed from code:** KryzectLogo uses the fixed `kryzect-logo-static` prefix for SVG definitions across instances. About/footer/slot can contain multiple logos. This can make URL-referenced filters/definitions resolve to another instance, particularly after size/style changes.

**Fix:** generate unique IDs with `useId` and keep CSS scoping deliberate. **Validation:** render several differently sized logos together and verify each filter/definition resolves to its own SVG.

### M07 — P3 — Good SEO basics, but rendering and content resilience need improvement

**Evidence:** canonical, Open Graph/Twitter tags, Person/Organization/WebSite JSON-LD, sitemap, robots, and a no-JS fallback exist; Lighthouse SEO is 100. However the fallback is only shown when JavaScript is disabled, not when enabled JavaScript crashes. Core content still depends on client rendering and animation startup. Metadata/fallback content can drift from current project records.

**Fix:** prerender the essential portfolio content (or adopt static generation only if justified), keep metadata synchronized, and add production checks for structured data, social previews, and useful content when interactive code fails. Do not change frameworks solely to chase an already-green SEO score. **Validation:** useful initial HTML, correct canonical/social preview, and accurate search-visible text.

### M08 — P2 — Operational visibility and reproducibility are incomplete

**Evidence:** no checked-in runtime engine declaration, automated advisory workflow, client error boundary/reporting, or Web Vitals collection is present. Function errors are only logged. `.env.example` advertises an unused CORS variable and port 3000 rather than the normal Vite URL. Build success does not verify SMTP configuration.

**Fix:** pin/document supported Node/package-manager versions, keep lockfile-based installs, document Vercel API development/staging, remove obsolete environment guidance, and add privacy-conscious error/latency/mail-delivery monitoring. Confirm Vercel project runtime and firewall settings separately. **Validation:** clean checkout reproduces build and checks; staging detects missing mail configuration; production failures have actionable diagnostics without logging contact messages.

## Public URL checks

- Resume PDF, robots.txt, sitemap.xml, GitHub profile, all seven project repositories, Criclytics demo, and Kryzect home/services/contact returned 200 (some after canonical redirects).
- Unknown portfolio URL returned a proper 404; API GET returned 405.
- LinkedIn returned 999, Fiverr and X returned 403, Facebook share URL returned 400. These services often restrict automated access; **these results do not establish that the links are broken**. Manually verify in a normal signed-out browser. Prefer a stable direct Facebook profile URL over a share URL if available.
- An HTTP request to Kryzect redirected to HTTPS successfully; link cleanup still avoids the unnecessary insecure first hop.

## Things that should be preserved

- Distinctive consistent dark/purple/cyan palette and the desktop visual concept.
- Existing animation chunking, small local icon subset, bounded portrait asset, mobile canvas optimizations, and cleanup on component unmount.
- External anchors generally use `noopener noreferrer`.
- Mail HTML escapes user values; the modal HTML currently comes from trusted checked-in data. `dangerouslySetInnerHTML` is a maintenance/trust-boundary concern, **not a demonstrated user-controlled XSS vulnerability here**.
- `.env` is ignored and was not tracked in the examined repository history. No claim of leaked credentials was established; secret values were not printed.
- Correct HTTPS/HSTS, functioning resume, SEO metadata, sitemap, robots, and successful normal-load browser behavior.

## Proposed branch work, after report review

Create one branch such as `audit/portfolio-hardening` only when the implementation phase begins. Keep small reviewable commits and retain the audit baseline.

| Order | Work package | Findings | Completion evidence |
|---|---|---|---|
| 1 | Secure and stabilize contact API | S01–S06, A01, A07 | Mocked API cases, rate limits, dependency scan, staging delivery |
| 2 | Restore reliable access to content | P01–P02, A08 | Immediate content, chunk-failure and navigation tests |
| 3 | Repair keyboard/touch interactions | A02–A06, A09, U08 | Keyboard walkthrough, axe, dialog/menu tests |
| 4 | Fix responsive layout | U01–U07 | 320–1440px screenshots, zoom and rotation checks |
| 5 | Tune loading and sustained animation | P03–P10 | Repeated isolated Lighthouse plus real-device/frame profiling |
| 6 | Simplify organization and enforce checks | M01–M06, M08 | Lint/build/CI, single content source, documented runtime |
| 7 | Deploy headers and finalize content | S07–S08, U09–U10, M07 | Preview header/CSP checks, metadata and link review |

Final acceptance should include all sections on desktop/mobile; 200% zoom and narrow reflow; keyboard-only navigation and modal operation; reduced-motion behavior; blocked external hosts/chunks; ordinary and failed contact submissions; no persistent horizontal clipping; repeated mobile lab checks; and physical low-end Android/iOS validation when available. Field Web Vitals should then be monitored over real visits rather than inferred from one lab score.
