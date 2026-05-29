import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { DataCollectionNotice } from '@/components/data-collection-notice'
import { AIAssistantChat } from '@/components/ai-assistant-chat'

import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'Australian Data Removal | Privacy Protection Services',
  description: 'Programmatic enforcement of your digital privacy rights across Australian and global data brokers in compliance with the Privacy Act 1988 (Cth).',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_jetbrainsMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <DataCollectionNotice />
        <AIAssistantChat />
      </body>
    </html>
  )
}
