'use client'

import { useState, useEffect } from 'react'
import { X, Shield, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function DataCollectionNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      // Check if user has already consented
      const hasConsented = localStorage.getItem('adr-privacy-consent')
      if (!hasConsented) {
        setIsVisible(true)
      }
    } catch (error) {
      console.error('[v0] Error reading consent from localStorage:', error)
      // Show notice if we can't read consent status
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('adr-privacy-consent', 'true')
      localStorage.setItem('adr-privacy-consent-date', new Date().toISOString())
      setIsVisible(false)
      console.log('[v0] Privacy consent saved successfully')
    } catch (error) {
      console.error('[v0] Error saving consent to localStorage:', error)
      // Still hide the notice even if we can't save to localStorage
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center">
            <Shield className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Privacy & Data Collection Notice</h2>
            <p className="text-sm text-muted-foreground">Required under the Privacy Act 1988 (Cth) and Australian Privacy Principles</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-foreground leading-relaxed">
          <p className="text-muted-foreground">
            Before using our services, we are required by law to inform you about how we collect, use, and protect your personal information.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-yellow-500 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Information We Collect (APPs 3, 5 & 6)
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Personal identification details required for data removal requests</li>
              <li>Contact information (name, email address, phone number)</li>
              <li>Payment information (processed securely via Stripe)</li>
              <li>Technical data (IP address, browser information, usage patterns)</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-blue-500 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              How We Use Your Information (APP 6)
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>To submit opt-out requests to data brokers on your behalf</li>
              <li>To process payments and maintain service records</li>
              <li>To communicate with you about service status</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-green-500">Your Rights Under Australian Law</h3>
            <p className="text-muted-foreground">
              You have the right to access, correct, or request deletion of your personal information. You can lodge complaints with the Office of the Australian Information Commissioner (OAIC).
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            By clicking "Accept & Continue," you acknowledge that you have read and understood this notice and consent to the collection and use of your personal information as described in our{' '}
            <Link href="/privacy-policy" className="text-yellow-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAccept}
            size="lg"
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            Accept & Continue
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <Link href="/privacy-policy">
              Read Full Privacy Policy
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-center text-muted-foreground">
          This notice is required by Australian law. You must accept to use our services.
        </p>
      </div>
    </div>
  )
}
