import { CONTACT_LIMITS } from '../shared/contact.js'
export function developmentApi() {
  return {
    name: 'portfolio-development-api',
    configureServer(server) {
      server.middlewares.use('/send-contact', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (body) => {
          res.end(JSON.stringify(body))
          return res
        }
        const chunks = []
        let bytes = 0
        try {
          for await (const chunk of req) {
            bytes += chunk.length
            if (bytes > CONTACT_LIMITS.body) {
              res.status(413).json({ success: false, message: 'Message is too large.' })
              return
            }
            chunks.push(chunk)
          }
          const raw = Buffer.concat(chunks).toString('utf8')
          req.body = raw ? JSON.parse(raw) : undefined
        } catch {
          res.status(400).json({ success: false, message: 'Invalid JSON request.' })
          return
        }
        const { default: handler } = await import('../server/contact-handler.js')
        await handler(req, res)
      })
    },
  }
}
