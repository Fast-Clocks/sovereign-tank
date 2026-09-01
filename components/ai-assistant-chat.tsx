'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { Bot, User, Send, Loader2, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react'

type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq'

const INITIAL_MESSAGE = `Hello! I'm the ADR Privacy Assistant powered by AI. I can help you with:

- Scanning for data exposures
- Understanding your privacy risks
- Generating legal documents
- Answering questions about Australian privacy law
- Creating removal strategies

How can I assist you today?`

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: 'initial',
    role: 'assistant',
    parts: [{ type: 'text', text: INITIAL_MESSAGE }],
  },
]

function messageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}

export function AIAssistantChat({ className = '' }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [provider, setProvider] = useState<AIProvider>('openai')
  const [input, setInput] = useState('')
  const providerRef = useRef<AIProvider>(provider)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    messages: INITIAL_MESSAGES,
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    await sendMessage({ text })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 ${className}`}
      >
        <Bot className="h-5 w-5" />
        <span className="text-sm font-mono">AI ASSISTANT</span>
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-zinc-950 border border-zinc-800 shadow-2xl shadow-black/50 transition-all ${
        isMinimized ? 'w-72 h-12' : 'w-96 h-[500px]'
      } flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-mono font-bold text-white">ADR.AI</span>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5">ONLINE</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-800 transition-colors"
            aria-label={isMinimized ? 'Expand AI assistant' : 'Minimize AI assistant'}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5 text-zinc-400" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-zinc-800 transition-colors"
            aria-label="Close AI assistant"
          >
            <X className="h-3.5 w-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex items-center gap-1 px-2 py-1.5 border-b border-zinc-800/50 overflow-x-auto">
            {(['openai', 'anthropic', 'google', 'groq'] as AIProvider[]).map((candidate) => (
              <button
                key={candidate}
                onClick={() => setProvider(candidate)}
                className={`px-2 py-1 text-[10px] font-mono transition-colors ${
                  provider === candidate
                    ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                {candidate.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`shrink-0 h-8 w-8 flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <p
                    className={`text-xs leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'text-zinc-300 bg-zinc-900 p-3 inline-block'
                        : 'text-zinc-400'
                    }`}
                  >
                    {messageText(message)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 h-8 w-8 flex items-center justify-center bg-zinc-800 text-zinc-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-3">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything about privacy..."
                className="flex-1 bg-transparent text-white text-xs font-mono outline-none placeholder:text-zinc-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-1 text-yellow-500 hover:text-yellow-400 disabled:text-zinc-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
