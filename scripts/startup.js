import { INTRO_SESSION_KEY, INTRO_STARTUP_FALLBACK } from '../shared/intro.js'

// Inline, synchronous head bootstrap: keep the prerendered page behind a curtain
// until the first-visit introduction is ready. A failed app can never hide it forever.
export const startupScript = `(() => {
  const root = document.documentElement;
  const release = () => { delete root.dataset.introPending; delete root.dataset.appPending; };
  const lowPower = navigator.connection?.saveData ||
    (navigator.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || lowPower ||
      (location.hash && location.hash !== '#home')) return;
  root.dataset.appPending = 'true';
  setTimeout(release, ${INTRO_STARTUP_FALLBACK});
  window.addEventListener('error', release, { once: true });
  try { if (sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})) return; } catch {}
  root.dataset.introPending = 'true';
})();`
