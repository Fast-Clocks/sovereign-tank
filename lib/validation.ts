// Comprehensive input validation and sanitization library
// Australian Privacy Network - Security Stack

import { z } from 'zod'

// ============================================
// INPUT VALIDATION SCHEMAS
// ============================================

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email too long')
  .transform(val => val.toLowerCase().trim())

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(50, 'Username too long')
  .regex(/^[a-zA-Z0-9_.-]+$/, 'Username contains invalid characters')
  .transform(val => val.toLowerCase().trim())

export const domainSchema = z
  .string()
  .min(1, 'Domain required')
  .max(253, 'Domain too long')
  .regex(
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    'Invalid domain format'
  )
  .transform(val => val.toLowerCase().trim())

export const ipv4Schema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Invalid IPv4 address'
  )

export const ipv6Schema = z
  .string()
  .regex(
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/,
    'Invalid IPv6 address'
  )

export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9\s\-()]{8,20}$/, 'Invalid phone number format')
  .transform(val => val.replace(/[\s\-()]/g, ''))

export const australianPhoneSchema = z
  .string()
  .regex(/^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/, 'Invalid Australian phone number')
  .transform(val => val.replace(/[\s\-]/g, ''))

export const abnSchema = z
  .string()
  .regex(/^[0-9]{11}$/, 'ABN must be 11 digits')
  .refine(val => validateABN(val), 'Invalid ABN checksum')

export const acnSchema = z
  .string()
  .regex(/^[0-9]{9}$/, 'ACN must be 9 digits')
  .refine(val => validateACN(val), 'Invalid ACN checksum')

// ============================================
// AUSTRALIAN BUSINESS NUMBER VALIDATION
// ============================================

function validateABN(abn: string): boolean {
  if (!/^\d{11}$/.test(abn)) return false
  
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  let sum = 0
  
  for (let i = 0; i < 11; i++) {
    let digit = parseInt(abn[i], 10)
    if (i === 0) digit -= 1 // Subtract 1 from first digit
    sum += digit * weights[i]
  }
  
  return sum % 89 === 0
}

function validateACN(acn: string): boolean {
  if (!/^\d{9}$/.test(acn)) return false
  
  const weights = [8, 7, 6, 5, 4, 3, 2, 1]
  let sum = 0
  
  for (let i = 0; i < 8; i++) {
    sum += parseInt(acn[i], 10) * weights[i]
  }
  
  const checkDigit = (10 - (sum % 10)) % 10
  return parseInt(acn[8], 10) === checkDigit
}

// ============================================
// SANITIZATION FUNCTIONS
// ============================================

