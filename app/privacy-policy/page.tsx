export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border border-zinc-800 bg-zinc-950 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-xs font-mono text-zinc-500">Last Updated: 30 May 2026 | Version 2.6</p>
          </div>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">1. Introduction</h2>
              <p className="mb-4">
                This Privacy Policy explains how Australian Data Removal (&quot;ADR,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated by Christopher Robinson as a sole trader (ABN 86 921 751 764), collects, uses, discloses, and protects your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 text-xs">
                <p className="font-bold text-yellow-500 mb-2">IMPORTANT NOTICE</p>
                <p className="text-zinc-400">
                  ADR is not a law firm and does not provide legal advice. Where a matter requires legal advice, ADR refers to qualified Australian legal counsel.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">2. Information We Collect (APPs 3 &amp; 5)</h2>
              <p className="mb-4">We collect the following categories of personal information:</p>
              <div className="bg-zinc-900 border border-zinc-800 p-4 mb-4">
                <h3 className="font-bold text-white text-sm mb-2">Contact &amp; Identity Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>Name, email address, phone number</li>
                  <li>Information required to identify you to data sources for removal requests</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4 mb-4">
                <h3 className="font-bold text-white text-sm mb-2">Service &amp; Payment Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>Payment information (processed securely via Stripe; we do not store card details)</li>
                  <li>Case file records and action logs</li>
                  <li>Service usage data and correspondence</li>
                </ul>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <h3 className="font-bold text-white text-sm mb-2">Technical Information</h3>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400 text-xs">
                  <li>IP address, browser type, device information</li>
                  <li>Interaction logs and analytics data</li>
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-4 mt-4 text-xs">
                <p className="font-bold text-red-500 mb-2">SENSITIVE DOCUMENTS NOT ACCEPTED AT INTAKE</p>
                <p className="text-zinc-400">
                  Please do not upload or provide identity documents, passwords, TFNs, Medicare numbers, passport numbers, driver licence numbers, bank details, login credentials, full dates of birth, or full residential street addresses at the intake stage.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">3. How We Use Your Information (APP 6)</h2>
              <p className="mb-4">We use your personal information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>To assess your matter and create a case record</li>
                <li>To submit removal, suppression, or correction requests to data sources on your behalf</li>
                <li>To process payments and maintain service records</li>
                <li>To communicate with you about service status and outcomes</li>
                <li>To issue Verification Receipts documenting completed actions</li>
                <li>To comply with legal obligations and regulatory requirements</li>
                <li>To improve and develop our services through documented data minimisation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">4. Disclosure of Personal Information (APP 6)</h2>
              <p className="mb-4">We may disclose your personal information to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 mb-4">
                <li>Data sources (brokers, platforms, search engines) for the purpose of removal, suppression, or correction requests</li>
                <li>Payment processors (Stripe) for transaction processing</li>
                <li>Legal and regulatory authorities when required by law</li>
                <li>Referral partners (IDCARE, eSafety Commissioner, legal counsel) where appropriate and with your consent</li>
                <li>Service providers who assist in our operations under strict confidentiality agreements</li>
              </ul>
              <div className="bg-zinc-900 border border-zinc-800 p-4 text-xs">
                <p className="text-zinc-400">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes. No referral carries commission, rebate, referral fee, or commercial incentive.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">5. Data Retention (APP 11)</h2>
              <p className="mb-4">We retain your personal information in accordance with the following schedule:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-zinc-800">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-3 py-2 text-left text-zinc-400 font-mono">Data Type</th>
                      <th className="px-3 py-2 text-left text-zinc-400 font-mono">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Client intake data</td>
                      <td className="px-3 py-2 text-zinc-400">Engagement + 7 years, then delete/de-identify</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Case event logs (non-sensitive)</td>
                      <td className="px-3 py-2 text-zinc-400">Engagement + 7 years</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Case event logs (sensitive)</td>
                      <td className="px-3 py-2 text-zinc-400">Engagement + 2 years, then delete</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Payment records</td>
                      <td className="px-3 py-2 text-zinc-400">7 years (ATO requirement)</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Verification Receipts</td>
                      <td className="px-3 py-2 text-zinc-400">7 years from issue</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-zinc-300">Source correspondence</td>
                      <td className="px-3 py-2 text-zinc-400">Engagement + 2 years, then delete</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">6. Data Security (APP 11)</h2>
              <p className="mb-4">
                We implement industry-standard security measures including AES-256 encryption, TLS 1.3 for data in transit, hardware-bound attestation where applicable, and documented access controls. Our infrastructure includes Web Application Firewall (WAF) protection, DDoS mitigation, and regular security audits.
              </p>
              <p className="text-zinc-400 text-xs">
                Despite our efforts, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but maintain documented data minimisation practices to limit exposure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">7. Your Rights Under Australian Privacy Law</h2>
              <p className="mb-4">Under the Privacy Act 1988 and APPs, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 mb-4">
                <li><strong className="text-white">Access</strong> your personal information (APP 12)</li>
                <li><strong className="text-white">Request correction</strong> of inaccurate information (APP 13)</li>
                <li><strong className="text-white">Request deletion</strong> of your information in certain circumstances</li>
                <li><strong className="text-white">Opt-out</strong> of direct marketing communications</li>
                <li><strong className="text-white">Make a complaint</strong> about privacy concerns</li>
              </ul>
              <p className="text-zinc-400 text-xs">
                To exercise any of these rights, contact our Privacy Officer using the details below.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">8. Overseas Disclosure (APP 8)</h2>
              <p className="mb-4">
                Some data sources and service providers are located overseas. When we disclose your information to overseas recipients in the course of submitting removal requests, we ensure the disclosure is:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Necessary for the services you have requested</li>
                <li>Subject to appropriate safeguards where practicable</li>
                <li>Compliant with APP 8 cross-border disclosure requirements</li>
              </ul>
              <p className="text-zinc-400 text-xs mt-4">
                Countries where data sources may be located include but are not limited to: United States, United Kingdom, European Union member states, Singapore, and New Zealand.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">9. Notifiable Data Breaches</h2>
              <p className="text-zinc-400">
                In accordance with the Notifiable Data Breaches (NDB) scheme under Part IIIC of the Privacy Act, we will notify you and the Office of the Australian Information Commissioner (OAIC) if we have reasonable grounds to believe an eligible data breach has occurred that is likely to result in serious harm.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">10. Automated Decision-Making</h2>
              <p className="text-zinc-400">
                As of December 2026, we are required to disclose our use of automated decision-making systems. Our services may use automated systems to: prioritise case files, calculate exposure scores, and generate preliminary removal recommendations. All automated assessments are subject to human-led review before any material action is taken on your behalf.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">11. Contact Us</h2>
              <p className="mb-4">For privacy-related inquiries, access requests, or complaints:</p>
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <p className="text-white font-bold mb-2">Privacy Officer</p>
                <p className="text-zinc-400 text-xs mb-1">Christopher Robinson</p>
                <p className="text-zinc-400 text-xs mb-1">Trading as Australian Data Removal</p>
                <p className="text-zinc-400 text-xs mb-1">ABN: 86 921 751 764</p>
                <p className="text-zinc-400 text-xs mb-1">Email: <a href="mailto:hello@ausdataremoval.com.au" className="text-yellow-500 hover:underline">hello@ausdataremoval.com.au</a></p>
                <p className="text-zinc-400 text-xs">Phone: <a href="tel:1300504079" className="text-yellow-500 hover:underline">1300 504 079</a></p>
              </div>
              <p className="text-zinc-400 text-xs mt-4">
                If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at{' '}
                <a href="https://www.oaic.gov.au" className="text-yellow-500 hover:underline" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">12. Changes to This Policy</h2>
              <p className="text-zinc-400">
                We may update this Privacy Policy from time to time. Material changes will be notified through our website or via email. The &quot;Last Updated&quot; date at the top of this policy indicates when it was last revised. Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <div className="border-t border-zinc-800 pt-6 mt-8">
              <p className="text-[10px] text-zinc-600 font-mono">
                ADR-POL-PRIVACY-v2.6 | Jurisdiction: Western Australia, Commonwealth of Australia | EST. 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
