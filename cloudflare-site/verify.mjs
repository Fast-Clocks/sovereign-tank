import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const required = ['site/index.html','site/styles.css','site/app.js','src/index.js','wrangler.jsonc'];
for (const file of required) {
  if (!existsSync(new URL(file, import.meta.url))) throw new Error(`missing ${file}`);
}
const html = readFileSync(new URL('site/index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('site/app.js', import.meta.url), 'utf8');
const worker = readFileSync(new URL('src/index.js', import.meta.url), 'utf8');
const wrangler = readFileSync(new URL('wrangler.jsonc', import.meta.url), 'utf8');

const count = (s, needle) => s.split(needle).length - 1;
const assertions = [
  [count(html, 'name="base:app_id"') === 1, 'exactly one Base verification tag'],
  [html.includes('content="6aa5ac4f934ceaddfd7ac2a6"'), 'Base app ID exact'],
  [count(html, 'https://book.stripe.com/5kQdRa1yh0nvfCj8jvfbq0e') === 1, 'exactly one approved Stripe checkout link'],
  [!html.includes('fonts.googleapis.com'), 'no external Google fonts'],
  [!html.includes('<script>'), 'no inline script block'],
  [!html.includes('style="'), 'no inline style attributes'],
  [!html.toLowerCase().includes('live ledger'), 'no live-ledger claim'],
  [html.includes('local demo ledger'), 'demo ledger is explicit'],
  [html.includes('not automated certification'), 'commercial scope is bounded'],
  [js.includes('25*1024*1024'), 'browser demo file cap is 25 MB'],
  [js.includes('bubble.textContent = html'), 'user assistant input is rendered as text'],
  [worker.includes("script-src 'self'"), 'CSP blocks inline/external scripts'],
  [worker.includes("connect-src 'none'"), 'demo makes no runtime network connections'],
  [worker.includes("frame-ancestors 'none'"), 'clickjacking protection'],
  [wrangler.includes('f7c8702f5256dcb45ef114533e872e2e'), 'exact A2 account bound'],
  [wrangler.includes('"name": "sovereign-tank"'), 'exact Worker name bound'],
  [!wrangler.includes('routes'), 'no custom-domain route in isolated candidate'],
];
for (const [ok, label] of assertions) {
  if (!ok) throw new Error(`FAIL: ${label}`);
  console.log(`PASS: ${label}`);
}
for (const file of required) {
  const bytes = readFileSync(new URL(file, import.meta.url));
  console.log(`SHA256 ${file} ${createHash('sha256').update(bytes).digest('hex')}`);
}
