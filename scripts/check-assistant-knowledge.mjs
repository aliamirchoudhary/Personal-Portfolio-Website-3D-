import { readFile } from 'node:fs/promises'
import { PROJECTS } from '../src/data/portfolioData.js'
const data = JSON.parse(
  await readFile(new URL('../.assistant-temp/knowledge.json', import.meta.url), 'utf8'),
)
for (const project of PROJECTS) {
  if (
    !data.projects.some((p) => p.id === project.id) ||
    !data.sections.some((s) => s.projectId === project.id)
  )
    throw Error(`Missing assistant coverage for ${project.id}; sync its README first.`)
}
for (const source of data.sources) {
  if (source.id === 'portfolio' && source.url === '#about') continue
  if (!/^https:\/\/github\.com\/aliamirchoudhary\/[^/]+\/blob\/[a-f0-9]{40}\//.test(source.url))
    throw Error('Untrusted knowledge source')
}
console.log(
  `Verified ${data.projects.length} projects and ${data.sources.filter((source) => source.commit).length} immutable README sources. See .assistant-temp/report.json for the documented date conflict.`,
)
