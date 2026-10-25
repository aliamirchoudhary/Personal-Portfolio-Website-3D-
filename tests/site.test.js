import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { metadata, renderPage } from '../scripts/site-html.js'
import { vercelConfig } from '../scripts/security.js'
import { PROJECTS, TECHNICAL_SKILLS } from '../src/data/portfolioData.js'
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
