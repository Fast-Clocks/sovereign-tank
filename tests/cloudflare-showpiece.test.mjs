import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const html = readFileSync(new URL('../cloudflare-site/site/index.html', import.meta.url), 'utf8')
const js = readFileSync(new URL('../cloudflare-site/site/app.js', import.meta.url), 'utf8')
const worker = readFileSync(new URL('../cloudflare-site/src/index.js', import.meta.url), 'utf8')
const wrangler = readFileSync(new URL('../cloudflare-site/wrangler.jsonc', import.meta.url), 'utf8')

const count = (text, needle) => text.split(needle).length - 1

test('Base verification and bounded checkout are exact', () => {
  assert.equal(count(html, 'name="base:app_id"'), 1)
  assert.match(html, /content="6aa5ac4f934ceaddfd7ac2a6"/)
  assert.equal(count(html, 'https://book.stripe.com/5kQdRa1yh0nvfCj8jvfbq0e'), 1)
  assert.match(html, /human-led service/i)
  assert.match(html, /not automated certification/i)
})

test('public demo stays local and does not pretend to be a live ledger', () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com/)
  assert.doesNotMatch(html, /live ledger/i)
  assert.match(html, /local demo ledger/i)
  assert.match(js, /25\*1024\*1024/)
  assert.match(js, /bubble\.textContent=text/)
  assert.doesNotMatch(js, /innerHTML/)
  assert.doesNotMatch(js, /connects to live AI/i)
})

test('Cloudflare candidate is isolated and bound to canonical A2', () => {
  assert.match(wrangler, /f7c8702f5256dcb45ef114533e872e2e/)
  assert.match(wrangler, /"name": "sovereign-tank"/)
  assert.doesNotMatch(wrangler, /"routes?"\s*:/)
  assert.match(worker, /script-src 'self'/)
  assert.match(worker, /connect-src 'none'/)
  assert.match(worker, /frame-ancestors 'none'/)
})
