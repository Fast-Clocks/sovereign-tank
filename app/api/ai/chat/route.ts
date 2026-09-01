import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

type AIProvider = 'openai' | 'anthropic'

const PROVIDER_MODELS: Record<AIProvider, string> = {
  openai: 'openai/gpt-4o',
  anthropic: 'anthropic/claude-sonnet-4-20250514',
}

function isAIProvider(value: unknown): value is AIProvider {
  return value === 'openai' || value === 'anthropic'
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: UIMessage[]
      provider?: unknown
    }
    const { messages } = body
    const provider: AIProvider = isAIProvider(body.provider) ? body.provider : 'openai'

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 },
      )
    }

    const gatewayModel = PROVIDER_MODELS[provider]

    const systemPrompt = `${SYSTEM_PROMPTS['nlp-query']}

You are the ADR Command AI - an intelligent assistant for the Australian Data Removal platform.
You have access to the following capabilities:
- Privacy exposure scanning and analysis
- Data broker intelligence and removal strategies
- Threat analysis and prediction
- Legal document drafting under Australian law
- Natural language querying of privacy data

When users ask about their privacy status, data exposures, or removal progress, provide helpful and actionable responses.
Always maintain a professional, security-focused tone.
Reference Australian privacy law (Privacy Act 1988, APPs) where relevant.

Current system status: OPERATIONAL
Active monitoring: 4,200+ data brokers globally
Legal framework: Australian Privacy Principles (APPs) 1-13`

    const result = streamText({
      model: gatewayModel,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 2048,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'chat',
        'X-ADR-AI-Model': gatewayModel,
      },
    })
  } catch (error) {
    console.error('[ADR AI] Chat error:', error)
    return Response.json(
      { error: 'Chat processing failed' },
      { status: 500 },
    )
  }
}
