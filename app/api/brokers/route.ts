import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Simulated broker database
const brokerCategories = {
  'people-search': ['Whitepages', 'Spokeo', 'BeenVerified', 'Intelius', 'PeopleFinder', 'TruePeopleSearch', 'FastPeopleSearch', 'USSearch'],
  'data-aggregators': ['Acxiom', 'Experian', 'Equifax', 'TransUnion', 'LexisNexis', 'Oracle Data Cloud', 'Nielsen', 'Epsilon'],
  'marketing': ['LiveRamp', 'Lotame', 'BlueKai', 'AddThis', 'Criteo', 'The Trade Desk', 'MediaMath', 'AppNexus'],
  'social-scrapers': ['PimEyes', 'Clearview AI', 'Social Catfish', 'SocialSearcher', 'Pipl', 'FullContact'],
  'background-check': ['Checkr', 'GoodHire', 'HireRight', 'Sterling', 'Accurate Background', 'First Advantage'],
  'location-trackers': ['Foursquare', 'SafeGraph', 'Placer.ai', 'Unacast', 'X-Mode', 'Cuebiq'],
}

const regions = ['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa', 'Oceania']
const dataTypes = ['Home Address', 'Phone', 'Email', 'DOB', 'Relatives', 'Employment', 'Court Records', 'Social Media', 'Financial', 'Medical', 'Location History', 'Biometrics']

function generateBrokerData(count: number) {
  const brokers = []
  const allBrokerNames = Object.values(brokerCategories).flat()
  
  for (let i = 0; i < count; i++) {
    const baseName = allBrokerNames[i % allBrokerNames.length]
    const suffix = i >= allBrokerNames.length ? ` ${Math.floor(i / allBrokerNames.length) + 1}` : ''
    const category = Object.entries(brokerCategories).find(([_, names]) => names.includes(baseName))?.[0] || 'unknown'
    
    const exposedData: string[] = []
    const numDataTypes = Math.floor(Math.random() * 5) + 2
    for (let j = 0; j < numDataTypes; j++) {
      const randomData = dataTypes[Math.floor(Math.random() * dataTypes.length)]
      if (!exposedData.includes(randomData)) exposedData.push(randomData)
    }
    
    const rand = Math.random()
    const status = rand < 0.78 ? 'exposed' : rand < 0.85 ? 'purging' : 'clear'
    
    brokers.push({
      id: `broker-${i}`,
      name: `${baseName}${suffix}`,
      category,
      region: regions[Math.floor(Math.random() * regions.length)],
      dataExposed: exposedData,
      status,
      riskScore: Math.floor(Math.random() * 40) + (status === 'exposed' ? 60 : status === 'purging' ? 30 : 0),
      lastScan: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      complianceStatus: {
        gdpr: Math.random() > 0.3,
        ccpa: Math.random() > 0.4,
        australianPrivacyAct: Math.random() > 0.5,
      }
    })
  }
  
  return brokers
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const status = searchParams.get('status')
  const region = searchParams.get('region')
  const category = searchParams.get('category')
  
  let brokers = generateBrokerData(4200)
  
  // Apply filters
  if (status) brokers = brokers.filter(b => b.status === status)
  if (region) brokers = brokers.filter(b => b.region === region)
  if (category) brokers = brokers.filter(b => b.category === category)
  
  const total = brokers.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedBrokers = brokers.slice(offset, offset + limit)
  
  const summary = {
    total,
    exposed: brokers.filter(b => b.status === 'exposed').length,
    purging: brokers.filter(b => b.status === 'purging').length,
    clear: brokers.filter(b => b.status === 'clear').length,
    avgRiskScore: Math.round(brokers.reduce((sum, b) => sum + b.riskScore, 0) / brokers.length),
  }
  
  return NextResponse.json({
    data: paginatedBrokers,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    summary,
    meta: {
      generatedAt: new Date().toISOString(),
      apiVersion: 'v2.6',
      node: 'AU-WEST-1',
    }
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      'X-ADR-Node': 'AU-WEST-1',
    }
  })
}
