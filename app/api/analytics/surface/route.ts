/**
 * Attack Surface Mapper — live DNS reconnaissance
 * Route: app/api/analytics/surface/route.ts (Next.js App Router)
 */

import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Node = { id: string; label: string; type: string; status: string; group: number };
type Link = { source: string; target: string; relation: string };
type Vuln = {
  id: string;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  target: string;
  description: string;
  remediation: string;
};

const HOSTNAME_RE = /^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;

const SEVERITY_WEIGHT: Record<Vuln['severity'], number> = {
  LOW: 5, MEDIUM: 15, HIGH: 25, CRITICAL: 40,
};

const RATE = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now > entry.reset) {
    RATE.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again shortly.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawDomain = typeof body?.domain === 'string' ? body.domain : '';

    if (!rawDomain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = rawDomain
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0]
      .split(':')[0];

    if (!HOSTNAME_RE.test(cleanDomain)) {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    const nodes: Node[] = [
      { id: 'root', label: cleanDomain, type: 'domain', status: 'monitored', group: 1 },
    ];
    const links: Link[] = [];
    const vulnerabilities: Vuln[] = [];

    const settle = <T,>(p: Promise<T>) => p.then((v) => v).catch(() => null);

    const [mx, txt, ns, a, aaaa, cname, dmarcTxt, dkimTxt] = await Promise.all([
      settle(dns.resolveMx(cleanDomain)),
      settle(dns.resolveTxt(cleanDomain)),
      settle(dns.resolveNs(cleanDomain)),
      settle(dns.resolve4(cleanDomain)),
      settle(dns.resolve6(cleanDomain)),
      settle(dns.resolveCname(cleanDomain)),
      settle(dns.resolveTxt(`_dmarc.${cleanDomain}`)),
      settle(dns.resolveTxt(`default._domainkey.${cleanDomain}`)),
    ]);

    (a ?? []).forEach((addr, i) => {
      const id = `a_${i}`;
      nodes.push({ id, label: addr, type: 'host_ipv4', status: 'info', group: 5 });
      links.push({ source: 'root', target: id, relation: 'resolves_to' });
    });
    (aaaa ?? []).forEach((addr, i) => {
      const id = `aaaa_${i}`;
      nodes.push({ id, label: addr, type: 'host_ipv6', status: 'info', group: 5 });
      links.push({ source: 'root', target: id, relation: 'resolves_to' });
    });

    (cname ?? []).forEach((target, i) => {
      const id = `cname_${i}`;
      nodes.push({ id, label: target, type: 'cname', status: 'info', group: 6 });
      links.push({ source: 'root', target: id, relation: 'aliases_to' });
    });

    (ns ?? []).forEach((server, i) => {
      const id = `ns_${i}`;
      nodes.push({ id, label: server, type: 'nameserver', status: 'secure', group: 4 });
      links.push({ source: 'root', target: id, relation: 'delegated_to' });
    });

    const mxList = mx ?? [];
    mxList.forEach((record, i) => {
      const id = `mx_${i}`;
      nodes.push({
        id,
        label: `${record.exchange} (priority ${record.priority})`,
        type: 'mail_server',
        status: 'secure',
        group: 2,
      });
      links.push({ source: 'root', target: id, relation: 'routes_mail_to' });
    });

    const flatTxt = (txt ?? []).map((parts) => parts.join(''));
    let spfRecord: string | null = null;

    // for...of rather than forEach: TypeScript's control-flow analysis cannot
    // track assignments made inside a callback, so `spfRecord` stayed typed as
    // `null` after the loop and narrowed to `never` in the else branch below.
    for (const [i, record] of flatTxt.entries()) {
      if (/^v=spf1/i.test(record)) spfRecord = record;
      const id = `txt_${i}`;
      nodes.push({
        id,
        label: record.length > 40 ? `${record.slice(0, 40)}…` : record,
        type: 'dns_record',
        status: 'info',
        group: 3,
      });
      links.push({ source: 'root', target: id, relation: 'asserts_policy' });
    }

    const dmarcRecord =
      (dmarcTxt ?? [])
        .map((parts) => parts.join(''))
        .find((r) => /^v=DMARC1/i.test(r)) ?? null;

    if (dmarcRecord) {
      nodes.push({ id: 'dmarc', label: 'DMARC policy', type: 'mail_security', status: 'secure', group: 3 });
      links.push({ source: 'root', target: 'dmarc', relation: 'enforces' });
    }

    const hasDkim = (dkimTxt ?? []).some((parts) => /v=DKIM1|p=/i.test(parts.join('')));
    if (hasDkim) {
      nodes.push({ id: 'dkim', label: 'DKIM (default selector)', type: 'mail_security', status: 'secure', group: 3 });
      links.push({ source: 'root', target: 'dkim', relation: 'signs_mail' });
    }

    if (!spfRecord) {
      vulnerabilities.push({
        id: 'VULN-SPF',
        title: 'Missing SPF Record',
        severity: 'HIGH',
        target: cleanDomain,
        description:
          'No Sender Policy Framework (SPF) record detected. Without SPF, third parties can more easily forge email that appears to come from this domain.',
        remediation:
          'Publish a TXT record listing authorised senders, e.g. "v=spf1 include:_spf.google.com -all".',
      });
    } else if (!/[~-]all\s*$/i.test(spfRecord.trim())) {
      vulnerabilities.push({
        id: 'VULN-SPF-SOFT',
        title: 'Weak SPF Enforcement',
        severity: 'MEDIUM',
        target: cleanDomain,
        description:
          'An SPF record exists but does not end in "-all" (hard fail) or "~all" (soft fail), so spoofed mail may still be accepted.',
        remediation: 'End the SPF record with "-all" once you have confirmed all legitimate senders are included.',
      });
    }

    if (!dmarcRecord) {
      vulnerabilities.push({
        id: 'VULN-DMARC',
        title: 'Missing DMARC Policy',
        severity: 'CRITICAL',
        target: cleanDomain,
        description:
          'No DMARC record found at _dmarc.' + cleanDomain + '. DMARC tells receivers how to handle mail that fails SPF/DKIM and provides spoofing reports.',
        remediation:
          'Add a TXT record at _dmarc.' + cleanDomain + ', starting with "v=DMARC1; p=none;" for monitoring, then progress to "p=quarantine"/"p=reject".',
      });
    } else if (/p=none/i.test(dmarcRecord)) {
      vulnerabilities.push({
        id: 'VULN-DMARC-MONITOR',
        title: 'DMARC in Monitor-Only Mode',
        severity: 'MEDIUM',
        target: cleanDomain,
        description:
          'A DMARC record exists but is set to "p=none", which only reports abuse rather than blocking spoofed mail.',
        remediation: 'After reviewing DMARC reports, move the policy to "p=quarantine" and ultimately "p=reject".',
      });
    }

    if (mxList.length > 0 && !hasDkim) {
      vulnerabilities.push({
        id: 'VULN-DKIM',
        title: 'No DKIM at Default Selector',
        severity: 'LOW',
        target: cleanDomain,
        description:
          'No DKIM key was found at the common "default" selector. DKIM signing strengthens email authenticity.',
        remediation: 'Confirm DKIM signing is enabled with your mail provider and that keys are published.',
      });
    }

    const penalty = vulnerabilities.reduce((sum, v) => sum + SEVERITY_WEIGHT[v.severity], 0);
    const overallSurfaceScore = Math.max(5, 100 - penalty);

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      mappedAt: new Date().toISOString(),
      summary: {
        totalNodesMapped: nodes.length,
        vulnerabilitiesFound: vulnerabilities.length,
        overallSurfaceScore,
      },
      graphData: { nodes, links },
      vulnerabilities,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
