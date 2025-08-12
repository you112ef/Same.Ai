'use client'

import { useState, useRef, useEffect } from 'react'
import { useSocket } from '@/hooks/use-socket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react'
import { Message, AIModel, MessageRole } from '../../../../shared/types'
import { ChatMessage } from './chat-message'
import { ModelSelector } from './model-selector'
import { FileUpload } from './file-upload'

interface ChatInterfaceProps {
  conversationId?: string
  initialModel?: AIModel
  initialMessages?: Message[]
  onNewConversation?: (conversationId: string) => void
}

export function ChatInterface({ 
  conversationId, 
  initialModel = AIModel.GPT4,
  initialMessages = [],
  onNewConversation 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [currentMessage, setCurrentMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState<AIModel>(initialModel)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState('')
  const [streamingMessage, setStreamingMessage] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { socket, isConnected } = useSocket()

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingMessage])

  // Socket listeners
  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit('join-conversation', conversationId)

    const handleMessageReceived = (message: Message) => {
      setMessages(prev => [...prev, message])
      setIsLoading(false)
    }

    const handleAIResponseStart = () => {
      setStreamingMessage('')
      setIsLoading(true)
    }

    const handleAIResponseChunk = (data: { content: string }) => {
      setStreamingMessage(prev => prev + data.content)
    }

    const handleAIResponseEnd = (response: any) => {
      const aiMessage: Message = {
        id: response.id,
        conversationId: conversationId,
        content: streamingMessage,
        role: MessageRole.ASSISTANT,
        model: selectedModel,
        tokens: response.tokens,
        createdAt: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setStreamingMessage('')
      setIsLoading(false)
    }

    const handleError = (error: { message: string }) => {
      setError(error.message)
      setIsLoading(false)
    }

    socket.on('message-received', handleMessageReceived)
    socket.on('ai-response-start', handleAIResponseStart)
    socket.on('ai-response-chunk', handleAIResponseChunk)
    socket.on('ai-response-end', handleAIResponseEnd)
    socket.on('error', handleError)

    return () => {
      socket.off('message-received', handleMessageReceived)
      socket.off('ai-response-start', handleAIResponseStart)
      socket.off('ai-response-chunk', handleAIResponseChunk)
      socket.off('ai-response-end', handleAIResponseEnd)
      socket.off('error', handleError)
    }
  }, [socket, conversationId, selectedModel, streamingMessage])

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const messageContent = currentMessage.trim()
    setCurrentMessage('')
    setError('')

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      conversationId: conversationId || '',
      content: messageContent,
      role: MessageRole.USER,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      if (socket && conversationId) {
        // Send via socket for real-time response
        socket.emit('send-message', {
          content: messageContent,
          role: MessageRole.USER,
          model: selectedModel
        })
      } else {
        // Create new conversation
        // This would typically call an API to create the conversation
        // For now, we'll simulate it
        const newConversationId = 'conv_' + Date.now()
        onNewConversation?.(newConversationId)
      }
    } catch (error: any) {
      setError(error.message || 'فشل في إرسال الرسالة')
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.role === MessageRole.USER).pop()
      if (lastUserMessage) {
        setCurrentMessage(lastUserMessage.content)
        setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id))
      }
    }
  }

  const startRecording = () => {
    // Voice recording implementation would go here
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b p-4 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-2">
            <FileUpload onFileUpload={(file) => console.log('File uploaded:', file)} />
            
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="ghost" size="sm" onClick={handleRetry}>
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {messages.length === 0 && !streamingMessage && (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">مرحباً! كيف يمكنني مساعدتك؟</h3>
            <p className="text-muted-foreground">
              اكتب رسالتك أو اختر أحد الأمثلة أدناه
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6 max-w-md mx-auto">
              {[
                'اشرح لي مفهوم الذكاء الاصطناعي',
                'ساعدني في كتابة بريد إلكتروني',
                'راجع هذا الكود',
                'اقترح أفكار لمشروع جديد'
              ].map((example) => (
                <Button
                  key={example}
                  variant="ghost"
                  size="sm"
                  className="text-sm h-auto p-3 text-right"
                  onClick={() => setCurrentMessage(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Streaming message */}
        {streamingMessage && (
          <ChatMessage 
            message={{
              id: 'streaming',
              conversationId: conversationId || '',
              content: streamingMessage,
              role: MessageRole.ASSISTANT,
              model: selectedModel,
              createdAt: new Date()
            }}
            isStreaming={true}
          />
        )}

        {/* Loading indicator */}
        {isLoading && !streamingMessage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bot className="w-4 h-4" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-sm">يكتب...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-background">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="w-full resize-none border rounded-lg px-3 py-2 min-h-[2.5rem] max-h-32 focus:outline-none focus:ring-2 focus:ring-same-blue-500"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'text-red-600' : ''}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-2 text-center">
          اضغط Enter للإرسال، Shift+Enter لسطر جديد
        </div>
      </div>
    </div>
  )
}
