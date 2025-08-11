import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { SocketEvents, SendMessageRequest, AIModel } from '../../../shared/types'
import { AIService } from './aiService'

const prisma = new PrismaClient()
const aiService = new AIService()

interface AuthenticatedSocket extends Socket {
  userId?: string
  user?: any
}

export function setupSocketHandlers(io: Server) {
  // Authentication middleware for socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'))
      }

      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        return next(new Error('Server configuration error'))
      }

      const decoded = jwt.verify(token, jwtSecret) as any
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true
        }
      })

      if (!user) {
        return next(new Error('Authentication error: User not found'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication error: Invalid token'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User ${socket.userId} connected via socket`)

    // Join user to their personal room
    socket.join(`user:${socket.userId}`)

    // Handle joining conversation rooms
    socket.on('join-conversation', async (conversationId: string) => {
      try {
        // Verify user has access to this conversation
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            userId: socket.userId
          }
        })

        if (!conversation) {
          socket.emit('error', {
            message: 'Conversation not found or access denied',
            code: 'CONVERSATION_ACCESS_DENIED'
          })
          return
        }

        // Join conversation room
        socket.join(`conversation:${conversationId}`)
        socket.emit('joined-conversation', { conversationId })
        
        console.log(`User ${socket.userId} joined conversation ${conversationId}`)
      } catch (error) {
        console.error('Error joining conversation:', error)
        socket.emit('error', {
          message: 'Failed to join conversation',
          code: 'JOIN_CONVERSATION_ERROR'
        })
      }
    })

    // Handle leaving conversation rooms
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`User ${socket.userId} left conversation ${conversationId}`)
    })

    // Handle sending messages
    socket.on('send-message', async (data: SendMessageRequest & { conversationId: string }) => {
      try {
        const { conversationId, content, role, model } = data

        if (!conversationId || !content || !role) {
          socket.emit('error', {
            message: 'Missing required fields',
            code: 'MISSING_FIELDS'
          })
          return
        }

        // Verify conversation access
        const conversation = await prisma.conversation.findFirst({
          where: {
            id: conversationId,
            userId: socket.userId
          }
        })

        if (!conversation) {
          socket.emit('error', {
            message: 'Conversation not found or access denied',
            code: 'CONVERSATION_ACCESS_DENIED'
          })
          return
        }

        // Save user message to database
        const userMessage = await prisma.message.create({
          data: {
            conversationId,
            content: content.trim(),
            role: 'USER',
            tokens: Math.ceil(content.length / 4) // Simple token estimation
          }
        })

        // Emit user message to conversation room
        io.to(`conversation:${conversationId}`).emit('message-received', userMessage)

        // Generate AI response
        await generateAIResponse(socket, conversationId, content, model || conversation.model)

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        })

      } catch (error) {
        console.error('Error handling send-message:', error)
        socket.emit('error', {
          message: 'Failed to send message',
          code: 'SEND_MESSAGE_ERROR'
        })
      }
    })

    // Handle typing indicators
    socket.on('typing-start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        conversationId,
        typing: true
      })
    })

    socket.on('typing-stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        conversationId,
        typing: false
      })
    })

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} disconnected: ${reason}`)
    })
  })
}

async function generateAIResponse(
  socket: AuthenticatedSocket, 
  conversationId: string, 
  userMessage: string, 
  model: AIModel
) {
  try {
    // Emit AI response start
    socket.emit('ai-response-start', conversationId)
    
    // Get conversation history for context
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: 50 // Limit context to last 50 messages
    })

    // Generate AI response using streaming
    const responseStream = aiService.generateResponse(messages, model)
    
    let fullResponse = ''
    let totalTokens = 0

    for await (const chunk of responseStream) {
      fullResponse += chunk.content
      totalTokens += chunk.tokens || 0

      // Emit chunk to client
      socket.emit('ai-response-chunk', {
        content: chunk.content,
        tokens: chunk.tokens || 0
      })
    }

    // Save AI response to database
    const aiMessage = await prisma.message.create({
      data: {
        conversationId,
        content: fullResponse,
        role: 'ASSISTANT',
        model,
        tokens: totalTokens,
        metadata: {
          finishReason: 'stop',
          model: model
        }
      }
    })

    // Emit response end
    socket.emit('ai-response-end', {
      id: aiMessage.id,
      content: fullResponse,
      model,
      tokens: totalTokens,
      finishReason: 'stop'
    })

    // Emit complete message to conversation room
    socket.to(`conversation:${conversationId}`).emit('message-received', aiMessage)

  } catch (error) {
    console.error('Error generating AI response:', error)
    socket.emit('error', {
      message: 'Failed to generate AI response',
      code: 'AI_RESPONSE_ERROR'
    })
  }
}