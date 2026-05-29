'use client'

import { useState, useEffect } from 'react'
import { Activity, Server, Database, Shield, Wifi, Zap, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

interface ServiceStatus {
  status: 'operational' | 'degraded' | 'down'
  latency: number
  queueDepth?: number
  activeScans?: number
}

interface SystemHealth {
  status: string
  timestamp: string
  uptime: { seconds: number; percentage: number }
  node: { id: string; region: string; location: string }
  services: Record<string, ServiceStatus>
  performance: {
    requestsPerSecond: number
    avgResponseTime: number
    errorRate: string
    bandwidthGbps: number
  }
  version: { api: string; engine: string; protocol: string }
}

export function SystemHealthPanel() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/status')
        if (!res.ok) throw new Error('Failed to fetch status')
        const data = await res.json()
        setHealth(data)
        setLastUpdate(new Date())
        setError(null)
      } catch (err) {
        setError('Connection failed')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-emerald-500'
      case 'degraded': return 'text-amber-500'
      case 'down': return 'text-red-500'
      default: return 'text-zinc-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-3 w-3 text-emerald-500" />
      case 'degraded': return <AlertTriangle className="h-3 w-3 text-amber-500" />
      case 'down': return <AlertTriangle className="h-3 w-3 text-red-500" />
      default: return <Activity className="h-3 w-3 text-zinc-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-500">INITIALIZING.SYSTEM.CHECK...</span>
        </div>
      </div>
    )
  }

  if (error || !health) {
    return (
      <div className="bg-zinc-950 border border-red-500/30 p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-xs font-mono text-red-500">CONNECTION.FAILED</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">SYSTEM.HEALTH</h3>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">{health.node.id} // {health.node.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${health.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
            <span className={`text-[10px] font-mono font-bold ${getStatusColor(health.status)}`}>
              {health.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(health.services).map(([name, service]) => (
          <div key={name} className="bg-zinc-900/50 border border-zinc-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider uppercase">{name.replace(/([A-Z])/g, '.$1').trim()}</span>
              {getStatusIcon(service.status)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-white">{service.latency}</span>
              <span className="text-[10px] text-zinc-600 font-mono">ms</span>
            </div>
            {service.queueDepth !== undefined && (
              <p className="text-[9px] text-zinc-600 font-mono mt-1">Queue: {service.queueDepth}</p>
            )}
            {service.activeScans !== undefined && (
              <p className="text-[9px] text-zinc-600 font-mono mt-1">Scans: {service.activeScans}</p>
            )}
          </div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="text-zinc-500">RPS:</span>
            <span className="text-white font-bold">{health.performance.requestsPerSecond.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-blue-500" />
            <span className="text-zinc-500">AVG:</span>
            <span className="text-white font-bold">{health.performance.avgResponseTime}ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3 text-emerald-500" />
            <span className="text-zinc-500">BW:</span>
            <span className="text-white font-bold">{health.performance.bandwidthGbps} Gbps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="h-3 w-3 text-purple-500" />
            <span className="text-zinc-500">UPTIME:</span>
            <span className="text-emerald-500 font-bold">{health.uptime.percentage}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between">
        <span className="text-[9px] font-mono text-zinc-600">
          v{health.version.api} // {health.version.protocol}
        </span>
        <span className="text-[9px] font-mono text-zinc-600">
          Updated: {lastUpdate?.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
