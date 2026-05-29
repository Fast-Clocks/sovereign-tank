import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Vercel/Cloudflare-style analytics endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || '24h'

  // Generate realistic analytics data
  const now = Date.now()
  const hourMs = 3600000
  const dayMs = 86400000

  const rangeMs = {
    '1h': hourMs,
    '24h': dayMs,
    '7d': dayMs * 7,
    '30d': dayMs * 30,
  }[range] || dayMs

  const dataPoints = range === '1h' ? 60 : range === '24h' ? 24 : range === '7d' ? 168 : 720

  // Generate time series data
  const requestsOverTime = Array.from({ length: dataPoints }, (_, i) => {
    const timestamp = new Date(now - rangeMs + (rangeMs / dataPoints) * i).toISOString()
    const baseRequests = 50000 + Math.random() * 100000
    const peakMultiplier = Math.sin((i / dataPoints) * Math.PI * 4) * 0.3 + 1
    
    return {
      timestamp,
      requests: Math.floor(baseRequests * peakMultiplier),
      cached: Math.floor(baseRequests * peakMultiplier * (0.85 + Math.random() * 0.1)),
      blocked: Math.floor(baseRequests * peakMultiplier * (0.01 + Math.random() * 0.02)),
      errors: Math.floor(baseRequests * peakMultiplier * 0.001),
    }
  })

  // Bandwidth over time
  const bandwidthOverTime = Array.from({ length: dataPoints }, (_, i) => {
    const timestamp = new Date(now - rangeMs + (rangeMs / dataPoints) * i).toISOString()
    const baseBandwidth = 500 + Math.random() * 1000 // MB
    
    return {
      timestamp,
      served: Math.floor(baseBandwidth),
      cached: Math.floor(baseBandwidth * 0.75),
      uncached: Math.floor(baseBandwidth * 0.25),
    }
  })

  // Geographic distribution
  const geoDistribution = [
    { country: 'Australia', countryCode: 'AU', requests: 45847293, percentage: 54.2 },
    { country: 'United States', countryCode: 'US', requests: 18472937, percentage: 21.8 },
    { country: 'United Kingdom', countryCode: 'GB', requests: 8472937, percentage: 10.0 },
    { country: 'Singapore', countryCode: 'SG', requests: 4847293, percentage: 5.7 },
    { country: 'New Zealand', countryCode: 'NZ', requests: 3847293, percentage: 4.5 },
    { country: 'Japan', countryCode: 'JP', requests: 1847293, percentage: 2.2 },
    { country: 'Germany', countryCode: 'DE', requests: 1347293, percentage: 1.6 },
  ]

  // Device/browser distribution
  const deviceDistribution = {
    desktop: 62.4,
    mobile: 34.8,
    tablet: 2.8,
  }

  const browserDistribution = [
    { browser: 'Chrome', percentage: 64.2 },
    { browser: 'Safari', percentage: 18.7 },
    { browser: 'Firefox', percentage: 8.4 },
    { browser: 'Edge', percentage: 6.2 },
    { browser: 'Other', percentage: 2.5 },
  ]

  // Status code distribution
  const statusCodeDistribution = [
    { code: '2xx', count: 78472937, percentage: 92.6 },
    { code: '3xx', count: 4847293, percentage: 5.7 },
    { code: '4xx', count: 1247293, percentage: 1.5 },
    { code: '5xx', count: 147293, percentage: 0.2 },
  ]

  // Top paths
  const topPaths = [
    { path: '/api/brokers', requests: 18472937, avgLatency: 45, p99Latency: 120 },
    { path: '/api/threats', requests: 12472937, avgLatency: 32, p99Latency: 85 },
    { path: '/api/status', requests: 8472937, avgLatency: 12, p99Latency: 28 },
    { path: '/api/scan', requests: 4472937, avgLatency: 890, p99Latency: 2400 },
    { path: '/api/purge', requests: 1472937, avgLatency: 1200, p99Latency: 3500 },
    { path: '/', requests: 847293, avgLatency: 8, p99Latency: 22 },
  ]

  // Performance metrics
  const performance = {
    avgLatency: 34,
    p50Latency: 28,
    p75Latency: 45,
    p95Latency: 89,
    p99Latency: 156,
    ttfb: 12,
    cacheHitRatio: 94.7,
    originResponseTime: 145,
    edgeResponseTime: 8,
  }

  // Error breakdown
  const errors = {
    total: 147293,
    byType: [
      { type: 'timeout', count: 58729, percentage: 39.9 },
      { type: 'origin_error', count: 44729, percentage: 30.4 },
      { type: 'ssl_error', count: 24729, percentage: 16.8 },
      { type: 'dns_error', count: 12729, percentage: 8.6 },
      { type: 'other', count: 6377, percentage: 4.3 },
    ],
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    range,
    node: 'AU-WEST-1',
    requestsOverTime,
    bandwidthOverTime,
    geoDistribution,
    deviceDistribution,
    browserDistribution,
    statusCodeDistribution,
    topPaths,
    performance,
    errors,
    totals: {
      requests: requestsOverTime.reduce((acc, d) => acc + d.requests, 0),
      cached: requestsOverTime.reduce((acc, d) => acc + d.cached, 0),
      blocked: requestsOverTime.reduce((acc, d) => acc + d.blocked, 0),
      bandwidth: `${(bandwidthOverTime.reduce((acc, d) => acc + d.served, 0) / 1000).toFixed(2)} GB`,
    },
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'ADR-ANALYTICS-1.0',
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
