'use client'

import dynamic from 'next/dynamic'
import { Shield } from 'lucide-react'

const ADRDashboard = dynamic(
  () => import('@/components/adr-dashboard').then(mod => ({ default: mod.ADRDashboard })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-mono">Initializing Global Sovereign Tank...</p>
        </div>
      </div>
    ),
  }
)

export default function Page() {
  return <ADRDashboard />
}
