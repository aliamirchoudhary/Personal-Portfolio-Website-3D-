// Specific questions should resolve to specific evidence before broad biography/list routes.
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const contains = (text, term) =>
  new RegExp(`(?:^|[^a-z0-9])${escape(term)}(?=$|[^a-z0-9+])`, 'i').test(text)
const technologies = {
  Django: ['django'],
  Flask: ['flask'],
  FastAPI: ['fastapi', 'fast api'],
  Python: ['python'],
  'C++': ['c++', 'cpp'],
  JavaScript: ['javascript', 'js'],
  TypeScript: ['typescript', 'ts'],
  React: ['react', 'reactjs', 'react.js'],
  'Node.js': ['nodejs', 'node.js', 'node js'],
  SQL: ['sql'],
  TensorFlow: ['tensorflow'],
  PyTorch: ['pytorch'],
  Streamlit: ['streamlit'],
  Docker: ['docker'],
  Kubernetes: ['kubernetes', 'k8s'],
  AWS: ['aws', 'amazon web services'],
  Azure: ['azure'],
  Cloudflare: ['cloudflare'],
  Vercel: ['vercel'],
  'Hugging Face': ['hugging face', 'huggingface'],
  MongoDB: ['mongodb', 'mongo'],
  PostgreSQL: ['postgresql', 'postgres'],
  MySQL: ['mysql'],
  Redis: ['redis'],
  Vue: ['vue', 'vuejs'],
  Angular: ['angular'],
  Rust: ['rust'],
  Go: ['golang'],
  Java: ['java'],
  'Next.js': ['next.js', 'nextjs'],
  DistilBERT: ['distilbert'],
  Assembly: ['assembly', '8088', 'iapx8088'],
}
const capabilities = [
  {
    name: 'machine learning',
    query: /\bmachine learning\b|\bml\b|predictive analytics/i,
    evidence: /machine.learning|predictive|\bcnn\b/i,
  },
  {
    name: 'agentic AI',
    query: /\bagentic\b|\bmulti[ -]?agent\b|\bai agents?\b|\bagent (?:systems?|workflows?)\b/i,
    evidence: /\bagentic\b|\bmulti[ -]?agent\b|specialized (?:ai )?agents/i,
    explanation:
      'Its specialized agents reconstruct timelines, analyze root causes, recommend prevention measures, and assemble draft postmortems, with human review before finalization.',
  },
  {
    name: 'RAG',
    query: /\brag\b|retrieval[ -]augmented|ground(?:ed|ing).*\b(?:ai|llm|responses?)\b/i,
    evidence: /\brag\b|retrieval[ -]augmented/i,
    explanation:
      'IncidentIQ retrieves runbooks and earlier incidents to ground its analysis and recommendations.',
  },
  {
    name: 'NLP and text classification',
    query:
      /\bnlp\b|natural language processing|text classif|document classif|financial documents?/i,
    evidence: /distilbert|text-based.*classif|financial.*classif/i,
  },
  {
    name: 'computer vision',
    query: /computer vision|image (?:classif|recogn)|\bcnn\b/i,
    evidence: /image classif|\bcnn\b|clothing.*classif/i,
  },
]

