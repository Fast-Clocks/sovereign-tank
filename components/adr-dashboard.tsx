'use client'

import { AlertTriangle, CheckCircle, ExternalLink, Shield, Sparkles } from 'lucide-react'
import { LegalFooter } from '@/components/legal-footer'

const demoChecks = [
  {
    label: 'Public exposure review',
    state: 'Demonstration',
    detail: 'Shows how a future governed workflow could organise public-source findings without claiming a live scan occurred.',
  },
  {
    label: 'Removal pathway planning',
    state: 'Demonstration',
    detail: 'Illustrates possible next-step categories. It does not submit removal requests or contact providers.',
  },
  {
    label: 'Evidence and verification',
    state: 'Demonstration',
    detail: 'Illustrates the intended evidence model. No customer data is written to a ledger or irreversible system from this demo.',
  },
]

export function ADRDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 bg-black/95">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-yellow-500">Sovereign Tank</p>
              <h1 className="text-lg font-black tracking-tight">Privacy workflow showcase</h1>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" /> Demonstration only
          </span>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="border border-zinc-800 bg-zinc-950 p-7 md:p-9">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">Safe public showcase</p>
            </div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight md:text-5xl">
              See the workflow concept without pretending a live service has run.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-300">
              This page demonstrates interface and workflow ideas only. It does not scan a person, submit a statutory demand,
              contact a data broker, solve a CAPTCHA, remove information, create a customer case, or perform an automated purge.
            </p>
            <div className="mt-6 border border-emerald-500/25 bg-emerald-500/10 p-4">
              <p className="font-semibold text-emerald-200">No payment is taken on this demonstration.</p>
              <p className="mt-1 text-sm leading-6 text-emerald-100/75">
                There is no Stripe checkout, test checkout, subscription, or entitlement attached to this page. Commercial
                Sovereign Tank work must use a separately approved offer with a real scope, fulfilment path and current payment record.
              </p>
            </div>
          </div>

          <aside className="border border-zinc-800 bg-zinc-950 p-7">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Public state</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="border-b border-zinc-900 pb-4">
                <dt className="text-zinc-500">Mode</dt>
                <dd className="mt-1 font-semibold text-white">Simulation / showcase</dd>
              </div>
              <div className="border-b border-zinc-900 pb-4">
                <dt className="text-zinc-500">Customer data</dt>
                <dd className="mt-1 font-semibold text-white">Not requested by this demo</dd>
              </div>
              <div className="border-b border-zinc-900 pb-4">
                <dt className="text-zinc-500">Payment</dt>
                <dd className="mt-1 font-semibold text-white">Disabled on this demo</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Operational claims</dt>
                <dd className="mt-1 font-semibold text-white">None</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-yellow-500">What the concept demonstrates</p>
            <h2 className="mt-2 text-2xl font-black">A bounded workflow, not a pretend result.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {demoChecks.map((item) => (
              <article key={item.label} className="border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-mono uppercase tracking-wider">{item.state}</span>
                </div>
                <h3 className="mt-4 text-lg font-bold">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-950 p-6 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="font-semibold">Need a real commercial engagement?</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              Use the current Australian Privacy Network or Australian Data Removal commercial surfaces for offers whose price,
              scope and fulfilment path have been independently verified. This demo does not substitute for those contracts.
            </p>
          </div>
          <a
            href="https://australianprivacynetwork.com"
            className="mt-5 inline-flex items-center gap-2 border border-yellow-500 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500 hover:text-black md:mt-0"
          >
            Australian Privacy Network <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        <LegalFooter />
      </main>
    </div>
  )
}
