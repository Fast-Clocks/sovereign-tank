/**
 * IMPORTANT: Business Information Configuration
 * 
 * This file contains critical business information required for Australian legal compliance.
 * You MUST update these values before launching your service.
 */

export const BUSINESS_INFO = {
  // Australian Business Number - REQUIRED by law for business operations
  // Apply at: https://www.abr.gov.au
  abn: '[INSERT YOUR ABN HERE]', // e.g., '12 345 678 901'
  
  // Registered business name
  businessName: 'Australian Data Removal',
  
  // Contact emails
  privacyEmail: 'privacy@ausdataremoval.com.au',
  supportEmail: 'support@ausdataremoval.com.au',
  
  // Business location
  location: 'Western Australia, Australia',
  
  // Stripe payment link (update with your production link)
  stripePaymentLink: 'https://buy.stripe.com/test_28o2bJbGL13a8IU7ss',
} as const

/**
 * Check if ABN has been configured
 */
export function isABNConfigured(): boolean {
  return !BUSINESS_INFO.abn.includes('INSERT')
}

/**
 * Get formatted ABN for display
 */
export function getFormattedABN(): string {
  if (!isABNConfigured()) {
    return 'ABN: [Not Configured - Update in lib/business-info.ts]'
  }
  return `ABN: ${BUSINESS_INFO.abn}`
}
