'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, ArrowUp, ChevronDown, Copy, ExternalLink, MoreHorizontal, Download, Share } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  model?: string
  timestamp: Date
}

export default function NewChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get initial prompt from URL parameters
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt')
    const initialModel = searchParams.get('model')
    
    if (initialModel) {
      setSelectedModel(initialModel)
    }
    
    if (initialPrompt) {
      setCurrentInput(initialPrompt)
      // Auto-submit the initial prompt
      handleSubmit(null, initialPrompt)
    }
  }, [searchParams])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent | null, customPrompt?: string) => {
    if (e) e.preventDefault()
    
    const prompt = customPrompt || currentInput
    if (!prompt.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'll help you build that! Here's a basic structure for ${prompt}...

This is a simulated response. In the actual implementation, this would connect to the AI services to generate the requested application.

The response would include:
1. Project structure
2. Code snippets
3. Implementation guidance
4. Next steps

To make this fully functional, we would need to:
- Set up AI API keys
- Implement streaming responses
- Add code syntax highlighting
- Create project scaffolding features`,
        role: 'assistant',
        model: selectedModel,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6zM3 19h6v6H3v-6zm8 0h6v6h-6v-6zm8 0h6v6h-6v-6z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">same</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                What would you like to build?
              </h2>
              <p className="text-gray-600">
                Describe the app you want to create and I'll help you build it.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {message.role === 'user' ? (
                      <span className="text-sm font-medium text-gray-600">U</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">AI</span>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    {message.role === 'assistant' && message.model && (
                      <div className="text-xs text-gray-500 mb-1">
                        {message.model}
                      </div>
                    )}
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-gray-900">
                        {message.content}
                      </div>
                    </div>
                    
                    {/* Message Actions */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{selectedModel}</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Input Field */}
              <div className="flex items-start p-4 pb-16">
                <Button variant="ghost" size="sm" className="p-2 mr-2 text-gray-400">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Ask me to build something or modify the current app..."
                  className="flex-1 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0"
                  style={{ 
                    fontSize: '18px',
                    background: 'transparent',
                    boxShadow: 'none'
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-white border-t border-gray-100">
                {/* Model Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedModel}
                  </span>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-full p-2"
                  disabled={!currentInput.trim() || isLoading}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
