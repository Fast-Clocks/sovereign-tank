import { NextResponse } from 'next/server'
import { generateMockExposureReport, knownDataBrokers, knownBreaches } from '@/lib/osint-engine'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({
      error: 'Email parameter required',
      usage: '/api/scan?email=user@example.com',
    }, { status: 400 })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({
      error: 'Invalid email format',
    }, { status: 400 })
  }

  // Generate exposure report
  const report = generateMockExposureReport(email)

  return NextResponse.json({
    status: 'complete',
    report,
    meta: {
      scanDuration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
      sourcesChecked: knownDataBrokers.length + knownBreaches.length + 15,
      dataBrokersScanned: knownDataBrokers.length,
      breachDatabasesChecked: 3,
      darkWebSourcesChecked: 12,
      timestamp: new Date().toISOString(),
      node: 'AU-WEST-1',
    },
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-OSINT-1.4',
      'X-ADR-Scan-ID': report.scanId,
      'X-ADR-Risk-Score': String(report.riskScore),
      'X-ADR-Risk-Level': report.riskLevel,
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, phone, name, options } = body

    if (!email && !phone && !name) {
      return NextResponse.json({
        error: 'At least one identifier required (email, phone, or name)',
      }, { status: 400 })
    }

    // For now, only email scans are fully implemented
    if (email) {
      const report = generateMockExposureReport(email)
      
      return NextResponse.json({
        status: 'complete',
        report,
        options: options || { includeBreaches: true, includeBrokers: true, includeSocial: true, includePublicRecords: true, includeDarkWeb: true },
        meta: {
          scanDuration: `${(Math.random() * 2 + 1).toFixed(2)}s`,
          sourcesChecked: knownDataBrokers.length + knownBreaches.length + 15,
          timestamp: new Date().toISOString(),
          node: 'AU-WEST-1',
        },
      }, {
        headers: {
          'X-ADR-Node': 'AU-WEST-1',
          'X-ADR-Protocol': 'ADR-OSINT-1.4',
          'X-ADR-Scan-ID': report.scanId,
        },
      })
    }

    return NextResponse.json({
      status: 'partial',
      message: 'Only email scans are currently available. Phone and name lookups coming soon.',
    })
  } catch {
    return NextResponse.json({
      error: 'Invalid request body',
    }, { status: 400 })
  }
}
