import Link from 'next/link'
import { Shield } from 'lucide-react'
import { BUSINESS_INFO, getFormattedABN } from '@/lib/business-info'

export function LegalFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card/50 rounded-lg p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">{BUSINESS_INFO.businessName}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Programmatic enforcement of your digital privacy rights across Australian and global data brokers in compliance with the Privacy Act 1988 (Cth).
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            {getFormattedABN()}
          </p>
        </div>

        <div>
          <h3 className="font-bold text-foreground mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/privacy-policy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                href="/terms" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <a 
                href="https://www.oaic.gov.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                OAIC Complaints
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-foreground mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Privacy Inquiries:</li>
            <li>
              <a 
                href={`mailto:${BUSINESS_INFO.privacyEmail}`}
                className="text-primary hover:underline"
              >
                {BUSINESS_INFO.privacyEmail}
              </a>
            </li>
            <li className="mt-4">Support:</li>
            <li>
              <a 
                href={`mailto:${BUSINESS_INFO.supportEmail}`}
                className="text-primary hover:underline"
              >
                {BUSINESS_INFO.supportEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © 2026 Australian Data Removal. All rights reserved. Operating in compliance with Australian Privacy Principles (APPs).
          </p>
          <div className="flex items-center gap-4">
            <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-500 font-mono">
              Privacy Act 1988 Compliant
            </span>
            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-blue-500 font-mono">
              NDB Scheme Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
