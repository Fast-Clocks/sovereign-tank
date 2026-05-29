import { streamText } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      threats,
      userProfile,
      provider = 'openai',
      model,
    } = body

    if (!threats || !Array.isArray(threats)) {
      return Response.json(
        { error: 'Missing or invalid threats array' },
        { status: 400 }
      )
    }

    const gatewayModel = model || (provider === 'anthropic' 
      ? 'anthropic/claude-sonnet-4-20250514' 
      : 'openai/gpt-4o')

    const analysisPrompt = `
Analyze the following threat data and provide a comprehensive security assessment:

THREATS:
${JSON.stringify(threats, null, 2)}

${userProfile ? `USER PROFILE:
${JSON.stringify(userProfile, null, 2)}` : ''}

Provide your analysis in the following JSON structure:
{
  "overallRiskScore": <0-100>,
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "summary": "<executive summary>",
  "threatBreakdown": [
    {
      "threat": "<threat name>",
      "severity": "<severity>",
      "likelihood": "<probability>",
      "impact": "<potential impact>",
      "mitigation": "<recommended action>"
    }
  ],
  "patterns": ["<identified patterns>"],
  "predictions": [
    {
      "threat": "<predicted threat>",
      "probability": <0-1>,
      "timeframe": "<when>",
      "preventiveAction": "<action>"
    }
  ],
  "immediateActions": ["<urgent actions>"],
  "longTermRecommendations": ["<strategic recommendations>"],
  "australianLawRelevance": {
    "applicableAPPs": ["<APP numbers>"],
    "potentialBreaches": ["<potential privacy breaches>"],
    "oaicReportable": <boolean>,
    "ndbSchemeApplicable": <boolean>
  }
}
`

    const result = streamText({
      model: gatewayModel,
      system: SYSTEM_PROMPTS['threat-analysis'],
      prompt: analysisPrompt,
      maxTokens: 4096,
      temperature: 0.3,
    })

    return result.toDataStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'threat-analysis',
        'X-ADR-AI-Model': gatewayModel,
      },
    })
  } catch (error) {
    console.error('[v0] Threat analysis error:', error)
    return Response.json(
      { error: 'Threat analysis failed' },
      { status: 500 }
    )
  }
}
