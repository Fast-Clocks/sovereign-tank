'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps'
import { Shield, Zap, AlertTriangle, Activity, Globe, Wifi, Server, Database } from 'lucide-react'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Global threat hotspots with coordinates
const threatNodes = [
  { id: 'us-east', name: 'US-EAST', coordinates: [-74.006, 40.7128] as [number, number], threats: 847, status: 'hostile' },
  { id: 'us-west', name: 'US-WEST', coordinates: [-122.4194, 37.7749] as [number, number], threats: 623, status: 'hostile' },
  { id: 'eu-west', name: 'EU-WEST', coordinates: [-0.1276, 51.5074] as [number, number], threats: 512, status: 'hostile' },
  { id: 'eu-central', name: 'EU-CENTRAL', coordinates: [13.405, 52.52] as [number, number], threats: 398, status: 'clearing' },
  { id: 'apac-east', name: 'APAC-EAST', coordinates: [139.6917, 35.6895] as [number, number], threats: 756, status: 'hostile' },
  { id: 'apac-south', name: 'APAC-SOUTH', coordinates: [103.8198, 1.3521] as [number, number], threats: 445, status: 'clearing' },
  { id: 'au-east', name: 'AU-EAST', coordinates: [151.2093, -33.8688] as [number, number], threats: 234, status: 'secure' },
  { id: 'au-west', name: 'AU-WEST', coordinates: [115.8605, -31.9505] as [number, number], threats: 12, status: 'secure' },
  { id: 'sa-east', name: 'SA-EAST', coordinates: [-43.1729, -22.9068] as [number, number], threats: 389, status: 'hostile' },
  { id: 'af-south', name: 'AF-SOUTH', coordinates: [28.0473, -26.2041] as [number, number], threats: 267, status: 'clearing' },
  { id: 'in-central', name: 'IN-CENTRAL', coordinates: [77.209, 28.6139] as [number, number], threats: 891, status: 'hostile' },
  { id: 'cn-east', name: 'CN-EAST', coordinates: [121.4737, 31.2304] as [number, number], threats: 1247, status: 'hostile' },
]

// Attack vectors - lines showing data flow/attacks
const generateAttackVectors = () => {
  const vectors: { from: [number, number]; to: [number, number]; type: string }[] = []
  const auWest = threatNodes.find(n => n.id === 'au-west')!
  
  threatNodes.forEach(node => {
    if (node.id !== 'au-west' && node.status === 'hostile') {
      vectors.push({
        from: node.coordinates,
        to: auWest.coordinates,
        type: 'inbound'
      })
    }
  })
  
  return vectors
}

interface ThreatMapProps {
  onNodeClick?: (nodeId: string) => void
  className?: string
}

