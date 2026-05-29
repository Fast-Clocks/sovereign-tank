export type BrokerStatus = 'exposed' | 'purging' | 'clear'

export interface DataBroker {
  id: string
  name: string
  dataExposed: string[]
  status: BrokerStatus
  region: string
  jurisdiction: string
  riskScore: number
  lastSeen: string
}

export interface BrokerPage {
  data: DataBroker[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface SystemStats {
  totalBrokers: number
  exposed: number
  purging: number
  clear: number
  privacyScore: number
  jurisdictions: number
  byRegion: { region: string; exposed: number; purging: number; clear: number }[]
  updatedAt: string
}

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'offline'
  node: string
  uptimeSeconds: number
  latencyMs: number
  version: string
  services: { name: string; status: 'up' | 'down'; latencyMs: number }[]
  timestamp: string
}

export interface FundStatus {
  beneficiary: string
  allocationPercent: number
  totalContributedAud: number
  monthlyRunRateAud: number
  status: 'active' | 'paused'
  lastDisbursement: string
  updatedAt: string
}

export interface ScanResult {
  scanId: string
  region: string | null
  brokersScanned: number
  newExposures: number
  purgesInitiated: number
  durationMs: number
  startedAt: string
  completedAt: string
}
