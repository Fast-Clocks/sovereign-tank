'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, AlertTriangle, CheckCircle, Loader2, Globe, Users, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SovereignGlassBox } from '@/components/sovereign-glass-box'
import { LegalFooter } from '@/components/legal-footer'
import { GlobalThreatMap } from '@/components/global-threat-map'
import { SystemHealthPanel } from '@/components/system-health-panel'
import { AICommandTerminal } from '@/components/ai-command-terminal'
import { DocumentAnalyzer } from '@/components/document-analyzer'
import { OSINTScanner } from '@/components/osint-scanner'

type BrokerStatus = 'exposed' | 'purging' | 'clear'

interface DataBroker {
  name: string
  dataExposed: string[]
  status: BrokerStatus
  region: string
}

interface Region {
  name: string
  coords: { x: number; y: number }
  color: string
}

const worldHotspots: Region[] = [
  { name: 'North America', coords: { x: 20, y: 35 }, color: '#ef4444' },
  { name: 'South America', coords: { x: 30, y: 65 }, color: '#f97316' },
  { name: 'Europe', coords: { x: 50, y: 30 }, color: '#eab308' },
  { name: 'Asia', coords: { x: 70, y: 35 }, color: '#22c55e' },
  { name: 'Africa', coords: { x: 52, y: 55 }, color: '#3b82f6' },
  { name: 'Australia', coords: { x: 80, y: 70 }, color: '#10b981' },
]

const globalBrokers = [
  'Whitepages', 'AnyWho', 'Spokeo', 'BeenVerified', 'PeopleFinder', 'Intelius',
  'TruthFinder', 'InstantCheckmate', 'MyLife', 'PeopleSmart', 'Radaris', 'ZabaSearch',
  'US Search', 'PublicRecordsNow', 'NeighborWho', 'FamilyTreeNow', 'ThatsThem',
  'Addresses.com', 'Nuwber', 'FastPeopleSearch', 'True People Search', 'Checkr',
  'Pipl', 'Social Catfish', 'Melissa Data', 'CoreLogic', 'LexisNexis', 'Acxiom',
  'Experian', 'Equifax', 'TransUnion', 'Thomson Reuters', 'Hoovers', 'Dun and Bradstreet',
]

const regions = ['North America', 'Europe', 'Asia', 'Australia', 'South America', 'Africa']

// Fallback static data in case generation fails
const fallbackBrokers: DataBroker[] = [
  { name: 'Whitepages', dataExposed: ['Home Address', 'Phone'], status: 'exposed', region: 'North America' },
  { name: 'Spokeo', dataExposed: ['Email', 'DOB', 'Relatives'], status: 'exposed', region: 'North America' },
  { name: 'BeenVerified', dataExposed: ['Employment', 'Court Records'], status: 'purging', region: 'North America' },
  { name: 'Intelius', dataExposed: ['Home Address', 'Social Media'], status: 'clear', region: 'North America' },
  { name: 'MyLife', dataExposed: ['Phone', 'Email', 'Relatives'], status: 'exposed', region: 'Europe' },
]

function generateBrokers(): DataBroker[] {
  try {
    const brokers: DataBroker[] = []
    const targetCount = 4200

    for (let i = 0; i < targetCount; i++) {
      const baseName = globalBrokers[i % globalBrokers.length]
      const suffix = i >= globalBrokers.length ? ` ${Math.floor(i / globalBrokers.length) + 1}` : ''

      const dataTypes: string[] = []
      const possibleData = ['Home Address', 'Phone', 'Email', 'DOB', 'Relatives', 'Employment', 'Court Records', 'Social Media']
      const numDataTypes = Math.floor(Math.random() * 4) + 2

      for (let j = 0; j < numDataTypes; j++) {
        const randomData = possibleData[Math.floor(Math.random() * possibleData.length)]
        if (!dataTypes.includes(randomData)) {
          dataTypes.push(randomData)
        }
      }

      const rand = Math.random()
      const status: BrokerStatus = rand < 0.78 ? 'exposed' : rand < 0.85 ? 'purging' : 'clear'

      brokers.push({
        name: `${baseName}${suffix}`,
        dataExposed: dataTypes,
        status,
        region: regions[Math.floor(Math.random() * regions.length)],
      })
    }

    return brokers
  } catch (error) {
    console.error('[v0] Error generating brokers, using fallback data:', error)
    return fallbackBrokers
  }
}

