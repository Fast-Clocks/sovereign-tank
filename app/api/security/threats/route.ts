import { NextResponse } from 'next/server'
import { generateThreatVector, type ThreatVector } from '@/lib/security-engine'

export const runtime = 'nodejs'
export const maxDuration = 60

// Store recent threats in memory (would be Redis/DB in production)
let threatBuffer: ThreatVector[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50', 10)
  const severity = searchParams.get('severity')
  const type = searchParams.get('type')

  // Generate new threats if buffer is low
  while (threatBuffer.length < 100) {
    threatBuffer.push(generateThreatVector())
  }

  // Keep buffer manageable
  if (threatBuffer.length > 500) {
    threatBuffer = threatBuffer.slice(-200)
  }

  let threats = [...threatBuffer]

  // Apply filters
  if (severity) {
    threats = threats.filter(t => t.severity === severity)
  }
  if (type) {
    threats = threats.filter(t => t.type === type)
  }

  // Sort by timestamp descending and limit
  threats = threats
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  // Calculate summary stats
  const summary = {
    total: threats.length,
    bySeverity: {
      critical: threats.filter(t => t.severity === 'critical').length,
      high: threats.filter(t => t.severity === 'high').length,
      medium: threats.filter(t => t.severity === 'medium').length,
      low: threats.filter(t => t.severity === 'low').length,
    },
    byType: threats.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    mitigated: threats.filter(t => t.mitigated).length,
    mitigationRate: (threats.filter(t => t.mitigated).length / threats.length * 100).toFixed(2),
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    node: 'AU-WEST-1',
    threats,
    summary,
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-SEC-2.6',
      'X-ADR-Threat-Count': String(threats.length),
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST() {
  // Add a new threat (for simulation)
  const newThreat = generateThreatVector()
  threatBuffer.push(newThreat)

  return NextResponse.json({
    status: 'threat_logged',
    threat: newThreat,
  }, {
    status: 201,
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-SEC-2.6',
    },
  })
}
