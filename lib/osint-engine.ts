'use server'

// =============================================================================
// ADR OSINT ENGINE - Privacy Intelligence & Breach Detection
// =============================================================================

export interface BreachRecord {
  id: string
  name: string
  domain: string
  breachDate: string
  addedDate: string
  modifiedDate: string
  pwnCount: number
  description: string
  dataClasses: string[]
  isVerified: boolean
  isFabricated: boolean
  isSensitive: boolean
  isRetired: boolean
  isSpamList: boolean
  logoPath?: string
}

export interface ExposureReport {
  id: string
  scanId: string
  timestamp: string
  subject: {
    email?: string
    phone?: string
    name?: string
    address?: string
  }
  findings: {
    breaches: BreachRecord[]
    dataBrokers: DataBrokerExposure[]
    socialProfiles: SocialProfile[]
    publicRecords: PublicRecord[]
    darkWebMentions: DarkWebMention[]
  }
  riskScore: number
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
  exposureBits: number // Information entropy measurement
  recommendations: string[]
}

export interface DataBrokerExposure {
  brokerId: string
  brokerName: string
  brokerUrl: string
  category: 'people-search' | 'marketing' | 'background-check' | 'data-aggregator' | 'recruitment' | 'ai-training'
  dataTypes: string[]
  optOutUrl?: string
  optOutDifficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'impossible'
  lastVerified: string
  estimatedRecords: number
  supportsAutomatedRemoval: boolean
  jurisdiction: string[]
}

export interface SocialProfile {
  platform: string
  username: string
  profileUrl: string
  isPublic: boolean
  dataExposed: string[]
  followerCount?: number
  lastActive?: string
}

export interface PublicRecord {
  type: 'court' | 'property' | 'voter' | 'business' | 'license' | 'marriage' | 'bankruptcy'
  source: string
  jurisdiction: string
  recordDate: string
  summary: string
  dataExposed: string[]
}

export interface DarkWebMention {
  id: string
  source: 'paste' | 'forum' | 'marketplace' | 'dump'
  marketplace?: string
  firstSeen: string
  lastSeen: string
  credentialType?: string
  priceUsd?: number
  isPasswordExposed: boolean
  isHashedPassword: boolean
  hashType?: string
  associatedBreaches: string[]
}

export interface ScanRequest {
  type: 'email' | 'phone' | 'name' | 'full'
  target: string
  options?: {
    includeBreaches?: boolean
    includeBrokers?: boolean
    includeSocial?: boolean
    includePublicRecords?: boolean
    includeDarkWeb?: boolean
    deepScan?: boolean
  }
}