export function focusedAnswer(message, knowledge, previous) {
  const text = message.toLowerCase().replace(/[’']/g, ' ')
  const explicit = knowledge.projects.filter((p) =>
    [p.name, ...p.aliases].some((alias) => contains(text, alias)),
  )
  const response = (answer, sourceIds = [], projectId = null, actions = [], extra = {}) => ({
    answer,
    sourceIds,
    projectId,
    actions,
    status: 'answered',
    mode: 'local',
    version: knowledge.version,
    focused: true,
    ...extra,
  })
  const missing = (answer) => response(answer, [], null, [], { status: 'unknown', skipAI: true })
  if (/\bbirth(?:day|date)?\b|date of birth|\bdob\b|\bborn\b/i.test(text))
    return missing(
      "Ali hasn't shared a date of birth in this portfolio. I won't infer one from his age or education dates.",
    )
  if (/\bhow old\b|\bage\b/i.test(text))
    return explicit.length
      ? missing("I don't have a verified project creation date or project age in these sources.")
      : knowledge.profile.age
        ? response(
            `Ali is ${knowledge.profile.age}, as he shared on ${knowledge.profile.ageAsOf}.`,
            ['owner'],
            null,
            [],
            { skipAI: true },
          )
        : missing("Ali's age isn't listed in the public information I have.")
  if (
    /\binterests?\b|hobbies|hobby|free time|spare time|for fun|\bchess\b|\bmovies\b|vibe cod/i.test(
      text,
    ) &&
    !/\b(build|create|develop|write|recommend)\b.*\b(game|app|script|movie)\b/i.test(text)
  ) {
    if (/favorite|favourite|which movies|rating|\belo\b/i.test(text))
      return missing(
        "Ali has shared an interest in chess and movies, but hasn't supplied favorite titles, players, or a chess rating.",
      )
    return response(
      `His interests include ${knowledge.profile.interests.join(', ')}.`,
      ['owner'],
      null,
      [],
      { skipAI: true },
    )
  }
  if (/salary|net worth|home address|married|religion|girlfriend|family|client names/i.test(text))
    return missing("That information isn't part of Ali's published professional profile.")
  if (/\b(?:how many years|years of experience|how long has he|how experienced)\b/i.test(text))
    return missing(
      "I have published role dates, but no verified total for Ali's years of professional experience. Overlapping roles and study shouldn't be added together as a precise total.",
    )
  if (/\b(?:gpa|cgpa|grades|certified|certifications?|certificates?)\b/i.test(text))
    return missing(
      "I don't have a verified GPA or certification record in the current portfolio sources.",
    )
  if (/when.*graduat|graduat.*(?:when|year|expected)|finish.*degree/i.test(text)) {
    const year = knowledge.profile.graduationYear
    return year
      ? response(
          `His GitHub profile lists ${year} as the expected end of his BS Data Science degree. That is a published expectation, not confirmation of graduation.`,
          ['profile'],
        )
      : missing("I don't have a confirmed graduation date in the published records.")
  }
  const project =
    explicit.length === 1
      ? explicit[0]
      : /\bit\b|\bits\b|\bthat\b|\bthis\b/i.test(text)
        ? knowledge.projects.find((p) => p.id === previous)
        : null
  const pool = project ? [project] : knowledge.projects
  const actionsFor = (projects) =>
    projects.slice(0, 3).map((p) => ({ id: `repo:${p.id}`, label: `${p.name} README` }))
  const evidenceFor = (p) =>
    [
      p.summary,
      ...p.tags,
      ...knowledge.sections.filter((s) => s.projectId === p.id).map((s) => s.text),
    ].join('\n')
  if (!project && /favo(?:u)?rite.*(?:language|framework|tool)/.test(text))
    return missing(
      "Ali hasn't stated a favorite programming language, framework, or tool in these records.",
    )
  const groupQueries = [
    [/\bdatabases?\b|data stack/i, 'Data and databases'],
    [/programming languages|coding languages/i, 'Programming'],
    [/cloud (?:tools|platforms|stack)|devops|ci\/?cd/i, 'Cloud and DevOps'],
    [/web frameworks|backend frameworks/i, 'Web and backend'],
    [/ai (?:tools|stack)|ml (?:tools|stack)/i, 'AI and machine learning'],
  ]
  const group = !project && groupQueries.find(([pattern]) => pattern.test(text))
  if (group)
    return response(
      `His CV lists ${knowledge.profile.skillGroups[group[1]].join(', ')} under ${group[1].toLowerCase()}. These are listed skills; ask about a specific tool for project evidence.`,
      ['cv'],
    )
  if (
    !project &&
    /full[ -]?stack|web (?:development|stack)|front[ -]?end|back[ -]?end/.test(text) &&
    !/compar|versus|\bvs\b/.test(text)
  ) {
    const groups = knowledge.profile.skillGroups
    return response(
      `His documented full-stack work includes ${groups['Web and backend'].join(', ')}. Deployment/cloud tools listed in his CV include ${groups['Cloud and DevOps'].join(', ')}.\n\nProject examples include TravelBuddy (React, Node.js/Express and SQL), Criclytics (Flask and an ML-backed interface), and IncidentIQ (React with Cloudflare Workers). These are documented technologies, not a claim of equal proficiency in each.`,
      ['cv', 'travelbuddy', 'criclytics', 'incidentiq'],
      null,
      actionsFor(
        knowledge.projects.filter((p) =>
          ['travelbuddy', 'criclytics', 'incidentiq'].includes(p.id),
        ),
      ),
    )
  }
  const employer = knowledge.profile.experience.find((entry) => contains(text, entry.company))
  if (employer?.company === 'Kryzect' && /when|start|found|date|year/.test(text)) return null
  if (employer && /experience|work|role|responsib|intern|did|does|doing/i.test(text))
    return response(
      `${employer.role} at ${employer.company}${employer.company === 'Kryzect' ? ' (the founding date differs between sources)' : ` (${employer.year})`}. ${knowledge.profile.experienceDetails[employer.company] || employer.description}`,
      ['cv', 'profile'],
    )
  if (
    /\bdeploy(?:s|ed|ment|ments|ing)?\b|\bhost(?:s|ed|ing)?\b|live (?:demo|site|link)|\bship(?:ped|ping)?\b|production/i.test(
      text,
    ) &&
    !/compar|versus|\bvs\b|\bwhy\b|how (?:does|do).*deploy/i.test(text)
  ) {
    const live = pool.filter((p) =>
      p.links.some(
        (link) => /^(visit|demo|live)$/i.test(link.label) && /^https:\/\//.test(link.url),
      ),
    )
    if (!live.length)
      return missing(
        `I couldn't find a published live-demo link for ${project ? project.name : 'that project'}. Build or deployment instructions alone don't confirm that it is currently deployed.`,
      )
    const details = live.map((p) =>
      p.id === 'incidentiq'
        ? `${p.name}: its README documents Cloudflare Pages for the frontend and Workers for the backend.`
        : `${p.name}: a hosted demo is linked from the portfolio.`,
    )
    return response(
      `Yes. ${details.join(' ')}${project ? '' : ' These are concrete examples of shipping projects beyond a local development environment.'}`,
      live.map((p) => p.id),
      project?.id || null,
      live.map((p) => ({ id: `demo:${p.id}`, label: `Open ${p.name}` })),
    )
  }
  const capability = capabilities.find((item) => item.query.test(text))
  if (capability && !/compar|versus|\bvs\b/.test(text)) {
    const matches = pool.filter((p) => capability.evidence.test(evidenceFor(p)))
    if (!matches.length)
      return response(
        `I couldn't find documented ${capability.name} work${project ? ` in ${project.name}` : ' in these project sources'}. That is a limit of the available evidence, not proof that Ali has never used it.`,
        [],
        null,
        [],
        { status: 'unknown' },
      )
    if (project && /\bhow\b|explain|detail|architect|pipeline/.test(text)) return null // Let normal retrieval/AI explain the mechanism.
    const primary = matches[0]
    const explanation =
      capability.explanation && primary.id === 'incidentiq'
        ? capability.explanation
        : primary.summary
    return response(
      `Yes. ${primary.name} is a documented example of ${capability.name}. ${explanation}`,
      [primary.id],
      primary.id,
      actionsFor([primary]),
    )
  }
  const allTechnologies = {
    ...Object.fromEntries(knowledge.profile.skills.map((skill) => [skill, [skill.toLowerCase()]])),
    ...technologies,
  }
  const requested = Object.entries(allTechnologies).filter(([, aliases]) =>
    aliases.some((alias) => contains(text, alias)),
  )
  if (requested.length && !/compar|versus|\bvs\b|\bwhy\b|\bhow\b|implement|architect/.test(text)) {
    const lines = [],
      sourceIds = new Set(),
      matched = new Map()
    for (const [name, aliases] of requested.slice(0, 3)) {
      const matches = pool.filter((p) => aliases.some((alias) => contains(evidenceFor(p), alias)))
      const listed =
        !project &&
        knowledge.profile.skills.some((skill) => aliases.some((alias) => contains(skill, alias)))
      if (matches.length) {
        lines.push(
          `${name}: yes—documented in ${matches
            .slice(0, 3)
            .map((p) => p.name)
            .join(', ')}.`,
        )
        matches.slice(0, 3).forEach((p) => {
          sourceIds.add(p.id)
          matched.set(p.id, p)
        })
      } else if (listed) {
        lines.push(
          `${name} is listed among Ali's technical skills. I don't have a featured-project example to point to for it.`,
        )
        sourceIds.add(
          Object.values(knowledge.profile.skillGroups)
            .flat()
            .some((skill) => aliases.some((alias) => contains(skill, alias)))
            ? 'cv'
            : 'profile',
        )
      } else
        lines.push(
          `I couldn't find ${name} in ${project ? `${project.name}'s documented stack` : "Ali's documented skills or projects"}. That doesn't establish that he hasn't used it.`,
        )
    }
    return response(
      lines.join('\n\n'),
      [...sourceIds],
      project?.id || (matched.size === 1 ? [...matched.keys()][0] : null),
      actionsFor([...matched.values()]),
      { status: sourceIds.size ? 'answered' : 'unknown' },
    )
  }
  if (explicit.length === 2 && /compar|differ|versus|\bvs\b/.test(text))
    return response(
      `They address different problems:\n\n${explicit.map((p) => `${p.name}: ${p.summary}\nDocumented stack: ${p.tags.join(', ')}.`).join('\n\n')}\n\nThis compares their documented purposes; it doesn't establish that one performs better than the other.`,
      explicit.map((p) => p.id),
      null,
      actionsFor(explicit),
    )
  if (/\bwhere\b.*(?:based|live|located|from)|\blocation\b/.test(text))
    return response(`Ali's portfolio lists ${knowledge.profile.location} as his location.`, [
      'profile',
    ])
  return null
}

export function expandQuestion(message) {
  return message
    .replace(/agentic|multi[ -]?agent/gi, '$& specialized agents orchestration pipeline')
    .replace(
      /deploy(?:ment|ments|ed|ing)?|hosting/gi,
      '$& Cloudflare Workers Pages production hosted',
    )
    .replace(/\brag\b/gi, '$& retrieval runbooks grounding')
    .replace(/\bnlp\b/gi, '$& text classification DistilBERT')
    .replace(/computer vision/gi, '$& image classification CNN')
}
