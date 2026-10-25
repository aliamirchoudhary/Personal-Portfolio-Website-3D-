import nodemailer from 'nodemailer'
import 'dotenv/config'
import { validateContact, CONTACT_LIMITS } from '../shared/contact.js'
import { contactFingerprint, createContactStore } from './contact-store.js'
let store
const accepted = {
  success: true,
  message: 'Your message has been received. Thank you for reaching out.',
}

export function createContactHandler({
  env = process.env,
  getStore = () => (store ??= createContactStore(env)),
  sendMail,
} = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ success: false, message: 'Method not allowed.' })
    }
    try {
      const origins = new Set(
        [
          env.FRONTEND_ORIGIN || 'https://ali-aamir-portfolio.vercel.app',
          env.VERCEL_URL && `https://${env.VERCEL_URL}`,
        ]
          .filter(Boolean)
          .map((url) => new URL(url).origin),
      )
      if (!env.VERCEL && env.NODE_ENV !== 'production') {
        origins.add('http://localhost:5173')
        origins.add('http://127.0.0.1:5173')
      }
      if (req.headers.origin && !origins.has(req.headers.origin))
        return res.status(403).json({ success: false, message: 'This origin is not allowed.' })
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || ''))
        return res.status(415).json({ success: false, message: 'Send a JSON request.' })
      if (
        Number(req.headers['content-length'] || 0) > CONTACT_LIMITS.body ||
        Buffer.byteLength(JSON.stringify(req.body) || '') > CONTACT_LIMITS.body
      )
        return res.status(413).json({ success: false, message: 'Message is too large.' })
      const validation = validateContact(req.body)
      if (validation.error)
        return res
          .status(400)
          .json({ success: false, message: validation.error, field: validation.field })
      if (req.body.website) return res.status(200).json(accepted)
      const id = req.headers['idempotency-key']
      if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(id))
        return res.status(400).json({ success: false, message: 'Refresh the form and try again.' })
      const { values } = validation
      if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD || !env.ADMIN_EMAIL)
        throw new Error('contact_mail_configuration')
      const fingerprint = contactFingerprint(values),
        reservation = getStore()
      const ip = env.VERCEL
        ? String(req.headers['x-vercel-forwarded-for'] || 'unknown')
            .split(',')[0]
            .trim()
        : req.socket?.remoteAddress || 'local'
      const state = await reservation.reserve({ id, fingerprint, ip, email: values.email })
      if (state === 'sent') return res.status(200).json(accepted)
      if (state !== 'reserved') {
        res.setHeader('Retry-After', state === 'limited' ? '3600' : '5')
        return res.status(state === 'limited' ? 429 : 409).json({
          success: false,
          message:
            state === 'limited'
              ? 'Too many messages. Please try later or email me directly.'
              : 'This submission is already processing. Wait a moment before retrying.',
        })
      }
      const mail = {
        from: { name: 'Portfolio Contact', address: env.GMAIL_USER },
        to: env.ADMIN_EMAIL,
        replyTo: { name: values.name, address: values.email },
        subject: `[Portfolio] New contact — ${values.name}`,
        text: `From: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
        messageId: `<${contactFingerprint({ id })}@portfolio-contact.local>`,
        disableFileAccess: true,
        disableUrlAccess: true,
      }
      const deliver =
        sendMail ||
        ((message) =>
          nodemailer
            .createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              connectionTimeout: 5000,
              greetingTimeout: 5000,
              socketTimeout: 10000,
              auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
              disableFileAccess: true,
              disableUrlAccess: true,
            })
            .sendMail(message))
      try {
        await deliver(mail)
      } catch (error) {
        await reservation.release(id).catch(() => {})
        throw error
      }
      await reservation
        .complete(id, fingerprint)
        .catch(() => console.error('contact_completion_unavailable'))
      return res.status(200).json(accepted)
    } catch {
      console.error('contact_delivery_unavailable')
      return res.status(503).json({
        success: false,
        message: 'The form is temporarily unavailable. Please email me directly.',
      })
    }
  }
}
export default createContactHandler()
