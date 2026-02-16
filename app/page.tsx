'use client'

import { ShieldCheck, Cpu, Lock, Globe, Zap, CheckCircle2, AlertTriangle, FileText } from "lucide-react"

export default function SovereigntyLab() {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-tight">
            Sovereignty Lab
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-zinc-500 tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs font-bold">
            <span>INNOVATOR</span>
            <span className="h-1 w-1 bg-zinc-700 rounded-full" />
            <span>TRUSTED PARTNER</span>
            <span className="h-1 w-1 bg-zinc-700 rounded-full" />
            <span>EST. 2026</span>
          </div>
        </header>

        {/* Main Interface Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Left: The Apex Spec Sheet */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between hover:border-zinc-700 transition-colors">
            <div>
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-red-500 font-mono text-[10px] sm:text-xs font-bold">PREMIUM: SOVEREIGN APEX</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 leading-tight">Hardware-Bound Handshake</h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
                Moving beyond cloud security. This protocol anchors your data session to your <strong>physical hardware</strong> and verifies identity through <strong>Australian Government Portals (ASIC/myGov)</strong>.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Hardware-Bound Attestation" },
                  { icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />, text: "myGov / ASIC Handshake Integration" },
                  { icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Zero-Persistence Ephemeral Memory" },
                  { icon: <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Insured Sovereignty Guarantee" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-2.5 sm:p-3 bg-white/5 rounded-lg sm:rounded-xl border border-white/5">
                    <span className="text-yellow-500 flex-shrink-0">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold leading-tight">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-zinc-800 text-[9px] sm:text-[10px] text-zinc-600 font-mono break-all">
              ATI-SEC PROTOCOL: AES-256 GCM | BILATERAL LOCK v2.6.01
            </div>
          </div>

          {/* Right: The Action Center */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="bg-gradient-to-br from-zinc-800 to-black p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-zinc-700 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 italic leading-tight">Government Briefing</h3>
              <p className="text-zinc-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                Are your systems laggy or unsafe? Submit a Vulnerability Brief. Our fund is ready to point the cannon at your biggest data headaches.
              </p>
              <button className="w-full bg-white text-black font-black py-3 sm:py-4 rounded-lg sm:rounded-xl uppercase text-xs sm:text-sm tracking-wider sm:tracking-widest hover:bg-zinc-200 transition-all active:scale-95">
                Submit Vulnerability Brief
              </button>
            </div>

            {/* Mobile App Teaser */}
            <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] flex-shrink-0" />
                <span className="text-blue-500 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-tighter">App Status: In Production</span>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Finalizing World-First <strong>Hardware-Locked Mobile Handshake</strong>. Deploying advanced encryption layers for Q2 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Australian Legal Compliance Security Check */}
        <div className="mt-8 sm:mt-10 lg:mt-12 bg-zinc-950 border border-yellow-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2 leading-tight">Australian Legal Compliance Security Check</h3>
              <p className="text-zinc-500 text-xs sm:text-sm font-mono">Last Audit: 16 Feb 2026 14:32 AEDT</p>
            </div>
            <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-500" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            {/* Privacy Act Compliance */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-[9px] sm:text-[10px] font-mono text-green-500 font-bold">COMPLIANT</span>
              </div>
              <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base">Privacy Act 1988</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">All 13 Australian Privacy Principles (APPs) verified and enforced across data collection, storage, and transmission layers.</p>
            </div>

            {/* Security of Critical Infrastructure */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-[9px] sm:text-[10px] font-mono text-green-500 font-bold">CERTIFIED</span>
              </div>
              <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base">SOCI Act 2018</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">Security of Critical Infrastructure Act compliance. Risk management program active with mandatory reporting protocols.</p>
            </div>

            {/* Notifiable Data Breaches */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-yellow-500/30 transition-colors">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-[9px] sm:text-[10px] font-mono text-green-500 font-bold">ACTIVE</span>
              </div>
              <h4 className="font-bold mb-1.5 sm:mb-2 text-sm sm:text-base">NDB Scheme</h4>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">Notifiable Data Breaches scheme monitoring active. Real-time threat detection with automated OAIC notification pathways.</p>
            </div>
          </div>

          {/* Compliance Status Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg sm:rounded-xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] sm:text-xs font-mono text-green-500 font-bold whitespace-nowrap">SYSTEM SECURE</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-xs text-zinc-400">ASD Essential Eight: <strong className="text-white">Maturity Level 3</strong></span>
              <span className="text-zinc-700 hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-xs text-zinc-400">ISO 27001: <strong className="text-white">Certified</strong></span>
            </div>
            <button className="text-[10px] sm:text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wider whitespace-nowrap">
              View Full Report →
            </button>
          </div>
        </div>

        {/* The 5% Fund Ledger - Scrolling Ticker */}
        <div className="mt-8 sm:mt-10 lg:mt-12 bg-zinc-900/80 border border-zinc-800 rounded-full py-3 sm:py-4 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
          <div className="flex items-center animate-scroll">
            <p className="text-xs sm:text-sm whitespace-nowrap flex items-center">
              <span className="text-yellow-500 font-bold mr-2">GLOBAL ADVOCACY FUND:</span>
              <span className="text-zinc-300">5% of revenue automatically diverted to International Data Research.</span>
              <span className="ml-3 sm:ml-4 text-green-500 font-mono font-bold tracking-widest uppercase text-[10px] sm:text-xs">Status: Active</span>
              <span className="mx-6 sm:mx-8 text-zinc-700">•</span>
              <span className="text-yellow-500 font-bold mr-2">GLOBAL ADVOCACY FUND:</span>
              <span className="text-zinc-300">5% of revenue automatically diverted to International Data Research.</span>
              <span className="ml-3 sm:ml-4 text-green-500 font-mono font-bold tracking-widest uppercase text-[10px] sm:text-xs">Status: Active</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
