'use client'

import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'

const technicalLogs = [
  'BUF_ALLOC_MEM_VOLATILE',
  'ENC_HANDSHAKE_AES256',
  'TPM_VERIFY_HARDWARE_ID',
  'SESSION_BIND_PHYSICAL_CHIP',
  'CRYPTOGRAPHIC_NONCE_GEN',
  'BILATERAL_KEY_EXCHANGE',
  'ATTESTATION_SIGN_VERIFY',
  'EPHEMERAL_KEY_ROTATION',
  'SECURE_ENCLAVE_LOCK',
  'ZERO_KNOWLEDGE_PROOF_CHECK'
]

const plainEnglish = [
  'Allocating secure memory',
  'Establishing encryption',
  'Verifying hardware identity',
  'Binding session to physical chip',
  'Generating cryptographic nonce',
  'Exchanging bilateral keys',
  'Signing and verifying attestation',
  'Rotating ephemeral keys',
  'Locking secure enclave',
  'Checking zero-knowledge proof'
]

export function SovereignGlassBox() {
  const [mode, setMode] = useState<'technical' | 'plain' | 'purging' | 'sterilized'>('technical')
  const [purgeLines, setPurgeLines] = useState<string[]>([])

  const toggleMode = () => {
    if (mode === 'technical') {
      setMode('plain')
    } else if (mode === 'plain') {
      setMode('technical')
    }
  }

  const executePurge = () => {
    setMode('purging')
    
    // Generate scrolling zeros
    const zeroLines = Array(10).fill('00000000')
    setPurgeLines(zeroLines)
    
    // After 2 seconds, show sterilized message
    setTimeout(() => {
      setMode('sterilized')
    }, 2000)
  }

  const displayLines = mode === 'technical' ? technicalLogs : mode === 'plain' ? plainEnglish : purgeLines

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          <h3 className="text-xl sm:text-2xl font-bold">Sovereign Glass Box</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono text-green-500 font-bold">LIVE</span>
        </div>
      </div>

      {/* The Glass Box - Clickable */}
      <div 
        onClick={mode !== 'purging' && mode !== 'sterilized' ? toggleMode : undefined}
        className={`bg-black/40 border border-yellow-500/30 rounded-xl p-4 sm:p-6 mb-6 min-h-[280px] sm:min-h-[320px] overflow-hidden relative ${
          mode !== 'purging' && mode !== 'sterilized' ? 'cursor-pointer hover:border-yellow-500/50 transition-colors' : ''
        }`}
      >
        {mode === 'sterilized' ? (
          <div className="flex items-center justify-center h-full min-h-[240px] sm:min-h-[280px]">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-green-500 mb-2">
                SYSTEM STERILIZED
              </div>
              <div className="text-xs text-zinc-500 font-mono">ALL DATA PURGED</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs sm:text-sm">
            {displayLines.map((line, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 ${
                  mode === 'technical' ? 'text-yellow-400' : 
                  mode === 'plain' ? 'text-zinc-300' : 
                  'text-red-500'
                } ${mode === 'purging' ? 'animate-bounce' : ''}`}
              >
                <span className="text-zinc-600">[{String(index + 1).padStart(2, '0')}]</span>
                <span className={mode === 'purging' ? 'animate-pulse' : ''}>{line}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Overlay hint */}
        {mode !== 'purging' && mode !== 'sterilized' && (
          <div className="absolute bottom-2 right-2 text-[9px] text-zinc-600 font-mono">
            {mode === 'technical' ? 'Click for plain English' : 'Click for technical view'}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={executePurge}
          disabled={mode === 'purging' || mode === 'sterilized'}
          className="flex-1 bg-red-900/20 border border-red-500/30 text-red-500 font-bold py-3 rounded-lg uppercase text-xs tracking-wider hover:bg-red-900/30 hover:border-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {mode === 'sterilized' ? 'System Purged' : 'Execute Secure Purge'}
        </button>
        {mode === 'sterilized' && (
          <button
            onClick={() => setMode('technical')}
            className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold py-3 rounded-lg uppercase text-xs tracking-wider hover:bg-zinc-700 hover:border-zinc-600 transition-all active:scale-95"
          >
            Reset System
          </button>
        )}
      </div>
    </div>
  )
}
