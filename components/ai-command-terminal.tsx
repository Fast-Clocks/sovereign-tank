'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import {
  Terminal,
  Send,
  Brain,
  Shield,
  FileText,
  Search,
  AlertTriangle,
  Loader2,
  ChevronDown,
  Sparkles,
  Command,
} from 'lucide-react'

type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq'

interface CommandHistoryItem {
  command: string
  timestamp: Date
  type: 'user' | 'system' | 'ai'
}

const QUICK_COMMANDS = [
  { cmd: '/scan', label: 'Scan Exposure', icon: Search, description: 'Scan for data exposure' },
  { cmd: '/analyze', label: 'Threat Analysis', icon: AlertTriangle, description: 'Analyze current threats' },
  { cmd: '/draft', label: 'Draft Document', icon: FileText, description: 'Generate legal document' },
  { cmd: '/predict', label: 'Predict Threats', icon: Brain, description: 'AI threat prediction' },
  { cmd: '/status', label: 'System Status', icon: Shield, description: 'Check system health' },
  { cmd: '/help', label: 'Help', icon: Command, description: 'Show all commands' },
]

const PROVIDER_INFO: Record<AIProvider, { name: string; model: string; color: string }> = {
  openai: { name: 'OpenAI', model: 'GPT-4o', color: 'text-emerald-400' },
  anthropic: { name: 'Anthropic', model: 'Claude Sonnet', color: 'text-amber-400' },
  google: { name: 'Google', model: 'Gemini 2.0', color: 'text-blue-400' },
  groq: { name: 'Groq', model: 'Llama 3.3', color: 'text-purple-400' },
}

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

