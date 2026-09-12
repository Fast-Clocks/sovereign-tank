'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Shield, Zap, AlertTriangle, Activity, Globe, Wifi, Server, Database } from 'lucide-react'

const MAP_WIDTH = 960
const MAP_HEIGHT = 480
const COMMAND_CENTER_ID = 'au-west'

type ThreatStatus = 'hostile' | 'clearing' | 'secure'

interface ThreatNode {
  id: string
  name: string
  coordinates: [number, number]
  threats: number
  status: ThreatStatus
}

const worldRegions = [
  'M76 124 L114 94 L176 82 L224 102 L256 136 L252 184 L214 214 L164 216 L112 184 L88 150 Z',
  'M246 234 L282 220 L314 236 L330 282 L312 336 L282 390 L246 420 L220 394 L216 336 L228 274 Z',
  'M392 98 L462 82 L548 88 L628 116 L688 162 L694 228 L656 258 L604 248 L566 212 L532 196 L486 200 L450 184 L420 154 Z',
  'M476 212 L526 224 L562 264 L548 306 L504 322 L458 304 L440 262 Z',
  'M676 296 L724 276 L778 292 L818 328 L800 362 L734 376 L688 354 L662 324 Z',
  'M774 388 L810 380 L836 396 L826 426 L794 434 L766 418 Z',
]

const threatNodes: ThreatNode[] = [
  { id: 'us-east', name: 'US-EAST', coordinates: [-74.006, 40.7128], threats: 847, status: 'hostile' },
  { id: 'us-west', name: 'US-WEST', coordinates: [-122.4194, 37.7749], threats: 623, status: 'hostile' },
  { id: 'eu-west', name: 'EU-WEST', coordinates: [-0.1276, 51.5074], threats: 512, status: 'hostile' },
  { id: 'eu-central', name: 'EU-CENTRAL', coordinates: [13.405, 52.52], threats: 398, status: 'clearing' },
  { id: 'apac-east', name: 'APAC-EAST', coordinates: [139.6917, 35.6895], threats: 756, status: 'hostile' },
  { id: 'apac-south', name: 'APAC-SOUTH', coordinates: [103.8198, 1.3521], threats: 445, status: 'clearing' },
  { id: 'au-east', name: 'AU-EAST', coordinates: [151.2093, -33.8688], threats: 234, status: 'secure' },
  { id: 'au-west', name: 'AU-WEST', coordinates: [115.8605, -31.9505], threats: 12, status: 'secure' },
  { id: 'sa-east', name: 'SA-EAST', coordinates: [-43.1729, -22.9068], threats: 389, status: 'hostile' },
  { id: 'af-south', name: 'AF-SOUTH', coordinates: [28.0473, -26.2041], threats: 267, status: 'clearing' },
  { id: 'in-central', name: 'IN-CENTRAL', coordinates: [77.209, 28.6139], threats: 891, status: 'hostile' },
  { id: 'cn-east', name: 'CN-EAST', coordinates: [121.4737, 31.2304], threats: 1247, status: 'hostile' },
]

const attackVectors = threatNodes
  .filter((node) => node.id !== COMMAND_CENTER_ID && node.status === 'hostile')
  .map((node) => ({ from: node.coordinates, to: threatNodes.find((candidate) => candidate.id === COMMAND_CENTER_ID)!.coordinates }))

function projectCoordinates([longitude, latitude]: [number, number]) {
  return {
    x: ((longitude + 180) / 360) * MAP_WIDTH,
    y: ((90 - latitude) / 180) * MAP_HEIGHT,
  }
}

function projectCoordinatesAsPercent(coordinates: [number, number]) {
  const { x, y } = projectCoordinates(coordinates)

  return {
    left: `${(x / MAP_WIDTH) * 100}%`,
    top: `${(y / MAP_HEIGHT) * 100}%`,
  }
}

function getNodeColor(status: ThreatStatus) {
  switch (status) {
    case 'hostile':
      return '#ef4444'
    case 'clearing':
      return '#f59e0b'
    case 'secure':
      return '#22c55e'
    default:
      return '#71717a'
  }
}

