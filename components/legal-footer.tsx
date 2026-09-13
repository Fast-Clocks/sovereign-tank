import Link from 'next/link'
import { Shield } from 'lucide-react'
import { BUSINESS_INFO } from '@/lib/business-info'

export function LegalFooter() {
  return (
    <footer className="mt-12 rounded-lg border-t border-border bg-card/50 p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">{BUSINESS_INFO.businessName}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Privacy-focused demonstration and workflow tooling. Public claims are limited to what the current demonstration actually proves.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-foreground">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                OAIC
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-foreground">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Privacy inquiries:</li>
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

      <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
        <p>© 2026 Australian Data Removal. Demonstration only; not legal advice or a compliance certification.</p>
      </div>
    </footer>
  )
}
