import { createHash } from 'node:crypto'
import { metadata } from './site-html.js'
import { startupScript } from './startup.js'
const scriptBodies = [
  ...metadata().matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
].map(([, code]) => code)
const hashes = [...scriptBodies, startupScript].map(
  (code) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`,
)
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy-Report-Only': `default-src 'self'; script-src 'self' ${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.web3forms.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
}
export const vercelConfig = {
  rewrites: [{ source: '/send-contact', destination: '/api/send-contact' }],
  functions: {
    'api/send-contact.js': { maxDuration: 30 },
    'api/assistant.js': { maxDuration: 20, includeFiles: '.assistant-temp/knowledge.json' },
  },
  headers: [
    {
      source: '/(.*)',
      headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
    },
    {
      source: '/assets/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/fonts/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
      ],
    },
  ],
}
