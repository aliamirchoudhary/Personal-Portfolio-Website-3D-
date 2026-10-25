import 'dotenv/config'
import { verifyFreeModel, GEMINI_FREE_MODELS } from '../server/assistant-providers.js'
const env = process.env
async function main() {
  const selectedModel = (env.OPENROUTER_FREE_MODELS || env.OPENROUTER_FREE_MODEL || '')
    .split(',')[0]
    .trim()
  if (process.argv.includes('--list-free')) {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    })
    if (!response.ok) throw Error(`Catalog unavailable (${response.status}).`)
    const data = await response.json()
    console.log(
      JSON.stringify(
        data.data
          .filter(
            (model) =>
              model.id.endsWith(':free') &&
              model.pricing &&
              ['prompt', 'completion'].every(
                (key) => model.pricing[key] !== undefined && Number(model.pricing[key]) === 0,
              ) &&
              Object.values(model.pricing).every((price) => Number(price) === 0),
          )
          .map((model) => ({ id: model.id, context: model.context_length })),
        null,
        2,
      ),
    )
    return
  }
  if (!env.OPENROUTER_API_KEY)
    throw Error(
      'Add OPENROUTER_API_KEY to an ignored environment file. Never paste keys into chat or commit them.',
    )
  if (!(await verifyFreeModel(selectedModel)))
    throw Error(
      'OPENROUTER_FREE_MODEL must name a verified zero-price :free catalog entry; no paid fallback is allowed.',
    )
  const response = await fetch('https://openrouter.ai/api/v1/key', {
    headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}` },
    signal: AbortSignal.timeout(5000),
    redirect: 'error',
  })
  if (!response.ok)
    throw Error(
      `OpenRouter key preflight failed (${response.status}). No inference request was made.`,
    )
  const data = (await response.json()).data
  console.log(
    JSON.stringify(
      {
        model: selectedModel,
        gemini: {
          configured: !!env.GEMINI_API_KEY,
          model: env.GEMINI_MODEL,
          approvedFreeModel: GEMINI_FREE_MODELS.has(env.GEMINI_MODEL),
        },
        freeTier: data?.is_free_tier,
        freeRequests:
          data?.free_model_daily_requests || 'Check the account dashboard; quota was not supplied.',
        remoteEnabled: env.ASSISTANT_REMOTE_ENABLED === 'true',
        sharedLimiterConfigured: !!(
          env.UPSTASH_REDIS_REST_URL &&
          env.UPSTASH_REDIS_REST_TOKEN &&
          env.ASSISTANT_RATE_LIMIT_SECRET
        ),
      },
      null,
      2,
    ),
  )
}
await main()
