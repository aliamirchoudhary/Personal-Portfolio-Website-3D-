import { createHmac, randomUUID } from 'node:crypto'
const RESERVE = `
if redis.call('EXISTS',KEYS[1])==1 then return 0 end
for i=2,5 do if tonumber(redis.call('GET',KEYS[i]) or '0')>=tonumber(ARGV[i]) then return 0 end end
redis.call('SET',KEYS[1],ARGV[1],'EX',25)
for i=2,5 do if redis.call('INCR',KEYS[i])==1 then redis.call('EXPIRE',KEYS[i],tonumber(ARGV[i+4])) end end
return 1`
const RELEASE = `if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0`
const PROVIDER_RESERVE = `for i=1,2 do if tonumber(redis.call('GET',KEYS[i]) or '0')>=tonumber(ARGV[i]) then return 0 end end for i=1,2 do if redis.call('INCR',KEYS[i])==1 then redis.call('EXPIRE',KEYS[i],tonumber(ARGV[i+2])) end end return 1`
export function createAssistantStore(env = process.env, fetcher = fetch) {
  if (!env.VERCEL && env.NODE_ENV !== 'production' && env.ASSISTANT_LOCAL_TEST === 'true')
    return localTestStore
  if (
    !env.ASSISTANT_RATE_LIMIT_SECRET ||
    !env.UPSTASH_REDIS_REST_TOKEN ||
    !/^https:\/\//.test(env.UPSTASH_REDIS_REST_URL || '')
  )
    return null
  async function command(args) {
    const response = await fetcher(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(2500),
      redirect: 'error',
    })
    if (!response.ok) throw Error('assistant_store_unavailable')
    const data = await response.json()
    if (data.error) throw Error('assistant_store_unavailable')
    return data.result
  }
  return {
    async reserve(ip) {
      const id = createHmac('sha256', env.ASSISTANT_RATE_LIMIT_SECRET).update(ip).digest('hex')
      const token = randomUUID(),
        prefix = 'portfolio:assistant:'
      const keys = [
        prefix + 'lease:' + id,
        prefix + 'minute:' + id,
        prefix + 'day:' + id,
        prefix + 'global:minute',
        prefix + 'global:day',
      ]
      const approved = await command([
        'EVAL',
        RESERVE,
        5,
        ...keys,
        token,
        3,
        20,
        6,
        100,
        60,
        86400,
        60,
        86400,
      ])
      if (Number(approved) !== 1) return null
      return { release: () => command(['EVAL', RELEASE, 1, keys[0], token]) }
    },
    async reserveProvider(provider) {
      if (!['gemini', 'openrouter'].includes(provider)) return false
      const configured = Number(env.GEMINI_REQUESTS_PER_DAY || 20)
      const daily =
        provider === 'openrouter'
          ? 40
          : Math.min(1000, Math.max(1, Number.isFinite(configured) ? configured : 20))
      const prefix = `portfolio:assistant:quota:${provider}:`
      return (
        Number(
          await command([
            'EVAL',
            PROVIDER_RESERVE,
            2,
            prefix + 'minute',
            prefix + 'day',
            provider === 'gemini' ? 5 : 6,
            daily,
            60,
            86400,
          ]),
        ) === 1
      )
    },
    async providerReady(provider, model = 'all') {
      if (!['gemini', 'openrouter'].includes(provider)) return false
      const global = await command(['EXISTS', `portfolio:assistant:cooldown:${provider}:all`])
      return (
        !global && !(await command(['EXISTS', `portfolio:assistant:cooldown:${provider}:${model}`]))
      )
    },
    async coolDown(provider, model = 'all', seconds = 120) {
      if (!['gemini', 'openrouter'].includes(provider)) return
      await command([
        'SET',
        `portfolio:assistant:cooldown:${provider}:${model}`,
        '1',
        'EX',
        Math.min(86400, Math.max(60, seconds)),
      ])
    },
  }
}

// Owner-only localhost testing; never selected in Vercel or production.
const localCounters = new Map(),
  localLeases = new Map(),
  localCooldowns = new Map()
function consume(key, limit, ttl) {
  const now = Date.now(),
    entry = localCounters.get(key)
  if (!entry || entry.until <= now) {
    localCounters.set(key, { count: 1, until: now + ttl })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}
const localTestStore = {
  async reserve(ip) {
    const key = createHmac('sha256', 'local-test-only').update(ip).digest('hex'),
      now = Date.now()
    for (const [id, until] of localLeases) if (until <= now) localLeases.delete(id)
    if (localCounters.size > 500) return null
    if (
      localLeases.has(key) ||
      !consume('minute:' + key, 3, 60000) ||
      !consume('day:' + key, 20, 86400000)
    )
      return null
    const until = now + 25000
    localLeases.set(key, until)
    return {
      release: async () => {
        if (localLeases.get(key) === until) localLeases.delete(key)
      },
    }
  },
  async reserveProvider(provider) {
    return (
      consume(provider + ':minute', 5, 60000) &&
      consume(provider + ':day', provider === 'gemini' ? 20 : 40, 86400000)
    )
  },
  async providerReady(provider, model = 'all') {
    const now = Date.now()
    return (
      (localCooldowns.get(provider + ':all') || 0) <= now &&
      (localCooldowns.get(provider + ':' + model) || 0) <= now
    )
  },
  async coolDown(provider, model = 'all', seconds = 120) {
    localCooldowns.set(
      provider + ':' + model,
      Date.now() + Math.min(3600, Math.max(60, seconds)) * 1000,
    )
  },
}
