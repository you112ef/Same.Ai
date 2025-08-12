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
        content: `I'll help you build that! Here's a comprehensive approach to creating ${prompt}:

## Project Structure
\`\`\`
project/
├── frontend/
│   ├── components/
│   │   ├── TicketForm.jsx
│   │   ├── LiveChat.jsx
│   │   └── Dashboard.jsx
│   └── pages/
├── backend/
│   ├── models/
│   ├── routes/
│   └── socket/
└── database/
\`\`\`

## Implementation Plan

### 1. Frontend Components
- **Ticket Creation Form**: User-friendly interface for submitting support tickets
- **Live Chat Widget**: Real-time messaging component with typing indicators
- **Admin Dashboard**: Comprehensive view for managing tickets and chat sessions

### 2. Backend Architecture
- **Express.js API**: RESTful endpoints for ticket CRUD operations
- **Socket.io Integration**: Real-time bidirectional communication
- **Database Models**: User, Ticket, Message, and ChatSession schemas

### 3. Key Features
- Real-time notifications
- File attachment support
- Ticket prioritization system
- Chat history persistence
- Mobile-responsive design

Would you like me to start implementing any specific component or feature?`,
        role: 'assistant',
        model: selectedModel,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200">
        <div className="max-w-none px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 text-black">
                  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
                    <rect x="2" y="2" width="6" height="6" rx="1"/>
                    <rect x="10" y="2" width="6" height="6" rx="1"/>
                    <rect x="18" y="2" width="4" height="6" rx="1"/>
                    <rect x="2" y="10" width="6" height="6" rx="1"/>
                    <rect x="10" y="10" width="6" height="6" rx="1"/>
                    <rect x="18" y="10" width="4" height="6" rx="1"/>
                    <rect x="2" y="18" width="6" height="4" rx="1"/>
                    <rect x="10" y="18" width="6" height="4" rx="1"/>
                    <rect x="18" y="18" width="4" height="4" rx="1"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-black">same</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <Copy className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                <Share className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-black mb-2">
                What would you like to build?
              </h2>
              <p className="text-gray-600">
                Describe the app you want to create and I'll help you build it.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {message.role === 'user' ? (
                      <span className="text-sm font-medium text-gray-700">U</span>
                    ) : (
                      <span className="text-sm font-medium text-gray-700">AI</span>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    {message.role === 'assistant' && message.model && (
                      <div className="text-xs text-gray-500 mb-2">
                        {message.model}
                      </div>
                    )}
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-black text-base leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                    
                    {/* Message Actions */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-gray-700">
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
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">AI</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-2">{selectedModel}</div>
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
      <div className="border-t border-gray-200 bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-gray-100 rounded-2xl border-0 shadow-sm overflow-hidden">
              {/* Input Field */}
              <div className="flex items-start p-6 pb-20">
                <Button variant="ghost" size="sm" className="p-2 mr-3 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Ask me to build something or modify the current app..."
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  style={{ 
                    fontSize: '18px',
                    background: 'transparent',
                    boxShadow: 'none',
                    outline: 'none'
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6 bg-gray-100">
                {/* Model Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedModel}
                  </span>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-200">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-black text-white hover:bg-gray-900 rounded-full p-3"
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