function ThreatMapComponent({ onNodeClick, className = '' }: ThreatMapProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [attackVectors, setAttackVectors] = useState<{ from: [number, number]; to: [number, number]; type: string }[]>([])
  const [pulsePhase, setPulsePhase] = useState(0)
  const [stats, setStats] = useState({
    totalThreats: 0,
    blockedAttacks: 0,
    activeScans: 0,
    dataProcessed: 0,
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only init; a lazy useState initialiser would run during SSR and cause a hydration mismatch
    setAttackVectors(generateAttackVectors())
    
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        totalThreats: Math.min(prev.totalThreats + Math.floor(Math.random() * 50), 6621),
        blockedAttacks: Math.min(prev.blockedAttacks + Math.floor(Math.random() * 30), 4892),
        activeScans: 47 + Math.floor(Math.random() * 10),
        dataProcessed: prev.dataProcessed + Math.floor(Math.random() * 100),
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360)
    }, 50)
    return () => clearInterval(pulseInterval)
  }, [])

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'hostile': return '#ef4444'
      case 'clearing': return '#f59e0b'
      case 'secure': return '#22c55e'
      default: return '#71717a'
    }
  }

  const handleNodeClick = useCallback((nodeId: string) => {
    setActiveNode(nodeId)
    onNodeClick?.(nodeId)
  }, [onNodeClick])

  return (
    <div className={`bg-zinc-950 border border-zinc-800 ${className}`}>
      {/* Header Controls */}
      <div className="border-b border-zinc-800 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
              <Globe className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">GLOBAL.THREAT.MATRIX</h3>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">REAL-TIME SURVEILLANCE NETWORK</p>
            </div>
          </div>
          
          {/* Live Stats Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/30">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-red-500">{stats.totalThreats.toLocaleString()} THREATS</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30">
              <Shield className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold text-emerald-500">{stats.blockedAttacks.toLocaleString()} BLOCKED</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/30">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-500">{stats.activeScans} SCANS</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 border border-zinc-700">
              <Database className="h-3 w-3 text-zinc-400" />
              <span className="text-[10px] font-mono font-bold text-zinc-400">{(stats.dataProcessed / 1000).toFixed(1)}TB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* Scanline Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`
          }}
        />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-10 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250,204,21,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250,204,21,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20]
          }}
          style={{
            width: '100%',
            height: 'auto',
            background: 'transparent'
          }}
        >
          {/* World Geography */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#18181b"
                  stroke="#27272a"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: '#27272a', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Attack Vector Lines */}
          {attackVectors.map((vector, idx) => (
            <Line
              key={`vector-${idx}`}
              from={vector.from}
              to={vector.to}
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth={1}
              strokeLinecap="round"
              strokeDasharray="4 2"
              style={{
                animation: `dash 2s linear infinite`,
              }}
            />
          ))}

          {/* Threat Nodes */}
          {threatNodes.map((node) => (
            <Marker
              key={node.id}
              coordinates={node.coordinates}
              onClick={() => handleNodeClick(node.id)}
            >
              {/* Outer Pulse Ring */}
              <circle
                r={node.status === 'hostile' ? 12 + Math.sin(pulsePhase * 0.1) * 4 : 8}
                fill="transparent"
                stroke={getNodeColor(node.status)}
                strokeWidth={1}
                opacity={0.3}
              />
              {/* Middle Ring */}
              <circle
                r={6}
                fill="transparent"
                stroke={getNodeColor(node.status)}
                strokeWidth={1.5}
                opacity={0.6}
              />
              {/* Core */}
              <circle
                r={3}
                fill={getNodeColor(node.status)}
                className={node.status === 'hostile' ? 'animate-pulse' : ''}
              />
              {/* Label */}
              <text
                textAnchor="middle"
                y={-16}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '8px',
                  fill: getNodeColor(node.status),
                  fontWeight: 'bold',
                }}
              >
                {node.name}
              </text>
              <text
                textAnchor="middle"
                y={22}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '7px',
                  fill: '#71717a',
                }}
              >
                {node.threats}
              </text>
            </Marker>
          ))}

          {/* AU-WEST Command Center Highlight */}
          <Marker coordinates={[115.8605, -31.9505]}>
            <circle
              r={20 + Math.sin(pulsePhase * 0.05) * 5}
              fill="transparent"
              stroke="#facc15"
              strokeWidth={2}
              opacity={0.2}
            />
            <circle
              r={15}
              fill="transparent"
              stroke="#facc15"
              strokeWidth={1}
              opacity={0.4}
            />
          </Marker>
        </ComposableMap>

        {/* Floating Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-zinc-800 p-3">
          <p className="text-[9px] text-zinc-500 font-mono font-bold tracking-wider mb-2">NODE.STATUS</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-mono text-zinc-400">HOSTILE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-mono text-zinc-400">CLEARING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-400">SECURE</span>
            </div>
          </div>
        </div>

        {/* Command Center Badge */}
        <div className="absolute bottom-4 right-4 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 p-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-yellow-500">AU-WEST-1</p>
              <p className="text-[8px] font-mono text-zinc-500">COMMAND.CENTER</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Network Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-400">LATENCY: <span className="text-emerald-500 font-bold">12ms</span></span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-[10px] font-mono text-zinc-400">BANDWIDTH: <span className="text-yellow-500 font-bold">847 Gbps</span></span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Server className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-mono text-zinc-400">NODES: <span className="text-blue-500 font-bold">12/12</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all">
              [EXPORT.LOG]
            </button>
            <button className="px-3 py-1.5 text-[10px] font-mono font-bold text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/10 transition-all">
              [FULL.SCAN]
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  )
}

export const GlobalThreatMap = memo(ThreatMapComponent)
