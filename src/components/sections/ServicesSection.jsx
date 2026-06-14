import { RingCarousel } from '../ui/RingCarousel'
import { SERVICES } from '../../data/portfolioData'

const mappedServices = SERVICES.map((s) => {
  const sectionsHtml = (s.modal.sections || []).map((sec) =>
    `<p><strong>${sec.heading}</strong></p><ul style="margin:0 0 12px;padding-left:20px">${sec.items.map((item) => `<li>${item}</li>`).join('')}</ul>`
  ).join('')
  const techHtml = s.modal.tech ? `<p><strong>Tech Stack:</strong> ${s.modal.tech}</p>` : ''
  const priceHtml = s.modal.price ? `<p><strong>Price:</strong> ${s.modal.price}</p>` : ''
  const deliveryHtml = s.modal.delivery ? `<p><strong>Delivery:</strong> ${s.modal.delivery}</p>` : ''

  return {
    id: s.id,
    icon: <i className={s.icon} style={{ color: '#a78bfa' }} />,
    title: s.title,
    shortDesc: s.shortDesc,
    fullContent: `<p>${s.modal.description}</p>${sectionsHtml}${techHtml}${priceHtml}${deliveryHtml}`,
    links: s.modal.link ? [{ url: s.modal.link.href, label: s.modal.link.label }] : [],
  }
})

export default function ServicesSection() {
  return (
    <section id="services" className="portfolio-section" style={{ height: '100vh' }}>
      <div
        className="content-scroll"
        style={{
          marginLeft: 0,
          width: '60vw',
          height: '100vh',
          padding: '1rem 4rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        }}
      >
        <h2
          className="gradient-text"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '2.5rem',
            margin: '0 0 2rem',
            flexShrink: 0,
          }}
        >
          What I Offer
        </h2>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <RingCarousel cards={mappedServices} accentColor="#7c3aed" />
        </div>
      </div>
    </section>
  )
}
