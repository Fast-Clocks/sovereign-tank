import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const dashboard = readFileSync(new URL('../components/adr-dashboard.tsx', import.meta.url), 'utf8')
const businessInfo = readFileSync(new URL('../lib/business-info.ts', import.meta.url), 'utf8')

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
