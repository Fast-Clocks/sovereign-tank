export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-zinc-400 mb-6">Last Updated: 16 February 2026</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-zinc-300 leading-relaxed">
            This Privacy Policy explains how Australian Data Removal ("we," "us," or "our") collects, uses, and protects your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            We collect the following types of personal information:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Contact details (name, email address, phone number)</li>
            <li>Identity information required for data removal requests</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Technical data (IP address, browser type, device information)</li>
            <li>Service usage data and interaction logs</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            We use your personal information to:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Provide data removal services on your behalf</li>
            <li>Process payments and maintain account records</li>
            <li>Communicate with you about our services</li>
            <li>Comply with legal obligations and requests</li>
            <li>Improve and develop our services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Disclosure of Personal Information</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            We may disclose your personal information to:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Data brokers for the purpose of removal requests</li>
            <li>Payment processors (Stripe) for transaction processing</li>
            <li>Legal and regulatory authorities when required by law</li>
            <li>Service providers who assist in our operations (under strict confidentiality agreements)</li>
          </ul>
          <p className="text-zinc-300 leading-relaxed mt-4">
            We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
          <p className="text-zinc-300 leading-relaxed">
            We implement industry-standard security measures including AES-256 encryption, hardware-bound attestation, and secure data transmission protocols. Despite our efforts, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Your Rights Under Australian Privacy Law</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Under the Privacy Act 1988 and APPs, you have the right to:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Access your personal information (APP 12)</li>
            <li>Request correction of inaccurate information (APP 13)</li>
            <li>Request deletion of your information in certain circumstances</li>
            <li>Opt-out of direct marketing communications</li>
            <li>Make a complaint about privacy concerns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
          <p className="text-zinc-300 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Data removal request records are maintained for compliance and verification purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Notifiable Data Breaches</h2>
          <p className="text-zinc-300 leading-relaxed">
            In accordance with the Notifiable Data Breaches (NDB) scheme under the Privacy Act, we will notify you and the Office of the Australian Information Commissioner (OAIC) if we suspect a data breach that is likely to result in serious harm.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
          <p className="text-zinc-300 leading-relaxed">
            Some of our service providers may be located overseas. When we transfer your data internationally, we ensure appropriate safeguards are in place in accordance with APP 8.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            For privacy-related inquiries, access requests, or complaints:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-300 mb-2"><strong>Privacy Officer</strong></p>
            <p className="text-zinc-300 mb-2">Australian Data Removal</p>
            <p className="text-zinc-300 mb-2">Email: privacy@ausdataremoval.com.au</p>
            <p className="text-zinc-300">ABN: [Insert ABN]</p>
          </div>
          <p className="text-zinc-300 leading-relaxed mt-4">
            If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" className="text-yellow-500 hover:underline" target="_blank" rel="noopener noreferrer">www.oaic.gov.au</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
          <p className="text-zinc-300 leading-relaxed">
            We may update this Privacy Policy from time to time. Material changes will be notified through our website or via email. Continued use of our services after changes constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  )
}
