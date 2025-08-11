'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { SocketEvents, Message, AIResponse } from '@/shared/types'
import { getToken } from './use-auth'
import { toast } from './use-toast'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  sendMessage: (data: any) => void
  onMessageReceived: (callback: (message: Message) => void) => void
  onAIResponseStart: (callback: (conversationId: string) => void) => void
  onAIResponseChunk: (callback: (data: { content: string; tokens: number }) => void) => void
  onAIResponseEnd: (callback: (response: AIResponse) => void) => void
  onUserTyping: (callback: (data: { userId: string; conversationId: string }) => void) => void
  emitTypingStart: (conversationId: string) => void
  emitTypingStop: (conversationId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return

    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true,
    })

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socketInstance.connect()
      }
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
      
      if (error.message === 'Authentication error') {
        toast({
          title: 'خطأ في الاتصال',
          description: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
          variant: 'destructive',
        })
      }
    })

    // Handle general errors
    socketInstance.on('error', (error: { message: string; code: string }) => {
      console.error('Socket error:', error)
      toast({
        title: 'خطأ',
        description: error.message,
        variant: 'destructive',
      })
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [getToken()])

  // Join a conversation room
  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join-conversation', conversationId)
    }
  }

  // Leave a conversation room
  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave-conversation', conversationId)
    }
  }

  // Send a message
  const sendMessage = (data: any) => {
    if (socket) {
      socket.emit('send-message', data)
    }
  }

  // Event listeners
  const onMessageReceived = (callback: (message: Message) => void) => {
    if (socket) {
      socket.on('message-received', callback)
      return () => socket.off('message-received', callback)
    }
  }

  const onAIResponseStart = (callback: (conversationId: string) => void) => {
    if (socket) {
      socket.on('ai-response-start', callback)
      return () => socket.off('ai-response-start', callback)
    }
  }

  const onAIResponseChunk = (callback: (data: { content: string; tokens: number }) => void) => {
    if (socket) {
      socket.on('ai-response-chunk', callback)
      return () => socket.off('ai-response-chunk', callback)
    }
  }

  const onAIResponseEnd = (callback: (response: AIResponse) => void) => {
    if (socket) {
      socket.on('ai-response-end', callback)
      return () => socket.off('ai-response-end', callback)
    }
  }

  const onUserTyping = (callback: (data: { userId: string; conversationId: string }) => void) => {
    if (socket) {
      socket.on('user-typing', callback)
      return () => socket.off('user-typing', callback)
    }
  }

  // Typing indicators
  const emitTypingStart = (conversationId: string) => {
    if (socket) {
      socket.emit('typing-start', conversationId)
    }
  }

  const emitTypingStop = (conversationId: string) => {
    if (socket) {
      socket.emit('typing-stop', conversationId)
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        onMessageReceived,
        onAIResponseStart,
        onAIResponseChunk,
        onAIResponseEnd,
        onUserTyping,
        emitTypingStart,
        emitTypingStop,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}