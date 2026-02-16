'use client'

import { useState, useEffect, useRef } from 'react'
import { Shield, AlertTriangle, CheckCircle, Loader2, Globe, Users, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SovereignGlassBox } from '@/components/sovereign-glass-box'
import { LegalFooter } from '@/components/legal-footer'

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Australian Data Removal</h1>
              <p className="text-xs text-muted-foreground font-mono">Programmatic Enforcement Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary">Node: Western Australia</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-mono text-emerald-500">Status: Secure</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
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
                    <span className="text-5xl font-bold text-foreground">{privacyScore}%</span>
                    <span className="text-xs text-muted-foreground font-mono mt-1">PRIVACY SCORE</span>
                  </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1 text-center">
                      <p className="text-xs text-muted-foreground font-mono">EXPOSED</p>
                      <p className="text-2xl font-bold text-destructive">{exposedCount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-xs text-muted-foreground font-mono">PURGING</p>
                      <p className="text-2xl font-bold text-amber-500">{purgingCount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1 text-center">
                      <p className="text-xs text-muted-foreground font-mono">CLEAR</p>
                      <p className="text-2xl font-bold text-emerald-500">{clearCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-mono text-lg h-14"
                    >
                      <a 
                        href="https://buy.stripe.com/test_28o2bJbGL13a8IU7ss" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        INITIATE FULL SYSTEM PURGE
                      </a>
                    </Button>
                    
                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Payment processed securely via Stripe. By proceeding, you agree to our <a href="/terms" className="text-yellow-500 hover:underline">Terms of Service</a> and acknowledge our <a href="/privacy-policy" className="text-yellow-500 hover:underline">Privacy Policy</a>. Services subject to Australian Consumer Law guarantees. Prices in AUD.
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
                  <thead className="bg-muted/50">
                    <tr className="text-xs font-mono text-muted-foreground">
                      <th className="px-6 py-3 text-left font-medium">BROKER NAME</th>
                      <th className="px-6 py-3 text-left font-medium">DATA EXPOSED</th>
                      <th className="px-6 py-3 text-left font-medium">REGION</th>
                      <th className="px-6 py-3 text-center font-medium">STATUS</th>
                      <th className="px-6 py-3 text-center font-medium">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayedBrokers.map((broker, idx) => (
                      <tr key={`${broker.name}-${idx}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{broker.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {broker.dataExposed.map((data) => (
                              <span
                                key={data}
                                className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground border border-border"
                              >
                                {data}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground font-mono">{broker.region}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {broker.status === 'exposed' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                              <AlertTriangle className="h-3 w-3" />
                              Exposed
                            </span>
                          )}
                          {broker.status === 'purging' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Purging
                            </span>
                          )}
                          {broker.status === 'clear' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" />
                              Clear
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

              <div className="relative w-full h-48 bg-muted/30 rounded-lg overflow-hidden border border-border">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {worldHotspots.map((hotspot) => (
                    <g key={hotspot.name}>
                      <circle
                        cx={hotspot.coords.x}
                        cy={hotspot.coords.y}
                        r="3"
                        fill={hotspotStates[hotspot.name] === 'clearing' ? '#10b981' : '#ef4444'}
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          from="3"
                          to="6"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.8"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      <circle
                        cx={hotspot.coords.x}
                        cy={hotspot.coords.y}
                        r="2"
                        fill={hotspotStates[hotspot.name] === 'clearing' ? '#10b981' : '#ef4444'}
                      />
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Hostile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Clearing</span>
                </div>
              </div>
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