export function AICommandTerminal({ className = '' }: { className?: string }) {
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [showProviderSelect, setShowProviderSelect] = useState(false)
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    { command: 'ADR COMMAND AI v2.0.0 initialized', timestamp: new Date(), type: 'system' },
    {
      command: `Provider: ${PROVIDER_INFO.openai.name} (${PROVIDER_INFO.openai.model})`,
      timestamp: new Date(),
      type: 'system',
    },
    {
      command: 'Type /help for available commands or ask any question',
      timestamp: new Date(),
      type: 'system',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const providerRef = useRef<AIProvider>(provider)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    providerRef.current = provider
  }, [provider])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ai/chat',
        body: () => ({ provider: providerRef.current }),
      }),
    [],
  )

  const { messages, sendMessage, status } = useChat({
    transport,
    onFinish: ({ message }) => {
      const response = messageText(message)
      if (response) {
        setCommandHistory((previous) => [
          ...previous,
          { command: response, timestamp: new Date(), type: 'ai' },
        ])
      }
      setIsProcessing(false)
    },
    onError: (error) => {
      setCommandHistory((previous) => [
        ...previous,
        { command: `ERROR: ${error.message}`, timestamp: new Date(), type: 'system' },
      ])
      setIsProcessing(false)
    },
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory, messages])

  const sendPrompt = useCallback(
    async (text: string) => {
      setIsProcessing(true)
      await sendMessage({ text })
    },
    [sendMessage],
  )

  const handleCommand = useCallback(
    async (input: string) => {
      const trimmed = input.trim()
      if (!trimmed || isLoading) return

      setCommandHistory((previous) => [
        ...previous,
        { command: `> ${trimmed}`, timestamp: new Date(), type: 'user' },
      ])

      if (trimmed.startsWith('/')) {
        const [rawCommand, ...args] = trimmed.split(' ')
        const command = rawCommand.toLowerCase()

        switch (command) {
          case '/help':
            setCommandHistory((previous) => [
              ...previous,
              {
                command: `
AVAILABLE COMMANDS:
------------------
/scan [email]     - Scan for data exposure
/analyze          - Run threat analysis on current data
/draft [type]     - Generate legal document (statutory-demand, oaic-complaint, access-request)
/predict          - AI-powered threat prediction
/status           - System health check
/provider [name]  - Switch AI provider (openai, anthropic, google, groq)
/clear            - Clear terminal history
/help             - Show this help message

Or just type any question to chat with the AI assistant.`,
                timestamp: new Date(),
                type: 'system',
              },
            ])
            return

          case '/clear':
            setCommandHistory([
              { command: 'Terminal cleared', timestamp: new Date(), type: 'system' },
            ])
            return

          case '/provider': {
            const nextProvider = args[0]?.toLowerCase() as AIProvider
            if (nextProvider && PROVIDER_INFO[nextProvider]) {
              setProvider(nextProvider)
              setCommandHistory((previous) => [
                ...previous,
                {
                  command: `Switched to ${PROVIDER_INFO[nextProvider].name} (${PROVIDER_INFO[nextProvider].model})`,
                  timestamp: new Date(),
                  type: 'system',
                },
              ])
            } else {
              setCommandHistory((previous) => [
                ...previous,
                {
                  command: 'Available providers: openai, anthropic, google, groq',
                  timestamp: new Date(),
                  type: 'system',
                },
              ])
            }
            return
          }

          case '/status':
            setIsProcessing(true)
            try {
              const response = await fetch('/api/health')
              if (!response.ok) throw new Error(`Health endpoint returned ${response.status}`)
              const data = await response.json()
              const services = Object.values(data.services ?? {}) as Array<{ status?: string }>
              setCommandHistory((previous) => [
                ...previous,
                {
                  command: `
SYSTEM STATUS
-------------
Overall: ${data.status?.toUpperCase() || 'OPERATIONAL'}
API Latency: ${data.services?.api?.latency || 'N/A'}ms
Services Online: ${services.filter((service) => service.status === 'healthy').length}/${services.length}
Node: AU-WEST-1
Protocol: v2.6.01`,
                  timestamp: new Date(),
                  type: 'system',
                },
              ])
            } catch {
              setCommandHistory((previous) => [
                ...previous,
                {
                  command: 'ERROR: Could not fetch system status',
                  timestamp: new Date(),
                  type: 'system',
                },
              ])
            } finally {
              setIsProcessing(false)
            }
            return

          case '/scan': {
            const email = args[0] || 'demo@example.com'
            setCommandHistory((previous) => [
              ...previous,
              {
                command: `Initiating OSINT scan for: ${email}...`,
                timestamp: new Date(),
                type: 'system',
              },
            ])
            await sendPrompt(
              `Run a privacy exposure scan for the email "${email}". Provide a detailed analysis of potential exposures across data brokers, breach databases, and dark web sources. Format the results clearly.`,
            )
            return
          }

          case '/analyze':
            await sendPrompt(
              'Perform a comprehensive threat analysis on my current privacy exposure. Consider data brokers, recent breaches, and potential attack vectors. Provide actionable recommendations.',
            )
            return

          case '/draft': {
            const documentType = args[0] || 'statutory-demand'
            await sendPrompt(
              `Generate a ${documentType} document template under Australian Privacy law. Include all required legal references and formatting.`,
            )
            return
          }

          case '/predict':
            await sendPrompt(
              'Based on current privacy threat trends, predict potential future exposures and risks. Provide short-term, medium-term, and long-term predictions with probability assessments.',
            )
            return

          default:
            setCommandHistory((previous) => [
              ...previous,
              {
                command: `Unknown command: ${command}. Type /help for available commands.`,
                timestamp: new Date(),
                type: 'system',
              },
            ])
            return
        }
      }

      await sendPrompt(trimmed)
    },
    [isLoading, sendPrompt],
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleCommand(inputValue)
    setInputValue('')
  }

  return (
    <div className={`bg-zinc-950 border border-zinc-800 flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-black/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-yellow-500" />
          <span className="text-xs font-mono font-bold text-white tracking-wider">ADR.COMMAND.AI</span>
          <span className="text-[10px] font-mono text-zinc-600">v2.0.0</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProviderSelect(!showProviderSelect)}
            className="flex items-center gap-2 px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <Sparkles className={`h-3 w-3 ${PROVIDER_INFO[provider].color}`} />
            <span className="text-[10px] font-mono text-zinc-400">{PROVIDER_INFO[provider].name}</span>
            <ChevronDown className="h-3 w-3 text-zinc-500" />
          </button>

          {showProviderSelect && (
            <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-800 z-50 min-w-[160px]">
              {Object.entries(PROVIDER_INFO).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => {
                    setProvider(key as AIProvider)
                    setShowProviderSelect(false)
                    setCommandHistory((previous) => [
                      ...previous,
                      {
                        command: `Switched to ${info.name} (${info.model})`,
                        timestamp: new Date(),
                        type: 'system',
                      },
                    ])
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-zinc-800 flex items-center gap-2 ${
                    provider === key ? 'bg-zinc-800' : ''
                  }`}
                >
                  <Sparkles className={`h-3 w-3 ${info.color}`} />
                  <div>
                    <span className="text-xs font-mono text-white">{info.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500 ml-2">{info.model}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-800/50 overflow-x-auto scrollbar-hide">
        {QUICK_COMMANDS.map((quickCommand) => (
          <button
            key={quickCommand.cmd}
            onClick={() => void handleCommand(quickCommand.cmd)}
            className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/30 hover:bg-zinc-900 transition-colors shrink-0"
            title={quickCommand.description}
          >
            <quickCommand.icon className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] font-mono text-zinc-400">{quickCommand.label}</span>
          </button>
        ))}
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 min-h-[200px] max-h-[400px]"
      >
        {commandHistory.map((item, index) => (
          <div
            key={`${item.timestamp.getTime()}-${index}`}
            className={`whitespace-pre-wrap ${
              item.type === 'user'
                ? 'text-yellow-400'
                : item.type === 'ai'
                  ? 'text-emerald-400'
                  : 'text-zinc-500'
            }`}
          >
            {item.command}
          </div>
        ))}

        {isLoading && messages.length > 0 && (
          <div className="text-emerald-400 whitespace-pre-wrap">
            {messages.at(-1)?.role === 'assistant' ? messageText(messages.at(-1) as UIMessage) : ''}
          </div>
        )}

        {(isProcessing || isLoading) && (
          <div className="flex items-center gap-2 text-zinc-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-2">
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2">
          <span className="text-yellow-500 font-mono text-sm">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type a command or ask a question..."
            className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder:text-zinc-600"
            disabled={isProcessing || isLoading}
          />
          <button
            type="submit"
            disabled={isProcessing || isLoading || !inputValue.trim()}
            className="p-1 text-yellow-500 hover:text-yellow-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
