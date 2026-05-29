import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Security headers configuration - maximum protection
const securityHeaders = {
  // HSTS - Force HTTPS for 2 years including subdomains
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // CSP - Strict content security policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://api.stripe.com https://*.vercel.app https://*.vercel-insights.com wss:",
    "frame-src 'self' https://js.stripe.com https://vercel.live",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer Policy - strict privacy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy - disable dangerous features
  'Permissions-Policy': [
    'accelerometer=()',
    'camera=()',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'payment=(self)',
    'usb=()',
    'interest-cohort=()',
  ].join(', '),
  
  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Cache control for sensitive pages
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  
  // ADR Security Headers
  'X-ADR-Security-Level': 'MAXIMUM',
  'X-ADR-Compliance': 'Privacy-Act-1988-APP-11',
}

// Rate limiting store (in production use Redis/Upstash)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMITS = {
  api: { requests: 100, windowMs: 60000 },      // 100 req/min for API
  auth: { requests: 5, windowMs: 60000 },       // 5 req/min for auth
  scan: { requests: 10, windowMs: 60000 },      // 10 req/min for scans
  default: { requests: 200, windowMs: 60000 },  // 200 req/min default
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `${ip}:${request.nextUrl.pathname}`
}

function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/ai') || pathname.startsWith('/api/scan') || pathname.startsWith('/api/osint')) {
    return RATE_LIMITS.scan
  }
  if (pathname.startsWith('/api/auth')) {
    return RATE_LIMITS.auth
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMITS.api
  }
  return RATE_LIMITS.default
}

function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetIn: number } {
  const key = getRateLimitKey(request)
  const config = getRateLimitConfig(request.nextUrl.pathname)
  const now = Date.now()
  
  const entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return { allowed: true, remaining: config.requests - 1, resetIn: config.windowMs }
  }
  
  if (entry.count >= config.requests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now }
  }
  
  entry.count++
  return { allowed: true, remaining: config.requests - entry.count, resetIn: entry.resetTime - now }
}

// Input sanitization patterns
const MALICIOUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // Script injection
  /javascript:/gi,                                         // JS protocol
  /on\w+\s*=/gi,                                          // Event handlers
  /data:text\/html/gi,                                    // Data URI HTML
  /vbscript:/gi,                                          // VBScript
  /expression\s*\(/gi,                                    // CSS expression
  /url\s*\(\s*['"]*\s*data:/gi,                          // CSS data URI
  /<!--[\s\S]*?-->/g,                                     // HTML comments
  /<!\[CDATA\[[\s\S]*?\]\]>/gi,                          // CDATA
  /\x00/g,                                                // Null bytes
  /(?:union|select|insert|update|delete|drop|truncate|alter|exec|execute)\s+/gi,  // SQL
  /\$\{.*\}/g,                                            // Template injection
  /\{\{.*\}\}/g,                                          // Template injection
  /%00/g,                                                 // URL encoded null
  /\\x00/g,                                               // Escaped null
]

function detectMaliciousInput(input: string): { safe: boolean; threats: string[] } {
  const threats: string[] = []
  
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      threats.push(pattern.source.slice(0, 30) + '...')
    }
    pattern.lastIndex = 0 // Reset regex state
  }
  
  return { safe: threats.length === 0, threats }
}

// Security audit logging
function logSecurityEvent(request: NextRequest, event: string, details: Record<string, unknown>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    ip: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: request.nextUrl.pathname,
    method: request.method,
    ...details,
  }
  
  // In production, send to SIEM/logging service
  console.log('[ADR-SECURITY]', JSON.stringify(logEntry))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }
  
  // Rate limiting check
  const rateLimit = checkRateLimit(request)
  
  if (!rateLimit.allowed) {
    logSecurityEvent(request, 'RATE_LIMIT_EXCEEDED', { remaining: 0 })
    
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please wait before retrying.',
        retryAfter: Math.ceil(rateLimit.resetIn / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Date.now() + rateLimit.resetIn),
        },
      }
    )
  }
  
  // Check for malicious input in URL
  const urlCheck = detectMaliciousInput(decodeURIComponent(request.nextUrl.toString()))
  if (!urlCheck.safe) {
    logSecurityEvent(request, 'MALICIOUS_URL_DETECTED', { threats: urlCheck.threats })
    
    return new NextResponse(
      JSON.stringify({
        error: 'Bad Request',
        message: 'Potentially malicious input detected.',
        code: 'SECURITY_VIOLATION',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  
  // Check request headers for anomalies
  const userAgent = request.headers.get('user-agent') || ''
  const suspiciousAgents = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'gobuster', 'dirbuster']
  
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    logSecurityEvent(request, 'SUSPICIOUS_USER_AGENT', { userAgent })
    
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden', message: 'Access denied.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }
  
  // Create response with security headers
  const response = NextResponse.next()
  
  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
  response.headers.set('X-RateLimit-Reset', String(Date.now() + rateLimit.resetIn))
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-ID', requestId)
  
  // Log successful request
  if (pathname.startsWith('/api/')) {
    logSecurityEvent(request, 'API_REQUEST', { requestId, rateLimit: rateLimit.remaining })
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
