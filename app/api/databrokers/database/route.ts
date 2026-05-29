import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Complete data broker database with detailed opt-out instructions
const DATA_BROKER_DATABASE = {
  // Major People Search Sites (Tier 1)
  peopleSearch: [
    {
      id: 'spokeo',
      name: 'Spokeo',
      url: 'https://spokeo.com',
      category: 'People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Employment', 'Social Media'],
      optOut: {
        url: 'https://spokeo.com/optout',
        method: 'web_form',
        steps: [
          'Go to spokeo.com/optout',
          'Search for your listing using your name and state',
          'Click on your profile',
          'Copy the URL of your profile',
          'Paste the URL in the opt-out form',
          'Enter your email address',
          'Complete CAPTCHA',
          'Click submit and check email for confirmation link'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 7,
        difficulty: 'medium',
        relistProbability: 0.4,
        notes: 'May need to repeat every 6-12 months as data reappears'
      },
      jurisdiction: ['US', 'AU', 'UK'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'whitepages',
      name: 'Whitepages',
      url: 'https://whitepages.com',
      category: 'People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Property Records'],
      optOut: {
        url: 'https://whitepages.com/suppression-requests',
        method: 'web_form',
        steps: [
          'Go to whitepages.com/suppression-requests',
          'Search for your listing',
          'Click on your name to view profile',
          'Note: You must create an account to remove',
          'Or email privacy@whitepages.com with profile URL',
          'Include: Full name, addresses to remove, statement requesting removal'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.5,
        notes: 'Email method more reliable. Premium listings require phone call.'
      },
      jurisdiction: ['US', 'AU'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'beenverified',
      name: 'BeenVerified',
      url: 'https://beenverified.com',
      category: 'Background Check',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Criminal Records', 'Property', 'Assets', 'Relatives'],
      optOut: {
        url: 'https://beenverified.com/app/optout/search',
        method: 'web_form',
        steps: [
          'Go to beenverified.com/app/optout/search',
          'Enter your first name, last name, and state',
          'Find and select your listing',
          'Enter your email address',
          'Complete verification',
          'Submit request'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 7,
        difficulty: 'medium',
        relistProbability: 0.35,
        notes: 'Also removes from PeopleSmart (same company)'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'truepeoplesearch',
      name: 'TruePeopleSearch',
      url: 'https://truepeoplesearch.com',
      category: 'People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives'],
      optOut: {
        url: 'https://truepeoplesearch.com/removal',
        method: 'web_form',
        steps: [
          'Go to truepeoplesearch.com/removal',
          'Search for your record',
          'Click "Remove This Record"',
          'Complete CAPTCHA',
          'Removal is immediate'
        ],
        requiresEmail: false,
        requiresID: false,
        estimatedDays: 1,
        difficulty: 'easy',
        relistProbability: 0.6,
        notes: 'One of the easiest to remove. Data often reappears from public records.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'fastpeoplesearch',
      name: 'FastPeopleSearch',
      url: 'https://fastpeoplesearch.com',
      category: 'People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Social Media'],
      optOut: {
        url: 'mailto:privacy@fastpeoplesearch.com',
        method: 'email',
        steps: [
          'Find your listing on fastpeoplesearch.com',
          'Copy the exact URL of your profile',
          'Email privacy@fastpeoplesearch.com',
          'Subject: Opt-Out Request - [Your Name]',
          'Include: Full name, profile URL, statement requesting removal under CCPA/Privacy Act',
          'Wait for confirmation (may take 2-3 weeks)'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.45,
        notes: 'No web form. Must use email. Response times vary.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'radaris',
      name: 'Radaris',
      url: 'https://radaris.com',
      category: 'People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Age', 'Relatives', 'Court Records', 'Property'],
      optOut: {
        url: 'https://radaris.com/control/privacy',
        method: 'web_form',
        steps: [
          'Search for your profile on radaris.com',
          'Click on your name',
          'Scroll to bottom and click "Control Profile"',
          'Create account or log in',
          'Navigate to Privacy Settings',
          'Click "Make Profile Private" or "Remove"',
          'Verify via email'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.5,
        notes: 'Requires account creation. May need to remove multiple profiles.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'intelius',
      name: 'Intelius',
      url: 'https://intelius.com',
      category: 'Background Check',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Criminal', 'Property', 'Relatives', 'Employment'],
      optOut: {
        url: 'https://intelius.com/opt-out',
        method: 'web_form',
        steps: [
          'Go to intelius.com/opt-out',
          'Search for your listing',
          'Select your profile',
          'Enter email for verification',
          'Submit opt-out request',
          'Click confirmation link in email'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 10,
        difficulty: 'medium',
        relistProbability: 0.4,
        notes: 'Part of same network as Spokeo. Remove from both.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'truthfinder',
      name: 'TruthFinder',
      url: 'https://truthfinder.com',
      category: 'Background Check',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Criminal', 'Social Media', 'Assets'],
      optOut: {
        url: 'https://truthfinder.com/opt-out',
        method: 'web_form',
        steps: [
          'Visit truthfinder.com/opt-out',
          'Enter first name, last name, state',
          'Find your listing',
          'Enter email address',
          'Complete CAPTCHA',
          'Click opt-out button',
          'Confirm via email'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 7,
        difficulty: 'medium',
        relistProbability: 0.35,
        notes: 'Relatively straightforward process'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'instantcheckmate',
      name: 'Instant Checkmate',
      url: 'https://instantcheckmate.com',
      category: 'Background Check',
      dataCollected: ['Name', 'Address', 'Phone', 'Email', 'Criminal', 'Traffic', 'Relatives'],
      optOut: {
        url: 'https://instantcheckmate.com/opt-out',
        method: 'web_form',
        steps: [
          'Go to instantcheckmate.com/opt-out',
          'Search for your record',
          'Select your profile',
          'Enter valid email address',
          'Complete verification',
          'Submit opt-out'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 7,
        difficulty: 'medium',
        relistProbability: 0.4,
        notes: 'Same company as TruthFinder'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'familytreenow',
      name: 'FamilyTreeNow',
      url: 'https://familytreenow.com',
      category: 'Genealogy/People Search',
      dataCollected: ['Name', 'Address', 'Phone', 'DOB', 'Relatives', 'Associates', 'Possible Photos'],
      optOut: {
        url: 'https://familytreenow.com/optout',
        method: 'web_form',
        steps: [
          'Go to familytreenow.com/optout',
          'Search for your record',
          'Click on your name',
          'Scroll down and click "Opt Out"',
          'Confirm removal'
        ],
        requiresEmail: false,
        requiresID: false,
        estimatedDays: 2,
        difficulty: 'easy',
        relistProbability: 0.5,
        notes: 'Very easy. Immediate removal. But data reappears frequently.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
  ],

  // Marketing & Data Aggregators (Tier 2)
  marketingAggregators: [
    {
      id: 'acxiom',
      name: 'Acxiom',
      url: 'https://acxiom.com',
      category: 'Data Aggregator',
      dataCollected: ['Name', 'Address', 'Demographics', 'Purchase History', 'Interests', 'Income'],
      optOut: {
        url: 'https://isapps.acxiom.com/optout/optout.aspx',
        method: 'web_form',
        steps: [
          'Go to isapps.acxiom.com/optout',
          'Fill out the form with your information',
          'Select opt-out preferences',
          'Submit request',
          'May need to follow up via mail for complete removal'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.3,
        notes: 'One of the largest data brokers. May need to opt out of multiple products.'
      },
      jurisdiction: ['US', 'EU', 'AU'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'oracle_data_cloud',
      name: 'Oracle Data Cloud',
      url: 'https://oracle.com/data-cloud',
      category: 'Data Aggregator',
      dataCollected: ['Name', 'Address', 'Email', 'Demographics', 'Online Behavior', 'Purchase Intent'],
      optOut: {
        url: 'https://datacloudoptout.oracle.com',
        method: 'web_form',
        steps: [
          'Visit datacloudoptout.oracle.com',
          'Enter your information',
          'Select categories to opt out of',
          'Submit request',
          'Verification may be required'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.25,
        notes: 'Controls BlueKai and other major ad tech platforms'
      },
      jurisdiction: ['US', 'EU', 'AU'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'epsilon',
      name: 'Epsilon',
      url: 'https://epsilon.com',
      category: 'Marketing Services',
      dataCollected: ['Name', 'Address', 'Email', 'Purchase History', 'Demographics'],
      optOut: {
        url: 'https://epsilon.com/privacy-center',
        method: 'web_form',
        steps: [
          'Go to epsilon.com/privacy-center',
          'Navigate to opt-out section',
          'Fill out consumer choice form',
          'Submit with required information'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 21,
        difficulty: 'hard',
        relistProbability: 0.3,
        notes: 'Major marketing data company. Full removal may require mail request.'
      },
      jurisdiction: ['US', 'EU'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'liveramp',
      name: 'LiveRamp',
      url: 'https://liveramp.com',
      category: 'Data Onboarding',
      dataCollected: ['Name', 'Address', 'Email', 'Device IDs', 'Online Identifiers'],
      optOut: {
        url: 'https://liveramp.com/opt_out',
        method: 'web_form',
        steps: [
          'Visit liveramp.com/opt_out',
          'Enter email address',
          'Submit opt-out request',
          'Confirmation email will be sent'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 10,
        difficulty: 'medium',
        relistProbability: 0.35,
        notes: 'Key player in identity resolution. Important to opt out.'
      },
      jurisdiction: ['US', 'EU', 'AU'],
      lastVerified: '2026-05-01'
    },
  ],

  // Credit Bureaus (Tier 3)
  creditBureaus: [
    {
      id: 'experian',
      name: 'Experian',
      url: 'https://experian.com',
      category: 'Credit Bureau',
      dataCollected: ['Credit History', 'Loans', 'Addresses', 'Employment', 'SSN/TFN'],
      optOut: {
        url: 'https://experian.com/privacy/opting-out',
        method: 'web_form',
        steps: [
          'Visit experian.com/privacy/opting-out',
          'Select type of opt-out (marketing, pre-screened offers)',
          'Submit request',
          'For credit freeze: create account and request freeze'
        ],
        requiresEmail: true,
        requiresID: true,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.1,
        notes: 'Cannot fully remove credit data. Can freeze and opt out of marketing.'
      },
      jurisdiction: ['US', 'AU', 'UK'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'equifax',
      name: 'Equifax',
      url: 'https://equifax.com',
      category: 'Credit Bureau',
      dataCollected: ['Credit History', 'Loans', 'Addresses', 'Employment', 'SSN/TFN'],
      optOut: {
        url: 'https://equifax.com/personal/credit-report-services/credit-freeze/',
        method: 'web_form',
        steps: [
          'Create Equifax account',
          'Navigate to security freeze section',
          'Request credit freeze',
          'For marketing opt-out: visit preferences center'
        ],
        requiresEmail: true,
        requiresID: true,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.1,
        notes: 'Credit data legally protected. Focus on freeze and marketing opt-out.'
      },
      jurisdiction: ['US', 'AU', 'UK'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'transunion',
      name: 'TransUnion',
      url: 'https://transunion.com',
      category: 'Credit Bureau',
      dataCollected: ['Credit History', 'Loans', 'Addresses', 'Employment', 'SSN/TFN'],
      optOut: {
        url: 'https://transunion.com/credit-freeze',
        method: 'web_form',
        steps: [
          'Visit transunion.com/credit-freeze',
          'Create account',
          'Request security freeze',
          'Opt out of marketing via preferences'
        ],
        requiresEmail: true,
        requiresID: true,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.1,
        notes: 'Similar to other credit bureaus. Freeze is primary protection.'
      },
      jurisdiction: ['US'],
      lastVerified: '2026-05-01'
    },
  ],

  // Australian Specific
  australian: [
    {
      id: 'whitepages_au',
      name: 'White Pages Australia',
      url: 'https://whitepages.com.au',
      category: 'Directory',
      dataCollected: ['Name', 'Address', 'Phone'],
      optOut: {
        url: 'https://whitepages.com.au/privacy',
        method: 'web_form',
        steps: [
          'Visit whitepages.com.au',
          'Search for your listing',
          'Go to privacy page',
          'Submit removal request',
          'Or contact: privacy@whitepages.com.au'
        ],
        requiresEmail: true,
        requiresID: false,
        estimatedDays: 7,
        difficulty: 'medium',
        relistProbability: 0.3,
        notes: 'Australian directory. Can also contact via Privacy Act request.'
      },
      jurisdiction: ['AU'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'illion',
      name: 'illion (formerly Dun & Bradstreet AU)',
      url: 'https://illion.com.au',
      category: 'Credit/Business Data',
      dataCollected: ['Credit History', 'Business Info', 'Address', 'Employment'],
      optOut: {
        url: 'https://illion.com.au/privacy-policy',
        method: 'email',
        steps: [
          'Email privacy@illion.com.au',
          'Reference Privacy Act 1988 APP 12 and 13',
          'Request access to data held and correction/deletion',
          'Include: Full name, DOB, address, contact details',
          'Follow up within 30 days if no response'
        ],
        requiresEmail: true,
        requiresID: true,
        estimatedDays: 21,
        difficulty: 'hard',
        relistProbability: 0.2,
        notes: 'Major Australian credit bureau. Submit formal Privacy Act request.'
      },
      jurisdiction: ['AU', 'NZ'],
      lastVerified: '2026-05-01'
    },
    {
      id: 'equifax_au',
      name: 'Equifax Australia',
      url: 'https://equifax.com.au',
      category: 'Credit Bureau',
      dataCollected: ['Credit History', 'Loans', 'Address', 'Employment'],
      optOut: {
        url: 'https://equifax.com.au/personal/personal-privacy',
        method: 'web_form',
        steps: [
          'Visit equifax.com.au/personal',
          'Navigate to privacy section',
          'Submit access/correction request',
          'For marketing: opt out via preferences',
          'For credit ban: request ban under Privacy Act'
        ],
        requiresEmail: true,
        requiresID: true,
        estimatedDays: 14,
        difficulty: 'hard',
        relistProbability: 0.1,
        notes: 'Australian Privacy Act requires response within 30 days.'
      },
      jurisdiction: ['AU'],
      lastVerified: '2026-05-01'
    },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const jurisdiction = searchParams.get('jurisdiction')
  const difficulty = searchParams.get('difficulty')

  let brokers = [
    ...DATA_BROKER_DATABASE.peopleSearch,
    ...DATA_BROKER_DATABASE.marketingAggregators,
    ...DATA_BROKER_DATABASE.creditBureaus,
    ...DATA_BROKER_DATABASE.australian,
  ]

  if (category) {
    brokers = brokers.filter(b => b.category.toLowerCase().includes(category.toLowerCase()))
  }

  if (jurisdiction) {
    brokers = brokers.filter(b => b.jurisdiction.includes(jurisdiction.toUpperCase()))
  }

  if (difficulty) {
    brokers = brokers.filter(b => b.optOut.difficulty === difficulty)
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    totalBrokers: brokers.length,
    categories: {
      peopleSearch: DATA_BROKER_DATABASE.peopleSearch.length,
      marketingAggregators: DATA_BROKER_DATABASE.marketingAggregators.length,
      creditBureaus: DATA_BROKER_DATABASE.creditBureaus.length,
      australian: DATA_BROKER_DATABASE.australian.length,
    },
    brokers,
  }, {
    headers: {
      'X-ADR-Node': 'AU-WEST-1',
      'X-ADR-Protocol': 'SOVEREIGN-2.0',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
