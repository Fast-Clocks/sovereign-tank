import { NextResponse } from 'next/server'
import { knownDataBrokers } from '@/lib/osint-engine'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const jurisdiction = searchParams.get('jurisdiction')
  const difficulty = searchParams.get('difficulty')
  const automated = searchParams.get('automated')

  let brokers = knownDataBrokers.map(b => ({
    ...b,
    dataTypes: ['Email addresses', 'Phone numbers', 'Physical addresses', 'Names', 'Dates of birth']
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2),
  }))

  // Apply filters
  if (category) {
    brokers = brokers.filter(b => b.category === category)
  }
  if (jurisdiction) {
    brokers = brokers.filter(b => b.jurisdiction.includes(jurisdiction))
  }
  if (difficulty) {
    brokers = brokers.filter(b => b.optOutDifficulty === difficulty)
  }
  if (automated === 'true') {
    brokers = brokers.filter(b => b.supportsAutomatedRemoval)
  }

  // Summary stats
  const summary = {
    total: brokers.length,
    byCategory: brokers.reduce((acc, b) => {
      acc[b.category] = (acc[b.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    byDifficulty: brokers.reduce((acc, b) => {
      acc[b.optOutDifficulty] = (acc[b.optOutDifficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    automatedRemovalSupported: brokers.filter(b => b.supportsAutomatedRemoval).length,
    totalEstimatedRecords: brokers.reduce((acc, b) => acc + b.estimatedRecords, 0),
    australianBrokers: brokers.filter(b => b.jurisdiction.includes('AU')).length,
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    node: 'AU-WEST-1',
    brokers,
    summary,
    filters: { category, jurisdiction, difficulty, automated },
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-OSINT-1.4',
      'X-ADR-Broker-Count': String(brokers.length),
    },
  })
}
