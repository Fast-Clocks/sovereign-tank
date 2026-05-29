import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    name: 'Australian Data Removal',
    description: 'Sovereign privacy protection and data broker removal service for Australian citizens. Programmatic enforcement of Privacy Act 1988 rights.',
    version: '2.6.0',
    protocol: 'SOVEREIGN-v2',
    contact: {
      email: 'hello@ausdataremoval.com.au',
      phone: '1300 504 079',
      privacy: 'privacy@ausdataremoval.com.au',
    },
    legal: {
      entity: 'Christopher Robinson',
      abn: '86 921 751 764',
      jurisdiction: 'Western Australia, Australia',
    },
    capabilities: [
      {
        name: 'broker-scan',
        description: 'Scan global data broker networks for personal information exposure',
        endpoint: '/api/brokers',
        methods: ['GET'],
      },
      {
        name: 'threat-intelligence',
        description: 'Real-time global threat monitoring and node status',
        endpoint: '/api/threats',
        methods: ['GET'],
      },
      {
        name: 'system-status',
        description: 'Service health and performance metrics',
        endpoint: '/api/status',
        methods: ['GET'],
      },
      {
        name: 'purge-request',
        description: 'Initiate data removal request under Privacy Act 1988',
        endpoint: '/api/purge',
        methods: ['POST'],
        authentication: 'required',
      },
    ],
    compliance: {
      frameworks: [
        'Privacy Act 1988 (Cth)',
        'Australian Privacy Principles (APPs)',
        'Notifiable Data Breaches Scheme',
        'GDPR (for EU data subjects)',
        'CCPA (for California residents)',
      ],
      certifications: ['ISO 27001', 'SOC 2 Type II'],
      lastAudit: '2024-11-15',
    },
    rateLimit: {
      requests: 1000,
      window: '1h',
      burst: 50,
    },
    links: {
      documentation: 'https://ausdataremoval.com.au/docs',
      privacy: 'https://ausdataremoval.com.au/privacy-policy',
      terms: 'https://ausdataremoval.com.au/terms',
      status: 'https://status.ausdataremoval.com.au',
    },
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-ADR-Node': 'AU-WEST-1',
    }
  })
}
