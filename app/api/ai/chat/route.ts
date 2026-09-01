import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

const PROVIDER_CONFIG = {
  openai: {
    model: 'openai/gpt-4o',
    gatewayProvider: 'openai',
  },
  anthropic: {
    model: 'anthropic/claude-sonnet-4',
    gatewayProvider: 'anthropic',
  },
  google: {
    model: 'google/gemini-2.0-flash',
    gatewayProvider: 'google',
  },
  groq: {
    model: 'meta/llama-3.3-70b',
    gatewayProvider: 'groq',
  },
} as const

type AIProvider = keyof typeof PROVIDER_CONFIG

function isAIProvider(value: unknown): value is AIProvider {
  return typeof value === 'string' && value in PROVIDER_CONFIG
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: UIMessage[]
      provider?: unknown
    }
    const { messages } = body

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 },
      )
    }

    if (body.provider !== undefined && !isAIProvider(body.provider)) {
      return Response.json(
        { error: 'Unsupported AI provider' },
        { status: 400 },
      )
    }

    const provider: AIProvider = body.provider ?? 'openai'
    const configuration = PROVIDER_CONFIG[provider]

    const systemPrompt = `${SYSTEM_PROMPTS['nlp-query']}

You are the ADR Privacy Assistant for an Australian privacy software prototype.
Provide careful, practical, general information. You are not a lawyer and must
not describe your output as legal advice or a substitute for professional advice.

Evidence and capability rules:
- Do not claim that you searched, scanned, monitored, verified, removed or accessed
  any live account, data broker, breach database, dark-web source or external system
  unless verified tool results are supplied in the current request.
- Do not invent exposure findings, removal progress, operational status, customer
  records, metrics, provider availability or legal outcomes.
- When the user asks for a scan without verified scan data, explain that no live scan
  occurred and provide a safe assessment plan, checklist or interpretation framework.
- Distinguish confirmed facts, user-provided information, assumptions and examples.
- Treat legal-document drafting as a clearly labelled starting template requiring
  review for the user's facts, jurisdiction and current law.
- Do not solicit secrets, passwords, authentication codes, full payment-card details
  or unnecessary sensitive personal information.

Where relevant, explain the Privacy Act 1988 and Australian Privacy Principles in
plain language, but state uncertainty and recommend an appropriately qualified
professional for fact-specific legal conclusions.`

    const result = streamText({
      model: configuration.model,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 2048,
      temperature: 0.4,
      providerOptions: {
        gateway: {
          only: [configuration.gatewayProvider],
        },
      },
    })

    return result.toUIMessageStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'general-guidance',
        'X-ADR-AI-Model': configuration.model,
        'X-ADR-AI-Provider': configuration.gatewayProvider,
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
