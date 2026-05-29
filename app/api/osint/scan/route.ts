import { NextResponse } from 'next/server'
import { runComprehensiveScan, KNOWN_BREACHES, DATA_BROKERS, SOCIAL_PLATFORMS } from '@/lib/osint-scanner'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, username, phone, fullName, scanType = 'comprehensive' } = body

    if (!email && !username && !phone && !fullName) {
      return NextResponse.json({
        success: false,
        error: 'At least one search parameter required (email, username, phone, or fullName)',
      }, { status: 400 })
    }

    const result = await runComprehensiveScan({
      email,
      username,
      phone,
      fullName,
    })

    return NextResponse.json({
      success: true,
      ...result,
      meta: {
        breachDatabaseSize: KNOWN_BREACHES.length,
        dataBrokersMonitored: DATA_BROKERS.length,
        socialPlatformsChecked: SOCIAL_PLATFORMS.length,
        scanType,
        apiVersion: '2.0',
        node: 'AU-WEST-1',
      }
    }, {
      headers: {
        'X-ADR-Node': 'AU-WEST-1',
        'X-ADR-Scan-ID': result.scanId,
        'X-ADR-Protocol': 'SOVEREIGN-2.0',
      }
    })
  } catch (error) {
    console.error('[v0] OSINT scan error:', error)
    return NextResponse.json({
      success: false,
      error: 'Scan failed. Please try again.',
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'ADR OSINT Scanner',
    version: '2.0',
    endpoints: {
      scan: 'POST /api/osint/scan - Run comprehensive OSINT scan',
      breaches: 'GET /api/osint/breaches - Get breach database',
      brokers: 'GET /api/osint/brokers - Get data broker database',
      darkweb: 'GET /api/osint/darkweb - Dark web monitoring status',
    },
    capabilities: [
      'Breach detection (10+ major breaches including Optus, Medibank, Latitude)',
      'Username search across 50+ platforms (Sherlock-style)',
      'Data broker exposure detection (30+ brokers)',
      'Dark web mention monitoring',
      'Risk scoring and recommendations',
    ],
    stats: {
      breachesTracked: KNOWN_BREACHES.length,
      brokersMonitored: DATA_BROKERS.length,
      platformsSearched: SOCIAL_PLATFORMS.length,
    },
    compliance: {
      privacyAct: 'Privacy Act 1988 (Cth)',
      apps: 'Australian Privacy Principles 1-13',
      ndb: 'Notifiable Data Breaches Scheme',
    }
  })
}
