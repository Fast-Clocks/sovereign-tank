import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Simulated threat data - in production this would connect to real threat intelligence feeds
const threatNodes = [
  { id: 'us-east', name: 'US-EAST', lat: 40.7128, lng: -74.006, threats: 847, status: 'hostile', lastUpdate: Date.now() },
  { id: 'us-west', name: 'US-WEST', lat: 37.7749, lng: -122.4194, threats: 623, status: 'hostile', lastUpdate: Date.now() },
  { id: 'eu-west', name: 'EU-WEST', lat: 51.5074, lng: -0.1276, threats: 512, status: 'hostile', lastUpdate: Date.now() },
  { id: 'eu-central', name: 'EU-CENTRAL', lat: 52.52, lng: 13.405, threats: 398, status: 'clearing', lastUpdate: Date.now() },
  { id: 'apac-east', name: 'APAC-EAST', lat: 35.6895, lng: 139.6917, threats: 756, status: 'hostile', lastUpdate: Date.now() },
  { id: 'apac-south', name: 'APAC-SOUTH', lat: 1.3521, lng: 103.8198, threats: 445, status: 'clearing', lastUpdate: Date.now() },
  { id: 'au-east', name: 'AU-EAST', lat: -33.8688, lng: 151.2093, threats: 234, status: 'secure', lastUpdate: Date.now() },
  { id: 'au-west', name: 'AU-WEST', lat: -31.9505, lng: 115.8605, threats: 12, status: 'secure', lastUpdate: Date.now() },
  { id: 'sa-east', name: 'SA-EAST', lat: -22.9068, lng: -43.1729, threats: 389, status: 'hostile', lastUpdate: Date.now() },
  { id: 'af-south', name: 'AF-SOUTH', lat: -26.2041, lng: 28.0473, threats: 267, status: 'clearing', lastUpdate: Date.now() },
  { id: 'in-central', name: 'IN-CENTRAL', lat: 28.6139, lng: 77.209, threats: 891, status: 'hostile', lastUpdate: Date.now() },
  { id: 'cn-east', name: 'CN-EAST', lat: 31.2304, lng: 121.4737, threats: 1247, status: 'hostile', lastUpdate: Date.now() },
]

export async function GET() {
  // Add some randomization to simulate live data
  const liveThreats = threatNodes.map(node => ({
    ...node,
    threats: node.threats + Math.floor(Math.random() * 20) - 10,
    lastUpdate: Date.now(),
  }))

  const totalThreats = liveThreats.reduce((sum, node) => sum + node.threats, 0)
  const hostileCount = liveThreats.filter(n => n.status === 'hostile').length
  const clearingCount = liveThreats.filter(n => n.status === 'clearing').length
  const secureCount = liveThreats.filter(n => n.status === 'secure').length

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    nodes: liveThreats,
    summary: {
      totalThreats,
      hostileNodes: hostileCount,
      clearingNodes: clearingCount,
      secureNodes: secureCount,
      blockedLast24h: Math.floor(totalThreats * 0.73),
      dataProcessedTB: (Math.random() * 50 + 100).toFixed(2),
    },
    network: {
      latencyMs: Math.floor(Math.random() * 5) + 10,
      bandwidthGbps: Math.floor(Math.random() * 100) + 800,
      activeConnections: Math.floor(Math.random() * 1000) + 5000,
      nodesOnline: 12,
      nodesTotal: 12,
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'v2.6',
    }
  })
}
