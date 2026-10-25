import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import {
  PERSONAL,
  PROJECTS,
  EDUCATION,
  EXPERIENCE,
  ABOUT_TEXT,
  SERVICES,
  TECHNICAL_SKILLS,
} from '../src/data/portfolioData.js'

export function plainMarkdown(text, keepCode = false) {
  return text
    .replace(/\r/g, '')
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => (keepCode ? code : ''))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[*`]/g, '')
    .replace(/^[\s|:-]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
const output = new URL('../.assistant-temp/', import.meta.url)
await mkdir(output, { recursive: true })
const sources = [],
  projects = [],
  sections = []
sources.push({ id: 'portfolio', label: 'Portfolio background', url: '#about' })
const conflicts = [
  'Kryzect: CV lists 2024; website and GitHub profile list August 2026. Ask Ali to confirm the start date.',
]
const manifest = JSON.parse(
  await readFile(new URL('../knowledge/sources.json', import.meta.url), 'utf8'),
)
const profile = JSON.parse(
  await readFile(new URL('../knowledge/snapshots/aliamirchoudhary.json', import.meta.url), 'utf8'),
)
function validate(snapshot) {
  const blob = createHash('sha1')
    .update(
      Buffer.concat([
        Buffer.from(`blob ${Buffer.byteLength(snapshot.text)}\0`),
        Buffer.from(snapshot.text),
      ]),
    )
    .digest('hex')
  if (
    !/^[a-f0-9]{40}$/.test(snapshot.commit) ||
    blob !== snapshot.blob ||
    createHash('sha256').update(snapshot.text).digest('hex') !== snapshot.hash
  )
    throw Error(`Invalid snapshot provenance: ${snapshot.repository}`)
}
validate(profile)
sources.push({
  id: 'profile',
  label: 'GitHub profile README',
  url: profile.url,
  date: profile.retrievedAt.slice(0, 10),
  commit: profile.commit,
})
const profileText = plainMarkdown(profile.text, true)
for (const [i, chunk] of profileText.split(/\n(?=## )/).entries()) {
  if (chunk.length > 80)
    sections.push({
      id: `profile:${i}`,
      projectId: null,
      sourceId: 'profile',
      title: 'Profile README',
      text: chunk.slice(0, 3500),
    })
}
for (const project of PROJECTS) {
  const repo = project.links
    .find((link) => link.label === 'GitHub')
    ?.url.split('/')
    .at(-1)
  if (!repo) throw Error(`Missing repository: ${project.id}`)
  const snapshot = JSON.parse(
    await readFile(new URL(`../knowledge/snapshots/${repo}.json`, import.meta.url), 'utf8'),
  )
  validate(snapshot)
  const sourceId = project.id
  sources.push({
    id: sourceId,
    label: `${project.name} README`,
    url: snapshot.url,
    date: snapshot.retrievedAt.slice(0, 10),
    commit: snapshot.commit,
  })
  const text = plainMarkdown(snapshot.text)
  const blocks = text.split(/\n(?=#{1,6} )/)
  let count = 0
  for (const block of blocks) {
    const heading = block
      .split('\n')[0]
      .replace(/^#+\s*/, '')
      .trim()
    if (
      /contents|quick.?start|install|prerequisite|environment|deployment|contribut|license|author|team|github stats|next steps|api keys/i.test(
        heading,
      )
    )
      continue
    for (const paragraph of block.split(/\n\n/)) {
      const value = paragraph.replace(/^#+\s*/gm, '').trim()
      if (value.length < 45 || !/[a-z]{4}/i.test(value) || /^[-|\s]+$/.test(value)) continue
      sections.push({
        id: `${project.id}:${count++}`,
        projectId: project.id,
        sourceId,
        title: heading || project.name,
        text: value.slice(0, 2200),
      })
    }
  }
  projects.push({
    id: project.id,
    name: project.name,
    summary: project.description,
    tags: project.tags,
    links: project.links.map(({ label, url }) => ({ label, url })),
    aliases: manifest.aliases[project.id] || [],
    remoteApproved: manifest.reviewedHashes[project.id] === snapshot.hash,
  })
}
const data = {
  version: '',
  sources,
  projects,
  sections,
  conflicts,
  profile: {
    name: PERSONAL.name,
    title: PERSONAL.title,
    location: PERSONAL.location,
    email: PERSONAL.email,
    resume: PERSONAL.resumeUrl,
    availability: PERSONAL.availability,
    about: ABOUT_TEXT.slice(0, 2),
    languages: PERSONAL.languages,
    skills: TECHNICAL_SKILLS.map((skill) => skill.name),
    education: EDUCATION,
    experience: EXPERIENCE,
    services: SERVICES,
  },
}
data.version = createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
await writeFile(new URL('knowledge.json', output), JSON.stringify(data) + '\n')
await writeFile(
  new URL('report.json', output),
  JSON.stringify(
    {
      version: data.version,
      projects: projects.length,
      sources: sources.length,
      sections: sections.length,
      conflicts,
    },
    null,
    2,
  ) + '\n',
)
console.log(
  `Assistant knowledge ${data.version}: ${projects.length} projects, ${sources.length} sources, ${sections.length} sections; ${conflicts.length} documented date conflict.`,
)
