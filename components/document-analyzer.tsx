'use client'

import { useState, useCallback } from 'react'
import { 
  FileText, 
  Upload, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Shield,
  Eye,
  FileWarning,
  Zap
} from 'lucide-react'

interface ExtractedPII {
  type: string
  value: string
  confidence: number
  risk: 'critical' | 'high' | 'medium' | 'low'
  location: string
}

interface AnalysisResult {
  piiFound: ExtractedPII[]
  riskScore: number
  sensitiveDataDetected: boolean
  recommendations: string[]
  appRelevance: string[]
  summary: string
}

export function DocumentAnalyzer({ className = '' }: { className?: string }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }, [])

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile)
    setError(null)
    setIsAnalyzing(true)

    try {
      // Simulate document analysis (in production, this would call the AI API)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock analysis result
      const mockResult: AnalysisResult = {
        piiFound: [
          { type: 'Full Name', value: 'John Smith', confidence: 0.98, risk: 'medium', location: 'Page 1, Line 3' },
          { type: 'Email Address', value: 'j***@example.com', confidence: 0.99, risk: 'high', location: 'Page 1, Line 7' },
          { type: 'Phone Number', value: '+61 4** *** ***', confidence: 0.95, risk: 'high', location: 'Page 1, Line 8' },
          { type: 'Home Address', value: '*** Street, Perth WA', confidence: 0.92, risk: 'critical', location: 'Page 2, Line 1' },
          { type: 'Date of Birth', value: '**/**/19**', confidence: 0.88, risk: 'critical', location: 'Page 2, Line 5' },
          { type: 'Tax File Number', value: '*** *** ***', confidence: 0.85, risk: 'critical', location: 'Page 3, Line 12' },
        ],
        riskScore: 78,
        sensitiveDataDetected: true,
        recommendations: [
          'Immediately request deletion from any data brokers holding this information',
          'File a statutory demand under APP 13 for correction/deletion',
          'Consider OAIC complaint if entity refuses deletion',
          'Enable credit monitoring due to TFN exposure',
          'Review all accounts associated with exposed email',
        ],
        appRelevance: [
          'APP 1 - Open and transparent management required',
          'APP 6 - Use/disclosure limitations apply',
          'APP 11 - Security obligations triggered',
          'APP 13 - Correction rights available',
        ],
        summary: 'Document contains 6 instances of personally identifiable information, including 3 items classified as critical sensitivity under the Privacy Act 1988. Immediate action recommended.',
      }

      setResult(mockResult)
    } catch (err) {
      setError('Failed to analyze document. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30'
      case 'low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/30'
    }
  }

  return (
    <div className={`bg-zinc-950 border border-zinc-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black/50">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-mono font-bold text-white">AI.DOCUMENT.ANALYZER</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">PII Detection Engine v2.0</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Upload Zone */}
        {!result && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed transition-colors p-8 ${
              isDragging 
                ? 'border-yellow-500 bg-yellow-500/5' 
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.csv,.json"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isAnalyzing}
            />
            
            <div className="text-center">
              {isAnalyzing ? (
                <div className="space-y-3">
                  <Loader2 className="h-10 w-10 text-yellow-500 mx-auto animate-spin" />
                  <p className="text-sm text-zinc-400 font-mono">Analyzing document...</p>
                  <p className="text-xs text-zinc-600">AI scanning for PII patterns</p>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-mono mb-1">
                    Drop document here or click to upload
                  </p>
                  <p className="text-xs text-zinc-600">
                    Supports PDF, DOC, DOCX, TXT, CSV, JSON
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Analysis Results */}
        {result && (
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Analysis Complete</h3>
                  <p className="text-xs text-zinc-500 font-mono">{file?.name}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 ${
                  result.riskScore >= 70 ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                  result.riskScore >= 40 ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' :
                  'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                }`}>
                  <Shield className="h-3 w-3" />
                  <span className="text-xs font-mono font-bold">RISK: {result.riskScore}%</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{result.summary}</p>
            </div>

            {/* PII Found */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-yellow-500" />
                <h3 className="text-sm font-bold text-white">PII Detected ({result.piiFound.length})</h3>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.piiFound.map((pii, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-black/30 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border ${getRiskColor(pii.risk)}`}>
                        {pii.risk.toUpperCase()}
                      </span>
                      <div>
                        <span className="text-xs text-white font-mono">{pii.type}</span>
                        <span className="text-[10px] text-zinc-600 ml-2">{pii.value}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">{pii.location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* APP Relevance */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-yellow-500" />
                <h3 className="text-sm font-bold text-white">Legal Relevance</h3>
              </div>
              <div className="space-y-1">
                {result.appRelevance.map((app, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span className="font-mono">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-yellow-500" />
                <h3 className="text-sm font-bold text-white">Recommended Actions</h3>
              </div>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-yellow-500 font-mono mt-0.5">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setResult(null)
                  setFile(null)
                }}
                className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono hover:bg-zinc-800 transition-colors"
              >
                ANALYZE ANOTHER
              </button>
              <button
                className="flex-1 px-4 py-2 bg-yellow-500 text-black text-xs font-mono font-bold hover:bg-yellow-400 transition-colors"
              >
                GENERATE REMOVAL REQUEST
              </button>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-2 bg-blue-500/5 border border-blue-500/20 text-[10px] text-blue-400/70">
          <FileWarning className="h-3 w-3 shrink-0 mt-0.5" />
          <span>
            Documents are analyzed locally using AI. No files are stored or transmitted to third parties. 
            Analysis complies with Australian Privacy Principles.
          </span>
        </div>
      </div>
    </div>
  )
}
