import { NextResponse } from 'next/server'
import { generateSecurityMetrics, defaultFirewallRules, defaultRateLimitRules } from '@/lib/security-engine'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const include = searchParams.get('include')?.split(',') || ['metrics', 'firewall', 'ratelimit']

  const response: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    node: 'AU-WEST-1',
    protocol: 'ADR-SEC-2.6',
  }

  if (include.includes('metrics')) {
    response.metrics = generateSecurityMetrics()
  }

  if (include.includes('firewall')) {
    response.firewall = {
      rules: defaultFirewallRules,
      totalRules: defaultFirewallRules.length,
      activeRules: defaultFirewallRules.filter(r => r.enabled).length,
    }
  }

  if (include.includes('ratelimit')) {
    response.rateLimit = {
      rules: defaultRateLimitRules,
      totalRules: defaultRateLimitRules.length,
      activeRules: defaultRateLimitRules.filter(r => r.enabled).length,
    }
  }

  return NextResponse.json(response, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-SEC-2.6',
      'X-ADR-WAF-Mode': 'active',
      'X-ADR-DDoS-Protection': 'enabled',
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
