'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Lock,
  Globe,
  Server,
  Database,
  Eye,
  FileSearch,
  Zap,
  TrendingUp,
  Activity,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SecurityAuditResult {
  timestamp: string
  auditId: string
  target: string
  overallScore: number
  overallGrade: string
  owaspChecks: OWASPCheck[]
  privacyActChecks: PrivacyActCheck[]
  infrastructureChecks: InfrastructureCheck[]
  vulnerabilities: Vulnerability[]
  recommendations: Recommendation[]
  complianceStatus: ComplianceStatus
}

interface OWASPCheck {
  id: string
  name: string
  category: string
  severity: string
  status: string
  description: string
  remediation: string
  evidence?: string[]
}

interface PrivacyActCheck {
  principle: string
  number: number
  status: string
  findings: string[]
  recommendations: string[]
}

interface InfrastructureCheck {
  category: string
  check: string
  status: string
  details: string
}

interface Vulnerability {
  id: string
  title: string
  severity: string
  cvss: number
  cwe: string
  description: string
  affected: string
  remediation: string
  references: string[]
}

interface Recommendation {
  priority: string
  category: string
  title: string
  description: string
  effort: string
  impact: string
}

interface ComplianceStatus {
  privacyAct1988: { compliant: boolean; score: number }
  owasp2023: { compliant: boolean; score: number }
  asdEssentialEight: { compliant: boolean; maturityLevel: number }
  iso27001: { compliant: boolean; score: number }
  pciDss: { compliant: boolean; level: number }
  soc2: { compliant: boolean; type: number }
}

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function SecurityOperationsDashboard({ className }: { className?: string }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanType, setScanType] = useState<string>('full')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    owasp: true,
    privacy: false,
    infrastructure: false,
    compliance: true,
  })
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null)
  
  const { data: liveStatus } = useSWR('/api/status', fetcher, { refreshInterval: 10000 })
  
  const runAudit = async () => {
    setIsScanning(true)
    try {
      const response = await fetch(`/api/security/audit?type=${scanType}`)
      const data = await response.json()
      setAuditResult(data)
    } catch (error) {
      console.error('[v0] Security audit failed:', error)
    } finally {
      setIsScanning(false)
    }
  }
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-emerald-400'
      case 'A': return 'text-emerald-500'
      case 'B': return 'text-yellow-500'
      case 'C': return 'text-amber-500'
      case 'D': return 'text-orange-500'
      case 'F': return 'text-red-500'
      default: return 'text-zinc-400'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
      case 'COMPLIANT':
      case 'IMPLEMENTED':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'FAIL':
      case 'NON_COMPLIANT':
      case 'NOT_IMPLEMENTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'WARN':
      case 'PARTIAL':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-zinc-500" />
    }
  }
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'INFO': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
      default: return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
    }
  }

  return (
    <div className={cn('bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Security Operations Center</h2>
              <p className="text-xs text-zinc-500 font-mono">COMPLIANCE.AUDIT // PENTEST // THREAT.INTEL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="full">Full Audit</option>
              <option value="owasp">OWASP Top 10</option>
              <option value="privacy">Privacy Act</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="essential8">Essential Eight</option>
              <option value="pentest">Penetration Test</option>
            </select>
            
            <Button
              onClick={runAudit}
              disabled={isScanning}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  SCANNING...
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 mr-2" />
                  RUN AUDIT
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Live Status Bar */}
      <div className="bg-black/30 border-b border-zinc-800 px-6 py-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-500" />
              <span className="text-zinc-400">STATUS:</span>
              <span className="text-emerald-500">{liveStatus?.status || 'OPERATIONAL'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Server className="h-3 w-3 text-blue-400" />
              <span className="text-zinc-400">SERVICES:</span>
              <span className="text-blue-400">{liveStatus?.services?.length || 6} ACTIVE</span>
            </div>
          </div>
          <div className="text-zinc-600">
            Last scan: {auditResult?.timestamp ? new Date(auditResult.timestamp).toLocaleString() : 'Never'}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {!auditResult ? (
          // Initial State
          <div className="text-center py-16">
            <Shield className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">No Security Audit Run</h3>
            <p className="text-sm text-zinc-600 mb-6">
              Run a comprehensive security audit to check OWASP compliance, Australian Privacy Act,<br />
              infrastructure security, and penetration test results.
            </p>
            <Button onClick={runAudit} className="bg-emerald-600 hover:bg-emerald-500">
              <Zap className="h-4 w-4 mr-2" />
              Start Security Audit
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                <div className={cn('text-4xl font-black', getGradeColor(auditResult.overallGrade))}>
                  {auditResult.overallGrade}
                </div>
                <div className="text-xs text-zinc-500 font-mono mt-1">OVERALL GRADE</div>
                <div className="text-lg font-bold text-white mt-2">{auditResult.overallScore}%</div>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-zinc-400 font-mono">OWASP 2023</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {auditResult.owaspChecks.filter(c => c.status === 'PASS').length}/{auditResult.owaspChecks.length}
                </div>
                <div className="text-xs text-emerald-500 font-mono">
                  {auditResult.complianceStatus.owasp2023.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </div>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-zinc-400 font-mono">PRIVACY ACT</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {auditResult.privacyActChecks.filter(c => c.status === 'COMPLIANT').length}/13
                </div>
                <div className="text-xs text-blue-500 font-mono">
                  APP 1-13 {auditResult.complianceStatus.privacyAct1988.compliant ? 'COMPLIANT' : 'PARTIAL'}
                </div>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-zinc-400 font-mono">ESSENTIAL 8</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  ML{auditResult.complianceStatus.asdEssentialEight.maturityLevel}
                </div>
                <div className="text-xs text-purple-500 font-mono">
                  MATURITY LEVEL {auditResult.complianceStatus.asdEssentialEight.maturityLevel}
                </div>
              </div>
            </div>
            
            {/* Compliance Badges */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4">
              <div className="text-xs text-zinc-500 font-mono mb-3">COMPLIANCE STATUS</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(auditResult.complianceStatus).map(([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      'px-3 py-1.5 rounded border text-xs font-mono flex items-center gap-2',
                      value.compliant
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    )}
                  >
                    {value.compliant ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            
            {/* OWASP Checks */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('owasp')}
                className="w-full bg-zinc-900/50 px-4 py-3 flex items-center justify-between hover:bg-zinc-900/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold text-white">OWASP API Security Top 10 (2023)</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {auditResult.owaspChecks.filter(c => c.status === 'PASS').length} PASSED
                  </span>
                </div>
                {expandedSections.owasp ? (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                )}
              </button>
              
              {expandedSections.owasp && (
                <div className="divide-y divide-zinc-800">
                  {auditResult.owaspChecks.map((check) => (
                    <div key={check.id} className="px-4 py-3 bg-black/20">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-zinc-500">{check.id}</span>
                              <span className="font-medium text-white text-sm">{check.name}</span>
                              <span className={cn(
                                'px-1.5 py-0.5 text-[10px] font-mono rounded border',
                                getSeverityColor(check.severity)
                              )}>
                                {check.severity}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1 max-w-2xl">{check.description}</p>
                            {check.evidence && check.evidence.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {check.evidence.map((e, i) => (
                                  <div key={i} className="text-xs text-emerald-500/80 flex items-center gap-1">
                                    <CheckCircle className="h-2.5 w-2.5" />
                                    {e}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Privacy Act Checks */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('privacy')}
                className="w-full bg-zinc-900/50 px-4 py-3 flex items-center justify-between hover:bg-zinc-900/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-white">Australian Privacy Principles (APP 1-13)</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {auditResult.privacyActChecks.filter(c => c.status === 'COMPLIANT').length} COMPLIANT
                  </span>
                </div>
                {expandedSections.privacy ? (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                )}
              </button>
              
              {expandedSections.privacy && (
                <div className="divide-y divide-zinc-800">
                  {auditResult.privacyActChecks.map((check) => (
                    <div key={check.number} className="px-4 py-3 bg-black/20">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-500">APP {check.number}</span>
                            <span className="font-medium text-white text-sm">{check.principle}</span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {check.findings.map((f, i) => (
                              <div key={i} className="text-xs text-zinc-400 flex items-center gap-1">
                                <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Infrastructure Checks */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('infrastructure')}
                className="w-full bg-zinc-900/50 px-4 py-3 flex items-center justify-between hover:bg-zinc-900/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Server className="h-4 w-4 text-purple-500" />
                  <span className="font-semibold text-white">Infrastructure Security</span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {auditResult.infrastructureChecks.filter(c => c.status === 'PASS').length} PASSED
                  </span>
                </div>
                {expandedSections.infrastructure ? (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                )}
              </button>
              
              {expandedSections.infrastructure && (
                <div className="bg-black/20 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {auditResult.infrastructureChecks.map((check, i) => (
                      <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-zinc-500 font-mono">{check.category}</span>
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="text-sm text-white font-medium">{check.check}</div>
                        <div className="text-xs text-zinc-500 mt-1">{check.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            {auditResult.recommendations.length > 0 && (
              <div className="border border-zinc-800 rounded-lg overflow-hidden">
                <div className="bg-zinc-900/50 px-4 py-3 flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-white">Recommendations</span>
                </div>
                <div className="p-4 space-y-3">
                  {auditResult.recommendations.map((rec, i) => (
                    <div key={i} className="bg-black/20 border border-zinc-800 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          'px-2 py-0.5 text-[10px] font-mono rounded border',
                          getSeverityColor(rec.priority)
                        )}>
                          {rec.priority}
                        </span>
                        <span className="text-xs text-zinc-500">{rec.category}</span>
                      </div>
                      <div className="text-sm text-white font-medium">{rec.title}</div>
                      <div className="text-xs text-zinc-400 mt-1">{rec.description}</div>
                      <div className="flex gap-4 mt-2 text-xs text-zinc-500">
                        <span>Effort: {rec.effort}</span>
                        <span>Impact: {rec.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
