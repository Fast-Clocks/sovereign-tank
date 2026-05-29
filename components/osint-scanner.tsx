'use client'

import { useState, useCallback } from 'react'
import { Search, AlertTriangle, Shield, Globe, Eye, Database, Zap, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'

interface ScanResult {
  scanId: string
  timestamp: string
  target: { email?: string; username?: string }
  breaches: Array<{
    source: string
    breachDate: string
    dataTypes: string[]
    severity: string
    description: string
  }>
  usernameMatches: Array<{
    platform: string
    url: string
    category: string
    exists: boolean
  }>
  dataBrokerExposures: Array<{
    broker: string
    url: string
    dataFound: string[]
    optOutUrl: string
    optOutMethod: string
    difficulty: string
    estimatedRemovalDays: number
  }>
  darkWebMentions: Array<{
    source: string
    dateFound: string
    dataType: string
    riskLevel: string
  }>
  riskScore: number
  riskLevel: string
  recommendations: string[]
  scanDuration: number
}

interface OSINTScannerProps {
  className?: string
}

export function OSINTScanner({ className = '' }: OSINTScannerProps) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanPhase, setScanPhase] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runScan = useCallback(async () => {
    if (!email && !username) {
      setError('Please enter an email or username to scan')
      return
    }

    setIsScanning(true)
    setError(null)
    setResult(null)
    setScanProgress(0)

    // Simulate scan phases
    const phases = [
      { phase: 'Initializing secure connection...', progress: 10 },
      { phase: 'Querying breach databases...', progress: 25 },
      { phase: 'Scanning data broker networks...', progress: 45 },
      { phase: 'Checking social platforms...', progress: 65 },
      { phase: 'Monitoring dark web sources...', progress: 80 },
      { phase: 'Calculating risk score...', progress: 90 },
      { phase: 'Generating recommendations...', progress: 95 },
    ]

    for (const { phase, progress } of phases) {
      setScanPhase(phase)
      setScanProgress(progress)
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500))
    }

    try {
      const response = await fetch('/api/osint/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      })

      if (!response.ok) throw new Error('Scan failed')

      const data = await response.json()
      setScanProgress(100)
      setScanPhase('Scan complete')
      setResult(data)
    } catch (err) {
      setError('Scan failed. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }, [email, username])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/30'
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'hard': return 'text-orange-500'
      case 'very_hard': return 'text-red-500'
      default: return 'text-zinc-500'
    }
  }

  return (
    <div className={`bg-zinc-950 border border-zinc-800 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Search className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">OSINT Scanner</h3>
            <p className="text-xs text-zinc-500 font-mono">Breach Detection + Data Broker Exposure + Dark Web Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-green-500">SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-mono text-zinc-500 mb-2">EMAIL ADDRESS</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="target@example.com"
            disabled={isScanning}
            className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 font-mono text-sm focus:border-yellow-500/50 focus:outline-none disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-zinc-500 mb-2">USERNAME (OPTIONAL)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            disabled={isScanning}
            className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 font-mono text-sm focus:border-yellow-500/50 focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={runScan}
        disabled={isScanning || (!email && !username)}
        className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black py-4 font-mono text-sm tracking-widest transition-all active:scale-[0.99] disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {scanPhase}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            [INITIATE.COMPREHENSIVE.SCAN]
          </>
        )}
      </button>

      {/* Progress Bar */}
      {isScanning && (
        <div className="mt-4">
          <div className="h-1 bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-2 text-center">{scanProgress}% Complete</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-500 font-mono">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-6">
          {/* Risk Score */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800">
            <div>
              <p className="text-xs font-mono text-zinc-500 mb-1">PRIVACY RISK SCORE</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-white">{result.riskScore}</span>
                <span className="text-lg text-zinc-500">/100</span>
              </div>
            </div>
            <div className={`px-4 py-2 border font-mono text-sm font-bold uppercase ${getRiskColor(result.riskLevel)}`}>
              {result.riskLevel} RISK
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{result.breaches.length}</p>
              <p className="text-[10px] font-mono text-zinc-500">BREACHES</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
              <Database className="h-5 w-5 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{result.dataBrokerExposures.length}</p>
              <p className="text-[10px] font-mono text-zinc-500">DATA BROKERS</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
              <Globe className="h-5 w-5 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{result.usernameMatches.length}</p>
              <p className="text-[10px] font-mono text-zinc-500">PLATFORMS</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
              <Eye className="h-5 w-5 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{result.darkWebMentions.length}</p>
              <p className="text-[10px] font-mono text-zinc-500">DARK WEB</p>
            </div>
          </div>

          {/* Breaches */}
          {result.breaches.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                DATA BREACHES DETECTED
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.breaches.map((breach, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{breach.source}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 border ${getRiskColor(breach.severity)}`}>
                        {breach.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{breach.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {breach.dataTypes.map((type, j) => (
                        <span key={j} className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 text-zinc-400">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Brokers */}
          {result.dataBrokerExposures.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Database className="h-4 w-4 text-orange-500" />
                DATA BROKER EXPOSURES
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.dataBrokerExposures.map((broker, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{broker.broker}</span>
                      <span className={`text-[10px] font-mono ${getDifficultyColor(broker.difficulty)}`}>
                        {broker.difficulty.toUpperCase()} REMOVAL
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {broker.dataFound.map((data, j) => (
                        <span key={j} className="text-[10px] font-mono bg-orange-500/10 text-orange-500 px-2 py-0.5 border border-orange-500/30">
                          {data}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-mono">Est. {broker.estimatedRemovalDays} days</span>
                      <a 
                        href={broker.optOutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-yellow-500 hover:text-yellow-400"
                      >
                        OPT-OUT <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                RECOMMENDED ACTIONS
              </h4>
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Scan Metadata */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-600">
            <span>SCAN ID: {result.scanId}</span>
            <span>DURATION: {result.scanDuration}ms</span>
            <span>{new Date(result.timestamp).toISOString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
