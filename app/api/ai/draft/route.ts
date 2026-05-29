import { streamText } from 'ai'
import { SYSTEM_PROMPTS } from '@/lib/ai-orchestrator'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      documentType,
      targetEntity,
      personalData,
      dataTypes,
      legalBasis,
      additionalContext,
      provider = 'anthropic', // Anthropic preferred for legal drafting
    } = body

    if (!documentType || !targetEntity || !personalData) {
      return Response.json(
        { error: 'Missing required fields: documentType, targetEntity, personalData' },
        { status: 400 }
      )
    }

    const gatewayModel = provider === 'anthropic' 
      ? 'anthropic/claude-sonnet-4-20250514' 
      : 'openai/gpt-4o'

    const documentTemplates: Record<string, string> = {
      'statutory-demand': `
Draft a formal statutory demand letter under the Privacy Act 1988 (Cth) requesting the deletion of personal information.

Include:
1. Formal header with date and reference number
2. Clear identification of the data subject (using provided details)
3. Specific reference to APP 13 (Correction of personal information)
4. Clear statement of the data requested for deletion
5. Legal basis under Australian privacy law
6. Deadline for compliance (30 days as per OAIC guidelines)
7. Warning of OAIC complaint if non-compliant
8. Contact details for response

Format as a professional legal letter.`,
      
      'oaic-complaint': `
Draft a formal complaint to the Office of the Australian Information Commissioner (OAIC).

Include:
1. Complainant details
2. Respondent (target entity) details
3. Summary of the complaint
4. Relevant APP breaches (cite specific principles)
5. Timeline of events
6. Previous attempts to resolve with the entity
7. Requested outcome
8. Supporting documentation list

Format according to OAIC complaint requirements.`,

      'access-request': `
Draft a formal access request under APP 12 (Access to personal information).

Include:
1. Clear statement of the request under APP 12
2. Identification of the data subject
3. Types of information requested
4. Preferred format for receiving information
5. Reference to 30-day response requirement
6. Statement regarding reasonable charges

Format as a formal request letter.`,

      'correction-request': `
Draft a formal correction request under APP 13 (Correction of personal information).

Include:
1. Clear statement of the request under APP 13
2. Identification of the incorrect information
3. Correct information to replace it
4. Evidence supporting the correction
5. Request for notification to third parties if disclosed

Format as a formal request letter.`,
    }

    const draftPrompt = `
${documentTemplates[documentType] || documentTemplates['statutory-demand']}

TARGET ENTITY: ${targetEntity}

PERSONAL DATA OF DATA SUBJECT:
${JSON.stringify(personalData, null, 2)}

DATA TYPES TO ADDRESS:
${dataTypes?.join(', ') || 'All personal information held'}

LEGAL BASIS:
${legalBasis?.join(', ') || 'Privacy Act 1988 (Cth), Australian Privacy Principles'}

${additionalContext ? `ADDITIONAL CONTEXT:\n${additionalContext}` : ''}

Draft the complete document now. Use formal legal language and proper formatting.
Include the ABN of Australian Data Removal: 86 921 751 764
Entity: Christopher Robinson (Sole Trader)
Contact: hello@ausdataremoval.com.au
`

    const result = streamText({
      model: gatewayModel,
      system: SYSTEM_PROMPTS['legal-drafting'],
      prompt: draftPrompt,
      maxTokens: 4096,
      temperature: 0.2, // Low temperature for legal precision
    })

    return result.toDataStreamResponse({
      headers: {
        'X-ADR-AI-Capability': 'legal-drafting',
        'X-ADR-AI-Model': gatewayModel,
        'X-ADR-Document-Type': documentType,
      },
    })
  } catch (error) {
    console.error('[v0] Legal drafting error:', error)
    return Response.json(
      { error: 'Legal drafting failed' },
      { status: 500 }
    )
  }
}
