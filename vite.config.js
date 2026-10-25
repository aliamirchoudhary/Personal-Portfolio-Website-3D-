import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { renderPage } from './scripts/site-html.js'
import { securityHeaders } from './scripts/security.js'
import { developmentApi } from './scripts/dev-api.js'

export default defineConfig({
  plugins: [
    react(),
    developmentApi(),
    { name: 'portfolio-static-content', transformIndexHtml: renderPage },
  ],
  server: { headers: securityHeaders, port: 5173, strictPort: true },
  preview: { headers: securityHeaders },
})
