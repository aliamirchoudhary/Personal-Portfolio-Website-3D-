import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

// Transfer budgets cover the entry payload; lazy decorations are separate chunks.
const assets = await readdir('dist/assets')
const entry = assets.find((file) => /^index-.*\.js$/.test(file))
if (!entry) throw new Error('Missing production entry chunk')
const checks = [
  ['Entry JavaScript gzip', `dist/assets/${entry}`, 95_000, true],
  ['Prerendered HTML gzip', 'dist/index.html', 30_000, true],
  ['Responsive portrait', 'dist/profile-640.webp', 35_000, false],
]
for (const file of assets.filter((name) => name.endsWith('.css'))) {
  checks.push(['Stylesheet gzip', `dist/assets/${file}`, 10_000, true])
}
for (const [label, path, limit, compressed] of checks) {
  const data = await readFile(path)
  const bytes = compressed ? gzipSync(data).length : data.length
  if (bytes > limit) throw new Error(`${label}: ${bytes} bytes exceeds ${limit} (${path})`)
  console.log(`${label}: ${bytes}/${limit} bytes`)
}
