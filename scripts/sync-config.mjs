import { readFileSync, writeFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { vercelConfig } from './security.js'
const content = JSON.stringify(vercelConfig, null, 2) + '\n'
if (process.argv.includes('--check')) {
  const actual = JSON.parse(readFileSync('vercel.json', 'utf8'))
  // JSON formatting and property order do not change deployment configuration.
  if (!isDeepStrictEqual(actual, vercelConfig)) {
    const changed = [...new Set([...Object.keys(actual), ...Object.keys(vercelConfig)])].filter(
      (key) => !isDeepStrictEqual(actual[key], vercelConfig[key]),
    )
    throw new Error(
      `vercel.json differs from generated configuration in: ${changed.join(', ')}. Run npm run sync:config after changing portfolio metadata or security headers.`,
    )
  }
} else writeFileSync('vercel.json', content)
