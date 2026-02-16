'use client'

import { useState } from 'react'
import { ADRDashboard } from '@/components/adr-dashboard'
import { SovereigntyLabView } from '@/components/sovereignty-lab-view'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnifiedApp() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'sovereign'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-lg font-bold text-foreground font-mono">ADR COMMAND CENTER</h1>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('dashboard')}
                  className="font-mono"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'sovereign' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('sovereign')}
                  className="font-mono"
                >
                  Sovereign Lab
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentView('dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className="font-mono w-full justify-start"
                >
                  Dashboard
                </Button>
                <Button
                  variant={currentView === 'sovereign' ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentView('sovereign')
                    setMobileMenuOpen(false)
                  }}
                  className="font-mono w-full justify-start"
                >
                  Sovereign Lab
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pt-16">
        {currentView === 'dashboard' ? (
          <ADRDashboard />
        ) : (
          <SovereigntyLabView />
        )}
      </div>
    </div>
  )
}
