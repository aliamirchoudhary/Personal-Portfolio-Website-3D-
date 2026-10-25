import { readFileSync, writeFileSync } from 'node:fs'
import { vercelConfig } from './security.js'
const content = JSON.stringify(vercelConfig, null, 2) + '\n'
if (process.argv.includes('--check')) {
  if (readFileSync('vercel.json', 'utf8') !== content)
    throw new Error(
      'Run npm run sync:config after changing portfolio metadata or security headers.',
    )
} else writeFileSync('vercel.json', content)
