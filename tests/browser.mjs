import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4250'
const server = process.env.TEST_BASE_URL
  ? null
  : spawn(
      process.execPath,
      [
        'node_modules/vite/bin/vite.js',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        '4250',
        '--strictPort',
      ],
      { stdio: 'pipe', windowsHide: true },
    )
let browser
const results = []
const launch = { headless: true }
if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH
else if (
  process.platform === 'win32' &&
  existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe')
)
  launch.executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
await mkdir('test-results', { recursive: true })
try {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {
      // The preview process may still be starting.
    }
    if (i === 99) throw Error('Preview did not start')
    await delay(200)
  }
  browser = await chromium.launch(launch)
  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['tablet', 820, 1180],
    ['mobile', 390, 844],
    ['small', 320, 640],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } }),
      page = await context.newPage(),
      errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto(base, { waitUntil: 'networkidle' })
    assert.equal(response.status(), 200)
    await page.getByRole('heading', { level: 1, name: 'Muhammad Ali Aamir' }).waitFor()
    assert.equal(await page.locator('.main-wrap').count(), 1)
    await page.waitForTimeout(2500)
    await page.screenshot({ path: `test-results/${label}-home.png` })
    if (width <= 1024) {
      const menu = page.getByRole('button', { name: 'Open navigation menu' })
      await menu.click()
      await page.keyboard.press('Escape')
      assert.equal(await menu.getAttribute('aria-expanded'), 'false')
      await menu.click()
      await page
        .locator('.mobile-navigation')
        .getByRole('link', { name: 'Projects', exact: true })
        .click()
    } else
      await page.locator('.njx-nav').getByRole('link', { name: 'Projects', exact: true }).click()
    await page.waitForTimeout(900)
    assert.equal(new URL(page.url()).hash, '#projects')
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Featured projects')
    await page.getByRole('button', { name: /View details for Criclytics/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog.waitFor({ state: 'visible' })
    await dialog.evaluate((element) =>
      Promise.all(
        element
          .getAnimations({ subtree: true })
          .filter((animation) => animation.effect.getComputedTiming().iterations !== Infinity)
          .map((animation) => animation.finished),
      ),
    )
    assert.deepEqual(
      (await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id),
      [],
      `${label} dialog accessibility violations`,
    )
    await page.screenshot({ path: `test-results/${label}-dialog.png` })
    assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true)
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab')
    assert.equal(await dialog.evaluate((el) => el.contains(document.activeElement)), true)
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    assert.match(
      await page.evaluate(() => document.activeElement.getAttribute('aria-label')),
      /View details for Criclytics/,
    )
    await page.screenshot({ path: `test-results/${label}-projects.png` })
    for (const id of ['about', 'experience', 'education', 'skills', 'contact']) {
      await page.locator('#' + id).scrollIntoViewIfNeeded()
      await page.waitForTimeout(150)
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${label} overflow at ${id}`,
      )
      await page.screenshot({ path: `test-results/${label}-${id}.png` })
    }
    await page.route('**/send-contact', (route) =>
      route.fulfill({ status: 502, contentType: 'text/html', body: 'Gateway unavailable' }),
    )
    await page.getByLabel('Name', { exact: true }).fill('Audit Person')
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill('audit@example.com')
    await page
      .getByLabel('Message', { exact: true })
      .fill('This request is intercepted by the browser test.')
    await page.getByRole('button', { name: 'Send message', exact: true }).click()
    await page
      .getByRole('status')
      .filter({ hasText: /temporarily unavailable/ })
      .waitFor()
    assert.equal(
      await page.getByLabel('Message', { exact: true }).inputValue(),
      'This request is intercepted by the browser test.',
    )
    const violations = (await new AxeBuilder({ page }).analyze()).violations
    results.push({
      label,
      errors,
      violations: violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary, html: n.html })),
      })),
    })
    assert.deepEqual(errors, [], `${label} page errors`)
    assert.deepEqual(
      violations.map((v) => v.id),
      [],
      `${label} accessibility violations`,
    )
    await context.close()
    console.log(`Passed ${label}: layout, menu, dialog focus, contact failure, axe`)
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2200)
  for (const id of ['contact', 'about', 'skills', 'home', 'projects', 'home']) {
    await page
      .locator('#' + id)
      .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 96))
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(200)
  assert.equal(await page.locator('.slot-artwork').count(), 1)
  assert.equal(
    await page.locator('.slot-artwork').evaluate((el) => +getComputedStyle(el).opacity),
    1,
  )
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(200)
  assert.equal(await page.locator('.animated-slot').count(), 0)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.waitForTimeout(300)
  assert.equal(
    await page.locator('.slot-artwork').evaluate((el) => +getComputedStyle(el).opacity),
    1,
  )
  await page.close()
  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await reduced.goto(base, { waitUntil: 'networkidle' })
  assert.equal(await reduced.locator('[data-motion]').getAttribute('data-motion'), 'off')
  assert.equal(await reduced.locator('.inline-intro').count(), 0)
  await reduced.locator('#skills').scrollIntoViewIfNeeded()
  assert.equal(
    await reduced
      .locator('.sg-skill-card')
      .first()
      .evaluate((element) => getComputedStyle(element).opacity),
    '1',
  )
  await reduced.close()
  const broken = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await broken.route('**/assets/MorphTransitionSlot-*', (route) => route.abort())
  await broken.goto(base, { waitUntil: 'networkidle' })
  await broken.getByRole('heading', { name: 'Muhammad Ali Aamir', exact: true }).waitFor()
  await broken.getByLabel('Name', { exact: true }).waitFor({ state: 'attached' })
  await broken.close()
  const noJS = await browser.newPage({ javaScriptEnabled: false })
  await noJS.goto(base)
  assert.ok(await noJS.getByRole('heading', { level: 1, name: 'Muhammad Ali Aamir' }).isVisible())
  assert.ok((await noJS.getByRole('link', { name: 'GitHub', exact: true }).count()) >= 7)
  await noJS.close()
  console.log(
    'Passed rapid scroll, resize recovery, reduced motion, failed decoration, and no-JS content',
  )
} finally {
  await writeFile('test-results/browser-results.json', JSON.stringify(results, null, 2))
  await browser?.close()
  server?.kill()
}
