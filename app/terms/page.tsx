export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-zinc-400 mb-6">Last Updated: 16 February 2026</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="text-zinc-300 leading-relaxed">
            By accessing and using the services provided by Australian Data Removal ("ADR," "we," "us," or "our"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
          <p className="text-zinc-300 leading-relaxed">
            ADR provides automated data removal services designed to submit opt-out requests to data brokers on behalf of clients. Our services include monitoring, submission, and verification of data removal requests across multiple platforms and jurisdictions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">You agree to:</p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>Provide accurate and truthful information</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to circumvent or interfere with the service</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">4. Payment Terms</h2>
          <p className="text-zinc-300 leading-relaxed">
            Payment for services is processed through Stripe, our third-party payment processor. All fees are in Australian Dollars (AUD) unless otherwise stated. Payments are non-refundable except as required by Australian Consumer Law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Service Limitations</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            While we make best efforts to remove your data from broker databases:
          </p>
          <ul className="list-disc pl-6 text-zinc-300 space-y-2">
            <li>We cannot guarantee complete removal from all sources</li>
            <li>Some data brokers may not honor opt-out requests</li>
            <li>New data may appear after removal is complete</li>
            <li>Response times vary by data broker (typically 30-90 days)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Australian Consumer Law</h2>
          <p className="text-zinc-300 leading-relaxed">
            Our services come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have the services supplied again if the services fail to be of acceptable quality and the failure does not amount to a major failure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Liability</h2>
          <p className="text-zinc-300 leading-relaxed">
            To the extent permitted by law, ADR's liability is limited to the amount paid by you for the services. We are not liable for indirect, consequential, or incidental damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Privacy and Data Protection</h2>
          <p className="text-zinc-300 leading-relaxed">
            Your use of our services is also governed by our Privacy Policy, which complies with the Privacy Act 1988 (Cth) and Australian Privacy Principles. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
          <p className="text-zinc-300 leading-relaxed">
            We reserve the right to terminate or suspend your access to our services at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
          <p className="text-zinc-300 leading-relaxed">
            These Terms are governed by the laws of Western Australia and the Commonwealth of Australia. Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Western Australia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <p className="text-zinc-300 mb-2"><strong>Australian Data Removal</strong></p>
            <p className="text-zinc-300 mb-2">Email: support@ausdataremoval.com.au</p>
            <p className="text-zinc-300">ABN: [Insert ABN]</p>
          </div>
        </section>
      </div>
    </div>
  )
}
