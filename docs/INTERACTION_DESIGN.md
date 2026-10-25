# Portfolio interaction design

## Introduction and content

The first ordinary visit shows a branded introduction for 3.2 seconds followed by a 420 ms fade into Home. Skip and Escape can dismiss it earlier. A small replay control sits beneath the Home actions. Repeat visits in the same tab, direct section links, reduced-motion preferences, and automatic low-power detection bypass automatic playback. The introduction does not represent download progress. Essential content remains prerendered; no-JavaScript visitors receive the static portfolio.

A synchronous head bootstrap applies a dark startup curtain before the page can paint an intermediate layout. The introduction releases it only after its dialog is ready. Repeat visits release it when the application is styled and ready, without replaying the introduction. An eight-second fallback and a script-error handler prevent application startup failure from hiding the prerendered content indefinitely. The inline bootstrap has a generated CSP hash, synchronized with `vercel.json`.

The hero emphasizes AI, machine learning, data science, and full-stack development. Identity, role text, and tagline live in `src/data/portfolioData.js`; generated metadata remains synchronized through `npm run sync:config`.

## Project browsing

Wheel and horizontal trackpad gestures operate over project cards. Deltas are normalized, and one continuous momentum gesture advances one card. A fresh gesture at either end returns control to document scrolling. Scrolling outside cards always remains ordinary page scrolling. Ctrl-wheel preserves browser zoom.

The showcase is keyboard focusable. Arrow keys work from the showcase, its controls, or the visible Projects heading; Home and End select the first and last cards. Focus stays on the showcase when switching cards so an inactive card cannot swallow subsequent key presses. Contact fields and project dialogs retain their own keyboard behavior. Dragging and explicit previous/next buttons remain available.

## Skills and artwork

Six selected skills appear initially, prioritizing Python, machine learning, model training, and full-stack tools. One disclosure button follows the cards and expands or collapses the complete selected category. There is no expansion toolbar or skip link above the grid. Category changes restore the compact view. The disclosure exposes its expanded state and preserves focus after collapse.

Long Education and Skills content stays in ordinary document flow. Desktop artwork continuously interpolates between alternating left and right positions throughout scrolling, with live crossfades between the components. Scrolling back reverses the same path. No collision mask hides the artwork mid-travel; preserving the visible choreography takes priority over eliminating occasional text overlap. Geometry is refreshed when section sizes change, including skill disclosure and education details.

The contact form ends with a left-aligned email row separated by a fine rule. Detailed data-handling information is available through the adjacent native Message privacy disclosure, instead of occupying the middle of the form by default.

`tests/portfolio-ui.mjs` exercises startup under delayed JavaScript, introduction lifecycle/focus, wheel and trackpad gestures, repeated keyboard input, document-scroll escape, bottom-only skill disclosure, contact layout, and visible artwork travel in both directions. Browser input emulation does not replace physical trackpad, assistive-technology, or low-end-device testing.
