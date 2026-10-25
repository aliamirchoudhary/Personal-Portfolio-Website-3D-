import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { metadata, renderPage } from '../scripts/site-html.js'
import { vercelConfig } from '../scripts/security.js'
import { PROJECTS, TECHNICAL_SKILLS } from '../src/data/portfolioData.js'
import { createHash } from 'node:crypto'
import { runInNewContext } from 'node:vm'
import { startupScript } from '../scripts/startup.js'
test('metadata, fallback, project details, and security policy share the portfolio data', () => {
  const html = renderPage('<!-- PORTFOLIO_METADATA --><!-- PORTFOLIO_CONTENT -->')
  for (const project of PROJECTS) {
    assert.ok(html.includes(project.name))
    assert.ok(project.details.length > 0, project.id)
  }
  assert.equal(TECHNICAL_SKILLS.filter((skill) => skill.name === 'Python').length, 1)
  assert.ok(metadata().includes('application/ld+json'))
  assert.deepEqual(JSON.parse(readFileSync('vercel.json', 'utf8')), vercelConfig)
  const report = vercelConfig.headers[0].headers.find(
    (header) => header.key === 'Content-Security-Policy-Report-Only',
  )
  assert.ok(report.value.includes("object-src 'none'"))
})

test('startup curtain respects preferences and recovers when application startup fails', () => {
  const run = ({ reduced = false, seen = false, hash = '', cores = 8 } = {}) => {
    const dataset = {},
      timers = [],
      errors = []
    runInNewContext(startupScript, {
      document: { documentElement: { dataset } },
      navigator: { hardwareConcurrency: cores, deviceMemory: 8 },
      location: { hash },
      matchMedia: () => ({ matches: reduced }),
      sessionStorage: { getItem: () => seen },
      setTimeout: (callback) => timers.push(callback),
      window: { addEventListener: (_, callback) => errors.push(callback) },
    })
    return { dataset, timers, errors }
  }
  const pending = run()
  assert.equal(pending.dataset.introPending, 'true')
  pending.timers[0]()
  assert.equal(pending.dataset.introPending, undefined)
  assert.equal(pending.dataset.appPending, undefined)
  const failed = run()
  failed.errors[0]()
  assert.equal(failed.dataset.introPending, undefined)
  assert.equal(failed.dataset.appPending, undefined)
  const repeat = run({ seen: true })
  assert.equal(repeat.dataset.appPending, 'true')
  repeat.timers[0]()
  assert.equal(repeat.dataset.appPending, undefined)
  for (const options of [{ reduced: true }, { seen: true }, { hash: '#projects' }, { cores: 2 }])
    assert.equal(run(options).dataset.introPending, undefined)
  const html = renderPage(readFileSync('index.html', 'utf8'))
  assert.ok(html.includes(`<script>${startupScript}</script>`))
  const hash = createHash('sha256').update(startupScript).digest('base64')
  assert.ok(
    vercelConfig.headers[0].headers
      .find((header) => header.key === 'Content-Security-Policy-Report-Only')
      .value.includes(`'sha256-${hash}'`),
  )
})
