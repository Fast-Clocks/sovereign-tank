import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const required = [
  'site/index.html',
  'site/styles.css',
  'site/app.js',
  'site/robots.txt',
  'site/sitemap.xml',
  'site/.well-known/security.txt',
  'src/index.js',
  'wrangler.jsonc',
];
for (const file of required) {
  if (!existsSync(new URL(file, import.meta.url))) throw new Error(`missing ${file}`);
}
const html = readFileSync(new URL('site/index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('site/app.js', import.meta.url), 'utf8');
const robots = readFileSync(new URL('site/robots.txt', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('site/sitemap.xml', import.meta.url), 'utf8');
const security = readFileSync(new URL('site/.well-known/security.txt', import.meta.url), 'utf8');
const worker = readFileSync(new URL('src/index.js', import.meta.url), 'utf8');
const wrangler = readFileSync(new URL('wrangler.jsonc', import.meta.url), 'utf8');

const count = (s, needle) => s.split(needle).length - 1;
const domainArtifacts = [html, robots, sitemap, security, worker].join('\n');
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
  [js.includes('bubble.textContent=text') && !js.includes('innerHTML'), 'user assistant input is rendered as text'],
  [worker.includes("script-src 'self'"), 'CSP blocks inline/external scripts'],
  [worker.includes("connect-src 'none'"), 'demo makes no runtime network connections'],
  [worker.includes("frame-ancestors 'none'"), 'clickjacking protection'],
  [!domainArtifacts.includes('sovereigntank.au'), 'no stale .au canonical/domain references'],
  [html.includes('https://sovereigntank.com/'), 'HTML canonical domain is sovereigntank.com'],
  [robots.includes('https://sovereigntank.com/sitemap.xml'), 'robots sitemap uses sovereigntank.com'],
  [sitemap.includes('https://sovereigntank.com/'), 'sitemap uses sovereigntank.com'],
  [security.includes('https://sovereigntank.com/.well-known/security.txt'), 'security.txt canonical uses sovereigntank.com'],
  [worker.includes("host === 'sovereigntank.com'") && worker.includes("host === 'www.sovereigntank.com'"), 'production host allow-list uses .com'],
  [wrangler.includes('ce77d11eb9c9640fe37ed06ecfe260aa'), 'existing Workers Builds account bound'],
  [!wrangler.includes('f7c8702f5256dcb45ef114533e872e2e'), 'stale cross-account binding absent'],
  [wrangler.includes('"name": "sovereign-tank"'), 'exact Worker name bound'],
  [!wrangler.includes('routes'), 'no route mutation in isolated candidate'],
];
for (const [ok, label] of assertions) {
  if (!ok) throw new Error(`FAIL: ${label}`);
  console.log(`PASS: ${label}`);
}
for (const file of required) {
  const bytes = readFileSync(new URL(file, import.meta.url));
  console.log(`SHA256 ${file} ${createHash('sha256').update(bytes).digest('hex')}`);
}
