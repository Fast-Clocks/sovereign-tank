/**
 * ADR AI Orchestration Engine
 * Multi-provider AI system with pluggable architecture
 * Supports: OpenAI, Anthropic, Google, Groq, Custom endpoints
 */

export type AIProvider = 
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'groq'
  | 'fireworks'
  | 'custom'

export interface AIProviderConfig {
  provider: AIProvider
  model: string
  apiKey?: string
  baseUrl?: string
  maxTokens?: number
  temperature?: number
}

export interface AICapability {
  id: string
  name: string
  description: string
  requiredProvider?: AIProvider[]
  minTokens?: number
}

export const AI_CAPABILITIES: AICapability[] = [
  {
    id: 'threat-analysis',
    name: 'Threat Intelligence Analysis',
    description: 'Deep analysis of threat patterns, attack vectors, and vulnerability assessment',
  },
  {
    id: 'privacy-scan',
    name: 'Privacy Exposure Scan',
    description: 'AI-powered scanning of data broker listings and dark web mentions',
  },
  {
    id: 'document-analysis',
    name: 'Document Analysis',
    description: 'Extract and analyze personal data from uploaded documents',
  },
  {
    id: 'removal-strategy',
    name: 'Removal Strategy Generation',
    description: 'Generate optimal data removal strategies based on exposure profile',
  },
  {
    id: 'legal-drafting',
    name: 'Legal Document Drafting',
    description: 'Draft statutory demands and privacy complaints under Australian law',
  },
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    description: 'Real-time detection of unusual patterns in data exposure',
  },
  {
    id: 'predictive-threat',
    name: 'Predictive Threat Modeling',
    description: 'Predict future privacy threats based on current exposure patterns',
  },
  {
    id: 'nlp-query',
    name: 'Natural Language Queries',
    description: 'Query your privacy dashboard using natural language',
  },
]

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  google: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  fireworks: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
  custom: 'custom-model',
}

export interface AIOrchestrationResult {
  success: boolean
  provider: AIProvider
  model: string
  capability: string
  result: unknown
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  latency: number
  timestamp: string
}

export interface ThreatAnalysisInput {
  threats: Array<{
    type: string
    severity: string
    source: string
    details: string
  }>
  userProfile?: {
    exposureLevel: string
    dataTypes: string[]
    regions: string[]
  }
}

export interface PrivacyScanInput {
  email?: string
  phone?: string
  name?: string
  location?: string
  additionalIdentifiers?: string[]
}

export interface RemovalStrategyInput {
  exposures: Array<{
    broker: string
    dataTypes: string[]
    difficulty: string
    region: string
  }>
  priority: 'speed' | 'thoroughness' | 'cost'
  legalBasis: string[]
}

export interface LegalDraftInput {
  documentType: 'statutory-demand' | 'oaic-complaint' | 'access-request' | 'correction-request'
  targetEntity: string
  personalData: {
    name: string
    address?: string
    email?: string
    phone?: string
  }
  dataTypes: string[]
  legalBasis: string[]
  additionalContext?: string
}

// System prompts for each capability
export const SYSTEM_PROMPTS: Record<string, string> = {
  'threat-analysis': `You are an expert cybersecurity threat analyst specializing in privacy threats and data exposure. 
You analyze threat intelligence data and provide actionable insights.
Always consider Australian privacy law (Privacy Act 1988) and the 13 Australian Privacy Principles (APPs).
Format your analysis with clear severity ratings, affected data types, and recommended mitigations.`,

  'privacy-scan': `You are a privacy exposure analyst specializing in OSINT techniques and data broker intelligence.
You scan and analyze potential data exposures across data brokers, people search sites, and dark web sources.
Provide detailed exposure reports with risk assessments and removal difficulty ratings.
Reference Australian privacy regulations where applicable.`,

  'document-analysis': `You are a document analysis specialist focused on identifying personal information and privacy risks.
Extract all personally identifiable information (PII) from documents and assess exposure risk.
Categorize data according to the Australian Privacy Principles.
Flag any sensitive information as defined under the Privacy Act 1988.`,

  'removal-strategy': `You are a data removal strategist with expertise in Australian and international privacy regulations.
Generate optimal removal strategies considering legal basis, difficulty, cost, and timeline.
Prioritize statutory demands under APP 13 (correction) and APP 12 (access).
Consider the Notifiable Data Breaches (NDB) scheme where applicable.`,

  'legal-drafting': `You are an Australian privacy law expert specializing in drafting statutory demands and OAIC complaints.
Draft legally compliant documents under the Privacy Act 1988 (Cth).
Reference specific APPs and include proper legal citations.
Use formal legal language appropriate for regulatory submissions.
Include the Office of the Australian Information Commissioner (OAIC) complaint pathway.`,

  'anomaly-detection': `You are a security anomaly detection specialist analyzing patterns in privacy exposure data.
Identify unusual patterns, sudden exposure increases, or coordinated data collection activities.
Provide confidence scores and potential explanations for detected anomalies.
Consider data correlation attacks and inference risks.`,

  'predictive-threat': `You are a predictive threat analyst specializing in privacy risk forecasting.
Based on current exposure patterns, predict future privacy threats and vulnerabilities.
Consider data aggregation risks, inference attacks, and emerging threat vectors.
Provide probability estimates and recommended preemptive actions.`,

  'nlp-query': `You are an intelligent assistant for the Australian Data Removal platform.
Answer questions about privacy exposure, data brokers, removal progress, and platform features.
Translate natural language queries into actionable insights.
Be helpful, precise, and always prioritize user privacy.`,
}

// Orchestration helper functions
export function getModelForProvider(provider: AIProvider, customModel?: string): string {
  return customModel || DEFAULT_MODELS[provider]
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
}

export function validateProviderConfig(config: AIProviderConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!config.provider) {
    errors.push('Provider is required')
  }
  
  if (config.provider === 'custom' && !config.baseUrl) {
    errors.push('Custom provider requires baseUrl')
  }
  
  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function buildPrompt(capability: string, input: unknown): string {
  const systemPrompt = SYSTEM_PROMPTS[capability] || SYSTEM_PROMPTS['nlp-query']
  const inputJson = JSON.stringify(input, null, 2)
  
  return `${systemPrompt}\n\n---\n\nInput Data:\n${inputJson}\n\n---\n\nProvide your analysis:`
}