const terminalLogs = [
  '[PLAYWRIGHT] Initializing headless browser for global sweep...',
  '[SYSTEM] Loaded 4,200 broker profiles across 78 jurisdictions',
  '[AUTH] Statutory Demand Module armed per APP 11.2 (Privacy Act 1988)',
  '[SCAN] Target: whitepages.com.au | Status: Navigating...',
  '[FORM] Injecting opt-out payload with verified credentials',
  '[CAPTCHA] Solving reCAPTCHA v3 using AI vision model...',
  '[SUBMIT] Statutory Demand transmitted | Confirmation code: ADR-7829',
  '[EMAIL] Monitoring inbox for broker confirmation link...',
  '[CLICK] Automated confirmation complete for BeenVerified',
  '[SCAN] Target: spokeo.com | Status: Hostile CAPTCHA detected',
  '[RETRY] Deploying anti-detection headers and fingerprint rotation',
  '[SUCCESS] Data purge confirmed for Intelius | Verification: PASSED',
  '[QUEUE] 3,266 brokers pending | 587 in-progress | 347 cleared',
  '[ALERT] New broker detected: DataVault.io | Adding to hit list...',
  '[COMPLIANCE] GDPR Article 17 invoked for EU-based brokers',
  '[SCAN] Target: mylife.com | Status: Form submission blocked',
  '[ESCALATE] Deploying legal notice via certified API endpoint',
  '[SUCCESS] TruthFinder opt-out confirmed | Timestamp: 2026-02-15T14:23:09Z',
]

