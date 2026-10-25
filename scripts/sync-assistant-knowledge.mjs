import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { PROJECTS } from '../src/data/portfolioData.js'

const directory = new URL('../knowledge/snapshots/', import.meta.url)
await mkdir(directory, { recursive: true })
const repositories = new Set(['aliamirchoudhary/aliamirchoudhary'])
for (const project of PROJECTS) {
  for (const link of project.links) {
    const match = /^https:\/\/github\.com\/(aliamirchoudhary\/[^/#?]+)\/?$/.exec(link.url)
    if (match) repositories.add(match[1])
  }
}
async function github(path) {
  const response = await fetch(`https://api.github.com/repos/${path}`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-knowledge-sync' },
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw Error(`GitHub ${response.status}: ${path}`)
  if (Number(response.headers.get('content-length')) > 1_000_000) throw Error('Source too large')
  const raw = await response.text()
  if (Buffer.byteLength(raw) > 1_000_000) throw Error('Source too large')
  return JSON.parse(raw)
}
let failed = false
for (const repository of repositories) {
  const name = repository.split('/')[1]
  try {
    if (!/^[a-z0-9][a-z0-9_.-]{0,99}$/i.test(name)) throw Error('Invalid repository name')
    const data = await github(`${repository}/readme`)
    if (data.encoding !== 'base64' || data.size > 150000)
      throw Error('Unsupported or oversized README')
    const commits = await github(
      `${repository}/commits?path=${encodeURIComponent(data.path)}&per_page=1`,
    )
    const commit = commits[0]?.sha
    if (!/^[a-f0-9]{40}$/.test(commit || '')) throw Error('Missing commit provenance')
    const pinned = await github(
      `${repository}/contents/${data.path.split('/').map(encodeURIComponent).join('/')}?ref=${commit}`,
    )
    if (pinned.encoding !== 'base64' || pinned.size > 150000)
      throw Error('Unsupported pinned README')
    const text = Buffer.from(pinned.content, 'base64').toString('utf8')
    const snapshot = {
      repository,
      path: data.path,
      commit,
      blob: pinned.sha,
      url: `https://github.com/${repository}/blob/${commit}/${data.path}`,
      retrievedAt: new Date().toISOString(),
      hash: createHash('sha256').update(text).digest('hex'),
      text,
    }
    const target = new URL(`${name}.json`, directory)
    try {
      const old = JSON.parse(await readFile(target, 'utf8'))
      if (old.hash === snapshot.hash && old.commit === snapshot.commit) {
        console.log(`Unchanged: ${repository}`)
        continue
      }
    } catch {
      /* Initial import. */
    }
    await writeFile(target, JSON.stringify(snapshot, null, 2) + '\n')
    console.log(`Updated: ${repository} (${text.length} characters)`)
  } catch (error) {
    failed = true
    console.error(`Preserved previous snapshot; ${repository}: ${error.message}`)
  }
}
if (failed) process.exitCode = 1
