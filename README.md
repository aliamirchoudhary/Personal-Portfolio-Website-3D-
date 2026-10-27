# Muhammad Ali Aamir — Portfolio

An animated portfolio focused on AI, machine learning, data science, and full-stack development, built with React, Vite, CSS 3D, Canvas, and SVG. The purple/cyan desktop artwork alternates sides as visitors scroll; mobile renders each animation in its own section.

Live site: https://ali-aamir-portfolio.vercel.app/

## Run locally

Use Node 24.15.0 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Configure `VITE_WEB3FORMS_ACCESS_KEY` using `.env.example` for free browser-side contact delivery, or configure SMTP and Redis for the server fallback. Automated tests mock delivery. See [operations and deployment](docs/OPERATIONS.md).

## Checks and build

```sh
npm run check
npm audit --audit-level=moderate
```

`check` runs lint, backend/content tests, a prerendered production build, and browser/accessibility regressions. Browser tests use installed Google Chrome on Windows, or a Playwright Chromium browser elsewhere. CI installs Chromium; local Windows checks reuse Chrome and do not download a browser. `CHROME_PATH` can select another executable.

`npm run build` writes deployable static assets into `dist/` and a temporary rendering bundle into ignored `.ssr-temp/`. `npm run preview` serves the frontend only. The build includes readable React HTML before JavaScript, then hydrates it in the browser. A separate generated no-JavaScript fallback shares the same content records.

## Architecture

- `src/data/portfolioData.js`: identity, links, skills, education, experience, and project records.
- `src/data/projectDetails.js`: structured project detail blocks, rendered without HTML injection.
- `src/context/motion.js` and `MotionContext.jsx`: responsive mode, reduced motion, visibility, and user pause preferences.
- `src/components/shared/MorphTransitionSlot.jsx`: cached section geometry and deterministic scroll-driven placement/crossfades. It mounts only the needed artwork and recovers from rapid scroll/resize changes without GSAP.
- `src/components/animated/`: individual CSS/SVG/canvas animations with visibility-aware lifecycle behavior.
- `src/components/ui/`: accessible project dialog/carousel, contact form, skills grid, and brand artwork.
- `shared/contact.js`: common bounded validation used by client and server.
- `server/`: serverless-safe abuse protection and owner-only SMTP delivery.
- `scripts/`: metadata, headers, prerendering, and local API integration.
- `tests/`: backend, metadata, keyboard, responsive, accessibility, and failure-path regression checks.

Fonts and technology icons are self-hosted with license copies in `public/fonts/` and `public/tech/`. Portrait variants are optimized WebP files. Essential content renders immediately; the short first-visit intro is decorative and does not gate access. Reduced motion and the footer pause control disable motion across CSS and JavaScript components.

## Content and security changes

Update shared data rather than duplicating text across section components. Run `npm run sync:config` when metadata changes so CSP hashes stay synchronized. Keep credentials in ignored environment files or provider secrets. The public form never sends automatic email to arbitrary visitors.

See the [audit and remediation records](docs/audits/README.md) for baseline findings, implementation evidence, measurement limitations, and remaining acceptance work. Workstation-specific cleanup tracking is kept locally and is not part of the repository.

See [interaction design](docs/INTERACTION_DESIGN.md) for introduction behavior, carousel controls, skill disclosure, and artwork transitions.

The bottom-right portfolio assistant answers from public project README snapshots and shared portfolio records. It works without an API key and lazy-loads on open. Enable **AI conversation · I’m 18+** in the chat for natural questions, comparisons, and contextual follow-ups after configuring the server. Gemini is primary when eligible, with verified free OpenRouter and local answers as fallbacks. See [assistant operations](docs/ASSISTANT_OPERATIONS.md) for setup, privacy, limits, and knowledge updates.

## License

Application code is covered by [LICENSE](LICENSE). Third-party fonts and icons retain their respective included licenses. Portfolio text, portrait, and personal identity assets belong to their owner.
