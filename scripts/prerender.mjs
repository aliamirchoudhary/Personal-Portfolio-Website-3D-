import { readFile, writeFile } from 'node:fs/promises'
import { render } from '../.ssr-temp/entry-server.js'
const path = new URL('../dist/index.html', import.meta.url)
const html = await readFile(path, 'utf8')
if (!html.includes('<!-- PORTFOLIO_STATIC_START -->'))
  throw new Error('Prerender placeholder is missing.')
await writeFile(
  path,
  html
    .replace('<div id="root">', '<div id="root" data-prerendered="true">')
    .replace(/<!-- PORTFOLIO_STATIC_START -->[\s\S]*?<!-- PORTFOLIO_STATIC_END -->/, render()),
)
console.log('Prerendered portfolio content into dist/index.html')