export function sanitizeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }
  
  return input.replace(/[&<>"'`=/]/g, char => htmlEntities[char] || char)
}

export function sanitizeSql(input: string): string {
  // Escape SQL special characters
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z')
}

export function sanitizeFilename(input: string): string {
  // Remove path traversal and dangerous characters
  return input
    .replace(/\.\./g, '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .replace(/^\.+/, '')
    .slice(0, 255)
}

export function sanitizeUrl(input: string): string | null {
  try {
    const url = new URL(input)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null
    }
    
    // Check for suspicious patterns
    if (url.username || url.password) {
      return null
    }
    
    return url.toString()
  } catch {
    return null
  }
}

// ============================================
// PII DETECTION
// ============================================

export interface PIIDetectionResult {
  hasPII: boolean
  types: PIIType[]
  matches: PIIMatch[]
  riskScore: number
}

export interface PIIMatch {
  type: PIIType
  value: string
  masked: string
  position: { start: number; end: number }
}

export type PIIType = 
  | 'email'
  | 'phone'
  | 'ssn'
  | 'tfn'
  | 'medicare'
  | 'creditCard'
  | 'passport'
  | 'driversLicense'
  | 'ipAddress'
  | 'dateOfBirth'
  | 'address'

const PII_PATTERNS: Record<PIIType, { pattern: RegExp; risk: number }> = {
  email: { 
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 
    risk: 3 
  },
  phone: { 
    pattern: /\b(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}\b/g, 
    risk: 3 
  },
  tfn: { 
    pattern: /\b[0-9]{3}[ -]?[0-9]{3}[ -]?[0-9]{3}\b/g, 
    risk: 10  // Australian Tax File Number - highest risk
  },
  medicare: { 
    pattern: /\b[0-9]{4}[ -]?[0-9]{5}[ -]?[0-9]{1}[ -]?[0-9]?\b/g, 
    risk: 8  // Medicare number
  },
  creditCard: { 
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g, 
    risk: 9 
  },
  ssn: { 
    pattern: /\b[0-9]{3}[-]?[0-9]{2}[-]?[0-9]{4}\b/g, 
    risk: 10  // US SSN
  },
  passport: { 
    pattern: /\b[A-Z]{1,2}[0-9]{6,9}\b/g, 
    risk: 8 
  },
  driversLicense: { 
    pattern: /\b[A-Z]{1,3}[0-9]{5,8}\b/g, 
    risk: 7 
  },
  ipAddress: { 
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, 
    risk: 2 
  },
  dateOfBirth: { 
    pattern: /\b(?:0[1-9]|[12][0-9]|3[01])[\/\-](?:0[1-9]|1[0-2])[\/\-](?:19|20)[0-9]{2}\b/g, 
    risk: 4 
  },
  address: { 
    pattern: /\b\d{1,5}\s+[\w\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|court|ct|place|pl)\b/gi, 
    risk: 5 
  },
}

export function detectPII(text: string): PIIDetectionResult {
  const matches: PIIMatch[] = []
  const types: Set<PIIType> = new Set()
  let riskScore = 0
  
  for (const [type, { pattern, risk }] of Object.entries(PII_PATTERNS) as [PIIType, { pattern: RegExp; risk: number }][]) {
    let match
    const regex = new RegExp(pattern.source, pattern.flags)
    
    while ((match = regex.exec(text)) !== null) {
      types.add(type)
      riskScore += risk
      
      matches.push({
        type,
        value: match[0],
        masked: maskPII(match[0], type),
        position: { start: match.index, end: match.index + match[0].length },
      })
    }
  }
  
  return {
    hasPII: matches.length > 0,
    types: Array.from(types),
    matches,
    riskScore: Math.min(riskScore, 100),
  }
}

function maskPII(value: string, type: PIIType): string {
  switch (type) {
    case 'email': {
      const [local, domain] = value.split('@')
      return `${local[0]}***@${domain}`
    }
    case 'phone':
      return value.slice(0, 4) + '****' + value.slice(-2)
    case 'creditCard':
      return '****-****-****-' + value.slice(-4)
    case 'tfn':
    case 'ssn':
      return '***-***-' + value.slice(-3)
    default:
      return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2)
  }
}

// ============================================
// REQUEST VALIDATION
// ============================================

export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: string[]
}

export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data)
    
    if (result.success) {
      return { success: true, data: result.data }
    }
    
    return {
      success: false,
      errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
    }
  } catch (error) {
    return {
      success: false,
      errors: ['Validation error occurred'],
    }
  }
}

// ============================================
// COMMON REQUEST SCHEMAS
// ============================================

export const scanRequestSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  domain: domainSchema.optional(),
  options: z.object({
    includeBreaches: z.boolean().default(true),
    includeDataBrokers: z.boolean().default(true),
    includeDarkWeb: z.boolean().default(false),
    includeSocialMedia: z.boolean().default(true),
  }).optional(),
}).refine(
  data => data.email || data.username || data.domain,
  'At least one of email, username, or domain is required'
)

export const purgeRequestSchema = z.object({
  targetType: z.enum(['data_broker', 'search_engine', 'social_media', 'other']),
  targetName: z.string().min(1).max(200),
  personalInfo: z.object({
    fullName: z.string().min(2).max(200),
    email: emailSchema,
    phone: australianPhoneSchema.optional(),
    address: z.string().max(500).optional(),
  }),
  evidence: z.array(z.string().url()).max(10).optional(),
  legalBasis: z.enum([
    'APP_12_access',
    'APP_13_correction', 
    'APP_11_erasure',
    'NDB_notification',
    'OAIC_complaint',
  ]),
})

export const aiRequestSchema = z.object({
  prompt: z.string().min(1).max(10000),
  provider: z.enum(['openai', 'anthropic', 'google', 'groq']).default('openai'),
  capability: z.enum([
    'threat_analysis',
    'privacy_scan',
    'document_analysis',
    'removal_strategy',
    'legal_drafting',
    'anomaly_detection',
    'predictive_threat',
    'nlp_query',
  ]).default('threat_analysis'),
  context: z.record(z.unknown()).optional(),
})
