'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Shield, AlertTriangle, Activity, Globe, Zap, Lock, Eye, Server, Wifi, Database, Clock, TrendingUp } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface SecurityMetrics {
  totalRequests24h: number
  blockedRequests24h: number
  uniqueThreats24h: number
  mitigationRate: number
  avgResponseTime: number
  bandwidthServed: string
  bandwidthSaved: string
  cacheHitRate: number
  sslGrade: string
  wafRulesActive: number
  wafRulesTriggered: number
  botScore: {
    likely_human: number
    likely_automated: number
    verified_bot: number
  }
  topThreatCountries: Array<{
    country: string
    countryCode: string
    attacks: number
    blocked: number
  }>
  topAttackTypes: Array<{
    type: string
    count: number
    percentage: number
  }>
}

interface ThreatData {
  threats: Array<{
    id: string
    type: string
    severity: string
    origin: {
      country: string
      countryCode: string
      ip: string
    }
    timestamp: string
    mitigated: boolean
    attackVector: string
  }>
  summary: {
    bySeverity: Record<string, number>
    mitigationRate: string
  }
}

export function SecurityAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('24h')
  
  const { data: securityData } = useSWR<{ metrics: SecurityMetrics }>(
    '/api/security?include=metrics',
    fetcher,
    { refreshInterval: 5000 }
  )

  const { data: threatData } = useSWR<ThreatData>(
    '/api/security/threats?limit=20',
    fetcher,
    { refreshInterval: 3000 }
  )

  const metrics = securityData?.metrics
  const threats = threatData?.threats || []

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-500" />
          <h2 className="text-sm font-black text-white tracking-wider">SECURITY.ANALYTICS</h2>
        </div>
        <div className="flex items-center gap-2">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 text-[10px] font-mono font-bold transition-all ${
                timeRange === range
                  ? 'bg-yellow-500 text-black'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label="REQUESTS"
          value={metrics ? formatNumber(metrics.totalRequests24h) : '---'}
          subValue={metrics ? `${formatNumber(metrics.blockedRequests24h)} blocked` : ''}
          color="blue"
        />
        <MetricCard
          icon={<Shield className="h-4 w-4" />}
          label="MITIGATION"
          value={metrics ? `${metrics.mitigationRate.toFixed(2)}%` : '---'}
          subValue="threats blocked"
          color="green"
        />
        <MetricCard
          icon={<Clock className="h-4 w-4" />}
          label="AVG LATENCY"
          value={metrics ? `${metrics.avgResponseTime}ms` : '---'}
          subValue="response time"
          color="yellow"
        />
        <MetricCard
          icon={<Database className="h-4 w-4" />}
          label="CACHE HIT"
          value={metrics ? `${metrics.cacheHitRate.toFixed(1)}%` : '---'}
          subValue={metrics?.bandwidthSaved || ''}
          color="purple"
        />
      </div>

      {/* Threat Feed */}
      <div className="border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white tracking-wider">LIVE.THREAT.FEED</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {threatData?.summary?.mitigationRate || '0'}% mitigated
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto">
          {threats.slice(0, 10).map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between px-3 py-2 border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-1.5 w-1.5 rounded-full ${
                  threat.severity === 'critical' ? 'bg-red-500' :
                  threat.severity === 'high' ? 'bg-orange-500' :
                  threat.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="text-[10px] font-mono text-white">{threat.type}</span>
                <span className="text-[10px] font-mono text-zinc-500">{threat.attackVector}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500">{threat.origin.countryCode}</span>
                <span className={`text-[10px] font-mono font-bold ${
                  threat.mitigated ? 'text-green-500' : 'text-red-500'
                }`}>
                  {threat.mitigated ? 'BLOCKED' : 'ACTIVE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WAF & SSL Status */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500">WAF.STATUS</span>
            <Lock className="h-3 w-3 text-green-500" />
          </div>
          <div className="text-lg font-black text-white">{metrics?.wafRulesActive || 0}</div>
          <div className="text-[10px] font-mono text-zinc-500">
            {formatNumber(metrics?.wafRulesTriggered || 0)} triggered
          </div>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-zinc-500">SSL.GRADE</span>
            <Shield className="h-3 w-3 text-green-500" />
          </div>
          <div className="text-lg font-black text-green-500">{metrics?.sslGrade || 'A+'}</div>
          <div className="text-[10px] font-mono text-zinc-500">TLS 1.3 | HSTS</div>
        </div>
      </div>

      {/* Bot Score Distribution */}
      {metrics?.botScore && (
        <div className="border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-mono font-bold text-white tracking-wider">BOT.DETECTION</span>
          </div>
          <div className="space-y-2">
            <BotScoreBar label="HUMAN" value={metrics.botScore.likely_human} color="green" />
            <BotScoreBar label="AUTOMATED" value={metrics.botScore.likely_automated} color="red" />
            <BotScoreBar label="VERIFIED" value={metrics.botScore.verified_bot} color="blue" />
          </div>
        </div>
      )}

      {/* Top Threat Countries */}
      {metrics?.topThreatCountries && (
        <div className="border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-mono font-bold text-white tracking-wider">THREAT.ORIGINS</span>
          </div>
          <div className="space-y-1">
            {metrics.topThreatCountries.slice(0, 5).map((country) => (
              <div key={country.countryCode} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 w-6">{country.countryCode}</span>
                  <span className="text-[10px] font-mono text-white">{country.country}</span>
                </div>
                <span className="text-[10px] font-mono text-red-500">{formatNumber(country.attacks)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ 
  icon, 
  label, 
  value, 
  subValue, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  subValue: string
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
}) {
  const colorClasses = {
    blue: 'text-blue-500 border-blue-500/20 bg-blue-500/5',
    green: 'text-green-500 border-green-500/20 bg-green-500/5',
    yellow: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    purple: 'text-purple-500 border-purple-500/20 bg-purple-500/5',
    red: 'text-red-500 border-red-500/20 bg-red-500/5',
  }

  return (
    <div className={`border p-3 ${colorClasses[color]}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className={colorClasses[color].split(' ')[0]}>{icon}</span>
        <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-black text-white">{value}</div>
      {subValue && <div className="text-[10px] font-mono text-zinc-500">{subValue}</div>}
    </div>
  )
}

function BotScoreBar({ label, value, color }: { label: string; value: number; color: 'green' | 'red' | 'blue' }) {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-mono text-zinc-500 w-20">{label}</span>
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-white w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  )
}
