# Development and deployment

## Local development

Use Node 24.15.0 (see `.nvmrc`) and npm (validated with 11.12.1). Install with `npm ci`, then run `npm run dev`. Vite serves the app at `http://localhost:5173` and includes the `/send-contact` development middleware. Copy `.env.example` to `.env` only when configuring mail delivery. No secret belongs in a `VITE_` variable.

`npm run preview` serves the production frontend after `npm run build`; it does not emulate Vercel Functions. Browser regression tests intercept contact requests and never send email. The backend tests inject a mock mail transport.

The build produces client assets and a temporary server-rendering bundle in ignored `.ssr-temp/`, then prerenders React into `dist/index.html`. No rendering server is required in production. JavaScript hydrates the same initial tree; a generated no-JavaScript portfolio uses the shared content records.

Build-time budgets cap the main JavaScript entry at 95,000 gzip bytes, each stylesheet at 10,000 gzip bytes, prerendered HTML at 30,000 gzip bytes and the large responsive portrait at 35,000 bytes. `scripts/check-budgets.mjs` fails the build if these limits are exceeded. These transfer limits complement browser interaction checks; they do not measure GPU smoothness or guarantee a Lighthouse score.

## Free contact delivery with Web3Forms

Create an access key at https://web3forms.com/#start and verify the recipient inbox (`aliamirchoudhary@gmail.com`). Add `VITE_WEB3FORMS_ACCESS_KEY` to ignored `.env` for local development and to the Vercel project's Production environment. Restart Vite locally; redeploy Vercel after changing the variable because Vite embeds it at build time. The Web3Forms access key is intentionally public, unlike SMTP and assistant API credentials.

When this variable is populated, the browser sends validated name, email, and message directly to `https://api.web3forms.com/submit`. Web3Forms handles email delivery and its own spam protection; this path requires neither Gmail app passwords nor Redis. The form retains its honeypot, field bounds, duplicate-click prevention, error handling and direct-email alternative. SMTP idempotency and Redis limits apply only to the fallback below; a Web3Forms retry after a timeout may send a duplicate. The privacy disclosure changes to identify Web3Forms processing. See the [provider API reference](https://docs.web3forms.com/getting-started/api-reference).

Check a controlled real submission and its Reply-To in the recipient inbox before considering delivery verified. Automated tests mock the external endpoint and send no email. Do not proxy Web3Forms through a Vercel Function: the free integration is browser-side.

## SMTP fallback environment

| Variable | Purpose |
|---|---|
| `GMAIL_USER` | Authenticated sender |
| `GMAIL_APP_PASSWORD` | Gmail application password, server-only |
| `ADMIN_EMAIL` | Sole recipient of contact messages |
| `FRONTEND_ORIGIN` | Exact production origin, including HTTPS |
| `UPSTASH_REDIS_REST_URL` | HTTPS endpoint for a dedicated Redis database |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only Redis command token |

Production deliberately returns 503 with a direct-email alternative if shared rate limiting or mail configuration is unavailable. It never silently falls back to per-process memory. Local development uses a bounded expiring in-memory store when Redis is absent. Use a dedicated database because contact keys are prefixed `portfolio:`. Preview environments should use a separate database and controlled recipient if possible.

The shared store atomically reserves submissions, limits each client IP to five attempts per hour, limits the form globally to 100 per hour, and imposes a one-minute recipient cooldown. Request records expire within 24 hours. Identifiers and submission fingerprints are hashed; message text is not stored in Redis. Hashing is pseudonymization, not anonymity.

Only owner notification mail is sent. The visitor's validated mailbox is used as `replyTo`. Automatic acknowledgement mail to user-supplied recipients has been removed. Retries keep the same request ID while the draft is unchanged. Concurrent/repeated successful requests are deduplicated; this does not make SMTP exactly-once delivery possible under every transport ambiguity or storage failure.

Vercel's trusted `x-vercel-forwarded-for` header supplies the rate-limit client address. Origin checks are an additional browser control, not authentication or a substitute for the shared limiter. See [Vercel request headers](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for) and [Upstash REST API](https://upstash.com/docs/redis/features/restapi).

## Security headers

`scripts/security.js` defines the Vercel and local-preview headers. Run `npm run sync:config` when metadata, the startup bootstrap, or the policy changes. Build/CI rejects stale `vercel.json` values, including JSON-LD and startup-script hashes. CSP starts in **report-only** mode to allow preview verification before enforcement. Frame denial and nosniff are enforced separately. Inline styles remain allowed because the existing animation components use them.

Before enforcing CSP, inspect browser violations on a preview deployment across all sections and contact states. Then change the header name in `scripts/security.js`, regenerate configuration, and repeat checks. No remote CSP collection endpoint has been configured. HTTP cache policy is immutable for fingerprinted Vite assets, with shorter revalidation for unversioned local fonts.

## Observability and privacy

The app exposes `window.__portfolioVitals` and dispatches `portfolio:vital` events for LCP, CLS, and INP using the `web-vitals` library. It dispatches sanitized `portfolio:error` events for runtime/promise errors. These are local integration hooks; no external analytics collector is enabled. Add an approved collector separately if long-term field reporting is wanted.

Contact failures log generic event names, never message text, email addresses, or SMTP credentials. Monitor function error counts, mail quota, and delivery outcomes in the deployment provider. Alert configuration, inbox retention, real-user percentiles, and provider account permissions are external operational tasks and were not configured by a local code change.

## Before production deployment

1. Configure the Web3Forms access key, or the SMTP and Redis fallback variables, in Vercel; redeploy after build-time variable changes.
2. Run `npm ci` and `npm run check`, then `npm audit --audit-level=moderate`.
3. Inspect preview security headers and report-only CSP, all responsive sections, motion controls, keyboard navigation, direct hashes, and asset/chunk failure behavior.
4. With an explicitly controlled staging mailbox, verify real notification delivery, reply-to, rate limits, and retry behavior. Local automated tests never send real mail.
5. Check physical Safari/iOS and a low-end Android device. CPU emulation is not a GPU/thermal test.
6. Monitor deployed field vitals and mail/error logs. Verify public-facing experience/availability statements with the owner rather than inventing new facts.

No deployment, commit, push, merge, or account-side modification is performed by these scripts.