// Known data broker database
export const knownDataBrokers: Omit<DataBrokerExposure, 'dataTypes'>[] = [
  { brokerId: 'DB-001', brokerName: 'Whitepages', brokerUrl: 'whitepages.com', category: 'people-search', optOutUrl: 'whitepages.com/suppression-requests', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 275000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-002', brokerName: 'Spokeo', brokerUrl: 'spokeo.com', category: 'people-search', optOutUrl: 'spokeo.com/optout', optOutDifficulty: 'easy', lastVerified: '2026-05-28', estimatedRecords: 120000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-003', brokerName: 'BeenVerified', brokerUrl: 'beenverified.com', category: 'background-check', optOutUrl: 'beenverified.com/app/optout/search', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 350000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-004', brokerName: 'Intelius', brokerUrl: 'intelius.com', category: 'people-search', optOutUrl: 'intelius.com/opt-out', optOutDifficulty: 'hard', lastVerified: '2026-05-28', estimatedRecords: 200000000, supportsAutomatedRemoval: false, jurisdiction: ['US'] },
  { brokerId: 'DB-005', brokerName: 'PeopleFinder', brokerUrl: 'peoplefinder.com', category: 'people-search', optOutUrl: 'peoplefinder.com/optout', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 150000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-006', brokerName: 'TruePeopleSearch', brokerUrl: 'truepeoplesearch.com', category: 'people-search', optOutUrl: 'truepeoplesearch.com/removal', optOutDifficulty: 'easy', lastVerified: '2026-05-28', estimatedRecords: 100000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-007', brokerName: 'FastPeopleSearch', brokerUrl: 'fastpeoplesearch.com', category: 'people-search', optOutUrl: 'fastpeoplesearch.com/removal', optOutDifficulty: 'easy', lastVerified: '2026-05-28', estimatedRecords: 80000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-008', brokerName: 'Radaris', brokerUrl: 'radaris.com', category: 'people-search', optOutUrl: 'radaris.com/control/privacy', optOutDifficulty: 'hard', lastVerified: '2026-05-28', estimatedRecords: 250000000, supportsAutomatedRemoval: false, jurisdiction: ['US'] },
  { brokerId: 'DB-009', brokerName: 'MyLife', brokerUrl: 'mylife.com', category: 'people-search', optOutUrl: 'mylife.com/ccpa/index', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 220000000, supportsAutomatedRemoval: false, jurisdiction: ['US'] },
  { brokerId: 'DB-010', brokerName: 'USSearch', brokerUrl: 'ussearch.com', category: 'background-check', optOutUrl: 'ussearch.com/privacy/optout', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 180000000, supportsAutomatedRemoval: true, jurisdiction: ['US'] },
  { brokerId: 'DB-011', brokerName: 'Acxiom', brokerUrl: 'acxiom.com', category: 'data-aggregator', optOutUrl: 'isapps.acxiom.com/optout', optOutDifficulty: 'hard', lastVerified: '2026-05-28', estimatedRecords: 2500000000, supportsAutomatedRemoval: false, jurisdiction: ['US', 'EU', 'AU'] },
  { brokerId: 'DB-012', brokerName: 'Oracle Data Cloud', brokerUrl: 'oracle.com/data-cloud', category: 'data-aggregator', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 5000000000, supportsAutomatedRemoval: false, jurisdiction: ['US', 'EU', 'AU', 'APAC'] },
  { brokerId: 'DB-013', brokerName: 'Experian', brokerUrl: 'experian.com', category: 'background-check', optOutUrl: 'experian.com/privacy/opting-out', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 1200000000, supportsAutomatedRemoval: false, jurisdiction: ['US', 'EU', 'AU', 'UK'] },
  { brokerId: 'DB-014', brokerName: 'Equifax', brokerUrl: 'equifax.com', category: 'background-check', optOutUrl: 'equifax.com/personal/privacy', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 800000000, supportsAutomatedRemoval: false, jurisdiction: ['US', 'EU', 'AU', 'CA'] },
  { brokerId: 'DB-015', brokerName: 'Clearview AI', brokerUrl: 'clearview.ai', category: 'ai-training', optOutDifficulty: 'impossible', lastVerified: '2026-05-28', estimatedRecords: 30000000000, supportsAutomatedRemoval: false, jurisdiction: ['US'] },
  { brokerId: 'DB-016', brokerName: 'PimEyes', brokerUrl: 'pimeyes.com', category: 'ai-training', optOutUrl: 'pimeyes.com/en/opt-out-request', optOutDifficulty: 'hard', lastVerified: '2026-05-28', estimatedRecords: 900000000, supportsAutomatedRemoval: false, jurisdiction: ['EU'] },
  // Australian specific
  { brokerId: 'DB-AU-001', brokerName: 'White Pages AU', brokerUrl: 'whitepages.com.au', category: 'people-search', optOutUrl: 'whitepages.com.au/privacy', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 25000000, supportsAutomatedRemoval: true, jurisdiction: ['AU'] },
  { brokerId: 'DB-AU-002', brokerName: 'Reverse Australia', brokerUrl: 'reverseaustralia.com', category: 'people-search', optOutUrl: 'reverseaustralia.com/optout', optOutDifficulty: 'medium', lastVerified: '2026-05-28', estimatedRecords: 18000000, supportsAutomatedRemoval: true, jurisdiction: ['AU'] },
  { brokerId: 'DB-AU-003', brokerName: 'AnyWho AU', brokerUrl: 'anywho.com.au', category: 'people-search', optOutDifficulty: 'easy', lastVerified: '2026-05-28', estimatedRecords: 12000000, supportsAutomatedRemoval: true, jurisdiction: ['AU'] },
  { brokerId: 'DB-AU-004', brokerName: 'Illion', brokerUrl: 'illion.com.au', category: 'background-check', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 45000000, supportsAutomatedRemoval: false, jurisdiction: ['AU', 'NZ'] },
  { brokerId: 'DB-AU-005', brokerName: 'Equifax AU', brokerUrl: 'equifax.com.au', category: 'background-check', optOutUrl: 'equifax.com.au/personal/privacy', optOutDifficulty: 'very-hard', lastVerified: '2026-05-28', estimatedRecords: 35000000, supportsAutomatedRemoval: false, jurisdiction: ['AU'] },
]

// Simulated breach database (based on real breach patterns)
export const knownBreaches: Omit<BreachRecord, 'id'>[] = [
  { name: 'LinkedIn', domain: 'linkedin.com', breachDate: '2021-06-22', addedDate: '2021-06-29', modifiedDate: '2021-06-29', pwnCount: 700000000, description: 'In June 2021, a massive data scraping operation exposed the personal data of 700 million LinkedIn users.', dataClasses: ['Email addresses', 'Names', 'Phone numbers', 'Physical addresses', 'Genders', 'Employers', 'Job titles'], isVerified: true, isFabricated: false, isSensitive: false, isRetired: false, isSpamList: false },
  { name: 'Facebook', domain: 'facebook.com', breachDate: '2019-04-01', addedDate: '2021-04-03', modifiedDate: '2021-04-03', pwnCount: 533000000, description: 'In April 2021, personal data of 533 million Facebook users was found posted in a hacking forum.', dataClasses: ['Email addresses', 'Phone numbers', 'Names', 'Dates of birth', 'Genders', 'Geographic locations'], isVerified: true, isFabricated: false, isSensitive: false, isRetired: false, isSpamList: false },
  { name: 'Optus', domain: 'optus.com.au', breachDate: '2022-09-22', addedDate: '2022-09-24', modifiedDate: '2022-10-01', pwnCount: 9800000, description: 'In September 2022, Australian telco Optus suffered a massive data breach exposing customer PII including passport and drivers licence numbers.', dataClasses: ['Email addresses', 'Phone numbers', 'Names', 'Dates of birth', 'Physical addresses', 'Government issued IDs', 'Passport numbers'], isVerified: true, isFabricated: false, isSensitive: true, isRetired: false, isSpamList: false },
  { name: 'Medibank', domain: 'medibank.com.au', breachDate: '2022-10-13', addedDate: '2022-10-20', modifiedDate: '2022-11-10', pwnCount: 9700000, description: 'In October 2022, Australian health insurer Medibank was breached, with sensitive health records and claims data stolen.', dataClasses: ['Email addresses', 'Phone numbers', 'Names', 'Health records', 'Physical addresses', 'Dates of birth', 'Medicare numbers'], isVerified: true, isFabricated: false, isSensitive: true, isRetired: false, isSpamList: false },
  { name: 'Latitude Financial', domain: 'latitudefinancial.com.au', breachDate: '2023-03-16', addedDate: '2023-03-20', modifiedDate: '2023-04-01', pwnCount: 14000000, description: 'In March 2023, Latitude Financial disclosed a breach affecting 14 million customers across Australia and New Zealand.', dataClasses: ['Email addresses', 'Phone numbers', 'Names', 'Dates of birth', 'Physical addresses', 'Government issued IDs', 'Passport numbers', 'Financial records'], isVerified: true, isFabricated: false, isSensitive: true, isRetired: false, isSpamList: false },
  { name: 'Canva', domain: 'canva.com', breachDate: '2019-05-24', addedDate: '2019-06-18', modifiedDate: '2019-06-18', pwnCount: 137000000, description: 'In May 2019, the graphic design tool website Canva suffered a data breach that impacted 137 million users.', dataClasses: ['Email addresses', 'Names', 'Usernames', 'Passwords', 'Geographic locations'], isVerified: true, isFabricated: false, isSensitive: false, isRetired: false, isSpamList: false },
  { name: 'Dropbox', domain: 'dropbox.com', breachDate: '2012-07-01', addedDate: '2016-08-31', modifiedDate: '2016-08-31', pwnCount: 68648009, description: 'In mid-2012, Dropbox suffered a data breach which exposed credentials of over 68 million accounts.', dataClasses: ['Email addresses', 'Passwords'], isVerified: true, isFabricated: false, isSensitive: false, isRetired: false, isSpamList: false },
  { name: 'Adobe', domain: 'adobe.com', breachDate: '2013-10-04', addedDate: '2013-12-04', modifiedDate: '2022-05-11', pwnCount: 153000000, description: 'In October 2013, 153 million Adobe accounts were breached with IDs, usernames, emails, encrypted passwords and password hints.', dataClasses: ['Email addresses', 'Password hints', 'Passwords', 'Usernames'], isVerified: true, isFabricated: false, isSensitive: false, isRetired: false, isSpamList: false },
]

export function calculateExposureBits(findings: ExposureReport['findings']): number {
  let bits = 0
  
  // Each data class adds entropy
  const uniqueDataClasses = new Set<string>()
  
  findings.breaches.forEach(b => b.dataClasses.forEach(dc => uniqueDataClasses.add(dc)))
  findings.dataBrokers.forEach(db => db.dataTypes.forEach(dt => uniqueDataClasses.add(dt)))
  findings.socialProfiles.forEach(sp => sp.dataExposed.forEach(de => uniqueDataClasses.add(de)))
  findings.publicRecords.forEach(pr => pr.dataExposed.forEach(de => uniqueDataClasses.add(de)))
  
  // Base bits per data class
  const dataClassBits: Record<string, number> = {
    'Email addresses': 8,
    'Passwords': 24,
    'Phone numbers': 12,
    'Physical addresses': 16,
    'Names': 6,
    'Dates of birth': 14,
    'Government issued IDs': 32,
    'Passport numbers': 32,
    'Medicare numbers': 28,
    'Financial records': 24,
    'Health records': 28,
    'Social Security numbers': 32,
    'Credit card numbers': 28,
    'Bank account numbers': 24,
  }
  
  uniqueDataClasses.forEach(dc => {
    bits += dataClassBits[dc] || 8
  })
  
  // Dark web mentions multiply risk
  if (findings.darkWebMentions.length > 0) {
    bits *= 1.5
  }
  
  return Math.round(bits)
}

export function calculateRiskScore(exposureBits: number, findings: ExposureReport['findings']): number {
  let score = Math.min(exposureBits / 2, 50)
  
  // Breach severity
  const sensitiveBreaches = findings.breaches.filter(b => b.isSensitive).length
  score += sensitiveBreaches * 10
  
  // Data broker exposure
  score += Math.min(findings.dataBrokers.length * 2, 20)
  
  // Dark web presence
  score += findings.darkWebMentions.length * 5
  
  // Public records
  score += Math.min(findings.publicRecords.length * 3, 15)
  
  return Math.min(Math.round(score), 100)
}

export function getRiskLevel(score: number): ExposureReport['riskLevel'] {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

export function generateMockExposureReport(email: string): ExposureReport {
  const randomBreaches = knownBreaches
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 5) + 1)
    .map((b, i) => ({ ...b, id: `BRH-${i}` }))

  const randomBrokers = knownDataBrokers
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 10) + 5)
    .map(b => ({
      ...b,
      dataTypes: ['Email addresses', 'Phone numbers', 'Physical addresses', 'Names']
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1),
    }))

  const findings: ExposureReport['findings'] = {
    breaches: randomBreaches,
    dataBrokers: randomBrokers,
    socialProfiles: [
      { platform: 'LinkedIn', username: email.split('@')[0], profileUrl: 'linkedin.com/in/' + email.split('@')[0], isPublic: true, dataExposed: ['Names', 'Employers', 'Job titles', 'Email addresses'] },
      { platform: 'Facebook', username: email.split('@')[0], profileUrl: 'facebook.com/' + email.split('@')[0], isPublic: Math.random() > 0.5, dataExposed: ['Names', 'Photos', 'Friends list'] },
    ],
    publicRecords: [
      { type: 'voter', source: 'Australian Electoral Commission', jurisdiction: 'AU', recordDate: '2024-01-15', summary: 'Voter registration record', dataExposed: ['Names', 'Physical addresses'] },
    ],
    darkWebMentions: Math.random() > 0.7 ? [
      { id: 'DW-001', source: 'dump', firstSeen: '2024-06-15', lastSeen: '2026-02-20', isPasswordExposed: true, isHashedPassword: true, hashType: 'bcrypt', associatedBreaches: ['LinkedIn'] },
    ] : [],
  }

  const exposureBits = calculateExposureBits(findings)
  const riskScore = calculateRiskScore(exposureBits, findings)

  return {
    id: `EXP-${Date.now()}`,
    scanId: `SCN-${Date.now()}`,
    timestamp: new Date().toISOString(),
    subject: { email },
    findings,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    exposureBits,
    recommendations: [
      'Change passwords for all breached accounts immediately',
      'Enable two-factor authentication where available',
      'Submit data removal requests to identified data brokers',
      'Consider a credit freeze with major bureaus',
      'Monitor accounts for suspicious activity',
      'Use a password manager with unique passwords',
    ],
  }
}
