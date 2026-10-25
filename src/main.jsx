import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import DecorationBoundary from './components/shared/DecorationBoundary'
import './index.css'
import { startDiagnostics } from './diagnostics'
import { PERSONAL } from './data/portfolioData'

const element = document.getElementById('root')
const fallback = (
  <main className="static-portfolio">
    <h1>Portfolio temporarily unavailable</h1>
    <p>
      Please reload, or <a href={`mailto:${PERSONAL.email}`}>email {PERSONAL.name}</a>.
    </p>
  </main>
)
const application = (
  <StrictMode>
    <DecorationBoundary fallback={fallback}>
      <App />
    </DecorationBoundary>
  </StrictMode>
)
if (element.dataset.prerendered === 'true') hydrateRoot(element, application)
else createRoot(element).render(application)
startDiagnostics()
