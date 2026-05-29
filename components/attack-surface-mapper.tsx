'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Shield, Search, AlertTriangle, AlertCircle, Info,
  CheckCircle2, Network, Globe2, Mail, Server,
  FileText, Loader2, ChevronDown, ChevronUp, RefreshCw
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type NodeType =
  | 'domain' | 'host_ipv4' | 'host_ipv6' | 'cname'
  | 'nameserver' | 'mail_server' | 'dns_record' | 'mail_security'

interface MapNode { id: string; label: string; type: NodeType; status: string; group: number }
interface MapLink { source: string; target: string; relation: string }
interface Vuln {
  id: string; title: string; severity: Severity
  target: string; description: string; remediation: string
}
interface SurfaceResult {
  success: boolean
  domain: string
  mappedAt: string
  summary: { totalNodesMapped: number; vulnerabilitiesFound: number; overallSurfaceScore: number }
  graphData: { nodes: MapNode[]; links: MapLink[] }
  vulnerabilities: Vuln[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  CRITICAL: { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/40',    icon: <AlertCircle  className="w-3.5 h-3.5" /> },
  HIGH:     { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/40', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  MEDIUM:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/40', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  LOW:      { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/40',   icon: <Info          className="w-3.5 h-3.5" /> },
}

const NODE_CONFIG: Record<NodeType, { icon: React.ReactNode; color: string; label: string }> = {
  domain:       { icon: <Globe2   className="w-3.5 h-3.5" />, color: 'text-yellow-400', label: 'Domain Root' },
  host_ipv4:    { icon: <Server   className="w-3.5 h-3.5" />, color: 'text-blue-400',   label: 'IPv4 Host'   },
  host_ipv6:    { icon: <Server   className="w-3.5 h-3.5" />, color: 'text-cyan-400',   label: 'IPv6 Host'   },
  cname:        { icon: <Network  className="w-3.5 h-3.5" />, color: 'text-purple-400', label: 'CNAME'       },
  nameserver:   { icon: <Server   className="w-3.5 h-3.5" />, color: 'text-emerald-400',label: 'Nameserver'  },
  mail_server:  { icon: <Mail     className="w-3.5 h-3.5" />, color: 'text-pink-400',   label: 'Mail Server' },
  dns_record:   { icon: <FileText className="w-3.5 h-3.5" />, color: 'text-zinc-400',   label: 'DNS Record'  },
  mail_security:{ icon: <Shield   className="w-3.5 h-3.5" />, color: 'text-emerald-400',label: 'Mail Security'},
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54
  const circ   = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
  const color  = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-[10px] font-mono text-zinc-500 tracking-widest">SURFACE SCORE</span>
      </div>
    </div>
  )
}

// Compact network graph rendered on canvas
function NetworkGraph({ nodes, links }: { nodes: MapNode[]; links: MapLink[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Place root in centre, spread others in rings by group
    const positions: Record<string, { x: number; y: number }> = {}
    const cx = W / 2; const cy = H / 2
    positions['root'] = { x: cx, y: cy }

    const byGroup: Record<number, MapNode[]> = {}
    nodes.filter(n => n.id !== 'root').forEach(n => {
      byGroup[n.group] = byGroup[n.group] ?? []
      byGroup[n.group].push(n)
    })
    const groups = Object.keys(byGroup).map(Number).sort()
    groups.forEach((g, gi) => {
      const members = byGroup[g]
      const r = 70 + gi * 60
      members.forEach((n, i) => {
        const angle = (2 * Math.PI * i) / members.length - Math.PI / 2
        positions[n.id] = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
      })
    })

    // Draw links
    ctx.strokeStyle = '#3f3f46'
    ctx.lineWidth = 1
    links.forEach(l => {
      const s = positions[l.source]; const t = positions[l.target]
      if (!s || !t) return
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(t.x, t.y)
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach(n => {
      const p = positions[n.id]
      if (!p) return
      const r = n.id === 'root' ? 10 : 6
      const colors: Record<number, string> = {
        1: '#eab308', 2: '#ec4899', 3: '#6b7280',
        4: '#10b981', 5: '#3b82f6', 6: '#a855f7'
      }
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, 2 * Math.PI)
      ctx.fillStyle = colors[n.group] ?? '#6b7280'
      ctx.fill()

      // Label
      ctx.fillStyle = '#a1a1aa'
      ctx.font = '9px monospace'
      ctx.textAlign = 'center'
      const short = n.label.length > 22 ? n.label.slice(0, 20) + '…' : n.label
      ctx.fillText(short, p.x, p.y + r + 10)
    })
  }, [nodes, links])

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={360}
      className="w-full rounded-lg bg-zinc-950 border border-zinc-800"
    />
  )
}

function VulnRow({ v }: { v: Vuln }) {
  const [open, setOpen] = useState(false)
  const cfg = SEVERITY_CONFIG[v.severity]
  return (
    <div className={`border ${cfg.border} ${cfg.bg} rounded-lg overflow-hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={cfg.color}>{cfg.icon}</span>
          <span className={`text-[10px] font-bold font-mono tracking-widest ${cfg.color}`}>{v.severity}</span>
          <span className="text-sm font-semibold text-white truncate">{v.title}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:block">{v.id}</span>
          {open ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-zinc-800/50 pt-3">
          <div>
            <p className="text-[10px] font-mono text-zinc-500 mb-1 tracking-wider">FINDING</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{v.description}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono text-zinc-500 mb-1 tracking-wider">REMEDIATION</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{v.remediation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function AttackSurfaceMapper() {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SurfaceResult | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [phase, setPhase]   = useState('')

  const PHASES = [
    'Resolving A / AAAA records…',
    'Querying nameservers…',
    'Inspecting MX infrastructure…',
    'Checking TXT / SPF policies…',
    'Analysing DMARC enforcement…',
    'Probing DKIM selectors…',
    'Scoring attack surface…',
  ]

  async function runScan(e: React.FormEvent) {
    e.preventDefault()
    if (!domain.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    let i = 0
    const phaseTimer = setInterval(() => {
      setPhase(PHASES[i % PHASES.length])
      i++
    }, 700)

    try {
      const res = await fetch('/api/analytics/surface', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`)
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      clearInterval(phaseTimer)
      setPhase('')
      setLoading(false)
    }
  }

  const critCount   = result?.vulnerabilities.filter(v => v.severity === 'CRITICAL').length ?? 0
  const highCount   = result?.vulnerabilities.filter(v => v.severity === 'HIGH').length    ?? 0
  const medCount    = result?.vulnerabilities.filter(v => v.severity === 'MEDIUM').length  ?? 0
  const lowCount    = result?.vulnerabilities.filter(v => v.severity === 'LOW').length     ?? 0

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/40">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-yellow-500" />
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">ATTACK SURFACE MAPPER</h3>
            <p className="text-[10px] text-zinc-500 font-mono">Live DNS recon · SPF · DMARC · DKIM · Vulnerability scoring</p>
          </div>
        </div>
        {result && (
          <button
            onClick={() => { setResult(null); setDomain('') }}
            className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> NEW SCAN
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Input */}
        {!result && (
          <form onSubmit={runScan} className="flex gap-3">
            <div className="flex-1 relative">
              <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="ausdataremoval.com.au"
                className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 font-mono text-sm pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:border-yellow-500/60 transition-colors"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !domain.trim()}
              className="flex items-center gap-2 px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs tracking-widest rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'SCANNING' : 'SCAN'}
            </button>
          </form>
        )}

        {/* Scanning phase indicator */}
        {loading && phase && (
          <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <Loader2 className="w-4 h-4 text-yellow-500 animate-spin flex-shrink-0" />
            <span className="text-xs font-mono text-yellow-400">{phase}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300 font-mono">{error}</span>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score + summary row */}
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <ScoreRing score={result.summary.overallSurfaceScore} />

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {[
                  { label: 'NODES MAPPED', value: result.summary.totalNodesMapped, color: 'text-blue-400' },
                  { label: 'VULNS FOUND',  value: result.summary.vulnerabilitiesFound, color: critCount > 0 ? 'text-red-400' : 'text-yellow-400' },
                  { label: 'CRITICAL',     value: critCount,  color: 'text-red-400'    },
                  { label: 'HIGH',         value: highCount,  color: 'text-orange-400' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-center">
                    <p className="text-[9px] font-mono text-zinc-500 tracking-widest mb-1">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity breakdown bar */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest">SEVERITY BREAKDOWN</p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: 'CRITICAL', count: critCount, cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
                  { label: 'HIGH',     count: highCount, cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
                  { label: 'MEDIUM',   count: medCount,  cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                  { label: 'LOW',      count: lowCount,  cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                ].map(s => (
                  <span key={s.label} className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded text-[10px] font-bold font-mono ${s.cls}`}>
                    {s.count} {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Network graph */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest">DNS TOPOLOGY GRAPH</p>
              <NetworkGraph nodes={result.graphData.nodes} links={result.graphData.links} />

              {/* Legend */}
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { color: 'bg-yellow-500', label: 'Domain Root' },
                  { color: 'bg-pink-500',   label: 'Mail Server' },
                  { color: 'bg-zinc-500',   label: 'DNS/TXT Records' },
                  { color: 'bg-emerald-500',label: 'Nameservers' },
                  { color: 'bg-blue-500',   label: 'IPv4 Hosts' },
                  { color: 'bg-purple-500', label: 'CNAME' },
                ].map(l => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                    <span className={`w-2 h-2 rounded-full ${l.color}`} />{l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Node inventory */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-zinc-500 tracking-widest">NODE INVENTORY ({result.graphData.nodes.length})</p>
              <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {result.graphData.nodes.map(n => {
                  const cfg = NODE_CONFIG[n.type as NodeType] ?? NODE_CONFIG.dns_record
                  return (
                    <div key={n.id} className="flex items-center gap-2.5 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                      <span className={cfg.color}>{cfg.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono text-zinc-500">{cfg.label}</p>
                        <p className="text-xs text-white truncate font-mono">{n.label}</p>
                      </div>
                      {n.status === 'secure' && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0 ml-auto" />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Vulnerabilities */}
            {result.vulnerabilities.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono text-zinc-500 tracking-widest">
                  VULNERABILITIES ({result.vulnerabilities.length})
                </p>
                <div className="space-y-2">
                  {result.vulnerabilities
                    .sort((a, b) => {
                      const order: Severity[] = ['CRITICAL','HIGH','MEDIUM','LOW']
                      return order.indexOf(a.severity) - order.indexOf(b.severity)
                    })
                    .map(v => <VulnRow key={v.id} v={v} />)
                  }
                </div>
              </div>
            )}

            {result.vulnerabilities.length === 0 && (
              <div className="flex items-center gap-3 px-4 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">No vulnerabilities detected</p>
                  <p className="text-xs text-zinc-400 mt-0.5">SPF, DMARC, and DKIM all appear correctly configured for this domain.</p>
                </div>
              </div>
            )}

            {/* Metadata footer */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
              <span className="text-[10px] font-mono text-zinc-600">Target: {result.domain}</span>
              <span className="text-[10px] font-mono text-zinc-600">
                Mapped: {new Date(result.mappedAt).toLocaleString('en-AU', { timeZone: 'Australia/Perth' })} AWST
              </span>
            </div>
          </div>
        )}

        {/* Placeholder when idle */}
        {!result && !loading && !error && (
          <div className="text-center py-10 space-y-2">
            <Network className="w-10 h-10 text-zinc-700 mx-auto" />
            <p className="text-sm font-mono text-zinc-600">Enter a domain to begin live DNS reconnaissance</p>
            <p className="text-[10px] font-mono text-zinc-700">Resolves A · AAAA · MX · NS · TXT · CNAME · SPF · DMARC · DKIM</p>
          </div>
        )}
      </div>
    </div>
  )
}
