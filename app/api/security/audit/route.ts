import { NextRequest, NextResponse } from 'next/server'
import { runFullSecurityAudit, runOWASPSecurityScan, runPrivacyActScan, runInfrastructureScan, runEssentialEightScan, runPenetrationTest } from '@/lib/security-scanner'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const scanType = searchParams.get('type') || 'full'
  const target = searchParams.get('target') || request.nextUrl.origin
  
  try {
    let result
    
    switch (scanType) {
      case 'owasp':
        result = {
          scanType: 'OWASP API Security Top 10',
          timestamp: new Date().toISOString(),
          checks: await runOWASPSecurityScan(target),
        }
        break
        
      case 'privacy':
        result = {
          scanType: 'Australian Privacy Act 1988',
          timestamp: new Date().toISOString(),
          checks: await runPrivacyActScan(),
        }
        break
        
      case 'infrastructure':
        result = {
          scanType: 'Infrastructure Security',
          timestamp: new Date().toISOString(),
          checks: await runInfrastructureScan(),
        }
        break
        
      case 'essential8':
        result = {
          scanType: 'ASD Essential Eight',
          timestamp: new Date().toISOString(),
          checks: await runEssentialEightScan(),
        }
        break
        
      case 'pentest':
        result = await runPenetrationTest(target)
        break
        
      case 'full':
      default:
        result = await runFullSecurityAudit(target)
        break
    }
    
    return NextResponse.json(result, {
      headers: {
        'X-ADR-Audit-Type': scanType,
        'X-ADR-Compliance': 'Privacy-Act-1988-APP-11',
      },
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Security scan failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { target, scanTypes = ['full'], options = {} } = body
    
    const results: Record<string, unknown> = {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      target: target || request.nextUrl.origin,
      scans: {},
    }
    
    for (const scanType of scanTypes) {
      switch (scanType) {
        case 'owasp':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            owasp: await runOWASPSecurityScan(target || request.nextUrl.origin),
          }
          break
        case 'privacy':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            privacy: await runPrivacyActScan(),
          }
          break
        case 'infrastructure':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            infrastructure: await runInfrastructureScan(),
          }
          break
        case 'essential8':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            essential8: await runEssentialEightScan(),
          }
          break
        case 'pentest':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            pentest: await runPenetrationTest(target || request.nextUrl.origin),
          }
          break
        case 'full':
          results.scans = {
            ...results.scans as Record<string, unknown>,
            full: await runFullSecurityAudit(target || request.nextUrl.origin),
          }
          break
      }
    }
    
    return NextResponse.json(results, {
      headers: {
        'X-ADR-Audit-ID': results.requestId as string,
      },
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Security scan failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
