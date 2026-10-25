import { focusedAnswer, expandQuestion } from './assistant-understanding.js'
import { companyAnswer, personalContactAnswer } from './assistant-company.js'
export const ASSISTANT_LIMITS = { message: 1000, body: 16384, output: 4000 }
export const SUGGESTIONS = [
  'Which AI projects has Ali built?',
  'How does IncidentIQ work?',
  'Tell me about his experience.',
  'How can I contact Ali?',
]
const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^a-z0-9+#. ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const words = (value) =>
  normalize(value)
    .split(' ')
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          'the',
          'and',
          'does',
          'what',
          'how',
          'his',
          'ali',
          'about',
          'that',
          'this',
          'with',
          'tell',
          'more',
          'project',
          'projects',
          'work',
          'aamir',
          'please',
          'explain',
          'would',
          'could',
          'have',
          'from',
          'they',
          'their',
          'which',
        ].includes(word),
    )
const offTopic =
  /\b(weather|president|politics|recipe|joke|poem|lyrics|horoscope|bitcoin|stock price|football|cricket score|latest news|teach me|write (?:me )?(?:a |an )?(?:essay|code|script)|solve|calculate)\b/i
export function selectProject(message, knowledge, previous) {
  const text = normalize(message)
  const matches = knowledge.projects.filter((p) =>
    [p.name, ...p.aliases].some((alias) => text.includes(normalize(alias))),
  )
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) return null
  return /\b(it|its|that|this|more|simpler|simplify|shorter|proof|architecture|backend|frontend|security|limitations|challenges|stack|dataset|accuracy|model|rag|how|why)\b/.test(
    text,
  )
    ? knowledge.projects.find((p) => p.id === previous)
    : undefined
}
export function inferTask(message) {
  const text = normalize(message)
  if (/limit|drawback|weakness|improv/.test(text)) return 'limitations'
  if (/secur|privacy|auth|validat|review/.test(text)) return 'security'
  if (/accuracy|result|perform|metric|dataset|train/.test(text)) return 'results'
  if (/stack|technolog|language|built with|tools/.test(text)) return 'stack'
  if (/architect|backend|frontend|how|pipeline|rag|design|work/.test(text)) return 'architecture'
  if (/challeng|problem|decision/.test(text)) return 'challenges'
  return 'summary'
}
export function retrieve(message, project, knowledge, limit = 3) {
  const query = words(expandQuestion(message) + ' ' + inferTask(message))
  const pool = knowledge.sections.filter((s) => s.projectId === project.id)
  return pool
    .map((s, index) => ({
      s,
      score: query.reduce(
        (sum, word) =>
          sum +
          (normalize(s.title).includes(word) ? 5 : 0) +
          (normalize(s.text).includes(word) ? 2 : 0),
        0,
      ),
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ s }) => s)
}
function cleanExcerpt(text) {
  return text
    .split('\n')
    .map((line) =>
      line
        .replace(/^\s*[>|#-]+\s*/, '')
        .replace(/\|/g, ' · ')
        .trim(),
    )
    .filter(Boolean)
    .join('\n')
    .slice(0, 1100)
}
export function answerLocal(message, knowledge, previous, subject) {
  const questions = String(message)
    .split(/\?\s+|\s+and\s+(?=(?:does|is|has|what|where|how|can|do)\b)/i)
    .map((value) => value.trim())
    .filter(Boolean)
  if (questions.length > 1 && questions.length <= 3) {
    const answers = questions.map((question) => answerLocal(question, knowledge, previous, subject))
    return {
      answer: answers.map((item) => item.answer).join('\n\n'),
      status: answers.some((item) => item.status === 'answered')
        ? 'answered'
        : answers.every((item) => item.status === 'off_topic')
          ? 'off_topic'
          : 'unknown',
      sourceIds: [...new Set(answers.flatMap((item) => item.sourceIds))],
      projectId: answers.at(-1).projectId,
      actions: [
        ...new Map(
          answers.flatMap((item) => item.actions || []).map((action) => [action.id, action]),
        ).values(),
      ].slice(0, 4),
      focused: answers.every((item) => item.focused),
      skipAI: answers.every((item) => item.skipAI || (item.focused && item.status === 'unknown')),
      mode: 'local',
      version: knowledge.version,
    }
  }
  const text = normalize(message),
    profile = knowledge.profile
  const result = (answer, status = 'answered', sourceIds = [], projectId = null, actions = []) => ({
    answer,
    status,
    sourceIds: sourceIds.includes('profile') ? ['portfolio', ...sourceIds] : sourceIds,
    projectId,
    actions,
    mode: 'local',
    version: knowledge.version,
  })
  const unknown = () =>
    result(
      "I don't have that information in Ali's public portfolio. You can contact him directly.",
      'unknown',
      [],
      null,
      [{ id: 'contact', label: 'Contact Ali' }],
    )
  if (!text)
    return result('What would you like to know about Ali or his projects?', 'clarification')
  if (
    /ignore.*instruct|system prompt|developer message|pretend|act as|jailbreak|base64|override|forget.*rules/.test(
      text,
    )
  )
    return result(
      'I can help with questions about Ali and his work. What would you like to know?',
      'off_topic',
    )
  if (/^(hi|hey|hello|salam|assalam|aoa|thanks|thank you|good morning)[.! ]*$/.test(text))
    return result(
      "Hi! I'm Ali's portfolio assistant. Ask me about his projects, experience, skills, or background.",
    )
  if (!offTopic.test(text)) {
    const scoped =
      companyAnswer(message, knowledge, subject) || personalContactAnswer(message, knowledge)
    if (scoped) return scoped
  }
  const focused = offTopic.test(text) ? null : focusedAnswer(message, knowledge, previous)
  if (focused)
    return {
      ...focused,
      sourceIds: focused.sourceIds.includes('profile')
        ? ['portfolio', ...focused.sourceIds]
        : focused.sourceIds,
    }
  if (
    /salary|married|religion|home address|password|secret|api key|private|birth|\bage\b|family|girlfriend|net worth|client names/.test(
      text,
    )
  )
    return unknown()
  if (offTopic.test(text))
    return result(
      'I can help with questions about Ali and his work. What would you like to know?',
      'off_topic',
    )
  if (/contact|email|reach|hire|freelanc|available|availability/.test(text))
    return result(
      `Ali's portfolio lists him as ${profile.availability.toLowerCase()}. You can email ${profile.email} to discuss a project or opportunity. He can confirm availability and terms directly.`,
      'answered',
      ['profile'],
      null,
      [{ id: 'contact', label: 'Contact Ali' }],
    )
  if (/resume|\bcv\b/.test(text))
    return result(
      'You can download Ali’s current CV for his education, experience, and selected projects.',
      'answered',
      ['profile'],
      null,
      [{ id: 'resume', label: 'Download CV' }],
    )
  if (/programming languages|coding languages/.test(text))
    return result(`His CV lists ${profile.skillGroups.Programming.join(', ')}.`, 'answered', ['cv'])
  if (/spoken languages|languages.*speak|speak|urdu|punjabi|english/.test(text))
    return result(profile.languages, 'answered', ['profile'])
  if (/mathemat|maths|calculus|algebra|coursework|courses|subjects/.test(text))
    return result(
      `Ali's published coursework includes: ${[...new Set(profile.education.flatMap((entry) => entry.courses || []))].join(', ')}.`,
      'answered',
      ['profile'],
      null,
      [{ id: 'education', label: 'Education' }],
    )
  if (/skills|know c\+\+|programming languages|proficiency/.test(text))
    return result(
      `Ali's listed technical skills include ${profile.skills.join(', ')}. Skill percentages in public profiles are self-assessments, not independent certifications.`,
      'answered',
      ['profile'],
      null,
      [{ id: 'skills', label: 'Skills' }],
    )
  if (/kryzect/.test(text) && /when|start|found|date|year/.test(text))
    return result(
      'The public sources disagree on Kryzect’s start date: the CV lists 2024, while the portfolio and GitHub profile list August 2026. Ali can confirm the correct date.',
      'unknown',
      ['profile'],
    )
  if (
    /education|university|degree|study|studying|college|fast|graduate|graduation|taleem/.test(text)
  )
    return result(
      `Ali's published education:\n\n${profile.education.map((entry) => `${entry.degree} — ${entry.institution} (${entry.year})`).join('\n')}`,
      'answered',
      ['profile'],
      null,
      [{ id: 'education', label: 'Education' }],
    )
  if (/experience|intern|vertekx|exaverse|career/.test(text))
    return result(
      `Ali's published experience:\n\n${profile.experience.map((entry) => `${entry.role} at ${entry.company}${entry.company === 'Kryzect' ? ' (start date awaiting confirmation)' : ` (${entry.year})`}`).join('\n')}\n\nHis work spans serverless applications, AI/document pipelines, and full-stack delivery. Dates reflect published records, not live employment verification.`,
      'answered',
      ['profile'],
      null,
      [{ id: 'experience', label: 'Experience' }],
    )
  if (/kryzect|services|business|company/.test(text))
    return result(
      'Ali founded Kryzect, a software engineering and AI brand focused on full-stack web and mobile solutions, AI product engineering, and end-to-end delivery. Contact him to discuss a specific scope.',
      'answered',
      ['profile'],
      null,
      [{ id: 'kryzect', label: 'Explore Kryzect' }],
    )
  const project = selectProject(message, knowledge, previous)
  if (project === null || /compare|difference between|versus|\bvs\b/.test(text))
    return result(
      'Which project would you like to explore first? I can explain each project using its published README.',
      'clarification',
      [],
      null,
      knowledge.projects.slice(0, 4).map((p) => ({ id: `project:${p.id}`, label: p.name })),
    )
  if (project) {
    const task = inferTask(message)
    if (/when|date|year|how long|client|revenue|users|cost|price|who.*team|contribution/.test(text))
      return unknown()
    const selected = retrieve(message, project, knowledge)
    const specific = task !== 'summary'
    const excerpt = specific
      ? selected
          .slice(0, 2)
          .map((s) => `${s.title}\n${cleanExcerpt(s.text)}`)
          .join('\n\n')
      : ''
    return result(
      `${project.name}: ${project.summary}${excerpt ? '\n\nFrom the project README:\n' + excerpt : ''}\n\nTechnologies: ${project.tags.join(', ')}.`,
      'answered',
      [project.id],
      project.id,
      [
        { id: `project:${project.id}`, label: 'View project' },
        { id: `repo:${project.id}`, label: 'GitHub README' },
      ],
    )
  }
  if (
    /projects|built|portfolio|machine learning|\bml\b|\bai\b|full.?stack|python|react|cloudflare|skills|technolog|\bsql\b|kaam/.test(
      text,
    )
  ) {
    const filtered = knowledge.projects.filter((p) => {
      if (/\bai\b|\bml\b|machine learning/.test(text))
        return /criclytics|incidentiq|financial|fashion|travelbuddy/.test(p.id)
      if (/python/.test(text)) return p.tags.some((tag) => /python/i.test(tag))
      if (/react|full.?stack/.test(text)) return /travelbuddy|criclytics|incidentiq/.test(p.id)
      if (/cloudflare/.test(text)) return /incidentiq|criclytics/.test(p.id)
      return true
    })
    return result(
      `Ali’s work combines AI, machine learning, data science, and full-stack development. ${filtered.length ? 'Relevant projects:\n\n' + filtered.map((p) => `• ${p.name} — ${p.summary}`).join('\n\n') : 'Ask about a particular technology or project.'}`,
      'answered',
      filtered.slice(0, 3).map((p) => p.id),
      null,
      filtered.slice(0, 4).map((p) => ({ id: `project:${p.id}`, label: p.name })),
    )
  }
  if (
    /who (?:is|s)|tell me about|background|introduc|location|live|based|lahore|pakistan/.test(
      text,
    ) &&
    /ali|aamir|he|his|you|background|introduc/.test(text)
  )
    return result(
      `${profile.name} is a Data Science student at FAST-NUCES Lahore and a developer working across AI/ML and full-stack applications. Based in ${profile.location}, he also founded Kryzect. His public projects range from ML classifiers and analytics to serverless AI workflows and assembly games.`,
      'answered',
      ['profile'],
      null,
      [{ id: 'about', label: 'About Ali' }],
    )
  if (/ali|aamir|\bhis\b|\bhe\b|\byou\b/.test(text)) {
    const query = words(message)
    const relevant = knowledge.sections
      .filter((section) => section.sourceId === 'profile')
      .map((section) => ({
        section,
        score: query.filter((word) => normalize(section.text).includes(word)).length,
      }))
      .sort((a, b) => b.score - a.score)[0]
    if (relevant?.score >= 2)
      return result(
        `From Ali's GitHub profile README:\n\n${cleanExcerpt(relevant.section.text)}`,
        'answered',
        ['profile'],
      )
    return unknown()
  }
  return result(
    'I can help with questions about Ali and his work. What would you like to know?',
    'off_topic',
  )
}
export function resolveAction(id, knowledge) {
  const contact = {
    'contact:email': `mailto:${knowledge.profile.email}`,
    'contact:phone': `tel:${knowledge.profile.phone}`,
    'contact:linkedin': knowledge.profile.contactLinks?.linkedin,
    'contact:github': knowledge.profile.contactLinks?.github,
  }
  if (Object.hasOwn(contact, id)) return contact[id]
  const company = knowledge.company
  const companyLinks = company
    ? {
        'company:services': new URL('services', company.website).href,
        'company:contact': new URL('contact', company.website).href,
        'company:booking': new URL('book-a-call', company.website).href,
        'company:process': new URL('process', company.website).href,
        'company:product': new URL('products/ai-postmortem', company.website).href,
        'company:email': `mailto:${company.email}`,
        'company:github': company.github,
      }
    : {}
  if (Object.hasOwn(companyLinks, id)) return companyLinks[id]
  if (id === 'resume') return knowledge.profile.resume
  if (
    [
      'home',
      'about',
      'kryzect',
      'experience',
      'education',
      'skills',
      'projects',
      'contact',
    ].includes(id)
  )
    return '#' + id
  const [type, projectId] = String(id).split(':')
  const project = knowledge.projects.find((p) => p.id === projectId)
  if (!project) return null
  if (type === 'project') return '#projects'
  if (type === 'repo') return knowledge.sources.find((s) => s.id === projectId)?.url || null
  if (type === 'demo')
    return (
      project.links.find(
        (link) => /^(visit|demo|live)$/i.test(link.label) && /^https:\/\//.test(link.url),
      )?.url || null
    )
  return null
}
