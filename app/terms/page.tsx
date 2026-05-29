export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border border-zinc-800 bg-zinc-950 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Terms of Service</h1>
            <p className="text-xs font-mono text-zinc-500">Last Updated: 30 May 2026 | Version 2.6</p>
          </div>

          <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
            {/* Mandatory Disclaimers */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 text-xs space-y-3">
              <p className="font-bold text-yellow-500">MANDATORY DISCLAIMERS</p>
              <p className="text-zinc-400">
                (a) ADR is not a law firm and does not provide legal advice. Where a matter requires legal advice, ADR refers to qualified Australian legal counsel.
              </p>
              <p className="text-zinc-400">
                (b) ADR uses lawful request pathways to seek removal, suppression, or correction where available. ADR does not guarantee deletion. Some sources may refuse, require direct verification, rely on public-record exemptions, or only remove search visibility rather than source content.
              </p>
              <p className="text-zinc-400">
                (c) ADR is not affiliated with, endorsed by, or approved by any Australian government agency or regulator unless expressly stated.
              </p>
            </div>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">1. Agreement to Terms</h2>
              <p>
                By accessing and using the services provided by Australian Data Removal (&quot;ADR,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated by Christopher Robinson as a sole trader (ABN 86 921 751 764), you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable Australian laws and regulations.
              </p>
              <p className="mt-4 text-zinc-400">
                If you do not agree with these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">2. Services Description</h2>
              <p className="mb-4">
                ADR provides data removal, suppression, and correction services designed to submit lawful opt-out and removal requests to data sources on behalf of clients. Our services include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Assessment of data exposure across identified sources</li>
                <li>Submission of removal, suppression, or correction requests</li>
                <li>Periodic follow-up and verification of request outcomes</li>
                <li>Issuance of Verification Receipts documenting completed actions</li>
              </ul>
              <div className="bg-zinc-900 border border-zinc-800 p-4 mt-4 text-xs">
                <p className="font-bold text-white mb-2">SERVICE LIMITATIONS</p>
                <p className="text-zinc-400">
                  Outcome depends on source rules, eligibility, and verification. We do not guarantee complete removal from all sources. Some data sources may refuse requests, require direct identity verification, rely on public-record exemptions, or only remove search visibility rather than underlying source content.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">3. Seven Compliance Gates</h2>
              <p className="mb-4">Before commencing paid work, you must complete the following compliance gates:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Identity verification', 'Scope confirmation', 'Privacy notice acknowledgment', 'Terms acceptance', 'Payment confirmed', 'Suitability assessment', 'No sensitive documents at intake'].map((gate, i) => (
                  <div key={i} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs">
                    <span className="text-yellow-500 font-mono font-bold">{i + 1}</span>
                    <span className="text-zinc-300">{gate}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">4. User Obligations</h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Provide accurate and truthful information</li>
                <li>Use the service only for lawful purposes relating to your own personal information</li>
                <li>Not attempt to circumvent, interfere with, or reverse engineer the service</li>
                <li>Maintain the confidentiality of any account credentials</li>
                <li>Notify us immediately of any unauthorised access or security concerns</li>
                <li>Not submit false, misleading, or fraudulent removal requests</li>
              </ul>
              <div className="bg-red-500/10 border border-red-500/20 p-4 mt-4 text-xs">
                <p className="font-bold text-red-500 mb-2">PROHIBITED AT INTAKE</p>
                <p className="text-zinc-400">
                  Do not upload or provide identity documents, passwords, TFNs, Medicare numbers, passport numbers, driver licence numbers, bank details, login credentials, full dates of birth, or full residential street addresses at the intake stage.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">5. Payment Terms</h2>
              <p className="mb-4">
                Payment for services is processed through Stripe, our PCI-DSS compliant third-party payment processor. All fees are in Australian Dollars (AUD).
              </p>
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <h3 className="font-bold text-white text-sm mb-2">Service Pricing</h3>
                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>DIY Privacy Removal Guide</span>
                    <span className="text-white">$75</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>Exposure Audit (up to 5 people)</span>
                    <span className="text-white">$200</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>Full Removal</span>
                    <span className="text-white">$999</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-1">
                    <span>Personal Guardian</span>
                    <span className="text-white">From $1,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Advanced Investigation</span>
                    <span className="text-white">$3,000+</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">6. Australian Consumer Law Guarantees</h2>
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 text-xs">
                <p className="text-zinc-300 mb-4">
                  Our services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures with the service, you are entitled to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>Cancel your service contract with us</li>
                  <li>A refund for the unused portion, or compensation for its reduced value</li>
                </ul>
                <p className="text-zinc-300 mt-4 mb-2">
                  You are also entitled to be compensated for any other reasonably foreseeable loss or damage.
                </p>
                <p className="text-zinc-300">
                  If the failure does not amount to a major failure, you are entitled to have problems with the service rectified in a reasonable time.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">7. Verification Receipts</h2>
              <p className="mb-4">
                Upon completion of removal actions, we issue Verification Receipts. These receipts:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Constitute proof of work performed, NOT a certificate of deletion</li>
                <li>Do NOT guarantee permanent removal from all sources</li>
                <li>Are accessible via unique URLs for verification purposes</li>
                <li>Are retained for 7 years from date of issue</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">8. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law and except where the Australian Consumer Law provides otherwise:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Our liability is limited to the amount paid by you for the services</li>
                <li>We are not liable for indirect, consequential, special, or incidental damages</li>
                <li>We are not liable for the actions or inactions of third-party data sources</li>
                <li>We do not warrant that removal requests will be honoured by all sources</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">9. Referrals</h2>
              <p className="mb-4">
                We maintain standing referral relationships with specialist organisations for matters outside our scope:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-xs">
                <li><strong className="text-white">IDCARE</strong> - Identity and cyber support (1800 595 160)</li>
                <li><strong className="text-white">eSafety Commissioner</strong> - Image-based abuse and online safety</li>
                <li><strong className="text-white">Lifeline / Beyond Blue</strong> - Mental health support</li>
                <li><strong className="text-white">National Debt Helpline</strong> - Financial counselling</li>
                <li><strong className="text-white">Qualified legal counsel</strong> - Legal advice matters</li>
              </ul>
              <p className="text-zinc-400 text-xs mt-4">
                No referral carries commission, rebate, referral fee, or commercial incentive. Collaboration is not endorsement.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">10. Termination</h2>
              <p className="text-zinc-400">
                We reserve the right to terminate or suspend your access to our services at our discretion, without notice, for conduct that we believe violates these Terms, is harmful to other users, us, or third parties, or involves fraudulent or unlawful activity. Upon termination, your right to use the service ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">11. Governing Law &amp; Jurisdiction</h2>
              <p className="text-zinc-400">
                These Terms are governed by the laws of Western Australia and the Commonwealth of Australia. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Western Australia.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 border-b border-zinc-800 pb-2">12. Contact Information</h2>
              <div className="bg-zinc-900 border border-zinc-800 p-4">
                <p className="text-white font-bold mb-2">Australian Data Removal</p>
                <p className="text-zinc-400 text-xs mb-1">Christopher Robinson, Sole Trader</p>
                <p className="text-zinc-400 text-xs mb-1">ABN: 86 921 751 764</p>
                <p className="text-zinc-400 text-xs mb-1">Email: <a href="mailto:hello@ausdataremoval.com.au" className="text-yellow-500 hover:underline">hello@ausdataremoval.com.au</a></p>
                <p className="text-zinc-400 text-xs mb-1">Phone: <a href="tel:1300504079" className="text-yellow-500 hover:underline">1300 504 079</a></p>
                <p className="text-zinc-400 text-xs">Location: Perth, Western Australia</p>
              </div>
            </section>

            <div className="border-t border-zinc-800 pt-6 mt-8">
              <p className="text-[10px] text-zinc-600 font-mono">
                ADR-TOS-v2.6 | Jurisdiction: Western Australia, Commonwealth of Australia | EST. 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
