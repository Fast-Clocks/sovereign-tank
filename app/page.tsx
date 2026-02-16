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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
                <h1 className="text-sm font-black text-white font-mono tracking-wider">ADR.COMMAND</h1>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-1.5 text-xs font-bold font-mono tracking-wider transition-all ${
                    currentView === 'dashboard' 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  [DASHBOARD]
                </button>
                <button
                  onClick={() => setCurrentView('sovereign')}
                  className={`px-4 py-1.5 text-xs font-bold font-mono tracking-wider transition-all ${
                    currentView === 'sovereign' 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  [SOVEREIGN.LAB]
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-zinc-800/50">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    setCurrentView('dashboard')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-4 py-2 text-xs font-bold font-mono tracking-wider text-left transition-all ${
                    currentView === 'dashboard' 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  [DASHBOARD]
                </button>
                <button
                  onClick={() => {
                    setCurrentView('sovereign')
                    setMobileMenuOpen(false)
                  }}
                  className={`px-4 py-2 text-xs font-bold font-mono tracking-wider text-left transition-all ${
                    currentView === 'sovereign' 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  [SOVEREIGN.LAB]
                </button>
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
