import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const dashboard = readFileSync(new URL('../components/adr-dashboard.tsx', import.meta.url), 'utf8')
const businessInfo = readFileSync(new URL('../lib/business-info.ts', import.meta.url), 'utf8')
const legalFooter = readFileSync(new URL('../components/legal-footer.tsx', import.meta.url), 'utf8')

test('public demo contains no Stripe test checkout or production-payment placeholder', () => {
  assert.doesNotMatch(dashboard, /buy\.stripe\.com\/test_/)
  assert.doesNotMatch(businessInfo, /buy\.stripe\.com\/test_/)
  assert.doesNotMatch(businessInfo, /update with your production link/i)
})

test('public demo does not claim a live autonomous purge service', () => {
  assert.doesNotMatch(dashboard, /INITIATE\.FULL\.PURGE/)
  assert.doesNotMatch(dashboard, /No Human Intervention Required/i)
  assert.match(dashboard, /Demonstration/i)
  assert.match(dashboard, /No payment/i)
})

test('legacy footer does not make unsupported compliance claims or require removed identity helpers', () => {
  assert.doesNotMatch(legalFooter, /getFormattedABN/)
  assert.doesNotMatch(legalFooter, /Privacy Act 1988 Compliant/i)
  assert.doesNotMatch(legalFooter, /NDB Scheme Active/i)
  assert.match(legalFooter, /not legal advice or a compliance certification/i)
})
