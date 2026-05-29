import { NextResponse } from 'next/server'
import { knownBreaches } from '@/lib/osint-engine'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const domain = searchParams.get('domain')
  const sensitive = searchParams.get('sensitive')
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  let breaches = knownBreaches.map((b, i) => ({ ...b, id: `BRH-${i}` }))

  // Apply filters
  if (domain) {
    breaches = breaches.filter(b => b.domain.includes(domain.toLowerCase()))
  }
  if (sensitive === 'true') {
    breaches = breaches.filter(b => b.isSensitive)
  }

  // Sort by breach date descending
  breaches = breaches
    .sort((a, b) => new Date(b.breachDate).getTime() - new Date(a.breachDate).getTime())
    .slice(0, limit)

  // If email provided, simulate checking against breaches
  let emailExposure = null
  if (email) {
    const exposedIn = breaches
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 1)
    
    emailExposure = {
      email,
      exposedInBreaches: exposedIn.length,
      breaches: exposedIn.map(b => ({
        name: b.name,
        domain: b.domain,
        breachDate: b.breachDate,
        dataClasses: b.dataClasses,
        isSensitive: b.isSensitive,
      })),
      totalRecordsExposed: exposedIn.reduce((acc, b) => acc + b.pwnCount, 0),
    }
  }

  // Summary stats
  const summary = {
    totalBreaches: breaches.length,
    totalRecordsExposed: breaches.reduce((acc, b) => acc + b.pwnCount, 0),
    sensitiveBreaches: breaches.filter(b => b.isSensitive).length,
    australianBreaches: breaches.filter(b => 
      b.domain.includes('.au') || 
      b.name.toLowerCase().includes('optus') || 
      b.name.toLowerCase().includes('medibank') ||
      b.name.toLowerCase().includes('latitude')
    ).length,
    mostCommonDataClasses: ['Email addresses', 'Passwords', 'Names', 'Phone numbers', 'Physical addresses'],
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    node: 'AU-WEST-1',
    breaches,
    emailExposure,
    summary,
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-OSINT-1.4',
      'X-ADR-Breach-Count': String(breaches.length),
    },
  })
}
