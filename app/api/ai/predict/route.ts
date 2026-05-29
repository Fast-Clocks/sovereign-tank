import { streamText } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      currentExposures,
      historicalData,
      userBehavior,
      provider = 'openai',
    } = body

    if (!currentExposures) {
      return Response.json(
        { error: 'Missing required field: currentExposures' },
        { status: 400 }
      )
    }

    const gatewayModel = provider === 'anthropic' 
      ? 'anthropic/claude-sonnet-4-20250514' 
      : 'openai/gpt-4o'

    const predictionPrompt = `
Analyze the following privacy exposure data and predict future threats:

CURRENT EXPOSURES:
${JSON.stringify(currentExposures, null, 2)}

${historicalData ? `HISTORICAL DATA:
${JSON.stringify(historicalData, null, 2)}` : ''}

${userBehavior ? `USER BEHAVIOR PATTERNS:
${JSON.stringify(userBehavior, null, 2)}` : ''}

Provide predictions in the following JSON structure:
{
  "predictionConfidence": <0-1>,
  "analysisTimestamp": "<ISO timestamp>",
  "shortTermPredictions": [
    {
      "threat": "<predicted threat>",
      "probability": <0-1>,
      "timeframe": "1-7 days",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "preventiveAction": "<recommended action>",
      "indicators": ["<early warning signs>"]
    }
  ],
  "mediumTermPredictions": [
    {
      "threat": "<predicted threat>",
      "probability": <0-1>,
      "timeframe": "1-4 weeks",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "preventiveAction": "<recommended action>",
      "riskFactors": ["<contributing factors>"]
    }
  ],
  "longTermPredictions": [
    {
      "threat": "<predicted threat>",
      "probability": <0-1>,
      "timeframe": "1-6 months",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "strategicAction": "<strategic recommendation>",
      "trends": ["<emerging patterns>"]
    }
  ],
  "aggregationRisks": [
    {
      "dataSources": ["<sources that could be combined>"],
      "inferredData": ["<what could be inferred>"],
      "probability": <0-1>,
      "mitigation": "<how to prevent>"
    }
  ],
  "emergingThreats": [
    {
      "threatType": "<new threat category>",
      "description": "<threat description>",
      "relevance": <0-1>,
      "preparedness": "<recommended preparation>"
    }
  ],
  "overallRiskTrajectory": "INCREASING" | "STABLE" | "DECREASING",
  "recommendedActions": [
    {
      "priority": 1-10,
      "action": "<specific action>",
      "impact": "HIGH" | "MEDIUM" | "LOW",
      "effort": "HIGH" | "MEDIUM" | "LOW",
      "deadline": "<suggested deadline>"
    }
  ]
}

Consider:
- Data broker aggregation patterns
- Dark web marketplace cycles
- Seasonal fraud patterns (tax time, holiday shopping)
- New data breach announcements
- Social engineering attack trends
- Australian regulatory changes
`

    const result = streamText({
      model: gatewayModel,
      system: SYSTEM_PROMPTS['predictive-threat'],
      prompt: predictionPrompt,
      maxTokens: 4096,
      temperature: 0.4,
    })

    return result.toDataStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'predictive-threat',
        'X-ADR-AI-Model': gatewayModel,
      },
    })
  } catch (error) {
    console.error('[v0] Prediction error:', error)
    return Response.json(
      { error: 'Threat prediction failed' },
      { status: 500 }
    )
  }
}
