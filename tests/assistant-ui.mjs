import assert from 'node:assert/strict'
import AxeBuilder from '@axe-core/playwright'

export async function verifyAssistant(browser, base) {
  for (const [label, width, height] of [
    ['desktop', 1440, 900],
    ['phone', 390, 844],
    ['small', 320, 640],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const requests = []
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => requests.push(request.url()))
    await page.goto(base, { waitUntil: 'networkidle' })
    assert.ok(!requests.some((url) => url.includes('/api/assistant')))
    assert.ok(!requests.some((url) => /AssistantPanel.*\.js/.test(url)), 'chat code stays lazy')
    const launcher = page.getByRole('button', { name: 'Ask about Ali', exact: true })
    await launcher.click()
    const panel = page.getByRole('dialog', { name: 'Ask about Ali', exact: true })
    await panel.waitFor({ state: 'visible' })
    const input = panel.getByRole('textbox', { name: 'Your question about Ali' })
    const dimensions = await panel.evaluate((el) => ({
      panel: el.clientHeight,
      messages: el.querySelector('.assistant-messages').clientHeight,
    }))
    assert.ok(
      dimensions.messages / dimensions.panel > 0.6,
      `${label}: conversation gets most of the panel`,
    )
    assert.equal(await input.evaluate((el) => document.activeElement === el), true)
    assert.deepEqual(
      (await new AxeBuilder({ page }).analyze()).violations.map((v) => v.id),
      [],
      `${label} assistant accessibility`,
    )
    await page.screenshot({ path: `test-results/assistant-${label}-welcome.png` })
    for (const [question, expected] of [
      ['How old is he?', /\b21\b/],
      ['What are his interests?', /vibe coding.*chess.*movies/],
      ['Do Ali does deployments in his projects?', /Cloudflare Pages/],
      ['Has Ali worked in agentic AI?', /specialized agents/],
      ['Do he work in django?', /couldn't find Django/],
    ]) {
      await input.fill(question)
      await input.press('Enter')
      assert.match(await panel.locator('.assistant-message').last().innerText(), expected)
    }
    await page.screenshot({ path: `test-results/assistant-${label}-focused-answers.png` })
    await input.fill('What services does Kryzect offer?')
    await input.press('Enter')
    assert.match(
      await panel.locator('.assistant-message').last().innerText(),
      /SaaS & Digital Products/,
    )
    await input.fill('What do they charge?')
    await input.press('Enter')
    assert.match(
      await panel.locator('.assistant-message').last().innerText(),
      /No fixed public pricing/,
    )
    await input.fill('How can I contact Ali?')
    await input.press('Enter')
    const contactAnswer = panel.locator('.assistant-message').last()
    assert.equal(
      await contactAnswer
        .getByRole('link', { name: 'Email Ali', exact: true })
        .getAttribute('href'),
      'mailto:aliamirchoudhary@gmail.com',
    )
    assert.equal(
      await contactAnswer.getByRole('link', { name: 'Call Ali', exact: true }).getAttribute('href'),
      'tel:+923283173130',
    )
    assert.ok(
      (
        await contactAnswer
          .getByRole('link', { name: 'LinkedIn', exact: true })
          .getAttribute('href')
      ).includes('/in/muhammad-ali-aamir2558'),
    )
    assert.equal(
      await contactAnswer.getByRole('link', { name: 'GitHub', exact: true }).getAttribute('href'),
      'https://github.com/aliamirchoudhary',
    )
    await panel.getByRole('button', { name: 'Clear conversation' }).click()
    await input.fill('How does IncidentIQ use RAG?')
    await input.press('Enter')
    await panel
      .locator('.assistant-message')
      .last()
      .getByText(/From the project README/)
      .waitFor()
    assert.ok(
      (await panel.locator('.assistant-sources a').first().getAttribute('href')).includes('/blob/'),
    )
    await input.fill('What about its security?')
    await input.press('Enter')
    assert.match(await panel.locator('.assistant-message').last().innerText(), /IncidentIQ/)
    await input.fill('Tell me the weather')
    await input.press('Enter')
    assert.match(
      await panel.locator('.assistant-message').last().innerText(),
      /only|questions about Ali/,
    )
    assert.ok(
      !requests.some((url) => url.includes('/api/assistant')),
      'local conversations use no API quota',
    )
    await page.screenshot({ path: `test-results/assistant-${label}-conversation.png` })
    await panel.getByRole('button', { name: 'Clear conversation' }).click()
    assert.equal(await panel.locator('.assistant-message').count(), 0)
    await panel.getByRole('checkbox', { name: 'AI conversation · I’m 18+' }).check()
    let releasePending
    const pendingGate = new Promise((resolve) => {
      releasePending = resolve
    })
    const pendingHandler = async (route) => {
      await pendingGate
      await route.abort().catch(() => {})
    }
    await page.route('**/api/assistant', pendingHandler)
    await input.fill('Explain IncidentIQ architecture.')
    await input.press('Enter')
    const stop = panel.getByRole('button', { name: 'Stop generating', exact: true })
    await stop.waitFor({ state: 'visible' })
    assert.ok(
      await stop.evaluate((el) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return (
          el.scrollWidth <= el.clientWidth && range.getBoundingClientRect().width <= el.clientWidth
        )
      }),
      `${label}: Stop text fits`,
    )
    await page.screenshot({ path: `test-results/assistant-${label}-stop-button.png` })
    await stop.click()
    await stop.waitFor({ state: 'hidden' })
    releasePending()
    await page.unroute('**/api/assistant', pendingHandler)
    await panel.getByRole('button', { name: 'Clear conversation' }).click()
    let failure = false
    await page.route('**/api/assistant', async (route) => {
      const body = route.request().postDataJSON()
      assert.equal(body.enhance, true)
      if (failure) {
        assert.equal(body.message, 'Can you simplify that?')
        assert.equal(body.projectId, 'incidentiq')
        assert.equal(body.history.length, 1)
        return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
      }
      assert.equal(body.message, 'Could any of his work help make incident reviews less painful?')
      assert.equal(body.adult, true)
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          answer:
            'IncidentIQ uses documented specialized agents and a deterministic validation gate.',
          status: 'answered',
          projectId: 'incidentiq',
          sourceIds: ['incidentiq'],
          actions: [],
          mode: 'generated',
        }),
      })
    })
    await input.fill('Could any of his work help make incident reviews less painful?')
    await input.press('Enter')
    await panel.getByText('Assistant · AI-assisted', { exact: true }).waitFor()
    await page.screenshot({ path: `test-results/assistant-${label}-ai-conversation.png` })
    failure = true
    await input.fill('Can you simplify that?')
    await input.press('Enter')
    await panel.getByText('AI unavailable · Source answers', { exact: true }).waitFor()
    assert.match(await panel.locator('.assistant-message').last().innerText(), /IncidentIQ/)
    assert.ok(
      !requests.some(
        (url) => url.includes('generativelanguage.googleapis.com') || url.includes('openrouter.ai'),
      ),
    )
    await panel.getByRole('button', { name: 'Close assistant' }).focus()
    await page.keyboard.press('Shift+Tab')
    assert.equal(await panel.evaluate((el) => el.contains(document.activeElement)), true)
    await page.keyboard.press('Escape')
    await panel.waitFor({ state: 'hidden' })
    assert.equal(await launcher.evaluate((el) => document.activeElement === el), true)
    await launcher.click()
    await panel.waitFor({ state: 'visible' })
    assert.ok((await panel.locator('.assistant-message').count()) > 0, 'history survives closing')
    await panel.getByRole('button', { name: 'Clear conversation' }).click()
    await panel.getByRole('checkbox', { name: 'AI conversation · I’m 18+' }).uncheck()
    await input.fill('Where did Ali study?')
    await input.press('Enter')
    const education = panel.getByRole('link', { name: 'Education', exact: true })
    await education.click()
    await panel.waitFor({ state: 'hidden' })
    // Closing the dialog is synchronous; navigation is scheduled for the next frame.
    await page.waitForURL((url) => url.hash === '#education')
    await page.waitForFunction(() => document.activeElement.matches('#education h2'))
    assert.equal(new URL(page.url()).hash, '#education')
    assert.ok(await page.evaluate(() => document.activeElement.matches('#education h2')))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    assert.deepEqual(errors, [], `${label}: assistant runtime errors`)
    await context.close()
    console.log(
      `Passed ${label}: lazy assistant, local knowledge, sources, scope, AI opt-in, focus, actions and accessibility`,
    )
  }
}
