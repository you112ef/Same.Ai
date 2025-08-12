'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  model?: string
  timestamp: Date
}

export default function NewChatPage() {
  const searchParams = useSearchParams()
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
│   │   ├── BookingForm.jsx
│   │   ├── Calendar.jsx
│   │   └── AppointmentList.jsx
│   └── pages/
├── backend/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── database/
\`\`\`

## Implementation Plan

### 1. Frontend Components
- **Booking Form**: User-friendly interface for creating appointments
- **Calendar Integration**: Interactive calendar with date/time selection
- **Appointment Management**: View, edit, and cancel appointments

### 2. Backend Architecture
- **Express.js API**: RESTful endpoints for appointment CRUD operations
- **Database Models**: User, Appointment, and Calendar schemas
- **Integration Layer**: Connect with external calendar services (Google Calendar, Outlook)

### 3. Key Features
- Real-time availability checking
- Email notifications and reminders
- Recurring appointment support
- Time zone handling
- Mobile-responsive design
- Admin dashboard for appointment management

### 4. Technology Stack
- **Frontend**: React, Next.js, TypeScript
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Calendar APIs**: Google Calendar API, Microsoft Graph API
- **Styling**: Tailwind CSS

Would you like me to start implementing any specific component or feature?`,
        role: 'assistant',
        model: selectedModel,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        width: '100%', 
        padding: '0 24px', 
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ color: 'black' }}>
              <g>
                <rect x="0.5" y="0.5" width="7" height="7" rx="1.5" />
                <rect x="9.5" y="0.5" width="7" height="7" rx="1.5" />
                <rect x="18.5" y="0.5" width="1" height="7" rx="0.5" />
                <rect x="0.5" y="9.5" width="7" height="7" rx="1.5" />
                <rect x="9.5" y="9.5" width="7" height="7" rx="1.5" />
                <rect x="18.5" y="9.5" width="1" height="7" rx="0.5" />
                <rect x="0.5" y="18.5" width="7" height="1" rx="0.5" />
                <rect x="9.5" y="18.5" width="7" height="1" rx="0.5" />
                <rect x="18.5" y="18.5" width="1" height="1" rx="0.5" />
              </g>
            </svg>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#000000',
              letterSpacing: '-0.025em'
            }}>
              same
            </span>
          </div>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            padding: '4px', 
            cursor: 'pointer',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="m4 16 4-4 4 4"/>
              <path d="m16 4 4 4-4 4"/>
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16,6 12,2 8,6"/>
              <line x1="12" x2="12" y1="2" y2="15"/>
            </svg>
            Share
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" x2="12" y1="15" y2="3"/>
            </svg>
            Download
          </button>
          <button style={{ 
            background: 'none', 
            border: 'none', 
            color: '#6b7280', 
            cursor: 'pointer',
            padding: '4px'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '40px 24px' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: 'black', 
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>
                What would you like to build?
              </h2>
              <p style={{ 
                fontSize: '16px',
                color: '#6b7280',
                margin: 0
              }}>
                Describe the app you want to create and I'll help you build it.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {messages.map((message) => (
                <div key={message.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  {/* Avatar */}
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </div>
                  
                  {/* Message Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {message.role === 'assistant' && message.model && (
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#9ca3af', 
                        marginBottom: '8px'
                      }}>
                        {message.model}
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '15px',
                      lineHeight: '1.6',
                      color: '#000000',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.content}
                    </div>
                    
                    {/* Message Actions */}
                    {message.role === 'assistant' && (
                      <div style={{ marginTop: '12px' }}>
                        <button style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#9ca3af', 
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                            <path d="m4 16 4-4 4 4"/>
                            <path d="m16 4 4 4-4 4"/>
                          </svg>
                          Copy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280'
                  }}>
                    AI
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#9ca3af', 
                      marginBottom: '8px'
                    }}>
                      {selectedModel}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d1d5db', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out infinite both'
                      }}></div>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d1d5db', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out 0.16s infinite both'
                      }}></div>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d1d5db', 
                        borderRadius: '50%',
                        animation: 'bounce 1.4s ease-in-out 0.32s infinite both'
                      }}></div>
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
      <div style={{ 
        borderTop: '1px solid #f3f4f6', 
        backgroundColor: 'white', 
        padding: '24px'
      }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              position: 'relative', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '16px', 
              overflow: 'hidden'
            }}>
              {/* Input Field */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                padding: '16px', 
                paddingBottom: '56px'
              }}>
                <button type="button" style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: '0', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  color: '#9ca3af',
                  cursor: 'pointer'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.42 16.4a2 2 0 0 1-2.83-2.83l7.07-7.07"/>
                  </svg>
                </button>
                <textarea
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Ask me to build something or modify the current app..."
                  rows={1}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '15px',
                    outline: 'none',
                    color: '#000000',
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                  disabled={isLoading}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                />
              </div>

              {/* Bottom Bar */}
              <div style={{ 
                position: 'absolute', 
                bottom: '0', 
                left: '0', 
                right: '0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '12px 16px', 
                backgroundColor: '#f5f5f5'
              }}>
                {/* Model Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    color: '#374151' 
                  }}>
                    {selectedModel}
                  </span>
                  <button type="button" style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    borderRadius: '50%',
                    border: 'none',
                    width: '32px',
                    height: '32px',
                    cursor: (currentInput.trim() && !isLoading) ? 'pointer' : 'not-allowed',
                    opacity: (currentInput.trim() && !isLoading) ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={!currentInput.trim() || isLoading}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12 14-7-7 14-2-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
