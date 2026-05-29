import { streamText } from 'ai'
import { 
  AIProvider, 
  AIProviderConfig, 
  SYSTEM_PROMPTS, 
  getModelForProvider,
  AIOrchestrationResult 
} from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

// AI Gateway model strings for each provider
function getGatewayModel(provider: AIProvider, model?: string): string {
  switch (provider) {
    case 'openai':
      return model || 'openai/gpt-4o'
    case 'anthropic':
      return model || 'anthropic/claude-sonnet-4-20250514'
    case 'google':
      return model || 'google/gemini-2.0-flash'
    case 'groq':
      return model || 'groq/llama-3.3-70b-versatile'
    case 'fireworks':
      return model || 'fireworks/llama-v3p1-70b-instruct'
    default:
      return 'openai/gpt-4o'
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      capability, 
      input, 
      provider = 'openai',
      model,
      stream = true,
      maxTokens = 4096,
      temperature = 0.7,
    } = body

    if (!capability || !input) {
      return Response.json(
        { error: 'Missing required fields: capability, input' },
        { status: 400 }
      )
    }

    const systemPrompt = SYSTEM_PROMPTS[capability] || SYSTEM_PROMPTS['nlp-query']
    const gatewayModel = getGatewayModel(provider, model)

    const startTime = Date.now()

    if (stream) {
      const result = streamText({
        model: gatewayModel,
        system: systemPrompt,
        prompt: typeof input === 'string' ? input : JSON.stringify(input, null, 2),
        maxTokens,
        temperature,
      })

      return result.toDataStreamResponse({
        headers: {
          'X-ADR-AI-Provider': provider,
          'X-ADR-AI-Model': gatewayModel,
          'X-ADR-AI-Capability': capability,
        },
      })
    }

    // Non-streaming response
    const result = await streamText({
      model: gatewayModel,
      system: systemPrompt,
      prompt: typeof input === 'string' ? input : JSON.stringify(input, null, 2),
      maxTokens,
      temperature,
    })

    const text = await result.text
    const latency = Date.now() - startTime

    const response: AIOrchestrationResult = {
      success: true,
      provider,
      model: gatewayModel,
      capability,
      result: text,
      tokens: {
        prompt: 0, // Would need usage tracking
        completion: 0,
        total: 0,
      },
      latency,
      timestamp: new Date().toISOString(),
    }

    return Response.json(response, {
      headers: {
        'X-ADR-AI-Provider': provider,
        'X-ADR-AI-Model': gatewayModel,
        'X-ADR-AI-Capability': capability,
        'X-ADR-AI-Latency': latency.toString(),
      },
    })
  } catch (error) {
    console.error('[v0] AI orchestration error:', error)
    return Response.json(
      { 
        error: 'AI processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({
    service: 'ADR AI Orchestration Engine',
    version: '2.0.0',
    capabilities: Object.keys(SYSTEM_PROMPTS),
    providers: ['openai', 'anthropic', 'google', 'groq', 'fireworks', 'custom'],
    defaultProvider: 'openai',
    endpoints: {
      orchestrate: 'POST /api/ai',
      analyze: 'POST /api/ai/analyze',
      scan: 'POST /api/ai/scan',
      draft: 'POST /api/ai/draft',
      predict: 'POST /api/ai/predict',
      chat: 'POST /api/ai/chat',
    },
    documentation: '/llms.txt',
  })
}
