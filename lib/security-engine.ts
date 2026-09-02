// Utility library - not a server action

// =============================================================================
// ADR SECURITY ENGINE - Cloudflare-Grade Infrastructure
// =============================================================================

export interface ThreatVector {
  id: string
  type: 'DDoS' | 'SQLi' | 'XSS' | 'BotNet' | 'Scraper' | 'DataExfil' | 'BruteForce' | 'Phishing'
  severity: 'critical' | 'high' | 'medium' | 'low'
  origin: {
    country: string
    countryCode: string
    asn: string
    asnOrg: string
    ip: string
    city?: string
  }
  target: string
  timestamp: string
  mitigated: boolean
  attackVector: string
  bytesBlocked: number
  requestsBlocked: number
}

export interface SecurityMetrics {
  totalRequests24h: number
  blockedRequests24h: number
  uniqueThreats24h: number
  mitigationRate: number
  avgResponseTime: number
  bandwidthServed: string
  bandwidthSaved: string
  cacheHitRate: number
  sslCertStatus: 'valid' | 'expiring' | 'expired'
  sslGrade: 'A+' | 'A' | 'B' | 'C' | 'F'
  wafRulesActive: number
  wafRulesTriggered: number
  botScore: {
    likely_human: number
    likely_automated: number
    verified_bot: number
  }
  httpVersionDistribution: {
    http1: number
    http2: number
    http3: number
  }
  topThreatCountries: Array<{
    country: string
    countryCode: string
    attacks: number
    blocked: number
  }>
  topAttackTypes: Array<{
    type: string
    count: number
    percentage: number
  }>
}

export interface FirewallRule {
  id: string
  name: string
  expression: string
  action: 'block' | 'challenge' | 'js_challenge' | 'managed_challenge' | 'allow' | 'log'
  enabled: boolean
  priority: number
  lastTriggered?: string
  triggerCount: number
}

export interface RateLimitRule {
  id: string
  name: string
  threshold: number
  period: number // seconds
  action: 'block' | 'challenge' | 'simulate'
  enabled: boolean
  characteristics: string[]
  countingExpression?: string
}

