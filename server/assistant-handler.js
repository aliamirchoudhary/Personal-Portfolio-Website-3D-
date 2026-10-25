import 'dotenv/config'
import knowledge from '../.assistant-temp/knowledge.json' with { type: 'json' }
import { answerLocal, ASSISTANT_LIMITS } from '../shared/assistant.js'
import { createAssistantStore } from './assistant-store.js'
import {
  verifyFreeModel,
  generateProjectAnswer,
  generateGeminiAnswer,
  geminiEligible,
} from './assistant-providers.js'
import { conversationContext, PROFILE_TOPICS } from './assistant-conversation.js'

export function createAssistantHandler({
  env = process.env,
  fetcher = fetch,
  getStore = () => createAssistantStore(env, fetcher),
} = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    const send = (code, body) => res.status(code).json(body)
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return send(405, { error: 'Use POST.' })
    }
    const origins = new Set(
      [
        env.FRONTEND_ORIGIN,
        'https://ali-aamir-portfolio.vercel.app',
        env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null,
      ].filter(Boolean),
    )
    if (!env.VERCEL && env.NODE_ENV !== 'production') {
      origins.add('http://127.0.0.1:5174')
      origins.add('http://localhost:5173')
      origins.add('http://127.0.0.1:5173')
    }
    if (!origins.has(req.headers.origin))
      return send(403, { error: 'This request is not allowed.' })
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || ''))
      return send(415, { error: 'Use JSON.' })
    let body = req.body
    try {
      if (Number(req.headers['content-length']) > ASSISTANT_LIMITS.body)
        return send(413, { error: 'Message too large.' })
      if (body === undefined) {
        const chunks = []
        let size = 0
        for await (const chunk of req) {
          size += chunk.length
          if (size > ASSISTANT_LIMITS.body) return send(413, { error: 'Message too large.' })
          chunks.push(chunk)
        }
        body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      } else if (typeof body === 'string') body = JSON.parse(body)
      if (Buffer.byteLength(JSON.stringify(body)) > ASSISTANT_LIMITS.body)
        return send(413, { error: 'Message too large.' })
    } catch {
      return send(400, { error: 'Invalid JSON.' })
    }
    if (
      !body ||
      typeof body.message !== 'string' ||
      !body.message.trim() ||
      body.message.length > ASSISTANT_LIMITS.message ||
      (body.projectId != null && !knowledge.projects.some((p) => p.id === body.projectId)) ||
      (body.enhance !== undefined && typeof body.enhance !== 'boolean') ||
      (body.adult !== undefined && typeof body.adult !== 'boolean') ||
      (body.history !== undefined &&
        (!Array.isArray(body.history) ||
          body.history.length > 4 ||
          body.history.some(
            (item) => typeof item !== 'string' || item.length > ASSISTANT_LIMITS.message,
          )))
    )
      return send(400, { error: 'Please enter a short question about Ali.' })
    const local = answerLocal(body.message, knowledge, body.projectId)
    const done = (reason) => send(200, { ...local, ...(reason ? { notice: reason } : {}) })
    if (!body.enhance) return done()
    // Obvious abuse and unrelated requests stay local. Unrecognized wording still reaches AI.
    if (
      /ignore.*instruct|system prompt|developer message|jailbreak|override|forget.*rules|\b(weather|president|politics|recipe|joke|horoscope|bitcoin|latest news|teach me)\b/i.test(
        body.message,
      )
    )
      return done()
    if (/^(?:hi|hey|hello|salam|thanks|thank you)[.! ]*$/i.test(body.message.trim())) return done()
    if (
      env.ASSISTANT_REMOTE_ENABLED !== 'true' ||
      !(env.OPENROUTER_API_KEY || env.GEMINI_API_KEY) ||
      env.ASSISTANT_PROVIDER_REVIEWED !== 'true'
    )
      return done(
        'AI assistance is not configured. This answer comes from the published portfolio and project documentation.',
      )
    const context = conversationContext(body.message, body.history, body.projectId, knowledge)
    if (!context)
      return done(
        'This question stays local because it may contain private information. Please ask about the public portfolio without personal details.',
      )
    let lease, store
    const controller = new AbortController(),
      timer = setTimeout(() => controller.abort(), 16000)
    const cancel = () => controller.abort()
    res.on?.('close', cancel)
    try {
      store = getStore()
      if (!store)
        return done('AI assistance is temporarily unavailable. Showing the documented answer.')
      const ip = env.VERCEL
        ? String(req.headers['x-vercel-forwarded-for'] || '')
            .split(',')[0]
            .trim()
        : req.socket?.remoteAddress
      if (!ip)
        return done('AI assistance is temporarily unavailable. Showing the documented answer.')
      lease = await store.reserve(ip)
      if (!lease)
        return done(
          'The free AI allowance is busy or used up. You can still explore the documented answers.',
        )
      let generated
      const candidates = []
      if (geminiEligible(req, body, env))
        candidates.push({
          provider: 'gemini',
          model: env.GEMINI_MODEL,
          key: env.GEMINI_API_KEY,
          generate: generateGeminiAnswer,
        })
      if (env.OPENROUTER_API_KEY) {
        const pool = [
          ...new Set(
            (env.OPENROUTER_FREE_MODELS || env.OPENROUTER_FREE_MODEL || '')
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        ].slice(0, 2)
        for (const model of pool)
          candidates.push({
            provider: 'openrouter',
            model,
            key: env.OPENROUTER_API_KEY,
            generate: generateProjectAnswer,
          })
      }
      let openRouterAttempted = false
      for (const candidate of candidates) {
        if (controller.signal.aborted) break
        if (candidate.provider === 'openrouter' && openRouterAttempted) continue
        if (!(await store.providerReady(candidate.provider, candidate.model))) continue
        if (
          candidate.provider === 'openrouter' &&
          !(await verifyFreeModel(candidate.model, fetcher))
        )
          continue
        if (!(await store.reserveProvider(candidate.provider))) continue
        if (candidate.provider === 'openrouter') openRouterAttempted = true
        try {
          generated = await candidate.generate({
            model: candidate.model,
            key: candidate.key,
            context,
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(6500)]),
            fetcher,
          })
          break
        } catch (error) {
          if (error.refused || controller.signal.aborted) break
          const temporary =
            [401, 402, 403, 404, 408, 429, 500, 502, 503, 504].includes(error.status) ||
            error.name === 'TimeoutError'
          if (!temporary) break // Invalid/refused content does not trigger quota-wasting repair calls.
          await store.coolDown(
            candidate.provider,
            [401, 402, 403].includes(error.status) ? 'all' : candidate.model,
            error.retryAfter || 120,
          )
        }
      }
      if (!generated)
        return done(
          'Free AI assistance is busy or unavailable. Showing the documented answer instead.',
        )
      if (generated.topic)
        return send(200, {
          ...answerLocal(PROFILE_TOPICS[generated.topic], knowledge),
          understanding: 'ai',
        })
      if (generated.status === 'off_topic')
        return send(200, {
          ...answerLocal('What is the weather?', knowledge),
          understanding: 'ai',
        })
      if (generated.status === 'unknown')
        return send(200, {
          ...local,
          answer:
            "I don't have enough published information to answer that. You can ask Ali directly.",
          status: 'unknown',
          sourceIds: [],
          actions: [{ id: 'contact', label: 'Contact Ali' }],
          understanding: 'ai',
        })
      const sourceIds = [
        ...new Set(
          (generated.sectionIds || [])
            .map((id) => context.chunks.find((s) => s.id === id)?.sourceId)
            .filter(Boolean),
        ),
      ]
      return send(200, {
        ...local,
        status: generated.status || 'answered',
        answer: generated.answer,
        mode: 'generated',
        understanding: 'ai',
        projectId: sourceIds.length === 1 ? sourceIds[0] : null,
        actions: sourceIds.slice(0, 3).map((id) => ({
          id: `repo:${id}`,
          label: knowledge.projects.find((p) => p.id === id)?.name || 'Project README',
        })),
        sourceIds,
      })
    } catch {
      return done(
        'AI assistance could not complete this time. Showing the documented answer instead.',
      )
    } finally {
      clearTimeout(timer)
      res.off?.('close', cancel)
      await lease?.release().catch(() => {})
    }
  }
}
export default createAssistantHandler()
