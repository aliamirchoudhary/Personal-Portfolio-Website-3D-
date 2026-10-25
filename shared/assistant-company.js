const serviceTerms = {
  'web-software': /\bweb(?:site|sites)?\b|landing page|portal/i,
  'mobile-apps': /mobile|\bios\b|android|cross.platform/i,
  'ai-solutions': /\bai\b|assistant|agent|\brag\b|document intelligence/i,
  automation: /automat|workflow|repetitive/i,
  saas: /\bsaas\b|\bmvp\b|subscription|digital product/i,
  'api-backend': /\bapi\b|backend|back.end|authenticat|authoriz/i,
  cloud: /cloud|deploy|hosting|serverless|infrastructure/i,
  'data-analytics': /data|analytics|reporting|pipeline/i,
  dashboards: /dashboard/i,
  ecommerce: /e.commerce|online store|storefront|checkout|inventory/i,
  'custom-software': /custom software|internal (?:tool|system)|business tool/i,
  integrations: /integrat|crm|webhook|connect.*system/i,
}

export function companyAnswer(message, knowledge, subject) {
  const text = message.toLowerCase(),
    company = knowledge.company
  if (!company) return null
  const projectMention = knowledge.projects.some((project) =>
    [project.name, ...project.aliases].some((alias) => text.includes(alias.toLowerCase())),
  )
  const named =
    /kryzect|your (?:company|agency)|his (?:company|agency)/.test(text) ||
    (/\bservices?\b/.test(text) && !projectMention)
  const followup =
    subject === 'kryzect' &&
    !projectMention &&
    /\bit\b|\bits\b|\bthey\b|\btheir\b|price|cost|quote|process|team|product|clients?|startups?|businesses|specification/.test(
      text,
    )
  if (!named && !followup) return null
  const result = (
    answer,
    source = 'kryzect',
    actions = [{ id: 'company:services', label: 'Kryzect services' }],
    status = 'answered',
  ) => ({
    answer,
    status,
    sourceIds: [source],
    projectId: null,
    topic: 'kryzect',
    focused: true,
    skipAI: true,
    actions,
    mode: 'local',
    version: knowledge.version,
  })
  if (/when.*(?:found|start)|founding (?:date|year)|what year|how old/.test(text))
    return {
      ...result(
        'The public sources disagree on Kryzect’s founding date: the CV lists 2024, while the website/profile lists August 2026. Ali can confirm the correct date.',
        'profile',
        [],
        'unknown',
      ),
      sourceIds: ['profile', 'cv'],
    }
  if (/contact|email|phone|linkedin|github|book.*call|reach/.test(text))
    return result(
      `Contact Kryzect at ${company.email}, use its website contact form, or book a discovery call. Its GitHub organization is ${company.github}.`,
      'kryzect-site',
      [
        { id: 'company:email', label: 'Email Kryzect' },
        { id: 'company:contact', label: 'Contact form' },
        { id: 'company:booking', label: 'Book a call' },
        { id: 'company:github', label: 'Kryzect GitHub' },
      ],
    )
  if (/\b(?:prices?|pricing|cost|budget|quotes?|charge|rates?)\b|how much/.test(text))
    return result(company.pricing, 'kryzect-faq', [
      { id: 'company:contact', label: 'Discuss a quote' },
    ])
  if (/team|employees|headcount|how many people|who.*(?:run|lead|found)/.test(text))
    return result(company.team, 'kryzect-team')
  if (/process|how.*(?:work|deliver)|steps|stages|handover|maintenance/.test(text))
    return result(
      `Its published process is ${company.process.join(' → ')}. Discovery establishes objectives and constraints; delivery includes testing, production setup, documentation and handover. Improvement can include maintenance and optimization. A delivery date requires an agreed scope.`,
      'kryzect-process',
      [{ id: 'company:process', label: 'How Kryzect works' }],
    )
  if (
    /incidentiq|roadmap|multi.tenan|pagerduty|slack/.test(text) ||
    (/\bproducts?\b/.test(text) && !/\b(build|develop|saas|digital)\b/.test(text))
  )
    return result(
      `${company.product.name} is listed as ${company.product.status.toLowerCase()}. ${company.product.summary} An experimental frontend is publicly available. ${company.product.roadmap}`,
      'kryzect-products',
      [
        { id: 'company:product', label: 'IncidentIQ product page' },
        { id: 'demo:incidentiq', label: 'Experimental demo' },
      ],
    )
  if (
    /small business|startups?|international|individual|technical (?:spec|requirement)|existing (?:system|tool)|replace.*(?:tool|system)/.test(
      text,
    )
  )
    return result(`${company.audience} ${company.existingSystems}`, 'kryzect-faq', [
      { id: 'company:contact', label: 'Discuss your project' },
    ])
  if (
    /clients?|testimonials?|revenue|guarantee|how (?:fast|long)|deadline|delivery date/.test(text)
  )
    return result(
      "I don't have verified client counts, testimonials, revenue, guaranteed outcomes, or a delivery estimate for your scope. Kryzect can discuss requirements and feasibility directly.",
      'kryzect-faq',
      [{ id: 'company:contact', label: 'Discuss requirements' }],
      'unknown',
    )
  const matches = company.services.filter((service) => serviceTerms[service.slug]?.test(text))
  if (
    matches.length &&
    !/all services|what (?:does|services)|list.*services|which services/.test(text)
  )
    return result(
      matches
        .slice(0, 2)
        .map(
          (service) =>
            `${service.title}: ${service.description}\nPublished capabilities include ${service.capabilities.slice(0, 6).join(', ')}.`,
        )
        .join('\n\n'),
    )
  return result(
    `${company.summary}\n\nPublished service areas: ${company.services.map((service) => service.title).join('; ')}.\n\n${company.tagline}`,
  )
}

export function personalContactAnswer(message, knowledge) {
  if (/kryzect|company|agency/.test(message.toLowerCase())) return null
  if (
    !/\b(contact|email|phone|telephone|linkedin|reach|hire|availability)\b|mobile number|(?:his|your|ali.?s) number\b(?!\s+of\b)|(?:his|your|ali.?s|ali).*github|github (?:profile|link)|^\s*(github|number)\??\s*$/i.test(
      message,
    )
  )
    return null
  const profile = knowledge.profile
  return {
    answer: `You can reach Ali through:\n\nEmail: ${profile.email}\nPhone: ${profile.phone}\nLinkedIn: ${profile.contactLinks.linkedin}\nGitHub: ${profile.contactLinks.github}`,
    status: 'answered',
    sourceIds: ['portfolio', 'cv'],
    projectId: null,
    focused: true,
    skipAI: true,
    actions: [
      { id: 'contact:email', label: 'Email Ali' },
      { id: 'contact:phone', label: 'Call Ali' },
      { id: 'contact:linkedin', label: 'LinkedIn' },
      { id: 'contact:github', label: 'GitHub' },
    ],
    mode: 'local',
    version: knowledge.version,
  }
}
