import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const base = new URL('../cloudflare-site/', import.meta.url)
const html = readFileSync(new URL('site/index.html', base), 'utf8')
const robots = readFileSync(new URL('site/robots.txt', base), 'utf8')
const sitemap = readFileSync(new URL('site/sitemap.xml', base), 'utf8')
const security = readFileSync(new URL('site/.well-known/security.txt', base), 'utf8')
const worker = readFileSync(new URL('src/index.js', base), 'utf8')
const wrangler = readFileSync(new URL('wrangler.jsonc', base), 'utf8')

const allPublic = [html, robots, sitemap, security, worker].join('\n')

test('Sovereign Tank uses the current .au production domain everywhere', () => {
  assert.doesNotMatch(allPublic, /sovereigntank\.com/)
  assert.match(html, /https:\/\/sovereigntank\.au\//)
  assert.match(robots, /https:\/\/sovereigntank\.au\/sitemap\.xml/)
  assert.match(sitemap, /https:\/\/sovereigntank\.au\//)
  assert.match(security, /https:\/\/sovereigntank\.au\/\.well-known\/security\.txt/)
  assert.match(worker, /sovereigntank\.au/)
  assert.match(worker, /www\.sovereigntank\.au/)
})

test('Wrangler targets the existing Cloudflare Workers Builds account', () => {
  assert.match(wrangler, /ce77d11eb9c9640fe37ed06ecfe260aa/)
  assert.doesNotMatch(wrangler, /f7c8702f5256dcb45ef114533e872e2e/)
})
