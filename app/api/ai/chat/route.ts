import { streamText } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, provider = 'openai' } = body

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 }
      )
    }

    const gatewayModel = provider === 'anthropic' 
      ? 'anthropic/claude-sonnet-4-20250514' 
      : 'openai/gpt-4o'

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
      messages,
      maxTokens: 2048,
      temperature: 0.7,
    })

    return result.toDataStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'chat',
        'X-ADR-AI-Model': gatewayModel,
      },
    })
  } catch (error) {
    console.error('[v0] Chat error:', error)
    return Response.json(
      { error: 'Chat processing failed' },
      { status: 500 }
    )
  }
}
