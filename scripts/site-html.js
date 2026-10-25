import {
  PERSONAL,
  ABOUT_TEXT,
  KRYZECT,
  EDUCATION,
  EXPERIENCE,
  PROJECTS,
  TECHNICAL_SKILLS,
  SOCIAL_LINKS,
} from '../src/data/portfolioData.js'
export const SITE = 'https://ali-aamir-portfolio.vercel.app'
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  )
const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c')
export function metadata() {
  const title = `${PERSONAL.name} — Data Science & Full Stack Developer`
  const description = `Portfolio of ${PERSONAL.name} — Data Science & AI enthusiast, full stack developer, and founder of Kryzect. Explore projects, skills, experience, and how to get in touch.`
  const identity = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: PERSONAL.name,
    alternateName: 'Ali Aamir',
    url: `${SITE}/`,
    image: `${SITE}/profile.jpg`,
    jobTitle: PERSONAL.title,
    email: `mailto:${PERSONAL.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'Pakistan' },
    sameAs: SOCIAL_LINKS.filter((link) => /^https:/.test(link.href)).map((link) => link.href),
    knowsAbout: TECHNICAL_SKILLS.map((skill) => skill.name),
  }
  return `<title>${escape(title)}</title>
<meta name="description" content="${escape(description)}"><meta name="author" content="${escape(PERSONAL.name)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${SITE}/">
<meta property="og:type" content="profile"><meta property="og:site_name" content="${escape(PERSONAL.name)} Portfolio"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${SITE}/"><meta property="og:image" content="${SITE}/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${escape(title)}"><meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${SITE}/og-image.png">
<script type="application/ld+json">${json(identity)}</script>
<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@type': 'Organization', name: KRYZECT.name, url: KRYZECT.url, founder: { '@id': `${SITE}/#person` } })}</script>
<script type="application/ld+json">${json({ '@context': 'https://schema.org', '@type': 'WebSite', name: `${PERSONAL.name} — Portfolio`, url: `${SITE}/`, inLanguage: 'en', publisher: { '@id': `${SITE}/#person` } })}</script>`
}
export function staticPortfolio() {
  const list = (items, render) =>
    `<ul>${items.map((item) => `<li>${render(item)}</li>`).join('')}</ul>`
  return `<main class="static-portfolio"><h1>${escape(PERSONAL.name)}</h1><p>${escape(PERSONAL.title)}</p><nav aria-label="Portfolio sections"><a href="#projects">Projects</a> · <a href="#contact">Contact</a> · <a href="${PERSONAL.resumeUrl}" download>Download resume</a></nav>
<section id="about"><h2>About me</h2>${ABOUT_TEXT.map((text) => `<p>${escape(text)}</p>`).join('')}</section>
<section id="kryzect"><h2>Kryzect</h2><p>Think First. Build Better.</p><a href="${KRYZECT.url}">Visit Kryzect</a></section>
<section id="experience"><h2>Experience</h2>${list(EXPERIENCE, (item) => `<h3>${escape(item.role)} — ${escape(item.company)}</h3><p>${escape(item.year)}</p><p>${escape(item.description)}</p>`)}</section>
<section id="education"><h2>Education</h2>${list(EDUCATION, (item) => `${escape(item.degree)} — ${escape(item.institution)} (${escape(item.year)})`)}</section>
<section id="skills"><h2>Skills</h2>${list(TECHNICAL_SKILLS, (item) => escape(item.name))}</section>
<section id="projects"><h2>Featured projects</h2>${list(PROJECTS, (item) => `<h3>${escape(item.name)}</h3><p>${escape(item.description)}</p>${item.links.map((link) => `<a href="${escape(link.url)}">${escape(link.label)}</a>`).join(' · ')}`)}</section>
<section id="contact"><h2>Contact</h2><p><a href="mailto:${escape(PERSONAL.email)}">${escape(PERSONAL.email)}</a> · ${escape(PERSONAL.location)}</p></section></main>`
}
export function renderPage(template) {
  return template
    .replace('<!-- PORTFOLIO_METADATA -->', metadata())
    .replace(
      '<!-- PORTFOLIO_CONTENT -->',
      `<!-- PORTFOLIO_STATIC_START -->${staticPortfolio()}<!-- PORTFOLIO_STATIC_END -->`,
    )
    .replace(
      '<!-- PORTFOLIO_NOSCRIPT -->',
      `<noscript><style>#root{display:none}</style>${staticPortfolio()}</noscript>`,
    )
}
