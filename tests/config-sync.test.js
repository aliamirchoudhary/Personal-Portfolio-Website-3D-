import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { vercelConfig } from '../scripts/security.js'

test('configuration checks tolerate formatting and key order but reject deployment drift', () => {
  const directory = mkdtempSync(join(tmpdir(), 'portfolio-config-'))
  const script = fileURLToPath(new URL('../scripts/sync-config.mjs', import.meta.url))
  const check = () =>
    execFileSync(process.execPath, [script, '--check'], { cwd: directory, stdio: 'pipe' })
  try {
    const reordered = Object.fromEntries(Object.entries(vercelConfig).reverse())
    for (const text of [
      JSON.stringify(reordered),
      JSON.stringify(reordered, null, 4).replace(/\n/g, '\r\n') + '\r\n\r\n',
    ]) {
      writeFileSync(join(directory, 'vercel.json'), text)
      assert.doesNotThrow(check)
    }
    const changed = structuredClone(vercelConfig)
    changed.headers[0].headers[0].value = 'unsafe-change'
    writeFileSync(join(directory, 'vercel.json'), JSON.stringify(changed))
    assert.throws(check, (error) =>
      /differs from generated configuration in: headers/.test(error.stderr.toString()),
    )
    changed.headers = vercelConfig.headers
    changed.functions['api/assistant.js'].includeFiles = 'wrong-file.json'
    writeFileSync(join(directory, 'vercel.json'), JSON.stringify(changed))
    assert.throws(check, (error) => /configuration in: functions/.test(error.stderr.toString()))
  } finally {
    assert.equal(
      dirname(directory),
      resolve(tmpdir()),
      'cleanup stays in the test temporary directory',
    )
    rmSync(directory, { recursive: true, force: true })
  }
})