interface ThreatMapProps {
  onNodeClick?: (nodeId: string) => void
  className?: string
}

function ThreatMapComponent({ onNodeClick, className = '' }: ThreatMapProps) {
  const [activeNode, setActiveNode] = useState<string | null>(COMMAND_CENTER_ID)
  const [pulsePhase, setPulsePhase] = useState(0)
  const [stats, setStats] = useState({
    totalThreats: 0,
    blockedAttacks: 0,
    activeScans: 0,
    dataProcessed: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
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
      setPulsePhase((phase) => (phase + 1) % 360)
    }, 50)

    return () => clearInterval(pulseInterval)
  }, [])

  const handleNodeClick = useCallback((nodeId: string) => {
    setActiveNode(nodeId)
    onNodeClick?.(nodeId)
  }, [onNodeClick])

  const activeThreatNode = threatNodes.find((node) => node.id === activeNode) ?? threatNodes.find((node) => node.id === COMMAND_CENTER_ID)!
  const commandCenterCoordinates = threatNodes.find((node) => node.id === COMMAND_CENTER_ID)!.coordinates

  return (
    <div className={`bg-zinc-950 border border-zinc-800 ${className}`}>
      <div className="border-b border-zinc-800 p-4">
        <div className="flex flex-col gap-4 justify-between lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center border border-yellow-500/30 bg-yellow-500/10">
              <Globe className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight text-white">GLOBAL.THREAT.MATRIX</h3>
              <p className="text-[10px] font-mono tracking-wider text-zinc-500">REAL-TIME SURVEILLANCE NETWORK</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-red-500/30 bg-red-500/10 px-2 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-red-500">{stats.totalThreats.toLocaleString()} THREATS</span>
            </div>
            <div className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2 py-1">
              <Shield className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-mono font-bold text-emerald-500">{stats.blockedAttacks.toLocaleString()} BLOCKED</span>
            </div>
            <div className="flex items-center gap-1.5 border border-blue-500/30 bg-blue-500/10 px-2 py-1">
              <Activity className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-500">{stats.activeScans} SCANS</span>
            </div>
            <div className="flex items-center gap-1.5 border border-zinc-700 bg-zinc-800 px-2 py-1">
              <Database className="h-3 w-3 text-zinc-400" />
              <span className="text-[10px] font-mono font-bold text-zinc-400">{(stats.dataProcessed / 1000).toFixed(1)}TB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-30"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.3) 2px,
              rgba(0,0,0,0.3) 4px
            )`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250,204,21,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250,204,21,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />

        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="h-auto w-full bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.08),_transparent_55%)]"
          aria-label="Global threat map"
        >
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="transparent" />

          {Array.from({ length: 7 }).map((_, index) => (
            <line
              key={`lat-${index}`}
              x1="0"
              x2={MAP_WIDTH}
              y1={60 + index * 55}
              y2={60 + index * 55}
              stroke="rgba(63,63,70,0.6)"
              strokeWidth="1"
            />
          ))}

          {Array.from({ length: 11 }).map((_, index) => (
            <line
              key={`lon-${index}`}
              x1={80 + index * 80}
              x2={80 + index * 80}
              y1="24"
              y2={MAP_HEIGHT - 24}
              stroke="rgba(63,63,70,0.45)"
              strokeWidth="1"
            />
          ))}

          {worldRegions.map((path, index) => (
            <path
              key={`region-${index}`}
              d={path}
              fill="rgba(24,24,27,0.95)"
              stroke="rgba(63,63,70,0.9)"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          ))}

          {attackVectors.map((vector, index) => {
            const from = projectCoordinates(vector.from)
            const to = projectCoordinates(vector.to)

            return (
              <line
                key={`vector-${index}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(239,68,68,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="8 6"
                className="attack-vector"
              />
            )
          })}

          {(() => {
            const { x, y } = projectCoordinates(commandCenterCoordinates)

            return (
              <g aria-hidden="true">
                <circle
                  cx={x}
                  cy={y}
                  r={24 + Math.sin(pulsePhase * 0.05) * 5}
                  fill="transparent"
                  stroke="#facc15"
                  strokeWidth="2.5"
                  opacity="0.22"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill="transparent"
                  stroke="#facc15"
                  strokeWidth="1.25"
                  opacity="0.4"
                />
              </g>
            )
          })()}
        </svg>

        <div className="absolute inset-0 z-20">
          {threatNodes.map((node) => {
            const position = projectCoordinatesAsPercent(node.coordinates)
            const isActive = activeThreatNode.id === node.id
            const pulseSize = node.status === 'hostile' ? 40 + Math.sin(pulsePhase * 0.1) * 8 : 28 + Math.sin(pulsePhase * 0.05) * 4

            return (
              <button
                key={node.id}
                type="button"
                aria-label={`Threat node ${node.name}`}
                aria-pressed={isActive}
                className="absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 bg-transparent"
                style={{ left: position.left, top: position.top }}
                onClick={() => handleNodeClick(node.id)}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 rounded-full border"
                  style={{
                    width: `${isActive ? pulseSize + 8 : pulseSize}px`,
                    height: `${isActive ? pulseSize + 8 : pulseSize}px`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: getNodeColor(node.status),
                    borderWidth: isActive ? '2.5px' : '1.25px',
                    opacity: isActive ? 0.5 : 0.25,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    borderColor: getNodeColor(node.status),
                    borderWidth: '1.5px',
                    opacity: 0.65,
                  }}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${node.status === 'hostile' ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: getNodeColor(node.status) }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[calc(50%-1.15rem)] -translate-x-1/2 -translate-y-full text-[11px] font-bold"
                  style={{ color: getNodeColor(node.status) }}
                >
                  {node.name}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-[calc(50%+1.15rem)] -translate-x-1/2 text-[10px] text-zinc-500"
                >
                  {node.threats}
                </span>
              </button>
            )
          })}
        </div>

        <div className="absolute bottom-4 left-4 border border-zinc-800 bg-black/80 p-3 backdrop-blur-sm">
          <p className="mb-2 text-[9px] font-mono font-bold tracking-wider text-zinc-500">NODE.STATUS</p>
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

        <div className="absolute right-4 top-4 border border-yellow-500/30 bg-black/85 p-3 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-yellow-500">{activeThreatNode.name}</p>
              <p className="text-[8px] font-mono text-zinc-500">LIVE.THREAT.FEED</p>
            </div>
          </div>
          <div className="space-y-1 font-mono text-[10px] text-zinc-400">
            <p>
              STATUS: <span style={{ color: getNodeColor(activeThreatNode.status) }}>{activeThreatNode.status.toUpperCase()}</span>
            </p>
            <p>
              EVENTS: <span className="font-bold text-white">{activeThreatNode.threats.toLocaleString()}</span>
            </p>
            <p>
              ROUTE: <span className="text-zinc-300">{activeThreatNode.id.toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 border border-yellow-500/30 bg-yellow-500/10 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-[10px] font-mono font-bold text-yellow-500">AU-WEST-1</p>
              <p className="text-[8px] font-mono text-zinc-500">COMMAND.CENTER</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-mono text-zinc-400">
                LATENCY: <span className="font-bold text-emerald-500">12ms</span>
              </span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-[10px] font-mono text-zinc-400">
                BANDWIDTH: <span className="font-bold text-yellow-500">847 Gbps</span>
              </span>
            </div>
            <span className="text-zinc-700">|</span>
            <div className="flex items-center gap-2">
              <Server className="h-3 w-3 text-blue-500" />
              <span className="text-[10px] font-mono text-zinc-400">
                NODES: <span className="font-bold text-blue-500">12/12</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="border border-zinc-800 px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-400 transition-all hover:border-zinc-700 hover:text-white">
              [EXPORT.LOG]
            </button>
            <button className="border border-yellow-500/30 px-3 py-1.5 text-[10px] font-mono font-bold text-yellow-500 transition-all hover:bg-yellow-500/10">
              [FULL.SCAN]
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .attack-vector {
          animation: dash 2s linear infinite;
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -28;
          }
        }
      `}</style>
    </div>
  )
}

export const GlobalThreatMap = memo(ThreatMapComponent)
