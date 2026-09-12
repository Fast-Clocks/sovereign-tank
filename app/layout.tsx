import type { Metadata, Viewport } from 'next'
import { DataCollectionNotice } from '@/components/data-collection-notice'
import { AIAssistantChat } from '@/components/ai-assistant-chat'

import './globals.css'

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
    <html lang="en">
      <body className="font-sans antialiased min-h-screen">
        {children}
        <DataCollectionNotice />
        <AIAssistantChat />
      </body>
    </html>
  )
}
