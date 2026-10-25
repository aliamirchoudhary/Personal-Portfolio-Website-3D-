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
    await page.route('**/api/assistant', async (route) => {
      const body = route.request().postDataJSON()
      assert.equal(body.enhance, true)
      assert.equal(body.message, 'Could any of his work help make incident reviews less painful?')
      assert.equal(body.adult, true)
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          answer:
            'IncidentIQ uses documented specialized agents and a deterministic validation gate.',
          status: 'answered',
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
    assert.equal(new URL(page.url()).hash, '#education')
    assert.ok(await page.evaluate(() => document.activeElement.matches('#education h2')))
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    await context.close()
    console.log(
      `Passed ${label}: lazy assistant, local knowledge, sources, scope, AI opt-in, focus, actions and accessibility`,
    )
  }
}
