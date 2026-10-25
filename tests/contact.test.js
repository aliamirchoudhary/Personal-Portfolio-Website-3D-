import test from 'node:test'
import assert from 'node:assert/strict'
import { createContactHandler } from '../server/contact-handler.js'
import { createContactStore } from '../server/contact-store.js'

const env = {
  GMAIL_USER: 'owner@example.com',
  GMAIL_APP_PASSWORD: 'test-only',
  ADMIN_EMAIL: 'owner@example.com',
}
const body = {
  name: 'Test Person',
  email: 'person@example.com',
  message: 'A legitimate contact message.',
}
function fixture(options = {}) {
  const mails = [],
    store = createContactStore({})
  const handler = createContactHandler({
    env,
    getStore: () => store,
    sendMail: async (mail) => {
      mails.push(mail)
    },
    ...options,
  })
  let n = 0
  return {
    mails,
    async request(changes = {}) {
      const response = {
        headers: {},
        status(code) {
          this.code = code
          return this
        },
        setHeader(k, v) {
          this.headers[k] = v
        },
        json(data) {
          this.data = data
          return this
        },
      }
      await handler(
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'idempotency-key': `test-request-id-${++n}`,
          },
          body,
          ...changes,
        },
        response,
      )
      return response
    },
  }
}
test('rejects malformed, recipient-list, control-character, and oversized input before SMTP', async () => {
  const f = fixture()
  for (const invalid of [
    undefined,
    null,
    [],
    { ...body, name: 3 },
    { ...body, email: 'one@example.com, two@example.com' },
    { ...body, email: 'Person <one@example.com>' },
    { ...body, email: `${'a'.repeat(65)}@example.com` },
    { ...body, email: `test@${'a'.repeat(64)}.com` },
    { ...body, name: 'Test\r\nSubject: bad' },
    { ...body, message: 'a'.repeat(5001) },
  ]) {
    assert.equal((await f.request({ body: invalid })).code, 400)
  }
  assert.equal((await f.request({ body: { ...body, message: 'a'.repeat(17000) } })).code, 413)
  assert.equal(f.mails.length, 0)
})
test('delivers only to owner, deduplicates retries, rejects id reuse with changed content', async () => {
  const f = fixture(),
    headers = { 'content-type': 'application/json', 'idempotency-key': 'unique-request-123456' }
  assert.equal((await f.request({ headers })).code, 200)
  assert.equal((await f.request({ headers })).code, 200)
  assert.equal(
    (await f.request({ headers, body: { ...body, message: 'Different request content.' } })).code,
    409,
  )
  assert.equal(f.mails.length, 1)
  assert.equal(f.mails[0].to, env.ADMIN_EMAIL)
  assert.equal(f.mails[0].replyTo.address, body.email)
})
test('enforces rate limits and suppresses honeypot submissions', async () => {
  const f = fixture()
  assert.equal((await f.request({ body: { ...body, website: 'spam' } })).code, 200)
  assert.equal(f.mails.length, 0)
  for (let i = 0; i < 5; i++)
    assert.equal(
      (await f.request({ body: { ...body, email: `person${i}@example.com` } })).code,
      200,
    )
  assert.equal((await f.request({ body: { ...body, email: 'other@example.com' } })).code, 429)
  assert.equal(f.mails.length, 5)
})
test('handles method, origin, content type, configuration, and SMTP failure safely', async () => {
  const f = fixture()
  assert.equal((await f.request({ method: 'GET' })).headers.Allow, 'POST')
  assert.equal((await f.request({ headers: { origin: 'https://untrusted.example' } })).code, 403)
  assert.equal((await f.request({ headers: { 'content-type': 'text/plain' } })).code, 415)
  assert.equal((await fixture({ env: {} }).request()).code, 503)
  assert.equal(
    (
      await fixture({
        sendMail: async () => {
          throw new Error('SMTP unavailable')
        },
      }).request()
    ).code,
    503,
  )
  assert.throws(() => createContactStore({ VERCEL: '1' }), /configuration/)
})

test('blocks a concurrent retry and fails closed when the shared store is unavailable', async () => {
  let finish, started
  const sending = new Promise((resolve) => {
    started = resolve
  })
  const transport = new Promise((resolve) => {
    finish = resolve
  })
  let deliveries = 0
  const f = fixture({
    sendMail: async () => {
      deliveries++
      started()
      await transport
    },
  })
  const headers = {
    'content-type': 'application/json',
    'idempotency-key': 'concurrent-request-1234',
  }
  const first = f.request({ headers })
  await sending
  assert.equal((await f.request({ headers })).code, 409)
  finish()
  assert.equal((await first).code, 200)
  assert.equal((await f.request({ headers })).code, 200)
  assert.equal(deliveries, 1)
  const failed = fixture({
    getStore: () => {
      throw new Error('Store unavailable')
    },
  })
  assert.equal((await failed.request()).code, 503)
  assert.equal(failed.mails.length, 0)
})
