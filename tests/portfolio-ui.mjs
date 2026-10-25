import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { INTRO_SESSION_KEY } from '../shared/intro.js'

export async function verifyPortfolioUi(browser, base) {
  const introContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await introContext.addInitScript(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
    Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 })
  })
  try {
    const page = await introContext.newPage()
    await page.clock.install()
    await page.route('**/assets/index-*.js', async (route) => {
      await delay(800)
      await route.continue()
    })
    await page.goto(base, { waitUntil: 'commit' })
    await page.locator('#root').waitFor({ state: 'attached' })
    assert.equal(await page.evaluate(() => document.documentElement.dataset.introPending), 'true')
    assert.equal(
      await page.locator('#root').evaluate((el) => getComputedStyle(el).visibility),
      'hidden',
    )
    await page.screenshot({ path: 'test-results/followup-startup-curtain.png' })
    const intro = page.getByRole('dialog', { name: /Welcome to Muhammad Ali Aamir/ })
    await intro.waitFor({ state: 'visible' })
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.introPending),
      undefined,
    )
    await page.clock.pauseAt(await page.evaluate(() => Date.now() + 700))
    assert.equal(
      await intro
        .getByRole('button', { name: 'Skip introduction' })
        .evaluate((el) => el === document.activeElement),
      true,
    )
    await page.keyboard.press('Tab')
    assert.equal(
      await intro
        .getByRole('button', { name: 'Skip introduction' })
        .evaluate((el) => el === document.activeElement),
      true,
    )
    await page.screenshot({ path: 'test-results/followup-intro.png' })
    await intro.getByRole('button', { name: 'Skip introduction' }).evaluate((el) => el.click())
    await page.clock.resume()
    await intro.waitFor({ state: 'hidden' })
    const replay = page.locator('#home').getByRole('button', { name: 'Replay introduction' })
    await replay.scrollIntoViewIfNeeded()
    const before = await page.evaluate(() => scrollY)
    await replay.click()
    await intro.waitFor({ state: 'visible' })
    await page.keyboard.press('Escape')
    await intro.waitFor({ state: 'hidden' })
    assert.equal(await replay.evaluate((el) => el === document.activeElement), true)
    assert.ok(Math.abs((await page.evaluate(() => scrollY)) - before) < 2)
    await page.reload({ waitUntil: 'networkidle' })
    assert.equal(await page.locator('.brand-intro[open]').count(), 0)
    await page.evaluate((key) => sessionStorage.removeItem(key), INTRO_SESSION_KEY)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await intro.waitFor({ state: 'visible' })
    const departure = await intro.locator('.lpf-root').boundingBox()
    await page.locator('.brand-intro[data-transferring="true"]').waitFor()
    const { travelling, destination } = await intro.evaluate((node) => {
      const portrait = node.querySelector('.lpf-root')
      const movement = portrait.getAnimations().find((animation) => !('animationName' in animation))
      // Inspect a precise animation frame; browser/test-clock scheduling can otherwise
      // advance this short transition beyond its intermediate position.
      movement.pause()
      movement.currentTime = 250
      const travelling = portrait.getBoundingClientRect().toJSON()
      const destination = document
        .querySelector('.home-artwork [data-home-portrait]')
        .getBoundingClientRect()
        .toJSON()
      movement.play()
      return { travelling, destination }
    })
    assert.ok(travelling.x > departure.x + 10, 'portrait must travel from center toward Home')
    assert.ok(
      travelling.x < destination.x - 10,
      'portrait must pass through intermediate positions',
    )
    assert.equal(await intro.evaluate((el) => getComputedStyle(el).opacity), '1')
    await page.screenshot({ path: 'test-results/followup-intro-handoff.png' })
    await intro.waitFor({ state: 'hidden', timeout: 5000 })
    assert.equal(
      await page.locator('body').evaluate((el) => el.classList.contains('intro-transfer')),
      false,
    )
    assert.equal(
      await page
        .locator('.home-artwork [data-home-portrait]')
        .evaluate((el) => getComputedStyle(el).opacity),
      '1',
    )
  } finally {
    await introContext.close()
  }

  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['mobile', 390, 844],
  ]) {
    const context = await browser.newContext({ viewport: { width, height } })
    await context.addInitScript((key) => sessionStorage.setItem(key, 'seen'), INTRO_SESSION_KEY)
    try {
      const page = await context.newPage()
      await page.goto(base, { waitUntil: 'networkidle' })
      const carousel = page.getByRole('region', { name: 'Project showcase' })
      const current = page.locator('.project-card.is-current')
      const title = () => current.locator('h3').innerText()
      const first = await title()
      await page.locator('#projects h2').evaluate((el) => {
        el.focus({ preventScroll: true })
        el.scrollIntoView({ block: 'start' })
      })
      await page.keyboard.press('ArrowRight')
      assert.equal(await title(), first, 'section focus must not select the carousel')
      await carousel.focus()
      await page.keyboard.press('ArrowRight')
      assert.notEqual(await title(), first)
      await page.keyboard.press('Home')
      assert.equal(await title(), first)
      await carousel.focus()
      await page.keyboard.press('Tab')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('ArrowRight')
      await page.keyboard.press('Home')
      assert.equal(await title(), first)
      await current.hover()
      const y = await page.evaluate(() => scrollY)
      await page.mouse.wheel(0, 100)
      await page.waitForTimeout(60)
      const second = await title()
      assert.notEqual(second, first)
      await page.mouse.wheel(0, 8)
      await page.mouse.wheel(0, 8)
      await page.waitForTimeout(60)
      assert.equal(await title(), second, 'momentum must not skip several cards')
      assert.ok(Math.abs((await page.evaluate(() => scrollY)) - y) < 2)
      await page.waitForTimeout(220)
      await page.mouse.wheel(45, 0)
      await page.waitForTimeout(80)
      assert.notEqual(await title(), second, 'horizontal trackpad gesture')
      await page.keyboard.press('End')
      await current.hover()
      await page.waitForTimeout(220)
      const edgeY = await page.evaluate(() => scrollY)
      await page.mouse.wheel(0, 160)
      await page.waitForFunction((before) => scrollY > before + 10, edgeY, { timeout: 2000 })
      assert.ok((await page.evaluate(() => scrollY)) > edgeY + 10, 'wheel can leave the last card')
      await carousel.focus()
      await page.keyboard.press('Home')
      assert.equal(await title(), first)

      await page.getByRole('textbox', { name: 'Email', exact: true }).focus()
      await page.keyboard.press('ArrowRight')
      assert.equal(await title(), first, 'carousel must not handle keys in contact fields')

      const skills = page.locator('#skills')
      await skills.scrollIntoViewIfNeeded()
      assert.equal(await skills.locator('.sg-skill-card').count(), 6)
      assert.equal(await skills.getByRole('link', { name: 'Skip to projects' }).count(), 0)
      const showMore = skills.getByRole('button', { name: 'Show all 14 skills' })
      assert.ok(
        (await showMore.boundingBox()).y >=
          (await skills.locator('.sg-skill-card').last().boundingBox()).y,
      )
      await skills.getByRole('button', { name: 'Show all 14 skills' }).click()
      assert.equal(await skills.locator('.sg-skill-card').count(), 14)
      await skills.getByRole('button', { name: 'Show fewer skills' }).last().click()
      assert.equal(await skills.locator('.sg-skill-card').count(), 6)
      await skills.getByRole('button', { name: 'Professional Skills', exact: true }).click()
      assert.equal(await skills.locator('.sg-skill-card').count(), 6)
      await skills.getByRole('button', { name: 'Show all 7 skills' }).click()
      assert.equal(await skills.locator('.sg-skill-card').count(), 7)
      await skills.getByRole('button', { name: 'Technical Skills', exact: true }).click()
      assert.equal(await skills.locator('.sg-skill-card').count(), 6)
      const contactFooter = page.locator('.contact-form-footer')
      assert.equal(await contactFooter.evaluate((el) => getComputedStyle(el).textAlign), 'left')
      assert.equal(await contactFooter.locator('details').getAttribute('open'), null)
      await contactFooter.getByText('Message privacy', { exact: true }).click()
      assert.equal(await contactFooter.locator('details').getAttribute('open'), '')
      await contactFooter.getByText('Message privacy', { exact: true }).click()
      await page.getByRole('link', { name: 'View projects', exact: true }).click()
      assert.equal(new URL(page.url()).hash, '#projects')
      assert.equal(
        await page.evaluate(() => document.activeElement.textContent),
        'Featured projects',
      )
      await page.waitForTimeout(800)
      await page.screenshot({ path: `test-results/followup-${label}-projects.png` })
      if (width > 1024) {
        const samples = []
        const ends = await page.evaluate(() =>
          ['education', 'skills', 'projects'].map(
            (id) => document.getElementById(id).getBoundingClientRect().top + scrollY - 96,
          ),
        )
        for (const [direction, steps] of [
          ['down', Array.from({ length: 25 }, (_, i) => i)],
          ['up', Array.from({ length: 25 }, (_, i) => 24 - i)],
        ])
          for (const i of steps) {
            await page.evaluate(
              (value) => scrollTo({ top: value, behavior: 'instant' }),
              ends[0] + ((ends[2] - ends[0]) * i) / 24,
            )
            await page.waitForTimeout(45)
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
            )
            const sample = await page.evaluate(() => {
              const art = [...document.querySelectorAll('.slot-artwork')].map((el) => {
                const opacity = +getComputedStyle(el).opacity
                return {
                  section: el.dataset.section,
                  opacity,
                  mounted: el.children.length > 0,
                }
              })
              return {
                y: scrollY,
                x: document.querySelector('.animated-slot').getBoundingClientRect().left,
                width: innerWidth,
                art,
              }
            })
            samples.push(sample)
            const section = sample.y < ends[1] ? 0 : 1
            const phase = Math.max(
              0,
              Math.min(1, (sample.y - ends[section]) / (ends[section + 1] - ends[section])),
            )
            const right = sample.width - Math.min(460, sample.width * 0.36) - 24
            const expected =
              section === 0 ? right + (24 - right) * phase : 24 + (right - 24) * phase
            assert.ok(
              Math.abs(sample.x - expected) < 2,
              `continuous ${direction} travel at ${sample.y}`,
            )
            assert.ok(
              sample.art.reduce((sum, art) => sum + art.opacity, 0) > 0.99,
              'artwork must remain visible while crossing',
            )
            if (phase > 0.1 && phase < 0.9)
              assert.ok(
                sample.art.every((art) => art.mounted),
                'both live components must be present mid-transition',
              )
            if (i % 6 === 0)
              await page.screenshot({
                path: `test-results/followup-transition-${direction}-${i}.png`,
              })
          }
        await writeFile('test-results/followup-motion.json', JSON.stringify(samples, null, 2))
      }
      console.log(
        `Passed ${label}: carousel controls, bottom-only skills disclosure, contact footer and continuous artwork travel`,
      )
    } finally {
      await context.close()
    }
  }
  console.log(
    'Passed first-visit intro, skip, timeout, focus restoration, replay and repeat-session skip',
  )
}
