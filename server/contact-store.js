import { createHash } from 'node:crypto'
const hash = (value) => createHash('sha256').update(value).digest('hex')
const SCRIPT = `
local old = redis.call('GET', KEYS[1])
if old then
 if string.sub(old, 1, string.len(ARGV[1])) ~= ARGV[1] then return 'conflict' end
 if old == ARGV[1] .. ':sent' then return 'sent' end
 return 'pending'
end
if tonumber(redis.call('GET', KEYS[2]) or '0') >= 5 or tonumber(redis.call('GET', KEYS[3]) or '0') >= 100 or redis.call('EXISTS', KEYS[4]) == 1 then return 'limited' end
for i=2,3 do if redis.call('INCR', KEYS[i]) == 1 then redis.call('EXPIRE', KEYS[i], 3600) end end
redis.call('SET', KEYS[4], '1', 'EX', 60)
redis.call('SET', KEYS[1], ARGV[1] .. ':pending', 'EX', 120)
return 'reserved'`

async function command(env, args) {
  const response = await fetch(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(3000),
  })
  if (!response.ok) throw new Error('contact_store_unavailable')
  const data = await response.json()
  if (data.error) throw new Error('contact_store_unavailable')
  return data.result
}

export function createContactStore(env = process.env) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    if (!env.UPSTASH_REDIS_REST_URL.startsWith('https://'))
      throw new Error('contact_store_configuration')
    return {
      async reserve({ id, fingerprint, ip, email }) {
        const keys = [
          `portfolio:request:${hash(id)}`,
          `portfolio:ip:${hash(ip)}`,
          'portfolio:contact:hour',
          `portfolio:recipient:${hash(email.toLowerCase())}`,
        ]
        return command(env, ['EVAL', SCRIPT, 4, ...keys, fingerprint])
      },
      async complete(id, fingerprint) {
        await command(env, [
          'SET',
          `portfolio:request:${hash(id)}`,
          `${fingerprint}:sent`,
          'EX',
          86400,
        ])
      },
      async release(id) {
        await command(env, ['DEL', `portfolio:request:${hash(id)}`])
      },
    }
  }
  if (env.VERCEL || env.NODE_ENV === 'production') throw new Error('contact_store_configuration')
  // Bounded development store; never a serverless fallback. No message text is stored.
  const entries = new Map()
  const get = (key) => {
    const e = entries.get(key)
    if (!e || e.until <= Date.now()) {
      entries.delete(key)
      return null
    }
    return e.value
  }
  const set = (key, value, seconds) =>
    entries.set(key, { value, until: Date.now() + seconds * 1000 })
  return {
    async reserve({ id, fingerprint, ip, email }) {
      for (const key of entries.keys()) get(key)
      const old = get(id)
      if (old) return old.fingerprint !== fingerprint ? 'conflict' : old.state
      if (
        entries.size > 2000 ||
        (get(`ip:${ip}`) || 0) >= 5 ||
        (get('global') || 0) >= 100 ||
        get(`email:${email.toLowerCase()}`)
      )
        return 'limited'
      for (const key of [`ip:${ip}`, 'global']) {
        const n = get(key) || 0
        const until = entries.get(key)?.until
        set(key, n + 1, 3600)
        if (until) entries.get(key).until = until
      }
      set(`email:${email.toLowerCase()}`, true, 60)
      set(id, { fingerprint, state: 'pending' }, 120)
      return 'reserved'
    },
    async complete(id, fingerprint) {
      set(id, { fingerprint, state: 'sent' }, 86400)
    },
    async release(id) {
      entries.delete(id)
    },
  }
}
export const contactFingerprint = (values) => hash(JSON.stringify(values))