// Simulated real-time threat generation
export function generateThreatVector(): ThreatVector {
  const types: ThreatVector['type'][] = ['DDoS', 'SQLi', 'XSS', 'BotNet', 'Scraper', 'DataExfil', 'BruteForce', 'Phishing']
  const severities: ThreatVector['severity'][] = ['critical', 'high', 'medium', 'low']
  
  const origins = [
    { country: 'China', countryCode: 'CN', asn: 'AS4134', asnOrg: 'CHINANET', city: 'Shanghai' },
    { country: 'Russia', countryCode: 'RU', asn: 'AS12389', asnOrg: 'ROSTELECOM', city: 'Moscow' },
    { country: 'United States', countryCode: 'US', asn: 'AS7922', asnOrg: 'COMCAST', city: 'Denver' },
    { country: 'India', countryCode: 'IN', asn: 'AS9829', asnOrg: 'BSNL', city: 'Mumbai' },
    { country: 'Brazil', countryCode: 'BR', asn: 'AS28573', asnOrg: 'CLARO', city: 'São Paulo' },
    { country: 'Indonesia', countryCode: 'ID', asn: 'AS17974', asnOrg: 'TELKOMNET', city: 'Jakarta' },
    { country: 'Vietnam', countryCode: 'VN', asn: 'AS45899', asnOrg: 'VNPT', city: 'Hanoi' },
    { country: 'Iran', countryCode: 'IR', asn: 'AS44244', asnOrg: 'IRANCELL', city: 'Tehran' },
    { country: 'North Korea', countryCode: 'KP', asn: 'AS131279', asnOrg: 'STAR-KP', city: 'Pyongyang' },
    { country: 'Nigeria', countryCode: 'NG', asn: 'AS29465', asnOrg: 'MTN-NG', city: 'Lagos' },
  ]

  const attackVectors = [
    'TCP SYN Flood',
    'UDP Amplification',
    'HTTP GET Flood',
    'Slowloris',
    'DNS Query Flood',
    'NTP Amplification',
    'Credential Stuffing',
    'SQL Injection (UNION)',
    'XSS Reflected',
    'Path Traversal',
    'XML External Entity',
    'Server-Side Request Forgery',
    'Command Injection',
    'LDAP Injection',
  ]

  const origin = origins[Math.floor(Math.random() * origins.length)]

  return {
    id: `THR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    origin: {
      ...origin,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    },
    target: '/api/brokers',
    timestamp: new Date().toISOString(),
    mitigated: Math.random() > 0.15, // 85% mitigation rate
    attackVector: attackVectors[Math.floor(Math.random() * attackVectors.length)],
    bytesBlocked: Math.floor(Math.random() * 10000000),
    requestsBlocked: Math.floor(Math.random() * 50000),
  }
}

export function generateSecurityMetrics(): SecurityMetrics {
  return {
    totalRequests24h: 847293847 + Math.floor(Math.random() * 1000000),
    blockedRequests24h: 12847293 + Math.floor(Math.random() * 100000),
    uniqueThreats24h: 4827 + Math.floor(Math.random() * 500),
    mitigationRate: 99.7 + Math.random() * 0.29,
    avgResponseTime: 12 + Math.floor(Math.random() * 8),
    bandwidthServed: `${(2.4 + Math.random() * 0.5).toFixed(2)} TB`,
    bandwidthSaved: `${(890 + Math.floor(Math.random() * 100))} GB`,
    cacheHitRate: 94.2 + Math.random() * 4,
    sslCertStatus: 'valid',
    sslGrade: 'A+',
    wafRulesActive: 847,
    wafRulesTriggered: 12847 + Math.floor(Math.random() * 1000),
    botScore: {
      likely_human: 78.4 + Math.random() * 5,
      likely_automated: 18.2 + Math.random() * 3,
      verified_bot: 3.4 + Math.random() * 1,
    },
    httpVersionDistribution: {
      http1: 8.2,
      http2: 67.4,
      http3: 24.4,
    },
    topThreatCountries: [
      { country: 'China', countryCode: 'CN', attacks: 284729, blocked: 283847 },
      { country: 'Russia', countryCode: 'RU', attacks: 184729, blocked: 184293 },
      { country: 'United States', countryCode: 'US', attacks: 94827, blocked: 92847 },
      { country: 'India', countryCode: 'IN', attacks: 84729, blocked: 84293 },
      { country: 'Brazil', countryCode: 'BR', attacks: 48729, blocked: 48293 },
      { country: 'Indonesia', countryCode: 'ID', attacks: 38729, blocked: 38293 },
      { country: 'Vietnam', countryCode: 'VN', attacks: 28729, blocked: 28293 },
      { country: 'Iran', countryCode: 'IR', attacks: 18729, blocked: 18293 },
    ],
    topAttackTypes: [
      { type: 'DDoS', count: 584729, percentage: 45.2 },
      { type: 'SQLi', count: 184729, percentage: 14.3 },
      { type: 'XSS', count: 124729, percentage: 9.7 },
      { type: 'BotNet', count: 94729, percentage: 7.3 },
      { type: 'BruteForce', count: 84729, percentage: 6.6 },
      { type: 'Scraper', count: 74729, percentage: 5.8 },
      { type: 'Phishing', count: 64729, percentage: 5.0 },
      { type: 'DataExfil', count: 54729, percentage: 4.2 },
    ],
  }
}

export const defaultFirewallRules: FirewallRule[] = [
  {
    id: 'FW-001',
    name: 'Block Known Malicious IPs',
    expression: '(ip.src in $cf.malicious_ips)',
    action: 'block',
    enabled: true,
    priority: 1,
    triggerCount: 847293,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-002',
    name: 'Challenge Suspicious Bots',
    expression: '(cf.bot_score lt 30) and not cf.verified_bot_category',
    action: 'managed_challenge',
    enabled: true,
    priority: 2,
    triggerCount: 284729,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-003',
    name: 'Block SQL Injection Attempts',
    expression: '(http.request.uri.query contains "UNION" and http.request.uri.query contains "SELECT")',
    action: 'block',
    enabled: true,
    priority: 3,
    triggerCount: 94827,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-004',
    name: 'Protect API Endpoints',
    expression: '(http.request.uri.path contains "/api/") and (not ip.src in $whitelist)',
    action: 'challenge',
    enabled: true,
    priority: 4,
    triggerCount: 184729,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-005',
    name: 'Block Data Broker Scrapers',
    expression: '(http.user_agent contains "scrapy") or (http.user_agent contains "crawler") or (http.user_agent contains "spider")',
    action: 'block',
    enabled: true,
    priority: 5,
    triggerCount: 384729,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-006',
    name: 'Geo-Block High-Risk Countries',
    expression: '(ip.geoip.country in {"KP" "IR" "SY" "CU"})',
    action: 'block',
    enabled: true,
    priority: 6,
    triggerCount: 48729,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-007',
    name: 'Rate Limit Authentication',
    expression: '(http.request.uri.path eq "/api/auth") and (rate(1m) gt 10)',
    action: 'block',
    enabled: true,
    priority: 7,
    triggerCount: 28729,
    lastTriggered: new Date().toISOString(),
  },
  {
    id: 'FW-008',
    name: 'Block Tor Exit Nodes',
    expression: '(ip.src in $cf.tor_exit_nodes) and not (http.request.uri.path contains "/public/")',
    action: 'managed_challenge',
    enabled: true,
    priority: 8,
    triggerCount: 18729,
    lastTriggered: new Date().toISOString(),
  },
]

export const defaultRateLimitRules: RateLimitRule[] = [
  {
    id: 'RL-001',
    name: 'API Rate Limit',
    threshold: 100,
    period: 60,
    action: 'block',
    enabled: true,
    characteristics: ['ip.src', 'http.request.headers["x-api-key"]'],
  },
  {
    id: 'RL-002',
    name: 'Login Rate Limit',
    threshold: 5,
    period: 300,
    action: 'challenge',
    enabled: true,
    characteristics: ['ip.src'],
    countingExpression: '(http.request.uri.path eq "/api/auth/login")',
  },
  {
    id: 'RL-003',
    name: 'Purge Request Limit',
    threshold: 10,
    period: 3600,
    action: 'block',
    enabled: true,
    characteristics: ['ip.src', 'http.request.headers["authorization"]'],
    countingExpression: '(http.request.uri.path contains "/api/purge")',
  },
]
