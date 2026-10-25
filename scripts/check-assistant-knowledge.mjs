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
  if (source.id === 'owner' && source.url === null && /^\d{4}-\d{2}-\d{2}$/.test(source.date))
    continue
  if (source.id === 'cv' && source.url === '/Muhammad_Ali_Aamir_Resume.pdf') continue
  if (source.id === 'kryzect-site' && source.url === 'https://kryzect.vercel.app/') continue
  if (
    source.id.startsWith('kryzect') &&
    /^https:\/\/github\.com\/Kryzect\/Kryzect-Official-Website\/blob\/[a-f0-9]{40}\/src\/data\/(services-catalog|faq|process|products|team)\.js$/.test(
      source.url,
    )
  )
    continue
  if (!/^https:\/\/github\.com\/aliamirchoudhary\/[^/]+\/blob\/[a-f0-9]{40}\//.test(source.url))
    throw Error('Untrusted knowledge source')
}
console.log(
  `Verified ${data.projects.length} projects and ${data.sources.filter((source) => source.commit).length} immutable README sources. See .assistant-temp/report.json for the documented date conflict.`,
)
