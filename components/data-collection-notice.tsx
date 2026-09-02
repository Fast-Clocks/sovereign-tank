'use client'

import { useState, useEffect } from 'react'
import { Shield, FileText, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function DataCollectionNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const hasConsented = localStorage.getItem('adr-privacy-consent')
      if (!hasConsented) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only init; a lazy useState initialiser would run during SSR and cause a hydration mismatch
        setIsVisible(true)
      }
    } catch (error) {
      console.error('[v0] Error reading consent from localStorage:', error)
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('adr-privacy-consent', 'true')
      localStorage.setItem('adr-privacy-consent-date', new Date().toISOString())
      setIsVisible(false)
    } catch (error) {
      console.error('[v0] Error saving consent to localStorage:', error)
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 max-w-3xl w-full p-6 sm:p-8 animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 h-10 w-10 bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <Shield className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white tracking-tight mb-1">Data Collection Notice</h2>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider">REQUIRED UNDER PRIVACY ACT 1988 (CTH) | APPs 1, 5 &amp; 6</p>
          </div>
        </div>

        {/* Required Collection Notice - Verbatim from s10.4 */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-mono font-bold text-yellow-500 tracking-wider">COLLECTION NOTICE</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Australian Data Removal collects the information in this form to assess your matter, create a case record, communicate with you, and decide whether we can assist. How we handle your information is described in our Privacy Policy.
          </p>
        </div>

        {/* Sensitive Documents Warning */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            <span className="text-[10px] font-mono font-bold text-red-500 tracking-wider">DO NOT PROVIDE AT THIS STAGE</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Identity documents, passwords, TFNs, Medicare numbers, passport numbers, driver licence numbers, bank details, login credentials, full dates of birth, or full residential street addresses.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="space-y-3 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 p-4">
            <h3 className="text-xs font-bold text-white mb-2">What We Collect</h3>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
              <li>Contact information (name, email, phone)</li>
              <li>Technical data (IP address, browser information)</li>
              <li>Service usage data and interaction logs</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-4">
            <h3 className="text-xs font-bold text-white mb-2">How We Use It</h3>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
              <li>To assess your matter and determine suitability</li>
              <li>To submit removal, suppression, or correction requests</li>
              <li>To communicate with you about service outcomes</li>
            </ul>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="border border-zinc-800 p-3 mb-6 text-[10px] text-zinc-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-zinc-400">Legal Disclaimer:</strong> ADR is not a law firm and does not provide legal advice. Where a matter requires legal advice, ADR refers to qualified Australian legal counsel.
          </p>
          <p>
            <strong className="text-zinc-400">Service Limitation:</strong> ADR uses lawful request pathways to seek removal, suppression, or correction where available. ADR does not guarantee deletion.
          </p>
        </div>

        {/* Your Rights */}
        <p className="text-[10px] text-zinc-500 mb-6">
          You have the right to access, correct, or request deletion of your personal information. Complaints may be lodged with the Office of the Australian Information Commissioner (OAIC). By clicking &quot;Accept &amp; Continue,&quot; you acknowledge this notice and consent to data collection as described in our{' '}
          <Link href="/privacy-policy" className="text-yellow-500 hover:underline">Privacy Policy</Link>.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAccept}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 text-xs tracking-wider"
          >
            ACCEPT &amp; CONTINUE
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 py-3 text-xs"
          >
            <Link href="/privacy-policy">
              READ FULL POLICY
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-4 text-[9px] text-center text-zinc-600 font-mono">
          ADR-NOTICE-v2.6 | ABN 86 921 751 764 | Perth, Western Australia
        </p>
      </div>
    </div>
  )
}