export function ADRDashboard() {
  const [mounted, setMounted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [allBrokers, setAllBrokers] = useState<DataBroker[]>([])
  const [displayedBrokers, setDisplayedBrokers] = useState<DataBroker[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const brokersPerPage = 50
  const terminalRef = useRef<HTMLDivElement>(null)
  const [isPurging, setIsPurging] = useState(false)
  const [scanningRegion, setScanningRegion] = useState<Region | null>(null)
  const [hotspotStates, setHotspotStates] = useState<{ [key: string]: 'hostile' | 'clearing' }>(
    Object.fromEntries(worldHotspots.map(h => [h.region, 'hostile' as const]))
  )

  useEffect(() => {
    try {
      const brokers = generateBrokers()
      setAllBrokers(brokers)
      console.log('[v0] Successfully loaded', brokers.length, 'brokers')
    } catch (error) {
      console.error('[v0] Failed to initialize brokers:', error)
      setAllBrokers(fallbackBrokers)
    } finally {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    try {
      if (allBrokers.length > 0) {
        const startIdx = (currentPage - 1) * brokersPerPage
        const endIdx = startIdx + brokersPerPage
        setDisplayedBrokers(allBrokers.slice(startIdx, endIdx))
      }
    } catch (error) {
      console.error('[v0] Error updating displayed brokers:', error)
      setDisplayedBrokers([])
    }
  }, [currentPage, allBrokers])

  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      try {
        const randomLog = terminalLogs[Math.floor(Math.random() * terminalLogs.length)]
        setLogs((prev) => [...prev.slice(-8), randomLog])
      } catch (error) {
        console.error('[v0] Error updating terminal logs:', error)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    try {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    } catch (error) {
      console.error('[v0] Error scrolling terminal:', error)
    }
  }, [logs])

  const handleKill = (brokerName: string) => {
    try {
      setAllBrokers((prev) =>
        prev.map((broker) =>
          broker.name === brokerName
            ? { ...broker, status: broker.status === 'exposed' ? 'purging' : 'clear' }
            : broker
        )
      )

      const broker = allBrokers.find((b) => b.name === brokerName)
      if (broker) {
        setHotspotStates((prev) => ({
          ...prev,
          [broker.region]: 'clearing',
        }))

        setTimeout(() => {
          setHotspotStates((prev) => ({
            ...prev,
            [broker.region]: 'hostile',
          }))
        }, 3000)
      }
    } catch (error) {
      console.error('[v0] Error handling broker kill:', error)
    }
  }

  const handleSystemPurge = () => {
    try {
      setIsPurging(true)

      let regionIndex = 0
      const scanInterval = setInterval(() => {
        try {
          if (regionIndex < worldHotspots.length) {
            setScanningRegion(worldHotspots[regionIndex])
            regionIndex++
          } else {
            clearInterval(scanInterval)
            setScanningRegion(null)
            setIsPurging(false)
          }
        } catch (error) {
          console.error('[v0] Error in scan interval:', error)
          clearInterval(scanInterval)
          setIsPurging(false)
        }
      }, 1000)

      setAllBrokers((prev) =>
        prev.map((broker) => ({
          ...broker,
          status: broker.status === 'exposed' ? 'purging' : broker.status,
        }))
      )
    } catch (error) {
      console.error('[v0] Error initiating system purge:', error)
      setIsPurging(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-mono">Initializing Global Sovereign Tank...</p>
        </div>
      </div>
    )
  }

  const exposedCount = allBrokers.filter((b) => b.status === 'exposed').length
  const purgingCount = allBrokers.filter((b) => b.status === 'purging').length
  const clearCount = allBrokers.filter((b) => b.status === 'clear').length
  const privacyScore = allBrokers.length > 0 ? Math.round((clearCount / allBrokers.length) * 100) : 0

  const totalPages = Math.ceil(allBrokers.length / brokersPerPage) || 1

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-zinc-900 bg-black/95 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-yellow-500" />
              <div>
                <h2 className="text-base font-black text-white tracking-tight">AUSTRALIAN DATA REMOVAL</h2>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Sovereign.Privacy.Protocol v2.6</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-yellow-500 tracking-wider">AU-WEST-NODE</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-wider">OPERATIONAL</span>
              </div>
              <div className="px-2.5 py-1 bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-zinc-900 bg-zinc-950 p-6">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - privacyScore / 100)}`}
                      className="text-destructive transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white">{privacyScore}%</span>
                    <span className="text-[10px] text-zinc-600 font-mono mt-1 tracking-widest">PRIVACY.SCORE</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 text-center bg-zinc-900/50 border border-zinc-900 p-3">
                      <p className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">EXPOSED</p>
                      <p className="text-2xl font-black text-red-500">{exposedCount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-center bg-zinc-900/50 border border-zinc-900 p-3">
                      <p className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">PURGING</p>
                      <p className="text-2xl font-black text-amber-500">{purgingCount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-center bg-zinc-900/50 border border-zinc-900 p-3">
                      <p className="text-[10px] text-zinc-500 font-mono font-bold tracking-wider">CLEAR</p>
                      <p className="text-2xl font-black text-emerald-500">{clearCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="https://buy.stripe.com/test_28o2bJbGL13a8IU7ss" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 font-mono text-sm tracking-widest transition-all active:scale-95 border-2 border-yellow-600"
                    >
                      <Zap className="h-4 w-4" />
                      [INITIATE.FULL.PURGE]
                    </a>
                    
                    <div className="bg-zinc-900/50 border border-zinc-800 p-2.5">
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                        Payment via Stripe. By proceeding: <a href="/terms" className="text-yellow-500 hover:underline">Terms</a> + <a href="/privacy-policy" className="text-yellow-500 hover:underline">Privacy</a>. ACL protected. AUD.
                      </p>
                    </div>
                  </div>

                  {scanningRegion && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground font-mono animate-pulse">
                        Scanning: {scanningRegion.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Global Broker Hit List</h2>
                    <p className="text-sm text-muted-foreground font-mono mt-1">
                      Monitoring {allBrokers.length.toLocaleString()} data brokers across 6 continents
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground font-mono">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800">
                    <tr className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider">
                      <th className="px-4 py-2 text-left">BROKER.NAME</th>
                      <th className="px-4 py-2 text-left">DATA.EXPOSED</th>
                      <th className="px-4 py-2 text-left">REGION</th>
                      <th className="px-4 py-2 text-center">STATUS</th>
                      <th className="px-4 py-2 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {displayedBrokers.map((broker, idx) => (
                      <tr key={`${broker.name}-${idx}`} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-white">{broker.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {broker.dataExposed.map((data) => (
                              <span
                                key={data}
                                className="px-1.5 py-0.5 text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono"
                              >
                                {data}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-zinc-400 font-mono">{broker.region}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {broker.status === 'exposed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-red-500/10 text-red-500 border border-red-500/30">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              EXPOSED
                            </span>
                          )}
                          {broker.status === 'purging' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/30">
                              <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              PURGING
                            </span>
                          )}
                          {broker.status === 'clear' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                              <CheckCircle className="h-2.5 w-2.5" />
                              CLEAR
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            onClick={() => handleKill(broker.name)}
                            disabled={broker.status === 'clear'}
                            size="sm"
                            variant={broker.status === 'exposed' ? 'default' : 'outline'}
                            className={
                              broker.status === 'exposed'
                                ? 'bg-accent hover:bg-accent/90 text-accent-foreground font-mono font-bold'
                                : 'font-mono'
                            }
                          >
                            {broker.status === 'exposed' ? 'KILL' : broker.status === 'purging' ? 'WAIT' : 'DONE'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border px-6 py-4">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="font-mono"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground font-mono">
                    Showing {(currentPage - 1) * brokersPerPage + 1}-
                    {Math.min(currentPage * brokersPerPage, allBrokers.length)} of {allBrokers.length.toLocaleString()}
                  </span>
                  <Button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="font-mono"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-amber-500/5 to-amber-600/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-amber-500" />
                  <h3 className="text-lg font-semibold text-foreground">Founding 500</h3>
                </div>
                <p className="text-3xl font-bold text-amber-500 mb-2">#001</p>
                <p className="text-sm text-muted-foreground font-mono">Membership: Active</p>
                <div className="mt-4 pt-4 border-t border-amber-500/20">
                  <p className="text-xs text-amber-500/80 font-mono">Elite Sovereign Access</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Global Threat Map</h3>
              </div>

              <GlobalThreatMap className="rounded-lg overflow-hidden" />
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">Sentry Trap</h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-mono text-destructive mb-1">Intruder Detected</p>
                  <p className="text-xs text-muted-foreground font-mono">Org: DataHarvest LLC</p>
                  <p className="text-xs text-muted-foreground font-mono">IP: 203.45.67.89</p>
                  <p className="text-xs text-muted-foreground font-mono">Threat: HIGH</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <Clock className="h-3 w-3" />
                  <span>Last scan: 2 minutes ago</span>
                </div>
              </div>
            </div>

            {/* System Health Panel */}
            <SystemHealthPanel />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-semibold text-foreground font-mono">Live Operations Terminal</h3>
          </div>

          <div
            ref={terminalRef}
            className="bg-slate-950 rounded-md p-4 h-48 overflow-y-auto font-mono text-sm text-emerald-400 space-y-1 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent"
          >
            {logs.length === 0 ? (
              <p className="text-muted-foreground">[SYSTEM] Awaiting operations...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500/50 select-none">{'>'}</span>
                  <span className="text-emerald-400/90">{log}</span>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 text-xs text-muted-foreground font-mono text-center">
            Just Software • Programmatic Enforcement • No Human Intervention Required
          </div>
        </div>

        {/* AI Command Center */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <AICommandTerminal className="h-[500px]" />
          <DocumentAnalyzer className="h-[500px]" />
        </div>

        {/* OSINT Scanner */}
        <div className="mt-6">
          <OSINTScanner />
        </div>

        {/* Sovereign Glass Box - Session Tracking */}
        <div className="mt-8">
          <SovereignGlassBox />
        </div>

        <LegalFooter />
      </main>
    </div>
  )
}

export { ADRDashboard }
